import React, { useContext } from 'react';
import { Send } from 'lucide-react';
import { ChatContext } from './ChatContext';
import { isValidEmail } from '../lib/utils';

export interface ChatInputProps {
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

const ChatInput: React.FC<ChatInputProps> = ({ theme }) => {
  const { message, handleInputChange, addMessage, isLoading,email } = useContext(ChatContext);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: theme.theme.backgroundColor,
    borderTop: `1px solid ${theme.theme.primaryColor}`,
    marginTop: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '768px', // corresponds to the max-w-3xl in Tailwind
    gap: '8px',
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px',
    backgroundColor: 'transparent',
    color: theme.theme.fontColor || '#000',
    border: `1px solid ${theme.theme.primaryColor}`,
    borderRadius: '8px',
    resize: 'none',
    outline: 'none',
    fontFamily: theme.theme.font,
    fontSize: theme.theme.fontSize,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.theme.primaryColor,
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',
    opacity: isLoading ? 0.5 : 1,
    pointerEvents: isLoading ? 'none' : 'auto',
  };

  const footerTextStyle: React.CSSProperties = {
    marginTop: '8px',
    fontSize: '12px',
    color: theme.theme.fontColor || '#888',
    fontFamily: theme.theme.font,
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <textarea
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={textareaStyle}
          rows={3}
          disabled={!isValidEmail(email) || isLoading}
        />
        <button onClick={addMessage} style={buttonStyle} disabled={isLoading}>
          <Send size={20} />
        </button>
      </div>
      <p style={footerTextStyle}>
        Powered by <strong>Geneline-X</strong>
      </p>
    </div>
  );
};

export default ChatInput;
