import React, { useEffect, useState } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, RefreshCcw, Search, Star, XCircle, Copy, TrendingUp, Gift, Trophy, User, Wallet } from 'lucide-react';
import TokenShape from '../../UI/TokenShape';
import TokenList from '../../Swap/TokenList';
import Moralis from 'moralis';
import { useMoralisInitialized } from '../../../context/MoralisProviderContext';
import { useSwapContext } from '../../../context/SwapContext';
import { formatEther } from 'viem';

const LeaderBoard = () => {
    
  const { walletProvider } = useAppKitProvider('eip155');
  const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
  const { address, isConnected } = useAppKitAccount();
  
    const {
      isDarkMode,
      slippageTolerance,
      baseToken,
      swapMode,
      tokens,
      quoteToken,
      tokenFilter,
      favoriteOnly,
      filteredTokens,
      tradeType,
      openTokenSelector,
      setOpenTokenSelector,
      setTokenFilter,
      setFavoriteOnly,
      setBaseToken,
      reloadTokens,
      handleSwapTokens,
      setSwapMode,
      setTradeType,
      nativeToken,
  
    } = useTokenContext();

    const {fetchLeaderBoardTransactions,leaderboard,registerLeaderBoardUser} = useSwapContext();
    const navigate = useNavigate();
    const isMoralisReady = useMoralisInitialized();
    const [twitterUser, setTwitterUser] = useState('');
    const [nickName, setNickName] = useState('');
    const [telegramUser, setTelegramUser] = useState('');

    const loadMoralisData = async () => {
  
      
    try {
     
      await fetchLeaderBoardTransactions(walletProvider);
      
 

    } catch (e) {
      console.error(e);
    }

    }

    useEffect(()=>{
      console.log("LEADE",leaderboard)

    },[leaderboard])

    useEffect(()=>{
      loadMoralisData()
    },[address,chainId,isConnected,baseToken])

  return (
    <div className={`flex flex-col px-0 py-4 md:p-4 transition-colors duration-300`}>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">

    <div className="order-2 sm:order-1 lg:col-span-2">
          <TokenList/>
        </div>

        <div className="order-1 sm:order-2 lg:col-span-3 flex flex-col gap-4">
        <div className={`w-full ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/40'} backdrop-blur-sm p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${isDarkMode ? 'border-gray-700/30' : 'border-white/20'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Trading Volume Leaderboard</h3>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>All time</div>
          </div>
          
          <div className="space-y-3  max-h-screen overflow-scroll px-4 scrollbar-hide">
            
            {
              !leaderboard.loading &&
            leaderboard.entries.map((user:any, index:number) => (
              <div
                key={user.address}
                className={`relative flex items-center justify-between p-4 rounded-xl ${
                  isDarkMode 
                    ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                    : 'bg-white/50 hover:bg-white/70'
                } transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 min-w-8 min-h-8 flex items-center justify-center rounded-full ${
                      index === 0 
                        ? 'bg-yellow-500/20 text-yellow-500' 
                        : index === 1 
                          ? 'bg-gray-400/20 text-gray-400'
                          : index === 2
                            ? 'bg-amber-600/20 text-amber-600'
                            : isDarkMode
                              ? 'bg-gray-600/20 text-gray-400'
                              : 'bg-gray-200 text-gray-600'
                    } font-bold text-sm`}
                  >
                    {index + 1}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} group-hover:text-[#ff1356] transition-colors duration-300`}>
                      {user.address}
                    </span>
                    <div className='w-full grid grid-cols-3 text-center'>

                      <div className='w-full flex-col gap-2 items-center justify-center'>
                      <div className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-[#ff1356]/70 transition-colors duration-300`}>
                        {`Score`}
                      </div>
                      <div className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-[#ff1356]/70 transition-colors duration-300`}>
                        {parseFloat(formatEther(user.score)).toFixed(4)}
                      </div>
                    </div>
                    <div className='w-full flex-col gap-2 items-center justify-center'>
                    <div className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-[#ff1356]/70 transition-colors duration-300`}>
                      {nativeToken?.symbol}
                    </div>
                    <div className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-[#ff1356]/70 transition-colors duration-300`}>
                      {parseFloat(formatEther(user.baseVolume)).toFixed(4)}

                    </div>
                    </div>
                    <div className='w-full flex-col gap-2 items-center justify-center'>
                    <div className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-[#ff1356]/70 transition-colors duration-300`}>
                      {baseToken?.symbol}
                    </div>
                    <div className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:text-[#ff1356]/70 transition-colors duration-300`}>
                      {parseFloat(formatEther(user.quoteVolume)).toFixed(4)}

                    </div>
                    </div>

                    </div>
                   
                  </div>
                </div>

           
           
                {/* Enhanced hover effects */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-[#ff1356]/5 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-[#ff1356] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="absolute top-0 right-0 h-0.5 bg-gradient-to-l from-pink-500 via-purple-500 to-[#ff1356] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
              </div>
            ))}

            {
              leaderboard.loading && <div className='w-full'>

<div className="flex items-center justify-center h-full min-h-[200px] w-full">
              <div className="flex flex-col items-center">
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkMode ? 'border-gray-300' : 'border-gray-600'}`}></div>
                <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
              </div>
            </div>
              </div>
            }
          </div>
        </div>
        </div>
        <div className="order-3 sm:order-3 lg:col-span-2">
            <div className={`w-full ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/40'} backdrop-blur-sm p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${isDarkMode ? 'border-gray-700/30' : 'border-white/20'}`}>
              <div className="flex justify-between items-center mb-6 relative">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-pink-900/30' : 'bg-pink-100'
                    }`}
                  >
                    <User className={`w-4 h-4 ${isDarkMode ? 'text-pink-300' : 'text-[#ff1356]'}`} />
                  </motion.div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your Stats</h3>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`px-2 py-1 rounded-lg text-xs ${
                    isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-[#ff1356]'
                  }`}
                >
                  Active Trader
                                  </motion.div>
              </div>

             
              
              {
                address &&  !leaderboard.loading &&
                leaderboard.userInfo.user &&
                leaderboard.userInfo.user.toLowerCase() !== address.toLowerCase() &&
              <div className='space-y-4'>
         
                    <div className='w-full'>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User Address</label>
                        <input
                          type="text"
                          value={address || ''}
                          readOnly
                          className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-[#ff1356]/40 transition`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Telegram User</label>
                        <input
                          type="text"
                          placeholder="@telegram"
                          value={telegramUser}
                          onChange={e => setTelegramUser(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-[#ff1356]/40 transition`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Twitter User</label>
                        <input
                          type="text"
                          placeholder="@twitter"
                          value={twitterUser}
                          onChange={e => setTwitterUser(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-[#ff1356]/40 transition`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>NickName</label>
                        <input
                          type="text"
                          placeholder="Your nickname"
                          value={nickName}
                          onChange={e => setNickName(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-[#ff1356]/40 transition`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          registerLeaderBoardUser(walletProvider, address || '', twitterUser, nickName, telegramUser);
                        }}
                        className={`w-full py-2 rounded-lg font-medium text-sm mt-2 ${isDarkMode ? 'bg-[#ff1356] text-white hover:bg-[#ff1356]/90' : 'bg-[#ff1356] text-white hover:bg-[#ff1356]/90'} transition-all duration-300`}
                      >
                        Register
                      </button>
                    </div>
           
       
              </div>
              }
              
              
              <div className="space-y-4">
                {/* User Address */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} transition-all duration-300 relative group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-[#ff1356]/5 transition-all duration-500 rounded-xl" />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Address</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-gray-600/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-300 group-hover:bg-[#ff1356]/10`}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm truncate group-hover:text-[#ff1356] transition-colors duration-300`}>
                    {address}
                  </div>
                </motion.div>

                {/* Trading Volume */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} transition-all duration-300 relative group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-[#ff1356]/5 transition-all duration-500 rounded-xl" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>{nativeToken?.symbol} Volume</span>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg group-hover:text-[#ff1356] transition-colors duration-300`}>
                      0.00000000
                    </span>
                   
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} transition-all duration-300 relative group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-[#ff1356]/5 transition-all duration-500 rounded-xl" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>{baseToken?.symbol} Volume</span>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg group-hover:text-[#ff1356] transition-colors duration-300`}>
                      0.00000000
                    </span>
                   
                  </div>
                </motion.div>

                {/* Rewards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} transition-all duration-300 relative group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-[#ff1356]/5 transition-all duration-500 rounded-xl" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Available Rewards</span>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg group-hover:text-[#ff1356] transition-colors duration-300`}>
                      0.00000000
                    </span>
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Gift className={`w-4 h-4 ${isDarkMode ? 'text-pink-400' : 'text-[#ff1356]'}`} />
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-[#ff1356] text-white hover:bg-[#ff1356]/90'
                        : 'bg-[#ff1356] text-white hover:bg-[#ff1356]/90'
                    } transition-all duration-300 flex items-center justify-center gap-2 group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/20 group-hover:via-purple-500/20 group-hover:to-[#ff1356]/20 transition-all duration-500" />
                    <Gift className="w-4 h-4" />
                    Claim Rewards
                  </motion.button>
                </motion.div>

                {/* Rank */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} transition-all duration-300 relative group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-[#ff1356]/5 transition-all duration-500 rounded-xl" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Your Rank</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-100 text-[#ff1356]'
                        } font-bold text-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {leaderboard.entries.findIndex((e:any) => e.address.toLocaleLowerCase() === address?.toString().toLocaleLowerCase())}
                      </motion.div>
                    </div>
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Trophy className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
        </div>

      </div>
  </div>
  );
};

export default LeaderBoard; 