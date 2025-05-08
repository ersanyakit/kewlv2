import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Wallet, RefreshCw } from 'lucide-react';
import { useTokenContext } from '../../context/TokenContext';
import ConnectButton from '../UI/ConnectButton';

interface NavbarProps {
  // isDarkMode ve setIsDarkMode prop'larına artık ihtiyacımız yok
}

const Navbar: React.FC<NavbarProps> = () => {
  const { isDarkMode, toggleDarkMode } = useTokenContext();
  
  return (
    <motion.div 
      className={`w-full max-w-6xl mx-auto ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-white/30'
      } backdrop-blur-xl rounded-3xl px-6 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border flex justify-between items-center transition-all duration-500 sticky top-4 z-50`}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center">
        {/* Logo */}
        <div className="mr-3 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff1356] to-[#ff4080] rounded-full shadow-md overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
            
              <img src="/assets/logo/logo.svg" alt="KEWL Logo" className="w-10 h-10 z-10" />
            </div>
        
          </div>
        </div>
        
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-transparent bg-clip-text">KEWL</h1>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Intelligent Asset Swapping for the Next Generation of DeFi.</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Tema Değiştirme Butonu - Geliştirilmiş */}
        <motion.button 
          className={`${
            isDarkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600' 
              : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100 ring-pink-200'
          } p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          aria-label="Tema değiştir"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
        
        {/* Settings Butonu */}
        <motion.button 
          className={`${
            isDarkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600' 
              : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100 ring-pink-200'
          } p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
        
        {/* Connect Butonu */}

        <ConnectButton/>
       
      </div>
    </motion.div>
  );
};

export default Navbar;