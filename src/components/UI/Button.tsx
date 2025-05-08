import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className,
  icon,
  disabled = false
}) => {
  const baseClasses = "flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-kewl-primary to-kewl-secondary text-white shadow-button hover:shadow-lg",
    secondary: "bg-blue-50 dark:bg-gray-700 text-kewl-primary dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600",
    ghost: "bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
  };
  
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-5 text-lg",
  };
  
  return (
    <motion.button
      className={twMerge(baseClasses, variantClasses[variant], sizeClasses[size], disabled ? "opacity-50 cursor-not-allowed" : "", className)}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;