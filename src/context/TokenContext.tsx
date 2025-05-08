import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { fetchTokenListByChainId, generateTokenColorByContractAddress } from '../utils/helpers';
import { TradeType } from '../constants/entities/utils/misc';
import { getChainById } from './Web3ProviderContext';
import { ZeroAddress } from 'ethers';
import { fetchBalances } from '../constants/contracts/contracts';

// Token type
export type Token = {
  chainId: number;
  symbol: string;
  name: string;
  icon: string;
  address:string;
  balance: string;
  decimals: number;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  marketCap?: string;      
  volume24h?: string;      
  verified?: boolean;      
  favorite?: boolean;      
  category?: string;       
  color?: string;
  loading?: boolean;
};

interface TokenContextType {
  tokens: Token[];
  setTokens: (tokens: Token[]) => void;
  baseToken: Token | null;
  quoteToken: Token | null;
  selectingTokenIndex: number;
  tokenFilter: string;
  favoriteOnly: boolean;
  filteredTokens: Token[];
  tradeType: TradeType;
  openTokenSelector:boolean;
  fromAmount: string;
  toAmount: string;
  rate: number;
  account: string;
  isDarkMode: boolean; // Tema durumu
  isLoading: boolean; // Token listesi yüklenme durumu
  setAccount: (account: string) => void;
  setOpenTokenSelector: (open: boolean) => void;
  setTradeType: (tradeType: TradeType) => void;
  setBaseToken: (token: Token) => void;
  setQuoteToken: (token: Token) => void;
  setSelectingTokenIndex: (index: number) => void;
  setTokenFilter: (filter: string) => void;
  setFavoriteOnly: (favorite: boolean) => void;
  selectToken: (token: Token) => void;
  handleSwapTokens: () => void;
  setTokenList: (tokenList: Token[]) => void;
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDarkMode: () => void; // Tema değiştirme fonksiyonu
  reloadTokens: () => void;
}

// Default context değeri
const defaultContext: TokenContextType = {
  tokens: [],
  baseToken:  null,
  quoteToken: null,
  selectingTokenIndex: -1,
  tokenFilter: '',
  favoriteOnly: false,
  filteredTokens: [],
  fromAmount: '',
  toAmount: '',
  rate: 0,
  account: '',
  isDarkMode: false,
  isLoading: false,
  tradeType: TradeType.EXACT_INPUT,
  openTokenSelector:false,
  setTokens: () => {},
  setAccount: () => {},
  setTradeType: () => {},
  setOpenTokenSelector: () => {},
  setBaseToken: () => {},
  setQuoteToken: () => {},
  setSelectingTokenIndex: () => {},
  setTokenFilter: () => {},
  setFavoriteOnly: () => {},
  selectToken: () => {},
  handleSwapTokens: () => {},
  handleFromChange: () => {},
  handleToChange: () => {},
  toggleDarkMode: () => {},
  setTokenList: () => {},
  reloadTokens: () => {}
};

// Context'i oluştur
const TokenContext = createContext<TokenContextType>(defaultContext);

