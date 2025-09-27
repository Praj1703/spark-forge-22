import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'fixed' | 'inline';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'fixed' 
}) => {
  const { theme, toggleTheme } = useTheme();

  const buttonContent = (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-glass shadow-glass"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );

  if (variant === 'fixed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`fixed top-4 right-4 z-50 ${className}`}
      >
        {buttonContent}
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {buttonContent}
    </div>
  );
};