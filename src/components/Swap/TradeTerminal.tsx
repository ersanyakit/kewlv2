import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ChevronDown,
  ArrowDownUp,
  ArrowRight,
  Settings,
  X,
  Search,
  Clock,
  AlertCircle,
  Lock,
  CheckCircle,
  Star,
  BarChart3,
  TrendingUp,
  Filter,
  Sparkles,
  Shield,
  Info,
  Zap,
  Plus,
  Minus,
  RotateCcw,
  RefreshCw,
  DollarSign,
  Award,
  Eye,
  EyeOff,
  PieChart,
  Compass,
  Moon,
  Sun,
  Wallet,
  Heart
} from 'lucide-react';

// Enhanced token type with more professional information
type Token = {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  marketCap?: string;
  volume24h?: string;
  verified?: boolean;
  favorite?: boolean;
  category?: string;
  color?: string;
};

// Add imports for our new components
import TokenList from './TokenList';
import TransactionHistory from './TransactionHistory';
import SwapTabs from './SwapTabs';
import { useTokenContext } from '../../context/TokenContext';
import PoolsView from './Pools/PoolsView';
import ETFView from './ETF/ETFView';
import SwapLayout from './SwapForm/SwapLayout';
import SwapSettingsForm from './SwapForm/SwapSettingsForm';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TradeTerminal() {
  // Token context'inden verileri alıyoruz
  const {
    tokens,
    baseToken,
    quoteToken,
    isDarkMode,
    isSettingsModalOpen,
    activeView,
    setActiveView,
    setIsSettingsModalOpen
  } = useTokenContext();
  const location = useLocation();

  // TradeTerminal'a özgü diğer state'ler
  const [swapDirection, setSwapDirection] = useState('horizontal');
  const [swapAnimation, setSwapAnimation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [showHistory, setShowHistory] = useState(true);
    const navigate = useNavigate();

  // Reference for draggable elements (eğer kullanılıyorsa)
  const constraintsRef = useRef(null);

  // Motion values for interactive elements
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);

  useEffect(() => {
   
  }, []);

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }else{
      setActiveView('swap');
    }
  }, [location.state]);
  return (
    <div className={`flex flex-col px-0 py-4 md:p-4 transition-colors duration-300`}>
      {/* Main Content - Three Column Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Left Column - Token List Component */}
        <div className="order-2 sm:order-1 lg:col-span-2">
          <TokenList/>
        </div>

        <div className="order-1 sm:order-2 lg:col-span-3 flex flex-col gap-4">
          {
            isSettingsModalOpen && (
              <SwapSettingsForm/>
            )
          }
          

<motion.button
      whileHover={{
        boxShadow: isDarkMode
          ? "0 4px 15px rgba(255, 19, 86, 0.6)"
          : "0 4px 15px rgba(255, 19, 86, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={()=>{
        navigate("/launchpad")
        
      }}
      className={`flex items-center gap-2 px-5 py-5 rounded-full font-semibold 
        ${isDarkMode
          ? "bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white"
          : "bg-gradient-to-r from-pink-500 to-pink-400 text-white"}
      `}
    >
      <Heart className="w-4 h-4" />
      Donate for the Development of KEWL Casino
    </motion.button>

          <SwapTabs
            isLimitOrder={false}
            isDarkMode={isDarkMode}
          />

          {activeView === 'swap' && (
            <SwapLayout/>
         
          )}
          {activeView === 'pools' && (
            <PoolsView isDarkMode={isDarkMode} />
          )}


          {activeView === 'etf' && (
            <ETFView isDarkMode={isDarkMode} />
          )}
        </div> 

        <div className="order-3 sm:order-3 lg:col-span-2">
          <TransactionHistory/>
        </div>  
      </div>
    </div>
  );
} 