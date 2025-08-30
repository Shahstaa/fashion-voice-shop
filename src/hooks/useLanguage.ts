import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageTypes';

export const useLanguage = () => useContext(LanguageContext);
