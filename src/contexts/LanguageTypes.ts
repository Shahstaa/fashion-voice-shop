import { createContext } from 'react';

// Define the structure of your translations
export interface Translations {
  [key: string]: string | Translations;
}

// Define the context type
export interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, options?: Record<string, string>) => string;
  isRTL: boolean;
  reloadTranslations: () => void;
}

// Create the context with a default value
export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
  reloadTranslations: () => {},
});
