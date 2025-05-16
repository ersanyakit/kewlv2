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
      tokens
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
      { pair: 'GAL/WCHZ', price: '4.35', change: '+2.5%', volume: '1.2M', isFavorite: true, logo: '/gal-logo.png' },
      { pair: 'ACM/WCHZ', price: '3.50', change: '-1.2%', volume: '800K', isFavorite: false, logo: '/acm-logo.png' },
      { pair: 'JUV/WCHZ', price: '5.20', change: '+0.8%', volume: '500K', isFavorite: true, logo: '/juv-logo.png' },
      { pair: 'PSG/WCHZ', price: '4.80', change: '+5.2%', volume: '300K', isFavorite: false, logo: '/psg-logo.png' },
      { pair: 'BAR/WCHZ', price: '5.80', change: '+1.2%', volume: '200K', isFavorite: false, logo: '/bar-logo.png' },
      { pair: 'CITY/WCHZ', price: '4.45', change: '-0.8%', volume: '150K', isFavorite: false, logo: '/city-logo.png' },
      { pair: 'ATM/WCHZ', price: '3.80', change: '+3.2%', volume: '100K', isFavorite: false, logo: '/atm-logo.png' },
      { pair: 'INTER/WCHZ', price: '4.20', change: '-2.1%', volume: '80K', isFavorite: false, logo: '/inter-logo.png' },
    ];

    const marketCategories = ['Favorites', 'WCHZ', 'FAN', 'SPORTS', 'CLUB'];
    const [selectedCategory, setSelectedCategory] = useState('USDT');
    const [sortBy, setSortBy] = useState<'pair' | 'price' | 'change' | 'volume'>('volume');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [pairSearch, setPairSearch] = useState('');

    const sortedPairs = React.useMemo(() => {
      return [...tradingPairs]
        .filter(pair => {
          if (selectedCategory === 'Favorites') return pair.isFavorite;
          return pair.pair.endsWith(selectedCategory);
        })
        .filter(pair => 
          pair.pair.toLowerCase().includes(pairSearch.toLowerCase()) ||
          pair.price.toLowerCase().includes(pairSearch.toLowerCase())
        )
        .sort((a, b) => {
          const direction = sortDirection === 'asc' ? 1 : -1;
          switch (sortBy) {
            case 'pair':
              return direction * a.pair.localeCompare(b.pair);
            case 'price':
              return direction * (parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, '')));
            case 'change':
              return direction * (parseFloat(a.change) - parseFloat(b.change));
            case 'volume':
              return direction * (parseFloat(a.volume.replace(/[A-Z]/g, '')) - parseFloat(b.volume.replace(/[A-Z]/g, '')));
            default:
              return 0;
          }
        });
    }, [tradingPairs, selectedCategory, sortBy, sortDirection, pairSearch]);

    const handleSort = (category: 'pair' | 'price' | 'change' | 'volume') => {
      if (sortBy === category) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(category);
        setSortDirection('desc');
      }
    };

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
      <div className="w-full h-full max-w-6xl min-h-[73dvh] mx-auto flex items-center justify-center py-4">
        <motion.div
          className={`relative ${isDarkMode
            ? 'bg-gray-800/30 border-gray-700/30'
            : 'bg-white/40 border-white/20'
            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-w-6xl border overflow-hidden transition-all duration-300`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full max-w-6xl mx-auto gap-4 p-4 flex flex-col">
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
                {showPairSelector ? (
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} min-h-[650px]`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">Select Market</h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="text" 
                            value={pairSearch}
                            onChange={(e) => setPairSearch(e.target.value)}
                            placeholder="Search markets..." 
                            className={`w-64 h-9 pl-9 pr-4 rounded-xl text-sm transition-all duration-200
                              ${isDarkMode 
                                ? 'bg-gray-900/30 focus:bg-gray-900/50 border-gray-700/50' 
                                : 'bg-gray-100/70 focus:bg-white/70 border-gray-200/70'} 
                              border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none`}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowPairSelector(false)}
                        className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pb-3 overflow-x-auto custom-scrollbar border-b border-gray-200/10">
                      {marketCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                            ${selectedCategory === category
                              ? `${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`
                              : `${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} text-gray-500`
                            }`}
                        >
                          {category === 'Favorites' ? (
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{category}</span>
                            </div>
                          ) : category}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-200/10">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('pair')}>
                          <span className="text-xs font-medium text-gray-500">Pair</span>
                          {sortBy === 'pair' && (
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={() => handleSort('price')}>
                          <span className="text-xs font-medium text-gray-500">Price</span>
                          {sortBy === 'price' && (
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={() => handleSort('change')}>
                          <span className="text-xs font-medium text-gray-500">24h Change</span>
                          {sortBy === 'change' && (
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={() => handleSort('volume')}>
                          <span className="text-xs font-medium text-gray-500">24h Volume</span>
                          {sortBy === 'volume' && (
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-[520px] custom-scrollbar">
                        {sortedPairs.map((pair) => (
                          <div 
                            key={pair.pair}
                            onClick={() => {
                              setSelectedPair(pair.pair);
                              setShowPairSelector(false);
                            }}
                            className={`grid grid-cols-4 px-4 py-3 cursor-pointer transition-all duration-200 hover:scale-[0.99]
                              ${isDarkMode 
                                ? 'hover:bg-gray-700/30' 
                                : 'hover:bg-gray-100/70'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img src={pair.logo} alt={pair.pair} className="w-8 h-8 rounded-full" />
                                {pair.isFavorite && (
                                  <Star className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-400 fill-current" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{pair.pair}</span>
                                <span className="text-xs text-gray-500">Perpetual</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-end">
                              <span className="font-medium">{pair.price}</span>
                            </div>
                            <div className={`flex items-center justify-end font-medium ${
                              pair.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {pair.change}
                            </div>
                            <div className="flex items-center justify-end font-medium text-gray-500">
                              {pair.volume}
                            </div>
                          </div>
                        ))}
                        {sortedPairs.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                            <Search className="w-8 h-8 mb-3" />
                            <span className="text-lg">No markets found</span>
                            <span className="text-sm text-gray-400 mt-1">Try adjusting your search</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chart */}
                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                      {!showPairSelector ? (
                        <>
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
                        </>
                      ) : (
                        <div className="h-[350px] relative">
                          <div className="absolute inset-0 z-50 backdrop-blur-sm">
                            <div className="h-full flex flex-col">
                              <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-semibold">Select Market</h3>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                      type="text" 
                                      value={pairSearch}
                                      onChange={(e) => setPairSearch(e.target.value)}
                                      placeholder="Search markets..." 
                                      className={`w-64 h-9 pl-9 pr-4 rounded-xl text-sm transition-all duration-200
                                        ${isDarkMode 
                                          ? 'bg-gray-900/30 focus:bg-gray-900/50 border-gray-700/50' 
                                          : 'bg-gray-100/70 focus:bg-white/70 border-gray-200/70'} 
                                        border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none`}
                                    />
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setShowPairSelector(false)}
                                  className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto custom-scrollbar border-b border-gray-200/10">
                                {marketCategories.map((category) => (
                                  <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                                      ${selectedCategory === category
                                        ? `${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`
                                        : `${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} text-gray-500`
                                      }`}
                                  >
                                    {category === 'Favorites' ? (
                                      <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{category}</span>
                                      </div>
                                    ) : category}
                                  </button>
                                ))}
                              </div>

                              <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200/10">
                                  <div className="flex items-center gap-2 w-[30%] cursor-pointer" onClick={() => handleSort('pair')}>
                                    <span className="text-xs font-medium text-gray-500">Pair</span>
                                    {sortBy === 'pair' && (
                                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    )}
                                  </div>
                                  <div className="flex items-center justify-end gap-2 w-[20%] cursor-pointer" onClick={() => handleSort('price')}>
                                    <span className="text-xs font-medium text-gray-500">Price</span>
                                    {sortBy === 'price' && (
                                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    )}
                                  </div>
                                  <div className="flex items-center justify-end gap-2 w-[25%] cursor-pointer" onClick={() => handleSort('change')}>
                                    <span className="text-xs font-medium text-gray-500">24h Change</span>
                                    {sortBy === 'change' && (
                                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    )}
                                  </div>
                                  <div className="flex items-center justify-end gap-2 w-[25%] cursor-pointer" onClick={() => handleSort('volume')}>
                                    <span className="text-xs font-medium text-gray-500">24h Volume</span>
                                    {sortBy === 'volume' && (
                                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                    )}
                                  </div>
                                </div>

                                <div className="h-[calc(100%-40px)] overflow-y-auto custom-scrollbar">
                                  {sortedPairs.map((pair) => (
                                    <div 
                                      key={pair.pair}
                                      onClick={() => {
                                        setSelectedPair(pair.pair);
                                        setShowPairSelector(false);
                                      }}
                                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                                        ${isDarkMode 
                                          ? 'hover:bg-gray-700/30' 
                                          : 'hover:bg-gray-100/70'}`}
                                    >
                                      <div className="flex items-center gap-3 w-[30%]">
                                        <div className="relative">
                                          <img src={pair.logo} alt={pair.pair} className="w-7 h-7" />
                                          {pair.isFavorite && (
                                            <Star className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-400 fill-current" />
                                          )}
                                        </div>
                                        <span className="font-medium">{pair.pair}</span>
                                      </div>
                                      <div className="w-[20%] text-right font-medium">{pair.price}</div>
                                      <div className={`w-[25%] text-right font-medium ${
                                        pair.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                                      }`}>
                                        {pair.change}
                                      </div>
                                      <div className="w-[25%] text-right font-medium text-gray-500">{pair.volume}</div>
                                    </div>
                                  ))}
                                  {sortedPairs.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                      <Search className="w-6 h-6 mb-2" />
                                      <span>No markets found</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm shadow-sm border border-gray-200/10`}>
                      <div className="flex flex-col gap-6">
                        {/* Buy/Sell Tab */}
                        <div className="mb-2">
                            <div className={`flex p-0.5 rounded-xl backdrop-blur-sm transition-all duration-300 ${isDarkMode 
                              ? 'bg-gray-800/40' 
                              : 'bg-white/40'} 
                            border border-gray-200/10 shadow-sm h-10`}
                            >
                              <button 
                                onClick={() => setTradeType('buy')}
                                className={`flex-1 relative overflow-hidden rounded-lg text-sm font-medium transition-all duration-200
                                  ${tradeType === 'buy'
                                    ? isDarkMode
                                      ? 'bg-green-500/20 text-green-400 shadow-inner'
                                      : 'bg-green-100 text-green-600 shadow-inner'
                                    : 'hover:bg-gray-200/30'
                                  }`}
                              >
                                <div className="relative flex items-center justify-center h-full">
                                  <div className="flex items-center gap-1.5">
                                    <TrendingUp className={`w-3.5 h-3.5 ${tradeType === 'buy' ? 'animate-pulse' : ''}`} />
                                    <span className="font-medium">Buy</span>
                                  </div>
                                  {tradeType === 'buy' && (
                                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0"></div>
                                  )}
                                </div>
                              </button>
                              <button 
                                onClick={() => setTradeType('sell')}
                                className={`flex-1 relative overflow-hidden rounded-lg text-sm font-medium transition-all duration-200
                                  ${tradeType === 'sell'
                                    ? isDarkMode
                                      ? 'bg-red-500/20 text-red-400 shadow-inner'
                                      : 'bg-red-100 text-red-600 shadow-inner'
                                    : 'hover:bg-gray-200/30'
                                  }`}
                              >
                                <div className="relative flex items-center justify-center h-full">
                                  <div className="flex items-center gap-1.5">
                                    <TrendingDown className={`w-3.5 h-3.5 ${tradeType === 'sell' ? 'animate-pulse' : ''}`} />
                                    <span className="font-medium">Sell</span>
                                  </div>
                                  {tradeType === 'sell' && (
                                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0"></div>
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        
                        {/* Trading Inputs */}
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="flex justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-400">Price</label>
                              <span className="text-sm text-gray-500">≈ $42,350.00</span>
                            </div>
                            <div className="relative group">
                              <div className="absolute left-0 inset-y-0 flex items-center pl-4">
                                <img src="/wchz-logo.png" alt="WCHZ" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <input 
                                type="text" 
                                value={price}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                className={`w-full h-14 pl-11 pr-24 rounded-2xl text-base font-medium transition-all duration-200 
                                  ${isDarkMode 
                                    ? 'bg-gray-900/20 focus:bg-gray-900/30 border-gray-700/30 text-white' 
                                    : 'bg-gray-100/50 focus:bg-white/70 border-gray-200/50 text-gray-900'} 
                                  border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none backdrop-blur-sm`}
                                placeholder="0.00"
                              />
                              <div className="absolute right-0 inset-y-0 flex items-center gap-1 pr-3">
                                <span className="text-sm font-medium text-gray-500 mr-2">WCHZ</span>
                                <div className="flex items-center gap-0.5 bg-gray-200/10 rounded-lg backdrop-blur-sm">
                                  <button 
                                    onClick={() => handlePriceChange((parseFloat(price.replace(/,/g, '')) + 1).toLocaleString())}
                                    className="p-2 rounded-l-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="h-5 w-px bg-gray-400/10" />
                                  <button 
                                    onClick={() => handlePriceChange((parseFloat(price.replace(/,/g, '')) - 1).toLocaleString())}
                                    className="p-2 rounded-r-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="flex justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-400">Amount</label>
                              <span className="text-sm text-gray-500">Available: 10.000 BTC</span>
                            </div>
                            <div className="relative group">
                              <div className="absolute left-0 inset-y-0 flex items-center pl-4">
                                <img src={`/${selectedPair.split('/')[0].toLowerCase()}-logo.png`} alt={selectedPair.split('/')[0]} className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <input 
                                type="text" 
                                value={amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className={`w-full h-14 pl-11 pr-24 rounded-2xl text-base font-medium transition-all duration-200 
                                  ${isDarkMode 
                                    ? 'bg-gray-900/20 focus:bg-gray-900/30 border-gray-700/30 text-white' 
                                    : 'bg-gray-100/50 focus:bg-white/70 border-gray-200/50 text-gray-900'} 
                                  border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none backdrop-blur-sm`}
                                placeholder="0.00"
                              />
                              <div className="absolute right-0 inset-y-0 flex items-center gap-1 pr-3">
                                <span className="text-sm font-medium text-gray-500 mr-2">{selectedPair.split('/')[0]}</span>
                                <div className="flex items-center gap-0.5 bg-gray-200/10 rounded-lg backdrop-blur-sm">
                                  <button 
                                    onClick={() => handleAmountChange((parseFloat(amount) + 0.01).toFixed(2))}
                                    className="p-2 rounded-l-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="h-5 w-px bg-gray-400/10" />
                                  <button 
                                    onClick={() => handleAmountChange((parseFloat(amount) - 0.01).toFixed(2))}
                                    className="p-2 rounded-r-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="flex justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-400">Total</label>
                              <span className="text-sm text-gray-500">Available: 10,000 USDT</span>
                            </div>
                            <div className="relative group">
                              <div className="absolute left-0 inset-y-0 flex items-center pl-4">
                                <img src="/wchz-logo.png" alt="WCHZ" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <input 
                                type="text" 
                                value={total}
                                className={`w-full h-14 pl-11 pr-16 rounded-2xl text-base font-medium transition-all duration-200
                                  ${isDarkMode 
                                    ? 'bg-gray-900/20 border-gray-700/30 text-white' 
                                    : 'bg-gray-100/50 border-gray-200/50 text-gray-900'} 
                                  border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none backdrop-blur-sm`}
                                readOnly
                              />
                              <div className="absolute right-0 inset-y-0 flex items-center pr-4">
                                <span className="text-sm font-medium text-gray-500">WCHZ</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 mt-4">
                            {[25, 50, 75, 100].map((percentage) => (
                              <button 
                                key={percentage}
                                onClick={() => handlePercentageClick(percentage)}
                                className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-sm
                                  ${isDarkMode 
                                    ? 'bg-gray-900/20 hover:bg-gray-900/30 border-gray-700/30' 
                                    : 'bg-gray-100/50 hover:bg-white/70 border-gray-200/50'} 
                                  border hover:border-blue-500/30 hover:ring-2 hover:ring-blue-500/20 active:scale-95`}
                              >
                                {percentage}%
                              </button>
                            ))}
                          </div>

                          <button 
                            className={`w-full h-14 rounded-2xl text-white text-sm font-medium transition-all duration-300 mt-6
                              ${tradeType === 'buy' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                              } flex items-center justify-center gap-2 active:scale-[0.99] hover:shadow-xl backdrop-blur-sm`}
                          >
                            <div className="flex items-center gap-2">
                              <img src={`/${selectedPair.split('/')[0].toLowerCase()}-logo.png`} alt={selectedPair.split('/')[0]} className="w-5 h-5" />
                              <span>{tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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