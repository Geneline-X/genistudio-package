/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState, useMemo, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Copy, Pen, User } from 'lucide-react';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: any;
  chatbotId: string;
  isNextMessageSamePerson: boolean;
  theme: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      chatBubbleUserColor: string;
      chatBubbleBotColor: string;
      backgroundColor: string;
      font: string;
      fontSize: string;
      fontColor?: string;
    };
  };
}

const currentTime = new Date();
const formattedTime = `${currentTime.getHours()}:${currentTime
  .getMinutes()
  .toString()
  .padStart(2, '0')}`;

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson, theme }, ref) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // Reset the copy state after 1.5 seconds
    };

    // Memoize inline styles
    const avatarStyle:React.CSSProperties = useMemo(
      () => ({
        position: 'relative',
        width: '32px',
        height: '32px',
        backgroundColor: message.isUserMessage
          ? theme.theme.chatBubbleUserColor
          : theme.theme.chatBubbleBotColor,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 5px',
        visibility: isNextMessageSamePerson ? 'hidden' : 'visible',
      }),
      [message.isUserMessage, theme.theme.chatBubbleUserColor, theme.theme.chatBubbleBotColor, isNextMessageSamePerson]
    );

    const messageContainerStyle:React.CSSProperties = useMemo(
      () => ({
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '450px',
        margin: '0 5px',
        textAlign: message.isUserMessage ? 'right' : 'left',
      }),
      [message.isUserMessage]
    );

    const bubbleStyle: React.CSSProperties = useMemo(
      () => ({
        padding: '10px 18px',
        borderRadius: '15px',
        backgroundColor: message.isUserMessage
          ? theme.theme.chatBubbleUserColor
          : theme.theme.chatBubbleBotColor,
        color: theme.theme.fontColor || '#000000',
        borderBottomLeftRadius:
          !isNextMessageSamePerson && message.isUserMessage ? '0' : undefined,
        borderBottomRightRadius:
          !isNextMessageSamePerson && !message.isUserMessage ? '0' : undefined,
      }),
      [
        message.isUserMessage,
        theme.theme.chatBubbleUserColor,
        theme.theme.chatBubbleBotColor,
        theme.theme.fontColor,
        isNextMessageSamePerson,
      ]
    );

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: message.isUserMessage ? 'flex-end' : 'flex-start',
          margin: '8px 0',
        }}
      >
        <div style={avatarStyle}>
          {message.isUserMessage ? (
            <User style={{ color: '#ffffff', height: '75%', width: '75%' }} />
          ) : (
            <Pen style={{ color: '#000000' }} />
          )}
        </div>
        <div style={messageContainerStyle}>
          <div style={bubbleStyle}>
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      style={{
                        color: theme.theme.chatBubbleBotColor,
                        textDecoration: 'underline',
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {props.children}
                    </a>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== 'loading-message' && (
              <>
                <div
                  style={{
                    fontSize: '12px',
                    color: message.isUserMessage ? '#1e90ff' : '#9e9e9e',
                    marginTop: '4px',
                    textAlign: message.isUserMessage ? 'right' : 'left',
                  }}
                >
                  {formattedTime}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: message.isUserMessage
                      ? 'flex-end'
                      : 'flex-start',
                    marginTop: '4px',
                  }}
                >
                  <CopyToClipboard
                    text={message.text as string}
                    onCopy={handleCopy}
                  >
                    <button
                      style={{
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        color: message.isUserMessage ? '#ffffff' : '#1e90ff',
                      }}
                    >
                      {isCopied ? (
                        'Copied!'
                      ) : (
                        <>
                          <Copy
                            style={{
                              marginRight: '4px',
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          Copy
                        </>
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = 'Message';

// Memoize the component to avoid unnecessary re-renders
export default memo(Message);
