/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import Message from './Message';
import { ChatContext } from './ChatContext';
import { useIntersection } from '@mantine/hooks';

interface MessagesProps {
  chatbotId: string;
  theme: { theme: {
    primaryColor: string;
    secondaryColor: string;
    chatBubbleUserColor: string;
    chatBubbleBotColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  }};
  infiniteQueryLimit?: number; // Optional: Limit for pagination
}

const Messages: React.FC<MessagesProps> = ({ 
  chatbotId, 
  theme,  
}) => {
  const {
    isLoading: isAiThinking,
    isFetchingMessages,
    fetchNextPage,
    hasNextPage,
    messagesData,
  } = useContext(ChatContext);

  const messages = messagesData?.messages || [];

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text:  (
      <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          height: '16px',
          width: '16px',
          border: '2px solid #e0e0e0',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...messages,
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingMessages) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingMessages]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '12px',
        padding: '16px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 4rem - 6rem)',
        backgroundColor: theme.theme.backgroundColor,
        fontFamily: theme.theme.font,
        fontSize: theme.theme.fontSize,
        color: theme.theme.fontColor || theme.theme.primaryColor,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }}
    >
      {combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson = combinedMessages[i - 1]?.isUserMessage === combinedMessages[i]?.isUserMessage;
          return (
            <Message
              ref={i === combinedMessages.length - 1 ? ref : undefined}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={message.id}
              theme={theme}
              chatbotId={chatbotId}
            />
          );
        })
      ) : isFetchingMessages ? (
        <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton count={10} style={{ backgroundColor: '#e0e0e0' }} />
        </div>
      ) : (
        <div style={{ margin: 'auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', padding: '16px', textAlign: 'center' }}>
          <MessageSquare style={{ height: '40px', width: '40px', color: '#9e9e9e' }} />
          <span style={{ fontSize: '14px', color: '#9e9e9e' }}>How Can I Help You</span>
        </div>
      )}
    </div>
  );
};

export default Messages;
