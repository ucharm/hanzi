
import React from 'react';
import { playSound, initAudio } from '../services/audioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  enableSound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  enableSound = true,
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all transform active:scale-95 focus:outline-none shadow-md border-b-4";
  
  const variants = {
    primary: "bg-sky-400 hover:bg-sky-500 text-white border-sky-600",
    secondary: "bg-purple-400 hover:bg-purple-500 text-white border-purple-600",
    success: "bg-green-400 hover:bg-green-500 text-white border-green-600",
    danger: "bg-rose-400 hover:bg-rose-500 text-white border-rose-600",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border-gray-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound) {
      // Initialize audio context on first user interaction if needed
      initAudio();
      playSound('click');
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
