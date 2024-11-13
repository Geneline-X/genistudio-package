/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import React from 'react';
const useChatbotConfig = (chatbotId: string) => {
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`https://genistud.io/api/getbrand`,{
            method: "POST",
            body: JSON.stringify({chatbotId})
        });
        const data = await response.json();
        console.log(data)
        setConfig(data);
      } catch (error) {
        setError('Failed to fetch chatbot configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [chatbotId]);

  return { config, isLoading, error };
};

export default useChatbotConfig;
