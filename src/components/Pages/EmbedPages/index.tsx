import React, { useEffect } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount,useAppKitNetwork,useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import SwapForm from '../../Swap/SwapForm/SwapForm';
import { useSearchParams } from 'react-router-dom';
import ConnectButton from '../../UI/ConnectButton';
import { appkitOptions, getChainById, publicClient, walletClient } from '../../../context/Web3ProviderContext';
import { AppKitNetwork } from '@reown/appkit/networks';
import FushionForm from '../../Swap/SwapForm/FushionForm';
import BundleForm from '../../Swap/SwapForm/BundleForm';


interface EmbeddedSwapPageProps {
    swap: 'aggregator' | 'swap'| 'bundle';
  }

const EmbeddedSwapPage = ({swap}: EmbeddedSwapPageProps) => {
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
      setBaseToken,
      setQuoteToken,
      setAccount,
      tokens,
        toggleDarkMode,
    } = useTokenContext();
    const { address, isConnected } = useAppKitAccount();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {switchNetwork,caipNetworkId,chainId} = useAppKitNetwork()
    
     
    


    const base = searchParams.get('base');   // "TBT"
    const quote = searchParams.get('quote'); // "CHZ"
    const defaultChainId = searchParams.get('chainId'); // 8888
    const theme = searchParams.get('theme'); // "dark"




    useEffect(() => {
        if(theme){
            if(theme === 'dark'){
                if(!isDarkMode){
                    toggleDarkMode();
                }
            }else{
                if(isDarkMode){
                    toggleDarkMode();
                }
            }
        }
        if(tokens.length === 0) return;
        if (base && quote) {
            let _base = tokens.find(token => token.symbol.toLowerCase() === base.toLowerCase());
            let _quote = tokens.find(token => token.symbol.toLowerCase() === quote.toLowerCase());
            if (_base && _quote) {
                setBaseToken(_base);
                setQuoteToken(_quote);
            }
      

            if(defaultChainId){
                if(parseInt(defaultChainId) !== chainId){
                    switchNetwork(getChainById(parseInt(defaultChainId)) as AppKitNetwork)
                }
            }
            if(address) {   
                setAccount(address);
            }
        }
    }, [base, quote, tokens, address, defaultChainId]);

  return (
    <div className={"min-h-[73dvh] w-full flex items-center justify-center p-2"}>
        <motion.div
            className={`relative ${isDarkMode
                ? 'bg-gray-800/30 border-gray-700/30'
                : 'bg-white/40 border-white/20'
                } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }} >

        <div className={`relative w-full ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} w-full backdrop-blur-md rounded-3xl overflow-hidden`}>
            <div className="w-full flex  gap-4">
                {
                    swap === 'swap' && <SwapForm disableTokenSelector={base && quote ? true : false} />
                }       
                {
                    swap === 'aggregator' && <FushionForm />
                }
                {
                    swap === 'bundle' && <BundleForm />
                }
                
            </div>
        </div>
      </motion.div>
      </div>
  );
};

export default EmbeddedSwapPage; 