// Provider bileşeni
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

   const loadTokens = async () => {
    setTokens([]);
    setIsLoading(true);
    if (!chainId) return;
   
    try {
      const fetchedTokens = await fetchTokenListByChainId(Number(chainId));
      
      // Fetched tokenleri Token tipine dönüştür
      const formattedTokens: Token[] = fetchedTokens.tokens.map((token: any) => ({
        chainId: token.chainId || 0,
        symbol: token.symbol || '',
        name: token.name || '',
        icon: token.logoURI || '',
        decimals: token.decimals || 18,
        balance: token.balance || '0',
        address: token.address || '',
        price: token.price || '$0',
        change: token.change || '0%',
        trend: token.change?.startsWith('+') ? 'up' : token.change?.startsWith('-') ? 'down' : 'neutral',
        marketCap: token.marketCap || '',
        volume24h: token.volume24h || '',
        verified: token.verified !== undefined ? token.verified : true,
        favorite: token.favorite !== undefined ? token.favorite : false,
        category: token.category || '',
        color: generateTokenColorByContractAddress(token.address, isDarkMode),
        loading: true
      }));

      const chainInfo = getChainById(Number(chainId));
      let nativeCurrencyInfo : Token=  {
        chainId: Number(chainId) || 0,
        symbol: chainInfo?.nativeCurrency.symbol || '',
        name: chainInfo?.nativeCurrency.name || '',
        icon: formattedTokens[0].icon || '',
        balance:  '0',
        decimals: chainInfo?.nativeCurrency.decimals || 18,
        address: ZeroAddress ,
        price: '$0',
        change:  '0%',
        trend:  'neutral',
        marketCap: '',
        volume24h:  '',
        verified: true,
        favorite: true,
        category: '',
        color: generateTokenColorByContractAddress(ZeroAddress, isDarkMode),
        loading: true
      }
       
      let _tokens = [nativeCurrencyInfo, ...formattedTokens];

  

      setTokens(_tokens);
      await fetchBalances(chainId,address,walletProvider, _tokens,setTokens)
      
 
  
    } catch (error) {
      console.error('Token listesi yüklenirken hata:', error);
      // Hata durumunda default tokenleri kullan
      setIsLoading(false)
    } finally {

   

      setIsLoading(false);
    }
  };

  // ChainId değiştiğinde token listesini güncelle
  useEffect(() => {   
    loadTokens();
  }, [chainId,address]);

  useEffect(()=>{
    if(tokens.length == 0){
    setBaseToken(null);
    setQuoteToken(null);
  }else{
    if (!baseToken && tokens.length > 0) {
      setBaseToken(tokens[0]);
    }
    if (!quoteToken && tokens.length > 2) {
      setQuoteToken(tokens[2]);
    }
  }
  },[tokens.length]);

 
 
  // selectedTokens yerine ayrı ayrı baseToken ve quoteToken kullan
  const [baseToken, setBaseToken] = useState<Token | null>(null);
  const [quoteToken, setQuoteToken] = useState<Token | null>(null);
  const [tradeType,setTradeType]=useState<TradeType>(TradeType.EXACT_INPUT);
  const [openTokenSelector,setOpenTokenSelector]=useState<boolean>(false);
  const [selectingTokenIndex, setSelectingTokenIndex] = useState<number>(-1);
  const [tokenFilter, setTokenFilter] = useState<string>('');
  const [favoriteOnly, setFavoriteOnly] = useState<boolean>(false);
  const [account, setAccount] = useState<string>('');
  // Input değerleri için state
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Dark mode'u localStorage ve sistem tercihine göre başlat
  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const darkModeEnabled = savedMode === 'true' || (savedMode === null && prefersDark);
    setIsDarkMode(darkModeEnabled);
    
    // HTML element'ine sınıf ekle
    if (darkModeEnabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Dark mode değiştiğinde localStorage güncelleme ve HTML sınıf değiştirme
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Dark mode'u değiştirmek için fonksiyon
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Filtrelenmiş token listesi
  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      const matchesSearch = token.symbol.toLowerCase().includes(tokenFilter.toLowerCase()) || 
                          token.name.toLowerCase().includes(tokenFilter.toLowerCase());
      const matchesFavorite = favoriteOnly ? token.favorite : true;
      return matchesSearch && matchesFavorite;
    });
  }, [tokens, tokenFilter, favoriteOnly]);

  // Rate hesaplama - useMemo ile optimize edildi
  const rate = useMemo(() => {
    const baseRate = 0.00005869;
    return parseFloat(fromAmount) > 1000 ? baseRate * 1.02 : baseRate;
  }, [fromAmount]);

  // Token seçme fonksiyonu
  const selectToken = (token: Token) => {
    if (tradeType === TradeType.EXACT_INPUT) {
      setBaseToken(token);
    } else if (tradeType === TradeType.EXACT_OUTPUT) {
      setQuoteToken(token);
    }
    setOpenTokenSelector(false) // Seçim panelini kapat
  };

  // Tokenları swap etme
  const handleSwapTokens = () => {
    const tempToken = baseToken;
    setBaseToken(quoteToken);
    setQuoteToken(tempToken);
    
    // Ayrıca input değerlerini de yer değiştir
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const setTokenList = (tokenList: Token[]) => {
      setTokens(tokenList);
  }

  // Input değişiklikleri için handler'lar
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, '');
    setFromAmount(v);
    const calc = parseFloat(v || '0') * rate;
    setToAmount(isNaN(calc) ? '' : calc.toFixed(6));
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, '');
    setToAmount(v);
    const calc = parseFloat(v || '0') / rate;
    setFromAmount(isNaN(calc) ? '' : calc.toFixed(6));
  };

  const reloadTokens = () => {
    setTokens([]);
    loadTokens();
  }

  // Context değeri
  const value = {
    tokens,
    baseToken,
    quoteToken,
    selectingTokenIndex,
    tokenFilter,
    openTokenSelector,
    favoriteOnly,
    filteredTokens,
    fromAmount,
    toAmount,
    rate,
    isDarkMode,
    isLoading,
    tradeType,
    account,
    reloadTokens,
    setAccount,
    setOpenTokenSelector,
    setTradeType,
    setBaseToken,
    setQuoteToken,
    setSelectingTokenIndex,
    setTokenFilter,
    setFavoriteOnly,
    selectToken,
    handleSwapTokens,
    handleFromChange,
    handleToChange,
    toggleDarkMode,
    setTokenList
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook
export const useTokenContext = () => useContext(TokenContext); 