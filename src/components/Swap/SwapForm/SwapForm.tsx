import React, { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowDownUp,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  RotateCcw,
  RefreshCw,
  DollarSign,
  XCircle,
  RefreshCcw,
} from 'lucide-react';
import { useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';

// Token type
interface SwapFormProps {
  isDarkMode: boolean;
  slippageTolerance: number;
  setSlippageTolerance: (tolerance: number) => void;
  swapDirection: string;
  setSwapDirection: (direction: string) => void;
}

// memo ile render performansını optimize etme
const SwapForm: React.FC<SwapFormProps> = memo(({
  isDarkMode,
  slippageTolerance,
  setSlippageTolerance,
  swapDirection,
  setSwapDirection,
}) => {
  // Token context'inden verileri al
  const {
    baseToken,
    quoteToken,
    selectingTokenIndex,
    tokenFilter,
    favoriteOnly,
    filteredTokens,
    fromAmount,
    toAmount,
    rate,
    tradeType,
    openTokenSelector,
    setOpenTokenSelector,
    setTokenFilter,
    setFavoriteOnly,
    selectToken,
    reloadTokens,
    handleSwapTokens,
    setSelectingTokenIndex,
    setTradeType,
    handleFromChange,
    handleToChange
  } = useTokenContext();


  useEffect(()=>{
    console.log("ersan baseToken",baseToken);
    console.log("ersan quoteToken",quoteToken);
    
  },[baseToken,quoteToken]);

  return (
    <motion.div
      className={`relative ${isDarkMode
        ? 'bg-gray-800/30 border-gray-700/30'
        : 'bg-white/40 border-white/20'
        } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Background gradient based on selected tokens */}



      <div className={`relative ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl overflow-hidden`}>
        {/* Content Container */}
        <div className="flex flex-col">

          {!openTokenSelector && (<>

            <div className="p-3 relative">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0.5`}>Gönderilen</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bakiye: {baseToken && baseToken.balance} {baseToken && baseToken.symbol}</div>
                </div>

                <div className="flex items-center">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`}>
                    <span className={baseToken && baseToken.trend === 'up' ? 'text-green-500' : baseToken && baseToken.trend === 'down' ? 'text-red-500' : ''}>
                      {baseToken && baseToken.change}
                    </span>
                  </div>
                  <button
                    className={`text-xs ${isDarkMode ? 'bg-pink-900/30 text-pink-300 hover:bg-pink-800/40' : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100'} px-2 py-0.5 rounded-lg transition-colors`}
                    onClick={() => handleFromChange({ target: { value: baseToken && baseToken.balance.replace(',', '') } } as React.ChangeEvent<HTMLInputElement>)}
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className={`flex items-center justify-between relative z-10 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} p-2 rounded-xl`}>
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="0.00"
                    className={`w-full text-2xl font-light ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-800 placeholder-gray-300'} focus:outline-none bg-transparent transition-colors`}
                    value={fromAmount}
                    onChange={handleFromChange}
                  />
                  {fromAmount && (
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                      <span>≈ ${(parseFloat(fromAmount) * parseFloat(baseToken ? baseToken?.price.replace('$', '') : '0')).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setTradeType(TradeType.EXACT_INPUT); setOpenTokenSelector(true) }}
                  className="flex items-center truncate ml-2 p-2 min-w-[140px] max-w-[140px] rounded-xl flex justify-between hover:bg-gray-100/50 dark:hover:bg-gray-700/50 active:bg-gray-200/50 transition-all duration-150 relative group"
                >
                  <div className="relative">
                    <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />

                  </div>
                  <div className="flex w-full text-start flex-col items-start mx-2">
                    <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{baseToken && baseToken.symbol}</div>
                  </div>
                  <motion.div
                    animate={{
                      rotateX: openTokenSelector && tradeType === TradeType.EXACT_INPUT ? 180 : 0,
                      y: openTokenSelector && tradeType === TradeType.EXACT_INPUT ? 2 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-pink-500`} />
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Swap Mechanism Button */}
            <div className="flex justify-center items-center relative h-7">
              <div className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-600' : 'via-gray-300'} to-transparent`}></div>
              <motion.button
                className="bg-gradient-to-br from-[#ff1356] to-[#ff4080] text-white p-2 rounded-full z-10 shadow-md"
                whileHover={{ rotate: 180, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSwapTokens}
              >
                <ArrowDownUp className="w-4 h-4" />
              </motion.button>
            </div>


            <div className="p-3 pt-1 relative">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0.5`}>Alınan</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bakiye: {quoteToken && quoteToken.balance} {quoteToken && quoteToken.symbol}</div>
                </div>

                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span className={quoteToken && quoteToken.trend === 'up' ? 'text-green-500' : quoteToken && quoteToken.trend === 'down' ? 'text-red-500' : ''}>
                    {quoteToken && quoteToken.change}
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-between relative z-10 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} p-2 rounded-xl`}>
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="0.00"
                    className={`w-full text-2xl font-light ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-800 placeholder-gray-300'} focus:outline-none bg-transparent transition-colors`}
                    value={toAmount}
                    onChange={handleToChange}
                  />
                  {toAmount && (
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                      <span>≈ ${(parseFloat(toAmount) * parseFloat( quoteToken ? quoteToken?.price.replace('$', '') : '0')).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setTradeType(TradeType.EXACT_OUTPUT); setOpenTokenSelector(true) }}
                  className="flex truncate items-center ml-2 p-2 rounded-xl min-w-[140px] max-w-[140px] flex justify-between hover:bg-gray-100/50 dark:hover:bg-gray-700/50 active:bg-gray-200/50 transition-all duration-150 relative group"
                >
                  <div className="relative">
                    <TokenShape token={quoteToken} isDarkMode={isDarkMode} size="sm" />

                  </div>
                  <div className="flex w-full text-start flex-col text-start items-start mx-2">
                    <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{quoteToken && quoteToken.symbol}</div>
                  </div>
                  <motion.div
                    animate={{
                      rotateX: openTokenSelector && tradeType === TradeType.EXACT_OUTPUT ? 180 : 0,
                      y: openTokenSelector && tradeType === TradeType.EXACT_OUTPUT ? 2 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-pink-500`} />
                  </motion.div>
                </button>
              </div>
            </div>

            <div className="px-3 pb-2">
              {/* Exchange Rate Pill */}
              <div
                className={`${isDarkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-white/70 border-gray-100'} backdrop-blur-sm rounded-full px-3 py-1.5 flex justify-between items-center shadow-sm border mb-2`}
              >
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center">
                    <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
                    <span className="mx-1">→</span>
                    <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="sm" />
                  </div>
                  <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    1 {baseToken && baseToken.symbol} = {rate} {quoteToken && quoteToken.symbol}
                  </div>
                </div>
                <div className="flex items-center text-gray-400">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span className="text-[10px]">Gerçek Zamanlı</span>
                </div>
              </div>

              {/* Exchange & Advanced Settings Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Left column: Exchange Details in 2x2 grid */}
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-gray-100'} rounded-lg p-1.5 border`}>
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>İşlem Ücreti</div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                      <DollarSign className="w-3 h-3 text-[#ff1356] mr-0.5" />
                      $2.84
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-gray-100'} rounded-lg p-1.5 border`}>
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tahmini Süre</div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                      <Clock className="w-3 h-3 text-[#ff1356] mr-0.5" />
                      ~45 saniye
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-gray-100'} rounded-lg p-1.5 border`}>
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>24s Değişim</div>
                    <div className={`font-medium flex items-center ${quoteToken && quoteToken.trend === 'up' ? 'text-green-500' :
                      quoteToken && quoteToken.trend === 'down' ? 'text-red-500' :
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                      {quoteToken && quoteToken.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> :
                        quoteToken && quoteToken.trend === 'down' ? <TrendingUp className="w-3 h-3 mr-0.5 rotate-180" /> :
                          <BarChart3 className="w-3 h-3 mr-0.5" />}
                      {quoteToken && quoteToken.change}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/50 border-gray-100'} rounded-lg p-1.5 border`}>
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>İşlem Limiti</div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                      <AlertCircle className="w-3 h-3 text-[#ff1356] mr-0.5" />
                      Min: 0.001
                    </div>
                  </div>
                </div>

                {/* Right column: Advanced Settings */}
                <div className={`${isDarkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-50 border-gray-100'} rounded-lg p-2 border flex flex-col justify-between`}>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Kayma Toleransı</div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      className={`text-[10px] py-0.5 px-2 rounded-md border ${slippageTolerance === 0.5
                        ? isDarkMode
                          ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                          : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                        : isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-300'
                          : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      onClick={() => setSlippageTolerance(0.5)}
                    >
                      0.5%
                    </button>
                    <button
                      className={`text-[10px] py-0.5 px-2 rounded-md border ${slippageTolerance === 1
                        ? isDarkMode
                          ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                          : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                        : isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-300'
                          : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      onClick={() => setSlippageTolerance(1)}
                    >
                      1%
                    </button>
                    <button
                      className={`text-[10px] py-0.5 px-2 rounded-md border ${slippageTolerance === 2
                        ? isDarkMode
                          ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                          : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                        : isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-300'
                          : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      onClick={() => setSlippageTolerance(2)}
                    >
                      2%
                    </button>
                  </div>

                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1 mb-1`}>İşlem Yapısı</div>
                  <div className="flex space-x-1">
                    <button
                      className={`text-[10px] py-0.5 px-2 rounded-md border ${swapDirection === 'horizontal'
                        ? isDarkMode
                          ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                          : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                        : isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-300'
                          : 'bg-white border-gray-200 text-gray-700'
                        } flex items-center`}
                      onClick={() => setSwapDirection('horizontal')}
                    >
                      <RotateCcw className="w-2.5 h-2.5 mr-0.5" />
                      Standart
                    </button>
                    <button
                      className={`text-[10px] py-0.5 px-2 rounded-md border ${swapDirection === 'optimized'
                        ? isDarkMode
                          ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                          : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                        : isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-300'
                          : 'bg-white border-gray-200 text-gray-700'
                        } flex items-center`}
                      onClick={() => setSwapDirection('optimized')}
                    >
                      <Zap className="w-2.5 h-2.5 mr-0.5" />
                      Optimum
                    </button>
                  </div>
                </div>
              </div>
            </div>


            <div className="px-3 pb-3">
              <motion.button
                className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md text-white relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!fromAmount || parseFloat(fromAmount) === 0}
                style={{
                  background: `linear-gradient(135deg, #ff1356, #ff4080)`
                }}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-white opacity-20">
                  <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                </div>

                <span>İşlemi Başlat</span>
                <Zap className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center justify-center mt-1.5">
                <Shield className="w-3 h-3 text-[#ff1356] mr-1" />
                <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>KEWL Swap güvenlik protokolleri ile korunmaktadır</div>
              </div>
            </div>
          </>)}

          {/* Ortak Token Seçim Paneli - Her iki input için tek liste */}
          <AnimatePresence>
            {openTokenSelector && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`overflow-hidden ${isDarkMode
                  ? 'bg-gray-700/90 border-gray-600'
                  : 'bg-white/90 border-gray-200'
                  }  mt-1 rounded-xl mx-3`}
              >
                <div className="p-3">
                  {/* Arama ve Filtre */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative flex-grow">
                      <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      <input
                        type="text"
                        placeholder="Token ara..."
                        value={tokenFilter}
                        onChange={(e) => setTokenFilter(e.target.value)}
                        className={`w-full pl-9 pr-3 py-1.5 ${isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-200 placeholder-gray-400'
                          : 'bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400'
                          } border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors`}
                      />
                    </div>
                    <button
                      onClick={() => setFavoriteOnly(!favoriteOnly)}
                      className={`text-xs py-1 px-2 rounded-lg border flex items-center shrink-0 ${favoriteOnly
                        ? isDarkMode
                          ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                          : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                        : isDarkMode
                          ? 'bg-gray-600 border-gray-500 text-gray-300'
                          : 'bg-white border-gray-200 text-gray-700'
                        } transition-all duration-300`}
                    >
                      <Star className={`w-3 h-3 mr-1 ${favoriteOnly ? 'fill-[#ff1356]' : ''}`} />
                      Favorites
                    </button>
                    <motion.button
                      onClick={() => {
                        reloadTokens();
                      }}
                      className={`${isDarkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600'
                        : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100 ring-pink-200'
                        } p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Ayarlar"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      className={`${isDarkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600'
                        : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100 ring-pink-200'
                        } p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpenTokenSelector(false)}
                      aria-label="Close"
                    >
                      <XCircle className={`w-6 h-6 `} />
                    </motion.button>


                  </div>

                  {/* Tek Token Listesi - Hangi token seçildiğine bağlı olarak farklı stil */}
                  <div className={`max-h-[600px] overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
                    } pr-1`}>
                    <div className="space-y-1">
                      {filteredTokens.length > 0 ? (
                        filteredTokens.map((token) => {
                          // Seçilen token'un mevcut seçilen input için seçili olup olmadığını kontrol et
                          const isSelected = tradeType === TradeType.EXACT_INPUT
                            ? baseToken && token.symbol === baseToken.symbol
                            : quoteToken && token.symbol === quoteToken.symbol;

                          return (
                            <div
                              key={token.symbol}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 ${isSelected
                                ? isDarkMode
                                  ? 'bg-pink-900/30 border border-pink-800/50'
                                  : 'bg-pink-50 border border-pink-200'
                                : isDarkMode
                                  ? 'hover:bg-gray-600/70 border border-transparent hover:border-gray-500'
                                  : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                }`}
                              onClick={() => selectToken(token)}
                            >
                              <div className="flex items-center">
                                <TokenShape isDarkMode={isDarkMode} token={token} size="sm" />
                                <div className="ml-2">
                                  <div className="flex items-center">
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                      {token.symbol}
                                    </span>
                                    {token.verified && (
                                      <CheckCircle className="w-3 h-3 text-[#ff1356] ml-1" />
                                    )}
                                  </div>
                                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {token.name}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-300`}>
                                  {token.loading ? (
                                    <div className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                                      aria-hidden="true">
                                    </div>
                                  ) : (
                                    token.balance
                                  )}
                                </div>
                                
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={`py-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                          <p>Sonuç bulunamadı</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>



        </div>
      </div>
    </motion.div>
  );
});

SwapForm.displayName = 'SwapForm';

export default SwapForm; 