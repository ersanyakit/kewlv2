import React, { useState, useEffect } from 'react';
import { SWAP_MODE, Token, useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
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
    BookmarkCheck,
    RefreshCw
} from 'lucide-react';
import ChartView from './ChartView';
import { LimitOrderParam, OrderKind, PriceLevel, PriceLevelOrderBook, TokenPair, useSwapContext } from '../../../context/SwapContext';
import { ethers } from 'ethers';
import { encodePacked, keccak256, parseEther, parseUnits } from 'viem';
import { WETH9 } from '../../../constants/entities';

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
        nativeToken,
        setSwapMode,
        tokens
    } = useTokenContext();

    const { fetchOrderBook, orderBook,placeLimitOrder, selectedPair, setSelectedPair, fetchLimitOrderPairInfo, limitOrderPairs, setLimitOrderPairs } = useSwapContext();
    const { walletProvider } = useAppKitProvider('eip155');
    const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
    const { address, isConnected } = useAppKitAccount();
    const navigate = useNavigate();
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [showPairSelector, setShowPairSelector] = useState(false);
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        buyOrders: true,
        sellOrders: true
    });
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const [hoveredSellOrder, setHoveredSellOrder] = useState<number | null>(null);
    const [hoveredBuyOrder, setHoveredBuyOrder] = useState<number | null>(null);
    const [selectedSellRange, setSelectedSellRange] = useState<number | null>(null);
    const [selectedBuyRange, setSelectedBuyRange] = useState<number | null>(null);
    

    const commonBases = ['Favorites', nativeToken?.symbol.toUpperCase(), 'USDT', 'USDC','KWL'] as string[];;


    const tradingPairs = generateQuotePairs(tokens, commonBases)
    console.log(tradingPairs)
    




  function getPairId(token0: string, token1: string): `0x${string}` {
    const [tokenA, tokenB] = token0.toLowerCase() < token1.toLowerCase()
      ? [token0, token1]
      : [token1, token0];
  
    return keccak256(encodePacked(['address', 'address'], [tokenA as `0x${string}`, tokenB as `0x${string}`])) as `0x${string}`;
  }
  

  

  function generateQuotePairs(tokens: Token[], quoteSymbols: string[]): TokenPair[] {
    const pairs: TokenPair[] = [];
    const seenPairs = new Set<string>();
  
    const wethAddress = WETH9[Number(chainId)].address;
    const quoteTokens = tokens.filter(t => quoteSymbols.includes(t.symbol));
  
    // Yardımcı: pairId üret ve tekrar var mı kontrol et
    const createPair = (base: Token, quote: Token) => {
      const id = getPairId(base.address, quote.address);
      if (seenPairs.has(id)) return;
      seenPairs.add(id);
  
      pairs.push({
        base: { ...base, logoURI: base.logoURI ?? base.icon },
        quote: { ...quote, logoURI: quote.logoURI ?? quote.icon },
        symbol: `${base.symbol}/${quote.symbol}`,
        pair: id,
        isFavorite: parseFloat(base.balance) > 0 && parseFloat(quote.balance) > 0,
        price: '-',
        change: '-',
        volume: '-',
        logo: base.icon
      });
    };
  
    // Yardımcı: çift geçerli mi?
    const isValidPair = (a: Token, b: Token) => {
      return (
        a.address !== b.address &&
        a.address !== wethAddress &&
        b.address !== wethAddress
      );
    };
  
    // 1. Token -> QuoteAsset eşleşmeleri
    for (const base of tokens) {
      if (quoteSymbols.includes(base.symbol)) continue;
  
      for (const quote of quoteTokens) {
        if (!isValidPair(base, quote)) continue;
        createPair(base, quote);
      }
    }
  
    // 2. QuoteAsset -> QuoteAsset eşleşmeleri
    for (let i = 0; i < quoteTokens.length; i++) {
      for (let j = i + 1; j < quoteTokens.length; j++) {
        const base = quoteTokens[i];
        const quote = quoteTokens[j];
        if (!isValidPair(base, quote)) continue;
        createPair(base, quote);
      }
    }
  
    return pairs;
  }
    

    const [selectedCategory, setSelectedCategory] = useState('USDT');
    const [sortBy, setSortBy] = useState<'pair' | 'price' | 'change' | 'volume'>('volume');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [pairSearch, setPairSearch] = useState('');

    const sortedPairs = React.useMemo(() => {
        return [...tradingPairs]
            .filter(pair => {
                if (selectedCategory === 'Favorites'){
                    return pair.isFavorite;
                } 
                return pair.quote.symbol.endsWith(selectedCategory);
            })
            .filter(pair =>
                pair.symbol.toLowerCase().includes(pairSearch.toLowerCase()) ||
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



    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        let value = e.target.value.replace(",", ".")
        if (regex.test(value)) {
            setPrice(value)
        }
        if (value == "") {
          setPrice("");
        }
      };


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        let value = e.target.value.replace(",", ".")
        if (regex.test(value)) {
            setAmount(value)
        }
        if (value == "") {
            setAmount("");
        }
    };

    

    const handlePercentageClick = (percentage: number) => {
        const maxAmount = 10; // Dummy max amount
        const newAmount = (maxAmount * percentage / 100).toFixed(2);
        handleAmountChange({target:{value:newAmount}} as React.ChangeEvent<HTMLInputElement>);
    };

    const toggleSection = (section: 'buyOrders' | 'sellOrders') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePlaceOrder = async () => {
        console.log("PLACE ORDER", selectedPair)







        if(!selectedPair){
            return
        }
       
          //const pairInfo = limitOrderPairs.pairs[0];

          const _inputPrice = ethers.parseUnits  (price || '0', selectedPair?.quote.decimals ?? 18)

       

          var priceTick = ethers.parseUnits(price || '0', selectedPair?.quote.decimals ?? 18)
          
      
          let WRAPPED_TOKEN = WETH9[Number(chainId)].address;

          let _baseAddress = selectedPair.base.address == ethers.ZeroAddress ? WRAPPED_TOKEN : selectedPair.base.address;
          let _quoteAddress = selectedPair.quote.address == ethers.ZeroAddress ? WRAPPED_TOKEN : selectedPair.quote.address;
      
          
          const limirOrderParams : LimitOrderParam = {
            kind: tradeType == "buy" ? OrderKind.BUY_MARKET : OrderKind.SELL_MARKET,
            token0: _baseAddress,        // Ethereum adresi olduğu için string
            token1: _quoteAddress,
            price: ethers.parseUnits(price || '0', selectedPair?.quote.decimals ?? 18),         // uint256 için bigint uygun
            amount: ethers.parseUnits(amount || '0', selectedPair?.base.decimals ?? 18),
            entrypoint: priceTick,       // uint256[] dizisi için bigint[]
          }


          await placeLimitOrder(walletProvider,limirOrderParams)
        
    }


    const totalOrderBookHeight = 60; // Total height for both sections combined

    const orderBookVariants = {
        collapsed: { height: 0, opacity: 0 },
        expanded: (section: 'buyOrders' | 'sellOrders') => {
            const bothExpanded = expandedSections.buyOrders && expandedSections.sellOrders;
            return {
                height: bothExpanded ? `${totalOrderBookHeight / 2}dvh` : `${totalOrderBookHeight}dvh`,
                opacity: 1,
                transition: { duration: 0.2 }
            };
        }
    };

    // Update price, total, and trade type when a price is selected from the order book
    const handleOrderBookPriceClick = (order:PriceLevelOrderBook, type: 'buy' | 'sell') => {

        //todo:decimal scale
        const formattedPrice = ethers.formatEther(order.price);
        const formattedAmount = ethers.formatEther(order.amount ?? 0n);

        console.log(formattedPrice, formattedAmount)
        setPrice(ethers.formatEther(order.price));
        setAmount(ethers.formatEther(order.totalAmount));
        const total = parseFloat(formattedPrice) * parseFloat(formattedAmount);
        //setTotal(total.toFixed(8));
        setTradeType(type);
    };

    useEffect(()=>{

        if(amount && price){
            const decimals = selectedPair?.quote?.decimals ?? 18;
            const precision = decimals > 8 ? 8 : decimals;            
            const total = parseFloat(amount) * parseFloat(price);
            setTotal(total.toFixed(precision));
        }
    },[amount,price])

    const handleSellOrderHover = (index: number) => {
        setHoveredSellOrder(index);
    };

    const handleBuyOrderHover = (index: number) => {
        setHoveredBuyOrder(index);
    };

    const toggleSellOrderSelection = (index: number) => {
        setSelectedSellRange(prev => (prev === index ? null : index));
    };

    const toggleBuyOrderSelection = (index: number) => {
        setSelectedBuyRange(prev => (prev === index ? null : index));
    };

    useEffect(() => {
        setHoveredSellOrder(null);
        setHoveredBuyOrder(null);
        setSelectedSellRange(null);
        setSelectedBuyRange(null);
    }, [tradeType]);


    const loadData = async () => {
        setSwapMode(SWAP_MODE.LIMIT_ORDERS);
       // await fetchOrderBook(walletProvider);
        await fetchLimitOrderPairInfo(walletProvider);
    }

    useEffect(()=>{
        fetchOrderBook(walletProvider)
    },[selectedPair])
    useEffect(() => {
        console.log("LIMIT PROTOCOL", chainId)
        loadData();
    }, [chainId, address]);

    return (

        <div className={`flex flex-col px-0 py-4 md:p-4 transition-colors duration-300`}>
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">

                <div className="order-2 sm:order-1 lg:col-span-2">
                    <div className="flex items-center gap-4 mb-2">
                        <motion.div
                            className={`relative ${isDarkMode
                                ? 'bg-gray-800/30 border-gray-700/30'
                                : 'bg-white/40 border-white/20'
                                } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}>
                            <div className='w-full flex flex-row items-center justify-between gap-2 px-4 pt-4'>
                                <div className="w-full">
                                    <button
                                        onClick={() => setShowPairSelector(!showPairSelector)}
                                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-gray-200/20 hover:bg-gray-200/30 transition-colors"
                                    >
                                        <div className='flex flex-row gap-1 col-center gap-2'>
                                            <img src={selectedPair?.base?.logoURI} alt={selectedPair?.base?.symbol} className='w-4 h-4 rounded-full min-w-4 min-h-4' />
                                            <img src={selectedPair?.quote?.logoURI} alt={selectedPair?.quote?.symbol} className='w-4 h-4 rounded-full min-w-4 min-h-4' />
                                        </div>
                                        <span className="font-medium">{selectedPair?.symbol? selectedPair?.symbol : 'Select Market'}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                
                                    <button onClick={() => {
                                        loadData();
                                    }} className="p-1.5 cursor-pointer rounded-lg text-gray-500 hover:text-blue-400 transition-colors">
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className={`w-full p-4 rounded-lg`}>
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
                                <div className="space-y-1 max-h-[100dvh] ">
                                    <div className="grid grid-cols-3 text-xs text-gray-500 mb-2 px-2">
                                        <span>Price ({selectedPair?.quote.symbol})</span>
                                        <span className="text-right">Amount ({selectedPair?.base.symbol})</span>
                                        <span className="text-right">Total ({selectedPair?.quote.symbol})</span>
                                    </div>

                                    {/* Sell Orders Section */}
                                    <div className="mb-2">
                                        <button
                                            onClick={() => toggleSection('sellOrders')}
                                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                                        >
                                            <span className="text-xs text-pink-500 font-medium">Sell Orders</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedSections.sellOrders ? 'rotate-180' : ''}`} />
                                        </button>
                                        <motion.div
                                            initial="collapsed"
                                            animate={expandedSections.sellOrders ? 'expanded' : 'collapsed'}
                                            custom='sellOrders'
                                            variants={orderBookVariants}
                                            className="my-1 flex flex-col  gap-[1px] overflow-y-auto scrollbar-hide custom-scrollbar flex flex-col-reverse"
                                        >
                                            {orderBook.loading || orderBook.sell.length === 0 ? (
                                                <div className="space-y-0.5">
                                                    {Array.from({ length: 25 }).map((_, i) => (
                                                        <div key={i} className={`grid grid-cols-3 text-xs p-1.5 rounded-lg animate-pulse shadow-sm `}>
                                                            <span className={`h-4 w-3/4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                orderBook.sell.map((order, i) => (
                                                    <div
                                                        key={i}
                                                        className={`relative grid grid-cols-3 text-xs hover:bg-pink-500/20 cursor-pointer p-1.5 rounded-lg group px-2 ${hoveredSellOrder !== null && i <= hoveredSellOrder ? 'bg-pink-500/20' : ''} ${selectedSellRange !== null && i <= selectedSellRange ? 'bg-pink-500/40' : ''}`}
                                                        onMouseEnter={() => handleSellOrderHover(i)}
                                                        onClick={() => {
                                                            handleOrderBookPriceClick(order, 'buy');
                                                            toggleSellOrderSelection(i);
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-pink-500/10 rounded-lg"
                                                            style={{
                                                                width: `${(order.totalAmount * 100n) / orderBook.maxSellTotal}%`
                                                            }}>

                                                        </div>
                                                        <span className="group-hover:text-pink-400 relative">{ethers.formatEther(order.price)}</span>
                                                        <span className="text-right relative">{ethers.formatEther(order.totalAmount)}</span>
                                                        <span className="text-right text-gray-500 relative">{ethers.formatEther(order.totalPrice)}</span>
                                                    </div>
                                                ))
                                            )}
                                        </motion.div>
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
                                        <motion.div
                                            initial="collapsed"
                                            animate={expandedSections.buyOrders ? 'expanded' : 'collapsed'}
                                            custom='buyOrders'
                                            variants={orderBookVariants}
                                            className="mt-1 flex flex-col gap-[1px] overflow-y-auto scrollbar-hide custom-scrollbar"
                                        >
                                            {orderBook.loading || orderBook.buy.length === 0 ? (
                                                <div className="space-y-0.5">
                                                    {Array.from({ length: 25 }).map((_, i) => (
                                                        <div key={i} className={`grid grid-cols-3 text-xs p-1.5 rounded-lg animate-pulse shadow-sm`}>
                                                            <span className={`h-4 w-3/4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                orderBook.buy.map((order, i) => (
                                                    <div
                                                        key={i}
                                                        className={`relative grid grid-cols-3 text-xs hover:bg-green-500/10 cursor-pointer p-1.5 rounded-lg group px-2 ${hoveredBuyOrder !== null && i <= hoveredBuyOrder ? 'bg-green-500/20' : ''} ${selectedBuyRange !== null && i <= selectedBuyRange ? 'bg-green-500/40' : ''}`}
                                                        onMouseEnter={() => handleBuyOrderHover(i)}
                                                        onClick={() => {
                                                            handleOrderBookPriceClick(order, 'sell');
                                                            toggleBuyOrderSelection(i);
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 bg-green-500/10 rounded-lg"
                                                            style={{
                                                                width: `${(order.totalAmount * 100n) / orderBook.maxBuyTotal}%`
                                                            }}
                                                        ></div>
                                                        <span className="group-hover:text-green-500 relative">{ethers.formatEther(order.price)}</span>
                                                        <span className="text-right relative">{ethers.formatEther(order.totalAmount)}</span>
                                                        <span className="text-right text-gray-500 relative">{ethers.formatEther(order.totalPrice)}</span>
                                                    </div>
                                                ))
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>

                <div className="order-1 sm:order-2 lg:col-span-3 flex flex-col gap-4">
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}>
                        <div className="w-full">
                            {showPairSelector ? (
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} min-h-[600px] backdrop-blur-sm border ${isDarkMode ? 'border-gray-700/30' : 'border-white/20'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Select Market</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={pairSearch}
                                                    onChange={(e) => setPairSearch(e.target.value)}
                                                    placeholder="Search markets..."
                                                    className={`w-64 h-9 pl-9 pr-4 rounded-lg text-sm transition-all
                                                    ${isDarkMode
                                                        ? 'bg-gray-900/30 border-gray-700/50'
                                                        : 'bg-gray-100/70 border-gray-200/70'} 
                                                    border focus:border-blue-500/30 outline-none`}
                                                />
                                                {pairSearch && (
                                                    <button 
                                                        onClick={() => setPairSearch('')}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setShowPairSelector(false)}
                                                className="p-2 rounded-lg hover:bg-gray-200/20"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 overflow-x-auto mb-4 pb-2 border-b border-gray-200/10">
                                        {commonBases.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                                                ${selectedCategory === category
                                                    ? `${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`
                                                    : `${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} text-gray-500`
                                                }`}
                                            >
                                                {category === 'Favorites' ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Star className="w-4 h-4" />
                                                        <span>{category}</span>
                                                    </div>
                                                ) : category}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-200/10 text-xs font-medium text-gray-500">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('pair')}>
                                            <span>Pair</span>
                                            {sortBy === 'pair' && (
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={() => handleSort('price')}>
                                            <span>Price</span>
                                            {sortBy === 'price' && (
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={() => handleSort('change')}>
                                            <span>24h Change</span>
                                            {sortBy === 'change' && (
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end gap-2 cursor-pointer" onClick={() => handleSort('volume')}>
                                            <span>Volume</span>
                                            {sortBy === 'volume' && (
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto max-h-[69dvh] scrollbar-hide custom-scrollbar">
                                        {sortedPairs.length > 0 ? (
                                            sortedPairs.map((pair, index) => (
                                                <div
                                                    key={pair.pair}
                                                    onClick={() => {
                                                        setSelectedPair(pair);
                                                        setShowPairSelector(false);
                                                    }}
                                                    className={`grid grid-cols-4 px-4 py-3 cursor-pointer transition-colors
                                                    ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800/10' : 'bg-gray-50/50') : ''}
                                                    ${isDarkMode ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/70'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-1">
                                                            <img src={pair.base.logoURI} alt={pair.base.symbol} className="w-5 h-5 min-w-5 min-h-5 rounded-full border" />
                                                            <img src={pair.quote.logoURI} alt={pair.quote.symbol} className="w-5 h-5 min-w-5 min-h-5 rounded-full border" />
                                                        </div>
                                                        <span className="font-medium text-sm">{pair.symbol}</span>
                                                        {pair.isFavorite && (
                                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                                        )}
                                                    </div>
                                                    <div className="text-right font-medium text-sm">{pair.price}</div>
                                                    <div className={`text-right font-medium text-sm ${pair.change.startsWith('+') ? 'text-green-500' : 'text-pink-500'}`}>
                                                        {pair.change}
                                                    </div>
                                                    <div className="text-right font-medium text-sm text-gray-500">{pair.volume}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                                <Search className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-lg font-medium mb-1">No trading pairs found</span>
                                                <span className="text-sm text-gray-400">Try adjusting your search</span>
                                                <button 
                                                    onClick={() => {setPairSearch(''); setSelectedCategory(commonBases[1])}}
                                                    className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-4 p-4'>
                                    {/* Chart */}
                                    <div className={`w-full h-full`}>
                                        {!showPairSelector ? (

                                            <ChartView />


                                        ) : (
                                            <div className="h-[50dvh] relative">
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
                                                            {commonBases.map((category) => (
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
                                                                            <Star className="w-4 h-4" />
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
                                                                            setSelectedPair(pair);
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
                                                                            <span className="font-medium">{pair.symbol}</span>
                                                                        </div>
                                                                        <div className="w-[20%] text-right font-medium">{pair.price}</div>
                                                                        <div className={`w-[25%] text-right font-medium ${pair.change.startsWith('+') ? 'text-green-500' : 'text-pink-500'
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


                                    <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm shadow-sm `}>
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
                                                                ? 'bg-transparent border-green-400'
                                                                : 'bg-transparent border-green-600'
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
                                                                ? 'bg-transparent border-pink-400'
                                                                : 'bg-transparent border-pink-600'
                                                            : 'hover:bg-gray-200/30'
                                                        }`}
                                                >
                                                    <div className="relative flex items-center justify-center h-full">
                                                        <div className="flex items-center gap-1.5">
                                                            <TrendingDown className={`w-3.5 h-3.5 ${tradeType === 'sell' ? 'animate-pulse' : ''}`} />
                                                            <span className="font-medium">Sell</span>
                                                        </div>
                                                        {tradeType === 'sell' && (
                                                            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-pink-500/0 via-pink-500 to-pink-500/0"></div>
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
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-0 inset-y-0 flex items-center pl-4">
                                                        <img src={selectedPair?.quote.logoURI} alt={selectedPair?.quote.symbol} className="w-5 h-5 min-w-5 min-h-5 z-10 opacity-70 group-hover:opacity-100 transition-opacity rounded-full" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={price}
                                                        onChange={handlePriceChange}
                                                        onBlur={() => {
                                                            if(price){
                                                                setPrice(parseFloat(price).toFixed(selectedPair && selectedPair?.quote?.decimals > 8 ? 8 : selectedPair?.quote?.decimals))

                                                                const decimals = selectedPair?.quote?.decimals ?? 18;
                                                                const precision = decimals > 8 ? 8 : decimals;
                                                                const parsedPrice = parseFloat(price || '0').toFixed(precision);  
                                                                handlePriceChange({target:{value:parsedPrice}} as React.ChangeEvent<HTMLInputElement>);
                                    
                                                            }
                                                        }}
                                                        className={`w-full h-14 pl-11 pr-24 rounded-2xl text-base font-medium transition-all duration-200 
                                                             ${isDarkMode
                                                                ? 'bg-gray-900/20 focus:bg-gray-900/30 border-gray-700/30 text-white'
                                                                : 'bg-gray-100/50 focus:bg-white/70 border-gray-200/50 text-gray-900'} border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none backdrop-blur-sm`}
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute right-0 inset-y-0 flex items-center gap-1 pr-3">
                                                        <span className="text-sm font-medium text-gray-500 mr-2">{selectedPair?.quote.symbol}</span>
                                                        <div className="flex items-center gap-0.5 bg-gray-200/10 rounded-lg backdrop-blur-sm">
                                                            <button
                                                                onClick={() => {
                                                                    
                                                                    const decimals = selectedPair?.quote?.decimals ?? 18;
                                                                    const precision = decimals > 8 ? 8 : decimals;
                                                                    const parsedPrice = parseFloat(price || '0');
                                                                    const increasedPrice = (parsedPrice * 1.01).toFixed(precision);  
                                                                    handlePriceChange({target:{value:increasedPrice}} as React.ChangeEvent<HTMLInputElement>);
                                        
                                                                }}
                                                                className="p-2 rounded-l-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <div className="h-5 w-px bg-gray-400/10" />
                                                            <button
                                                                onClick={() =>{

                                                                    const decimals = selectedPair?.quote?.decimals ?? 18;
                                                                    const precision = decimals > 8 ? 8 : decimals;
                                                                    const parsedPrice = parseFloat(price || '0');
                                                    
                                                                    const decreasedPrice = (parsedPrice * 0.99).toFixed(precision);
                                                                    handlePriceChange({target:{value:decreasedPrice}} as React.ChangeEvent<HTMLInputElement>);
                                                                 }}
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
                                                    <span className="text-sm text-gray-500">Available: {parseFloat(selectedPair?.base.balance || '0').toFixed(8)}  {selectedPair?.base.symbol}</span>
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-0 inset-y-0 flex items-center pl-4">
                                                        <img src={selectedPair?.base.logoURI} alt={selectedPair?.base.symbol} className="w-5 h-5 min-w-5 min-h-5 opacity-70 group-hover:opacity-100 transition-opacity rounded-full z-10" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={amount}
                                                        onBlur={() => {
                                                            if(amount){
                                                                const decimals = selectedPair?.base?.decimals ?? 18;
                                                                const precision = decimals > 8 ? 8 : decimals;
                                                                const parsedAmount = parseFloat(amount || '0');
                                                                const fixedAmount = parsedAmount.toFixed(precision);    
                                                                setAmount(fixedAmount)
                                                            }
                                                        }}
                                                        onChange={ handleAmountChange}
                                                        className={`w-full h-14 pl-11 pr-24 rounded-2xl text-base font-medium transition-all duration-200 
                    ${isDarkMode
                                                                ? 'bg-gray-900/20 focus:bg-gray-900/30 border-gray-700/30 text-white'
                                                                : 'bg-gray-100/50 focus:bg-white/70 border-gray-200/50 text-gray-900'} 
                    border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none backdrop-blur-sm`}
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute right-0 inset-y-0 flex items-center gap-1 pr-3">
                                                        <span className="text-sm font-medium text-gray-500 mr-2">{selectedPair?.base.symbol}</span>
                                                        <div className="flex items-center gap-0.5 bg-gray-200/10 rounded-lg backdrop-blur-sm">
                                                            <button
                                                                onClick={() => {

                                                                    const decimals = selectedPair?.base?.decimals ?? 18;
                                                                    const precision = decimals > 8 ? 8 : decimals;
                                                                    const parsedAmount = parseFloat(amount || '0');
                                                    
                                                                    const increasedAmount = (parsedAmount * 1.01).toFixed(precision);                                                                                                        
                                                                    handleAmountChange({target:{value:increasedAmount}} as React.ChangeEvent<HTMLInputElement>);
                                                               
                                                                }}
                                                                className="p-2 rounded-l-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                            </button>
                                                            <div className="h-5 w-px bg-gray-400/10" />
                                                            <button
                                                                onClick={() => {

                                                                    const decimals = selectedPair?.base?.decimals ?? 18;
                                                                    const precision = decimals > 8 ? 8 : decimals;
                                                                    const parsedAmount = parseFloat(amount || '0');
                                                    
                                                                    const decreasedAmount = (parsedAmount * 0.99).toFixed(precision);
        
                                                                    handleAmountChange({target:{value:decreasedAmount}} as React.ChangeEvent<HTMLInputElement>);
                                                                }}
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
                                                    <span className="text-sm text-gray-500">Available: {parseFloat(selectedPair?.quote.balance || '0').toFixed(8)} {selectedPair?.quote.symbol}</span>
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-0 inset-y-0 flex items-center pl-4">
                                                        <img src={selectedPair?.quote.logoURI} alt={selectedPair?.quote.symbol} className="w-5 h-5 min-w-5 min-h-5 opacity-70 group-hover:opacity-100 transition-opacity rounded-full z-10" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={total}
                                                        className={`w-full h-14 pl-11 pr-16 rounded-2xl text-base font-medium transition-all duration-200
                                                                ${isDarkMode
                                                                ? 'bg-gray-900/20 border-gray-700/30 text-white'
                                                                : 'bg-gray-100/50 border-gray-200/50 text-gray-900'} border focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/20 outline-none backdrop-blur-sm`}
                                                        readOnly
                                                    />
                                                    <div className="absolute right-0 inset-y-0 flex items-center pr-4">
                                                        <span className="text-sm font-medium text-gray-500">{selectedPair?.quote.symbol}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-1 mt-2">
                                                {[25, 50, 75, 100].map((percentage) => (
                                                    <button
                                                        key={percentage}
                                                        onClick={() => handlePercentageClick(percentage)}
                                                        className={`py-1 px-1.5 rounded-full text-xs font-medium transition-all duration-200
                                                        ${tradeType === 'buy'
                                                                ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:border-green-300'
                                                                : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100 hover:border-pink-300'} border hover:ring-1 hover:ring-blue-500/10 active:scale-95 shadow-sm`}>
                                                        {percentage}%
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                            onClick={(()=>{
                                                handlePlaceOrder();
                                            })}
                                                className={`w-full h-14 sm:h-12 rounded-2xl sm:rounded-xl text-white text-sm font-medium transition-all duration-300 mt-6 sm:mt-4
                                                ${tradeType === 'buy'
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                                        : 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700'
                                                    } flex items-center justify-center gap-2 active:scale-[0.99] hover:shadow-xl backdrop-blur-sm`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>{tradeType === 'buy' ? 'Buy' : 'Sell'}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="order-3 sm:order-3 lg:col-span-2">
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}>
                        <div className="flex-1">
                            {/* Open Orders */}
                            <div className={`p-3  transition-all duration-300`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Open Orders</h3>
                                    <div className="flex items-center gap-1">
                                        <button className="p-1 rounded hover:bg-gray-200/20 transition-colors">
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
                                        <motion.div
                                            key={i}
                                            className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${order.type === 'buy'
                                                ? isDarkMode
                                                    ? 'bg-transparent hover:bg-green-500/20'
                                                    : 'bg-transparent hover:bg-green-100'
                                                : isDarkMode
                                                    ? 'bg-transparent hover:bg-pink-500/20'
                                                    : 'bg-transparent hover:bg-pink-100'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setSelectedOrder(i)}
                                        >
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-medium ${order.type === 'buy'
                                                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                    : isDarkMode
                                                        ? 'text-pink-400'
                                                        : 'text-pink-600'
                                                    }`}>
                                                    {order.type.toUpperCase()}
                                                </span>
                                                <span className={`px-1 py-0.5 rounded-full ${order.status === 'Filled'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : order.type === 'buy'
                                                        ? isDarkMode
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-green-50 text-green-600 border border-green-200'
                                                        : isDarkMode
                                                            ? 'bg-pink-500/20 text-pink-400'
                                                            : 'bg-pink-50 text-pink-600 border border-pink-200'
                                                    } text-[10px]`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-0.5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500">Price</span>
                                                    <span>{order.price}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500">Amount</span>
                                                    <span>{order.amount}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs mt-0.5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500">Filled</span>
                                                    <span>{order.filled}</span>
                                                </div>
                                                <button className={`px-2 py-1 rounded text-xs font-medium transition-colors border ${order.type === 'buy'
                                                    ? isDarkMode
                                                        ? 'text-green-400 border-green-400 hover:bg-green-500/30'
                                                        : 'text-green-600 border-green-600 hover:bg-green-200'
                                                    : isDarkMode
                                                        ? 'text-pink-400 border-pink-400 hover:bg-pink-500/30'
                                                        : 'text-pink-600 border-pink-600 hover:bg-pink-200'
                                                    }`}>
                                                    Cancel
                                                </button>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                <div className={`h-1.5 rounded-full ${order.type === 'buy' ? 'bg-green-500' : 'bg-pink-500'}`} style={{ width: `${(parseFloat(order.filled) / parseFloat(order.amount)) * 100}%` }}></div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Order History */}
                            <div className={`p-3 rounded-xl`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Order History</h3>
                                    <div className="flex items-center gap-1">
                                        <button className="p-1 rounded hover:bg-gray-200/20 transition-colors">
                                            <Filter className="w-3 h-3" />
                                        </button>
                                        <History className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {[
                                        { type: 'buy', price: '42,350.00', amount: '0.1', time: '10:45:23', status: 'Filled' },
                                        { type: 'sell', price: '42,400.00', amount: '0.05', time: '10:44:15', status: 'Filled' },
                                        { type: 'sell', price: '42,400.00', amount: '0.05', time: '10:44:15', status: 'Filled' },
                                        { type: 'buy', price: '42,300.00', amount: '0.2', time: '10:43:01', status: 'Cancelled' }
                                    ].map((order, i) => (
                                        <div key={i} className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${isDarkMode
                                            ? order.type === 'buy'
                                                ? 'bg-gray-800/20 hover:bg-green-500/20'
                                                : 'bg-gray-800/20 hover:bg-pink-500/20'
                                            : order.type === 'buy'
                                                ? 'bg-white/50 shadow-sm hover:bg-green-100'
                                                : 'bg-white/50 shadow-sm hover:bg-pink-100'}`}
                                        >
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-medium ${order.type === 'buy' ? 'text-green-500' : 'text-pink-600'}`}>
                                                    {order.type.toUpperCase()}
                                                </span>
                                                <span className={`px-1 py-0.5 rounded-full ${order.status === 'Filled'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : isDarkMode
                                                        ? 'bg-pink-500/20 text-pink-400'
                                                        : 'bg-pink-50 text-pink-600 border border-pink-200'
                                                    } text-[10px]`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-0.5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500">Price</span>
                                                    <span>{order.price}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500">Amount</span>
                                                    <span>{order.amount}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs mt-0.5">
                                                <span className="text-[10px] text-gray-500">{order.time}</span>
                                                <button className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ExchangePage; 