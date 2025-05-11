import React, { memo, useEffect, useState } from 'react';
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
    Repeat,
} from 'lucide-react';
import { SWAP_MODE, useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { TCustomPair, useSwapContext } from '../../../context/SwapContext';
import { warningSeverity } from '../../../constants/entities/utils/calculateSlippageAmount';

// Token type

// memo ile render performansını optimize etme
const FushionForm: React.FC = () => {
    // Token context'inden verileri al
    const {
        isDarkMode,
        baseToken,
        quoteToken,
        swapMode,
        slippageTolerance,
        selectingTokenIndex,
        tokenFilter,
        favoriteOnly,
        filteredTokens,
        tradeType,
        openTokenSelector,
        riskTolerance,
        setOpenTokenSelector,
        setTokenFilter,
        setFavoriteOnly,
        selectToken,
        reloadTokens,
        handleSwapTokens,
        setSwapMode,
        setSelectingTokenIndex,
        setTradeType,

    } = useTokenContext();

    const {
        isSwapping,
        loading,
        canAggregatorSwap,
        fromAmount,
        toggleDetails,
        aggregatorPairs,
        setAggregatorPairs,
        setToggleDetails,
        handleFromChange,
        handleAggregatorSwap,
        setCanAggregatorSwap,
        handleToChange,
    } = useSwapContext();
    const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
    const { walletProvider } = useAppKitProvider('eip155');




    const toggleDexSelection = (dexId: number) => {
        const updatedPairs = [...aggregatorPairs]; // diziyi kopyala
        updatedPairs[dexId] = {
            ...updatedPairs[dexId],
            isSelected: !updatedPairs[dexId].isSelected, // sadece bu property güncellenir
        };
        setAggregatorPairs(updatedPairs); // yeni referansla state güncellenir
        if (updatedPairs.filter(pair => pair.isSelected).length > 0) {
            setCanAggregatorSwap(true);
        } else {
            setCanAggregatorSwap(false);
        }
    };

    useEffect(() => {

        setSwapMode(SWAP_MODE.AGGREGATOR);

    }, []);

    useEffect(() => {

    }, [baseToken, quoteToken]);

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


                    </div>
                </div>

                {/* Swap Mechanism Button */}
                <div className="flex flex-row gap-2 my-4 justify-center items-center relative h-7">
                    {/* Horizontal line (now below the buttons due to z-index) */}
                    <div className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-600' : 'via-gray-300'} to-transparent`}></div>

                    {/* Base token button with background */}
                    <div className="relative z-20">
                        {/* Background div to hide the line */}
                        <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}></div>

                        <motion.button
                            onClick={() => { setTradeType(TradeType.EXACT_INPUT); setOpenTokenSelector(true) }}
                            className={`z-[100] relative flex flex-row items-center transition-all duration-300 bg-gradient-to-r from-[#ff1356]/10 to-[#3b82f6]/10 p-1 rounded-full group`}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 0 8px rgba(255, 19, 86, 0.3)",
                                backgroundColor: isDarkMode ? "rgba(255, 19, 86, 0.15)" : "rgba(255, 19, 86, 0.1)"
                            }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="relative">
                                <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
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
                            <div className="flex w-full text-start flex-col items-start mx-2">
                                <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{baseToken && baseToken.symbol}</div>
                            </div>
                        </motion.button>
                    </div>

                    {/* Swap button with background */}
                    <div className="relative z-20">
                        {/* Background div to hide the line */}
                        <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}></div>

                        <motion.button
                            className="relative bg-gradient-to-br from-[#ff1356] to-[#ff4080] text-white p-2 rounded-full shadow-md"
                            whileHover={{ rotate: 180, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSwapTokens}
                        >
                            <Repeat className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Quote token button with background */}
                    <div className="relative z-20">
                        {/* Background div to hide the line */}
                        <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}></div>

                        <motion.button
                            onClick={() => { setTradeType(TradeType.EXACT_OUTPUT); setOpenTokenSelector(true) }}
                            className="relative z-[100] flex flex-row items-center transition-all duration-300 bg-gradient-to-r from-[#ff1356]/10 to-[#3b82f6]/10 p-1 rounded-full group"
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 0 8px rgba(59, 130, 246, 0.3)",
                                backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)"
                            }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                        >
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
                            <div className="relative">
                                <TokenShape token={quoteToken} isDarkMode={isDarkMode} size="sm" />
                            </div>
                        </motion.button>
                    </div>
                </div>




                <div className='flex flex-col gap-3 p-3'>
                    <div className="flex items-center justify-between">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Available DEXes
                        </div>
                        <button
                            onClick={() => setToggleDetails(!toggleDetails)}
                            className={`text-xs flex items-center px-2 py-0.5 rounded-full transition-colors ${isDarkMode
                                ? toggleDetails ? 'bg-[#ff1356]/20 text-[#ff4080]' : 'hover:bg-gray-700/70 text-gray-300 hover:text-[#ff4080]'
                                : toggleDetails ? 'bg-[#ff1356]/10 text-[#ff1356]' : 'hover:bg-gray-100 text-gray-500 hover:text-[#ff1356]'
                                }`}
                        >
                            {toggleDetails ? 'Hide Details' : 'Show Details'}
                            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${toggleDetails ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {aggregatorPairs.map((dex: TCustomPair, index: number) => {


                            return (
                                <motion.div
                                    key={dex.pair.pair.toString()}
                                    className={`rounded-xl ${isDarkMode
                                        ? dex.isSelected ? 'bg-[#ff1356]/15 border border-[#ff4080]/30' : 'bg-gray-700/50 border border-gray-600/30'
                                        : dex.isSelected ? 'bg-[#ff1356]/5 border border-[#ff1356]/20' : 'bg-white/70 border border-gray-200/70'
                                        } transition-all duration-200 ${dex.isSelected ? 'shadow-sm' : ''}`}
                                    whileHover={{ scale: 1.005, boxShadow: dex.isSelected ? "0 4px 12px rgba(255, 19, 86, 0.07)" : "0 2px 8px rgba(0, 0, 0, 0.03)" }}
                                    whileTap={{ scale: 0.995 }}
                                    onClick={() => toggleDexSelection(index)}
                                >
                                    <div className="flex justify-between items-center p-3">
                                        <div className="flex items-center space-x-2.5">
                                            <div className={`p-2 rounded-full ${dex.isSelected
                                                ? isDarkMode ? 'bg-[#ff1356]/20 ring-1 ring-[#ff4080]/30' : 'bg-white ring-1 ring-[#ff1356]/20'
                                                : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                                                }`}>
                                                <img
                                                    src={dex.exchangeInfo.logo || `/assets/logo/logo.svg`}
                                                    alt={dex.exchangeInfo.dex}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className={`font-medium ${dex.isSelected
                                                    ? isDarkMode ? 'text-white' : 'text-gray-900'
                                                    : isDarkMode ? 'text-gray-100' : 'text-gray-800'
                                                    }`}>
                                                    {dex.exchangeInfo.dex}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex items-center gap-1">
                                                        <span className={`text-lg font-large ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                            {dex.trade.outputAmount.toSignificant(6)}
                                                        </span>
                                                    </div>

                                                    {/* Status Badge with updated colors */}
                                                    <span
                                                        className={`text-xs px-1.5 py-0.5 rounded-full ${dex.warningSeverity === 0
                                                            ? isDarkMode
                                                                ? 'bg-green-900/50 text-green-300 ring-1 ring-green-700/50'
                                                                : 'bg-green-100 text-green-700 ring-1 ring-green-300/50'
                                                            : dex.warningSeverity === 1
                                                                ? isDarkMode
                                                                    ? 'bg-blue-900/40 text-blue-300 ring-1 ring-blue-700/40'
                                                                    : 'bg-blue-100 text-blue-700 ring-1 ring-blue-300/40'
                                                                : dex.warningSeverity === 2
                                                                    ? isDarkMode
                                                                        ? 'bg-yellow-900/40 text-yellow-300 ring-1 ring-yellow-700/40'
                                                                        : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300/40'
                                                                    : dex.warningSeverity === 3
                                                                        ? isDarkMode
                                                                            ? 'bg-orange-900/40 text-orange-300 ring-1 ring-orange-700/40'
                                                                            : 'bg-orange-100 text-orange-700 ring-1 ring-orange-300/40'
                                                                        : isDarkMode
                                                                            ? 'bg-red-900/30 text-red-300 ring-1 ring-red-700/40'
                                                                            : 'bg-red-100 text-red-700 ring-1 ring-red-300/40'
                                                            }`}
                                                    >
                                                        {dex.warningSeverityText} %{dex.trade.priceImpact.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {/* Updated checkbox with correct brand gradient */}
                                            <motion.div
                                                className={`relative w-5 h-5 rounded-full flex items-center justify-center cursor-pointer shadow-sm overflow-hidden 
                        ${dex.isSelected
                                                        ? 'bg-gradient-to-br from-[#ff1356] to-[#ff4080]'
                                                        : isDarkMode
                                                            ? 'bg-gray-700/80 hover:bg-gray-600/80 border border-gray-600/80'
                                                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                                                    } transition-all duration-200`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDexSelection(index);
                                                }}
                                                style={{
                                                    boxShadow: dex.isSelected
                                                        ? isDarkMode
                                                            ? '0 0 0 2px rgba(255, 64, 128, 0.3)'
                                                            : '0 0 0 2px rgba(255, 19, 86, 0.2)'
                                                        : 'none'
                                                }}
                                            >
                                                {/* Enhanced glow effect with brand colors */}
                                                {dex.isSelected && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-white opacity-20"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.2 }}
                                                        layoutId={`glow-${dex.pair.pair.toString()}`}
                                                    >
                                                        <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                                                    </motion.div>
                                                )}

                                                <AnimatePresence>
                                                    {dex.isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </div>
                                    </div>



                                    <AnimatePresence>
                                        {toggleDetails && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className={`p-2.5 mx-3 mb-3 rounded-lg ${dex.isSelected
                                                    ? isDarkMode ? 'bg-gradient-to-br from-[#ff1356]/10 to-[#ff4080]/10 border-b border-[#ff4080]/20'
                                                        : 'bg-gradient-to-br from-[#ff1356]/5 to-[#ff4080]/5 border-b border-[#ff1356]/10'
                                                    : isDarkMode ? 'bg-gray-800/80 border-b border-gray-700/30'
                                                        : 'bg-white border-b border-gray-200/50'
                                                    }`}>
                                                    {/* Top row - exchange rate and impact in a single row */}
                                                    <div className="w-full flex flex-row items-center justify-between gap-2 mb-2.5">
                                                        <div className={`flex items-center gap-1.5 py-1 px-1.5 rounded-full ${dex.isSelected
                                                            ? isDarkMode ? 'bg-[#ff1356]/15' : 'bg-[#ff1356]/5'
                                                            : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/80'
                                                            }`}>
                                                            <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
                                                            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                1 {baseToken?.symbol}
                                                            </span>
                                                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>=</span>
                                                            <span className={`text-xs font-medium ${dex.isSelected
                                                                ? isDarkMode ? 'text-[#ff4080]' : 'text-[#ff1356]'
                                                                : isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                                                }`}>
                                                                {dex.trade.executionPrice.toSignificant(6)}
                                                            </span>
                                                            <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="sm" />
                                                        </div>
                                                        <div className={`flex items-center gap-1.5 py-1 px-1.5 rounded-full ${dex.isSelected
                                                            ? isDarkMode ? 'bg-[#ff1356]/15' : 'bg-[#ff1356]/5'
                                                            : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/80'
                                                            }`}>
                                                            <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="sm" />
                                                            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                1 {quoteToken?.symbol}
                                                            </span>
                                                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>=</span>
                                                            <span className={`text-xs font-medium ${dex.isSelected
                                                                ? isDarkMode ? 'text-[#ff4080]' : 'text-[#ff1356]'
                                                                : isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                                                }`}>
                                                                {dex.trade.executionPrice.invert().toSignificant(6)}
                                                            </span>
                                                            <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
                                                        </div>



                                                    </div>

                                                    {/* Combined compact info section */}
                                                    <div className="flex items-center justify-between mb-3 gap-3">
                                                        <div className="flex items-center gap-2">

                                                            <div>
                                                                <div className="flex items-center gap-1">
                                                                    <TokenShape isDarkMode={isDarkMode} token={baseToken} size="sm" />
                                                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{baseToken?.symbol}</span>
                                                                </div>
                                                                <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{dex.baseLiqudity.toSignificant(6)} {baseToken?.symbol} ({dex.baseReservePercent.toSignificant(2)}%)</div>
                                                            </div>
                                                        </div>



                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                <div className="flex items-center gap-1 justify-end">
                                                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{quoteToken?.symbol}</span>
                                                                    <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="sm" />
                                                                </div>
                                                                <div className={`text-[10px] font-medium text-right ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{dex.quoteLiquidity.toSignificant(6)} {quoteToken?.symbol} ({dex.quoteReservePercent.toSignificant(2)}%)</div>
                                                            </div>

                                                        </div>
                                                    </div>


                                                    <div className="w-full">
                                                        <div className="w-full min-h-[5px] h-[5px] radius-full p-1 rounded-full"
                                                            style={{
                                                                width: '100%',
                                                                background: `linear-gradient(
                                                                    to right,
                                                                #3b82f6 0%,
                                                                    #3b82f6 ${dex.baseReservePercent.toSignificant(2)}%,
                                                                    #ff1356 ${dex.quoteReservePercent.toSignificant(2)}%,
                                                                    #ff1356 ${dex.totalReservePercent.toSignificant(2)}%)`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>



                <div className="pt-5 px-3 pb-3">
                    <motion.button
                        onClick={() => handleAggregatorSwap(walletProvider)}
                        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md text-white relative overflow-hidden ${!canAggregatorSwap ? 'opacity-60 cursor-not-allowed' : ''}`}
                        whileHover={canAggregatorSwap ? { scale: 1.02 } : undefined}
                        whileTap={canAggregatorSwap ? { scale: 0.98 } : undefined}
                        disabled={(!canAggregatorSwap || isSwapping) && swapMode == SWAP_MODE.AGGREGATOR}
                        style={{
                            background: `linear-gradient(135deg, #ff1356, #ff4080)`
                        }}
                    >
                        {/* Background animation - only show when enabled */}
                        {canAggregatorSwap && swapMode == SWAP_MODE.AGGREGATOR && (
                            <div className="absolute inset-0 bg-white opacity-20">
                                <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                            </div>
                        )}

                        <span>{swapMode == SWAP_MODE.AGGREGATOR && isSwapping ? "Swapping..." : "Swap"}</span>
                        <Zap className="w-4 h-4" />
                    </motion.button>


                </div>
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
                            <div className={` min-h-[53dvh]  max-h-[53dvh]  overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
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
                                            <p>No Token Found</p>
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

FushionForm.displayName = 'FushionForm';

export default FushionForm; 