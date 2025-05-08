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
              {/* Professional Combined Info Panel */}
              <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-100'} backdrop-blur-md rounded-xl px-3 py-2 flex flex-col shadow-lg border mb-2 relative overflow-hidden group`}>
                {/* Enhanced subtle background gradient with animation */}
                
                {/* Streamlined Header: Exchange Rate with Visual Focus */}
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center">
                    {/* Token pair with better visual and subtle animation */}
                    <div className="relative flex items-center rounded-full overflow-hidden transition-transform duration-300 hover:scale-105">
                      <div className="flex items-center rounded-full overflow-hidden p-0.5 bg-gradient-to-r from-[#ff1356]/20 to-[#3b82f6]/20">
                        <div className={`p-0.5 z-10 rounded-full ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'}`}>
                    <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
                        </div>
                        <div className={`absolute p-0.5 rounded-full left-4 z-20 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-sm`}>
                    <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="sm" />
                  </div>
                </div>
              </div>

                    {/* Rate info with better typography and subtle highlight */}
                    <div className="ml-5">
                      <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Rate: <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-semibold`}>{rate}</span>
                      </div>
                      <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                        1 {baseToken && baseToken.symbol} = {rate} {quoteToken && quoteToken.symbol}
                        <span className="flex items-center ml-1 text-gray-400 bg-gray-100/50 dark:bg-gray-700/50 px-1 py-0.5 rounded-full">
                          <RefreshCw className="w-2 h-2 mr-0.5 animate-pulse" />
                          <span className="text-[8px]">Live</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Improved Details toggle button with enhanced visual feedback */}
                  <button 
                    className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700/70 hover:text-gray-100 active:bg-gray-600/50' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200/50'
                    } focus:outline-none focus:ring-1 focus:ring-[#ff1356]/30`}
                    aria-expanded="false"
                    aria-controls="detailsPanel"
                  >
                    <span className={`text-xs mr-1.5 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Details</span>
                    <label 
                      htmlFor="details-toggle" 
                      className="cursor-pointer"
                    >
                      <div 
                        id="expandChevron" 
                        className="transition-transform duration-300 bg-gradient-to-r from-[#ff1356]/10 to-[#3b82f6]/10 p-1 rounded-full"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </label>
                  </button>
                  {/* Hidden checkbox for CSS-only toggle */}
                  <input type="checkbox" id="details-toggle" className="hidden peer" />
                </div>
                
                {/* Metrics band - Elegant unified display with improved hover effects */}
                <div className="mt-2 bg-gradient-to-r from-[#ff1356]/5 via-transparent to-[#3b82f6]/5 rounded-lg p-1.5 flex flex-wrap items-center justify-between">
                  {/* Liquidity with mini chart and hover effect */}
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex flex-col mr-1">
                      <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Liquidity</span>
                      <div className="flex items-center">
                        <div className="h-1 w-5 rounded-l-full bg-gradient-to-r from-[#ff1356] to-[#ff4080]"></div>
                        <div className="h-1 w-2 rounded-r-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]"></div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>70/30</span>
                  </div>
                  
                  {/* Slippage with better indicator */}
                  <div className="flex flex-col items-center py-0.5 px-1.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors">
                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Slippage</span>
                    <span className={`text-[10px] font-medium ${
                      slippageTolerance <= 0.5 ? 'text-green-500' : 
                      slippageTolerance <= 1 ? 'text-blue-500' : 
                      slippageTolerance <= 2 ? 'text-yellow-500' : 'text-red-500'
                    }`}>{slippageTolerance}%</span>
                    </div>
                  
                  {/* Price impact with improved indicator */}
                  <div className="flex flex-col items-center py-0.5 px-1.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors">
                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price Impact</span>
                    <span className={`text-[10px] font-medium ${
                      1.2 <= 0.5 ? 'text-green-500' : 
                      1.2 <= 1.5 ? 'text-blue-500' : 
                      1.2 <= 3 ? 'text-yellow-500' : 'text-red-500'
                    }`}>1.2%</span>
                  </div>
                  
                  {/* 24h Volume with better indicator */}
                  <div className="flex flex-col items-center py-0.5 px-1.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors">
                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>24h Volume</span>
                    <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>$2.4M</span>
                  </div>
                </div>

                {/* CSS-only collapsible panel - no JavaScript needed */}
                <div 
                  id="detailsPanel"
                  className="  peer-checked:h-auto peer-checked:max-h-[800px] peer-checked:opacity-100 peer-checked:visible peer-checked:mt-2 overflow-hidden transition-all duration-300"
                  style={{transitionProperty: 'max-height, opacity, margin, visibility'}}
                >
                  <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                    {/* Improved Liquidity Distribution with amounts */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Liquidity Distribution
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080] mr-1"></div>
                            <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {baseToken && baseToken.symbol}: 70%
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] mr-1"></div>
                            <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {quoteToken && quoteToken.symbol}: 30%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced progress bar with quantity indicators */}
                      <div className="relative group pb-1">
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-200/70'} shadow-inner`}>
                          <div className="flex h-full">
                            <div 
                              className="bg-gradient-to-r from-[#ff1356] to-[#ff4080] relative" 
                              style={{ width: '70%' }}
                            >
                              {/* Base token amount indicator */}
                              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <div className={`text-[9px] font-medium px-1 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                  1,234,567 {baseToken && baseToken.symbol}
                                </div>
                              </div>
                            </div>
                            <div 
                              className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] relative" 
                              style={{ width: '30%' }}
                            >
                              {/* Quote token amount indicator */}
                              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <div className={`text-[9px] font-medium px-1 py-0.5 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                  400,000 {quoteToken && quoteToken.symbol}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Impact - Professional Trading Terminal Design */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2.5">
                        <div className={`text-xs font-semibold tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center`}>
                          <div className="inline-block w-1 h-5 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 rounded-full mr-1.5"></div>
                          PRICE IMPACT
                        </div>
                        <div className="flex items-center">
                          <div className={`text-xs py-0.5 px-2 rounded-md font-medium mr-2 ${
                            1.2 <= 0.5 ? 'bg-green-500/15 text-green-500 border border-green-500/30' : 
                            1.2 <= 1.5 ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30' : 
                            1.2 <= 3 ? 'bg-orange-500/15 text-orange-500 border border-orange-500/30' : 
                            'bg-red-500/15 text-red-500 border border-red-500/30'
                          }`}>1.2%</div>
                          <div className={`text-[10px] font-medium text-gray-500 flex items-center`}>
                            <span className="mr-1">TOLERANCE:</span>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-orange-500/20 text-orange-500">{slippageTolerance}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Financial Terminal-Style Visualization */}
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/70 border-gray-700/50' : 'bg-gray-50/90 border-gray-200/70'} border shadow-sm hover:shadow-md transition-shadow duration-300`}>
                        {/* Precise meter track with tick marks */}
                        <div className="relative mb-4 group">
                          {/* Base track with tick marks - reduced height */}
                          <div className={`h-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden shadow-inner`}>
                            {/* Professional color segments with smooth borders - fixed gaps between colors */}
                            <div className="absolute inset-y-0 left-0 right-[80%] bg-gradient-to-r from-green-500 to-green-400 rounded-l-md"></div>
                            <div className="absolute inset-y-0 left-[19.5%] right-[60%] bg-gradient-to-r from-green-400 to-yellow-500"></div>
                            <div className="absolute inset-y-0 left-[39.5%] right-[40%] bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                            <div className="absolute inset-y-0 left-[59.5%] right-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-r-md"></div>
                            
                            {/* Precise tick marks - adjusted height */}
                            <div className="absolute inset-0 flex justify-between px-[0%]">
                              <div className="h-[45%] w-[1px] bg-white/40 dark:bg-gray-900/40 self-end"></div>
                              <div className="h-[45%] w-[1px] bg-white/40 dark:bg-gray-900/40 self-end"></div>
                              <div className="h-[45%] w-[1px] bg-white/40 dark:bg-gray-900/40 self-end"></div>
                              <div className="h-[45%] w-[1px] bg-white/40 dark:bg-gray-900/40 self-end"></div>
                              <div className="h-[45%] w-[1px] bg-white/40 dark:bg-gray-900/40 self-end"></div>
                              <div className="h-[45%] w-[1px] bg-white/40 dark:bg-gray-900/40 self-end"></div>
                            </div>
                            
                            {/* Professional current value marker - improved with animation and arrow indicator */}
                            <div className="absolute inset-y-0 z-20" style={{ left: '24%' }}>
                              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-0.5 bg-white dark:bg-gray-900"></div>
                              
                              {/* Added arrow pointing down */}
                              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 transform rotate-180">
                                <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent ${
                                  1.2 <= 0.5 ? 'border-b-green-600' : 
                                  1.2 <= 1.5 ? 'border-b-yellow-600' : 
                                  1.2 <= 3 ? 'border-b-orange-600' : 
                                  'border-b-red-600'
                                }`}></div>
                              </div>
                              
                              {/* Current value marker with improved visibility */}
                              <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white dark:bg-gray-900 border-2 ${
                                1.2 <= 0.5 ? 'border-green-500' : 
                                1.2 <= 1.5 ? 'border-yellow-500' : 
                                1.2 <= 3 ? 'border-orange-500' : 
                                'border-red-500'
                              } shadow-md group-hover:scale-110 transition-transform duration-200`}></div>
                              
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-yellow-600'} border border-yellow-500/30 shadow-sm`}>
                                  Current: 1.2%
                                </div>
                              </div>
                            </div>
                            
                            {/* Professional slippage indicator - adjusted size */}
                            <div className="absolute inset-y-0 z-10" style={{ left: `${slippageTolerance * 20}%` }}>
                              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-[1.5px] bg-orange-500"></div>
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <div className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${isDarkMode ? 'bg-gray-700 text-orange-400' : 'bg-white text-orange-600'} border border-orange-500/30 shadow-sm`}>
                                  Tolerance: {slippageTolerance}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Financial terminal-style labels */}
                        <div className="flex justify-between text-[9px] text-gray-500 font-mono mb-3 px-0">
                          <div className="flex flex-col items-center">
                            <div className="h-1 w-[1px] bg-gray-400 mb-1"></div>
                            <div>0.0%</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-1 w-[1px] bg-gray-400 mb-1"></div>
                            <div>1.0%</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-1 w-[1px] bg-gray-400 mb-1"></div>
                            <div>2.0%</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-1 w-[1px] bg-gray-400 mb-1"></div>
                            <div>3.0%</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-1 w-[1px] bg-gray-400 mb-1"></div>
                            <div>4.0%</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-1 w-[1px] bg-gray-400 mb-1"></div>
                            <div>5.0%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional transaction details - Enhanced layout with interactive elements */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className={`rounded-lg p-2 ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/70 hover:bg-gray-100'} transition-colors duration-200 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}>
                        <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-0.5`}>Transaction Type</div>
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <Shield className="w-3 h-3 text-[#ff1356] mr-1" />
                          Verified Swap
                        </div>
                      </div>
                      <div className={`rounded-lg p-2 ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-100/70 hover:bg-gray-100'} transition-colors duration-200 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}>
                        <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-0.5`}>Liquidity Factor</div>
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          3.1x <span className="ml-1 text-green-500">(High)</span>
                        </div>
                      </div>
                    </div>
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