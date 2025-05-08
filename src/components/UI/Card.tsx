import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={twMerge("bg-ui-panel-light dark:bg-ui-panel-dark backdrop-blur-md rounded-3xl shadow-card border border-ui-border-light dark:border-ui-border-dark overflow-hidden transition-all duration-300", className)}>
      {children}
    </div>
  );
};

export default Card;