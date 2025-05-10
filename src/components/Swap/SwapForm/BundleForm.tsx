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
    RedoDot,
    Shuffle,
} from 'lucide-react';
import { SWAP_MODE, useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { TCustomPair, useSwapContext } from '../../../context/SwapContext';
import { warningSeverity } from '../../../constants/entities/utils/calculateSlippageAmount';

// Token type

// memo ile render performansını optimize etme
const BundleForm: React.FC = () => {
    // Token context'inden verileri al
    const {
        nativeToken,
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
        if(updatedPairs.filter(pair => pair.isSelected).length > 0){
            setCanAggregatorSwap(true);
        }else{
            setCanAggregatorSwap(false);
        }
    };



    return (
        <div className="flex flex-col">

     
                <div className="p-3 relative">
                    <div className="flex justify-between items-start mb-1">
                        <div>
                            <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0.5`}>You Pay</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Balance: {nativeToken && nativeToken.balance} {nativeToken && nativeToken.symbol}</div>
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
                                <TokenShape isDarkMode={isDarkMode} token={nativeToken} size="sm" />
                            </div>
                            <motion.div
                                animate={{
                                    rotateX: openTokenSelector && tradeType === TradeType.EXACT_INPUT ? 180 : 0,
                                    y: openTokenSelector && tradeType === TradeType.EXACT_INPUT ? 2 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            >
                            </motion.div>
                            <div className="flex w-full text-start flex-col items-start mx-2">
                                <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Invest Now</div>
                            </div>
                            <Shuffle className={`w-6 h-6 mx-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-pink-500`} />

                        </motion.button>
                    </div>

                 
                </div>




        </div>
    );
};

BundleForm.displayName = 'BundleForm';

export default BundleForm; 