import React, { useState, useEffect, useRef } from 'react';
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
  
  const [gamePhase, setGamePhase] = useState('loading');
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [impostorIndices, setImpostorIndices] = useState([]);
  const [secretWord, setSecretWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState(null);

  // Utilitzem useRef per tenir accés a l'estat més recent dins de funcions asíncrones
  const impostorIndicesRef = useRef(impostorIndices);
  
  useEffect(() => {
    impostorIndicesRef.current = impostorIndices;
  }, [impostorIndices]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    
    // --- RESET INICIAL ---
    // Quan venim del Setup, netegem l'historial i posem el comptador a 1
    sessionStorage.removeItem('lastImpostorIndices');
    sessionStorage.setItem('gamesPlayedCount', '1');
    console.log("Iniciant sessió de joc. Partida 1.");
    // ---------------------

    const setupData = sessionStorage.getItem('gameSetup');
    if (!setupData) {
      navigate(createPageUrl('Setup'));
      return;
    }
    
    const { players: gamePlayers, customWords, impostorCount } = JSON.parse(setupData);
    setPlayers(gamePlayers);
    
    // Selecció inicial (pur atzar, ja que és la primera ronda)
    const count = impostorCount || 1;
    const newImpostors = [];
    while(newImpostors.length < count && newImpostors.length < gamePlayers.length) {
      const r = Math.floor(Math.random() * gamePlayers.length);
      if(!newImpostors.includes(r)) newImpostors.push(r);
    }
    
    setImpostorIndices(newImpostors);
    
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
    if (players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const selectedPlayer = players[randomIndex];
      const playerName = selectedPlayer.name || selectedPlayer; 
      setStartingPlayer(playerName);
    }
    setGamePhase('discussion');
  };

  // --- LÒGICA CENTRAL DE RESTART AMB LA REGLA DE 5 PARTIDES ---
  const handleRestart = async () => {
    setIsLoading(true);
    
    // 1. Guardem els impostors actuals abans de canviar res
    const currentImpostors = impostorIndicesRef.current;
    sessionStorage.setItem('lastImpostorIndices', JSON.stringify(currentImpostors));

    // 2. GESTIÓ DEL COMPTADOR DE PARTIDES
    let gamesPlayedCount = parseInt(sessionStorage.getItem('gamesPlayedCount') || '1');
    gamesPlayedCount++; // Sumem una partida
    sessionStorage.setItem('gamesPlayedCount', gamesPlayedCount.toString());

    // 3. DECIDIM LA REGLA: Bloquegem si NO és la partida 5, 10, 15...
    // Si el residu de dividir per 5 és 0, és una partida especial on es permet repetir.
    const shouldBlockPreviousImpostor = gamesPlayedCount % 5 !== 0;

    console.log(`Preparant partida ${gamesPlayedCount}. Bloquejar repetició? ${shouldBlockPreviousImpostor ? 'SÍ' : 'NO (Ronda especial!)'}`);

    // Resetegem estats visuals
    setCurrentPlayerIndex(0);
    setStartingPlayer(null);
    
    const setupData = JSON.parse(sessionStorage.getItem('gameSetup'));
    const count = setupData?.impostorCount || 1;

    // Recuperem els impostors de la ronda anterior
    let lastImpostorIndices = [];
    try {
        const lastData = sessionStorage.getItem('lastImpostorIndices');
        lastImpostorIndices = lastData ? JSON.parse(lastData) : [];
        if (!Array.isArray(lastImpostorIndices)) lastImpostorIndices = [];
    } catch (e) { lastImpostorIndices = []; }

    // SELECCIÓ DELS NOUS IMPOSTORS
    const newImpostors = [];
    let attempts = 0;
    
    while(newImpostors.length < count && attempts < 200) {
        attempts++;
        const r = Math.floor(Math.random() * players.length);

        const jaEscollitAquestaRonda = newImpostors.includes(r);
        const eraImpostorLaRondaPassada = lastImpostorIndices.includes(r);

        // CONDICIÓ CLAU:
        // 1. No pot estar ja escollit per aquesta mateixa ronda (sempre).
        if (!jaEscollitAquestaRonda) {
             // 2. Si HEM de bloquejar I era impostor, el saltem.
             if (shouldBlockPreviousImpostor && eraImpostorLaRondaPassada) {
                 continue; // Provem un altre número
             }
             // Si passem els filtres, l'afegim
             newImpostors.push(r);
        }
    }

    // Fallback de seguretat (per si la configuració és impossible)
    while(newImpostors.length < count) {
         const r = Math.floor(Math.random() * players.length);
         if(!newImpostors.includes(r)) newImpostors.push(r);
    }
    
    setImpostorIndices(newImpostors);
    
    if (shouldBlockPreviousImpostor) {
        console.log("Nous impostors (evitant anteriors):", newImpostors);
    } else {
        console.log("Nous impostors (ALEATORI PUR - Ronda especial 5a):", newImpostors);
        // Opcional: Avisar si hi ha hagut repetició (pocs cops passarà)
        if (newImpostors.some(i => lastImpostorIndices.includes(i))) {
            // toast("Atenció: En aquesta ronda especial, un impostor HA REPETIT!", { duration: 4000 });
        }
    }

    await fetchRandomWord();
    
    setGamePhase('reveal');
    setIsLoading(false);
  };

  const handleEndGame = () => {
    // Netegem tot al sortir
    sessionStorage.removeItem('gameSetup');
    sessionStorage.removeItem('lastImpostorIndices');
    sessionStorage.removeItem('gamesPlayedCount'); 
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
                              ? 'bg-cyan-400 animate-pulse' 
                              : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <PlayerReveal
                    player={players[currentPlayerIndex]}
                    isImpostor={impostorIndices.includes(currentPlayerIndex)}
                    secretWord={secretWord}
                    onComplete={handlePlayerRevealComplete}
                  />

                  <AdContainer position="bottom" size="mobile-banner" />
                </motion.div>
              )}

              {/* All Revealed Phase */}
              {gamePhase === 'allRevealed' && (
                <motion.div
                  key="allRevealed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-8 py-12"
                >
                  <motion.div
                    animate={{ 
                      boxShadow: ['0 0 40px rgba(34, 197, 94, 0.4)', '0 0 80px rgba(34, 197, 94, 0.2)', '0 0 40px rgba(34, 197, 94, 0.4)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 flex items-center justify-center"
                  >
                    <MessageCircle className="w-12 h-12 text-green-400" />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{t('allRevealed')}</h2>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startDiscussion}
                    className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <span className="relative flex items-center justify-center gap-3">
                      <MessageCircle className="w-6 h-6" />
                      {t('startDiscussion')}
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* Discussion Phase */}
              {gamePhase === 'discussion' && (
                <motion.div
                  key="discussion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">{t('discussion')}</h2>
                    
                    {/* BOTÓ DE QUI COMENÇA */}
                    {startingPlayer && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                         <motion.button
                           whileHover={{ scale: 1.02 }}
                           className="w-full max-w-md mx-auto py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20"
                         >
                           <User className="w-6 h-6 text-white" />
                           {t('playerStarts', { name: startingPlayer })}
                         </motion.button>
                      </motion.div>
                    )}
                  </div>

                  <Timer initialMinutes={5} onTimeUp={() => toast.info('Time\'s up!')} />

                  <div className="flex gap-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleRestart}
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {t('restart')}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleEndGame}
                      className="flex-1 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/15 transition-all"
                    >
                      <Home className="w-5 h-5" />
                      {t('endGame')}
                    </motion.button>
                  </div>

                  <AdContainer position="bottom" size="mobile-banner" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <I18nProvider>
      <GameContent />
    </I18nProvider>
  );
}
