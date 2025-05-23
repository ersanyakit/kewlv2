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
import { SWAP_MODE, useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useSwapContext } from '../../../context/SwapContext';
import { warningSeverity } from '../../../constants/entities/utils/calculateSlippageAmount';
import ConnectButton from '../../UI/ConnectButton';



interface SwapFormProps {
  disableTokenSelector?: boolean;
}

const SwapForm: React.FC<SwapFormProps> = ({ disableTokenSelector = false }) => {
  // Token context'inden verileri al
  const {
    isDarkMode,
    slippageTolerance,
    baseToken,
    swapMode,
    quoteToken,
    tokenFilter,
    favoriteOnly,
    filteredTokens,
    tradeType,
    openTokenSelector,
    setOpenTokenSelector,
    setTokenFilter,
    setFavoriteOnly,
    selectToken,
    reloadTokens,
    handleSwapTokens,
    setSwapMode,
    setTradeType,
    setAccount,

  } = useTokenContext();

  const {
    isSwapping,
    loading,
    canSwap,
    tradeInfo,
    fromAmount,
    toAmount,
    baseReservePercent,
    quoteReservePercent,
    baseReserveAmount,
    quoteReserveAmount,
    priceImpactWarningSeverity,
    toggleDetails,
    setToggleDetails,
    handleFromChange,
    handleSwap,
    handleToChange } = useSwapContext();
    const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
  const { walletProvider } = useAppKitProvider('eip155');



  useEffect(() => {
    setSwapMode(SWAP_MODE.SIMPLESWAP);
}, []);

  useEffect(() => {
    if(isConnected){
      if(address){
        setAccount(address);
      }
    }

  }, [baseToken, quoteToken,isConnected,address]);

  return (

    <div className="flex flex-col">

      {!openTokenSelector && (<>

        <div className="p-3 relative">
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0.5`}>You Pay</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Balance: {baseToken && baseToken.balance} {baseToken && baseToken.symbol}</div>
            </div>

            <div className="flex gap-1 flex-row items-center">

              {['25', '50', '75', '100'].map((percent) => {
                const label = percent === '100' ? 'MAX' : `${percent}%`;
                return (
                  <button
                    key={percent}
                    className={`text-xs ${isDarkMode
                      ? 'bg-pink-900/30 text-pink-300 hover:bg-pink-800/40'
                      : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100'
                      } px-2 py-0.5 rounded-lg transition-colors`}
                    onClick={() => {
                      const rawBalance = baseToken?.balance.replace(',', '') || '0';
                      const amount = (parseFloat(rawBalance) * (parseInt(percent) / 100)).toString();
                      handleFromChange({ target: { value: amount } } as React.ChangeEvent<HTMLInputElement>);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
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
              disabled={disableTokenSelector}
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
              <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0.5`}>You Receive                  </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Balance: {quoteToken && quoteToken.balance} {quoteToken && quoteToken.symbol}</div>
            </div>

            <div className="flex gap-1 flex-row items-center">

              {['25', '50', '75', '100'].map((percent) => {
                const label = percent === '100' ? 'MAX' : `${percent}%`;
                return (
                  <button
                    key={percent}
                    className={`text-xs ${isDarkMode
                      ? 'bg-pink-900/30 text-pink-300 hover:bg-pink-800/40'
                      : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100'
                      } px-2 py-0.5 rounded-lg transition-colors`}
                    onClick={() => {
                      const rawBalance = quoteToken?.balance.replace(',', '') || '0';
                      const amount = (parseFloat(rawBalance) * (parseInt(percent) / 100)).toString();
                      handleToChange({ target: { value: amount } } as React.ChangeEvent<HTMLInputElement>);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
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
                  <span>≈ ${(parseFloat(toAmount) * parseFloat(quoteToken ? quoteToken?.price.replace('$', '') : '0')).toFixed(2)}</span>
                </div>
              )}
            </div>

            <button
              disabled={disableTokenSelector}
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

        {tradeInfo && (

          <div className="px-3 pb-2">
            {/* Professional Combined Info Panel */}
            <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-100'} backdrop-blur-md rounded-xl px-3 py-2 flex flex-col shadow-lg border mb-2 relative overflow-hidden group`}>
              {/* Enhanced subtle background gradient with animation */}

              {/* Streamlined Header: Exchange Rate with Visual Focus */}
              <div className="flex items-center justify-between relative">
                <div className="flex items-center">
                  {/* Token pair with better visual and subtle animation */}
                  <div className="flex items-center flex-row gap-0">
                    <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
                    <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="sm" />
                  </div>

                  <div className="w-full px-2">
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                      1 {baseToken && baseToken.symbol} = {tradeInfo && tradeInfo.executionPrice.toSignificant(6)} {quoteToken && quoteToken.symbol}
                    </div>
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                      1 {quoteToken && quoteToken.symbol} = {tradeInfo && tradeInfo.executionPrice.invert().toSignificant(6)} {baseToken && baseToken.symbol}
                    </div>
                  </div>
                </div>

                {/* Improved Details toggle button with enhanced visual feedback */}
                <button
                  onClick={() => setToggleDetails(!toggleDetails)}
                  className={`flex items-center justify-center p-1.5 rounded-full transition-all ${isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700/70 hover:text-gray-100 active:bg-gray-600/50'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200/50'
                    } focus:outline-none`}
                  aria-expanded="false"
                  aria-controls="detailsPanel"
                >

                  <div
                    id="expandChevron"
                    className="transition-transform duration-300 bg-gradient-to-r from-[#ff1356]/10 to-[#3b82f6]/10 p-1 rounded-full"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>

                </button>
              </div>

              {/* Metrics band - Elegant unified display with improved hover effects */}
              <div className="mt-2 bg-gradient-to-r from-[#ff1356]/5 via-transparent to-[#3b82f6]/5 rounded-lg p-1.5 flex flex-wrap items-center justify-between">
                {/* Liquidity with mini chart and hover effect */}
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex flex-col mr-1">
                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Liquidity</span>

                    <div className="flex h-1 w-full rounded-full overflow-hidden">
                      <div
                        className="w-full h-full"
                        style={{
                          background: baseReservePercent && quoteReservePercent
                            ? `linear-gradient(to right, #ff4080 0%, #ff4080 ${baseReservePercent.toSignificant(2)}%, #60a5fa ${quoteReservePercent.toSignificant(2)}%, #60a5fa 100%)`
                            : "#e5e7eb" // fallback color
                        }}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{baseReservePercent ? baseReservePercent.toSignificant(2) : " - "}% / {quoteReservePercent ? quoteReservePercent.toSignificant(2) : "-"}%</span>
                </div>

                {/* Slippage with better indicator */}
                <div className="flex flex-col items-center py-0.5 px-1.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors">
                  <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Slippage</span>
                  <span className={`text-[10px] font-medium ${slippageTolerance <= 0.5 ? 'text-green-500' :
                    slippageTolerance <= 1 ? 'text-blue-500' :
                      slippageTolerance <= 2 ? 'text-yellow-500' : 'text-red-500'
                    }`}>{slippageTolerance}%</span>
                </div>

                {/* Price impact with enhanced risk visualization */}
                <div className="flex flex-col items-center py-0.5 px-1.5 rounded-md hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors relative">
                  <span className={`text-[9px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price Impact</span>

                  {/* Risk-based visual impact indicator */}
                  <div className={`flex items-center gap-1 py-0.5 px-2 rounded-full transition-all ${!tradeInfo || !tradeInfo.priceImpact ? 'bg-gray-200/50 dark:bg-gray-700/50' :
                    priceImpactWarningSeverity === 0 ? 'bg-green-100/70 dark:bg-green-900/40' :
                      priceImpactWarningSeverity === 1 ? 'bg-yellow-100/70 dark:bg-yellow-900/40' :
                        priceImpactWarningSeverity === 2 ? 'bg-orange-100/70 dark:bg-orange-900/40' :
                          priceImpactWarningSeverity === 3 ? 'bg-red-100/70 dark:bg-red-900/40' :
                            'bg-red-200/70 dark:bg-red-900/60'
                    }`}>
                    {/* Risk level indicator shape */}
                    {tradeInfo && tradeInfo.priceImpact && (
                      <>
                        {/* Scalable risk indicator shape - becomes more prominent with higher risk */}
                        <div className={`
                            ${priceImpactWarningSeverity === 0 ? 'w-1.5 h-1.5' :
                            priceImpactWarningSeverity === 1 ? 'w-2 h-2' :
                              priceImpactWarningSeverity === 2 ? 'w-2 h-2' : 'w-2.5 h-2.5'}
                            ${priceImpactWarningSeverity === 0 ? 'rounded-full' :
                            priceImpactWarningSeverity === 1 ? 'rounded-full' :
                              priceImpactWarningSeverity === 2 ? 'rounded' : 'rounded-sm'}
                            ${priceImpactWarningSeverity === 0 ? 'bg-green-500' :
                            priceImpactWarningSeverity === 1 ? 'bg-yellow-500' :
                              priceImpactWarningSeverity === 2 ? 'bg-orange-500' :
                                priceImpactWarningSeverity === 3 ? 'bg-red-500' : 'bg-red-700'}
                            ${priceImpactWarningSeverity >= 3 ? 'animate-pulse' : ''}
                            transition-all
                          `}></div>

                        {/* Pulsing ring for high risk levels */}
                        {priceImpactWarningSeverity >= 3 && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -ml-1 w-6 h-6 rounded-full bg-red-500/20 animate-ping"></div>
                        )}
                      </>
                    )}

                    {/* Percentage text */}
                    <span className={`text-[10px] font-medium ${!tradeInfo || !tradeInfo.priceImpact ? 'text-gray-400 dark:text-gray-500' :
                      priceImpactWarningSeverity === 0 ? 'text-green-700 dark:text-green-400' :
                        priceImpactWarningSeverity === 1 ? 'text-yellow-700 dark:text-yellow-400' :
                          priceImpactWarningSeverity === 2 ? 'text-orange-700 dark:text-orange-400' :
                            priceImpactWarningSeverity === 3 ? 'text-red-700 dark:text-red-400' :
                              'text-red-800 dark:text-red-300 font-semibold'
                      }`}>
                      {tradeInfo && tradeInfo.priceImpact ? tradeInfo.priceImpact.toSignificant(2) : "-"}%

                      {/* Adding risk label for medium and higher risks */}
                      {tradeInfo && tradeInfo.priceImpact && priceImpactWarningSeverity >= 1 && (
                        <span className="ml-0.5 text-[8px] italic opacity-80">
                          ({priceImpactWarningSeverity === 1 ? 'medium' :
                            priceImpactWarningSeverity === 2 ? 'high' :
                              priceImpactWarningSeverity === 3 ? 'risky' : 'very high'})
                        </span>
                      )}
                    </span>
                  </div>
                </div>


              </div>

              {/* CSS-only collapsible panel - no JavaScript needed */}
              {toggleDetails && (
                <div
                  id="detailsPanel"
                  className="  peer-checked:h-auto peer-checked:max-h-[800px] peer-checked:opacity-100 peer-checked:visible peer-checked:mt-2 overflow-hidden transition-all duration-300"
                  style={{ transitionProperty: 'max-height, opacity, margin, visibility' }}
                >
                  <div className={`pt-3  ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
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
                        <div className="flex justify-between text-[9px] text-gray-500 mb-1 px-0.5">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080]"></div>
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {baseToken && baseToken.symbol} <span className="text-[8px] font-mono">({baseReserveAmount ? baseReserveAmount.toSignificant(6) : " - "})</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]"></div>
                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {quoteToken && quoteToken.symbol} <span className="text-[8px] font-mono">({quoteReserveAmount ? quoteReserveAmount.toSignificant(6) : " - "})</span>
                            </span>
                          </div>
                        </div>

                        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-200/70'} shadow-inner`}>
                          <div className="flex h-full">
                            <div
                              className="bg-gradient-to-r from-[#ff1356] to-[#ff4080] relative group"
                              style={{ width: baseReservePercent ? `${baseReservePercent.toSignificant(2)}%` : "0%" }}
                            >
                              {/* Hover tooltip for base token reserves */}
                              <div className="absolute opacity-0 group-hover:opacity-100 -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-200">
                                <div className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                  1,234,567 {baseToken && baseToken.symbol}
                                </div>
                              </div>
                            </div>
                            <div
                              className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] relative group"
                              style={{ width: quoteReservePercent ? `${quoteReservePercent.toSignificant(2)}%` : "0%" }}
                            >
                              {/* Hover tooltip for quote token reserves */}
                              <div className="absolute opacity-0 group-hover:opacity-100 -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-200">
                                <div className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                  400,000 {quoteToken && quoteToken.symbol}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Reserve indicator below */}
                        <div className="flex justify-between px-2 mt-1">
                          <div
                            className="w-full h-full"
                            style={{
                              background: baseReservePercent && quoteReservePercent
                                ? `linear-gradient(to right, #ff4080 0%, #ff4080 ${baseReservePercent.toSignificant(2)}%, #60a5fa ${baseReservePercent.toSignificant(2)}%, #60a5fa 100%)`
                                : "#e5e7eb" // fallback color
                            }}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Price Impact
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tradeInfo && tradeInfo.priceImpact ?
                            (priceImpactWarningSeverity === 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                              priceImpactWarningSeverity === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                priceImpactWarningSeverity === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                                  priceImpactWarningSeverity === 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                                    'bg-red-200 text-red-800 dark:bg-red-900/60 dark:text-red-300') :
                            'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {tradeInfo && tradeInfo.priceImpact ? tradeInfo.priceImpact.toSignificant(2) : "-"}%
                          </span>
                        </div>
                      </div>

                      {/* Professional gradient bar with enhanced indicator */}
                      <div className="relative mb-2">
                        {/* Main gradient bar */}
                        <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-200/70'} shadow-inner`}>
                          <div
                            className="h-full w-full"
                            style={{
                              background: 'linear-gradient(to right, #10b981 0%, #10b981 20%, #f59e0b 20%, #f59e0b 40%, #f97316 40%, #f97316 60%, #ef4444 60%, #ef4444 80%, #dc2626 80%, #dc2626 100%)'
                            }}
                          ></div>
                        </div>

                        {/* Enhanced current price impact indicator */}
                        {tradeInfo && tradeInfo.priceImpact && (
                          <div
                            className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
                            style={{
                              left: `${Math.min(Math.max(parseFloat(tradeInfo.priceImpact.toSignificant(2)) * 20, 1), 100)}%`
                            }}
                          >
                            {/* Indicator triangle */}
                            <div className="absolute -bottom-1 -translate-x-1/2 w-0 h-0 
                                           border-l-[6px] border-l-transparent 
                                           border-r-[6px] border-r-transparent 
                                           border-t-[6px] shadow-md"
                              style={{
                                borderTopColor: priceImpactWarningSeverity === 0 ? '#10b981' :
                                  priceImpactWarningSeverity === 1 ? '#f59e0b' :
                                    priceImpactWarningSeverity === 2 ? '#f97316' :
                                      priceImpactWarningSeverity === 3 ? '#ef4444' : '#dc2626'
                              }}
                            ></div>

                            {/* Marker dot with pulse effect */}
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-full shadow-md border-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                                style={{
                                  borderColor: priceImpactWarningSeverity === 0 ? '#10b981' :
                                    priceImpactWarningSeverity === 1 ? '#f59e0b' :
                                      priceImpactWarningSeverity === 2 ? '#f97316' :
                                        priceImpactWarningSeverity === 3 ? '#ef4444' : '#dc2626'
                                }}
                              ></div>

                              {/* Subtle pulse animation for higher impact levels */}
                              {priceImpactWarningSeverity >= 2 && (
                                <div className="absolute w-6 h-6 rounded-full animate-ping opacity-30"
                                  style={{
                                    backgroundColor: priceImpactWarningSeverity === 2 ? '#f97316' :
                                      priceImpactWarningSeverity === 3 ? '#ef4444' : '#dc2626'
                                  }}
                                ></div>
                              )}
                            </div>
                          </div>
                        )}



                      </div>

                      {/* Percentage markers */}
                      <div className="flex justify-between text-[9px] text-gray-500 mb-2 px-0.5">
                        <span>0%</span>
                        <span>1%</span>
                        <span>2%</span>
                        <span>3%</span>
                        <span>5%+</span>
                      </div>

                      {/* Professional legend with severity descriptions */}
                      <div className="grid grid-cols-5 gap-1 text-[9px]">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                          <div className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} text-center`}>Safe</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1"></div>
                          <div className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} text-center`}>Medium</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mb-1"></div>
                          <div className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} text-center`}>High</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mb-1"></div>
                          <div className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-center`}>Risky</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-red-700 mb-1"></div>
                          <div className={`${isDarkMode ? 'text-red-500' : 'text-red-700'} text-center`}>Very High</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {
          isConnected ? 
          <div className="px-3 pb-3">
          <motion.button
            onClick={() => handleSwap(walletProvider)}
            className={`w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md text-white relative overflow-hidden ${!canSwap ? 'opacity-60 cursor-not-allowed' : ''}`}
            whileHover={swapMode == SWAP_MODE.SIMPLESWAP && canSwap ? { scale: 1.02 } : undefined}
            whileTap={swapMode == SWAP_MODE.SIMPLESWAP && canSwap ? { scale: 0.98 } : undefined}
            disabled={(!canSwap || isSwapping) && swapMode == SWAP_MODE.SIMPLESWAP}
            style={{
              background: `linear-gradient(135deg, #ff1356, #ff4080)`
            }}
          >
            {/* Background animation - only show when enabled */}
            {canSwap && swapMode == SWAP_MODE.SIMPLESWAP && (
              <div className="absolute inset-0 bg-white opacity-20">
                <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
              </div>
            )}

            <span>{swapMode == SWAP_MODE.SIMPLESWAP && isSwapping ? "Swapping..." : "Swap"}</span>
            <Zap className="w-4 h-4" />
          </motion.button>


        </div>
          : 
        <div className="px-3 pb-3">
          <ConnectButton />
        </div>
        }
        
       
        
      </>)}

      {/* Ortak Token Seçim Paneli - Her iki input için tek liste */}
      <AnimatePresence>
        {openTokenSelector && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                    
                         {/* Clear button */}
                {tokenFilter && (
                  <button
                    onClick={() => setTokenFilter('')}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-80 transition-colors ${isDarkMode
                      ? 'hover:bg-gray-500/30 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-200/50 text-gray-500 hover:text-gray-700'
                      }`}
                    type="button"
                    aria-label="Clear search"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
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
              <div className={` scrollbar-hide min-h-[53dvh]  max-h-[53dvh]  overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
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
                                parseFloat(token.balance).toFixed(4)
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`py-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p>Token Not Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>

  );
};

SwapForm.displayName = 'SwapForm';

export default SwapForm; 