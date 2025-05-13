import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import React, { useEffect } from 'react';
import { Globe, Wallet, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTokenContext } from '../../context/TokenContext';

const ConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork()
  const { setAccount } = useTokenContext();
  const { isDarkMode } = useTokenContext();

  useEffect(()=>{
    if(chainId){
      console.log("Current Chain",chainId)
    }
  },[chainId])

  useEffect(()=>{
    if(address){
        if(isConnected){    
            setAccount(address)
        }else{
            setAccount(address)
        }
    }
  },[address,isConnected])

  // Function to truncate the address for display
  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <motion.button 
      onClick={() => open()}
      className={`${
        isConnected 
          ?  isDarkMode 
          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600' 
          : 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white'
          : "bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white"
      }  px-4 py-2 rounded-xl font-medium flex items-center shadow-md hover:shadow-lg transition-shadow duration-300 w-full flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isConnected ? "Account" : "Connect wallet"}
    >
      {isConnected ? (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          {truncateAddress(address || '')}
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect
        </>
      )}
    </motion.button>
  );
};

export default ConnectButton;
