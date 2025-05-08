import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Token } from '../../types/tokens';
import TokenIcon from '../UI/TokenIcon';
import Card from '../UI/Card';
import TokenItem from './TokenItem';
import Input from '../UI/Input';

interface TokenSelectorProps {
  selectedToken: Token | null;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  label?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  tokens,
  onSelectToken,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    onSelectToken(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <p className="text-sm text-gray-400 mb-1">{label}</p>}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-xl hover:border-blue-700/30 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selectedToken ? (
          <div className="flex items-center gap-2">
            <TokenIcon 
              symbol={selectedToken.symbol} 
              imageUrl={selectedToken.logoUrl}
              size="sm" 
            />
            <span className="font-medium text-white">{selectedToken.symbol}</span>
          </div>
        ) : (
          <span className="text-gray-400">Select token</span>
        )}
        <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>

      {isOpen && (
        <Card 
          className="absolute mt-2 w-full z-10 max-h-80 overflow-hidden flex flex-col"
          variant="elevated"
        >
          <div className="p-3 border-b border-gray-800">
            <Input
              placeholder="Search token name or symbol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search size={18} className="text-gray-400" />}
              className="py-2"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filteredTokens.length > 0 ? (
              filteredTokens.map(token => (
                <TokenItem 
                  key={token.id} 
                  token={token} 
                  onSelect={handleTokenSelect} 
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                No tokens found
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TokenSelector;