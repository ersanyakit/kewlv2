import React from 'react';
import { motion } from 'framer-motion';
import { Info, Shield, Award, Compass, Sparkles, RefreshCw, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className={`w-full max-w-6xl mx-auto ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700/50' 
          : 'bg-white/40 border-white/30'
      } backdrop-blur-xl rounded-3xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border transition-all duration-300`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Sol Kısım - Logo ve Telif Hakkı */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff1356] to-[#ff4080] rounded-full flex items-center justify-center shadow-md mr-3">
            <img src="/assets/logo/logo.svg" alt="KEWL Logo" className="w-10 h-10 z-10" />
          </div>
          <div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-transparent bg-clip-text">KEWL EXCHANGE</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>© 2025 All rights reserved</p>
          </div>
        </div>
        
        {/* Orta Kısım - Hızlı Bağlantılar */}
        <div className="flex space-x-4 text-xs mb-4 md:mb-0">
          <span onClick={()=>{
            navigate('/about')
          }}  className={`${isDarkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-[#ff1356]'} transition-colors flex items-center cursor-pointer`}>
            <Info className="w-3 h-3 mr-1" />
            About Us
          </span>
          <span onClick={()=>{
            navigate('/assets')
          }}   className={`${isDarkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-[#ff1356]'} transition-colors flex items-center cursor-pointer`}>
            <Shield className="w-3 h-3 mr-1" />
            Assets
          </span>
          <span onClick={()=>{
            navigate('/rewards')
          }} className={`${isDarkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-[#ff1356]'} transition-colors flex items-center cursor-pointer`}>
            <Award className="w-3 h-3 mr-1" />
            Rewards
          </span>
          <span onClick={()=>{
            navigate('/leaderboard')
          }} className={`${isDarkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-[#ff1356]'} transition-colors flex items-center cursor-pointer`}>
            <Medal className="w-3 h-3 mr-1" />
            LeaderBoard
          </span>
          <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-[#ff1356]'} transition-colors flex items-center`}>
            <Compass className="w-3 h-3 mr-1" />
            Explore
          </a>
        </div>
        
        {/* Sağ Kısım - Sosyal Medya */}
        <div className="flex space-x-2">
          {/* Twitter benzeri */}
          <motion.a 
            href="https://x.com/kewlswap"
            target="_blank"
            className="w-8 h-8 bg-gradient-to-br from-[#ff1356] to-[#ff4080] rounded-full flex items-center justify-center text-white shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </motion.a>
          
          {/* Telegram benzeri */}
          <motion.a 
            target="_blank"
            href="https://t.me/kewlswap" 
            className="w-8 h-8 bg-gradient-to-br from-[#ff2d6a] to-[#ff4080] rounded-full flex items-center justify-center text-white shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7.5a2.25 2.25 0 0 0 .126 4.303l3.198 1.067v4.732a.75.75 0 0 0 1.283.534l2.722-2.722L16.683 21l.364.027a2.25 2.25 0 0 0 2.379-1.234l3-10.5a2.25 2.25 0 0 0-1.228-2.86Z"></path>
            </svg>
          </motion.a>
          
          {/* Discord benzeri */}
          <motion.a 
          target='_blank'
            href="https://discord.gg/7yXaMsS9J2" 
            className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-gradient-to-br from-indigo-400 to-indigo-600'} rounded-full flex items-center justify-center text-white shadow-sm`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v4a5 5 0 0 0 5 5h1.893l-1 2h4.214l-1-2H11a5 5 0 0 0 5-5V9Z"></path>
              <circle cx="12" cy="11" r="1"></circle>
              <circle cx="8" cy="11" r="1"></circle>
              <circle cx="16" cy="11" r="1"></circle>
            </svg>
          </motion.a>
          
          {/* Github benzeri */}
          <motion.a 
            href="https://github.com/kewlexchange"
            target='_blank' 
            className={`w-8 h-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-600 to-gray-800' : 'bg-gradient-to-br from-gray-700 to-gray-900'} rounded-full flex items-center justify-center text-white shadow-sm`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </motion.a>
        </div>
      </div>
      
      {/* Alt Bilgi Çizgisi */}
      <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="flex items-center mb-2 md:mb-0">
          <Shield className={`w-3 h-3 ${isDarkMode ? 'text-pink-400' : 'text-[#ff1356]'} mr-1`} />
          <span>SSL Secure Transactions</span>
        </div>
        
        <div className="flex space-x-3">
          <span onClick={()=>{
            navigate('/tos')
          }} className={`${isDarkMode ? 'hover:text-pink-300' : 'hover:text-[#ff1356]'} transition-colors cursor-pointer`}>Terms of Service</span>
          <a href="#" className={`${isDarkMode ? 'hover:text-pink-300' : 'hover:text-[#ff1356]'} transition-colors`}>Privacy Policy</a>
          <a href="#" className={`${isDarkMode ? 'hover:text-pink-300' : 'hover:text-[#ff1356]'} transition-colors`}>Cookies</a>
          <a href="#" className={`${isDarkMode ? 'hover:text-pink-300' : 'hover:text-[#ff1356]'} transition-colors`}>Help</a>
        </div>
        
        <div className="mt-2 md:mt-0 flex items-center">
          <Sparkles className={`w-3 h-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'} mr-1`} />
          <span>v1.2.5 Beta</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer; 