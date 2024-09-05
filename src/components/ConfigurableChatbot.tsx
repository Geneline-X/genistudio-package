import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChatContextProvider } from './ChatContext';
import useChatbotConfig from '../lib/useChatbotConfig';
import useWindowWidth from '../lib/useWindowWidth';

interface ConfigurableChatbotProps {
  chatbotId: string;
  apiKey: string; // Adding apiKey as a prop
}

const defaultTheme = {theme: {
  primaryColor: '#007BFF',
  secondaryColor: '#FFFFFF',
  chatBubbleUserColor: '#E0E0E0',
  chatBubbleBotColor: '#007BFF',
  backgroundColor: '#F0F0F0',
  font: 'Arial',
  fontSize: '14px',
}};

const ConfigurableChatbot: React.FC<ConfigurableChatbotProps> = ({ chatbotId }) => {
  const { config, } = useChatbotConfig(chatbotId);
  const [theme, setTheme] = useState(defaultTheme);
  const [otherProps, setOtherProps] = useState({ widget: { welcomeMessage: '' } });
  const [isOpen, setIsOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;
  
  useEffect(() => {
    if (config?.theme) {
      const themeConfig = config.theme;
      setTheme(themeConfig || defaultTheme);
      setOtherProps(themeConfig);
    }
  }, [config]);

 
  const chatContainerStyle: React.CSSProperties = {
    backgroundColor: theme.theme.backgroundColor,
    fontFamily: theme.theme.font,
    fontSize: theme.theme.fontSize,
    width: isMobile ? '300px' : '600px',
    height: isOpen ? '480px' : '0px',
    border:isOpen ? `1px solid ${theme.theme.primaryColor}` : 'none',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'fixed',
    bottom: '60px',
    right: '20px',
    transition: 'height 0.3s ease-in-out',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: theme.theme.primaryColor,
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1001,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <>
      <div style={toggleButtonStyle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '💬'} {/* Display X when open, chat bubble when closed */}
      </div>
      <div style={chatContainerStyle}>
        {isOpen && (
          <ChatContextProvider chatbotId={chatbotId}>
            <ChatHeader avatar={config?.logo} name={config?.name} theme={theme} welcomeMessage={otherProps?.widget?.welcomeMessage} />
            <div style={{ flex: 1, overflowY: 'auto' }}> {/* Ensure Messages scrolls */}
              <Messages chatbotId={chatbotId} theme={theme} welcomeMessage={otherProps?.widget?.welcomeMessage}/>
            </div>
            <ChatInput theme={theme} />
          </ChatContextProvider>
        )}
      </div>
    </>
  );
};

export default ConfigurableChatbot;
