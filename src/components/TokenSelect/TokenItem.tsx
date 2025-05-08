import React from 'react';
import { Token } from '../../types/tokens';
import TokenIcon from '../UI/TokenIcon';
import { formatCurrency } from '../../utils/swapUtils';

interface TokenItemProps {
  token: Token;
  onSelect: (token: Token) => void;
  showBalance?: boolean;
}

const TokenItem: React.FC<TokenItemProps> = ({ 
  token, 
  onSelect,
  showBalance = true
}) => {
  return (
    <div 
      className="flex items-center justify-between p-3 hover:bg-blue-900/10 rounded-lg cursor-pointer transition-colors duration-150"
      onClick={() => onSelect(token)}
    >
      <div className="flex items-center gap-3">
        <TokenIcon 
          symbol={token.symbol} 
          imageUrl={token.logoUrl} 
          size="md"
        />
        <div>
          <p className="font-medium text-white">{token.symbol}</p>
          <p className="text-sm text-gray-400">{token.name}</p>
        </div>
      </div>
      <div className="text-right">
        {showBalance && token.balance !== undefined && (
          <p className="text-sm text-gray-300">
            {token.balance.toFixed(4)}
          </p>
        )}
        <div className="flex items-center gap-1">
          <span className="text-gray-300">{formatCurrency(token.price)}</span>
          <span className={`text-xs ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;