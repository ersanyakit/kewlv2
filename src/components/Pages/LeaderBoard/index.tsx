import React, { useEffect, useState, useRef } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, RefreshCcw, Search, Star, XCircle, Copy, TrendingUp, Gift, Trophy, User, Wallet } from 'lucide-react';
import TokenShape from '../../UI/TokenShape';
import TokenList from '../../Swap/TokenList';
import Moralis from 'moralis';
import { useMoralisInitialized } from '../../../context/MoralisProviderContext';
import { LeaderboardUserEntry, useSwapContext } from '../../../context/SwapContext';
import { formatEther, formatUnits } from 'viem';

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

  const { fetchLeaderBoardTransactions, leaderboard, registerLeaderBoardUser, setLeaderboardDate, leaderboardDate } = useSwapContext();
  const navigate = useNavigate();
  const isMoralisReady = useMoralisInitialized();
  const [twitterUser, setTwitterUser] = useState('');
  const [nickName, setNickName] = useState('');
  const [telegramUser, setTelegramUser] = useState('');

  // Calendar selected day state
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  const [selectedDay, setSelectedDay] = useState<string>(todayISO);
  // Calendar window state (start date offset in days)
  const [windowOffset, setWindowOffset] = useState(0); // 0 means today is last, -30 means 30 days before today is last
  const calendarScrollRef = useRef<HTMLDivElement>(null);

  const loadMoralisData = async () => {


    try {

      await fetchLeaderBoardTransactions(walletProvider);



    } catch (e) {
      console.error(e);
    }

  }

  useEffect(() => {

  }, [leaderboard])

  useEffect(() => {
    loadMoralisData()
  }, [address, chainId, isConnected, baseToken, leaderboardDate])

  // Scroll to end (today) on mount or windowOffset change
  useEffect(() => {
    if (calendarScrollRef.current) {
      calendarScrollRef.current.scrollTo({ left: calendarScrollRef.current.scrollWidth, behavior: 'smooth' });
    }
  }, [windowOffset]);

  return (
    <div className={`flex flex-col px-0 py-4 md:p-4 transition-colors duration-300`}>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">

        <div className="order-2 sm:order-1 lg:col-span-2">
          <TokenList />
        </div>

        <div className="order-1 sm:order-2 lg:col-span-3 flex flex-col gap-4">
          <div className={`w-full ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/40'}  backdrop-blur-sm p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${isDarkMode ? 'border-gray-700/30' : 'border-white/20'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Trading Volume Leaderboard</h3>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>All time</div>
            </div>

            <div className="flex flex-col gap-2 mb-2">
              {/* Calendar Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-semibold text-sm tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Last 30 Days</span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activity Calendar</span>
              </div>

              {/* 30-day calendar boxes, touch-friendly */}
              <div className="flex items-center gap-0 py-2 px-1">
                {/* Left Arrow */}
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-200 mr-2
                    ${isDarkMode ? 'bg-gray-800/60 border-gray-700/40 text-gray-300 hover:bg-pink-900/30' : 'bg-white/80 border-gray-300/30 text-gray-600 hover:bg-pink-50'}
                  `}
                  onClick={() => setWindowOffset(windowOffset - 30)}
                  aria-label="Previous 30 days"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 4 6 9 12 14" /></svg>
                </button>
                {/* Calendar Days */}
                <div ref={calendarScrollRef} className="flex gap-2 p-2 overflow-x-auto scrollbar-hide flex-1">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i) + windowOffset);
                    date.setHours(0, 0, 0, 0);
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const dateISO = date.toISOString();
                    const isToday = dateISO === todayISO;
                    const startOfDayTimestamp = Math.floor(date.getTime() / 1000); // in seconds
                    const isSelected = dateISO === selectedDay;
                    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const weekDay = weekDays[date.getDay()];
                    return (
                      <div
                        key={i}
                        className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border shadow-sm select-none transition-all duration-200
                          ${isSelected
                            ? 'bg-gradient-to-r from-pink-50 to-white border border-pink-200 text-pink-500 border-pink-400 scale-105 shadow-lg'
                            : isToday
                              ? 'border-pink-400 text-pink-500 bg-pink-50 dark:bg-pink-900/20'
                              : isDarkMode
                                ? 'bg-gray-800/60 text-gray-200 border-gray-700/40 hover:bg-pink-900/30 hover:text-pink-300'
                                : 'bg-white/80 text-gray-700 border-gray-300/30 hover:bg-pink-50 hover:text-[#ff1356]'}
                          cursor-pointer group active:scale-95 touch-manipulation'
                        `}
                        title={`${day}.${month}`}
                        style={{ minWidth: 64, minHeight: 64 }}
                        onClick={() => {
                          setSelectedDay(dateISO)
                          setLeaderboardDate(BigInt(29 - i))

                        }}>
                        <span className={`text-xs font-medium mb-0.5 ${isSelected ? 'text-pink-500' : isToday ? 'text-pink-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{weekDay}</span>
                        <span className={`text-xl font-bold leading-none ${isSelected ? 'text-pink-500' : isToday ? 'text-pink-500' : ''}`}>{day}</span>
                        <span className={`text-xs font-medium ${isSelected ? 'text-pink-500/80' : isToday ? 'text-pink-400/80' : isDarkMode ? 'text-gray-400/80' : 'text-gray-400/80'}`}>{month}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Right Arrow */}
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-200 ml-2
                    ${isDarkMode ? 'bg-gray-800/60 border-gray-700/40 text-gray-300 hover:bg-pink-900/30' : 'bg-white/80 border-gray-300/30 text-gray-600 hover:bg-pink-50'}
                  `}
                  onClick={() => setWindowOffset(windowOffset + 30)}
                  aria-label="Next 30 days"
                  disabled={windowOffset >= 0}
                  style={{ opacity: windowOffset >= 0 ? 0.5 : 1, cursor: windowOffset >= 0 ? 'not-allowed' : 'pointer' }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 4 12 9 6 14" /></svg>
                </button>
              </div>

              {/* Professional 2-column stats grid */}
              <div className='w-full grid grid-cols-2 gap-2 p-2'>
                {/* Total Native Volume */}
                <div className={`flex flex-col items-center justify-between w-full mb-1 p-3 rounded-xl shadow-sm border backdrop-blur-md
                  ${isDarkMode ? 'bg-gray-900/60 border-gray-700/40' : 'bg-white/60 border-white/40'}`}
                >
                  <span className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Total {nativeToken?.symbol} Volume</span>
                  <span className={`text-base text-xs font-bold font-mono ${isDarkMode ? 'text-pink-200' : 'text-pink-600'}`}>{parseFloat(formatEther(leaderboard.totalTradeBase)).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                </div>
                {/* Total Base Volume */}
                <div className={`flex flex-col items-center justify-between w-full mb-1 p-3 rounded-xl shadow-sm border backdrop-blur-md
                  ${isDarkMode ? 'bg-gray-900/60 border-gray-700/40' : 'bg-white/60 border-white/40'}`}
                >
                  <span className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Total {baseToken?.symbol} Volume</span>
                  <span className={`text-base text-xs font-bold font-mono ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>{parseFloat(formatUnits(leaderboard.totalTradeQuote, baseToken?.decimals ?? 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                </div>
                {/* Daily Native Volume */}
                <div className={`flex flex-col items-center justify-between w-full mb-1 p-3 rounded-xl shadow-sm border backdrop-blur-md
                  ${isDarkMode ? 'bg-gray-900/60 border-gray-700/40' : 'bg-white/60 border-white/40'}`}
                >
                  <span className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Daily {nativeToken?.symbol} Volume</span>
                  <span className={`text-base text-xs font-bold font-mono ${isDarkMode ? 'text-pink-200' : 'text-pink-600'}`}>{parseFloat(formatEther(leaderboard.totalDailyTradeBase)).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                </div>
                {/* Daily Base Volume */}
                <div className={`flex flex-col items-center justify-between w-full mb-1 p-3 rounded-xl shadow-sm border backdrop-blur-md
                  ${isDarkMode ? 'bg-gray-900/60 border-gray-700/40' : 'bg-white/60 border-white/40'}`}
                >
                  <span className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Daily {baseToken?.symbol} Volume</span>
                  <span className={`text-base text-xs font-bold font-mono ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>{parseFloat(formatUnits(leaderboard.totalDailyTradeQuote, baseToken?.decimals ?? 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3  max-h-screen overflow-scroll px-2 scrollbar-hide">

              {
                !leaderboard.loading &&
                leaderboard.entries.map((userEntry: LeaderboardUserEntry, index: number) => (
                  <div
                    key={userEntry.trader.user}
                    className={`relative  flex flex-col gap-2 items-center justify-between py-4 px-4 rounded-xl ${isDarkMode
                      ? 'bg-gray-700/30 hover:bg-gray-700/50'
                      : 'bg-white/50 hover:bg-white/70'
                      } transition-all duration-300 group cursor-pointer`}
                  >
                    <div className='w-full flex flex-col gap-2'>
                      <div className="w-full flex items-center gap-4">
                        <div
                          className={`w-8 h-8 min-w-8 min-h-8 flex items-center justify-center rounded-full ${index === 0
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

                        <div className="flex flex-col overflow-hidden">
                          <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} group-hover:text-[#ff1356] transition-colors duration-300`}>
                            {userEntry.trader.user}
                          </span>
                        </div>
                      </div>

                      <div className='w-full grid grid-cols-3 gap-4 text-center mt-2'>
                        <div className='flex flex-col items-center justify-center'>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>SCORE</span>
                          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{parseFloat(userEntry.score.score.toString()).toFixed(0)}</span>
                        </div>

                        <div className='flex flex-col items-start w-full'>
                          <div className='w-full flex justify-between items-center mb-1'>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{nativeToken?.symbol}</span>
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300' : 'text-[#ff1356]'}`}>
                              {`${((parseFloat(formatEther(userEntry.score.baseVolume)) / (parseFloat(formatEther(leaderboard.totalTradeBase)) || 1)) * 100).toFixed(1)}%`}
                            </span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-200'}`}>
                            <div className='h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500' style={{ width: `${Math.min(100, (parseFloat(formatEther(userEntry.score.baseVolume)) / (parseFloat(formatEther(leaderboard.totalTradeBase)) || 1)) * 100)}%` }}></div>
                          </div>
                        </div>

                        <div className='flex flex-col items-start w-full'>
                          <div className='w-full flex justify-between items-center mb-1'>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{baseToken?.symbol}</span>
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-pink-300' : 'text-[#ff1356]'}`}>
                              {`${((parseFloat(formatEther(userEntry.score.quoteVolume)) / (parseFloat(formatUnits(leaderboard.totalTradeQuote, baseToken?.decimals ?? 18)) || 1)) * 100).toFixed(1)}%`}
                            </span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-200'}`}>
                            <div className='h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500' style={{ width: `${Math.min(100, (parseFloat(formatEther(userEntry.score.quoteVolume)) / (parseFloat(formatEther(leaderboard.totalTradeQuote)) || 1)) * 100)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <div className='w-full grid grid-cols-2 gap-2 text-center'>


                        <div className="flex flex-col items-center justify-center w-full">
                          <div className="flex flex-col items-center justify-between w-full mb-1">
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{nativeToken?.symbol} Volume</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{parseFloat(formatEther(userEntry.score.baseVolume)).toFixed(4)}</span>
                          </div>

                        </div>
                        <div className="flex flex-col items-center justify-center w-full">
                          <div className="flex flex-col items-center justify-between w-full mb-1">
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{baseToken?.symbol} Volume</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{parseFloat(formatUnits(userEntry.score.quoteVolume, baseToken?.decimals ?? 18)).toFixed(4)}</span>
                          </div>

                        </div>

                      </div>
                    </div>



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
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-100'
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
                className={`px-2 py-1 rounded-lg text-xs ${isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-[#ff1356]'
                  }`}
              >
                Active Trader
              </motion.div>
            </div>



            {
              address && !leaderboard.loading &&
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
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-100 text-[#ff1356]'
                        } font-bold text-sm`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {leaderboard.entries.findIndex((e: LeaderboardUserEntry) => e.trader.user.toLocaleLowerCase() === address?.toString().toLocaleLowerCase()) + 1}


                    </motion.div>
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg group-hover:text-[#ff1356] transition-colors duration-300`}>
                      {leaderboard.scoreInfo.userScore.toString()}
                    </span>
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
                    {parseFloat(formatUnits(leaderboard.scoreInfo.userQuoteVolume, nativeToken?.decimals ?? 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}

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
                    {parseFloat(formatUnits(leaderboard.scoreInfo.userBaseVolume, baseToken?.decimals ?? 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}

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
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>{nativeToken?.symbol} Volume Daily</span>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg group-hover:text-[#ff1356] transition-colors duration-300`}>
                    {parseFloat(formatUnits(leaderboard.scoreInfo.userDailyQuoteVolume, nativeToken?.decimals ?? 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}
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
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>{baseToken?.symbol} Volume Daily</span>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg group-hover:text-[#ff1356] transition-colors duration-300`}>
                    {parseFloat(formatUnits(leaderboard.scoreInfo.userDailyBaseVolume, baseToken?.decimals ?? 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}

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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 rounded-xl font-medium text-sm relative overflow-hidden ${isDarkMode
                    ? 'bg-[#ff1356] text-white hover:bg-[#ff1356]/90'
                    : 'bg-[#ff1356] text-white hover:bg-[#ff1356]/90'
                    } transition-all duration-300 flex items-center justify-center gap-2 group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-[#ff1356]/0 group-hover:from-pink-500/20 group-hover:via-purple-500/20 group-hover:to-[#ff1356]/20 transition-all duration-500" />
                  <Gift className="w-4 h-4" />
                  Claim Rewards
                </motion.button>
              </motion.div>



            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaderBoard; 