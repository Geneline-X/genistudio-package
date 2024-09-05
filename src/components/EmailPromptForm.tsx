import React from "react";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { isValidEmail } from "../lib/utils";
import toast from "react-simple-toasts";

interface EmailPromptFormProps {
  onEmailSubmit: (email: string) => void;
  welcomeMessage: string;
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
}

const EmailPromptForm = ({ onEmailSubmit, theme, welcomeMessage }: EmailPromptFormProps) => {
  const { email, setEmail } = useContext(ChatContext);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      onEmailSubmit(email);
    } else {
      toast("Invalid Email");
    }
  };

  return (
    <div
      className="email-prompt-form"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "16px",
        textAlign: "center",
        backgroundColor: theme.backgroundColor,
        color: theme.fontColor,
        fontFamily: theme.font,
      }}
    >
      <h2
        className="welcome-message"
        style={{
          fontSize: theme.fontSize,
          color: theme.fontColor,
          fontWeight: "600",
        }}
      >
        {welcomeMessage}
      </h2>
      <p
        className="instructions"
        style={{
          fontSize: theme.fontSize,
          color: theme.secondaryColor,
        }}
      >
        Enter your email to save your chat messages. If you skip, your messages will be lost after the session.
      </p>
      <form onSubmit={handleSubmit} className="email-form" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: `1px solid ${theme.secondaryColor}`,
            borderRadius: "4px",
            backgroundColor: theme.chatBubbleUserColor,
            color: theme.fontColor,
            fontFamily: theme.font,
          }}
        />
        <div className="submit-button-container" style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: theme.primaryColor,
              color: theme.fontColor,
              fontFamily: theme.font,
              fontSize: theme.fontSize,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailPromptForm;
