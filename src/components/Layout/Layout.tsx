import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTokenContext } from '../../context/TokenContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTokenContext();

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900'} min-h-screen flex flex-col p-4 md:p-6 transition-colors duration-300`}>
      {/* Navbar Component */}
      <Navbar />
      
      {/* Main Content */}
      {children}
      
      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Layout; 