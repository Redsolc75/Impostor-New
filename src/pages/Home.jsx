import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Sparkles, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { I18nProvider, useTranslation } from '@/components/i18n/i18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdContainer from '@/components/AdContainer';

function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col pb-20">
        {/* Header */}
        <header className="p-6 flex justify-end">
          <LanguageSwitcher />
        </header>

        {/* Zone A: Top Banner Ad */}
        <div className="px-6">
          <AdContainer position="top" size="leaderboard" />
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                boxShadow: ['0 0 40px rgba(0, 212, 255, 0.4)', '0 0 80px rgba(139, 92, 246, 0.4)', '0 0 40px rgba(0, 212, 255, 0.4)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center"
            >
              <Skull className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                background: 'linear-gradient(90deg, #00d4ff, #8b5cf6, #ec4899, #00d4ff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/60 text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t('subtitle')}
              <Sparkles className="w-4 h-4" />
            </motion.p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <Link to={createPageUrl('Setup')}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <span className="relative flex items-center justify-center gap-3">
                  <Play className="w-6 h-6" />
                  {t('playNow')}
                </span>
              </motion.button>
            </Link>

            </motion.div>
        </main>

        {/* Footer decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <HomeContent />
    </I18nProvider>
  );
}