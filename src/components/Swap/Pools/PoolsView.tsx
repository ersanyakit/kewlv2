import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  MinusCircle, 
  TrendingUp, 
  PieChart, 
  Info, 
  Zap, 
  ChevronDown, 
  ArrowDownUp,
  AlertCircle,
  Clock,
  Shield,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useTokenContext, Token, SWAP_MODE } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import AddLiqudityForm from './AddLiqudityForm';
import RemoveLiquidityForm from './RemoveLiquidity';

interface PoolsViewProps {
  isDarkMode: boolean;
}

const PoolsView: React.FC<PoolsViewProps> = ({ isDarkMode }) => {
  const { tokens, baseToken, quoteToken, setBaseToken, setQuoteToken,swapMode,setSwapMode } = useTokenContext();
  
  // Likidite ekranına özel state'ler
  const [activeTab, setActiveTab] = useState<'add' | 'remove' | 'my-pools'>('add');
  
  
  useEffect(()=>{
    
  },[])
  
  return (
    <motion.div 
      className={`${
        isDarkMode 
          ? 'bg-gray-800/30 border-gray-700/30' 
          : 'bg-white/40 border-white/20'
      } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Background gradient based on selected tokens */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${baseToken && baseToken.color || '#ff1356'}40 0%, transparent 70%),
                      linear-gradient(315deg, ${quoteToken &&quoteToken.color || '#ff4080'}40 0%, transparent 70%)`
        }}
      ></div>
      
      <div className={`relative ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl overflow-hidden`}>
        {/* Tab Seçici */}
        <div className="flex p-3 border-b border-gray-200 dark:border-gray-700">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center ${
              activeTab === 'add' 
                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:bg-gray-100/70'
            }`}
            onClick={() => setActiveTab('add')}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Add Liquidity
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center mx-2 ${
              activeTab === 'remove' 
                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:bg-gray-100/70'
            }`}
            onClick={() => setActiveTab('remove')}
          >
            <MinusCircle className="w-4 h-4 mr-1.5" />
            Remove Liquidity
          </button>
          <button 
            className={`hidden flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center ${
              activeTab === 'my-pools' 
                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:bg-gray-100/70'
            }`}
            onClick={() => setActiveTab('my-pools')}
          >
            <PieChart className="w-4 h-4 mr-1.5" />
            My Pools
          </button>
        </div>
        
        {/* İçerik Alanı - Likidite Ekleme */}
        {activeTab === 'add' && (
          <AddLiqudityForm/>
        )}
        
        {/* Likidite Çıkarma Ekranı */}
        {activeTab === 'remove' && (
          <RemoveLiquidityForm/>
        )}
        
        {/* Kullanıcı Havuzları Listesi */}
        {activeTab === 'my-pools' && (
          <>
          test
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PoolsView; 