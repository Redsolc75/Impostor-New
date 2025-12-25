import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowLeft, Play, Minus, Plus, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { I18nProvider, useTranslation } from '@/components/i18n/i18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdContainer from '@/components/AdContainer';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

function SetupContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(4);
  const [impostorCount, setImpostorCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(Array(12).fill(''));
  const [customWords, setCustomWords] = useState('');

  // Si baixem de 8 jugadors, forcem a 1 impostor automàticament
  useEffect(() => {
    if (playerCount < 8) {
      setImpostorCount(1);
    }
  }, [playerCount]);

  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const names = playerNames.slice(0, playerCount).map((name, i) => 
      name.trim() || `${t('playerPlaceholder', { number: i + 1 })}`
    );
    
    // Parse custom words if provided
    const wordsArray = customWords.trim() 
      ? customWords.split(',').map(w => w.trim()).filter(w => w.length > 0)
      : [];
    
    // Guardem la configuració (inclosos els impostors)
    sessionStorage.setItem('gameSetup', JSON.stringify({
      players: names.map((name, i) => ({ id: i, name })),
      playerCount,
      impostorCount,
      customWords: wordsArray
    }));
    
    navigate(createPageUrl('Game'));
  };

  const canStart = playerCount >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col pb-20">
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

        <div className="px-6">
          <AdContainer position="top" size="leaderboard" />
        </div>

        <main className="flex-1 p-6 pb-12">
          <div className="max-w-md mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">{t('setupTitle')}</h1>
            </motion.div>

            {/* Selector de Jugadors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-white font-medium">{t('playerCount')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPlayerCount(Math.max(3, playerCount - 1))}
                    disabled={playerCount <= 3}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-30"
                  >
                    <Minus className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.span
                    key={playerCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-white w-12 text-center"
                  >
                    {playerCount}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPlayerCount(Math.min(12, playerCount + 1))}
                    disabled={playerCount >= 12}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-30"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
              
              <Slider
                value={[playerCount]}
                onValueChange={(value) => setPlayerCount(value[0])}
                min={3}
                max={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-white/40 text-sm">
                <span>3</span>
                <span>{playerCount} {t('players')}</span>
                <span>12</span>
              </div>
            </motion.div>

            {/* Selector d'Impostors (Només visible si >= 8 jugadors) */}
            <AnimatePresence>
              {playerCount >= 8 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-red-400" />
                      </div>
                      <span className="text-white font-medium">{t('impostorConfig')}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setImpostorCount(1)}
                        className={`py-3 px-4 rounded-xl border transition-all ${
                          impostorCount === 1 
                            ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {t('oneImpostor')}
                      </button>
                      <button
                        onClick={() => setImpostorCount(2)}
                        className={`py-3 px-4 rounded-xl border transition-all ${
                          impostorCount === 2
                            ? 'bg-purple-500/20 border-purple-500 text-white' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {t('twoImpostors')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom words section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4"
            >
              <h3 className="text-white font-medium">{t('customWordsTitle')}</h3>
              <Input
                placeholder={t('customWordsPlaceholder')}
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 rounded-xl"
              />
              <p className="text-white/50 text-sm">{t('customWordsHelp')}</p>
            </motion.div>

            {/* Player names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-white/80 font-medium px-1">{t('playerNames')}</h3>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: playerCount }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Input
                      placeholder={t('playerPlaceholder', { number: index + 1 })}
                      value={playerNames[index]}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 rounded-xl"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Start button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                disabled={!canStart}
                className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <span className="relative flex items-center justify-center gap-3">
                  <Play className="w-6 h-6" />
                  {t('startGame')}
                </span>
              </motion.button>
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

export default function Setup() {
  return (
    <I18nProvider>
      <SetupContent />
    </I18nProvider>
  );
}
