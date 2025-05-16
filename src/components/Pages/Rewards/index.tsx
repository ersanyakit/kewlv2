import React, { useEffect, useState, useCallback } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../UI/ConnectButton';
import { decodeTweetId, generateTweetIntentURL, getRandomTweet, parseTweetUrl, TweetInfo } from './Data/Functions';
import { BOUNTY_TYPE, BOUNTY_TYPE_ARRAY, BountyClaimParam, useSwapContext } from '../../../context/SwapContext';
import moment from 'moment';
import { ethers } from 'ethers';
import RecentClaim from './RecentClaim';
import { Bird, Clock, Coins, Gem, RefreshCw, Waves } from 'lucide-react';

const Rewards = () => {
    // Token context'inden verileri al
    const {
        setAccount,
        isDarkMode,
    } = useTokenContext();
    const { walletProvider } = useAppKitProvider('eip155');

    const { address, isConnected } = useAppKitAccount();
    const { bountiesInfo, setBountiesInfo, fetchBountiesInfo, handleClaimedRewards, isClaimLoading, setIsClaimLoading, claimModal, setClaimModal, fetchJackPotInfo, jackpotInfo } = useSwapContext();
    const navigate = useNavigate();
    const [getTweet, setTweet] = useState<string>(getRandomTweet());
    const [tweetButtonWaiting, setTweetButtonWaiting] = useState<boolean>(false);
    const [tweetWaitTime, setTweetWaitTime] = useState<number>(10);
    const [canClaimTweet, setCanClaimTweet] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [activeView, setActiveView] = useState<string>("rewards");
    const [jackpotUserCount, setJackpotUserCount] = useState<number>(200);


    // Zamanlayıcı için state tanımla
    const [countdown, setCountdown] = useState({
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

    // Toplam 24 saat (saniye cinsinden)
    const totalSeconds = 24 * 60 * 60;



    const [claimedAmount, setClaimedAmount] = useState<string>("");

    const initBountiesInfo = async () => {
        setBountiesInfo({
            loaded: false,
            bounties: [],
            bountyUserInfo: null,
            totalClaimed: 0n,
        })
        await fetchBountiesInfo(walletProvider);
        await fetchJackPotInfo(walletProvider, jackpotUserCount);
    }
    useEffect(() => {
        if (address) {
            setAccount(address)
        }
        initBountiesInfo()
    }, [address, isConnected]);


    // Geri sayım zamanlayıcısı effect'i

    useEffect(() => {
        if (bountiesInfo.loaded && bountiesInfo.bounties.length > 0) {
            const twitterBounty = bountiesInfo.bounties[0]

            // Calculate the target timestamp when claim will be available
            let targetTimestamp;
            if (twitterBounty.canUserClaim) {
                // If never claimed before, can claim immediately
                targetTimestamp = moment().utc().unix();
            } else {
                // Next claim time is lastClaimTime + nextClaimTime
                targetTimestamp = Number(twitterBounty.nextReward);
            }

            // Calculate initial countdown values
            const updateCountdown = () => {
                const currentTime = moment().utc().unix();
                const secondsRemaining = Math.max(0, targetTimestamp - currentTime);

                if (secondsRemaining <= 0) {
                    // Countdown complete, claim is available
                    setCountdown({
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                    });
                    setProgress(0);
                    return true; // Return true to indicate countdown is complete
                }

                // Calculate hours, minutes, seconds
                const duration = moment.duration(secondsRemaining, 'seconds');
                setCountdown({
                    hours: duration.hours(),
                    minutes: duration.minutes(),
                    seconds: duration.seconds()
                });

                // Calculate progress percentage
                const newProgress = (secondsRemaining / totalSeconds) * 100;
                setProgress(Math.min(100, newProgress)); // Ensure it doesn't exceed 100%

                return false; // Countdown still in progress
            };

            // Do initial update
            const isComplete = updateCountdown();

            // Only set interval if countdown is not already complete
            let timer: NodeJS.Timeout | null = null;
            if (!isComplete) {
                timer = setInterval(() => {
                    const isComplete = updateCountdown();
                    if (isComplete && timer) {
                        clearInterval(timer);
                    }
                }, 1000);
            }

            // Cleanup when component unmounts or bountiesInfo changes
            return () => {
                if (timer) {
                    clearInterval(timer);
                }
            };
        }
    }, [bountiesInfo, totalSeconds]);

    useEffect(() => {
        // You could add logic here to trigger an action when countdown hits zero
        const isCountdownComplete = countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0;
        if (isCountdownComplete) {
            console.log("Countdown complete! Reward is available to claim");
        }
    }, [countdown]);

    // Rastgele pulse efektleri için useEffect
    useEffect(() => {
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




    const displayError = (error: string) => {
        setClaimModal({
            status: 'error',
            message: error,
            visible: true,
        });
    }

    const handleClaimTradingRewards = async () => {
        if (!bountiesInfo) {
            displayError("Invalid bounties info");
            return;
        }
        if (!bountiesInfo.bounties) {
            displayError("Invalid bounties info");
            return;
        }
        if (bountiesInfo.bounties.length == 0) {
            displayError("Invalid bounties info");
            return;
        }
        if (!address) {
            displayError("Invalid account");
            return;
        }


        var tradingBounty = bountiesInfo.bounties[1];
        if (tradingBounty.userAvailableReward == 0n) {
            displayError("No rewards to claim");
            return;
        }

        if (!tradingBounty.canUserClaim) {
            displayError("Reward already claimed");
            return;
        }



        try {
            const claimRewardParam: BountyClaimParam = {
                bountyId: tradingBounty.bountyId,
                taskId: 0n,
                params: "",
            };

            await handleClaimedRewards(walletProvider, claimRewardParam);

            // Show success modal with claimed amount
            setClaimedAmount(parseFloat(ethers.formatEther(tradingBounty.userAvailableReward)).toFixed(2) + " $1K");


            // Clear the input field after successful claim
            setInputValue("");
        } catch (error) {
            displayError("Error claiming reward:" + error);
            console.error("Error claiming reward:", error);
            // Optional: Add error handling here
        } finally {

        }
    }

    const handleClaimBounty = async (tradingBounty: any) => {

        if (!tradingBounty) {
            displayError("Invalid bounties info");
            return;
        }

        if (!address) {
            displayError("Invalid account");
            return;
        }


        if (tradingBounty.userAvailableReward == 0n) {
            displayError("No rewards to claim");
            return;
        }

        if (!tradingBounty.canUserClaim) {
            displayError("Reward already claimed");
            return;
        }


        console.log("Claim Trading Rewards");

        try {
            const claimRewardParam: BountyClaimParam = {
                bountyId: tradingBounty.bountyId,
                taskId: 0n,
                params: "",
            };

            await handleClaimedRewards(walletProvider, claimRewardParam);

            // Show success modal with claimed amount
            setClaimedAmount(parseFloat(ethers.formatEther(tradingBounty.userAvailableReward)).toFixed(2) + " $1K");

            // Clear the input field after successful claim
            setInputValue("");

        } catch (error) {
            displayError("Error claiming reward:" + error);
            console.error("Error claiming reward:", error);
            // Optional: Add error handling here
        } finally {

        }
    }

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
                    setCanClaimTweet(true);
                    return 10;
                }
                return newTime;
            });
        }, 1000);
    };


    const handleClaimTwitter = async () => {


        const tweetInfo = parseTweetUrl(inputValue);
        // setTweetInfo(tweetInfo);

        if (!tweetInfo || !tweetInfo.valid || isClaimLoading) {
            return;
        }
        if (!tweetInfo.tweetId) {
            displayError("Invalid Tweet ID");
            return;
        }
        const tweetTimestamp = Number(decodeTweetId(tweetInfo.tweetId).timestamp);
        const now = Date.now(); // milisaniye

        const tweetTimeMs = tweetTimestamp; // tweet timestamp saniyeyse, milisaniyeye çevir

        const isExpired = now > tweetTimeMs + 5 * 60 * 1000; // 10 dakika sonra geçersiz
        console.log(tweetTimestamp, now, tweetTimeMs, isExpired);

        if (isExpired) {
            displayError("Tweet has expired (10-minute validity).");
            return;
        }


        if (bountiesInfo?.bountyUserInfo?.registered) {
            if (tweetInfo.username?.toString().toLocaleLowerCase() != bountiesInfo?.bountyUserInfo?.twitter?.toString().toLocaleLowerCase()) {
                displayError("Invalid Action!");
                return;
            }
        }


        try {
            const claimRewardParam: BountyClaimParam = {
                bountyId: 0n,
                taskId: tweetInfo.tweetId,
                params: tweetInfo.username || "",
            };

            await handleClaimedRewards(walletProvider, claimRewardParam);

            // Show success modal with claimed amount
            setClaimedAmount("1000 $1K");

            // Clear the input field after successful claim
            setInputValue("");

        } catch (error) {
            console.error("Error claiming reward:", error);
            // Optional: Add error handling here
        } finally {
            setCanClaimTweet(false);

        }
    };

    // Add this function to close the modal
    const closeSuccessModal = () => {
        setClaimModal({
            status: 'none',
            visible: false,
            message: '',
        });
    };

    function calculateRewards(
        totalReward: bigint,          // Örn: 175_929_873_695_631_402_947_886n
        totalUsers: number,           // Kaç kullanıcıya dağıtılacak
        decayRate: number = 9500,     // 10000 üzerinden
        precision: number = 10000     // Sabit payda
    ): bigint[] {
        const P = BigInt(precision);
        const R = BigInt(decayRate);

        // 1) Her kullanıcının 'a(i)' katsayısını üret (a(0)=P, a(i+1)=a(i)*R/P)
        const factors: bigint[] = [];
        let factor = P;          // ilk kullanıcı tam pay alır (1.0)

        for (let i = 0; i < totalUsers; i++) {
            factors.push(factor);
            factor = (factor * R) / P;         // sonraki kullanıcı için azalt
        }

        // 2) Toplam katsayı
        const factorSum = factors.reduce((acc, f) => acc + f, 0n);

        // 3) Her kullanıcının ödülü = totalReward × a(i) / Σa
        return factors.map(f => (f * totalReward) / factorSum);
    }

    /**
     * Sadece belirli bir kullanıcı (userIndex) için ödül istiyorsanız:
     */
    function calculateRewardForUser(
        totalReward: bigint,
        userIndex: number,
        totalUsers: number,
        decayRate: number = 9500,
        precision: number = 10000
    ): bigint {
        const rewards = calculateRewards(totalReward, totalUsers, decayRate, precision);
        return rewards[userIndex];
    }
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
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Earned</span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}> {parseFloat(bountiesInfo.totalClaimed).toFixed(2)} $1K</span>
                                </div>
                                <div className="flex justify-between mb-1 hidden">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Username</span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}> {bountiesInfo?.bountyUserInfo?.twitter}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Access</span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {bountiesInfo?.bountyUserInfo?.lastaccess ? moment.unix(Number(bountiesInfo?.bountyUserInfo?.lastaccess)).format('DD/MM/YYYY HH:mm:ss') : '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between hidden">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Claimable Reward</span>
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>1,000 $1K</span>
                                </div>
                            </div>

                            {!isConnected ? <ConnectButton /> : <motion.button

                                className={`w-full py-3 rounded-xl font-medium ${tweetButtonWaiting
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
                                disabled={isClaimLoading}
                                onClick={() => {
                                    handleClaimTradingRewards()
                                }}
                            >
                                {isClaimLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </div>
                                ) : (
                                    "Claim Trading Rewards"
                                )}


                            </motion.button>}
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
                        className="mb-4 flex justify-center"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className={`${isDarkMode
                            ? 'bg-gray-800/70 border-gray-700/50'
                            : 'bg-white/80 border-white/30'
                            } backdrop-blur-lg p-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.06)] border flex space-x-1 transition-all duration-300`}>

                            <button
                                className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'rewards'
                                    ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-white/50'}`}
                                onClick={() => setActiveView('rewards')}
                            >
                                <Gem className="w-4 h-4 mr-1.5" />
                                Rewards
                            </button>

                            <button
                                className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'jackpot'
                                    ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-white/50'}`}
                                onClick={() => setActiveView('jackpot')}
                            >
                                <Coins className="w-4 h-4 mr-1.5" />
                                Jackpot
                            </button>



                            <button
                                className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'airdrop'
                                    ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-white/50'}`}
                                onClick={() => setActiveView('airdrop')}
                            >
                                <Bird className="w-4 h-4 mr-1.5" />
                                Instant
                            </button>


                        </div>
                    </motion.div>

                    {activeView === 'airdrop' &&
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
                                <div className={`mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'} ${canClaimTweet ? 'hidden' : ''}`}>
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
                                                className={`w-full py-3 rounded-xl font-medium ${tweetButtonWaiting
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
                                <div className={`mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'} ${canClaimTweet ? '' : 'hidden'}`}>
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
                                                value={inputValue}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setInputValue(value);

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
                                        className={`w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#ff1356] to-[#ff4080] 
        ${(!isClaimLoading) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                        animate={{ opacity: (!isClaimLoading) ? 1 : 0.6 }}
                                        onClick={handleClaimTwitter}
                                        whileHover={{
                                            opacity: (!isClaimLoading) ? 0.9 : 0.6,
                                            transition: { duration: 0.3 }
                                        }}
                                        disabled={isClaimLoading}
                                    >
                                        {isClaimLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </div>
                                        ) : (
                                            "Verify & Claim 1000 $1K"
                                        )}
                                    </motion.button>
                                    <p className={`text-sm mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your Tweet URL to enable claiming</p>
                                </div>


                            </div>
                        </motion.div>

                    }
                    {activeView === 'jackpot' &&
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
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Jackpot Time! Share & Earn</h2>
                                    <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Last 200 users share 1K tokens based on your trade volume.
                                    </p>
                                </div>

                                {/* Rewards Information */}
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'}`}>



                                    {/* Jackpot Section */}
                                    <div className=" border-gray-700/30">


                                        {/* Jackpot Prize Display */}
                                        <motion.div
                                            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} mb-6 relative overflow-hidden`}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            {/* Animated Background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, 0]
                                                }}
                                                transition={{
                                                    duration: 5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />

                                            <div className="relative z-10 text-center">
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                                                    Current Prize Pool
                                                </p>
                                                <motion.div
                                                    className="text-4xl font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent"
                                                    animate={{
                                                        scale: [1, 1.05, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    {bountiesInfo && bountiesInfo.bounties && bountiesInfo.bounties.length > 1 ? parseFloat(ethers.formatEther(bountiesInfo.bounties[1].userTotalReward)).toFixed(2) : 0} $1K
                                                </motion.div>
                                                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Next draw in: 23:45:12
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* Recent Winners */}
                                        <div className="space-y-3">
                                            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                                                Eligable users
                                            </h4>
                                            <div className="flex flex-col gap-2 max-h-[60dvh] scrollbar-hide overflow-y-auto items-center gap-2">
                                                {jackpotInfo && jackpotInfo.isLoaded && jackpotInfo.receivers.length > 0 && jackpotInfo.receivers.map((winner: any, index: number) => (
                                                    <motion.div
                                                        key={winner}
                                                        className={`p-3 cursor-pointer w-full rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        <div className="flex items-center gap-2 justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-[#ff4080]">
                                                                        {index + 1}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-semibold text-[#ff4080]`}>
                                                                        {
                                                                            bountiesInfo && bountiesInfo.bounties && bountiesInfo.bounties.length > 1 ? parseFloat(ethers.formatEther(calculateRewardForUser(bountiesInfo.bounties[1].userTotalReward, index, jackpotInfo.receivers.length))).toFixed(2) : 0} $1K


                                                                    </p>
                                                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                        {winner}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Jackpot Info */}
                                        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10">
                                            <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                How to Win
                                            </h4>
                                            <ul className={`text-xs space-y-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <li className="flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-[#ff4080] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Complete daily tasks to earn tickets</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-[#ff4080] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>More transfers = higher chances to win</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-[#ff4080] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Draw happens every 24 hours</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    }

                    {activeView === 'rewards' && (
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
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rewards Overview</h2>
                                </div>



                                {/* Rewards List */}
                                <div className={`w-full space-y-4`}>
                                    {bountiesInfo.bounties.length === 0 ? (
                                        <>
                                            {[1, 2].map((index) => (
                                                <div key={`skeleton${index}`} className={`flex flex-col gap-2 items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                                                    <div className="flex flex-between items-center justify-between gap-2 w-full">
                                                        <div>
                                                            <div className="h-5 w-32 bg-gray-300/50 rounded animate-pulse"></div>
                                                            <div className="h-3 w-48 bg-gray-300/50 rounded animate-pulse mt-2"></div>
                                                        </div>
                                                        <div className="h-5 w-20 bg-gray-300/50 rounded animate-pulse"></div>
                                                    </div>
                                                    <div className={`w-full p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'}`}>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {[1, 2, 3, 4, 5].map((item) => (
                                                                <div key={`skeletonItem${item}`} className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'} flex items-center gap-2`}>
                                                                    <div className="w-7 h-7 rounded-full bg-gray-300/50 animate-pulse"></div>
                                                                    <div className="flex-1">
                                                                        <div className="h-3 w-16 bg-gray-300/50 rounded animate-pulse mb-1"></div>
                                                                        <div className="h-4 w-24 bg-gray-300/50 rounded animate-pulse"></div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div className={`p-2.5 rounded-lg flex items-center gap-2`}>
                                                                <div className="w-full h-8 bg-gray-300/50 rounded-lg animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        bountiesInfo.bounties.map((bounty: any) => (
                                            <div key={`bountyExtra${bounty.bountyId}`}
                                                className={`flex flex-col gap-2 items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}
                                            >
                                                <div className="flex flex-between items-center justify-between gap-2">
                                                    <div>
                                                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{bounty.bountyName}</p>
                                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{bounty.bountyDescription}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <p className="font-semibold text-[#ff4080]">{BOUNTY_TYPE_ARRAY[bounty.bountyType]}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-full p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/60'}`}>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'} flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:bg-opacity-95 cursor-pointer group`}>
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff1356]/30 to-[#ff4080]/30 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-3.5 h-3.5 text-[#ff4080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>Total</p>
                                                                <p className="text-sm font-bold text-[#ff4080] truncate">{bounty.tokenAmount == ethers.MaxUint256 ? "UNLIMITED" : ethers.formatEther(bounty.userTotalReward)} $1K</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'} flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:bg-opacity-95 cursor-pointer group`}>
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff1356]/30 to-[#ff4080]/30 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-3.5 h-3.5 text-[#ff4080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>Claimed</p>
                                                                <p className="text-sm font-bold text-[#ff4080] truncate">{parseFloat(ethers.formatEther(bounty.userTotalReward)).toFixed(2)} $1K</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'} flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:bg-opacity-95 cursor-pointer group`}>
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff1356]/30 to-[#ff4080]/30 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-3.5 h-3.5 text-[#ff4080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>Claimable</p>
                                                                <p className="text-sm font-bold text-[#ff4080] truncate">{parseFloat(ethers.formatEther(bounty.userAvailableReward)).toFixed(2)} $1K</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'} flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:bg-opacity-95 cursor-pointer group`}>
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff1356]/30 to-[#ff4080]/30 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-3.5 h-3.5 text-[#ff4080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>Last Claim</p>
                                                                <p className="text-sm font-bold text-[#ff4080] truncate">{moment.unix(Number(bounty.userLastClaimDate)).format('DD/MM/YY HH:mm')}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-gray-900/70' : 'bg-white/90'} flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:bg-opacity-95 cursor-pointer group`}>
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff1356]/30 to-[#ff4080]/30 flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-3.5 h-3.5 text-[#ff4080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>Next Claim</p>
                                                                <p className="text-sm font-bold text-[#ff4080] truncate">{moment.unix(Number(bounty.nextReward)).format('DD/MM/YY HH:mm')}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2.5 rounded-lg flex items-center gap-2`}>
                                                            <button
                                                                className={`w-full px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${bounty.canUserClaim
                                                                        ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white hover:shadow-lg hover:shadow-[#ff4080]/20 hover:scale-105 active:scale-95'
                                                                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                                                    }`}
                                                                disabled={!bounty.canUserClaim}
                                                                onClick={() => {
                                                                    if (BOUNTY_TYPE_ARRAY[bounty.bountyType] === BOUNTY_TYPE.TWEET) {
                                                                        setActiveView('airdrop')
                                                                    } else {
                                                                        handleClaimBounty(bounty)
                                                                    }
                                                                }}
                                                            >
                                                                {isClaimLoading ? (
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Verifying...
                                                                    </div>
                                                                ) : (
                                                                    bounty.canUserClaim ? 'Claim' : 'Not Available'
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>

                <div className="order-3 sm:order-3 lg:col-span-2">
                    <RecentClaim />

                </div>
            </div>

            {claimModal.visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={closeSuccessModal}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={`relative rounded-2xl p-1 max-w-md w-full shadow-2xl ${isDarkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                            : 'bg-gradient-to-br from-white to-gray-50'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`rounded-2xl p-6 ${isDarkMode
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                            : 'bg-gradient-to-br from-white to-gray-50'
                            }`}>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeSuccessModal}
                                    className={`${isDarkMode
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-500 hover:text-gray-700'
                                        } transition-colors`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="text-center py-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
                                    className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080] flex items-center justify-center mb-6"
                                >
                                    {claimModal.status === 'success' ? (
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </motion.div>

                                <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                        }`}
                                >
                                    {claimModal.status === 'success' ? 'Reward Claimed!' : 'Error'}
                                </motion.h3>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}
                                >
                                    {claimModal.status === 'success' ? 'You\'ve successfully claimed your reward' : 'Unexpected error encountered.'}
                                </motion.p>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className={`rounded-xl p-4 mb-6 ${isDarkMode
                                        ? 'bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20'
                                        : 'bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10'
                                        }`}
                                >
                                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {claimModal.status === 'success' ? 'You received' : 'Error'}
                                    </p>
                                    {claimModal.status === 'success' ? (
                                        <p className="text-3xl font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent">
                                            {claimedAmount}
                                        </p>
                                    ) : (
                                        <div className="rounded-lg text-left max-h-[200px] overflow-y-auto text-sm">
                                            {claimModal.message}
                                        </div>
                                    )}
                                </motion.div>

                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={closeSuccessModal}
                                    className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#ff1356] to-[#ff4080] hover:opacity-90 transition-opacity"
                                >
                                    Awesome!
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </div>
    );
};

export default Rewards; 