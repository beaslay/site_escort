import React from 'react';
import { motion } from 'framer-motion';

interface ChatToggleProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatToggle({ onClick, isOpen }: ChatToggleProps) {
  if (isOpen) return null;

  return (
    <motion.button
      className="chat-toggle"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-label="Ouvrir le chat secrétariat"
    >
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="9" cy="10" r="1"></circle>
        <circle cx="15" cy="10" r="1"></circle>
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
      </svg>
    </motion.button>
  );
}