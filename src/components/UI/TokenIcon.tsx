import React from 'react';

interface TokenIconProps {
  symbol: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base'
};

const TokenIcon: React.FC<TokenIconProps> = ({ 
  symbol,
  imageUrl,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageUrl && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img 
          src={imageUrl} 
          alt={`${symbol} logo`} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Fallback to symbol
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}>
      {symbol.slice(0, 3)}
    </div>
  );
};

export default TokenIcon;