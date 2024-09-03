/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, createContext, useState, useRef, useEffect } from 'react';
import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';

type StreamResponseType = {
    addMessage: () => void;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    message: string;
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean; // This will be used for the AI interaction loading state
    isFetchingMessages: boolean; // This will be used for fetching messages loading state
    fetchNextPage: () => void;
    hasNextPage: boolean;
    messagesData: { messages: MessageType[]; nextCursor: string | null };
};

// Create the context with default values
export const ChatContext = createContext<StreamResponseType>({
    addMessage: () => {},
    message: "",
    setMessage: () => {},
    handleInputChange: () => {},
    isLoading: false,
    isFetchingMessages: false, // Default to false
    fetchNextPage: () => {},
    hasNextPage: false,
    messagesData: { messages: [], nextCursor: null },
});

interface Props {
    chatbotId: string;
    children: ReactNode;
}

// Define the structure of a message (adjust as per your API's response)
interface MessageType {
    createAt: string;
    id: string;
    text: string;
    chatbotId: string;
    isUserMessage: boolean;
}

// Fetch messages with pagination
const fetchMessages = async ({ chatbotId, cursor, limit = 20 }: { chatbotId: string; cursor?: string; limit?: number }) => {
    const response = await fetch("http://localhost:3001/api/getmessages", {
        method: "POST",
        body: JSON.stringify({ chatbotId, cursor, limit }),
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Error fetching messages");
    }

    
    return response.json(); // Expected to return { messages: MessageType[], nextCursor: string | null }
};

// Send a new message
const sendMessageApi = async ({ chatbotId, message }: { chatbotId: string; message: string }) => {
    const response = await fetch("http://localhost:3001/api/message", {
        method: "POST",
        body: JSON.stringify({ chatbotId, message }),
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return response.body;
};

export const ChatContextProvider = ({ chatbotId, children }: Props) => {
    // Local state for the input message
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetchingMessages, setIsFetchingMessages] = useState<boolean>(false);
    const [messagesData, setMessagesData] = useState<{ messages: MessageType[], nextCursor: string | null }>({
        messages: [],
        nextCursor: null,
    });
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);

    const backupMessage = useRef<string>("");

    const fetchMessagesData = async (cursor: string | null = null) => {
        setIsFetchingMessages(true);
        try {
            const data = await fetchMessages({ chatbotId, cursor });
            setMessagesData((prev) => ({
                messages: cursor ? [...prev.messages, ...data.messages] : data.messages,
                nextCursor: data.nextCursor,
            }));
            setHasNextPage(!!data.nextCursor);
        } catch (err) {
            console.error("Error fetching messages:", err);
            toast('Error fetching messages');
        } finally {
            setIsFetchingMessages(false);
        }
    };

    

    useEffect(() => {
        if (chatbotId) {
            fetchMessagesData();
        }
    }, [chatbotId]);

    const addMessage = async () => {
        if (message.trim() === "") return;

        const newMessageObj: MessageType = {
            createAt: new Date().toISOString(),
            id: crypto.randomUUID(),
            text: message.trim(),
            chatbotId,
            isUserMessage: true,
        };

        backupMessage.current = message;
        setMessage("");
        setIsLoading(true);

        // Optimistically update the UI
        setMessagesData((prev) => ({
            ...prev,
            messages: [newMessageObj, ...prev.messages],
        }));

        try {
            const stream = await sendMessageApi({ chatbotId, message: newMessageObj.text });
            if (!stream) {
                throw new Error("No stream received");
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accResponse = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunkValue = decoder.decode(value);
                    accResponse += chunkValue;

                    // Update AI's message in the UI
                    setMessagesData((prev) => {
                        const aiMessageIndex = prev.messages.findIndex((msg) => msg.id === 'ai-response');

                        const updatedMessages = [...prev.messages];

                        if (aiMessageIndex !== -1) {
                            updatedMessages[aiMessageIndex] = {
                                ...updatedMessages[aiMessageIndex],
                                text: accResponse,
                            };
                        } else {
                            updatedMessages.unshift({
                                createAt: new Date().toISOString(),
                                id: 'ai-response',
                                text: accResponse,
                                isUserMessage: false,
                                chatbotId,
                            });
                        }

                        return {
                            ...prev,
                            messages: updatedMessages,
                        };
                    });
                }
            }
            // trigger new messages //
            await fetchMessagesData();
        } catch (err) {
            console.error("Failed to send message:", err);
            // Rollback on error
            setMessagesData((prev) => ({
                ...prev,
                messages: prev.messages.filter((msg) => msg.id !== newMessageObj.id),
            }));
            setMessage(backupMessage.current);
            toast('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const fetchNextPage = () => {
        if (hasNextPage && messagesData.nextCursor) {
            fetchMessagesData(messagesData.nextCursor);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                addMessage,
                message,
                handleInputChange,
                isLoading,
                setMessage,
                fetchNextPage,
                hasNextPage,
                messagesData,
                isFetchingMessages
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
