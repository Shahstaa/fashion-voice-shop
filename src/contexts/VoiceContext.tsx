import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import useVoiceAgent from '@/hooks/useVoiceAgent';
import { useLanguage } from '@/hooks/useLanguage';

interface VoiceContextProps {
  isVoiceActive: boolean;
  startVoice: () => void;
  stopVoice: () => void;
  isListening: boolean;
}

export const VoiceContext = createContext<VoiceContextProps | undefined>(undefined);

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider = ({ children }: VoiceProviderProps) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { startAgent, endAgent, isActive } = useVoiceAgent();
  const { language } = useLanguage();
  const location = useLocation();

  const stopVoice = useCallback(() => {
    try {
      endAgent();
      setIsVoiceActive(false);
      setIsListening(false);
      console.log('Voice stopped');
    } catch (error) {
      console.error('Failed to stop voice:', error);
    }
  }, [endAgent]);

  const startVoice = useCallback(() => {
    try {
      const voiceLanguage = language === 'ar' ? 'ar' : 'en';
      startAgent(voiceLanguage);
      setIsVoiceActive(true);
      console.log('Voice started with language:', voiceLanguage);
    } catch (error) {
      console.error('Failed to start voice:', error);
    }
  }, [language, startAgent]);

  // Stop voice when navigating to welcome screen or refreshing
  useEffect(() => {
    if (location.pathname === '/') {
      if (isVoiceActive) {
        stopVoice();
      }
    }
  }, [location.pathname, isVoiceActive, stopVoice]);

  // Monitor voice agent status (only update isListening, do not restart agent)
  useEffect(() => {
    const checkVoiceStatus = () => {
      const voiceActive = isActive();
      setIsListening(voiceActive);
      // Do NOT restart or stop the agent here; only update isListening
    };

    const interval = setInterval(checkVoiceStatus, 200);
    return () => clearInterval(interval);
  }, [isActive]); // Remove isVoiceActive from deps to avoid unnecessary triggers

  return (
    <VoiceContext.Provider value={{
      isVoiceActive,
      startVoice,
      stopVoice,
      isListening,
    }}>
      {children}
    </VoiceContext.Provider>
  );
};
