import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, PieChart, Clock } from 'lucide-react';

interface SwapTabsProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isDarkMode: boolean;
}

const SwapTabs: React.FC<SwapTabsProps> = ({ 
  activeView, 
  setActiveView, 
  isDarkMode 
}) => {
  return (
    <motion.div 
      className="mb-4 flex justify-center"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className={`${
        isDarkMode 
          ? 'bg-gray-800/70 border-gray-700/50' 
          : 'bg-white/80 border-white/30'
      } backdrop-blur-lg p-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.06)] border flex space-x-1 transition-all duration-300`}>
        <button 
          className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'swap' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() => setActiveView('swap')}
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Swap
        </button>
        <button 
          className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'pools' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() => setActiveView('pools')}
        >
          <PieChart className="w-4 h-4 mr-1.5" />
          Pools
        </button>
        <button 
          className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'etf' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() => setActiveView('etf')}
        >
          <Clock className="w-4 h-4 mr-1.5" />
          ETF
        </button>
      </div>
    </motion.div>
  );
};

export default SwapTabs; 