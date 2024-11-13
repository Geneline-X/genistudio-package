import React, { useEffect, useState, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChatContextProvider } from './ChatContext';
import useChatbotConfig from '../lib/useChatbotConfig';
import useWindowWidth from '../lib/useWindowWidth';
import BusinessReplies from './BusinessReplies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
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
  const [activeTab, setActiveTab] = useState('chat');
  const [chatbotUserId, setChatbotUserId] = useState<string | null>(null);

  const [showEmailPrompt, setShowEmailPrompt] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config?.theme) {
      const themeConfig = config.theme;
      setTheme(themeConfig || defaultTheme);
      setOtherProps(themeConfig);
    }
  }, [config]);

  useEffect(() => {
    setChatbotUserId('dummy-user-id');
  }, []);

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

  const tabsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderBottom: `1px solid ${theme.theme.primaryColor}20`,
  };

  const tabStyle: React.CSSProperties = {
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: theme.theme.secondaryColor,
    color: theme.theme.primaryColor,
    transition: 'background-color 0.3s ease',
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: theme.theme.primaryColor,
    color: theme.theme.secondaryColor,
  };

  const tabContentStyle: React.CSSProperties = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <div style={toggleButtonStyle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '💬'} {/* Display X when open, chat bubble when closed */}
      </div>
      <div style={chatContainerStyle}>
        {isOpen && (
          <ChatContextProvider chatContainerRef={chatContainerRef} chatbotId={chatbotId}>
            <ChatHeader 
            avatar={config?.logo} 
            name={config?.name} 
            theme={theme} 
            welcomeMessage={otherProps?.widget?.welcomeMessage} 
            />
            <div style={tabsContainerStyle}>
              <div 
                style={activeTab === 'chat' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('chat')}
              >
                AI Chat
              </div>
              <div 
                style={activeTab === 'business-replies' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('business-replies')}
              >
                Business Reply
              </div>
            </div>
            <div style={tabContentStyle}>
            {activeTab === 'chat' && (
              <>
                <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto' }}> 
                  <Messages 
                  chatbotId={chatbotId} 
                  theme={theme} 
                  welcomeMessage={otherProps?.widget?.welcomeMessage}
                  onEmailSubmit={() => setShowEmailPrompt(false)}
                  showEmailPrompt={showEmailPrompt}
                  />
                </div>
                {!showEmailPrompt && <ChatInput theme={theme} />}
              </>
            )}

           {activeTab === 'business-replies' && chatbotUserId && (
              <div style={{flexGrow: 1, overflowY: 'auto'}}>
                <BusinessReplies 
                  chatbotId={chatbotId}
                  chatbotUserId={chatbotUserId}
                  theme={theme}
                />
              </div>
            )}
            </div>
          </ChatContextProvider>
        )}
      </div>
      </QueryClientProvider>
    </>
  );
};

export default ConfigurableChatbot;
