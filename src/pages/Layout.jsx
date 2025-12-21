
import React from 'react';
import { Toaster } from 'sonner';
import AdContainer from '@/components/AdContainer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 relative">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            backdropFilter: 'blur(12px)'
          }
        }}
      />
      <div className="pb-[80px]">
        {children}
      </div>
      
      {/* Zone C: Sticky Footer Ad */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-t border-white/5 py-2">
        <AdContainer position="sticky-footer" size="sticky" />
      </div>
    </div>
  );
}
