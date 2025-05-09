import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SWAP_MODE, useTokenContext } from '../../../context/TokenContext';
import { MinusCircle, PieChart, PlusCircle, Replace, ReplaceAll } from 'lucide-react';
import FushionForm from './FushionForm';
import SwapForm from './SwapForm';


// memo ile render performansını optimize etme
const SwapLayout: React.FC = () => {
    const { isDarkMode,swapMode,setSwapMode } = useTokenContext();
    const [activeTab, setActiveTab] = useState<'swap' | 'fushion'>('fushion');






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
            <div className={`relative ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl overflow-hidden`}>


                <div className="flex p-3 border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center ${activeTab === 'fushion'
                                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white'
                                : isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-700/50'
                                    : 'text-gray-600 hover:bg-gray-100/70'
                            }`}
                        onClick={() =>{
                            setSwapMode(SWAP_MODE.AGGREGATOR)
                            setActiveTab('fushion')}
                        }
                    >
                        <ReplaceAll className="w-4 h-4 mr-1.5" />
                        Aggragetor
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center mx-2 ${activeTab === 'swap'
                                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white'
                                : isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-700/50'
                                    : 'text-gray-600 hover:bg-gray-100/70'
                            }`}
                        onClick={() => {
                            setSwapMode(SWAP_MODE.SIMPLESWAP)
                            setActiveTab('swap')}}
                    >
                        <Replace className="w-4 h-4 mr-1.5" />
                        Swap
                    </button>
                </div>
                {activeTab === 'fushion' && (
                    <FushionForm/>
                )}
                {activeTab === 'swap' && (
                    <SwapForm/>
                )}
                

            </div>
        </motion.div>
    );
};

SwapLayout.displayName = 'SwapLayout';

export default SwapLayout; 