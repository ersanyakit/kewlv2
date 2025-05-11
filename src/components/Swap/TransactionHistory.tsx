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
import { ethers } from 'ethers';



const TransactionHistory: React.FC = () => {
  const { chainId } = useAppKitNetwork()
  const { fetchUseTradeStats, userTradingStats } = useSwapContext()
  const { walletProvider } = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();
  const { isDarkMode, tokens, nativeToken } = useTokenContext()




  const loadData = async () => {
    await fetchUseTradeStats(Number(chainId), walletProvider, address)
  }

  useEffect(() => {
     loadData()
  }, [chainId, address, walletProvider, tokens])

  useEffect(() => {
    console.log("userTradingStats",userTradingStats)
  }, [userTradingStats])




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

      <div className=' w-full flex flex-1 items-start justify-center gap-2'>
        <div className={`w-full px-3 py-2 overflow-y-scroll max-h-[calc(68dvh-240px)] ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          {!userTradingStats || userTradingStats.tradingStats.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[200px] w-full">
              <div className="flex flex-col items-center">
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-gray-300' : 'border-gray-600'}`}></div>
                <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading trading stats...</p>
              </div>
            </div>
          ) : (
            userTradingStats.tradingStats.map((statItem: any) => (
              <motion.div
                key={statItem.token.address}
                className={`flex flex-col select-none justify-between p-2 rounded-xl transition-all duration-300 mb-2 cursor-pointer 
            
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
            ))
          )}
        </div>
      </div>

      <div className="w-full flex flex-col p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
          Claim Rewards
        </h3>
        <div className="flex flex-col space-y-3">
          {/* Rewards Card */}
          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-3 border ${isDarkMode ? 'border-gray-600/50' : 'border-gray-200/70'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-pink-500/10' : 'bg-pink-50'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Available Rewards</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-pink-300' : 'text-pink-600'}`}>{userTradingStats && parseFloat(userTradingStats.individualReward).toFixed(4)}</p>
                  <p className={`ml-1 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{nativeToken && nativeToken.symbol}</p>
                </div>
              </div>
            </div>
          </div>
          
        

          <motion.button 
      onClick={() => {
        console.log("Claim Rewards")
      }}
      className={`${
        isConnected 
          ?  isDarkMode 
          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600' 
          : 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white'
          : "bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white"
      }  px-4 py-2 rounded-xl font-medium flex text-center items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}>
     
      Claim Rewards
    </motion.button>
          
          <div className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Based on your trading participation
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory; 