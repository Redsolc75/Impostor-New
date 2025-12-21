import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

/**
 * AdContainer Component
 * 
 * Placeholder for Google AdSense or display ads.
 * Replace the content inside this component with your AdSense script tag when ready.
 * 
 * Usage:
 * <AdContainer position="top" size="leaderboard" />
 */
export default function AdContainer({ 
  position = "inline", // "bottom", "top", "inline", "sticky-footer"
  size = "mobile-banner", // "mobile-banner" (320x50), "leaderboard" (728x90), "rectangle" (300x250), "square" (250x250)
  className = ""
}) {
  const sizeClasses = {
    "mobile-banner": "h-[60px] w-full max-w-[320px]",
    "leaderboard": "h-[100px] w-full max-w-[728px]",
    "rectangle": "h-[250px] w-full max-w-[300px]",
    "square": "h-[250px] w-[250px]",
    "sticky": "h-[60px] w-full"
  };

  const positionClasses = {
    "bottom": "my-6",
    "top": "mb-6",
    "inline": "my-4",
    "sticky-footer": ""
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`flex justify-center ${positionClasses[position]} ${className}`}
    >
      <div 
        className={`
          ${sizeClasses[size]}
          rounded-xl
          bg-gradient-to-br from-white/5 to-white/[0.02]
          backdrop-blur-md
          border border-cyan-500/20
          flex flex-col
          items-center
          justify-center
          overflow-hidden
          relative
          shadow-lg shadow-black/20
        `}
      >
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(0, 212, 255, 0.3) 0%, transparent 50%, rgba(139, 92, 246, 0.3) 100%)',
              'linear-gradient(45deg, rgba(139, 92, 246, 0.3) 0%, transparent 50%, rgba(236, 72, 153, 0.3) 100%)',
              'linear-gradient(45deg, rgba(0, 212, 255, 0.3) 0%, transparent 50%, rgba(139, 92, 246, 0.3) 100%)'
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Placeholder content - remove when adding real ads */}
        <div className="relative z-10 flex flex-col items-center gap-2 px-4">
          <DollarSign className="w-5 h-5 text-cyan-400/40" />
          <span className="text-white/30 text-sm font-medium tracking-wide">Advertisement Area</span>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />

        {/* TODO: Replace the above placeholder with Google AdSense code */}
        {/* Example:
        <ins 
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        */}
      </div>
    </motion.div>
  );
}