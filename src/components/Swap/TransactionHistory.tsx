import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import TokenShape from '../UI/TokenShape';
import { Token } from '../../context/TokenContext';
import { getContractByName } from '../../constants/contracts/contracts';
import { TContractType } from '../../constants/contracts/addresses';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { publicClient } from '../../context/Web3ProviderContext';
import { useSwapContext } from '../../context/SwapContext';
import { useTokenContext } from '../../context/TokenContext';



const TransactionHistory: React.FC = ()  => {
  const { chainId } = useAppKitNetwork()
  const { fetchUseTradeStats, userTradingStats } = useSwapContext()
  const { walletProvider } = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();
  const { isDarkMode } = useTokenContext()




 
  useEffect(()=>{
    fetchUseTradeStats(Number(chainId),walletProvider,address)
  },[chainId])
  



  return (
    <motion.div 
      className={`${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700/50' 
          : 'bg-white/80 border-white/30'
      } backdrop-blur-md  rounded-3xl  min-h-[68vh]  max-h-[68vh]   shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden mb-4 h-full transition-all duration-300`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center">
          <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Last Transactions</h3>
          <div className={`${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'} px-2 py-1 rounded-md text-xs ${isDarkMode ? 'text-pink-300' : 'text-[#ff1356]'}`}>
            {userTradingStats.length} Transaction
          </div>
        </div>
      </div>
              
      <div className={`p-4 overflow-y-auto max-h-[calc(100vh-280px)] ${isDarkMode ? 'scrollbar-dark' : ''}`}>
        {userTradingStats.map(statItem  => (
          <div key={statItem.token.address} className={`flex items-center justify-between py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} last:border-0`}>
            <div className="flex items-center">
              <div className="mr-3 w-10 h-10 relative">
                <div className="absolute -top-2 left-0">
                  <TokenShape 
                    token={statItem.token} 
                    size="sm"
                    isDarkMode={isDarkMode}
                  />
                  <div className="text-xs text-gray-500">
                    {statItem.token.symbol}
                  </div>
                  <div className="text-xs text-gray-500">
                    {statItem.token.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {statItem.totalTrades}
                  </div>
                  <div className="text-xs text-gray-500">
                    {statItem.individualTrades}
                  </div>
                </div>
              
              </div>
            
            </div>
       
          </div>
        ))}

        {/* Market Summary Section */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
            Claim Rewards
          </h3>
          <div className="space-y-3">
          
        
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory; 