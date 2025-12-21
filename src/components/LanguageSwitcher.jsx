import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from './i18n/i18nContext';
import { 
  CatalanFlag, SpanishFlag, EnglishFlag, FrenchFlag, 
  GermanFlag, ItalianFlag, PortugueseFlag, RussianFlag, 
  JapaneseFlag, ChineseFlag 
} from './FlagIcons';

const languages = [
  { code: 'en', name: 'English', FlagComponent: EnglishFlag },
  { code: 'es', name: 'Español', FlagComponent: SpanishFlag },
  { code: 'ca', name: 'Català', FlagComponent: CatalanFlag },
  { code: 'fr', name: 'Français', FlagComponent: FrenchFlag },
  { code: 'de', name: 'Deutsch', FlagComponent: GermanFlag },
  { code: 'it', name: 'Italiano', FlagComponent: ItalianFlag },
  { code: 'pt', name: 'Português', FlagComponent: PortugueseFlag },
  { code: 'ru', name: 'Русский', FlagComponent: RussianFlag },
  { code: 'ja', name: '日本語', FlagComponent: JapaneseFlag },
  { code: 'zh', name: '中文', FlagComponent: ChineseFlag }
];

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === language) || languages[1];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
      >
        <div className="w-6 h-6 rounded overflow-hidden ring-1 ring-white/20">
          <currentLang.FlagComponent className="w-full h-full" />
        </div>
        <span className="text-white/80 text-sm font-medium hidden sm:block">{currentLang.name}</span>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 z-50 w-[200px] max-h-[400px] rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-y-auto custom-scrollbar"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    language === lang.code 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                    <lang.FlagComponent className="w-full h-full" />
                  </div>
                  <span className="font-medium text-sm">{lang.name}</span>
                  {language === lang.code && (
                    <motion.div
                      layoutId="activeLang"
                      className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}