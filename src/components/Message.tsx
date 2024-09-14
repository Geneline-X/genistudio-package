/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState, useMemo, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Copy, Pen, User, Check } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import React from 'react';

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

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson, theme }, ref) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    };

    const avatarStyle: React.CSSProperties = useMemo(
      () => ({
        position: 'relative',
        width: '36px',
        height: '36px',
        backgroundColor: message.isUserMessage
          ? theme.theme.chatBubbleUserColor
          : theme.theme.chatBubbleBotColor,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 10px',
        visibility: isNextMessageSamePerson ? 'hidden' : 'visible',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }),
      [message.isUserMessage, theme.theme.chatBubbleUserColor, theme.theme.chatBubbleBotColor, isNextMessageSamePerson]
    );

    const messageContainerStyle: React.CSSProperties = useMemo(
      () => ({
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '70%',
        margin: '4px 0',
      }),
      []
    );

    const bubbleStyle: React.CSSProperties = useMemo(
      () => ({
        padding: '12px 16px',
        borderRadius: '18px',
        backgroundColor: message.isUserMessage
          ? theme.theme.chatBubbleUserColor
          : theme.theme.chatBubbleBotColor,
        color: theme.theme.fontColor || '#000000',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        borderBottomLeftRadius: !isNextMessageSamePerson && !message.isUserMessage ? '4px' : undefined,
        borderBottomRightRadius: !isNextMessageSamePerson && message.isUserMessage ? '4px' : undefined,
      }),
      [message.isUserMessage, theme.theme.chatBubbleUserColor, theme.theme.chatBubbleBotColor, theme.theme.fontColor, isNextMessageSamePerson]
    );

    const timeStyle: React.CSSProperties = useMemo(
      () => ({
        fontSize: '11px',
        color: message.isUserMessage ? `${theme.theme.chatBubbleUserColor}99` : `${theme.theme.chatBubbleBotColor}99`,
        marginTop: '4px',
        alignSelf: message.isUserMessage ? 'flex-end' : 'flex-start',
      }),
      [message.isUserMessage, theme.theme.chatBubbleUserColor, theme.theme.chatBubbleBotColor]
    );

    const copyButtonStyle: React.CSSProperties = useMemo(
      () => ({
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        color: message.isUserMessage ? `${theme.theme.chatBubbleUserColor}CC` : `${theme.theme.chatBubbleBotColor}CC`,
        padding: '4px 8px',
        borderRadius: '12px',
        transition: 'background-color 0.2s ease',
      }),
      [message.isUserMessage, theme.theme.chatBubbleUserColor, theme.theme.chatBubbleBotColor]
    );

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: message.isUserMessage ? 'flex-end' : 'flex-start',
          margin: '12px 0',
        }}
      >
        {!message.isUserMessage && <div style={avatarStyle}>
          <Pen style={{ color: '#ffffff', height: '60%', width: '60%' }} />
        </div>}
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
                        color: theme.theme.primaryColor,
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
          </div>
          {message.id !== 'loading-message' && (
            <>
              <div style={timeStyle}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <CopyToClipboard text={message.text as string} onCopy={handleCopy}>
                <button
                  style={copyButtonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.theme.primaryColor}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {isCopied ? (
                    <>
                      <Check style={{ marginRight: '4px', width: '14px', height: '14px' }} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy style={{ marginRight: '4px', width: '14px', height: '14px' }} />
                      Copy
                    </>
                  )}
                </button>
              </CopyToClipboard>
            </>
          )}
        </div>
        {message.isUserMessage && <div style={avatarStyle}>
          <User style={{ color: '#ffffff', height: '60%', width: '60%' }} />
        </div>}
      </div>
    );
  }
);

Message.displayName = 'Message';

export default memo(Message);