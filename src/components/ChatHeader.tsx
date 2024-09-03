/* eslint-disable @typescript-eslint/no-explicit-any */
// src/ChatHeader.tsx
import React from 'react';

interface ChatHeaderProps {
  avatar?: string;
  welcomeMessage: string;
  name:string;
  theme: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ theme, name, avatar }) => {
  return (
    <div style={{
      backgroundColor: theme.primaryColor,
      color: theme.secondaryColor,
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {avatar && <img src={avatar} alt="Bot Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' }} />}
        <h2 style={{
          margin: 0,
          fontFamily: theme.font,
          fontSize: theme.fontSize,
          fontWeight: 'bold'
        }}>{name}</h2>
      </div>
    </div>
  );
};

export default ChatHeader;
