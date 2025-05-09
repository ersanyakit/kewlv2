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
import { useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useSwapContext } from '../../../context/SwapContext';
import { warningSeverity } from '../../../constants/entities/utils/calculateSlippageAmount';

// Token type

// memo ile render performansını optimize etme
const FushionForm: React.FC = () => {
    // Token context'inden verileri al
    const {
        isDarkMode,
        baseToken,
        quoteToken,
        slippageTolerance,
        selectingTokenIndex,
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
        setSelectingTokenIndex,
        setTradeType,

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
        handleToChange,
    } = useSwapContext();
    const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
    const { walletProvider } = useAppKitProvider('eip155');

    
    const [allDexes, setAllDexes] = useState<any>(
        [
            {
                isSelected: false,
                id: 'pancakeswap',
                name: 'PancakeSwap',
                logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
                price: '0.01245',
                liquidity: '2,456,789',
                baseReserve: '120,456',
                quoteReserve: '185,789',
                priceBase: '10',
                priceQuote: '10',
                baseReservePercent: 65,
            },
            {
                isSelected: false,
                id: 'uniswap',
                name: 'Uniswap',
                logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
                price: '0.01252',
                liquidity: '1,865,432',
                baseReserve: '98,765',
                quoteReserve: '156,432',
                priceBase: '10',
                priceQuote: '10',
                baseReservePercent: 58,
            },
            {
                isSelected: false,
                id: 'sushiswap',
                name: 'SushiSwap',
                logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
                price: '0.01238',
                priceBase: '10',
                priceQuote: '10',
                liquidity: '1,156,789',
                baseReserve: '76,543',
                quoteReserve: '89,432',
                baseReservePercent: 45,
            },
            {
                isSelected: false,
                id: 'quickswap',
                name: 'QuickSwap',
                logo: 'https://cryptologos.cc/logos/quickswap-quick-logo.png',
                price: '0.01260',
                liquidity: '875,321',
                priceBase: '10',
                priceQuote: '10',
                baseReserve: '45,678',
                quoteReserve: '56,789',
                baseReservePercent: 40,
            }
        
        ]
    );

    // Yeni eklenen fonksiyon - DEX seçimini toggle eden handler
    const toggleDexSelection = (dexId: string) => {
        setAllDexes(prevDexes => 
            prevDexes.map(dex => 
                dex.id === dexId ? {...dex, isSelected: !dex.isSelected} : dex
            )
        );
    };

    useEffect(() => {

        console.log("ersan baseToken", baseToken);
        console.log("ersan quoteToken", quoteToken);

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
                <div className="flex flex-row gap-2 justify-center items-center relative h-7">
                    {/* Horizontal line (now below the buttons due to z-index) */}
                    <div className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-600' : 'via-gray-300'} to-transparent`}></div>

                    {/* Base token button with background */}
                    <div className="relative z-20">
                        {/* Background div to hide the line */}
                        <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}></div>
                        
                        <motion.button
                            onClick={() => { setTradeType(TradeType.EXACT_INPUT); setOpenTokenSelector(true) }}
                            className={`z-[100] relative flex flex-row items-center transition-all duration-300 bg-gradient-to-r from-[#ff1356]/10 to-[#3b82f6]/10 p-1 rounded-full`}
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




<div className='flex flex-col gap-3 mt-4 p-3'>
    <div className="flex items-center justify-between">
        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Available DEXes
        </div>
        <button 
            onClick={() => setToggleDetails(!toggleDetails)} 
            className={`text-xs flex items-center ${isDarkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-500 hover:text-pink-600'}`}
        >
            {toggleDetails ? 'Hide Details' : 'Show Details'}
            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${toggleDetails ? 'rotate-180' : ''}`} />
        </button>
    </div>
    
    <div className="grid grid-cols-1 gap-2">
    {allDexes.map((dex, index) => {
        const isSelected = dex.isSelected;
        
        return (
        <motion.div 
            key={dex.id}
            className={`rounded-xl p-3 ${isDarkMode 
                ? isSelected ? 'bg-pink-900/30 border border-pink-800/50' : 'bg-gray-700/50 border border-gray-600/50' 
                : isSelected ? 'bg-pink-50 border border-pink-200' : 'bg-white/50 border border-gray-200'
            } transition-all duration-200`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => toggleDexSelection(dex.id)}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <img 
                            src={dex.logo || `https://via.placeholder.com/20?text=${dex.name}`} 
                            alt={dex.name} 
                            className="w-5 h-5 rounded-md" 
                        />
                    </div>
                    <div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            {dex.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center space-x-1">
                                <span className={`text-xs ${
                                    parseFloat(dex.price) > 0.0125 
                                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                        : parseFloat(dex.price) < 0.0124
                                            ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                            : isDarkMode ? 'text-amber-400' : 'text-amber-600'
                                }`}>
                                    ${dex.price || '---'}
                                </span>
                            </div>
                            
                            {/* DEX Status Badge */}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                parseFloat(dex.price) > 0.0125 
                                    ? isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                                    : parseFloat(dex.price) < 0.0124
                                        ? isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                                        : isDarkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {parseFloat(dex.price) > 0.0125 ? 'Best Rate' : parseFloat(dex.price) < 0.0124 ? 'High Impact' : 'Average'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Improved Multi-selection Checkbox */}
                    <motion.div 
                        className={`relative w-5 h-5 rounded-full flex items-center justify-center cursor-pointer shadow-sm overflow-hidden 
                        ${isSelected 
                            ? isDarkMode 
                                ? 'bg-gradient-to-br from-pink-500 to-pink-600 ring-pink-700/50' 
                                : 'bg-gradient-to-br from-pink-500 to-pink-600 ring-pink-500/30'
                            : isDarkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                                : 'bg-white hover:bg-gray-50 border border-gray-200'
                        } transition-all duration-200`}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDexSelection(dex.id);
                        }}
                        style={{
                            boxShadow: isSelected 
                                ? isDarkMode 
                                    ? '0 0 0 2px rgba(219, 39, 119, 0.2)' 
                                    : '0 0 0 2px rgba(219, 39, 119, 0.2)'
                                : 'none'
                        }}
                    >
                        {/* Background glow effect for selected state */}
                        {isSelected && (
                            <motion.div 
                                className="absolute inset-0 bg-white opacity-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.2 }}
                                layoutId={`glow-${dex.id}`}
                            >
                                <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                            </motion.div>
                        )}
                        
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            
            {/* Enhanced Detail View */}
            <AnimatePresence>
                {toggleDetails && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 overflow-hidden"
                    >
                        <div className={`p-3 rounded-lg ${
                            isSelected 
                                ? isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50/80' 
                                : isDarkMode ? 'bg-gray-800/80' : 'bg-gray-50'
                        } backdrop-blur-sm`}>
                            {/* Stat Grid Layout */}
                            <div className="grid grid-cols-2 gap-2">
                                {/* Left Column - Exchange Rate & Analytics */}
                                <div className="space-y-2">
                                    {/* Exchange Rate Card */}
                                    <div className={`rounded-lg p-2 ${
                                        isSelected
                                            ? isDarkMode ? 'bg-pink-900/30 border border-pink-800/50' : 'bg-white border border-pink-100/70'
                                            : isDarkMode ? 'bg-gray-700/60' : 'bg-white/90'
                                    } transition-colors`}>
                                        <div className={`text-xs font-medium mb-1 ${
                                            isSelected
                                                ? isDarkMode ? 'text-pink-200' : 'text-pink-700'
                                                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            Exchange Rate
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1">
                                                <TokenShape isDarkMode={isDarkMode} token={baseToken} size="xs" />
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    1 {baseToken?.symbol}
                                                </span>
                                            </div>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                =
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className={`text-xs font-medium ${
                                                    isSelected
                                                        ? isDarkMode ? 'text-pink-200' : 'text-pink-700'
                                                        : isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                                }`}>
                                                    {(parseFloat(dex.priceBase)/parseFloat(dex.priceQuote)).toFixed(4)}
                                                </span>
                                                <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="xs" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Swap Analytics Card */}
                                    <div className={`rounded-lg p-2 ${
                                        isSelected
                                            ? isDarkMode ? 'bg-pink-900/30 border border-pink-800/50' : 'bg-white border border-pink-100/70'
                                            : isDarkMode ? 'bg-gray-700/60' : 'bg-white/90'
                                    } transition-colors`}>
                                        <div className={`text-xs font-medium mb-1 ${
                                            isSelected
                                                ? isDarkMode ? 'text-pink-200' : 'text-pink-700'
                                                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            Swap Analytics
                                        </div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Price Impact
                                            </span>
                                            <span className={`text-xs font-medium ${
                                                parseFloat(dex.price) > 0.0125 
                                                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                    : parseFloat(dex.price) < 0.0124
                                                        ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                                        : isDarkMode ? 'text-amber-400' : 'text-amber-600'
                                            }`}>
                                                {((parseFloat(dex.price) - 0.01245) / 0.01245 * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Total Liquidity
                                            </span>
                                            <span className={`text-xs font-medium ${
                                                isSelected
                                                    ? isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                ${dex.liquidity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Column - Token Prices & Reserves */}
                                <div className="space-y-2">
                                    {/* Token Prices Card */}
                                    <div className={`rounded-lg p-2 ${
                                        isSelected
                                            ? isDarkMode ? 'bg-pink-900/30 border border-pink-800/50' : 'bg-white border border-pink-100/70'
                                            : isDarkMode ? 'bg-gray-700/60' : 'bg-white/90'
                                    } transition-colors`}>
                                        <div className={`text-xs font-medium mb-1 ${
                                            isSelected
                                                ? isDarkMode ? 'text-pink-200' : 'text-pink-700'
                                                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            Token Prices
                                        </div>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1">
                                                <TokenShape isDarkMode={isDarkMode} token={baseToken} size="xs" />
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {baseToken?.symbol}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-medium ${
                                                isSelected
                                                    ? isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                ${dex.priceBase}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1">
                                                <TokenShape isDarkMode={isDarkMode} token={quoteToken} size="xs" />
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {quoteToken?.symbol}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-medium ${
                                                isSelected
                                                    ? isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                ${dex.priceQuote}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Token Reserves Card */}
                                    <div className={`rounded-lg p-2 ${
                                        isSelected
                                            ? isDarkMode ? 'bg-pink-900/30 border border-pink-800/50' : 'bg-white border border-pink-100/70'
                                            : isDarkMode ? 'bg-gray-700/60' : 'bg-white/90'
                                    } transition-colors`}>
                                        <div className={`text-xs font-medium mb-1 ${
                                            isSelected
                                                ? isDarkMode ? 'text-pink-200' : 'text-pink-700'
                                                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            Token Reserves
                                        </div>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {baseToken?.symbol}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-xs font-medium ${
                                                    isSelected
                                                        ? isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    {dex.baseReserve}
                                                </span>
                                                <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {dex.baseReservePercent}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {quoteToken?.symbol}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-xs font-medium ${
                                                    isSelected
                                                        ? isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    {dex.quoteReserve}
                                                </span>
                                                <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {100 - dex.baseReservePercent}%
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Enhanced Reserve Bar */}
                                        <div className="relative h-2 mt-0.5 rounded-full overflow-hidden 
                                            bg-gray-200 dark:bg-gray-700">
                                            <div 
                                                className={`absolute top-0 left-0 h-full rounded-full
                                                    ${isSelected 
                                                        ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" 
                                                        : "bg-gradient-to-r from-blue-500 to-pink-500"
                                                    }`}
                                                style={{ width: `${dex.baseReservePercent}%` }}
                                            >
                                                {/* Subtle animation effect for selected state */}
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-white opacity-20">
                                                        <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )})}
</div>
</div>



            <div className="pt-5 px-3 pb-3">
                <motion.button
                    onClick={() => handleSwap(walletProvider)}
                    className={`w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md text-white relative overflow-hidden ${!canSwap ? 'opacity-60 cursor-not-allowed' : ''}`}
                    whileHover={canSwap ? { scale: 1.02 } : undefined}
                    whileTap={canSwap ? { scale: 0.98 } : undefined}
                    disabled={!canSwap || isSwapping}
                    style={{
                        background: `linear-gradient(135deg, #ff1356, #ff4080)`
                    }}
                >
                    {/* Background animation - only show when enabled */}
                    {canSwap && (
                        <div className="absolute inset-0 bg-white opacity-20">
                            <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                        </div>
                    )}

                    <span>{isSwapping ? "Swapping..." : "Swap"}</span>
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
);
};

FushionForm.displayName = 'FushionForm';

export default FushionForm; 