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
  Wallet
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
import SwapForm from './SwapForm/SwapForm';
import { useTokenContext } from '../../context/TokenContext';
import PoolsView from './Pools/PoolsView';
import ETFView from './ETF/ETFView';

export default function TradeTerminal() {
  // Token context'inden verileri alıyoruz
  const {
    tokens,
    baseToken,
    quoteToken,
    isDarkMode
  } = useTokenContext();

  // TradeTerminal'a özgü diğer state'ler
  const [swapDirection, setSwapDirection] = useState('horizontal');
  const [swapAnimation, setSwapAnimation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [activeView, setActiveView] = useState('swap');
  const [showHistory, setShowHistory] = useState(true);

  // Reference for draggable elements (eğer kullanılıyorsa)
  const constraintsRef = useRef(null);

  // Motion values for interactive elements
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);

  // Recent transactions for history
  const recentTransactions = [
    { id: 1, from: 'WCHZ', to: 'KEWL', fromAmount: '5,000', toAmount: '0.293', status: 'completed', time: '22 dk önce' },
    { id: 2, from: 'WCHZ', to: 'WGAL', fromAmount: '0.12', toAmount: '5,183.42', status: 'completed', time: '3 saat önce' },
    { id: 3, from: 'wCHZ', to: 'PEPPER', fromAmount: '1.5', toAmount: '25,542', status: 'pending', time: 'İşleniyor' }
  ];



  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900'}  flex flex-col p-4 md:p-6 transition-colors duration-300`}>
      {/* Main Content - Three Column Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Left Column - Token List Component */}
        <div className="lg:col-span-2">
          <TokenList
            isDarkMode={isDarkMode}
          />
        </div>

   <div className="lg:col-span-3">
          <SwapTabs
            activeView={activeView}
            setActiveView={setActiveView}
            isDarkMode={isDarkMode}
          />

          {activeView === 'swap' && (
            <SwapForm
              isDarkMode={isDarkMode}
              slippageTolerance={slippageTolerance}
              setSlippageTolerance={setSlippageTolerance}
              swapDirection={swapDirection}
              setSwapDirection={setSwapDirection}
             
            />
          )}
          {activeView === 'pools' && (
            <PoolsView isDarkMode={isDarkMode} />
          )}


          {activeView === 'etf' && (
            <ETFView isDarkMode={isDarkMode} />
          )}
        </div> 

        <div className="lg:col-span-2">
          <TransactionHistory
            transactions={recentTransactions}
            tokens={tokens}
            isDarkMode={isDarkMode}
          />
        </div>  
      </div>
    </div>
  );
} 