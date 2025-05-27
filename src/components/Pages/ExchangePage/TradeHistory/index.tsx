import { useEffect } from 'react'
import { useTokenContext } from '../../../../context/TokenContext';
import { BarChart, CandlestickChart, LineChart, Maximize2,History,Filter, RefreshCcw, Search } from 'lucide-react';
import { useSwapContext } from '../../../../context/SwapContext';
import { useAppKitProvider } from '@reown/appkit/react';
import { LIMIT_ORDER_BOOK_DECIMALS } from '../../../../constants/contracts/exchanges';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
const TradeHistory = () => {

  const {
    isDarkMode,
  } = useTokenContext();
  const {fetchLimitOrderHistory,limitOrderHistory,limitOrderHistoryLoading} = useSwapContext();
  const { walletProvider } = useAppKitProvider('eip155');

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
    <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Order History</h3>
        <div className="flex items-center gap-1">
            <button onClick={()=>{
                init();
            }} className="p-1 rounded hover:bg-gray-200/20 transition-colors">
                <RefreshCcw className="w-3 h-3" />
            </button>
            <History className="w-3 h-3" />
        </div>
    </div>
    <div className="space-y-1 min-h-[37dvh] max-h-[37dvh] overflow-y-auto scrollbar-hide">
        {limitOrderHistoryLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`p-1.5 rounded-lg animate-pulse ${
                isDarkMode ? 'bg-gray-800/20' : 'bg-gray-200/50'
              } h-[76px] space-y-2`}
            >
              <div className="flex justify-between text-xs">
                <div className="h-3 w-14 rounded bg-gray-400/30" />
                <div className="h-4 w-12 rounded-full bg-gray-400/30" />
              </div>
              <div className="flex justify-between text-xs">
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-8 bg-gray-400/30 rounded" />
                  <div className="h-3 w-16 bg-gray-400/30 rounded" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-8 bg-gray-400/30 rounded" />
                  <div className="h-3 w-16 bg-gray-400/30 rounded" />
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="h-2 w-24 bg-gray-400/30 rounded" />
                <div className="h-3 w-12 rounded bg-gray-400/30" />
              </div>
            </div>
          ))
         
        ) : limitOrderHistory.length == 0 ? (
            <div className="flex flex-col items-center justify-center h-[40dvh] text-center">
                
                <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
    >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ff4080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-sm font-medium mb-1">No Transactions Yet</p>
        <p className="text-xs">Market recent history will appear here</p>
    </motion.div>
            </div>
        ) : limitOrderHistory.map((order, i) => (
            <div key={i} className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${isDarkMode
                ? order.type === 'buy'
                    ? 'bg-gray-800/20 hover:bg-green-500/20'
                    : 'bg-gray-800/20 hover:bg-pink-500/20'
                : order.type === 'buy'
                    ? 'bg-white/50 shadow-sm hover:bg-green-100'
                    : 'bg-white/50 shadow-sm hover:bg-pink-100'}`}
            >
                <div className="flex justify-between text-xs">
                    <span className={`font-medium ${order.kind  ? 'text-green-500' : 'text-pink-600'}`}>
                        {order.type.toUpperCase()}
                    </span>
                    <span className={`px-1 py-0.5 rounded-full ${order.status === 'Filled'
                        ? 'bg-green-500/10 text-green-500'
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
                        <span>{parseFloat(ethers.formatUnits(order.price, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500">Amount</span>
                        <span>{parseFloat(ethers.formatUnits(order.amount, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-xs mt-0.5">
                    <span className="text-[10px] text-gray-500">{order.timestampString}</span>
                    <button
                    
                    className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                        Details
                    </button>
                </div>
            </div>
        ))}
    </div>
</div>)
}
export default TradeHistory;