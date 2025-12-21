import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const I18nContext = createContext();

const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Check if detected language is supported
  if (['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh'].includes(langCode)) {
    return langCode;
  }
  
  // Default fallback to Spanish
  return 'es';
};

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('impostor-language');
    if (saved && ['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh'].includes(saved)) {
      return saved;
    }
    // Auto-detect from browser
    return detectBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem('impostor-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, options = {}) => {
    const keys = key.split('.');
    let value = translations[language]?.translation;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      // Fallback to English
      value = translations['en']?.translation;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    if (!value) return key;
    
    // Handle interpolation like {{number}}
    let result = value;
    Object.entries(options).forEach(([optKey, optValue]) => {
      result = result.replace(new RegExp(`{{${optKey}}}`, 'g'), optValue);
    });
    
    return result;
  };

  const changeLanguage = (lang) => {
    if (['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh'].includes(lang)) {
      setLanguage(lang);
    }
  };

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};