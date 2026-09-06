import React from 'react';
import { useLanguage } from '../LanguageContext';

interface MonogramProps {
  className?: string;
  size?: number;
}

export default function Monogram({ className = '', size = 160 }: MonogramProps) {
  const { config } = useLanguage();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mx-auto drop-shadow-sm select-none ${className}`}
    >
      <circle
        cx="100"
        cy="100"
        r="92"
        stroke="#C5A059"
        strokeWidth="2"
        className="opacity-90"
      />
      
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke="#C5A059"
        strokeWidth="0.75"
        strokeDasharray="4 2"
        className="opacity-60"
      />

      <text
        x="100"
        y="112"
        fill="#C5A059"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="48"
        fontWeight="300"
        textAnchor="middle"
        className="tracking-widest select-none"
      >
        {config.monagramInitials || 'A&K'}
      </text>

      <path
        d="M 60 138 C 75 128, 125 128, 140 138"
        stroke="#C5A059"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
        className="opacity-80"
      />
    </svg>
  );
}
