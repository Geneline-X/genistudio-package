import React, { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { isValidEmail } from "../lib/utils";
import toast from "react-simple-toasts";

interface EmailPromptFormProps {
  onEmailSubmit: (email: string) => void;
  welcomeMessage: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  };
}

const EmailPromptForm = ({ onEmailSubmit, theme, welcomeMessage }: EmailPromptFormProps) => {
  const { email, setEmail,setShowChatInput } = useContext(ChatContext);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      onEmailSubmit(email);
      setShowChatInput(true)
    } else {
      toast("Invalid Email");
    }
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '360px',
    margin: '1.5rem auto',
    backgroundColor: theme.backgroundColor,
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const cardHeaderStyle: React.CSSProperties = {
    padding: '1.25rem 1.5rem',
    backgroundColor: theme.primaryColor,
  };

  const cardTitleStyle: React.CSSProperties = {
    margin: 0,
    color: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: '1.5rem',
    fontWeight: 700,
  };

  const cardDescriptionStyle: React.CSSProperties = {
    margin: '0.5rem 0 0',
    color: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: '0.95rem',
    opacity: 0.9,
    lineHeight: 1.4,
  };

  const cardContentStyle: React.CSSProperties = {
    padding: '1.5rem',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  };

  const inputStyle: React.CSSProperties = {
   width: 'calc(100% - 2rem)',
    padding: '0.75rem 1rem',
    border: `2px solid ${theme.secondaryColor}`,
    borderRadius: '8px',
    fontFamily: theme.font,
    fontSize: '1rem',
    color: theme.fontColor,
    backgroundColor: theme.backgroundColor,
    transition: 'border-color 0.3s ease',
    outline: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: theme.primaryColor,
    color: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <h2 style={cardTitleStyle}>Welcome!</h2>
        <p style={cardDescriptionStyle}>{welcomeMessage}</p>
      </div>
      <div style={cardContentStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailPromptForm;