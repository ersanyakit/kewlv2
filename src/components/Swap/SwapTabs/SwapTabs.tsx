import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, PieChart, Clock, Waves, NotebookText, ServerCrash } from 'lucide-react';
import { useTokenContext } from '../../../context/TokenContext';
import { useNavigate } from 'react-router-dom';
interface SwapTabsProps {
  isLimitOrder: boolean;
  isDarkMode: boolean;
}


const SwapTabs: React.FC<SwapTabsProps> = ({ 
  isLimitOrder,
  isDarkMode 
}) => {
  const {activeView, setActiveView} = useTokenContext();
  const navigate = useNavigate();



  return (
    <motion.div 
      className="select-none flex justify-center"
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
          className={`text-sm select-none font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'limit' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() => {
            setActiveView('limit')

            navigate('/exchange')
          }
          }
        >
          <ServerCrash className="w-4 h-4 mr-1.5" />
          Limit
        </button>
        <button 
          className={`text-sm select-none font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'swap' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() =>{
            setActiveView('swap')
            navigate('/swap', {
              state: { activeView: 'swap' }
            })
          }}
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Swap
        </button>
        <button 
          className={`hidden select-none text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'etf' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() => setActiveView('etf')}
        >
          <Clock className="w-4 h-4 mr-1.5" />
          ETF
        </button>
        <button 
          className={`text-sm select-none font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'pools' 
            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg' 
            : isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700/50' 
              : 'text-gray-600 hover:bg-white/50'}`}
          onClick={() => {
            setActiveView('pools')
            navigate('/swap', {
              state: { activeView: 'pools' }
            })
          }}
        >
          <Waves  className="w-4 h-4 mr-1.5" />
          Pools
        </button>
       
       
      </div>
  
    </motion.div>
  );
};

export default SwapTabs; 