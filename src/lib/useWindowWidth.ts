/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import React from 'react';

const useWindowWidth = () => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);

      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return width;
};

export default useWindowWidth;
