import React, { useState } from 'react';
import { useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowDownUp, 
  ChevronDown, 
  Percent, 
  Wallet, 
  Clock, 
  History, 
  AlertCircle,
  BarChart2,
  Settings,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Info,
  LineChart,
  CandlestickChart,
  BarChart,
  PieChart,
  Bell,
  Shield,
  HelpCircle,
  Maximize2,
  Minimize2,
  Filter,
  Search,
  Layers,
  Plus,
  Minus,
  X,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const ExchangePage = () => {
    const {
      isDarkMode,
      slippageTolerance,
      baseToken,
      swapMode,
      quoteToken,
      tokenFilter,
      favoriteOnly,
      filteredTokens,
      openTokenSelector,
      setOpenTokenSelector,
      setTokenFilter,
      setFavoriteOnly,
      selectToken,
      reloadTokens,
      handleSwapTokens,
      setSwapMode,
    } = useTokenContext();
    const { address, isConnected } = useAppKitAccount();
    const navigate = useNavigate();
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [selectedPair, setSelectedPair] = useState('BTC/USDT');
    const [showPairSelector, setShowPairSelector] = useState(false);
    const [price, setPrice] = useState('42,350.00');
    const [amount, setAmount] = useState('0.1');
    const [total, setTotal] = useState('4,235.00');
    const [isFavorite, setIsFavorite] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
      buyOrders: true,
      sellOrders: true
    });

    const tradingPairs = [
      { pair: 'BTC/USDT', price: '42,350.00', change: '+2.5%', volume: '1.2B' },
      { pair: 'ETH/USDT', price: '2,350.00', change: '-1.2%', volume: '800M' },
      { pair: 'BNB/USDT', price: '350.00', change: '+0.8%', volume: '500M' },
      { pair: 'SOL/USDT', price: '120.00', change: '+5.2%', volume: '300M' },
    ];

    const handlePriceChange = (value: string) => {
      setPrice(value);
      setTotal((parseFloat(value.replace(/,/g, '')) * parseFloat(amount)).toLocaleString());
    };

    const handleAmountChange = (value: string) => {
      setAmount(value);
      setTotal((parseFloat(price.replace(/,/g, '')) * parseFloat(value)).toLocaleString());
    };

    const handlePercentageClick = (percentage: number) => {
      const maxAmount = 10; // Dummy max amount
      const newAmount = (maxAmount * percentage / 100).toFixed(2);
      handleAmountChange(newAmount);
    };

    const toggleSection = (section: 'buyOrders' | 'sellOrders') => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    // Generate dummy order book data
    const generateOrderBookData = () => {
      const basePrice = 42350;
      const sellOrders = Array.from({ length: 50 }, (_, i) => ({
        price: (basePrice + (i + 1) * 10).toLocaleString(),
        amount: (0.1 * (i + 1)).toFixed(2),
        total: ((basePrice + (i + 1) * 10) * 0.1 * (i + 1)).toLocaleString()
      })).reverse(); // Reverse sell orders to show highest price at top

      const buyOrders = Array.from({ length: 50 }, (_, i) => ({
        price: (basePrice - (i + 1) * 10).toLocaleString(),
        amount: (0.1 * (i + 1)).toFixed(2),
        total: ((basePrice - (i + 1) * 10) * 0.1 * (i + 1)).toLocaleString()
      }));

      return { sellOrders, buyOrders };
    };

    const { sellOrders, buyOrders } = generateOrderBookData();

    return (
      <div className="w-full h-full min-h-[73dvh] mx-auto flex items-center justify-center p-4">
        <motion.div
          className={`relative ${isDarkMode
            ? 'bg-gray-800/30 border-gray-700/30'
            : 'bg-white/40 border-white/20'
            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full max-w-7xl mx-auto gap-4 p-4 flex flex-col">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowPairSelector(!showPairSelector)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200/20 hover:bg-gray-200/30 transition-colors"
                  >
                    <span className="font-medium">{selectedPair}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showPairSelector && (
                    <div className={`absolute top-full left-0 mt-1 w-64 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border p-2 z-50`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input 
                          type="text" 
                          placeholder="Search pairs..." 
                          className="w-full bg-transparent border-none focus:outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {tradingPairs.map((pair) => (
                          <button
                            key={pair.pair}
                            onClick={() => {
                              setSelectedPair(pair.pair);
                              setShowPairSelector(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/20 transition-colors ${
                              selectedPair === pair.pair ? 'bg-gray-200/20' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{pair.pair}</span>
                              <span className={`text-xs ${pair.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {pair.change}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{pair.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                    }`}
                  >
                    {isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <button className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 transition-colors">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-lg font-semibold">42,350.00</span>
                  <span className="text-green-500 font-medium">+2.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium">10,000 USDT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              {/* Left Column - Order Book */}
              <div className="col-span-3">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Order Book</h3>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-200/20">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-200/20">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 text-xs text-gray-500 mb-2 px-2">
                      <span>Price (USDT)</span>
                      <span className="text-right">Amount (BTC)</span>
                      <span className="text-right">Total (USDT)</span>
                    </div>

                    {/* Sell Orders Section */}
                    <div className="mb-2">
                      <button 
                        onClick={() => toggleSection('sellOrders')}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                      >
                        <span className="text-xs text-red-500 font-medium">Sell Orders</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedSections.sellOrders ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.sellOrders && (
                        <div className="mt-1 space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col-reverse">
                          {sellOrders.map((order, i) => (
                            <div 
                              key={i} 
                              className="grid grid-cols-3 text-xs hover:bg-red-500/10 cursor-pointer p-1.5 rounded-lg group px-2"
                            >
                              <span className="group-hover:text-red-500">{order.price}</span>
                              <span className="text-right">{order.amount}</span>
                              <span className="text-right text-gray-500">{order.total}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-center py-2 text-xs font-medium bg-gray-200/20 rounded-lg my-2">
                      <div className="text-sm font-bold">42,350.00</div>
                      <div className="text-[10px] text-gray-500">Last Price</div>
                    </div>

                    {/* Buy Orders Section */}
                    <div>
                      <button 
                        onClick={() => toggleSection('buyOrders')}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                      >
                        <span className="text-xs text-green-500 font-medium">Buy Orders</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedSections.buyOrders ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.buyOrders && (
                        <div className="mt-1 space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {buyOrders.map((order, i) => (
                            <div 
                              key={i} 
                              className="grid grid-cols-3 text-xs hover:bg-green-500/10 cursor-pointer p-1.5 rounded-lg group px-2"
                            >
                              <span className="group-hover:text-green-500">{order.price}</span>
                              <span className="text-right">{order.amount}</span>
                              <span className="text-right text-gray-500">{order.total}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Chart and Trading Interface */}
              <div className="col-span-6 space-y-2">
                {/* Chart */}
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1m</button>
                        <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">5m</button>
                        <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">15m</button>
                        <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1h</button>
                        <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">4h</button>
                        <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1d</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-gray-200/20">
                        <LineChart className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200/20">
                        <CandlestickChart className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200/20">
                        <BarChart className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200/20">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="h-[300px] bg-gray-200/20 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Chart Area</span>
                  </div>
                </div>

                {/* Trading Interface */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 p-1 bg-gray-200/20 rounded-xl">
                      <button 
                        onClick={() => setTradeType('buy')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          tradeType === 'buy' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20' 
                            : 'text-gray-500 hover:text-green-500'
                        }`}
                      >
                        Buy
                      </button>
                      <button 
                        onClick={() => setTradeType('sell')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          tradeType === 'sell' 
                            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        Sell
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-200/20">
                        <Percent className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Limit</span>
                      </div>
                      <button className="p-2 rounded-xl bg-gray-200/20 hover:bg-gray-200/30 transition-colors">
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-medium">Price</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">USDT</span>
                          <button className="p-2 rounded-xl hover:bg-gray-200/20 transition-colors">
                            <ArrowDownUp className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={price}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          className="w-full p-4 rounded-xl bg-gray-200/10 text-sm pr-32 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 border border-transparent"
                          placeholder="0.00"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <div className="h-8 w-px bg-gray-300/30 mx-1" />
                          <button 
                            onClick={() => handlePriceChange((parseFloat(price.replace(/,/g, '')) + 1).toLocaleString())}
                            className="p-2.5 rounded-xl hover:bg-gray-200/20 transition-colors active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePriceChange((parseFloat(price.replace(/,/g, '')) - 1).toLocaleString())}
                            className="p-2.5 rounded-xl hover:bg-gray-200/20 transition-colors active:scale-95"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-medium">Amount</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">BTC</span>
                          <button className="p-2 rounded-xl hover:bg-gray-200/20 transition-colors">
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          className="w-full p-4 rounded-xl bg-gray-200/10 text-sm pr-32 transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 border border-transparent"
                          placeholder="0.00"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <div className="h-8 w-px bg-gray-300/30 mx-1" />
                          <button 
                            onClick={() => handleAmountChange((parseFloat(amount) + 0.01).toFixed(2))}
                            className="p-2.5 rounded-xl hover:bg-gray-200/20 transition-colors active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleAmountChange((parseFloat(amount) - 0.01).toFixed(2))}
                            className="p-2.5 rounded-xl hover:bg-gray-200/20 transition-colors active:scale-95"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-medium">Total</label>
                        <span className="text-xs text-gray-500">USDT</span>
                      </div>
                      <input 
                        type="text" 
                        value={total}
                        className="w-full p-4 rounded-xl bg-gray-200/10 text-sm transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 border border-transparent"
                        readOnly
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 75, 100].map((percentage) => (
                        <button 
                          key={percentage}
                          onClick={() => handlePercentageClick(percentage)}
                          className="py-3 px-2 rounded-xl text-xs font-medium bg-gray-200/10 hover:bg-gray-200/20 transition-colors active:scale-95"
                        >
                          {percentage}%
                        </button>
                      ))}
                    </div>

                    <button 
                      className={`w-full py-4 rounded-xl text-white text-sm font-medium transition-all duration-200 ${
                        tradeType === 'buy' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/20 active:scale-[0.98]' 
                          : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/20 active:scale-[0.98]'
                      }`}
                    >
                      {tradeType === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                    </button>

                    <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-200/10 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Available Balance</span>
                      </div>
                      <span className="font-medium">10,000 USDT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Open Orders and Order History */}
              <div className="col-span-3 space-y-2">
                {/* Open Orders */}
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Open Orders</h3>
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-gray-200/20">
                        <Filter className="w-3 h-3" />
                      </button>
                      <Clock className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { type: 'buy', price: '42,350.00', amount: '0.1', filled: '0.05', status: 'Open' },
                      { type: 'sell', price: '42,400.00', amount: '0.05', filled: '0.02', status: 'Open' },
                      { type: 'buy', price: '42,300.00', amount: '0.2', filled: '0.1', status: 'Open' }
                    ].map((order, i) => (
                      <div key={i} className={`p-2 rounded-lg ${order.type === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'} hover:bg-opacity-20 transition-colors`}>
                        <div className="flex justify-between text-xs">
                          <span className={`font-medium ${order.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                            {order.type.toUpperCase()}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full bg-gray-200/20 text-[10px]">{order.status}</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500">Price</span>
                            <span>{order.price}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500">Amount</span>
                            <span>{order.amount}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500">Filled</span>
                            <span>{order.filled}</span>
                          </div>
                          <button className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order History */}
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Order History</h3>
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-gray-200/20">
                        <Filter className="w-3 h-3" />
                      </button>
                      <History className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { type: 'buy', price: '42,350.00', amount: '0.1', time: '10:45:23', status: 'Filled' },
                      { type: 'sell', price: '42,400.00', amount: '0.05', time: '10:44:15', status: 'Filled' },
                      { type: 'buy', price: '42,300.00', amount: '0.2', time: '10:43:01', status: 'Cancelled' }
                    ].map((order, i) => (
                      <div key={i} className="p-2 rounded-lg bg-gray-200/10 hover:bg-gray-200/20 transition-colors">
                        <div className="flex justify-between text-xs">
                          <span className={`font-medium ${order.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                            {order.type.toUpperCase()}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-full ${
                            order.status === 'Filled' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          } text-[10px]`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500">Price</span>
                            <span>{order.price}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500">Amount</span>
                            <span>{order.amount}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-1">
                          <span className="text-[10px] text-gray-500">{order.time}</span>
                          <button className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
};

export default ExchangePage; 