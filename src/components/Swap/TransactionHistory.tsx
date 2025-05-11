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



const TransactionHistory: React.FC = () => {
  const { chainId } = useAppKitNetwork()
  const { fetchUseTradeStats, userTradingStats } = useSwapContext()
  const { walletProvider } = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();
  const { isDarkMode, tokens } = useTokenContext()





  useEffect(() => {
    fetchUseTradeStats(Number(chainId), walletProvider, address)
  }, [chainId, address, walletProvider, tokens])




  return (
    <motion.div
      className={`${isDarkMode
        ? 'bg-gray-800/90 border-gray-700/50'
        : 'bg-white/80 border-white/30'
        } backdrop-blur-md min-h-[68dvh]  max-h-[68dvh]  rounded-3xl flex h-full flex-col items-start justify-between gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}>


      <div className={`w-full p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center">
          <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your Tradings Stats</h3>
        </div>
      </div>

      <div className='w-full flex flex-1 items-start justify-center gap-2'>
        <div className={`w-full px-3 py-2 overflow-y-scroll max-h-[calc(68dvh-240px)] ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          {userTradingStats.map(statItem => (
            <motion.div
              key={statItem.token.address}
              className={`flex flex-col justify-between p-2 rounded-xl transition-all duration-300 mb-2 cursor-pointer 
          
              hover:bg-pink-50 hover:border hover:border-pink-200 
            `}
              whileHover={{
                scale: 1.03,
                boxShadow: isDarkMode
                  ? "0 4px 8px rgba(0,0,0,0.25)"
                  : "0 4px 8px rgba(0,0,0,0.1)"
              }}

              transition={{ type: "spring", stiffness: 400, damping: 17 }}

            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center">
                  <TokenShape
                    token={statItem.token}
                    size="sm"
                    isDarkMode={isDarkMode}
                  />
                  <div className="ml-2.5">
                    <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {statItem.token.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      {statItem.token.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1.5 space-y-2">
                {/* Total Trade Volume */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Trade Volume</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{parseFloat(statItem.totalTrades).toFixed(4)}</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className={`h-full rounded-full bg-indigo-500`} style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* User's Trade Volume */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Trade Volume</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{parseFloat(statItem.individualTrades).toFixed(4)}</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className={`h-full rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                      style={{ width: `${(statItem.individualTrades / statItem.totalTrades) * 100}%` }}>
                    </div>
                  </div>
                </div>

                {/* Percentage Display */}
                <div className="text-right text-xs font-medium">
                  <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    {((statItem.individualTrades / statItem.totalTrades) * 100).toFixed(1)}% Participation
                  </span>
                </div>
              </div>

            </motion.div>


          ))}
        </div>
      </div>

      <div className="w-full flex pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
          Claim Rewards
        </h3>
        <div className="space-y-3 min-h-[200px]">
          asdada
          asdadaasd
          asd


        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory; 