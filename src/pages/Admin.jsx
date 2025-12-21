import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Loader2, Languages, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { I18nProvider, useTranslation } from '@/components/i18n/i18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  CatalanFlag, SpanishFlag, EnglishFlag, FrenchFlag, 
  GermanFlag, ItalianFlag, PortugueseFlag, RussianFlag, 
  JapaneseFlag, ChineseFlag 
} from '@/components/FlagIcons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

function AdminContent() {
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();
  
  const [newWord, setNewWord] = useState('');
  const [wordLanguage, setWordLanguage] = useState(language);
  const [filterLanguage, setFilterLanguage] = useState('all');

  const { data: words = [], isLoading } = useQuery({
    queryKey: ['gameWords'],
    queryFn: () => base44.entities.GameWord.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (wordData) => base44.entities.GameWord.create(wordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameWords'] });
      setNewWord('');
      toast.success(t('wordAdded'));
    },
    onError: (error) => {
      toast.error('Error adding word');
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GameWord.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameWords'] });
    },
    onError: (error) => {
      toast.error('Error deleting word');
      console.error(error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    
    createMutation.mutate({
      word: newWord.trim(),
      language: wordLanguage
    });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const filteredWords = filterLanguage === 'all' 
    ? words 
    : words.filter(w => w.language === filterLanguage);

  const languageLabels = {
    en: { name: t('langEn'), FlagComponent: EnglishFlag },
    es: { name: t('langEs'), FlagComponent: SpanishFlag },
    ca: { name: t('langCa'), FlagComponent: CatalanFlag },
    fr: { name: t('langFr'), FlagComponent: FrenchFlag },
    de: { name: t('langDe'), FlagComponent: GermanFlag },
    it: { name: t('langIt'), FlagComponent: ItalianFlag },
    pt: { name: t('langPt'), FlagComponent: PortugueseFlag },
    ru: { name: t('langRu'), FlagComponent: RussianFlag },
    ja: { name: t('langJa'), FlagComponent: JapaneseFlag },
    zh: { name: t('langZh'), FlagComponent: ChineseFlag }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{t('back')}</span>
            </motion.button>
          </Link>
          <LanguageSwitcher />
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 pb-12">
          <div className="max-w-lg mx-auto space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <Languages className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">{t('adminTitle')}</h1>
            </motion.div>

            {/* Add word form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4"
            >
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">{t('wordLabel')}</label>
                <Input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder={t('wordPlaceholder')}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">{t('languageLabel')}</label>
                <Select value={wordLanguage} onValueChange={setWordLanguage}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 max-h-[300px]">
                    <SelectItem value="en" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><EnglishFlag className="w-4 h-4" />{t('langEn')}</span>
                    </SelectItem>
                    <SelectItem value="es" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><SpanishFlag className="w-4 h-4" />{t('langEs')}</span>
                    </SelectItem>
                    <SelectItem value="ca" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><CatalanFlag className="w-4 h-4" />{t('langCa')}</span>
                    </SelectItem>
                    <SelectItem value="fr" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><FrenchFlag className="w-4 h-4" />{t('langFr')}</span>
                    </SelectItem>
                    <SelectItem value="de" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><GermanFlag className="w-4 h-4" />{t('langDe')}</span>
                    </SelectItem>
                    <SelectItem value="it" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><ItalianFlag className="w-4 h-4" />{t('langIt')}</span>
                    </SelectItem>
                    <SelectItem value="pt" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><PortugueseFlag className="w-4 h-4" />{t('langPt')}</span>
                    </SelectItem>
                    <SelectItem value="ru" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><RussianFlag className="w-4 h-4" />{t('langRu')}</span>
                    </SelectItem>
                    <SelectItem value="ja" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><JapaneseFlag className="w-4 h-4" />{t('langJa')}</span>
                    </SelectItem>
                    <SelectItem value="zh" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><ChineseFlag className="w-4 h-4" />{t('langZh')}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={createMutation.isPending || !newWord.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    {t('addWord')}
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Existing words */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{t('existingWords')}</h3>
                
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white h-10 rounded-xl">
                    <Globe className="w-4 h-4 mr-2 text-white/60" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 max-h-[300px]">
                    <SelectItem value="all" className="text-white hover:bg-white/10">All</SelectItem>
                    <SelectItem value="en" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><EnglishFlag className="w-4 h-4" /> EN</span>
                    </SelectItem>
                    <SelectItem value="es" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><SpanishFlag className="w-4 h-4" /> ES</span>
                    </SelectItem>
                    <SelectItem value="ca" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><CatalanFlag className="w-4 h-4" /> CA</span>
                    </SelectItem>
                    <SelectItem value="fr" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><FrenchFlag className="w-4 h-4" /> FR</span>
                    </SelectItem>
                    <SelectItem value="de" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><GermanFlag className="w-4 h-4" /> DE</span>
                    </SelectItem>
                    <SelectItem value="it" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><ItalianFlag className="w-4 h-4" /> IT</span>
                    </SelectItem>
                    <SelectItem value="pt" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><PortugueseFlag className="w-4 h-4" /> PT</span>
                    </SelectItem>
                    <SelectItem value="ru" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><RussianFlag className="w-4 h-4" /> RU</span>
                    </SelectItem>
                    <SelectItem value="ja" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><JapaneseFlag className="w-4 h-4" /> JA</span>
                    </SelectItem>
                    <SelectItem value="zh" className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2"><ChineseFlag className="w-4 h-4" /> ZH</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : filteredWords.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Languages className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t('noWords')}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {filteredWords.map((word, index) => (
                      <motion.div
                        key={word.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                            {(() => {
                              const FlagComponent = languageLabels[word.language]?.FlagComponent;
                              return FlagComponent ? (
                                <FlagComponent className="w-full h-full" />
                              ) : (
                                <Globe className="w-full h-full text-white/40 p-0.5" />
                              );
                            })()}
                          </div>
                          <span className="text-white font-medium">{word.word}</span>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(word.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default function Admin() {
  return (
    <I18nProvider>
      <AdminContent />
    </I18nProvider>
  );
}