import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const I18nContext = createContext();

const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  if (['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh'].includes(langCode)) {
    return langCode;
  }
  return 'es';
};

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('impostor-language');
    if (saved && ['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh'].includes(saved)) {
      return saved;
    }
    return detectBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem('impostor-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, options = {}) => {
    // *** PARXE PER A LES PARAULES PERSONALITZADES ***
    // Afegim aquí les traduccions que falten perquè no hagis de tocar el fitxer extern
    const missingKeys = {
      customWordsTitle: {
        en: "Play with your own words",
        es: "Juega con tus propias palabras",
        ca: "Juga amb les teves paraules"
      },
      customWordsPlaceholder: {
        en: "Enter words separated by commas (e.g. Car, Dog)",
        es: "Introduce palabras separadas por comas (ej. Coche, Perro)",
        ca: "Entra aquí les paraules separades per comes (exemple: Casa, Gos)"
      },
      customWordsHelp: {
        en: "If you don't enter any words, the game will choose one randomly.",
        es: "Si no introduces ninguna palabra, el juego elegirá una aleatoriamente.",
        ca: "Si no entres cap paraula, el joc n'escollirà una aleatòriament."
      }
    };

    // Si la clau és una de les noves, retornem directament la traducció d'aquí
    if (missingKeys[key]) {
      return missingKeys[key][language] || missingKeys[key]['en'];
    }
    // *** FI DEL PARXE ***

    const keys = key.split('.');
    let value = translations[language]?.translation;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      value = translations['en']?.translation;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    if (!value) return key;
    
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

// També afegim això per compatibilitat amb Setup.jsx si ho necessita
export const I18nProviderAlias = I18nProvider; 

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
