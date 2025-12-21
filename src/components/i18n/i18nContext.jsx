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
    // *** PARXE PER A LES PARAULES PERSONALITZADES (ARA AMB ELS 10 IDIOMES) ***
    // Afegim manualment les traduccions que falten al fitxer extern
    const missingKeys = {
      customWordsTitle: {
        en: "Play with your own words",
        es: "Juega con tus propias palabras",
        ca: "Juga amb les teves paraules",
        fr: "Jouez avec vos propres mots",
        de: "Spielen Sie mit Ihren eigenen Wörtern",
        it: "Gioca con le tue parole",
        pt: "Jogue com suas próprias palavras",
        ru: "Играйте со своими словами",
        ja: "自分の言葉で遊ぶ",
        zh: "用你自己的词玩"
      },
      customWordsPlaceholder: {
        en: "Enter words separated by commas (e.g. Car, Dog)",
        es: "Introduce palabras separadas por comas (ej. Coche, Perro)",
        ca: "Entra aquí les paraules separades per comes (exemple: Casa, Gos)",
        fr: "Entrez des mots séparés par des virgules (ex: Voiture, Chien)",
        de: "Wörter durch Kommas getrennt eingeben (z.B. Auto, Hund)",
        it: "Inserisci parole separate da virgole (es. Auto, Cane)",
        pt: "Insira palavras separadas por vírgulas (ex: Carro, Cão)",
        ru: "Введите слова через запятую (напр. Машина, Собака)",
        ja: "カンマで区切って言葉を入力 (例: 車, 犬)",
        zh: "输入用逗号分隔的词 (例如: 车, 狗)"
      },
      customWordsHelp: {
        en: "If you don't enter any words, the game will choose one randomly.",
        es: "Si no introduces ninguna palabra, el juego elegirá una aleatoriamente.",
        ca: "Si no entres cap paraula, el joc n'escollirà una aleatòriament.",
        fr: "Si vous n'entrez aucun mot, le jeu en choisira un au hasard.",
        de: "Wenn Sie keine Wörter eingeben, wählt das Spiel zufällig eines aus.",
        it: "Se non inserisci alcuna parola, il gioco ne sceglierà una a caso.",
        pt: "Se você não inserir nenhuma palavra, o jogo escolherá uma aleatoriamente.",
        ru: "Если вы не введете ни одного слова, игра выберет его случайно.",
        ja: "言葉を入力しない場合、ゲームがランダムに選択します。",
        zh: "如果你不输入任何词，游戏将随机选择一个。"
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

// Mantenim l'alias per compatibilitat amb el Setup.jsx si ho necessita
export const I18nProviderAlias = I18nProvider; 

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
