import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Home, MessageCircle, Loader2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { I18nProvider, useTranslation } from '@/components/i18n/i18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PlayerReveal from '@/components/PlayerReveal';
import Timer from '@/components/Timer';
import AdContainer from '@/components/AdContainer';
import { fallbackWords } from '@/components/i18n/translations';
import { toast } from 'sonner';

function GameContent() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  
  const [gamePhase, setGamePhase] = useState('loading'); // loading, reveal, discussion
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [secretWord, setSecretWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estat per guardar qui comença
  const [startingPlayer, setStartingPlayer] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    
    const setupData = sessionStorage.getItem('gameSetup');
    if (!setupData) {
      navigate(createPageUrl('Setup'));
      return;
    }
    
    const { players: gamePlayers, customWords } = JSON.parse(setupData);
    setPlayers(gamePlayers);
    
    const randomImpostor = Math.floor(Math.random() * gamePlayers.length);
    setImpostorIndex(randomImpostor);
    
    if (customWords && customWords.length > 0) {
      const randomWord = customWords[Math.floor(Math.random() * customWords.length)];
      setSecretWord(randomWord);
    } else {
      await fetchRandomWord();
    }
    
    setCurrentPlayerIndex(0);
    setGamePhase('reveal');
    setIsLoading(false);
  };

  const fetchRandomWord = async () => {
    try {
      const words = await base44.entities.GameWord.filter({ language });
      
      if (words && words.length > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setSecretWord(randomWord.word);
      } else {
        const fallback = fallbackWords[language] || fallbackWords.es;
        const randomFallback = fallback[Math.floor(Math.random() * fallback.length)];
        setSecretWord(randomFallback);
        toast.info(t('usingFallback'));
      }
    } catch (error) {
      console.error('Error fetching word:', error);
      const fallback = fallbackWords[language] || fallbackWords.es;
      const randomFallback = fallback[Math.floor(Math.random() * fallback.length)];
      setSecretWord(randomFallback);
    }
  };

  const handlePlayerRevealComplete = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setGamePhase('allRevealed');
    }
  };

  const startDiscussion = () => {
    // Triar un jugador aleatori per començar
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const selectedPlayer = players[randomIndex];
      const playerName = selectedPlayer.name || selectedPlayer; 
      setStartingPlayer(playerName);
    }
    setGamePhase('discussion');
  };

  const handleRestart = async () => {
    setIsLoading(true);
    setCurrentPlayerIndex(0);
    setStartingPlayer(null);
    
    const randomImpostor = Math.floor(Math.random() * players.length);
    setImpostorIndex(randomImpostor);
    
    await fetchRandomWord();
    
    setGamePhase('reveal');
    setIsLoading(false);
  };

  const handleEndGame = () => {
    sessionStorage.removeItem('gameSetup');
    navigate(createPageUrl('Home'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6 flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 hover:bg-white/10 transition-all"
            >
              <Home className="w-5 h-5" />
            </motion.button>
          </Link>
          <LanguageSwitcher />
        </header>

        <main className="flex-1 p-6 pb-12">
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {/* Player Reveal Phase */}
              {gamePhase === 'reveal' && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex justify-center gap-2 mb-8">
                    {players.map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          index < currentPlayerIndex 
                            ? 'bg-green-500' 
                            : index === currentPlayerIndex 
                              ? 'bg-cyan
