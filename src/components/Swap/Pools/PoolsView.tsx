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
          background: `linear-gradient(135deg, ${baseToken.color || '#ff1356'}40 0%, transparent 70%),
                      linear-gradient(315deg, ${quoteToken.color || '#ff4080'}40 0%, transparent 70%)`
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
          <div className="p-4">
            {/* Token çifti seçimi ve havuz bilgileri */}
            <div className={`p-3 mb-4 rounded-xl ${
              isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
            }`}>
              <div className="flex justify-between mb-2">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Likidite Havuzu Seçin
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="flex -space-x-2 mr-3">
                  <TokenShape token={baseToken} size="sm" isDarkMode={isDarkMode} />
                  <TokenShape token={quoteToken} size="sm" isDarkMode={isDarkMode} />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {baseToken.symbol}-{quoteToken.symbol}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Bakiyeniz: 3.45 LP Token ≈ $853.20
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              
              {/* Likidite çıkarma miktarı */}
              <div className="mb-3">
                <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Çıkarılacak Miktar
                </div>
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'
                } flex items-center justify-between`}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    defaultValue="50"
                    className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    50%
                  </span>
                </div>
              </div>
              
              {/* Çıkarılacak token miktarları */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                  <div className="flex items-center">
                    <TokenShape token={baseToken} size="sm" isDarkMode={isDarkMode} />
                    <div className="ml-2">
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alacağınız</div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        125.34 {baseToken.symbol}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                  <div className="flex items-center">
                    <TokenShape token={quoteToken} size="sm" isDarkMode={isDarkMode} />
                    <div className="ml-2">
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alacağınız</div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        42.5 {quoteToken.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Uyarı mesajı */}
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800/70 text-gray-400' : 'bg-white/70 text-gray-500'
              } text-xs flex items-start`}>
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 text-amber-500" />
                <div>
                  <p>Likidite çıkarıldığında, havuzdaki her iki tokeni de alırsınız. Çıkarma işlemi sonrası toplam değer piyasa koşullarına bağlı olarak değişebilir.</p>
                </div>
              </div>
            </div>
            
            {/* Onay ve İşlem Butonu */}
            <motion.button
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 text-white relative overflow-hidden shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: `linear-gradient(135deg, #ff1356, #ff4080)`
              }}
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-white opacity-20">
                <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
              </div>
              
              <span>Likidite Çıkar</span>
              <MinusCircle className="w-4 h-4" />
            </motion.button>
          </div>
        )}
        
        {/* Kullanıcı Havuzları Listesi */}
        {activeTab === 'my-pools' && (
          <div className="p-4">
            <div className="mb-3 flex justify-between items-center">
              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Aktif Likidite Havuzlarınız
              </div>
              <div className={`text-xs px-2 py-1 rounded-lg ${
                isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-[#ff1356]'
              }`}>
                Toplam: $15,582.52
              </div>
            </div>
            
            {myPools.map((pool, index) => (
              <div key={index} className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
              } mb-3`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-2">
                      <TokenShape token={pool.token1} size="sm" isDarkMode={isDarkMode} />
                      <TokenShape token={pool.token2} size="sm" isDarkMode={isDarkMode} />
                    </div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {pool.pair}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Havuz APR: <span className="text-green-500">{pool.apr}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${pool.myLiquidity}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Payınız: {pool.share}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Toplam Havuz</div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pool.totalLiquidity}</div>
                  </div>
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kazançlarınız</div>
                    <div className={`font-medium text-green-500`}>{pool.earnings}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                  }`}>
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Ekle
                  </button>
                  <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                  }`}>
                    <MinusCircle className="w-3 h-3 mr-1" />
                    Çıkar
                  </button>
                  <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white`}>
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Detaylar
                  </button>
                </div>
              </div>
            ))}
            
            {/* Boş havuz durumu */}
            {myPools.length === 0 && (
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/70'
              } text-center`}>
                <PieChart className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Henüz Likidite Eklemediniz
                </div>
                <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Likidite ekleyerek işlem ücretlerinden pay alabilirsiniz
                </div>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white rounded-xl text-sm font-medium flex items-center justify-center mx-auto"
                  onClick={() => setActiveTab('add')}
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  İlk Havuzumu Oluştur
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PoolsView; 