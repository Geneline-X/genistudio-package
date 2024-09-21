/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState, CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Copy, Check } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import { Icons } from './Icons';
import React from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageProps {
  message: any;
  chatbotId: string;
  isNextMessageSamePerson: boolean;
  theme: {theme: {
    primaryColor: string;
    secondaryColor: string;
    chatBubbleUserColor: string;
    chatBubbleBotColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  }};
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson, theme }, ref) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const handleCopy = () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    };

    const containerStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'flex-end',
      marginBottom: '16px',
      justifyContent: message.isUserMessage ? 'flex-end' : 'flex-start',
    };

    const avatarStyle: CSSProperties = {
      position: 'relative',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: message.isUserMessage ? theme.theme.primaryColor : theme.theme.secondaryColor,
      visibility: isNextMessageSamePerson ? 'hidden' : 'visible',
      order: message.isUserMessage ? 2 : 1,
    };

    const messageContainerStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '70%',
      margin: '0 8px',
      order: message.isUserMessage ? 1 : 2,
    };

    const bubbleStyle: CSSProperties = {
      padding: '16px',
      backgroundColor: message.isUserMessage ? theme.theme.chatBubbleUserColor : theme.theme.chatBubbleBotColor,
      color: message.isUserMessage ? theme.theme.chatBubbleBotColor : theme.theme.chatBubbleUserColor,
      borderRadius: '12px',
      boxShadow: message.isUserMessage 
        ? '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
        : '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
      borderBottomRightRadius: !isNextMessageSamePerson && message.isUserMessage ? '4px' : '12px',
      borderBottomLeftRadius: !isNextMessageSamePerson && !message.isUserMessage ? '4px' : '12px',
      transition: 'all 0.3s ease',
    };


    const metaContainerStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px',
    };

    const timeStyle: CSSProperties = {
      fontSize: '12px',
      opacity: 0.7,
      color: message.isUserMessage ? theme.theme.chatBubbleBotColor : theme.theme.fontColor || '#000000',
    };

    const copyButtonStyle: CSSProperties = {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 8px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      opacity: 0.7,
      transition: 'opacity 0.2s',
      color: message.isUserMessage ? theme.theme.chatBubbleUserColor : theme.theme.fontColor || '#000000',
    };

    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

    return (
      <div ref={ref} style={containerStyle}>
        <div style={avatarStyle}>
          {message.isUserMessage ? (
            <Icons.user style={{ width: '20px', height: '20px', fill: theme.theme.secondaryColor, color: theme.theme.secondaryColor }} />
          ) : (
            <Icons.logo style={{ width: '20px', height: '20px', fill: theme.theme.primaryColor, color: theme.theme.primaryColor }} />
          )}
        </div>
        <div style={messageContainerStyle}>
          <div style={bubbleStyle}>
            
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  //@ts-ignore
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    )
                  },
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      style={{ color: message.isUserMessage ? '#FFFFFF' : theme.theme.primaryColor, textDecoration: 'underline' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
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
            <div style={metaContainerStyle}>
              <span style={timeStyle}>{formattedTime}</span>
              <CopyToClipboard text={message.text as string} onCopy={handleCopy}>
                <button 
                  style={copyButtonStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  {isCopied ? (
                    <>
                      <Check style={{ marginRight: '4px', width: '12px', height: '12px' }} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy style={{ marginRight: '4px', width: '12px', height: '12px' }} />
                      Copy
                    </>
                  )}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Message.displayName = 'Message';

export default Message;