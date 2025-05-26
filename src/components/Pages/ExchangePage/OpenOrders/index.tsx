import { useEffect, useState } from 'react'
import { useTokenContext } from '../../../../context/TokenContext';
import { BarChart, CandlestickChart, LineChart, Maximize2,History,Filter, RefreshCcw, Search, Clock } from 'lucide-react';
import { useSwapContext } from '../../../../context/SwapContext';
import { useAppKitProvider } from '@reown/appkit/react';
import { LIMIT_ORDER_BOOK_DECIMALS } from '../../../../constants/contracts/exchanges';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
const OpenOrders = () => {

  const {
    isDarkMode,
  } = useTokenContext();
  const {fetchLimitOrderHistory,limitOrderHistory,limitOrderHistoryLoading,orderBook} = useSwapContext();
  const { walletProvider } = useAppKitProvider('eip155');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const init = async () => {    
    await fetchLimitOrderHistory(walletProvider);
  }
  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    console.log("limitOrderHistory", limitOrderHistory);
  }, [limitOrderHistory.length,limitOrderHistoryLoading])

  return(
    <div className={`w-full rounded-xl`}>
      <div className={`transition-all duration-300`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Open Orders</h3>
                                    <div className="flex items-center gap-1">
                                        <button className="p-1 rounded hover:bg-gray-200/20 transition-colors">
                                            <Filter className="w-3 h-3" />
                                        </button>
                                        <Clock className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {orderBook.loading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
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
                                    ) : (
                                        [
                                            { type: 'buy', price: '1.00 Test', amount: '0.1', filled: '0.05', status: 'Open' },
                                            { type: 'sell', price: '2.Test', amount: '0.05', filled: '0.02', status: 'Open' },
                                            { type: 'buy', price: '3,Test', amount: '0.2', filled: '0.1', status: 'Open' }
                                        ].map((order, i) => (
                                            <motion.div
                                                key={i}
                                                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${order.type === 'buy'
                                                    ? isDarkMode
                                                        ? 'bg-transparent hover:bg-green-500/20'
                                                        : 'bg-transparent hover:bg-green-100'
                                                    : isDarkMode
                                                        ? 'bg-transparent hover:bg-pink-500/20'
                                                        : 'bg-transparent hover:bg-pink-100'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setSelectedOrder(i)}
                                            >
                                                <div className="flex justify-between text-xs">
                                                    <span className={`font-medium ${order.type === 'buy'
                                                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                        : isDarkMode
                                                            ? 'text-pink-400'
                                                            : 'text-pink-600'
                                                        }`}>
                                                        {order.type.toUpperCase()}
                                                    </span>
                                                    <span className={`px-1 py-0.5 rounded-full ${order.status === 'Filled'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : order.type === 'buy'
                                                            ? isDarkMode
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : 'bg-green-50 text-green-600 border border-green-200'
                                                            : isDarkMode
                                                                ? 'bg-pink-500/20 text-pink-400'
                                                                : 'bg-pink-50 text-pink-600 border border-pink-200'
                                                        } text-[10px]`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs mt-0.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500">Price</span>
                                                        <span>{order.price}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500">Amount</span>
                                                        <span>{order.amount}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-xs mt-0.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500">Filled</span>
                                                        <span>{order.filled}</span>
                                                    </div>
                                                    <button className={`px-2 py-1 rounded text-xs font-medium transition-colors border ${order.type === 'buy'
                                                        ? isDarkMode
                                                            ? 'text-green-400 border-green-400 hover:bg-green-500/30'
                                                            : 'text-green-600 border-green-600 hover:bg-green-200'
                                                        : isDarkMode
                                                            ? 'text-pink-400 border-pink-400 hover:bg-pink-500/30'
                                                            : 'text-pink-600 border-pink-600 hover:bg-pink-200'
                                                        }`}>
                                                        Cancel
                                                    </button>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                    <div className={`h-1.5 rounded-full ${order.type === 'buy' ? 'bg-green-500' : 'bg-pink-500'}`} style={{ width: `${(parseFloat(order.filled) / parseFloat(order.amount)) * 100}%` }}></div>
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