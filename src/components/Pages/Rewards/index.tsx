import React, { useEffect, useState } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import TokenList from '../../Swap/TokenList';
import ConnectButton from '../../UI/ConnectButton';
import { generateTweetIntentURL, getRandomTweet, parseTweetUrl, TweetInfo } from './Data/Functions';

const Rewards = () => {
    // Token context'inden verileri al
    const {
        isDarkMode,
        slippageTolerance,
        baseToken,
        swapMode,
        quoteToken,
        tokenFilter,
        favoriteOnly,
        filteredTokens,
        tradeType,
        openTokenSelector,
        setOpenTokenSelector,
        setTokenFilter,
        setFavoriteOnly,
        selectToken,
        reloadTokens,
        handleSwapTokens,
        setSwapMode,
        setTradeType,

    } = useTokenContext();
    const { address, isConnected } = useAppKitAccount();
    const navigate = useNavigate();
    const [getTweet, setTweet] = useState<string>(getRandomTweet());
    const [tweetButtonWaiting, setTweetButtonWaiting] = useState<boolean>(false);
    const [tweetWaitTime, setTweetWaitTime] = useState<number>(5);

    // Zamanlayıcı için state tanımla
    const [countdown, setCountdown] = React.useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    });
    
    // Geri sayım için progress değeri
    const [progress, setProgress] = React.useState(100);
    
    // Pulse animasyonu için state'ler
    const [hoursPulse, setHoursPulse] = React.useState(false);
    const [minutesPulse, setMinutesPulse] = React.useState(false);
    const [secondsPulse, setSecondsPulse] = React.useState(false);
    const [tweetInfo, setTweetInfo] = React.useState<TweetInfo | null>(null);
    
    // Toplam 24 saat (saniye cinsinden)
    const totalSeconds = 24 * 60 * 60;
    
    // Geri sayım zamanlayıcısı effect'i
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                let newHours = prev.hours;
                let newMinutes = prev.minutes;
                let newSeconds = prev.seconds - 1;
                
                if (newSeconds < 0) {
                    newSeconds = 59;
                    newMinutes -= 1;
                }
                
                if (newMinutes < 0) {
                    newMinutes = 59;
                    newHours -= 1;
                }
                
                // Zamanlayıcı sıfırlandığında tekrar başlat
                if (newHours < 0) {
                    newHours = 23;
                    newMinutes = 59;
                    newSeconds = 59;
                }
                
                // Progress bar için kalan toplam saniye hesapla
                const remainingSeconds = (newHours * 3600) + (newMinutes * 60) + newSeconds;
                const newProgress = (remainingSeconds / totalSeconds) * 100;
                setProgress(newProgress);
                
                return {
                    hours: newHours,
                    minutes: newMinutes,
                    seconds: newSeconds
                };
            });
        }, 1000);
        
        // Component unmount olduğunda timer'ı temizle
        return () => clearInterval(timer);
    }, []);

    // Rastgele pulse efektleri için useEffect
    React.useEffect(() => {
        // Rastgele bir pulse efekti tetikler
        const triggerRandomPulse = () => {
            const random = Math.floor(Math.random() * 3); // 0, 1, veya 2
            
            if (random === 0) {
                setHoursPulse(true);
                setTimeout(() => setHoursPulse(false), 250);
            } else if (random === 1) {
                setMinutesPulse(true);
                setTimeout(() => setMinutesPulse(false), 500);
            } else {
                setSecondsPulse(true);
                setTimeout(() => setSecondsPulse(false), 750);
            }
        };
        
        // Her 2-5 saniyede bir rastgele pulse
        const pulseInterval = setInterval(() => {
            triggerRandomPulse();
        }, Math.floor(Math.random() * 300) + 500);
        
        return () => clearInterval(pulseInterval);
    }, []);

    // Recent Claims için state
    const [claims, setClaims] = React.useState([
        { id: 1, date: 'Jul 28, 2023', wallet: '0x1a2b...7e8f', tweet: 'https://twitter.com/user1/status/1687452123456', amount: '1000 $1K', isNew: false },
        { id: 2, date: 'Jul 27, 2023', wallet: '0xdead...beef', tweet: 'https://twitter.com/crypto_lover/status/1687045723459', amount: '1000 $1K', isNew: false },
        { id: 3, date: 'Jul 25, 2023', wallet: '0x3c4d...9e0f', tweet: 'https://twitter.com/blockchain_jane/status/1686578912435', amount: '1000 $1K', isNew: false },
        { id: 4, date: 'Jul 24, 2023', wallet: '0x7a9b...1c3d', tweet: 'https://twitter.com/crypto_max/status/1686231475678', amount: '1000 $1K', isNew: false },
        { id: 5, date: 'Jul 23, 2023', wallet: '0xf1e2...d3c4', tweet: 'https://twitter.com/web3_enthusiast/status/1685867234987', amount: '1000 $1K', isNew: false },
    ]);
    
    // Rastgele wallet adresi oluşturma
    const generateWallet = () => {
        const chars = '0123456789abcdef';
        let wallet = '0x';
        for (let i = 0; i < 4; i++) {
            wallet += chars[Math.floor(Math.random() * chars.length)];
        }
        wallet += '...';
        for (let i = 0; i < 4; i++) {
            wallet += chars[Math.floor(Math.random() * chars.length)];
        }
        return wallet;
    };
    
    // Rastgele tweet ID'si oluşturma
    const generateTweetId = () => {
        return Math.floor(Math.random() * 9000000000) + 1000000000;
    };
    
    // Rastgele kullanıcı adı oluşturma
    const generateUsername = () => {
        const prefixes = ['crypto', 'web3', 'nft', 'defi', 'token', 'eth', 'btc', 'blockchain', 'meta'];
        const suffixes = ['fan', 'lover', 'trader', 'whale', 'guru', 'dev', 'master', 'pro', 'king', 'queen'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const number = Math.floor(Math.random() * 1000);
        
        return `${prefix}_${suffix}${number > 100 ? number : ''}`;
    };
    
    // Bugünden gün çıkarma fonksiyonu
    const getDateString = (daysAgo: number) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    // Belirli aralıklarla yeni claim ekle
    useEffect(() => {
        const addNewClaim = () => {
            const username = generateUsername();
            const newClaim = {
                id: Date.now(),
                date: getDateString(0), // bugün
                wallet: generateWallet(),
                tweet: `https://twitter.com/${username}/status/${generateTweetId()}`,
                amount: '1000 $1K',
                isNew: true // yeni eklenen claim için flag
            };
            
            // Yeni claim'i listenin başına ekle ve 10 claim sınırını koru
            setClaims(prev => {
                const updatedClaims = [newClaim, ...prev];
                if (updatedClaims.length > 10) {
                    updatedClaims.pop(); // En eski claim'i çıkar
                }
                return updatedClaims;
            });
            
            // 2 saniye sonra "isNew" flag'ini kaldır
            setTimeout(() => {
                setClaims(prev => 
                    prev.map(claim => 
                        claim.id === newClaim.id ? {...claim, isNew: false} : claim
                    )
                );
            }, 2000);
        };
        
        // Rastgele aralıklarla (3-8 saniye) yeni claim ekle
        const interval = setInterval(() => {
            addNewClaim();
        }, Math.floor(Math.random() * 500) + 3000);
        
        return () => clearInterval(interval);
    }, []);

    // Add a function to handle the tweet button click
    const handleTweetButtonClick = () => {
        setTweetButtonWaiting(true);
        setTweetWaitTime(10);
        
        // Open the tweet intent URL
        window.open(generateTweetIntentURL(getTweet), '_blank');
        
        // Start countdown timer
        const interval = setInterval(() => {
            setTweetWaitTime(prevTime => {
                const newTime = prevTime - 1;
                if (newTime <= 0) {
                    clearInterval(interval);
                    setTweetButtonWaiting(false);
                    return 5;
                }
                return newTime;
            });
        }, 1000);
    };

    return (
        <div className={` max-w-6xl mx-auto flex flex-col p py-4 transition-colors duration-300`}>




            <div className="w-full  grid grid-cols-1 lg:grid-cols-7 gap-4">

                <div className="order-2 sm:order-1 lg:col-span-2">
                    {/* User Profile Card */}
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full mb-4`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="p-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080] p-0.5">
                                    <div className={`w-full h-full rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-1`}>
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20 flex items-center justify-center">
                                            {isConnected ? (
                                                <span className="text-xl font-bold text-[#ff4080]">
                                                    {address?.substring(2, 4).toUpperCase()}
                                                </span>
                                            ) : (
                                                <svg className="w-8 h-8 text-[#ff4080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {isConnected ? `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}` : 'Connect Wallet'}
                                    </h3>
                                    <div className="flex items-center">
                                        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'} mr-2`}></div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {isConnected ? 'Connected' : 'Not Connected'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/70'} mb-3`}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Claimed</span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>1,000 $1K</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Earned This Week</span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>1,000 $1K</span>
                                </div>
                            </div>
                            
                            {!isConnected && <ConnectButton />}
                        </div>
                    </motion.div>
                    
                    {/* Countdown Timer Card */}
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="p-4">
                            <h3 className={`text-center font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Next Reward In
                            </h3>
                            
                            <div className="relative">
                                {/* Pulsating Background */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-[#ff1356] to-[#ff4080] rounded-xl opacity-20"
                                    animate={{ 
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ 
                                        repeat: Infinity, 
                                        duration: 2,
                                        ease: "easeInOut" 
                                    }}
                                />
                                
                                {/* Main Timer Display */}
                                <div className={`relative rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/70'} p-4 overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {/* Timer Digits */}
                                    <div className="flex justify-between mb-6">
                                        {/* Hours */}
                                        <motion.div 
                                            className="text-center w-1/4"
                                            whileHover={{ scale: 1.05 }}
                                            animate={hoursPulse ? 
                                                { scale: [1, 1.15, 1], transition: { duration: 0.8 } } : 
                                                { scale: 1 }
                                            }
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <div className={`text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent`}>
                                                {countdown.hours.toString().padStart(2, '0')}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>HOURS</div>
                                        </motion.div>
                                        
                                        {/* Separator */}
                                        <div className="text-center flex items-center">
                                            <div className={`text-3xl sm:text-4xl font-bold mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>:</div>
                                        </div>
                                        
                                        {/* Minutes */}
                                        <motion.div 
                                            className="text-center w-1/4"
                                            whileHover={{ scale: 1.05 }}
                                            animate={minutesPulse ? 
                                                { scale: [1, 1.18, 1], transition: { duration: 0.7 } } : 
                                                { scale: 1 }
                                            }
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <div className={`text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent`}>
                                                {countdown.minutes.toString().padStart(2, '0')}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>MINUTES</div>
                                        </motion.div>
                                        
                                        {/* Separator */}
                                        <div className="text-center flex items-center">
                                            <div className={`text-3xl sm:text-4xl font-bold mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>:</div>
                                        </div>
                                        
                                        {/* Seconds */}
                                        <motion.div 
                                            className="text-center w-1/4"
                                            animate={secondsPulse ? 
                                                { scale: [1, 1.2, 1], transition: { duration: 0.6 } } : 
                                                { 
                                                    scale: [1, 1.05, 1],
                                                    transition: { 
                                                        repeat: Infinity, 
                                                        duration: 1,
                                                        ease: "easeInOut" 
                                                    }
                                                }
                                            }
                                        >
                                            <div className={`text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent`}>
                                                {countdown.seconds.toString().padStart(2, '0')}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>SECONDS</div>
                                        </motion.div>

                                        
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-3`}>
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-[#ff1356] to-[#ff4080]"
                                            initial={{ width: "100%" }}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    
                                    <div className="text-center">
                                        <motion.div 
                                            className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                            animate={{ opacity: [0.7, 1, 0.7] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            Get ready for your next reward opportunity!
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tips Section */}
                            <div className="mt-4">
                                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Boost Your Rewards:</h4>
                                <ul className={`text-xs space-y-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-[#ff4080] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Share your tweet with hashtags for more visibility</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-[#ff4080] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Engage with the community for bonus rewards</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-[#ff4080] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Return daily to maximize your token earnings</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="order-1 sm:order-2 lg:col-span-3 flex flex-col gap-4">
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}>
                        <div className="p-6">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tweet & Earn Cool Rewards!</h2>
                                <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support our project and earn $1K tokens</p>
                            </div>

                            {/* Step 1: Tweet Creation Area */}
                            <div className={`mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'}`}>
                                <div className="flex items-center mb-3">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080]`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        1
                                    </motion.div>
                                    <h3 className={`ml-2 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tweet About Us</h3>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Suggested Tweet:</p>
                                        <motion.button
                                            onClick={() => setTweet(getRandomTweet())}
                                            className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${isDarkMode ? 'bg-gray-700/60 hover:bg-gray-700 text-gray-300' : 'bg-white/70 hover:bg-white text-gray-700'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <svg className="w-3.5 h-3.5 text-[#ff4080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Generate
                                        </motion.button>
                                    </div>
                                    <div className={`relative p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/70 text-gray-700'} transition-all duration-200`}>
                                        <motion.div
                                            key={getTweet} // Animasyonu her tweet değiştiğinde tetiklemek için key eklendi
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {getTweet}
                                        </motion.div>
                                    </div>
                                </div>

                                {
                                    !isConnected ? (
                                        <ConnectButton />
                                    ) : (
                                        <motion.button
                                            disabled={tweetButtonWaiting}
                                            onClick={handleTweetButtonClick}
                                            className={`w-full py-3 rounded-xl font-medium ${
                                                tweetButtonWaiting 
                                                    ? 'bg-gray-500 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-[#ff1356] to-[#ff4080]'
                                            } text-white`}
                                            whileHover={!tweetButtonWaiting ? {
                                                scale: 1.02,
                                                boxShadow: "0 5px 15px rgba(255, 19, 86, 0.3)",
                                                transition: { duration: 0.2 }
                                            } : {}}
                                            whileTap={!tweetButtonWaiting ? { scale: 0.98 } : {}}
                                            initial={{ boxShadow: "0 0px 0px rgba(255, 19, 86, 0)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                {tweetButtonWaiting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Please wait... {tweetWaitTime}s
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                        </svg>
                                                        Tweet Now
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    )
                                }

                             
                            </div>

                            {/* Step 2: Claim Rewards */}
                            <div className={`mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'}`}>
                                <div className="flex items-center mb-3">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080]`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        2
                                    </motion.div>
                                    <h3 className={`ml-2 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Claim Your Reward</h3>
                                </div>

                                <div className="mb-4">
                                    <p className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Paste your Tweet URL here:</p>
                                    <motion.div
                                        className="flex gap-2"
                                        initial={{ y: 0 }}
                                        whileFocus={{ y: -2 }}
                                    >
                                        <input
                                            onChange={(e) => {
                                                const tweetInfo = parseTweetUrl(e.target.value);
                                                setTweetInfo(tweetInfo);
                                            }}
                                            type="text"
                                            placeholder="https://twitter.com/username/status/123456789"
                                            className={`w-full p-3 rounded-lg ${isDarkMode
                                                ? 'bg-gray-800/50 text-gray-300 border border-gray-700 focus:border-[#ff4080]'
                                                : 'bg-white/70 text-gray-700 border border-gray-300 focus:border-[#ff4080]'
                                                } focus:outline-none transition-colors`}
                                        />
                                    </motion.div>
                                </div>

                                <motion.button
                                    className="w-full py-3 rounded-xl font-medium text-white opacity-60 bg-gradient-to-r from-[#ff1356] to-[#ff4080] cursor-not-allowed"
                                    initial={{ opacity: 0.6 }}
                                    whileHover={{
                                        opacity: 0.7,
                                        transition: { duration: 0.3 }
                                    }}
                                    disabled={!tweetInfo?.valid}
                                >
                                    Verify & Claim 1000 $1K
                                </motion.button>
                                <p className={`text-sm mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your Tweet URL to enable claiming</p>
                            </div>

                            {/* Rewards Information */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'}`}>
                                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Reward Details</h3>

                                <div className="space-y-4">
                                    {/* Reward Card */}
                                    <motion.div
                                        className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}
                                        whileHover={{
                                            y: -3,
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            transition: { duration: 0.2 }
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="p-2 rounded-full bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            >
                                                <svg className="w-6 h-6 text-[#ff4080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </motion.div>
                                            <div>
                                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>First Tweet Reward</p>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Earn tokens by sharing on Twitter</p>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="font-semibold text-[#ff4080]"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            1000 $1K
                                        </motion.div>
                                    </motion.div>

                                    {/* Reward Card */}
                                    <motion.div
                                        className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}
                                        whileHover={{
                                            y: -3,
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            transition: { duration: 0.2 }
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className="p-2 rounded-full bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            >
                                                <svg className="w-6 h-6 text-[#ff1356]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                                </svg>
                                            </motion.div>
                                            <div>
                                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Weekly Engagement</p>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tweet with 5+ likes</p>
                                            </div>
                                        </div>
                                        <div className={`font-semibold text-gray-400`}>Coming Soon</div>
                                    </motion.div>
                                </div>

                                {/* Total Reward */}
                                <motion.div
                                    className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                    whileHover={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Available:</span>
                                        <motion.span
                                            className="text-xl font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            1000 $1K
                                        </motion.span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="order-3 sm:order-3 lg:col-span-2">
                    {/* Right Column - Claim History */}
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="p-4">
                        <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} pb-5 transition-colors duration-300`}>Recent Claims</h3>
                            
                            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide pt-2 pr-1">
                                {claims.map((claim) => (
                                <motion.div
                                        key={claim.id}
                                    className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
                                    initial={claim.isNew ? { x: 0, opacity: 0, borderColor: '#ff4080' } : { opacity: 1 }}
                                    animate={claim.isNew 
                                        ? { 
                                            x: 0, 
                                            opacity: 1, 
                                            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)',
                                            transition: { duration: 0.4 } 
                                        } 
                                        : { opacity: 1 }
                                    }
                                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <motion.div 
                                            className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20 flex items-center justify-center"
                                            animate={claim.isNew ? {
                                                backgroundColor: ['rgba(255, 19, 86, 0.4)', 'rgba(255, 19, 86, 0.2)'],
                                                scale: [1.2, 1],
                                                transition: { duration: 0.8 }
                                            } : {}}
                                        >
                                            <svg className="w-4 h-4 text-[#ff4080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{claim.date}</span>
                                            <motion.span 
                                                className="ml-auto text-sm font-semibold text-[#ff4080]"
                                                animate={claim.isNew ? {
                                                    scale: [1.1, 1],
                                                    transition: { duration: 0.5 }
                                                } : {}}
                                            >
                                                {claim.amount}
                                            </motion.span>
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate mb-1`}>
                                            <span className="font-medium">Wallet:</span> {claim.wallet}
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                            <span className="font-medium">Tweet:</span> {claim.tweet}
                                    </div>
                                </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>



        </div>
    );
};

export default Rewards; 