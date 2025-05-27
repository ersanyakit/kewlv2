import { useEffect, useState } from 'react'
import { useTokenContext } from '../../../../context/TokenContext';
import { BarChart, CandlestickChart, LineChart, Maximize2,History,Filter, RefreshCcw, Search, Clock, NotebookPen } from 'lucide-react';
import { OrderKind, OrderStatus, useSwapContext, getOrderStatusText } from '../../../../context/SwapContext';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { LIMIT_ORDER_BOOK_DECIMALS } from '../../../../constants/contracts/exchanges';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
const OpenOrders = () => {

  const {
    isDarkMode,
  } = useTokenContext();
  const {selectedPair,fetchUserOrders,userOrders,userOrdersLoading} = useSwapContext();
  const { walletProvider } = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();

  const init = async () => {    
    if(!selectedPair) return;
    if(!address) return;
    console.log("selectedPair", selectedPair)   
    console.log("address", address)
    await fetchUserOrders(walletProvider,selectedPair.pair,address);
  }
  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    console.log("openedOrders", userOrders);
  }, [userOrders.length,userOrdersLoading])

  return(
    <div className={`w-full rounded-xl`}>
      <div className={`transition-all duration-300`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Open Orders</h3>
                                    <div className="flex items-center gap-1">
                                        <button className="p-1 rounded hover:bg-gray-200/20 transition-colors" onClick={() => {
                                            init();
                                        }}>
                                            <RefreshCcw className="w-3 h-3" />
                                        </button>
                                        <Clock className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="space-y-1 min-h-[37dvh]  max-h-[37dvh] overflow-y-auto scrollbar-hide">
                                    {userOrdersLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="p-1.5 rounded-lg animate-pulse">
                                                <div className="flex justify-between">
                                                    <div className="h-3 w-12 bg-gray-300 rounded"></div>
                                                    <div className="h-3 w-16 bg-gray-300 rounded-full"></div>
                                                </div>
                                                <div className="flex justify-between mt-2">
                                                    <div className="space-y-1">
                                                        <div className="h-2 w-8 bg-gray-300 rounded"></div>
                                                        <div className="h-3 w-16 bg-gray-300 rounded"></div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="h-2 w-8 bg-gray-300 rounded"></div>
                                                        <div className="h-3 w-16 bg-gray-300 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="space-y-1">
                                                        <div className="h-2 w-8 bg-gray-300 rounded"></div>
                                                        <div className="h-3 w-12 bg-gray-300 rounded"></div>
                                                    </div>
                                                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                                                </div>
                                                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-2"></div>
                                            </div>
                                        ))
                                    ) : 
                                        userOrders.length == 0 ? (
<div className="flex flex-col items-center justify-center h-[37dvh] text-center">
                
                <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
    >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10 flex items-center justify-center">
        <NotebookPen className="w-8 h-8 text-[#ff4080]" />
        </div>
        <p className="text-sm font-medium mb-1">No Active Orders Yet</p>
        <p className="text-xs">Your orders will appear here</p>
                                        </motion.div>
                                    </div>
                                    ) : (
                                        userOrders.map((order, i) => (
                                            <motion.div
                                                key={i}
                                                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${[OrderKind.BUY_LIMIT, OrderKind.BUY_MARKET].includes(order.kind)
                                                    ? isDarkMode
                                                        ? 'bg-transparent hover:bg-green-500/20'
                                                        : 'bg-transparent hover:bg-green-100'
                                                    : isDarkMode
                                                        ? 'bg-transparent hover:bg-pink-500/20'
                                                        : 'bg-transparent hover:bg-pink-100'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => {
                                                    console.log("order", order)
                                                }}
                                            >
                                                <div className="flex justify-between text-xs">
                                                    <span className={`font-medium ${[OrderKind.BUY_LIMIT, OrderKind.BUY_MARKET].includes(order.kind) 
                                                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                        : isDarkMode
                                                            ? 'text-pink-400'
                                                            : 'text-pink-600'
                                                        }`}>
                                                        {[OrderKind.BUY_LIMIT, OrderKind.BUY_MARKET].includes(order.kind) ? 'BUY' : 'SELL'}
                                                    </span>
                                                    <span className={`px-1 py-0.5 rounded-full ${order.status === OrderStatus.COMPLETED
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : [OrderKind.BUY_LIMIT, OrderKind.BUY_MARKET].includes(order.kind)
                                                            ? isDarkMode
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : 'bg-green-50 text-green-600 border border-green-200'
                                                            : isDarkMode
                                                                ? 'bg-pink-500/20 text-pink-400'
                                                                : 'bg-pink-50 text-pink-600 border border-pink-200'
                                                        } text-[10px]`}>
                                                        {getOrderStatusText(Number(order.status))}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs mt-0.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500">Price</span>
                                                        <span>{parseFloat(ethers.formatUnits(order.price,LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500">Amount</span>
                                                        <span>{parseFloat(ethers.formatUnits(order.amount,LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-xs mt-0.5">
                                                    <div className="w-full flex flex-col">
                                                        <span className="text-[10px] text-gray-500">Filled</span>
                                                        <span>{parseFloat(ethers.formatUnits(order.filled,LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)}</span>
                                                    </div>
                                                    <div className='flex flex flex-row gap-2'>

                                                    {[OrderStatus.FILLED].includes(order.status) &&
                                                    <button className={`px-2 py-1 rounded text-xs font-medium transition-colors border
                                                            ${isDarkMode
                                                            ? 'text-blue-400 border-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                                                            : 'text-blue-600 border-blue-600 bg-blue-500/10 hover:bg-blue-500/20'
                                                            }`}
                                                        >
                                                        Claim
                                                    </button>
}

                                                    {![OrderStatus.COMPLETED, OrderStatus.CANCELLED,OrderStatus.FILLED].includes(order.status) && (
                                                    <button className={`px-2 py-1 rounded text-xs font-medium transition-colors border ${[OrderKind.BUY_LIMIT, OrderKind.BUY_MARKET].includes(order.kind)
                                                        ? isDarkMode
                                                            ? 'text-green-400 border-green-400 hover:bg-green-500/30'
                                                            : 'text-green-600 border-green-600 hover:bg-green-200'
                                                        : isDarkMode
                                                            ? 'text-pink-400 border-pink-400 hover:bg-pink-500/30'
                                                            : 'text-pink-600 border-pink-600 hover:bg-pink-200'
                                                        }`}>
                                                        Cancel
                                                    </button>)}
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                    <div className={`h-1.5 rounded-full ${[OrderKind.BUY_LIMIT, OrderKind.BUY_MARKET].includes(order.kind) ? 'bg-green-500' : 'bg-pink-500'}`} style={{ width: `${(parseFloat(ethers.formatUnits(order.filled,LIMIT_ORDER_BOOK_DECIMALS)) / parseFloat(ethers.formatUnits(order.amount,LIMIT_ORDER_BOOK_DECIMALS))) * 100}%` }}></div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
   
    </div>
)
}
export default OpenOrders;