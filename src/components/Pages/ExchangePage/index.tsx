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
    RefreshCw,
    BookOpen
} from 'lucide-react';
import ChartView from './ChartView';
import { LimitOrderPairInfo, LimitOrderParam, OrderKind, PriceLevelOrderBook, TokenPair, useSwapContext } from '../../../context/SwapContext';
import { ethers } from 'ethers';
import { encodePacked, formatUnits, keccak256, parseEther, parseUnits } from 'viem';
import { WETH9 } from '../../../constants/entities';
import SwapTabs from '../../Swap/SwapTabs';
import { LIMIT_ORDER_BOOK_DECIMALS, PRICE_DECIMAL_FACTOR } from '../../../constants/contracts/exchanges';
import moment from 'moment';
import TradeHistory from './TradeHistory';
import OpenOrders from './OpenOrders';
import Contribute from '../../Contribute';

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
        tokens,
        setActiveView,
        activeView
    } = useTokenContext();

    const { fetchOrderBook, orderBook, placeLimitOrder, selectedPair, setSelectedPair, fetchLimitOrderPairInfo, limitOrderPairs, setLimitOrderPairs, fetchLimitOrderHistory, fetchUserOrders, limitOrderModal, setLimitOrderModal,createPaidPair } = useSwapContext();
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
    const [hoveredSellOrder, setHoveredSellOrder] = useState<number | null>(null);
    const [hoveredBuyOrder, setHoveredBuyOrder] = useState<number | null>(null);
    const [selectedSellRange, setSelectedSellRange] = useState<number | null>(null);
    const [selectedBuyRange, setSelectedBuyRange] = useState<number | null>(null);
    const [tradingPairs, setTradingPairs] = useState<TokenPair[]>([]);
    const [commonBases, setCommonBases] = useState<string[]>([]);
    const [toggleApplyForListingModal,setToggleApplyForListingModal] = useState(false)
    const [applyForListingPair,setApplyForListingPair] = useState<TokenPair|null>(null)


  





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

            const WRAPPED_TOKEN = WETH9[Number(chainId)].address;
            const _baseAddress = base.address == ethers.ZeroAddress ? WRAPPED_TOKEN : base.address;
            const _quoteAddress = quote.address == ethers.ZeroAddress ? WRAPPED_TOKEN : quote.address;

            const id = getPairId(_baseAddress, _quoteAddress);
            if (seenPairs.has(id)) return;

            const foundPair = limitOrderPairs.pairs.find(pair => pair.pairId === id) as LimitOrderPairInfo|| null;



            seenPairs.add(id);

            pairs.push({
                created:foundPair ? true : false,
                pairInfo:foundPair,
                base: { ...base, logoURI: base.logoURI ?? base.icon },
                quote: { ...quote, logoURI: quote.logoURI ?? quote.icon },
                symbol: `${base.symbol}/${quote.symbol}`,
                pair: id,
                isFavorite: parseFloat(base.balance) > 0 && parseFloat(quote.balance) > 0,
                price: foundPair ? parseFloat(formatUnits(foundPair.lastPrice,LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)  : "-",
                change: foundPair ? parseFloat(formatUnits(foundPair.change,LIMIT_ORDER_BOOK_DECIMALS)).toFixed(4)  : "-",
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


    const [selectedCategory, setSelectedCategory] = useState('CHZ');
    const [sortBy, setSortBy] = useState<'pair' | 'price' | 'change' | 'volume'>('change');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [pairSearch, setPairSearch] = useState('');

    const sortedPairs = React.useMemo(() => {
        return [...tradingPairs]
            .filter(pair => {
                if (selectedCategory === 'All') {
                    return true;
                }
                if (selectedCategory === 'Favorites') {
                    return pair.isFavorite;
                }
                return pair.quote.symbol.endsWith(selectedCategory) && pair.created;
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
        const userBalance = selectedPair && tradeType == "buy" ? selectedPair?.quote.balance : selectedPair?.base.balance
        const maxAmount = parseFloat(userBalance ? userBalance : "0");
        const newAmount = (maxAmount * percentage / 100)

        if(tradeType == "buy"){
            
            const priceVal = parseFloat(price ? price : "0")
            const total = (newAmount / priceVal)
            handleAmountChange({ target: { value: total.toFixed(8)} } as React.ChangeEvent<HTMLInputElement>);
        }else{
            handleAmountChange({ target: { value: newAmount.toFixed(8) } } as React.ChangeEvent<HTMLInputElement>);
        }
        
    };

    const toggleSection = (section: 'buyOrders' | 'sellOrders') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };




    function getMatchingPriceLevelIndexes(
        orderType: OrderKind,
        priceLevels: PriceLevelOrderBook[],
        userInputPrice: bigint,
        userInputDecimals: number
    ): bigint[] {
        const matchedIndexes: bigint[] = [];

        const decimalDiff = BigInt(userInputDecimals) - BigInt(LIMIT_ORDER_BOOK_DECIMALS);
        const normalizedUserInputPrice = decimalDiff > 0
            ? userInputPrice / (10n ** decimalDiff)
            : userInputPrice * (10n ** (-decimalDiff));

        for (const level of priceLevels) {
            if (orderType === OrderKind.BUY_MARKET) {
                // BUY MARKET: Daha düşük fiyattaki satış emirlerini kapsar
                if (level.price <= normalizedUserInputPrice) {
                    matchedIndexes.push(level.index);
                }
            } else {
                // SELL MARKET: Daha yüksek fiyattaki alış emirlerini kapsar
                if (level.price >= normalizedUserInputPrice) {
                    console.log("LEVEL PRICE", level.price, "NORMALIZED PRICE", normalizedUserInputPrice, "level index", level.index)
                    matchedIndexes.push(level.index);
                }
            }
        }

        return matchedIndexes;
    }


    const handlePlaceOrder = async () => {
        console.log("PLACE ORDER", selectedPair)







        if (!selectedPair) {
            return
        }

        //const pairInfo = limitOrderPairs.pairs[0];



        let WRAPPED_TOKEN = WETH9[Number(chainId)].address;

        let _baseAddress = selectedPair.base.address == ethers.ZeroAddress ? WRAPPED_TOKEN : selectedPair.base.address;
        let _quoteAddress = selectedPair.quote.address == ethers.ZeroAddress ? WRAPPED_TOKEN : selectedPair.quote.address;

        // _baseAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508"
        // _quoteAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016"



        console.log("BASE ADDRESS", _baseAddress, "QUOTE ADDRESS", _quoteAddress)

        const userInputDecimals = selectedPair?.quote.decimals ?? 18;
        const userInputPrice = ethers.parseUnits(price || '0', userInputDecimals);
        const userInputAmount = ethers.parseUnits(amount || '0', selectedPair?.quote.decimals ?? 18)
        const levelIndexes = getMatchingPriceLevelIndexes(tradeType == "buy" ? OrderKind.BUY_MARKET : OrderKind.SELL_MARKET, tradeType == "buy" ? orderBook.sell : orderBook.buy, userInputPrice, userInputDecimals)


        const totalAmount = ethers.parseUnits(total || '0', selectedPair?.quote.decimals ?? 18)


        const orderKind: OrderKind = tradeType == "buy" ? OrderKind.BUY_MARKET : OrderKind.SELL_MARKET
        const limirOrderParams: LimitOrderParam = {
            kind: orderKind,
            token0: _baseAddress,        // Ethereum adresi olduğu için string
            token1: _quoteAddress,
            price: userInputPrice,       // uint256 için bigint uygun
            amount: orderKind == OrderKind.BUY_MARKET ? totalAmount : userInputAmount,
            deadline: BigInt(moment().add(1, 'hours').unix()),
            entrypoint: levelIndexes,       // uint256[] dizisi için bigint[]
        }

        console.log("ORDER LEVELS", limirOrderParams.entrypoint)





        await placeLimitOrder(walletProvider, limirOrderParams)

    }

    const closeSuccessModal = () => {
        setLimitOrderModal({
            status: 'none',
            visible: false,
            message: '',
            isLoading: false,
            proof: '',
        });
    };


    useEffect(() => {
        console.log("Native Token",nativeToken)
        setActiveView('limit')
    }, [nativeToken])
    const totalOrderBookHeight = 53.2; // Total height for both sections combined

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
    const handleOrderBookPriceClick = (order: PriceLevelOrderBook, type: 'buy' | 'sell') => {
        setPrice(parseFloat(ethers.formatUnits(order.price, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS));
        setAmount(parseFloat(ethers.formatUnits(order.totalAmount, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS));
        setTotal(parseFloat(ethers.formatUnits(order.totalPrice, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS));
        setTradeType(type);
    };

    useEffect(() => {

        if (amount && price) {
            const decimals = selectedPair?.quote?.decimals ?? 18;
            const precision = decimals > 8 ? 8 : decimals;
            const total = parseFloat(amount) * parseFloat(price);
            setTotal(total.toFixed(precision));
        }
    }, [amount, price])

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

    const handleApplyForListing= async(pair:TokenPair | null) =>{
        if(!pair){
            return
        }
        if(!chainId){
            return
        }

        const baseAddress = pair.base.address == ethers.ZeroAddress ? WETH9[Number(chainId)].address :  pair.base.address;
        const quoteAddress = pair.quote.address == ethers.ZeroAddress ? WETH9[Number(chainId)].address :  pair.quote.address;

        await createPaidPair(walletProvider,baseAddress,quoteAddress,parseEther("50000"));
        setToggleApplyForListingModal(!toggleApplyForListingModal)

    }

    useEffect(() => {
        setHoveredSellOrder(null);
        setHoveredBuyOrder(null);
        setSelectedSellRange(null);
        setSelectedBuyRange(null);
    }, [tradeType]);


    useEffect(() => {
        console.log("limitOrderPairs", limitOrderPairs,tokens)
        const _commonBases = ['All','Favorites', nativeToken?.symbol.toUpperCase(), 'USDC', 'USDT'] as string[];
        setCommonBases(_commonBases)
        const _tradingPairs = generateQuotePairs(tokens, commonBases);
        console.log("_tradingPairs",_tradingPairs)
        setTradingPairs(_tradingPairs)
    }, [tokens.length, limitOrderPairs.pairs.length,nativeToken])

    const loadData = async () => {

        setSwapMode(SWAP_MODE.LIMIT_ORDERS);
        await reloadTokens();
        await fetchLimitOrderPairInfo(walletProvider);
        /*
        if (selectedPair) {
            await fetchOrderBook(walletProvider);
        }
        await fetchLimitOrderHistory(walletProvider);
        if (address) {
            await fetchUserOrders(walletProvider, selectedPair?.pair as string, address)
        }
        */
    }

    useEffect(() => {
        fetchOrderBook(walletProvider)
    }, [selectedPair, address, isConnected])
    useEffect(() => {
        console.log("LIMIT PROTOCOL", chainId)
        setSelectedPair(null)
        loadData();
    }, [chainId, address, isConnected]);

    return (<>

{
 toggleApplyForListingModal == true && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={()=>{
                    setToggleApplyForListingModal(!toggleApplyForListingModal)
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className={`relative rounded-2xl p-1 max-w-md w-full shadow-2xl ${isDarkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-white to-gray-50'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`rounded-2xl p-6 ${isDarkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-white to-gray-50'
                        }`}>
                        <div className="flex justify-end">
                            <button
                                onClick={()=>{
                                    setToggleApplyForListingModal(!toggleApplyForListingModal)
                                }}
                                className={`${isDarkMode
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                                    } transition-colors`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="text-center py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
                                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080] flex items-center justify-center mb-6"
                            >
                           
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                               
                            </motion.div>

                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}
                            >
                                Apply for Listing [{applyForListingPair?.symbol}]
                            </motion.h3>


                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className={`rounded-xl p-4 mb-6 ${isDarkMode
                                    ? 'bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20'
                                    : 'bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10'
                                    }`}
                            >

<div className="max-w-xl mx-auto  text-base leading-relaxed font-sans text-sm max-h-[20dvh] overflow-y-scroll">
  <p className="mb-4">
    To list a token on the <strong className="font-semibold">KEWL Limit Order Protocol</strong>, a one-time listing fee of 
    <strong className="font-semibold"> 50,000 CHZ</strong> is required.
  </p>
  <p className="mb-4">
    This fee is not only a filter to maintain quality and prevent spam listings,
    but more importantly, 
    <strong className="font-semibold">it will be used directly in the development and long-term sustainability of the KEWL protocol</strong>.
  </p>
  <p className="mb-4">
    <strong className="font-semibold">Token listing is processed automatically the moment the payment is confirmed on-chain.</strong>
    There is no need for manual review or waiting periods.
  </p>
  <p className="mb-2">
    Once paid, your token will be:
  </p>
  <ul className="list-disc list-inside pl-4 mb-4 space-y-1">
    <li>Added to the KEWL orderbook system</li>
    <li>Eligible for off-chain signed limit orders</li>
    <li>Visible on KEWL-compatible frontends</li>
    <li>Included in future incentive systems and advanced trading tools</li>
  </ul>
  <p>
    Please ensure your token follows standard ERC-20 behavior for smooth integration.
  </p>
</div>

                            
                                
                            </motion.div>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={()=>{
                                    handleApplyForListing(applyForListingPair)
                                }}
                                className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#ff1356] to-[#ff4080] hover:opacity-90 transition-opacity"
                            >
                                    Make Payment (50,000 CHZ)
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        }
        {limitOrderModal.visible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={(closeSuccessModal)}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className={`relative rounded-2xl p-1 max-w-md w-full shadow-2xl ${isDarkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-white to-gray-50'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`rounded-2xl p-6 ${isDarkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-white to-gray-50'
                        }`}>
                        <div className="flex justify-end">
                            <button
                                onClick={closeSuccessModal}
                                className={`${isDarkMode
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                                    } transition-colors`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="text-center py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
                                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080] flex items-center justify-center mb-6"
                            >
                                {limitOrderModal.status === 'success' ? (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </motion.div>

                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}
                            >
                                {limitOrderModal.status === 'success' ? 'Success!' : 'Error'}
                            </motion.h3>


                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className={`rounded-xl p-4 mb-6 ${isDarkMode
                                    ? 'bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20'
                                    : 'bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10'
                                    }`}
                            >

                                {limitOrderModal.status === 'success' ? (
                                    <p className="text-sm font-bold bg-gradient-to-r from-[#ff1356] to-[#ff4080] bg-clip-text text-transparent">
                                        {limitOrderModal.message}
                                    </p>
                                ) : (
                                    <div className="rounded-lg text-left max-h-[200px] overflow-y-auto text-sm">
                                        {limitOrderModal.message ? limitOrderModal.message : "Unexpected error encountered."}
                                    </div>
                                )}
                            </motion.div>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={closeSuccessModal}
                                className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#ff1356] to-[#ff4080] hover:opacity-90 transition-opacity"
                            >
                                Awesome!
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}

        <div className={`select-none flex flex-col gap-4 items-center justify-center px-0 py-4 md:p-4 transition-colors duration-300`}>

            <div translate='no' className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">




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
                                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 rounded-3xl bg-gray-200/20 hover:bg-gray-200/30 transition-colors"
                                    >
                                        <div className='flex flex-row gap-1 col-center gap-2'>
                                            <img src={selectedPair?.base?.logoURI} alt={selectedPair?.base?.symbol} className='w-4 h-4 rounded-full min-w-4 min-h-4' />
                                            <img src={selectedPair?.quote?.logoURI} alt={selectedPair?.quote?.symbol} className='w-4 h-4 rounded-full min-w-4 min-h-4' />
                                        </div>
                                        <span className="font-medium">{selectedPair?.symbol ? selectedPair?.symbol : 'Select Market'}</span>
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

                                        <button onClick={() => {
                                            setExpandedSections({
                                                buyOrders: true,
                                                sellOrders: true
                                            })

                                        }} className="p-1.5 rounded-lg hover:bg-gray-200/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66663 2.66699L7.33329 2.66699L7.33329 7.33366L2.66663 7.33366L2.66663 2.66699Z" fill="#dc2979"></path><path d="M2.66663 8.66699L7.33329 8.66699L7.33329 13.3337L2.66663 13.3337L2.66663 8.66699Z" fill="#049769"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z" fill="#d2d6dc"></path></svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setExpandedSections({
                                                    buyOrders: true,
                                                    sellOrders: false
                                                })

                                            }}
                                            className="p-1.5 rounded-lg hover:bg-gray-200/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g><path d="M2.66663 2.66699L7.33329 2.66699L7.33329 13.3337L2.66663 13.3337L2.66663 2.66699Z" fill="#049769"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z" fill="#d2d6dc"></path></g></svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setExpandedSections({
                                                    buyOrders: false,
                                                    sellOrders: true
                                                })


                                            }}
                                            className="p-1.5 rounded-lg hover:bg-gray-200/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g><path d="M2.66663 2.66699L7.33329 2.66699L7.33329 13.3337L2.66663 13.3337L2.66663 2.66699Z" fill="#dc2979"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z" fill="#d2d6dc"></path></g></svg>
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
                                            className="select-none my-1 flex flex-col  gap-[1px] overflow-y-auto scrollbar-hide custom-scrollbar flex flex-col-reverse"
                                        >
                                            {orderBook.loading ? (
                                                <div className="space-y-0.5">
                                                    {Array.from({ length: 25 }).map((_, i) => (
                                                        <div key={i} className={`grid grid-cols-3 text-xs p-1.5 rounded-lg animate-pulse shadow-sm `}>
                                                            <span className={`h-4 w-3/4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                                : orderBook.sell.length === 0 ? (
                                                    <div className="w-full h-full items-center justify-center flex flex-col gap-2 text-sm text-center text-muted-foreground py-4">
                                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10 flex items-center justify-center">

                                                            <BookOpen className="w-8 h-8 text-[#ff4080]" />
                                                        </div>
                                                        <div className={`w-full flex flex-col gap-2  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            <span className='text-sm font-medium mb-1'>No sell orders yet.</span>
                                                            <span className='text-xs'>Be the first to place a sell order and shape the market!</span>
                                                        </div>

                                                    </div>
                                                ) :
                                                    (
                                                        orderBook.sell.map((order, i) => (
                                                            <div
                                                                key={i}
                                                                className={`select-none relative grid grid-cols-3 text-xs hover:bg-pink-500/20 cursor-pointer p-1.5 rounded-lg group px-2 ${hoveredSellOrder !== null && i <= hoveredSellOrder ? 'bg-pink-500/20' : ''} ${selectedSellRange !== null && i <= selectedSellRange ? 'bg-pink-500/40' : ''}`}
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
                                                                <span className="group-hover:text-pink-400 relative">{parseFloat(ethers.formatUnits(order.price, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(8)}</span>
                                                                <span className="text-right relative">{parseFloat(ethers.formatUnits(order.totalAmount, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(4)}</span>
                                                                <span className="text-right text-gray-500 relative">{parseFloat(ethers.formatUnits(order.totalPrice, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(4)}</span>
                                                            </div>
                                                        ))
                                                    )}
                                        </motion.div>
                                    </div>

                                    <div className="text-center py-2 text-xs font-medium bg-gray-200/20 rounded-lg my-2">
                                        <div className="text-sm font-bold">{selectedPair && selectedPair.pairInfo &&  selectedPair.created ? parseFloat(formatUnits(selectedPair.pairInfo.lastPrice, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS) :"0.00000000"}</div>
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
                                            {orderBook.loading ? (
                                                <div className="space-y-0.5">
                                                    {Array.from({ length: 25 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="grid grid-cols-3 text-xs p-1.5 rounded-lg animate-pulse shadow-sm"
                                                        >
                                                            <span className={`h-4 w-3/4 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                                                            <span className={`h-4 w-1/2 rounded-full ml-auto ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : orderBook.buy.length === 0 ? (
                                                <div className="w-full h-full items-center justify-center flex flex-col gap-2 text-sm text-center text-muted-foreground py-4">
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10 flex items-center justify-center">

                                                        <BookOpen className="w-8 h-8 text-[#ff4080]" />
                                                    </div>
                                                    <div className={`w-full flex flex-col gap-2  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <span className='text-sm font-medium mb-1'>No buy orders yet.</span>
                                                        <span className='text-xs'>Be the first to place a buy order and shape the market!</span>
                                                    </div>

                                                </div>
                                            ) : (
                                                orderBook.buy.map((order, i) => (
                                                    <div
                                                        key={i}
                                                        className={`select-none relative grid grid-cols-3 text-xs hover:bg-green-500/10 cursor-pointer p-1.5 rounded-lg group px-2 ${hoveredBuyOrder !== null && i <= hoveredBuyOrder ? 'bg-green-500/20' : ''} ${selectedBuyRange !== null && i <= selectedBuyRange ? 'bg-green-500/40' : ''}`}
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
                                                        <span className="group-hover:text-green-500 relative">{parseFloat(ethers.formatUnits(order.price, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(8)}</span>
                                                        <span className="text-right relative">{parseFloat(ethers.formatUnits(order.totalAmount, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(4)}</span>
                                                        <span className="text-right text-gray-500 relative">{parseFloat(ethers.formatUnits(order.totalPrice, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(4)}</span>
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
                    <div className='flex flex-col gap-4'>
                        <SwapTabs isLimitOrder={true} isDarkMode={isDarkMode} />
                    </div>

                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}>

                        <div className="w-full">
                            {showPairSelector || !selectedPair ? (
                                <div className={`p-4 rounded-3xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} min-h-[600px]   }`}>
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

                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200/10">
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

                                    <div className="grid grid-cols-3 px-4 py-2 border-b border-gray-200/10 text-xs font-medium text-gray-500">
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
                                            <span>Change</span>
                                            {sortBy === 'change' && (
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
                                                        if(pair.created){
                                                            setSelectedPair(pair);
                                                            setShowPairSelector(false);
                                                        }
                                                    }}
                                                    className={`grid grid-cols-3 px-4 py-3 cursor-pointer transition-colors
                                                    ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800/10' : 'bg-gray-50/50') : ''}
                                                    ${isDarkMode ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/70'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-1">
                                                            <img src={pair.base.logoURI} alt={pair.base.symbol} className="w-5 h-5 min-w-5 min-h-5 rounded-full border" />
                                                            <img src={pair.quote.logoURI} alt={pair.quote.symbol} className="w-5 h-5 min-w-5 min-h-5 rounded-full border" />
                                                        </div>
                                                        <span className={`font-medium text-sm ${pair.created ? "" : "text-gray-500"}`}>{pair.symbol}</span>
                                                        {pair.isFavorite && (
                                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                                        )}
                                                    </div>
                                                    <div className="text-right font-medium text-sm">{pair.price}</div>
                                                    <div className={`text-right flex items-center justify-end font-medium text-sm ${pair.change.startsWith('-') ? 'text-pink-500' : 'text-green-500'}`}>
                                                       {
                                                        pair.created ?  pair.change :   <motion.button
                                                        onClick={()=>{
                                                            setApplyForListingPair(pair)
                                                            setToggleApplyForListingModal(!toggleApplyForListingModal)
                                                        }}
                                                        className={`p-1 px-2 rounded-xl font-small flex items-center justify-center space-x-2 shadow-md text-white relative overflow-hidden`}
                                                        whileHover={  { scale: 1.02 }}
                                                        whileTap={ { scale: 0.98 }}
                                                        style={{
                                                          background: `linear-gradient(135deg, #ff1356, #ff4080)`
                                                        }}
                                                      >
                                                        
                                            
                                                        <span>Create Pair</span>
                                                        <Zap className="w-4 h-4" />
                                                      </motion.button>
                                                       }
                                                       
                                                    </div>
                                                
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                                <Search className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-lg font-medium mb-1">No trading pairs found</span>
                                                <span className="text-sm text-gray-400">Try adjusting your search</span>
                                                <button
                                                    onClick={() => { setPairSearch(''); setSelectedCategory(commonBases[0]) }}
                                                    className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className='w-full h-full flex flex-col gap-4 p-0'>


                                    <div className='flex flex-col gap-4 p-0'>


                                        <ChartView />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                    {
                        (!showPairSelector && selectedPair) && <motion.div
                            className={`relative ${isDarkMode
                                ? 'bg-gray-800/30 border-gray-700/30'
                                : 'bg-white/40 border-white/20'
                                } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}>
                            <div className="w-full">


                                <div translate='no' className={`p-5 rounded-3xl backdrop-blur-sm shadow-sm `}>
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
                                    <div className="space-y-2">
                                        <div className="relative">

                                            <div className="relative group">




                                                <div className={`absolute left-2  top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-10`}>
                                                    <img
                                                        src={selectedPair?.quote.logoURI}
                                                        alt={selectedPair?.quote.symbol}
                                                        className="w-6 h-6 min-w-6 min-h-6 rounded-full transition-all group-hover:scale-110 duration-300"
                                                    />
                                                </div>



                                                <div className="absolute left-12 top-3 text-xs font-medium text-gray-500">
                                                    Price
                                                </div>

                                                <input
                                                    type="text"
                                                    value={price}
                                                    onChange={handlePriceChange}
                                                    onBlur={() => {
                                                        if (price) {
                                                            setPrice(parseFloat(price).toFixed(selectedPair && selectedPair?.quote?.decimals > 8 ? 8 : selectedPair?.quote?.decimals))

                                                            const decimals = selectedPair?.quote?.decimals ?? 18;
                                                            const precision = decimals > 8 ? 8 : decimals;
                                                            const parsedPrice = parseFloat(price || '0').toFixed(precision);
                                                            handlePriceChange({ target: { value: parsedPrice } } as React.ChangeEvent<HTMLInputElement>);

                                                        }
                                                    }}
                                                    className={`w-full h-14 pt-5 pl-12 pr-24 rounded-2xl text-base font-medium transition-all duration-200 
                                                             ${isDarkMode
                                                            ? 'bg-gray-900/20 focus:bg-gray-900/30 border-gray-700/30 text-white'
                                                            : 'bg-gray-100/50 focus:bg-white/70 border-gray-200/50 text-gray-900'} border focus:border-gray-500/30 focus:ring-2 focus:ring-gray-500/20 outline-none `}
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
                                                                handlePriceChange({ target: { value: increasedPrice } } as React.ChangeEvent<HTMLInputElement>);

                                                            }}
                                                            className="p-2 rounded-l-lg hover:bg-gray-200/20 transition-all duration-200 active:scale-95"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <div className="h-5 w-px bg-gray-400/10" />
                                                        <button
                                                            onClick={() => {

                                                                const decimals = selectedPair?.quote?.decimals ?? 18;
                                                                const precision = decimals > 8 ? 8 : decimals;
                                                                const parsedPrice = parseFloat(price || '0');

                                                                const decreasedPrice = (parsedPrice * 0.99).toFixed(precision);
                                                                handlePriceChange({ target: { value: decreasedPrice } } as React.ChangeEvent<HTMLInputElement>);
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

                                            <div className="relative group">



                                                <div className={`absolute left-2  top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-10`}>
                                                    <img
                                                        src={selectedPair?.base.logoURI}
                                                        alt={selectedPair?.base.symbol}
                                                        className="w-6 h-6 min-w-6 min-h-6 rounded-full transition-all group-hover:scale-110 duration-300"
                                                    />
                                                </div>

                                                <div className="absolute left-12 top-3 text-xs font-medium text-gray-500">
                                                    Amount
                                                </div>
                                                <input
                                                    type="text"
                                                    value={amount}
                                                    onBlur={() => {
                                                        if (amount) {
                                                            const decimals = selectedPair?.base?.decimals ?? 18;
                                                            const precision = decimals > 8 ? 8 : decimals;
                                                            const parsedAmount = parseFloat(amount || '0');
                                                            const fixedAmount = parsedAmount.toFixed(precision);
                                                            setAmount(fixedAmount)
                                                        }
                                                    }}
                                                    onChange={handleAmountChange}
                                                    className={`w-full h-14 pl-12 pt-5 pr-24 rounded-2xl text-base font-medium transition-all duration-200  ${isDarkMode  ? 'bg-gray-900/20 focus:bg-gray-900/30 border-gray-700/30 text-white' : 'bg-gray-100/50 focus:bg-white/70 border-gray-200/50 text-gray-900'}  border focus:border-gray-500/30 focus:ring-2 focus:ring-gray-500/20 outline-none`}
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
                                                                handleAmountChange({ target: { value: increasedAmount } } as React.ChangeEvent<HTMLInputElement>);

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

                                                                handleAmountChange({ target: { value: decreasedAmount } } as React.ChangeEvent<HTMLInputElement>);
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

                                            <div className="relative group">


                                                <div className={`absolute left-2  top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-10`}>
                                                    <img
                                                        src={selectedPair?.quote.logoURI}
                                                        alt={selectedPair?.quote.symbol}
                                                        className="w-6 h-6 min-w-6 min-h-6 rounded-full transition-all group-hover:scale-110 duration-300"
                                                    />
                                                </div>

                                                <div className="absolute left-12 top-3 text-xs font-medium text-gray-500">
                                                    Total
                                                </div>
                                                <input
                                                    type="text"
                                                    value={total}
                                                    placeholder="0.00"
                                                    className={`w-full h-14 pl-12 pt-5 pr-16 rounded-2xl text-base font-medium transition-all duration-200
                                                                ${isDarkMode
                                                            ? 'bg-gray-900/20 border-gray-700/30 text-white'
                                                            : 'bg-gray-100/50 border-gray-200/50 text-gray-900'} border focus:border-gray-500/30 focus:ring-2 focus:ring-gray-500/20 outline-none`}
                                                    readOnly
                                                />
                                                <div className="absolute right-0 inset-y-0 flex items-center pr-4">
                                                    <span className="text-sm font-medium text-gray-500">{selectedPair?.quote.symbol}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`w-full flex flex-col gap-2 rounded-xl p-2 border  ${isDarkMode  ? 'bg-gray-900/20 border-gray-700/30 text-white'  : 'bg-gray-100/50 text-gray-900 border-gray-200'} `}>

                                            <div className='flex flex-row gap-2 items-center justify-between'>
                                                <div className="flex flex-row gap-2 items-center justify-center mb-2">
                                                    <img src={selectedPair?.quote.logoURI} alt={selectedPair?.quote.symbol} className="w-4 h-4 min-w-4 min-h-4 rounded-full" />
                                                    <span className="text-sm text-gray-500">{parseFloat(selectedPair?.quote.balance || '0').toFixed(8)} {selectedPair?.quote.symbol}</span>
                                                </div>

                                                <div className="flex flex-row gap-2 items-center justify-center mb-2">
                                                    <img src={selectedPair?.base.logoURI} alt={selectedPair?.base.symbol} className="w-4 h-4 min-w-4 min-h-4 rounded-full" />
                                                    <span className="text-sm text-gray-500">{parseFloat(selectedPair?.base.balance || '0').toFixed(8)}  {selectedPair?.base.symbol}</span>
                                                </div>
                                            </div>






                                            <div className="grid grid-cols-4 gap-1">
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

                                        </div>



                                        <motion.button
                                            onClick={(() => {
                                                handlePlaceOrder();
                                            })}
                                            whileTap={limitOrderModal.isLoading ? { scale: 0.98 } : {}}
                                            className={`w-full h-14 sm:h-12 rounded-2xl sm:rounded-xl text-white text-sm font-medium transition-all duration-300 mt-6 sm:mt-4
                                                ${tradeType === 'buy'
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                                    : 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700'
                                                } flex items-center justify-center gap-2 active:scale-[0.99] hover:shadow-xl backdrop-blur-sm`}
                                        >
                                            {limitOrderModal.isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Placing Order...
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span>{tradeType === 'buy' ? 'Buy' : 'Sell'}</span>
                                                </div>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    }

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
                            <div className={`p-3 transition-all duration-300`}>
                                <OpenOrders />
                            </div>

                            {/* Order History */}
                            <div className={`p-3 rounded-xl`}>
                                <TradeHistory />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </>
    );
};

export default ExchangePage;

