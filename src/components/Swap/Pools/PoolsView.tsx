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

interface PoolsViewProps {
  isDarkMode: boolean;
}

const PoolsView: React.FC<PoolsViewProps> = ({ isDarkMode }) => {
  const { tokens, baseToken, quoteToken, setBaseToken, setQuoteToken,swapMode,setSwapMode } = useTokenContext();
  
  // Likidite ekranına özel state'ler
  const [activeTab, setActiveTab] = useState<'add' | 'remove' | 'my-pools'>('add');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  
  // Kullanıcının mevcut likidite havuzları (örnek veri)
  const myPools = [
    { 
      pair: 'CHZ-KEWL', 
      token1: tokens[0], 
      token2: tokens[1], 
      myLiquidity: '12,532.40', 
      totalLiquidity: '$45,830.00',
      share: '1.8%',
      apr: '14.2%',
      earnings: '$328.45'
    },
    { 
      pair: 'KEWL-CHZINU', 
      token1: tokens[1], 
      token2: tokens[2], 
      myLiquidity: '3,050.12', 
      totalLiquidity: '$128,650.00',
      share: '0.6%',
      apr: '22.8%',
      earnings: '$147.92'
    }
  ];
  
  // Form işlemleri
  const handleAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount1(value);
    // Oransal hesaplama (basit örnek)
    if (value) {
      const calculatedAmount = parseFloat(value) * 0.32; // Örnek oran
      setAmount2(calculatedAmount.toFixed(6));
    } else {
      setAmount2('');
    }
  };
  
  const handleAmount2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount2(value);
    // Oransal hesaplama (basit örnek)
    if (value) {
      const calculatedAmount = parseFloat(value) * 3.125; // Örnek oran
      setAmount1(calculatedAmount.toFixed(6));
    } else {
      setAmount1('');
    }
  };
  
  // Token çiftini değiştirme
  const handleSwapTokens = () => {
    const tempToken = baseToken;
    setBaseToken(quoteToken);
    setQuoteToken(tempToken);
    
    // Ayrıca miktarları da değiştir
    const tempAmount = amount1;
    setAmount1(amount2);
    setAmount2(tempAmount);
  };

  useEffect(()=>{
    setSwapMode(SWAP_MODE.POOLS)
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
     
     <>
     test
     </>
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