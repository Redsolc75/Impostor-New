import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ChevronRight, Skull, Star } from 'lucide-react';
import { useTranslation } from './i18n/i18nContext';
import AdContainer from './AdContainer';

export default function PlayerReveal({ player, isImpostor, secretWord, onComplete }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('waiting'); // waiting, revealed

  const handleReveal = () => {
    setPhase('revealed');
  };

  const handleHide = () => {
    setPhase('waiting');
    onComplete();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {phase === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ 
                boxShadow: ['0 0 30px rgba(0, 212, 255, 0.3)', '0 0 60px rgba(139, 92, 246, 0.3)', '0 0 30px rgba(0, 212, 255, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center"
            >
              <span className="text-4xl font-bold text-white">{player.name[0].toUpperCase()}</span>
            </motion.div>

            <div>
              <p className="text-white/60 text-lg mb-2">{t('passPhone')}</p>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {player.name}
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReveal}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-lg overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative flex items-center gap-3">
                <Eye className="w-5 h-5" />
                {t('tapToReveal')}
              </span>
            </motion.button>
          </motion.div>
        )}

        {phase === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-center space-y-8 w-full max-w-sm"
          >
            {isImpostor ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{ 
                    boxShadow: ['0 0 40px rgba(239, 68, 68, 0.5)', '0 0 80px rgba(239, 68, 68, 0.3)', '0 0 40px rgba(239, 68, 68, 0.5)']
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 backdrop-blur-xl border-2 border-red-500/50 flex items-center justify-center"
                >
                  <Skull className="w-16 h-16 text-red-400" />
                </motion.div>

                <motion.h2
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-black text-red-400 tracking-wider"
                >
                  {t('youAreImpostor')}
                </motion.h2>

                <p className="text-white/60 text-sm px-4">
                  🎭 Blend in with the crew. Don't get caught!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="space-y-6"
              >
                <motion.div
                  animate={{ 
                    boxShadow: ['0 0 40px rgba(34, 197, 94, 0.5)', '0 0 80px rgba(34, 197, 94, 0.3)', '0 0 40px rgba(34, 197, 94, 0.5)']
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-xl border-2 border-green-500/50 flex items-center justify-center"
                >
                  <Star className="w-16 h-16 text-green-400" />
                </motion.div>

                <div>
                  <p className="text-white/60 text-lg mb-3">{t('yourWord')}</p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30"
                  >
                    <h3 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {secretWord}
                    </h3>
                  </motion.div>
                </div>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHide}
              className="group relative px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <EyeOff className="w-5 h-5" />
              {t('hideRole')}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Zone B: High-Value Ad Slot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AdContainer position="inline" size="square" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}