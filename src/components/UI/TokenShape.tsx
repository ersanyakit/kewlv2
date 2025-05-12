import React, { memo } from 'react';
import { generateTokenColorByContractAddress } from '../../utils/helpers';
import { Token } from '../../context/TokenContext';

interface TokenShapeProps {
  token: Token | null;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isDarkMode: boolean;
}

// Minimum yeniden render için React.memo kullanıyoruz
const TokenShape: React.FC<TokenShapeProps> = memo(({ 
  token, 
  size = 'lg', 
  onClick, 
  isDarkMode
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };
  
  // Stil objesi
  const bgStyle = {
    background: token?.color || '#627eea'
  };
  
  // Basitleştirilmiş JSX, minimum animasyon ve transition
  return (
    <div 
      className={`relative  rounded-full shadow ${sizeClasses[size]} flex items-center justify-center cursor-pointer overflow-hidden`}
      onClick={onClick}
      style={bgStyle}
    >
      <div className={`absolute inset-0.5 rounded-full flex items-center justify-center`}>
        <img 
          src={token?.icon || token?.logoURI} 
          className="w-full h-full rounded-full" 
          alt={token?.name}
          loading="lazy" // Lazy loading eklendi
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Özel karşılaştırma fonksiyonu ile gereksiz render'ları engelliyoruz
  return prevProps.token?.symbol === nextProps.token?.symbol && 
         prevProps.size === nextProps.size && 
         prevProps.isDarkMode === nextProps.isDarkMode;
});

// Bileşen adını debug için ayarlayalım
TokenShape.displayName = 'TokenShape';

export default TokenShape; 