import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2, Plus, XCircle } from 'lucide-react';
import { useSwapContext } from '../../context/SwapContext';
import { useAppKitProvider } from '@reown/appkit/react';
import { Token, useTokenContext } from '../../context/TokenContext';
import { Token as entityToken} from '../../constants/entities';

interface ImportTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onImport: (tokenData: any) => void;
}

const ImportTokenModal: React.FC<ImportTokenModalProps> = ({ isOpen, onClose, isDarkMode, onImport }) => {
  const [address, setAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<entityToken | null>(null);
  const { walletProvider } = useAppKitProvider('eip155');

const { addCustomToken } = useTokenContext();

    const {
      fetchTokenInfo,
      loading,
  
    } = useSwapContext();
  // Adres girildiğinde simüle edilmiş token bilgisi getirme
  // Gerçek uygulamada burada web3/ethers/solana kütüphanesi ile contract çağrısı yapılır
  useEffect(() => {
    if (address.length >= 32) { // Örn: Solana veya EVM adresi uzunluğu
      fetchTokenInfoData(address);
    } else {
      setTokenInfo(null);
    }
  }, [address]);

  const fetchTokenInfoData = async (addr: string) => {
  

    const tokenInfo = await fetchTokenInfo(walletProvider,addr)
    setTokenInfo(tokenInfo);
   

  };

  const handleImport = () => {
    if (tokenInfo) {

 const newToken: Token = {
    chainId: tokenInfo.chainId,
    address: tokenInfo.address,
    symbol: tokenInfo.symbol || "Unknown",
    name:tokenInfo.name || "Unknown",
    decimals: tokenInfo.decimals,
    balance: '0',
    icon: '',
    price: '$0',
    change: '0%',
    trend: 'neutral',
  };
        addCustomToken(newToken)
      onImport({ ...tokenInfo, address });
      onClose();
      setAddress('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed left-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full w-full h-screen  overflow-hidden   ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`p-2 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} flex justify-between items-center`}>
              <h3 className={`text-md font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Import Token</h3>
         
               <motion.button
                  className={`${isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600'
                    : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100 ring-pink-200'
                    } p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onClose();
                  
                  }}
                  aria-label="Close"
                >
                  <XCircle className={`w-6 h-6 `} />
                </motion.button>
            </div>

            <div className="p-2 space-y-4">
              {/* Input Field */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Token Address</label>
                <input
                  type="text"
                  placeholder="Paste contract address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-pink-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#ff1356]'
                  } border`}
                />
              </div>

              {/* Token Preview */}
              <div className={`min-h-[100px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed ${
                isDarkMode ? 'border-gray-800 bg-gray-800/20' : 'border-gray-100 bg-gray-50/50'
              }`}>
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                ) : tokenInfo ? (
                  <div className="grid grid-cols-3 gap-4 w-full p-4">
                    <div className="text-center">
                      <div className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Name</div>
                      <div className={`font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tokenInfo.name}</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Symbol</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tokenInfo.symbol}</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Decimals</div>
                      <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{tokenInfo.decimals}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Enter address to see details</span>
                )}
              </div>

              {/* Warning Box */}
              <div className={`p-2  rounded-2xl flex gap-3 ${
                isDarkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-100'
              }`}>
                <AlertTriangle className="w-8 h-8 text-orange-500 shrink-0" />
                <p className="text-[11px] leading-relaxed text-orange-600 font-medium">
                  External tokens are likely added for testing purposes or as potential scams. 
                  Please conduct your own research. Otherwise, you may risk losing your assets.
                </p>
              </div>

              {/* Action Button */}
              <button
                disabled={!tokenInfo || loading}
                onClick={handleImport}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
                  isDarkMode 
                    ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-900/20' 
                    : 'bg-[#ff1356] hover:bg-[#ff1356]/90 text-white shadow-pink-200'
                }`}
              >
                <Plus className="w-5 h-5" />
                Import Token
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportTokenModal;