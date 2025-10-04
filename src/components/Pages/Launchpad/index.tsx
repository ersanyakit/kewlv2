import React, { useEffect, useState, useCallback } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../UI/ConnectButton';
import moment from 'moment';
import { ethers } from 'ethers';
import { Bird, BookOpenText, Clock, Coins, Gem, HeartPulse, LockKeyhole, PieChart, PiggyBank, RefreshCw, Users, Waves } from 'lucide-react';
import { useSwapContext } from '../../../context/SwapContext';
import CasinoOverview from './Casino';
import TokenomicsInfo from './Casino/tokenomics';
import VestingInfo from './Casino/vesting';
import TeamInfo from './Casino/team';
import LaunchpadDisclaimer from './Casino/disclaimer';
import ContributeCard from './Casino/contribute';

const Launchpad = () => {
    // Token context'inden verileri al
    const {
        setAccount,
        isDarkMode,
    } = useTokenContext();
    const { walletProvider } = useAppKitProvider('eip155');
    const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al

    const { address, isConnected } = useAppKitAccount();
    const { bountiesInfo, setBountiesInfo, fetchBountiesInfo, handleClaimedRewards, isClaimLoading, setIsClaimLoading, claimModal, setClaimModal, fetchJackPotInfo, jackpotInfo } = useSwapContext();
    const navigate = useNavigate();
    const [getTweet, setTweet] = useState<string>("");
    const [tweetButtonWaiting, setTweetButtonWaiting] = useState<boolean>(false);
    const [tweetWaitTime, setTweetWaitTime] = useState<number>(10);
    const [canClaimTweet, setCanClaimTweet] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [activeView, setActiveView] = useState<string>("overview");
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

 
    useEffect(() => {
        if (address) {
            setAccount(address)
        }
    
    }, [address, isConnected,chainId]);


  

 
 
   
    return (
        <div className={` max-w-6xl mx-auto flex flex-col p py-4 transition-colors duration-300`}>




            <div className="w-full  grid grid-cols-1 lg:grid-cols-7 gap-4">

                <div className="order-2 sm:order-1 lg:col-span-2">
               
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
                                className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'overview'
                                    ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-white/50'}`}
                                onClick={() => setActiveView('overview')}
                            >
                                <BookOpenText className="w-4 h-4 mr-1.5" />
                           
                                Overview
                            </button>

                            <button
                                className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'deposit'
                                    ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-white/50'}`}
                                onClick={() => setActiveView('deposit')}
                            >
                                <PiggyBank className="w-4 h-4 mr-1.5" />
                           
                                Contribute
                            </button>

      <button
                                className={`text-sm font-medium px-4 py-1.5 rounded-full flex items-center ${activeView === 'contributors'
                                    ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white shadow-lg'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-white/50'}`}
                                onClick={() => setActiveView('contributors')}
                            >
                                <HeartPulse className="w-4 h-4 mr-1.5" />
                           
                                Contributors
                            </button>

 


                           


                        </div>
                    </motion.div>

            


         {activeView === 'deposit' &&
                    <ContributeCard isDarkMode={false}/>

                    }
                  

                    {activeView === 'overview' &&
                    <CasinoOverview/>

                    }
             
 
                  

                            <div className='w-full'>
                        <LaunchpadDisclaimer isDarkMode={false}/>
                    </div>

                </div>

                <div className="order-3 sm:order-3 lg:col-span-2">
                   

                </div>
            </div>

           

        </div>
    );
};

export default Launchpad; 