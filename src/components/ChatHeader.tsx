/* eslint-disable @typescript-eslint/no-explicit-any */
// src/ChatHeader.tsx
import React from 'react';
import { X, MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  avatar?: string;
  welcomeMessage: string;
  name: string;
  theme: any;
  setIsOpen?: (isOpen: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ theme, name, avatar, setIsOpen }) => {
  return (
    <div style={{
      backgroundColor: theme.primaryColor,
      color: theme.secondaryColor,
      padding: '16px 24px',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginRight: '16px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.secondaryColor,
        }}>
          {avatar ? (
            <img src={avatar} alt="Bot Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <MessageCircle size={24} color={theme.primaryColor} />
          )}
        </div>
        <div>
          <h2 style={{
            margin: 0,
            fontFamily: theme.font,
            fontSize: `calc(${theme.fontSize} + 2px)`,
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}>{name}</h2>
          <p style={{
            margin: '4px 0 0',
            fontSize: `calc(${theme.fontSize} - 2px)`,
            opacity: 0.8,
          }}>AI assistant</p>
        </div>
      </div>
      {setIsOpen && (
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.secondaryColor}20`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={24} color={theme.secondaryColor} />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;