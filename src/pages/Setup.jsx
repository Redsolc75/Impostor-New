import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Play, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { I18nProvider, useTranslation } from '@/components/i18n/i18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdContainer from '@/components/AdContainer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

function SetupContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState(Array(12).fill(''));
  const [customWords, setCustomWords] = useState('');

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
    
    // Store game setup in sessionStorage
    sessionStorage.setItem('gameSetup', JSON.stringify({
      players: names.map((name, i) => ({ id: i, name })),
      playerCount,
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

        {/* Zone A: Top Banner Ad */}
        <div className="px-6">
          <AdContainer position="top" size="leaderboard" />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-12">
          <div className="max-w-md mx-auto space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">{t('setupTitle')}</h1>
            </motion.div>

            {/* Player count selector */}
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
