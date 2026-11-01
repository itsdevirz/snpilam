import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const CouncilEmblem: React.FC<EmblemProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="نشان سازمان نظام پزشکی جمهوری اسلامی ایران"
    >
      {/* Outer circular medallion */}
      <circle cx="50" cy="50" r="47" stroke="#17365D" strokeWidth="2.5" fill="#EFF6FC" />
      <circle cx="50" cy="50" r="43" stroke="#2463A6" strokeWidth="1" strokeDasharray="3 2" fill="none" />
      
      {/* Symbolic Crescent & Octagram */}
      <circle cx="50" cy="50" r="37" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
      
      {/* Laurel Wreath decorative leaves */}
      <path
        d="M24 62 C22 52, 25 38, 35 28 C34 35, 36 43, 40 48"
        stroke="#24845B"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M76 62 C78 52, 75 38, 65 28 C66 35, 64 43, 60 48"
        stroke="#24845B"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Classical Staff of Asclepius & Serpent */}
      {/* Staff rod */}
      <path d="M50 16 L50 82" stroke="#17365D" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="16" r="3.5" fill="#C77920" />
      
      {/* Entwined serpent */}
      <path
        d="M50 24 C57 26, 57 33, 50 37 C43 41, 43 48, 50 52 C57 56, 57 63, 50 67 C43 71, 45 77, 50 78"
        stroke="#2463A6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Tiny medical cross / Islamic star above */}
      <path
        d="M50 8 L51.5 12 L55.5 12 L52 14.5 L53.5 18.5 L50 16 L46.5 18.5 L48 14.5 L44.5 12 L48.5 12 Z"
        fill="#17365D"
      />

      {/* Base Ribbon */}
      <path
        d="M32 78 Q50 84 68 78 Q60 88 50 88 Q40 88 32 78 Z"
        fill="#17365D"
      />
    </svg>
  );
};
