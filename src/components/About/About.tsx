import React from 'react';
import { useTokenContext } from '../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';

const About = () => {
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

  return (
    <div className={"w-full h-full min-h-[73dvh] mx-auto flex items-center justify-center p-8"}>
    <motion.div
    className={`relative ${isDarkMode
        ? 'bg-gray-800/30 border-gray-700/30'
        : 'bg-white/40 border-white/20'
        } backdrop-blur-sm p-0.5 rounded-3xl  shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
>
  
{/* Main Content - Three Column Grid */}
    <div className="w-full max-w-6xl mx-auto  gap-4 p-10 flex flex-col text-center justify-around">
      <h1 className="text-2xl font-bold">About Us</h1>

    
  <p>KEWL is a community-driven decentralized exchange (DEX).</p>
  <p>There is no central authority — the <strong>community owns it</strong>.</p>
  <p>Everything we build is for the people, by the people.</p>
  <p>At KEWL, <strong>we serve the community because we are the community</strong>.</p>
 
    

<b>— we are the community.</b>

<motion.button
            onClick={() => {
              navigate('/')
            }}
            className={`${isConnected
                ? isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600'
                  : 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white'
                : "bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white"
              }  px-4 py-2 rounded-xl font-medium flex text-center items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>

            Go Back
          </motion.button>

      </div>
      
     
      </motion.div>
      </div>
  );
};

export default About; 