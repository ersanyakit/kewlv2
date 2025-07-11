import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTokenContext } from '../../context/TokenContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Contribute from '../Contribute';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTokenContext();

  const fadeVariants = {
    initial: { opacity: 0, scale: 0.98, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: 20, 
      transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] } 
    },
  };

  useEffect(()=>{

  },[isDarkMode]);

  const location = useLocation();
  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900'} min-h-screen safe-padding min-h-screen flex flex-col gap-2 p-4 md:p-2 scrollbar-hide transition-colors duration-300`}>
      <Navbar />
     
      

      {children}
       

 
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout; 