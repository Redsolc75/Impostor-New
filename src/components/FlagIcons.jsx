import React from 'react';

export function CatalanFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect y="0" width="24" height="2.67" fill="#FCDD09" />
      <rect y="2.67" width="24" height="2.67" fill="#DA121A" />
      <rect y="5.34" width="24" height="2.67" fill="#FCDD09" />
      <rect y="8.01" width="24" height="2.67" fill="#DA121A" />
      <rect y="10.68" width="24" height="2.67" fill="#FCDD09" />
      <rect y="13.35" width="24" height="2.67" fill="#DA121A" />
      <rect y="16.02" width="24" height="2.67" fill="#FCDD09" />
      <rect y="18.69" width="24" height="2.67" fill="#DA121A" />
      <rect y="21.36" width="24" height="2.64" fill="#FCDD09" />
    </svg>
  );
}

export function SpanishFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill="#C60B1E" />
      <rect y="6" width="24" height="12" fill="#FFC400" />
      <rect y="0" width="24" height="6" fill="#C60B1E" />
      <rect y="18" width="24" height="6" fill="#C60B1E" />
    </svg>
  );
}

export function EnglishFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill="#012169" />
      
      {/* White diagonals */}
      <path d="M0 0 L24 24 M24 0 L0 24" stroke="white" strokeWidth="4" />
      
      {/* Red diagonals */}
      <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="2" />
      
      {/* White cross */}
      <path d="M12 0 V24 M0 12 H24" stroke="white" strokeWidth="6" />
      
      {/* Red cross */}
      <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3.6" />
    </svg>
  );
}

export function USFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {/* Red stripes */}
      <rect width="24" height="24" fill="#B22234" />
      <rect y="2" width="24" height="2" fill="white" />
      <rect y="6" width="24" height="2" fill="white" />
      <rect y="10" width="24" height="2" fill="white" />
      <rect y="14" width="24" height="2" fill="white" />
      <rect y="18" width="24" height="2" fill="white" />
      <rect y="22" width="24" height="2" fill="white" />
      
      {/* Blue canton */}
      <rect width="10" height="12" fill="#3C3B6E" />
      
      {/* White stars (simplified) */}
      <circle cx="2" cy="2" r="0.5" fill="white" />
      <circle cx="5" cy="2" r="0.5" fill="white" />
      <circle cx="8" cy="2" r="0.5" fill="white" />
      <circle cx="2" cy="5" r="0.5" fill="white" />
      <circle cx="5" cy="5" r="0.5" fill="white" />
      <circle cx="8" cy="5" r="0.5" fill="white" />
      <circle cx="2" cy="8" r="0.5" fill="white" />
      <circle cx="5" cy="8" r="0.5" fill="white" />
      <circle cx="8" cy="8" r="0.5" fill="white" />
    </svg>
  );
}

export function FrenchFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="0" y="0" width="8" height="24" fill="#002395" />
      <rect x="8" y="0" width="8" height="24" fill="white" />
      <rect x="16" y="0" width="8" height="24" fill="#ED2939" />
    </svg>
  );
}

export function GermanFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect y="0" width="24" height="8" fill="black" />
      <rect y="8" width="24" height="8" fill="#DD0000" />
      <rect y="16" width="24" height="8" fill="#FFCE00" />
    </svg>
  );
}

export function ItalianFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="0" y="0" width="8" height="24" fill="#009246" />
      <rect x="8" y="0" width="8" height="24" fill="white" />
      <rect x="16" y="0" width="8" height="24" fill="#CE2B37" />
    </svg>
  );
}

export function PortugueseFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill="#FF0000" />
      <rect x="0" y="0" width="9" height="24" fill="#006600" />
      <circle cx="9" cy="12" r="4" fill="#FFFF00" stroke="#0000FF" strokeWidth="0.5" />
    </svg>
  );
}

export function RussianFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect y="0" width="24" height="8" fill="white" />
      <rect y="8" width="24" height="8" fill="#0039A6" />
      <rect y="16" width="24" height="8" fill="#D52B1E" />
    </svg>
  );
}

export function JapaneseFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill="white" />
      <circle cx="12" cy="12" r="5" fill="#BC002D" />
    </svg>
  );
}

export function ChineseFlag({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill="#DE2910" />
      <path d="M5 5 L6 7 L4 6 L6 6 L4 7 Z" fill="#FFDE00" />
      <path d="M9 3 L9.5 3.8 L8.8 3.5 L9.2 3.5 L8.8 3.8 Z" fill="#FFDE00" />
      <path d="M10 6 L10.5 6.8 L9.8 6.5 L10.2 6.5 L9.8 6.8 Z" fill="#FFDE00" />
      <path d="M10 9 L10.5 9.8 L9.8 9.5 L10.2 9.5 L9.8 9.8 Z" fill="#FFDE00" />
      <path d="M9 12 L9.5 12.8 L8.8 12.5 L9.2 12.5 L8.8 12.8 Z" fill="#FFDE00" />
    </svg>
  );
}