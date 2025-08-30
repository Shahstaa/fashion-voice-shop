import { Storage } from '@/lib/storage';

// Helper to generate translation keys
export const generateTranslationKey = (prefix: string, name: string): string => {
  return `${prefix}.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`;
};

// Helper to add dynamic translations
export const addDynamicTranslation = (key: string, enText: string, arText: string) => {
  try {
    // Get existing translations from cookies
    const translations = Storage.get<{ en: Record<string, string>, ar: Record<string, string> }>('dynamic_translations') || { en: {}, ar: {} };
    
    // Add new translations
    translations.en[key] = enText;
    translations.ar[key] = arText;
    
    // Save back to cookies
    Storage.set('dynamic_translations', translations);
    
    return key;
  } catch (error) {
    console.error('Error adding dynamic translation:', error);
    return key;
  }
};

// Helper to get dynamic translation
export const getDynamicTranslation = (key: string, language: 'en' | 'ar'): string => {
  try {
    const translations = Storage.get<{ en: Record<string, string>, ar: Record<string, string> }>('dynamic_translations') || { en: {}, ar: {} };
    
    return translations[language][key] || key;
  } catch (error) {
    console.error('Error getting dynamic translation:', error);
    return key;
  }
};

// Helper to load all dynamic translations into i18n
export const loadDynamicTranslations = () => {
  try {
    return Storage.get<{ en: Record<string, string>, ar: Record<string, string> }>('dynamic_translations') || { en: {}, ar: {} };
  } catch (error) {
    console.error('Error loading dynamic translations:', error);
    return { en: {}, ar: {} };
  }
};

// Helper to format numbers for Arabic
export const formatNumberForLanguage = (number: number, language: 'en' | 'ar'): string => {
  if (language === 'ar') {
    // Convert to Arabic numerals
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
  }
  return number.toString();
};

// Helper to format currency for Arabic
export const formatCurrencyForLanguage = (price: number, language: 'en' | 'ar'): string => {
  if (language === 'ar') {
    const arabicPrice = formatNumberForLanguage(price, 'ar');
    return `${arabicPrice} ريال`;
  }
  return `$${price}`;
};
