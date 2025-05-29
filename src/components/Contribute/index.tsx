import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertCircle, CheckCircle, Loader2, Wallet } from 'lucide-react';
import { useTokenContext } from '../../context/TokenContext';

// Define a type for motion button props to avoid TS errors
interface MotionButtonProps extends HTMLMotionProps<'button'> {
  // Add any custom props here if needed
}

const Contribute = () => {
  const { isDarkMode } = useTokenContext();
  const navigate = useNavigate();

  const [donationAmount, setDonationAmount] = useState<string>('0.01');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const presetAmounts = ['0.01', '0.05', '0.1', '0.5', '1.0'];

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Placeholder for actual wallet connection logic
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // if (accounts && accounts.length > 0) {
        //   setAddress(accounts[0]);
        //   setIsConnected(true);
        //   setErrorMessage('');
        // }
        // Mocking successful connection for now
        setAddress("0x1234567890abcdef1234567890abcdef12345678");
        setIsConnected(true);
      } catch (error: any) {
        console.error('Error connecting wallet:', error);
        setErrorMessage(error.message || 'Failed to connect wallet');
        setIsConnected(false);
      }
    } else {
      setErrorMessage('Please install MetaMask to use this feature');
    }
  };

  const handleDonate = async () => {
    if (!isConnected || !address || !window.ethereum) {
      setTransactionStatus('error');
      setErrorMessage('Please connect your wallet first');
      return;
    }

    try {
      setIsProcessing(true);
      setTransactionStatus('processing');

      const amountInWei = BigInt(Math.floor(parseFloat(donationAmount) * 10**18));
      
      const params = [{
        from: address,
        to: "0xYOUR_PROJECT_WALLET_ADDRESS", // Replace with your actual project wallet address
        value: '0x' + amountInWei.toString(16),
      }];

      // Placeholder for actual transaction sending logic
      // const transactionHash = await window.ethereum.request({
      //   method: 'eth_sendTransaction',
      //   params,
      // });
      // setTxHash(transactionHash);
      
      // Mocking successful transaction for now
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      setTxHash("mock_tx_0x123abc456def789ghi");
      setTransactionStatus('success');
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTransactionStatus('error');
      setErrorMessage(error.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTransaction = () => {
    setTransactionStatus('idle');
    setErrorMessage('');
    setTxHash('');
    // Optionally, reset donation amount
    // setDonationAmount('0.01');
  };

  // Theme-aware Tailwind classes
  const cardBgClass = isDarkMode ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-gray-200/60';
  const textPrimaryClass = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const textSecondaryClass = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const inputBgClass = isDarkMode ? 'bg-slate-700 focus:bg-slate-600' : 'bg-slate-100 focus:bg-white';
  const inputBorderClass = isDarkMode ? 'border-slate-600 focus:border-pink-500' : 'border-slate-300 focus:border-pink-500';
  const buttonPrimaryClass = 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white';
  const buttonSecondaryClass = isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700';
  
  const themeColor = '#ec4899'; // Pink-500

  const MotionButton = motion.button as React.ComponentType<MotionButtonProps>;

  return (
    <div className={`flex flex-col items-center justify-center transition-colors duration-300`}>
      <motion.div
        className={`relative  w-full ${cardBgClass} backdrop-blur-lg rounded-3xl border shadow-xl overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mb-4"
            >
              <Heart size={40} className="text-pink-500" fill="currentColor" />
            </motion.div>
            <h1 className={`text-2xl sm:text-3xl font-semibold ${textPrimaryClass} mb-2`}>
              Support KEWL
            </h1>
            <p className={`text-sm sm:text-base text-center ${textSecondaryClass}`}>
              Your contribution fuels our mission in decentralized finance.
            </p>
          </div>

          {transactionStatus === 'idle' && !isConnected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <MotionButton
                onClick={connectWallet}
                className={`w-full ${buttonPrimaryClass} p-3 rounded-lg font-medium text-base shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wallet size={20} />
                Connect Wallet
              </MotionButton>
              {errorMessage && <p className="text-red-500 text-xs text-center mt-3">{errorMessage}</p>}
            </motion.div>
          )}

          {transactionStatus === 'idle' && isConnected && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <label className={`block text-sm font-medium ${textSecondaryClass} mb-2`}>Select or Enter Amount (ETH)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {presetAmounts.map((amount) => (
                    <MotionButton
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2.5 px-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        donationAmount === amount
                          ? `${buttonPrimaryClass} shadow-md`
                          : `${buttonSecondaryClass}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {amount}
                    </MotionButton>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    step="0.001"
                    min="0.001"
                    placeholder="e.g., 0.1"
                    className={`w-full pl-3 pr-12 py-3 rounded-md text-base ${textPrimaryClass} ${inputBgClass} ${inputBorderClass} border focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-colors duration-200`}
                  />
                  <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm ${textSecondaryClass}`}>ETH</span>
                </div>
              </div>
              
              <p className={`text-xs ${textSecondaryClass} text-center`}>Connected as: <span className="font-mono text-xs break-all">{address}</span></p>

              <MotionButton
                onClick={handleDonate}
                disabled={isProcessing || !parseFloat(donationAmount) || parseFloat(donationAmount) <= 0}
                className={`w-full ${buttonPrimaryClass} p-3 rounded-lg font-medium text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <Loader2 size={20} className="animate-spin mx-auto" />
                ) : (
                  `Contribute ${donationAmount} ETH`
                )}
              </MotionButton>
            </motion.div>
          )}

          {transactionStatus === 'processing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{color: themeColor}} />
              <h2 className={`text-lg font-medium ${textPrimaryClass} mb-1`}>
                Processing Contribution...
              </h2>
              <p className={`${textSecondaryClass} text-sm`}>
                Please confirm in your wallet.
              </p>
            </motion.div>
          )}

          {transactionStatus === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                className="mb-4"
              >
                <CheckCircle size={44} className="mx-auto text-green-500" />
              </motion.div>
              <h2 className={`text-xl font-semibold ${textPrimaryClass} mb-2`}>
                Thank You!
              </h2>
              <p className={`${textSecondaryClass} mb-3 text-sm`}>
                Your contribution of {donationAmount} ETH is confirmed.
              </p>
              {txHash && (
                <a 
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 underline text-xs sm:text-sm transition-colors duration-200 block"
                >
                  View on Etherscan
                </a>
              )}
              <MotionButton
                onClick={resetTransaction}
                className={`mt-6 w-full max-w-xs mx-auto ${buttonSecondaryClass} p-2.5 rounded-lg font-medium text-sm shadow hover:shadow-md transition-all duration-300`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Make Another Contribution
              </MotionButton>
            </motion.div>
          )}

          {transactionStatus === 'error' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                className="mb-4"
              >
                <AlertCircle size={44} className="mx-auto text-red-500" />
              </motion.div>
              <h2 className={`text-xl font-semibold ${textPrimaryClass} mb-2`}>
                Transaction Failed
              </h2>
              <p className={`${textSecondaryClass} mb-4 text-sm px-2`}>
                {errorMessage || "An unexpected error occurred. Please try again."}
              </p>
              <MotionButton
                onClick={resetTransaction}
                className={`mt-4 w-full max-w-xs mx-auto ${buttonSecondaryClass} p-2.5 rounded-lg font-medium text-sm shadow hover:shadow-md transition-all duration-300`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </MotionButton>
            </motion.div>
          )}
          
          {/* Footer Note - always visible but subtle */}
          {transactionStatus !== 'processing' && (
            <div className={`mt-8 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} text-center`}>
                <p className={`text-xs ${textSecondaryClass}`}>
                    100% of contributions support KEWL's community development.
                </p>
            </div>
          )}
        </div>
      </motion.div>
       <button 
        onClick={() => navigate(-1)} 
        className={`absolute top-4 left-4 ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'} transition-colors`}
        aria-label="Go back"
      >
        {/* Re-add ArrowLeft if you decide to use it - ensure it's imported */}
        {/* <ArrowLeft size={24} /> */}
      </button>
    </div>
  );
};

export default Contribute;