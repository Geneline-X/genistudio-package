import React, { useContext } from 'react';
import { Send } from 'lucide-react';
import { ChatContext } from './ChatContext';

export interface ChatInputProps {
  theme: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      font: string;
      fontSize: string;
      fontColor?: string;
    };
  };
}

const ChatInput: React.FC<ChatInputProps> = ({ theme }) => {
  const { message, handleInputChange, addMessage, isLoading, showChatInput } = useContext(ChatContext);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: theme.theme.backgroundColor,
    borderTop: `1px solid ${theme.theme.primaryColor}20`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const inputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 50px 12px 16px',
    backgroundColor: theme.theme.secondaryColor,
    color: theme.theme.fontColor || '#000',
    border: `1px solid ${theme.theme.primaryColor}30`,
    borderRadius: '24px',
    resize: 'none',
    outline: 'none',
    fontFamily: theme.theme.font,
    fontSize: theme.theme.fontSize,
    lineHeight: '1.5',
    minHeight: '48px',
    maxHeight: '120px',
    overflow: 'auto',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    backgroundColor: theme.theme.primaryColor,
    color: theme.theme.secondaryColor,
    padding: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    opacity: isLoading || !message.trim() ? 0.7 : 1,
    pointerEvents: isLoading || !message.trim() ? 'none' : 'auto',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1)',
  };

  const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.theme.primaryColor,
    transform: 'scale(1.05)',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
  };

  const poweredByStyle: React.CSSProperties = {
    marginTop: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: `${theme.theme.primaryColor}10`,
    display: 'inline-block',
    textAlign: 'center',
  };

  const poweredByTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme.theme.primaryColor,
    fontFamily: theme.theme.font,
    fontWeight: 500,
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      {showChatInput && (
        <div style={inputWrapperStyle}>
          <textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={textareaStyle}
            rows={1}
            disabled={isLoading}
          />
          <button 
            onClick={addMessage} 
            style={buttonStyle} 
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            disabled={isLoading || !message.trim()}
            title="Send message"
          >
            <Send size={22} />
          </button>
        </div>
      )}

      <a href="https://geneline-x.net" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <div style={poweredByStyle}>
          <p style={poweredByTextStyle}>
            Powered by <span style={{ fontWeight: 700 }}>Geneline-X</span>
          </p>
        </div>
      </a>
    </div>
  );
};

export default ChatInput;