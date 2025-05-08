import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from '../../types/tokens';
import TokenItem from './TokenItem';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tokens: Token[];
  onSelect: (token: Token) => void;
}

const TokenSelectModal: React.FC<Props> = ({ isOpen, onClose, tokens, onSelect }) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return tokens.filter(t =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    );
  }, [query, tokens]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Select a token</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name or symbol"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                {filtered.length
                  ? filtered.map(token => (
                      <TokenItem
                        key={token.id}
                        token={token}
                        onSelect={tok => { onSelect(tok); onClose(); }}
                        showBalance
                      />
                    ))
                  : <p className="text-center text-gray-500 mt-4">No tokens found</p>
                }
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TokenSelectModal; 