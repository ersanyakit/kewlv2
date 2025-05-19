import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CHILIZWRAPPER, CurrencyAmount, Pair, Percent, Price, Route, Token, Trade, WETH9 } from '../constants/entities';
import { DEFAULT_DEADLINE_FROM_NOW, ETHER_ADDRESS, INITIAL_ALLOWED_SLIPPAGE, MINIMUM_LIQUIDITY, SWAP_FEE_ON, TradeType, ZERO } from '../constants/entities/utils/misc';
import { SWAP_MODE, useTokenContext } from './TokenContext';
import { useAppKitNetwork } from '@reown/appkit/react';
import { AbiCoder, ethers, formatEther, parseEther, ZeroAddress } from 'ethers';
import { fetchBalances, getContractByName } from '../constants/contracts/contracts';
import { KEWL_DEPLOYER_ADDRESS, TContractType } from '../constants/contracts/addresses';
import JSBI from 'jsbi';
import { ALLOWED_PRICE_IMPACT_HIGH, ALLOWED_PRICE_IMPACT_MEDIUM, calculateSlippageAmount, warningSeverity, warningSeverityText } from '../constants/entities/utils/calculateSlippageAmount';
import moment from 'moment';
import { toHex } from '../constants/entities/utils/computePriceImpact';
import { Address, BaseError, ContractFunctionExecutionError, ContractFunctionRevertedError, decodeEventLog, erc20Abi, getContract, parseAbiItem, parseUnits, UserRejectedRequestError, zeroAddress } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { getExchangeByRouterAndWETH, getRoutersByChainId } from '../constants/contracts/exchanges';
import { sqrt } from '../constants/entities/utils/sqrt';
import { Token as TokenContextToken } from './TokenContext';

interface UserTradingStats {
  totalReward: bigint;
  individualReward: any; // veya bigint, duruma göre
  tradingStats: {
    token: string;
    totalTrades: string;
    individualTrades: string;
  }[];
}

export enum BOUNTY_TYPE {
  TWEET = "TWEET",
  VOLUME = "VOLUME",
  BALANCE = "BALANCE",
  LIQUIDITY = "LIQUIDITY",
  JACKPOT = "JACKPOT",
  CUSTOM = "CUSTOM",
}
export const BOUNTY_TYPE_ARRAY = Object.values(BOUNTY_TYPE)


export interface BountyClaimParam {
  bountyId: bigint;  // ethers v6'daki BigNumber yerine native bigint önerilir
  taskId: any;
  params: string;
}

export interface JackpotInfoResult {
  receivers: string[];         // Ethereum address array
  jackpotAmount: bigint;       // Use bigint for uint256
  isLoaded: boolean;
}

export type ClaimStatus = 'none' | 'success' | 'error';

export interface ClaimModalState {
  status: ClaimStatus;
  message?: string;
  visible: boolean;
}

const initialPairState: TPairState = {
  pairInfo: null,
  userLiquidity: "0.0000",
  totalLiquidity: "0.0000",
  basePrice: "0.0000",
  quotePrice: "0.0000",
  baseLiquidity: "0.0000",
  quoteLiquidity: "0.0000",
  userBaseLiquidity: "0.00000",
  userQuoteLiquidity: "0.0000",
  baseReservePercent: "0.00",
  quoteReservePercent: "0.00",
  totalReservePercent: "0.00",
  shareOfPool: "100",
  noLiquidity: true,
  userBaseLiquidityRaw: undefined,
  userQuoteLiquidityRaw: undefined,
  userLiquidityRaw: undefined,
  totalLiquidityRaw: undefined,
  liquidityValueA: undefined,
  liquidityValueB: undefined,
};
// Context için tip tanımı
interface SwapContextProps {

  orderBook: OrderBook;
  setOrderBook: (orderBook: OrderBook) => void;
  selectedPair: TokenPair | null;
  setSelectedPair: (selectedPair: TokenPair | null) => void;
  // Diğer özellikler...
  swapResult: SwapResult | null;
  canSwap: boolean;
  canAggregatorSwap: boolean;
  isSwapping: boolean;
  toggleDetails: boolean;
  fromAmount: string;
  toAmount: string;
  loading: boolean;
  tradeInfo: Trade<Token, Token, TradeType> | null;
  baseReservePercent: Percent;
  quoteReservePercent: Percent;
  totalReservePercent: Percent;
  baseReserveAmount: CurrencyAmount<Token> | undefined;
  quoteReserveAmount: CurrencyAmount<Token> | undefined;
  priceImpactWarningSeverity: number;
  removeLiquidityPercent: number;
  setRemoveLiquidityPercent: (percent: number) => void;
  userTradingStats: UserTradingStats | null;
  setUserTradingStats: (userTradingStats: UserTradingStats | null) => void;
  pairState: TPairState;
  setPairState: (pairState: TPairState) => void;
  handleAggregatorSwap: (walletProvider: any) => void;
  fetchClaimedRewards: (walletProvider: any) => void;
  claimedRewardsLoading: boolean;
  setClaimedRewardsLoading: (loading: boolean) => void;

  jackpotInfo: JackpotInfoResult;
  setJackpotInfo: (jackpotInfo: JackpotInfoResult) => void;
  fetchJackPotInfo: (walletProvider: any, limit:number) => void;
  isClaimLoading: boolean;
  setIsClaimLoading: (isClaimLoading: boolean) => void;
  claimModal: ClaimModalState;
  setClaimModal: (claimModal: ClaimModalState) => void;

  bountiesInfo: any;
  setBountiesInfo: (bountiesInfo: any) => void;
  fetchBountiesInfo: (walletProvider: any) => void;

  claimedRewards: any[];
  setClaimedRewards: (claimedRewards: any[]) => void;
  handleClaimedRewards: (walletProvider: any, claimedRewards: BountyClaimParam) => void;

  aggregatorPairs: TCustomPair[];
  setAggregatorPairs: (pairs: TCustomPair[]) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  handleBundleSwap: (walletProvider: any, tokens: any[]) => void;
  setLoading: (loading: boolean) => void;
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setToggleDetails: (toggleDetails: boolean) => void;
  handleSwap: (walletProvider: any) => void;
  setCanAggregatorSwap: (canAggregatorSwap: boolean) => void;
  handleAddLiquidity: (walletProvider: any) => void;
  handleRemoveLiquidity: (walletProvider: any) => void;
  fetchLiquidityInfo: (walletProvider: any) => void;
  fetchUseTradeStats: (chainId: string | number, walletProvider: any | undefined, account: string | undefined) => void;
  fetchOrderBook: (walletProvider: any) => void;  
  placeLimitOrder: (walletProvider: any, params: LimitOrderParam) => void;
}

// Context varsayılan değeri
const defaultContext: SwapContextProps = {
  selectedPair: null,
  setSelectedPair: () => { },
  userTradingStats: null,
  setUserTradingStats: () => { },
  canAggregatorSwap: false,
  swapResult: null,
  canSwap: false,
  isSwapping: false,
  fromAmount: '',
  isClaimLoading: false,
  setIsClaimLoading: () => { },
  toAmount: '',
  tradeInfo: null,
  toggleDetails: false,
  baseReservePercent: new Percent(0, 0),
  quoteReservePercent: new Percent(0, 0),
  totalReservePercent: new Percent(0, 0),
  baseReserveAmount: undefined,
  quoteReserveAmount: undefined,
  priceImpactWarningSeverity: 0,
  loading: false,
  aggregatorPairs: [],
  removeLiquidityPercent: 100,
  claimedRewardsLoading: false,
  setClaimedRewardsLoading: () => { },
  claimModal: {
    status: 'none',
    message: '',
    visible: false,
  },
  setClaimModal: () => { },

  bountiesInfo: {
    loaded: false,
    bounties: [],
    bountyUserInfo: null,
    totalClaimed: 0n,
  },
  fetchBountiesInfo: () => { },
  setBountiesInfo: () => { },

  claimedRewards: [],
  setClaimedRewards: () => { },

  jackpotInfo: {
    receivers: [],
    jackpotAmount: 0n,
    isLoaded: false,
  },
  setJackpotInfo: () => { },
  fetchJackPotInfo: (walletProvider: any, limit:number) => { },

  setRemoveLiquidityPercent: () => { },
  handleAggregatorSwap: () => { },
  setAggregatorPairs: () => { },
  setLoading: () => { },
  setFromAmount: () => { },
  setToAmount: () => { },
  handleFromChange: () => { },
  handleToChange: () => { },
  setToggleDetails: () => { },
  handleSwap: (walleProvider: any) => { },
  setCanAggregatorSwap: () => { },
  handleBundleSwap: () => { },
  // Diğer varsayılan değerler...
  pairState: initialPairState,
  setPairState: () => { },
  handleAddLiquidity: () => { },
  handleRemoveLiquidity: () => { },
  fetchLiquidityInfo: () => { },
  fetchUseTradeStats: () => { },
  fetchClaimedRewards: () => { },
  handleClaimedRewards: () => { },
  orderBook: {
    maxBuyTotal: 0n,
    maxSellTotal: 0n,
    loading: false,
    buy: [],
    sell: []
  },
  setOrderBook: () => { },  
  fetchOrderBook: () => { },
  placeLimitOrder: () => { },
};

// Context oluşturma
const SwapContext = createContext<SwapContextProps>(defaultContext);

export enum SwapStatusType {
  SUCCESS = "SUCCESS",
  APPROVAL_FAILED = "APPROVAL_FAILED",
  APPROVAL_REQUIRED = "APPROVAL_REQUIRED",
  PLEASE_WAIT = "PLEASE WAIT",
  INVALID_ACCOUNT = "INVALID_ACCOUNT",
  LIQUIDITY_REMOVE_FAILED = "LIQUIDITY_REMOVE_FAILED",
  INSUFFICIENT_ALLOWANCE = "INSUFFICIENT_ALLOWANCE",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  SLIPPAGE_TOO_HIGH = "SLIPPAGE_TOO_HIGH",
  PRICE_IMPACT_TOO_HIGH = "PRICE_IMPACT_TOO_HIGH",
  INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY",
  TOKEN_NOT_SUPPORTED = "TOKEN_NOT_SUPPORTED",
  INVALID_ADDRESS = "INVALID_ADDRESS",
  NETWORK_ERROR = "NETWORK_ERROR",
  ACCOUNT_NOT_CONNECTED = "ACCOUNT_NOT_CONNECTED",
  USER_REJECTED = "USER_REJECTED",
  CONTRACT_ERROR = "CONTRACT_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INVALID_CHAIN = "INVALID_CHAIN",
  INVALID_TOKEN = "INVALID_TOKEN",
  INVALID_AMOUNT = "INVALID_AMOUNT",
  INVALID_SLIPPAGE = "INVALID_SLIPPAGE",
  INVALID_DEADLINE = "INVALID_DEADLINE",
  INVALID_PATH = "INVALID_PATH",
  INVALID_TRADE_TYPE = "INVALID_TRADE_TYPE",
}



export interface BountyInfo {
  valid: boolean;
  canUserClaim: boolean;
  bountyId: bigint;
  bountyType: BOUNTY_TYPE;
  rewardAmount: bigint;
  tokenAmount: bigint;
  totalClaims: bigint;
  createdAt: bigint;
  nextReward: bigint;
  userAvailableReward: bigint;
  userTotalReward: bigint;
  userLastClaimDate: bigint;
  verifyParam: bigint; // lp kLast parametresi
  bountyName: string;
  bountyDescription: string;
  bountyToken: `0x${string}`; // ethers v6 tipi için
}

export interface BountyUserInfo {
  valid: boolean;
  registered: boolean;
  userId: bigint;
  lastaccess: bigint;
  total: bigint;
  wallet: `0x${string}`;
  referral: `0x${string}`;
  avatar: string;
  cover: string;
  name: string;
  bio: string;
  twitter: string;
  telegram: string;
  instagram: string;
  youtube: string;
  facebook: string;
  discord: string;
  tiktok: string;
  website: string;
  geohash: string;
  followers: `0x${string}`[];   // array of addresses
  followings: `0x${string}`[];
  referrals: `0x${string}`[];
}

export interface SwapError {
  type: SwapStatusType;
  message: string;
  details?: string;       // Daha teknik bilgi (örneğin hata kodu, tx hash, vs.)
  timestamp?: number;     // Hata zamanı (opsiyonel)
  context?: any;          // Ek bağlam verisi (örneğin tradeInfo, chainId vs.)
}

export interface SwapSuccess {
  type: SwapStatusType;
  txHash: string;
  amountIn: string;
  amountOut: string;
  tokenIn: Token;
  tokenOut: Token;
  timestamp: number;
  explorerUrl?: string;
}

export interface SwapParam {
  amountIn: any;
  amountOut: any;
  weth9: string; // Address type represented as a string
  wrapper: string;
  pair: string;
  input: string;
  flag: boolean;
}

export interface Router {
  router: string; // Address type
  weth: string;   // Address type
}

export interface PairInfo {
  valid: boolean;
  flag: boolean;
  reserve0: bigint;
  reserve1: bigint;
  amount0Out: bigint;
  amount1Out: bigint;
  token0Decimals: bigint;
  token1Decimals: bigint;
  token0: string; // Address type or a reference to an IERC20 interface
  token1: string; // Address type or a reference to an IERC20 interface
  pair: string;   // Address type or a reference to an IPAIR interface
  router: string; // Address type
  weth: string;   // Address type
}

export interface PairInput {
  flag: boolean;
  router: string; // Address type
  pair: string;   // Address type
  input: string;  // Address type
  weth: string;   // Address type
  amount: bigint;
}


export interface TCustomPair {
  pair: PairInfo; // Pair bilgileri
  isSelected: boolean; // Seçim durumu
  trade: any;
  baseLiqudity: any;
  quoteLiquidity: any
  exchangeInfo: any;
  outputAmount: string;
  baseReservePercent: Percent;
  quoteReservePercent: Percent;
  totalReservePercent: Percent;
  warningSeverity: number;
  warningSeverityText: string;
};


interface TPairState {
  pairInfo: any; // Gerçek tip PairInfo varsa onunla değiştir
  userLiquidity: any;
  totalLiquidity: any;
  basePrice: any;
  quotePrice: any;
  baseReservePercent: any;
  quoteReservePercent: any;
  totalReservePercent: any;
  baseLiquidity: any;
  quoteLiquidity: any;
  userBaseLiquidity: any;
  userQuoteLiquidity: any;
  shareOfPool: any;
  noLiquidity: boolean;
  liquidityValueA: CurrencyAmount<Token> | undefined;
  liquidityValueB: CurrencyAmount<Token> | undefined;
  userBaseLiquidityRaw: CurrencyAmount<Token> | undefined;
  userQuoteLiquidityRaw: CurrencyAmount<Token> | undefined;
  userLiquidityRaw: CurrencyAmount<Token> | undefined;
  totalLiquidityRaw: CurrencyAmount<Token> | undefined;
}


/** LIMIT ORDER PROTOCOL */

export interface PriceLevel {//contract
  price: bigint;
  baseLiquidity: bigint;
  quoteLiquidity: bigint;

  head: bigint;
  tail: bigint;
  orderCount: bigint;

  nextTickPrice: bigint;
  prevTickPrice: bigint;

  sequence: bigint;

  exists: boolean;
}

export interface PriceLevelOrderBook {//ui
  price: bigint;
  baseLiquidity: bigint;
  quoteLiquidity: bigint;

  head: bigint;
  tail: bigint;
  orderCount: bigint;

  nextTickPrice: bigint;
  prevTickPrice: bigint;

  total:bigint;
  amount:bigint;

  sequence: bigint;

  exists: boolean;
}

export interface OrderBook {
  buy: PriceLevelOrderBook[];
  sell: PriceLevelOrderBook[];
  loading: boolean;
  maxBuyTotal:bigint;
  maxSellTotal:bigint;
}

export enum OrderKind {
  BUY_LIMIT = 0,
  BUY_MARKET = 1,
  SELL_LIMIT = 2,
  SELL_MARKET = 3,
  BUY_STOP_LOSS = 4,
  BUY_STOP_LIMIT = 5,
  BUY_TAKE_PROFIT = 6,
  BUY_TAKE_PROFIT_LIMIT = 7,
  SELL_STOP_LOSS = 8,
  SELL_STOP_LIMIT = 9,
  SELL_TAKE_PROFIT = 10,
  SELL_TAKE_PROFIT_LIMIT = 11
}

export interface LimitOrderParam {
  kind: OrderKind;
  token0: string;        // Ethereum adresi olduğu için string
  token1: string;
  price: bigint;         // uint256 için bigint uygun
  amount: bigint;
  ticks: bigint[];       // uint256[] dizisi için bigint[]
}

export interface TokenPair {
  base: TokenContextToken;
  quote: TokenContextToken;
  symbol: string; // örn: BTC/USDT
  pair:string;
  isFavorite:boolean;
  price:string;
  change:string;
  volume:string;
  logo:string;
}

export interface TradeItemProps {
  pair: TCustomPair,
};

export type SwapResult = SwapSuccess | SwapError;
// Custom hook
export const useSwapContext = () => useContext(SwapContext);

// Provider bileşeni
interface SwapProviderProps {
  children: ReactNode;
}

export const SwapProvider: React.FC<SwapProviderProps> = ({ children }) => {
  // State tanımlamaları burada...
  const {
    account,
    baseToken,
    quoteToken,
    tradeType,
    enableTaxesContract,
    setTradeType,
    tokens,
    setTokens,
    swapMode,
    riskTolerance,
  } = useTokenContext();
  const { chainId } = useAppKitNetwork();

  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [tradeInfo, setTradeInfo] = useState<Trade<Token, Token, TradeType> | null>(null);
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [baseReservePercent, setBaseReservePercent] = useState<Percent>(new Percent(0, 0));
  const [quoteReservePercent, setQuoteReservePercent] = useState<Percent>(new Percent(0, 0));
  const [totalReservePercent, setTotalReservePercent] = useState<Percent>(new Percent(0, 0));
  const [baseReserveAmount, setBaseReserveAmount] = useState<CurrencyAmount<Token> | undefined>(undefined);
  const [quoteReserveAmount, setQuoteReserveAmount] = useState<CurrencyAmount<Token> | undefined>(undefined);
  const [priceImpactWarningSeverity, setPriceImpactWarningSeverity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [canSwap, setCanSwap] = useState<boolean>(false);
  const [canAggregatorSwap, setCanAggregatorSwap] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null);
  const [aggregatorPairs, setAggregatorPairs] = useState<TCustomPair[]>([]);
  const [pairState, setPairState] = useState<TPairState>(initialPairState);
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState<number>(100);
  const [bountiesInfo, setBountiesInfo] = useState<any>({
    loaded: false,
    bounties: [],
    bountyUserInfo: null
  });
  const [claimedRewards, setClaimedRewards] = useState<any[]>([]);
  const [claimedRewardsLoading, setClaimedRewardsLoading] = useState<boolean>(false);
  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);
  const [claimModal, setClaimModal] = useState<ClaimModalState>({
    status: 'none',
    message: '',
    visible: false,
  });
  const [jackpotInfo, setJackpotInfo] = useState<JackpotInfoResult>({
    receivers: [],
    jackpotAmount: 0n,
    isLoaded: false,
  });
  const [orderBook, setOrderBook] = useState<OrderBook>({
    buy: [],
    sell: [],
    maxBuyTotal:0n,
    maxSellTotal:0n,  
    loading: false,
  });
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);


  const [userTradingStats, setUserTradingStats] = useState<UserTradingStats | null>(null);
  // Input değişiklikleri için handler'lar
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    let value = e.target.value.replace(",", ".")
    if (regex.test(value)) {
      setTradeType(TradeType.EXACT_INPUT)
      setFromAmount(value);
    }
    if (value == "") {
      setToAmount("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    let value = e.target.value.replace(",", ".")
    if (regex.test(value)) {
      setTradeType(TradeType.EXACT_OUTPUT)
      setToAmount(value);
    }
    if (value == "") {
      setFromAmount("");
    }
  };


  const resetSwap = () => {
    setTradeInfo(null);
    setCanSwap(false);
    setIsSwapping(false);
    setFromAmount("");
    setToAmount("");


    if (swapMode == SWAP_MODE.AGGREGATOR) {
      setAggregatorPairs([]);

    }
  }


  const fetchSwapPairInfo = async () => {
    setCanSwap(false);
    setSwapResult(null);
    if (!chainId) {
      resetSwap();
      return null;
    }
    if (!baseToken || !quoteToken) {
      resetSwap();
      return null;
    }

    if (tradeType == TradeType.EXACT_INPUT) {
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setToAmount("");
        setTradeInfo(null);
        return null;
      }
    } else if (tradeType == TradeType.EXACT_OUTPUT) {
      if (!toAmount || parseFloat(toAmount) <= 0) {
        setFromAmount("");
        setTradeInfo(null);
        return null;
      }
    }


    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;

    let _baseAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    let _quoteAddress = quoteToken.address == ZeroAddress ? WRAPPED_TOKEN : quoteToken.address;


    let dexContract = await getContractByName(TContractType.DEX, Number(chainId));


    const _pairInfo: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'getPairInfo',
      args: [_baseAddress, _quoteAddress],
      account: account ? ethers.getAddress(account) as `0x${string}` : undefined,
    })

    if (!_pairInfo) {
      resetSwap();
      return null;
    }

    if (!_pairInfo.valid) {
      setSwapResult({
        type: SwapStatusType.INVALID_PATH,
        message: "Invalid Pair",
        context: {
          baseToken: baseToken,
          quoteToken: quoteToken,
        }
      })
      return null;
    }


    if (_pairInfo.reserveBase <= MINIMUM_LIQUIDITY || _pairInfo.reserveQuote <= MINIMUM_LIQUIDITY) {
      setSwapResult({
        type: SwapStatusType.INSUFFICIENT_LIQUIDITY,
        message: "Insufficient Liquidity",
        context: {
          baseToken: baseToken,
          quoteToken: quoteToken,
        }
      })
      resetSwap();
      return null;
    }

    const _baseToken = new Token(baseToken.chainId, _baseAddress, baseToken.decimals, baseToken.symbol, baseToken.name)
    const _quoteToken = new Token(quoteToken.chainId, _quoteAddress, quoteToken.decimals, quoteToken.symbol, quoteToken.name)

    const [_baseTokenReserve, _quoteTokenReserve] = _pairInfo.base.token == _baseAddress ? [_pairInfo.reserveBase, _pairInfo.reserveQuote] : [_pairInfo.reserveQuote, _pairInfo.reserveBase]

    const _baseReserveAmount = CurrencyAmount.fromRawAmount(_baseToken, JSBI.BigInt(_baseTokenReserve.toString()))
    const _quoteReserveAmount = CurrencyAmount.fromRawAmount(_quoteToken, JSBI.BigInt(_quoteTokenReserve.toString()))
    setBaseReserveAmount(_baseReserveAmount);
    setQuoteReserveAmount(_quoteReserveAmount);

    const base = JSBI.BigInt(_baseReserveAmount.quotient.toString())
    const quote = JSBI.BigInt(_quoteReserveAmount.quotient.toString())
    const total = JSBI.add(base, quote)
    setBaseReservePercent(new Percent(base, total))
    setQuoteReservePercent(new Percent(quote, total))



    const exchangePair = new Pair(
      _baseReserveAmount,
      _quoteReserveAmount,
      _pairInfo.pair
    )



    let inputAmount = tradeType == TradeType.EXACT_INPUT ? fromAmount : toAmount;
    let inputDecimals = tradeType == TradeType.EXACT_INPUT ? _baseToken.decimals : _quoteToken.decimals;
    let inputToken = tradeType == TradeType.EXACT_INPUT ? _baseToken : _quoteToken;

    const tradeAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(ethers.parseUnits(inputAmount, inputDecimals).toString()));

    let _tradeInfo = new Trade(
      new Route([exchangePair], _baseToken, _quoteToken),
      CurrencyAmount.fromRawAmount(inputToken, tradeAmount.quotient),
      tradeType
    )

    if (tradeType == TradeType.EXACT_INPUT) {
      setToAmount(_tradeInfo.outputAmount.toSignificant());

    } else if (tradeType == TradeType.EXACT_OUTPUT) {
      setFromAmount(_tradeInfo.inputAmount.toSignificant());
    }

    setPriceImpactWarningSeverity(warningSeverity(_tradeInfo.priceImpact));
    setTradeInfo(_tradeInfo);

    if (parseFloat(_tradeInfo.priceImpact.toFixed(2)) <= riskTolerance) {
      setCanSwap(true);
    } else {
      setSwapResult({
        type: SwapStatusType.PRICE_IMPACT_TOO_HIGH,
        message: "Price Impact Too High",
        context: {
          priceImpact: _tradeInfo.priceImpact.toString(),
        }
      })
      setCanSwap(false);
    }
  }



  const fetchBountiesInfo = async (walletProvider: any) => {
    setBountiesInfo({
      loaded: false,
      bounties: [],
      bountyUserInfo: null,
      totalClaimed: 0n,
    })
    let userAccount = account ? account : ethers.ZeroAddress;



    let dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);
    const [signerAccount] = await dexContract.wallet.getAddresses();


    const [_bounties, _bountyUserInfo] = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'fetchBountiesInfo',
      args: [signerAccount ? signerAccount : userAccount],
    }) as [BountyInfo[], BountyUserInfo];

    const totalUserReward = _bounties.reduce((acc, bounty) => {
      return acc + BigInt(bounty.userTotalReward);
    }, 0n);

    let _bountiesInfo = {
      loaded: true,
      bounties: _bounties,
      bountyUserInfo: _bountyUserInfo,
      totalClaimed: formatEther(totalUserReward),
    }

    console.log("ersan _bountiesInfo", _bountiesInfo,account)
    setBountiesInfo(_bountiesInfo)
  }

  const handleSwap = async (walletProvider: any) => {
    if (!tradeInfo) {
      setSwapResult({
        type: SwapStatusType.INVALID_TRADE_TYPE,
        message: "Invalid Trade Type",
      })
      return;
    }

    if (!account) {
      setSwapResult({
        type: SwapStatusType.INVALID_ACCOUNT,
        message: "Invalid Account",
      })
      return;
    }

    if (!chainId) {
      setSwapResult({
        type: SwapStatusType.INVALID_CHAIN,
        message: "Invalid Chain",
      })
      return;
    }

    if (!baseToken || !quoteToken) {
      setSwapResult({
        type: SwapStatusType.INVALID_TOKEN,
        message: "Invalid Token",
      })
      return;
    }

    setIsSwapping(true);

    let dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);
    const etherIn = baseToken.address === ZeroAddress
    const etherOut = quoteToken.address === ZeroAddress


    const DEFAULT_ADD_SLIPPAGE_TOLERANCE = new Percent(INITIAL_ALLOWED_SLIPPAGE, 10_000)


    const amountIn: string = toHex(tradeInfo.inputAmount)
    const amountOut: string = toHex(tradeInfo.outputAmount)
    const amountInMax: string = toHex(tradeInfo.maximumAmountIn(DEFAULT_ADD_SLIPPAGE_TOLERANCE))
    const amountOutMin: string = toHex(tradeInfo.minimumAmountOut(DEFAULT_ADD_SLIPPAGE_TOLERANCE))
    const addressTo: string = account;
    let overrides = {
      value: etherIn ? BigInt(tradeInfo.maximumAmountIn(DEFAULT_ADD_SLIPPAGE_TOLERANCE).quotient.toString()) : undefined,
    }
    const deadline = moment().utc().unix() + (DEFAULT_DEADLINE_FROM_NOW)
    const path: string[] = tradeInfo.route.path.map((token: Token) => token.address)


    var functionName: string = "";
    var swapParameters: any[] = [];
    if (tradeInfo.tradeType === TradeType.EXACT_INPUT) {
      if (etherIn) {
        functionName = enableTaxesContract
          ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
          : "swapExactETHForTokens";

        swapParameters = enableTaxesContract ? [amountOutMin, path, addressTo, deadline] : [amountOutMin, path, addressTo, deadline]
      } else if (etherOut) {
        functionName = enableTaxesContract
          ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
          : "swapExactTokensForETH";

        swapParameters = enableTaxesContract ? [amountIn, amountOutMin, path, addressTo, deadline] : [amountIn, amountOutMin, path, addressTo, deadline]
      } else {
        functionName = enableTaxesContract
          ? "swapExactTokensForTokensSupportingFeeOnTransferTokens"
          : "swapExactTokensForTokens";
        swapParameters = enableTaxesContract ? [amountIn, amountOutMin, path, addressTo, deadline] : [amountIn, amountOutMin, path, addressTo, deadline]
      }
    } else if (tradeInfo.tradeType === TradeType.EXACT_OUTPUT) {
      if (etherIn) {
        functionName = "swapETHForExactTokens"; // No tax-supporting variant exists
        swapParameters = [amountOut, path, addressTo, deadline]
      } else if (etherOut) {
        functionName = "swapTokensForExactETH";
        swapParameters = [amountOut, amountInMax, path, addressTo, deadline]
      } else {
        functionName = "swapTokensForExactTokens";
        swapParameters = [amountOut, amountInMax, path, addressTo, deadline]
      }
    }


    const [signerAccount] = await dexContract.wallet.getAddresses();

    try {


      if (baseToken.address != ZeroAddress) {
        const tokenContract = getContract({
          address: baseToken.address as `0x${string}`,
          abi: erc20Abi,
          client: dexContract.client
        })

        const allowance = await tokenContract.read.allowance([
          signerAccount,
          dexContract.caller.address
        ])

        if (allowance < BigInt(tradeInfo.inputAmount.quotient.toString())) {


          const approvalTx = await dexContract.wallet.writeContract({
            chain: dexContract.client.chain,
            address: baseToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [dexContract.address, ethers.MaxUint256],
            account: signerAccount
          })
          const receiptApproval = await waitForTransactionReceipt(dexContract.wallet, {
            hash: approvalTx,
          });
          console.log("receiptApproval", receiptApproval)
        }
      }



      const tx: any = await dexContract.wallet.writeContract({
        chain: dexContract.client.chain,
        address: dexContract.caller.address as `0x${string}`,
        abi: dexContract.abi,
        functionName: functionName,
        args: swapParameters,
        account: signerAccount,
        value: overrides.value
      })

      const receipt = await waitForTransactionReceipt(dexContract.wallet, {
        hash: tx,
      });
      console.log("receipt", receipt)

      setSwapResult({
        type: SwapStatusType.SUCCESS,
        message: "Swap Success",
        context: {
          baseToken: baseToken,
          quoteToken: quoteToken,
          txHash: tx.hash,
          amountIn: tradeInfo.inputAmount.toSignificant(),
          amountOut: tradeInfo.outputAmount.toSignificant(),
        }
      })

    } catch (error) {
      const message = error?.toString() || "Unexpected error";
      let errorType: SwapStatusType = SwapStatusType.UNKNOWN_ERROR;
      if (message.includes("insufficient funds")) {
        errorType = SwapStatusType.INSUFFICIENT_FUNDS;
      } else if (message.includes("slippage")) {
        errorType = SwapStatusType.SLIPPAGE_TOO_HIGH;
      } else if (message.includes("user rejected")) {
        errorType = SwapStatusType.USER_REJECTED;
      } else if (message.includes("invalid address")) {
        errorType = SwapStatusType.INVALID_ADDRESS;
      } else if (message.includes("network")) {
        errorType = SwapStatusType.NETWORK_ERROR;
      }
      setSwapResult({
        type: errorType,
        message: "Contract Error",
        context: {
          error: error,
        }
      })
      console.log("error", error)
    } finally {
      setIsSwapping(false);
      resetSwap();
    }

    await fetchBalances(chainId, signerAccount, walletProvider, tokens, setTokens)





  }

  useEffect(() => {
    console.log("ersan swapMode", swapMode)
    if (swapMode == SWAP_MODE.SIMPLESWAP) {
      fetchSwapPairInfo();
    } else if (swapMode == SWAP_MODE.AGGREGATOR) {
      fetchAggregatorInfo();
    } else if ([SWAP_MODE.POOLS, SWAP_MODE.ADD_LIQUIDITY, SWAP_MODE.REMOVE_LIQUIDITY].includes(swapMode)) {
      console.log("ersan fetchLiquidityInfo")
      fetchLiquidityInfo(null);
    }
  }, [baseToken, quoteToken, fromAmount, toAmount, tradeType]);


  const fetchAggregatorInfo = async () => {
    console.log("fetchAggregatorInfo")
    setCanAggregatorSwap(false);
    setSwapResult(null);
    setAggregatorPairs([]);
    if (!chainId) {
      resetSwap();
      return null;
    }
    if (!baseToken || !quoteToken) {
      resetSwap();
      return null;
    }

    if (tradeType == TradeType.EXACT_INPUT) {
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setToAmount("");
        setTradeInfo(null);
        return null;
      }
    } else if (tradeType == TradeType.EXACT_OUTPUT) {
      if (!toAmount || parseFloat(toAmount) <= 0) {
        setFromAmount("");
        setTradeInfo(null);
        return null;
      }
    }





    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;
    const FANTOKENWrapper = CHILIZWRAPPER[Number(chainId)].address


    let _baseTokenAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    let _quoteTokenAddress = quoteToken.address == ZeroAddress ? WRAPPED_TOKEN : quoteToken.address;

    const _baseToken = new Token(baseToken.chainId, _baseTokenAddress, baseToken.decimals, baseToken.symbol, baseToken.name)
    const _quoteToken = new Token(quoteToken.chainId, _quoteTokenAddress, quoteToken.decimals, quoteToken.symbol, quoteToken.name)


    const tradeAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(_baseToken, JSBI.BigInt(ethers.parseUnits(fromAmount, _baseToken.decimals).toString()));

    let dexContract = await getContractByName(TContractType.DEX, Number(chainId));
    const routers = getRoutersByChainId(Number(chainId));
    console.log("tradingPairs", account)

    const _tradingPairs: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'fetchPairs',
      args: [routers, FANTOKENWrapper, _baseToken.address, _quoteToken.address, toHex(tradeAmount)],
      account: account ? ethers.getAddress(account) as `0x${string}` : undefined,
    })

    const seenPairs = new Set<string>();
    const _validPairs = _tradingPairs.filter((pair: any) => {
      if (!pair.valid || seenPairs.has(pair.pair)) return false;
      if (JSBI.lessThanOrEqual(JSBI.BigInt(pair.reserve0.toString()), JSBI.BigInt(MINIMUM_LIQUIDITY)) || JSBI.lessThanOrEqual(JSBI.BigInt(pair.reserve1.toString()), JSBI.BigInt(MINIMUM_LIQUIDITY))) {
        return false;
      }
      seenPairs.add(pair.pair);
      return true;
    });

    console.log("validPairs", _validPairs)
    const customPairs: TCustomPair[] = []; // Custom pair dizisi oluşturuluyor

    for (const pair of _validPairs) {

      let _selectedBaseAddress = (baseToken.address === ZeroAddress || baseToken.address === ETHER_ADDRESS) ? pair.weth : baseToken.address
      let _selectedQuoteAddress = (quoteToken.address === ZeroAddress || quoteToken.address === ETHER_ADDRESS) ? pair.weth : quoteToken.address
      let selectedBase: any
      let selectedQuote: any

      if (_selectedBaseAddress == pair.weth) {
        [selectedBase, selectedQuote] = _selectedBaseAddress == pair.token0 ? [pair.token0, pair.token1] : [pair.token1, pair.token0]
      } else if (_selectedQuoteAddress == pair.weth) {
        [selectedBase, selectedQuote] = _selectedQuoteAddress == pair.token0 ? [pair.token1, pair.token0] : [pair.token0, pair.token1]
      } else {
        [selectedBase, selectedQuote] = [_selectedBaseAddress, _selectedQuoteAddress]
      }


      let _baseAddress = ethers.getAddress(selectedBase);
      let _quoteAddress = ethers.getAddress(selectedQuote);

      let _baseDecimals = Number(pair.token0 == _baseAddress ? pair.token0Decimals : pair.token1Decimals)
      let _quoteDecimals = Number(pair.token1 == _quoteAddress ? pair.token1Decimals : pair.token0Decimals)
      const baseTokenEntity = new Token(baseToken.chainId, _baseAddress, _baseDecimals, baseToken.symbol)
      const quoteTokenEntity = new Token(quoteToken.chainId, _quoteAddress, _quoteDecimals, quoteToken.symbol)
      const [baseReserve, quoteReserve] = _baseAddress == pair.token0 ? [pair.reserve0, pair.reserve1] : [pair.reserve1, pair.reserve0]


      let _checkBaseLiquidty = CurrencyAmount.fromRawAmount(baseTokenEntity, baseReserve.toString())
      let _checkQuuteLiquidity = CurrencyAmount.fromRawAmount(quoteTokenEntity, quoteReserve.toString())


      if (JSBI.lessThanOrEqual(_checkBaseLiquidty.quotient, MINIMUM_LIQUIDITY)) {
        continue;
      }

      if (JSBI.lessThanOrEqual(_checkQuuteLiquidity.quotient, MINIMUM_LIQUIDITY)) {
        continue;
      }

      const exchangePair = new Pair(
        CurrencyAmount.fromRawAmount(baseTokenEntity, baseReserve.toString()),
        CurrencyAmount.fromRawAmount(quoteTokenEntity, quoteReserve.toString()), pair.pair)

      const baseAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(baseTokenEntity, JSBI.BigInt(ethers.parseUnits(fromAmount, Number(_baseDecimals)).toString()));

      let _tradeInfo = new Trade(
        new Route([exchangePair], baseTokenEntity, quoteTokenEntity),
        CurrencyAmount.fromRawAmount(baseTokenEntity, baseAmount.quotient),
        TradeType.EXACT_INPUT
      )

      let _baseLiquidity = CurrencyAmount.fromRawAmount(baseTokenEntity, baseReserve.toString())
      let _quoteLiquidity = CurrencyAmount.fromRawAmount(quoteTokenEntity, quoteReserve.toString())

      const DEFAULT_ADD_SLIPPAGE_TOLERANCE = new Percent(INITIAL_ALLOWED_SLIPPAGE, 10_000)
      const amountOutSlippage = _tradeInfo.minimumAmountOut(DEFAULT_ADD_SLIPPAGE_TOLERANCE)



      let outputAmount = amountOutSlippage.toSignificant(6)

      const base = JSBI.BigInt(_baseLiquidity.quotient.toString())
      const quote = JSBI.BigInt(_quoteLiquidity.quotient.toString())
      const total = JSBI.add(base, quote)

      let exchangeInfo = getExchangeByRouterAndWETH(pair.router, pair.weth, Number(chainId))

      if (parseFloat(_tradeInfo.priceImpact.toFixed(2)) <= riskTolerance) {
        customPairs.push({
          pair: pair,
          isSelected: false,
          trade: _tradeInfo,
          baseLiqudity: _baseLiquidity,
          quoteLiquidity: _quoteLiquidity,
          exchangeInfo: exchangeInfo,
          outputAmount: outputAmount,
          baseReservePercent: new Percent(base, total),
          quoteReservePercent: new Percent(quote, total),
          totalReservePercent: new Percent(total, total),
          warningSeverity: warningSeverity(_tradeInfo.priceImpact),
          warningSeverityText: warningSeverityText(warningSeverity(_tradeInfo.priceImpact))
        })

      }




    }
    setAggregatorPairs(customPairs)

  }

  useEffect(() => {
    const selectedPairs = aggregatorPairs.filter(pair => pair.isSelected);
    if (selectedPairs.length > 0) {
      setCanAggregatorSwap(true);
    } else {
      setCanAggregatorSwap(false);
    }
  }, [aggregatorPairs])



  const handleAggregatorSwap = async (walletProvider: any) => {
    console.log("handleAggregatorSwap")
    if (!account) {
      setSwapResult({
        type: SwapStatusType.INVALID_ACCOUNT,
        message: "Invalid Account",
      })
      return;
    }

    if (!chainId) {
      setSwapResult({
        type: SwapStatusType.INVALID_CHAIN,
        message: "Invalid Chain",
      })
      return;
    }

    if (!baseToken || !quoteToken) {
      setSwapResult({
        type: SwapStatusType.INVALID_TOKEN,
        message: "Invalid Token",
      })
      return;
    }

    if (aggregatorPairs.length == 0) {
      setSwapResult({
        type: SwapStatusType.INVALID_PATH,
        message: "Invalid Path",
      })
      return;
    }

    const selectedPairs = aggregatorPairs.filter(pair => pair.isSelected);
    if (selectedPairs.length == 0) {
      setSwapResult({
        type: SwapStatusType.INVALID_PATH,
        message: "Invalid Path",
      })
      return;
    }

    setIsSwapping(true);
    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;
    let _baseTokenAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    const _baseToken = new Token(baseToken.chainId, _baseTokenAddress, baseToken.decimals, baseToken.symbol, baseToken.name)

    const tradeAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(_baseToken, JSBI.BigInt(ethers.parseUnits(fromAmount, _baseToken.decimals).toString()));


    const FANTOKENWrapper = CHILIZWRAPPER[Number(chainId)].address






    //setIsSwapping(true);

    const allSwapParams: SwapParam[] = [];



    let dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);
    const etherIn = baseToken.address === ZeroAddress
    const etherOut = quoteToken.address === ZeroAddress

    let DEPOSIT_AMOUNT = ethers.parseUnits(fromAmount, _baseToken.decimals)
    let DEPOSIT_AMOUNT_TOTAL = DEPOSIT_AMOUNT * BigInt(selectedPairs.length)
    let overrides = {
      value: etherIn ? DEPOSIT_AMOUNT_TOTAL : 0n,
    }

    for (const pair of selectedPairs) {
      let outputAmount = JSBI.greaterThan(JSBI.BigInt(pair.pair.amount0Out.toString()), JSBI.BigInt(0)) ? pair.pair.amount0Out : pair.pair.amount1Out

      let INPUT_TOKEN = etherIn ? pair.pair.weth : baseToken.address;
      let swapParam = {
        amountIn: ethers.parseUnits(fromAmount, _baseToken.decimals),
        amountOut: outputAmount,
        weth9: pair.pair.weth,
        wrapper: FANTOKENWrapper,
        pair: pair.pair.pair,
        input: INPUT_TOKEN,
        flag: pair.pair.flag
      }
      allSwapParams.push(swapParam)

    }

    const [signerAccount] = await dexContract.wallet.getAddresses();

    try {
      if (!etherIn) {
        const tokenContract = getContract({
          address: baseToken.address as `0x${string}`,
          abi: erc20Abi,
          client: dexContract.client
        })

        const allowance = await tokenContract.read.allowance([
          signerAccount,
          dexContract.caller.address
        ])

        if (allowance < DEPOSIT_AMOUNT_TOTAL) {


          const approvalTx = await dexContract.wallet.writeContract({
            chain: dexContract.client.chain,
            address: baseToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [dexContract.address, ethers.MaxUint256],
            account: signerAccount
          })
          const receiptApproval = await waitForTransactionReceipt(dexContract.wallet, {
            hash: approvalTx,
          });
          console.log("receiptApproval", receiptApproval)
        }
      }

      const tx: any = await dexContract.wallet.writeContract({
        chain: dexContract.client.chain,
        address: dexContract.caller.address as `0x${string}`,
        abi: dexContract.abi,
        functionName: "swapAll",
        args: [allSwapParams],
        account: signerAccount,
        value: overrides.value
      })

      const receipt = await waitForTransactionReceipt(dexContract.wallet, {
        hash: tx,
      });
      setSwapResult({
        type: SwapStatusType.SUCCESS,
        message: "Swap Success",
        context: {
          baseToken: baseToken,
          quoteToken: quoteToken,
          txHash: tx.hash,
          amountIn: formatEther(DEPOSIT_AMOUNT_TOTAL),
          amountOut: "0",
        }
      })
    } catch (error) {
      const message = error?.toString() || "Unexpected error";
      let errorType: SwapStatusType = SwapStatusType.UNKNOWN_ERROR;
      if (message.includes("insufficient funds")) {
        errorType = SwapStatusType.INSUFFICIENT_FUNDS;
      } else if (message.includes("slippage")) {
        errorType = SwapStatusType.SLIPPAGE_TOO_HIGH;
      } else if (message.includes("user rejected")) {
        errorType = SwapStatusType.USER_REJECTED;
      } else if (message.includes("invalid address")) {
        errorType = SwapStatusType.INVALID_ADDRESS;
      } else if (message.includes("network")) {
        errorType = SwapStatusType.NETWORK_ERROR;
      }
      setSwapResult({
        type: errorType,
        message: "Contract Error",
        context: {
          error: error,
        }
      })
    } finally {
      setIsSwapping(false);
      resetSwap();
    }
    await fetchBalances(chainId, signerAccount, walletProvider, tokens, setTokens)

  }

  const handleBundleSwap = async (walletProvider: any, fanTokens: any[]) => {
    console.log("handleBundleSwap", tokens)

    if (!chainId) {
      resetSwap();
      return null;
    }

    const totalInvestment = parseFloat(fromAmount || "0");
    const depositAmount = fanTokens.length > 0 ? (totalInvestment / fanTokens.length).toFixed(6) : "0";


    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;
    const FANTOKENWrapper = CHILIZWRAPPER[Number(chainId)].address
    const allSwapParams: SwapParam[] = [];

    let dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);

    let pairsAddressList: any[] = []
    fanTokens.forEach(token => {
      const pair: any = token.pair
      if (pair != ethers.ZeroAddress) {
        pairsAddressList.push(pair)
        console.log("Pair Aliniyor..", token.symbol, pair)
      }
    });

    const pairs: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'getReservesByPairAddresses',
      args: [pairsAddressList],
      account: account ? ethers.getAddress(account) as `0x${string}` : undefined,
    })

    if (pairs.length == 0) {
      setSwapResult({
        type: SwapStatusType.INVALID_PATH,
        message: "Invalid Path",
      })
      return;
    }
    setIsSwapping(true)


    for (const pair of pairs) {
      const token0 = new Token(
        Number(chainId), // Chain ID
        pair.token0,
        Number(pair.token0Decimals),
        'TOKEN0',
        'Token0'
      );

      const token1 = new Token(
        Number(chainId), // Chain ID
        pair.token1,
        Number(pair.token1Decimals),
        'TOKEN1',
        'Token1'
      );


      var side = pair.token0 == WRAPPED_TOKEN

      const [tokenA, tokenB]: [Token, Token] = side
        ? [token0, token1]
        : [token1, token0];
      const [reserveA, reserveB] = side
        ? [pair.reserve0, pair.reserve1]
        : [pair.reserve1, pair.reserve0];


      const exchangePair = new Pair(
        CurrencyAmount.fromRawAmount(tokenA, reserveA.toString()),
        CurrencyAmount.fromRawAmount(tokenB, reserveB.toString()),
        pair.pair
      )


      const inputOutputToken = tokenA



      const baseAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(inputOutputToken, JSBI.BigInt(ethers.parseUnits(depositAmount, Number(18)).toString()));

      let _tradeInfo = new Trade(
        new Route([exchangePair], tokenA, tokenB),
        CurrencyAmount.fromRawAmount(inputOutputToken, baseAmount.quotient),
        TradeType.EXACT_INPUT
      )


      const DEFAULT_ADD_SLIPPAGE_TOLERANCE = new Percent(INITIAL_ALLOWED_SLIPPAGE, 10_000)

      if (parseFloat(_tradeInfo.priceImpact.toFixed(2)) > riskTolerance) {
        //skip
        continue;
      }


      const amountIn: string = toHex(_tradeInfo.maximumAmountIn(DEFAULT_ADD_SLIPPAGE_TOLERANCE))
      const amountOut: string = toHex(_tradeInfo.outputAmount)
      const amountOutMin: string = toHex(_tradeInfo.minimumAmountOut(DEFAULT_ADD_SLIPPAGE_TOLERANCE))


      let swapParam: SwapParam = {
        amountIn: amountIn,
        amountOut: amountOutMin,
        weth9: WRAPPED_TOKEN,
        wrapper: FANTOKENWrapper,
        pair: pair.pair,
        input: WRAPPED_TOKEN,
        flag: false
      }

      allSwapParams.push(swapParam)



    }


    if (allSwapParams.length == 0) {
      setSwapResult({
        type: SwapStatusType.INVALID_PATH,
        message: "Invalid Path",
      })
      setIsSwapping(false)
      return;
    }

    let fee = parseEther("10")
    let overrides = {
      value: fee + parseEther(totalInvestment.toString())
    }

    const [signerAccount] = await dexContract.wallet.getAddresses();

    try {


      const tx: any = await dexContract.wallet.writeContract({
        chain: dexContract.client.chain,
        address: dexContract.caller.address as `0x${string}`,
        abi: dexContract.abi,
        functionName: "swapAll",
        args: [allSwapParams],
        account: signerAccount,
        value: overrides.value
      })

      const receipt = await waitForTransactionReceipt(dexContract.wallet, {
        hash: tx,
      });
      setSwapResult({
        type: SwapStatusType.SUCCESS,
        message: "Swap Success",
        context: {
          baseToken: baseToken,
          quoteToken: quoteToken,
          txHash: tx.hash,
          amountIn: formatEther(overrides.value),
          amountOut: "0",
        }
      })
    } catch (error) {
      const message = error?.toString() || "Unexpected error";
      let errorType: SwapStatusType = SwapStatusType.UNKNOWN_ERROR;
      if (message.includes("insufficient funds")) {
        errorType = SwapStatusType.INSUFFICIENT_FUNDS;
      } else if (message.includes("slippage")) {
        errorType = SwapStatusType.SLIPPAGE_TOO_HIGH;
      } else if (message.includes("user rejected")) {
        errorType = SwapStatusType.USER_REJECTED;
      } else if (message.includes("invalid address")) {
        errorType = SwapStatusType.INVALID_ADDRESS;
      } else if (message.includes("network")) {
        errorType = SwapStatusType.NETWORK_ERROR;
      }
      setSwapResult({
        type: errorType,
        message: "Contract Error",
        context: {
          error: error,
        }
      })
    } finally {
      setIsSwapping(false);
      resetSwap();
    }
    await fetchBalances(chainId, signerAccount, walletProvider, tokens, setTokens)



  }

  const fetchLiquidityInfo = async (walletProvider: any) => {
    setLoading(true)
    setCanSwap(false)
    if (!chainId) {
      setSwapResult({
        type: SwapStatusType.INVALID_CHAIN,
        message: "Invalid Chain",
      })
      setLoading(false)
      setCanSwap(false)
      return;
    }
    if (baseToken == null || quoteToken == null) {
      setSwapResult({
        type: SwapStatusType.INVALID_TOKEN,
        message: "Invalid Token",
      })
      setLoading(false)
      setCanSwap(false)
      return;
    }

    if ([SWAP_MODE.POOLS, SWAP_MODE.ADD_LIQUIDITY].includes(swapMode) && tradeType == TradeType.EXACT_INPUT && !fromAmount) {
      setSwapResult({
        type: SwapStatusType.INVALID_AMOUNT,
        message: "Invalid Amount",
      })
      setLoading(false)
      setCanSwap(false)
      return;
    }
    if ([SWAP_MODE.POOLS, SWAP_MODE.ADD_LIQUIDITY].includes(swapMode) && tradeType == TradeType.EXACT_OUTPUT && !toAmount) {
      setSwapResult({
        type: SwapStatusType.INVALID_AMOUNT,
        message: "Invalid Amount",
      })
      setLoading(false)
      setCanSwap(false)
      return;
    }



    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;

    let _baseAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    let _quoteAddress = quoteToken.address == ZeroAddress ? WRAPPED_TOKEN : quoteToken.address;

    let dexContract = await getContractByName(TContractType.DEX, Number(chainId));


    const _pairInfo: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'getPairInfo',
      args: [_baseAddress, _quoteAddress],
      account: account ? ethers.getAddress(account) as `0x${string}` : undefined
    })

    console.log("ersan _pairInfo", _pairInfo)

    if (!_pairInfo || !_pairInfo.valid) {
      setPairState({
        pairInfo: null,
        userLiquidity: "0.0000",
        totalLiquidity: "0.0000",
        basePrice: "0.0000",
        quotePrice: "0.0000",
        baseLiquidity: "0.0000",
        quoteLiquidity: "0.0000",
        userBaseLiquidity: "0.00000",
        userQuoteLiquidity: "0.0000",
        baseReservePercent: "0.00",
        quoteReservePercent: "0.00",
        totalReservePercent: "0.00",
        shareOfPool: "100",
        noLiquidity: true,
        userBaseLiquidityRaw: undefined,
        userQuoteLiquidityRaw: undefined,
        userLiquidityRaw: undefined,
        totalLiquidityRaw: undefined,
        liquidityValueA: undefined,
        liquidityValueB: undefined,
      });
      setLoading(false)
      setCanSwap(true)
      return null;
    }

    const pairAddress = _pairInfo.pair;
    const liquidityToken: Token = new Token(Number(chainId), pairAddress, 18, "PAIR", "PAIR", false)

    const tokenA = new Token(Number(chainId), _baseAddress, baseToken.decimals)
    const tokenB = new Token(Number(chainId), _quoteAddress, quoteToken.decimals)

    const [lpbaseToken, lpquoteToken] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    const [_reserve0, _reserve1] = [_pairInfo.reserveBase, _pairInfo.reserveQuote]
    let noLiquidity = _reserve0 === 0 && _reserve1 === 0

    if (noLiquidity) {
      setPairState({
        pairInfo: null,
        userLiquidity: "0.0000",
        totalLiquidity: "0.0000",
        basePrice: "0.0000",
        quotePrice: "0.0000",
        baseLiquidity: "0.0000",
        quoteLiquidity: "0.0000",
        userBaseLiquidity: "0.00000",
        userQuoteLiquidity: "0.0000",
        baseReservePercent: "0.00",
        quoteReservePercent: "0.00",
        totalReservePercent: "0.00",
        shareOfPool: "100",
        noLiquidity: true,
        userBaseLiquidityRaw: undefined,
        userQuoteLiquidityRaw: undefined,
        userLiquidityRaw: undefined,
        totalLiquidityRaw: undefined,
        liquidityValueA: undefined,
        liquidityValueB: undefined,
      });
      setLoading(false)
      setCanSwap(true)
      return
    }

    let abiERC = dexContract.pair;
    let abiInterfaceParam = new ethers.Interface(abiERC);
    let multicallParams = [
      {
        target: _pairInfo.pair,
        callData: abiInterfaceParam.encodeFunctionData('balanceOf', [account ? account : KEWL_DEPLOYER_ADDRESS])
      },
      {
        target: _pairInfo.pair,
        callData: abiInterfaceParam.encodeFunctionData('kLast', [])
      },
      {
        target: _pairInfo.pair,
        callData: abiInterfaceParam.encodeFunctionData('totalSupply', [])
      }
    ]

    var _userLPBalance: any
    var _kLast: any
    var _lpTotalSupply: any

    try {
      const multicallResult: any = await dexContract.client.readContract({
        address: dexContract.caller.address,
        abi: dexContract.abi,
        functionName: 'aggregate',
        args: [multicallParams],
        account: account ? ethers.getAddress(account) as `0x${string}` : KEWL_DEPLOYER_ADDRESS,
      })

      const abiCoder = AbiCoder.defaultAbiCoder();
      if (multicallResult && multicallResult.length > 0) {
        [_userLPBalance] = abiCoder.decode(["uint256"], multicallResult[1][0]);
        [_kLast] = abiCoder.decode(["uint256"], multicallResult[1][1]);
        [_lpTotalSupply] = abiCoder.decode(["uint256"], multicallResult[1][2]);
      }
    } catch (error) {
      console.log("Error", error)
      setSwapResult({
        type: SwapStatusType.ACCOUNT_NOT_CONNECTED,
        message: "Account Not Connected",
      })
      setLoading(false)
      setCanSwap(true)
      return;
    }

    let _userLiquidityAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(liquidityToken, JSBI.BigInt(_userLPBalance.toString()));
    let _totalLiquidityAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(liquidityToken, JSBI.BigInt(_lpTotalSupply.toString()));


    const price = new Price(lpbaseToken, lpquoteToken, JSBI.BigInt(_reserve0.toString()), JSBI.BigInt(_reserve1.toString()))
    let totalSupply: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(liquidityToken, JSBI.BigInt(_lpTotalSupply.toString()));

    const canInvertPrice = Boolean(price && price.baseCurrency && price.quoteCurrency && !price.baseCurrency.equals(price.quoteCurrency))

    const _basePrice = price?.toSignificant(6)
    const _quotePrice = canInvertPrice ? price?.invert()?.toSignificant(6) : undefined


    let reserve0: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(lpbaseToken, JSBI.BigInt(_reserve0.toString()));
    let reserve1: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(lpquoteToken, JSBI.BigInt(_reserve1.toString()));
    const [baseReserve, quoteReserve] = lpbaseToken.sortsBefore(lpquoteToken) ? [reserve0, reserve1] : [reserve1, reserve0]


    const exchangePair = new Pair(
      baseReserve,
      quoteReserve,
      liquidityToken.address
    )

    const liquidityValueA =
      exchangePair &&
        _totalLiquidityAmount &&
        _userLiquidityAmount &&
        baseToken &&
        JSBI.greaterThanOrEqual(_totalLiquidityAmount.quotient, _userLiquidityAmount.quotient)
        ? CurrencyAmount.fromRawAmount(lpbaseToken, exchangePair.getLiquidityValue(lpbaseToken, _totalLiquidityAmount, _userLiquidityAmount, SWAP_FEE_ON, JSBI.BigInt(_kLast.toString())).quotient)
        : undefined


    const liquidityValueB =
      exchangePair &&
        _totalLiquidityAmount &&
        _userLiquidityAmount &&
        lpquoteToken &&
        JSBI.greaterThanOrEqual(_totalLiquidityAmount.quotient, _userLiquidityAmount.quotient)
        ? CurrencyAmount.fromRawAmount(lpquoteToken, exchangePair.getLiquidityValue(lpquoteToken, _totalLiquidityAmount, _userLiquidityAmount, SWAP_FEE_ON, JSBI.BigInt(_kLast.toString())).quotient)
        : undefined



    const inputAmount = tradeType == TradeType.EXACT_INPUT ? fromAmount : toAmount
    const inputToken =
      tradeType === TradeType.EXACT_INPUT
        ? _baseAddress === lpbaseToken.address
          ? lpbaseToken
          : lpquoteToken
        : _quoteAddress === lpquoteToken.address
          ? lpquoteToken
          : lpbaseToken;


    let shareOfPool: string = "0"
    if (inputAmount) {
      const calculatedAmount: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(ethers.parseUnits(inputAmount, inputToken.decimals).toString()));
      const isBaseMatch = lpbaseToken.address === _baseAddress;
      const isQuoteMatch = lpquoteToken.address === _quoteAddress;

      const quotedAmount = (tradeType === TradeType.EXACT_INPUT)
        ? (isBaseMatch ? price.quote(calculatedAmount) : price.invert().quote(calculatedAmount))
        : (isQuoteMatch ? price.invert().quote(calculatedAmount) : price.quote(calculatedAmount));

      (tradeType === TradeType.EXACT_INPUT)
        ? setToAmount(quotedAmount.toSignificant(6))
        : setFromAmount(quotedAmount.toSignificant(6));


      let tokenAmountA: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(tokenA, JSBI.BigInt(calculatedAmount.quotient));
      let tokenAmountB: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(tokenB, JSBI.BigInt(quotedAmount.quotient));
      const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
        ? [tokenAmountA, tokenAmountB]
        : [tokenAmountB, tokenAmountA]
      let liquidity: JSBI
      if (JSBI.equal(totalSupply.quotient, ZERO)) {
        liquidity = JSBI.subtract(
          sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)),
          MINIMUM_LIQUIDITY
        )
      } else {
        const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), reserve0.quotient)
        const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), reserve1.quotient)
        liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
      }
      if (!JSBI.greaterThan(liquidity, ZERO)) {
        shareOfPool = "0"
      } else {
        let liquidityMinted: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(liquidityToken, liquidity)
        if (liquidityMinted && totalSupply) {
          const poolTokenPercentage = new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient)
          let percentShare = noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
          shareOfPool = percentShare
        } else {
          shareOfPool = "0"
        }
      }

    }


    const base = JSBI.BigInt(baseReserve.quotient.toString())
    const quote = JSBI.BigInt(quoteReserve.quotient.toString())
    const total = JSBI.add(base, quote)

    setPairState(prev => ({
      ...prev,
      pairInfo: _pairInfo,
      basePrice: _baseAddress === lpbaseToken.address ? _basePrice : _quotePrice,
      quotePrice: _quoteAddress === lpquoteToken.address ? _quotePrice : _basePrice,
      baseLiquidity: _baseAddress === lpbaseToken.address ? baseReserve.toSignificant(6) : quoteReserve.toSignificant(6),
      quoteLiquidity: _quoteAddress === lpquoteToken.address ? quoteReserve.toSignificant(6) : baseReserve.toSignificant(6),
      userBaseLiquidity: _baseAddress === lpbaseToken.address ? liquidityValueA?.toSignificant(6) : liquidityValueB?.toSignificant(6),
      userQuoteLiquidity: _quoteAddress === lpquoteToken.address ? liquidityValueB?.toSignificant(6) : liquidityValueA?.toSignificant(6),
      userBaseLiquidityRaw: _baseAddress === lpbaseToken.address ? liquidityValueA : liquidityValueB,
      userQuoteLiquidityRaw: _quoteAddress === lpquoteToken.address ? liquidityValueB : liquidityValueA,
      liquidityValueA: liquidityValueA,
      liquidityValueB: liquidityValueB,
      baseReservePercent: new Percent(base, total).toFixed(2),
      quoteReservePercent: new Percent(quote, total).toFixed(2),
      totalReservePercent: new Percent(total, total).toFixed(2),
      totalLiquidity: totalSupply.toSignificant(6),
      totalLiquidityRaw: totalSupply,
      userLiquidity: _userLiquidityAmount.toSignificant(6),
      userLiquidityRaw: _userLiquidityAmount,
      shareOfPool: shareOfPool,
      noLiquidity: false,
    }));
    setLoading(false)
    setCanSwap(true)

  }


  const handleAddLiquidity = async (walletProvider: any) => {
    console.log("handleAddLiquidity", walletProvider)

    if (!chainId) {
      setSwapResult({
        type: SwapStatusType.INVALID_CHAIN,
        message: "Invalid Chain",
      })
      return;
    }

    if (baseToken == null || quoteToken == null) {
      setSwapResult({
        type: SwapStatusType.INVALID_TOKEN,
        message: "Invalid Token",
      })
      return;
    }

    if (fromAmount == null || toAmount == null) {
      setSwapResult({
        type: SwapStatusType.INVALID_AMOUNT,
        message: "Invalid Amount",
      })
      return;
    }
    setIsSwapping(true)

    let WRAPPED_TOKEN = ethers.getAddress(WETH9[Number(chainId)].address);

    let _baseAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    let _quoteAddress = quoteToken.address == ZeroAddress ? WRAPPED_TOKEN : quoteToken.address;

    let dexContract = await getContractByName(TContractType.DEX, Number(chainId));

    const [signerAccount] = await dexContract.wallet.getAddresses();

    const etherIn = baseToken.address == ZeroAddress
    const etherOut = quoteToken.address == ZeroAddress


    const ZERO_PERCENT = new Percent('0')
    const DEFAULT_ADD_SLIPPAGE_TOLERANCE = new Percent(INITIAL_ALLOWED_SLIPPAGE, 10_000)


    const tokenA = new Token(baseToken.chainId, _baseAddress, baseToken.decimals, baseToken.symbol, baseToken.name)
    const tokenB = new Token(quoteToken.chainId, _quoteAddress, quoteToken.decimals, quoteToken.symbol, quoteToken.name)

    const [baseAsset, quoteAsset] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    const [baseInputAmount, quoteInputAmount] = tokenA.sortsBefore(tokenB)
      ? [fromAmount, toAmount]
      : [toAmount, fromAmount];

    const amountADesired = ethers.parseUnits(baseInputAmount, baseAsset.decimals);
    const amountBDesired = ethers.parseUnits(quoteInputAmount, quoteAsset.decimals);


    let reserve0: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(baseAsset, amountADesired.toString());
    let reserve1: CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(quoteAsset, amountBDesired.toString());

    const amountAIndex = 0//tradeType === TradeType.EXACT_OUTPUT ? 1 : 0;
    const amountBIndex = 0//tradeType === TradeType.EXACT_OUTPUT ? 1 : 0;

    const amountAMin = calculateSlippageAmount(reserve0, pairState.noLiquidity ? ZERO_PERCENT : DEFAULT_ADD_SLIPPAGE_TOLERANCE)[amountAIndex].toString()
    const amountBMin = calculateSlippageAmount(reserve1, pairState.noLiquidity ? ZERO_PERCENT : DEFAULT_ADD_SLIPPAGE_TOLERANCE)[amountBIndex].toString();
    const addressTo = signerAccount
    const deadline = moment().utc().unix() + (30 * 60)

    if (baseToken.address != ZeroAddress) {
      try {
        const tokenContract = getContract({
          address: baseToken.address as `0x${string}`,
          abi: erc20Abi,
          client: dexContract.client
        })

        const allowance = await tokenContract.read.allowance([
          signerAccount,
          dexContract.caller.address
        ])

        if (allowance < amountADesired) {

          const approvalTx = await dexContract.wallet.writeContract({
            chain: dexContract.client.chain,
            address: baseToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [dexContract.address, ethers.MaxUint256],
            account: signerAccount
          })
          const receiptApproval = await waitForTransactionReceipt(dexContract.wallet, {
            hash: approvalTx,
          });
          console.log("receiptApproval", receiptApproval)
        }
      } catch (error) {
        setSwapResult({
          type: SwapStatusType.APPROVAL_FAILED,
          message: "Approval Failed",
        })
        return;
      }
    }

    if (quoteToken.address != ZeroAddress) {
      try {
        const tokenContract = getContract({
          address: quoteToken.address as `0x${string}`,
          abi: erc20Abi,
          client: dexContract.client
        })

        const allowance = await tokenContract.read.allowance([
          signerAccount,
          dexContract.caller.address
        ])

        if (allowance < amountBDesired) {

          const approvalTx = await dexContract.wallet.writeContract({
            chain: dexContract.client.chain,
            address: quoteToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [dexContract.address, ethers.MaxUint256],
            account: signerAccount
          })
          const receiptApproval = await waitForTransactionReceipt(dexContract.wallet, {
            hash: approvalTx,
          });
          console.log("receiptApproval", receiptApproval)
        }
      } catch (error) {
        setSwapResult({
          type: SwapStatusType.APPROVAL_FAILED,
          message: "Approval Failed",
        })
        return;
      }
    }

    let functionName = etherIn || etherOut ? 'addLiquidityETH' : 'addLiquidity'

    let depositOverrides = {
      value: etherIn || etherOut ? (baseAsset.address === WRAPPED_TOKEN ? amountADesired : amountBDesired) : undefined
    }





    var swapParameters: any[] = []
    if (etherIn || etherOut) {

      const tokenAddress = baseAsset.address === WRAPPED_TOKEN ? quoteAsset.address : baseAsset.address;
      const _amountTokenDesired = baseAsset.address == tokenAddress ? amountADesired : amountBDesired;
      const _amountTokenMin = baseAsset.address == tokenAddress ? amountAMin : amountBMin;
      const _amountETHMin = baseAsset.address == tokenAddress ? amountBMin : amountAMin;

      console.log("tokenAddress", tokenAddress)
      console.log("_amountTokenDesired", _amountTokenDesired)
      console.log("_amountTokenMin", _amountTokenMin)
      console.log("_amountETHMin", _amountETHMin)

      swapParameters = [tokenAddress, _amountTokenDesired, _amountTokenMin, _amountETHMin, account, deadline]
    } else {

      console.log("baseAsset", baseAsset.symbol, amountADesired, baseInputAmount)
      console.log("quoteAsset", quoteAsset.symbol, amountBDesired, quoteInputAmount)
      console.log("_amountTokenDesired", (amountADesired))
      console.log("_amountTokenMin", (amountBDesired))
      console.log("amountAMin", (amountAMin))
      console.log("amountBMin", (amountBMin))

      swapParameters = [baseAsset.address, quoteAsset.address, amountADesired, amountBDesired, amountAMin, amountBMin, addressTo, deadline]
    }


    try {
      const tx: any = await dexContract.wallet.writeContract({
        chain: dexContract.client.chain,
        address: dexContract.caller.address as `0x${string}`,
        abi: dexContract.abi,
        functionName: functionName,
        args: swapParameters,
        account: signerAccount,
        value: depositOverrides.value
      })

      const receipt = await waitForTransactionReceipt(dexContract.wallet, {
        hash: tx,
      });
      console.log("receipt", receipt)
      setSwapResult({
        type: SwapStatusType.SUCCESS,
        message: "Liquidity Added",
      })
    } catch (error) {
      console.log("error", error)
      setSwapResult({
        type: SwapStatusType.ACCOUNT_NOT_CONNECTED,
        message: "Account Not Connected",
      })
    } finally {
      setIsSwapping(false)
      resetSwap()
      await fetchBalances(chainId, signerAccount, walletProvider, tokens, setTokens)
    }




  }

  const handleRemoveLiquidity = async (walletProvider: any) => {
    if (!chainId) {
      setSwapResult({
        type: SwapStatusType.INVALID_CHAIN,
        message: "Invalid Chain",
      })
      return;
    }

    if (baseToken == null || quoteToken == null) {
      setSwapResult({
        type: SwapStatusType.INVALID_TOKEN,
        message: "Invalid Token",
      })
      return;
    }


    setIsSwapping(true)

    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;

    let _baseAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    let _quoteAddress = quoteToken.address == ZeroAddress ? WRAPPED_TOKEN : quoteToken.address;

    let dexContract = await getContractByName(TContractType.DEX, Number(chainId));

    const [signerAccount] = await dexContract.wallet.getAddresses();

    const etherIn = baseToken.address == ZeroAddress
    const etherOut = quoteToken.address == ZeroAddress


    const ZERO_PERCENT = new Percent('0')
    const DEFAULT_ADD_SLIPPAGE_TOLERANCE = new Percent(INITIAL_ALLOWED_SLIPPAGE, 10_000)

    console.log("handleRemoveLiquidity", _baseAddress, _quoteAddress, pairState)

    const userLiquidity: CurrencyAmount<Token> | undefined = pairState.userLiquidityRaw
    const selectedPercent: Percent = new Percent(removeLiquidityPercent, 100); // örneğin %25
    let selectedLiquidityAmount: CurrencyAmount<Token> | undefined;

    if (!userLiquidity) {
      setSwapResult({
        type: SwapStatusType.INSUFFICIENT_LIQUIDITY,
        message: "Insufficient Liquidity",
      })
      return;
    }

    if (!pairState.liquidityValueB) {
      setSwapResult({
        type: SwapStatusType.INSUFFICIENT_LIQUIDITY,
        message: "Insufficient Liquidity",
      })
      return;
    }
    if (!pairState.liquidityValueA) {
      setSwapResult({
        type: SwapStatusType.INSUFFICIENT_LIQUIDITY,
        message: "Insufficient Liquidity",
      })
      return;
    }


    selectedLiquidityAmount = userLiquidity.multiply(selectedPercent);

    const [amountBase, amountQuote] = pairState.pairInfo.base.token === _baseAddress ? [pairState.liquidityValueA, pairState.liquidityValueB] : [pairState.liquidityValueB, pairState.liquidityValueA]

    const amountBasePercent = amountBase.multiply(selectedPercent)
    const amountQuotePercent = amountQuote.multiply(selectedPercent)

    var amountA, amountB;

    if (etherIn || etherOut) {
      [amountA, amountB] = _baseAddress === WRAPPED_TOKEN ? [amountQuotePercent, amountBasePercent] : [amountBasePercent, amountQuotePercent]
    } else {
      [amountA, amountB] = [amountBasePercent, amountQuotePercent]
    }
    //const [amountA,amountB] 
    console.log("token0", pairState.pairInfo.base.token, "token1", pairState.pairInfo.quote.token)
    console.log("amountA", amountA.toSignificant(6), "amountB", amountB.toSignificant(6))


    let liquidity = toHex(selectedLiquidityAmount)


    const amountAMinWithSlippage = calculateSlippageAmount(amountA, pairState.noLiquidity ? ZERO_PERCENT : DEFAULT_ADD_SLIPPAGE_TOLERANCE)[0]
    const amountBMinWithSlippage = calculateSlippageAmount(amountB, pairState.noLiquidity ? ZERO_PERCENT : DEFAULT_ADD_SLIPPAGE_TOLERANCE)[0]




    let amountAMin = enableTaxesContract ? ZERO : amountAMinWithSlippage
    let amountBMin = enableTaxesContract ? ZERO : amountBMinWithSlippage
    let to = signerAccount
    const tenMinutesInSeconds = 10 * 60; // 10 dakika saniye cinsinden
    const deadline = Math.ceil(Date.now() / 1000) + tenMinutesInSeconds;

    let functionName = etherIn || etherOut ? 'removeLiquidityETH' : 'removeLiquidity'
    let tokenAddress = _baseAddress === WRAPPED_TOKEN ? _quoteAddress : _baseAddress
    const swapParameters = etherIn || etherOut ?
      [tokenAddress, liquidity, amountAMin, amountBMin, to, deadline] :
      [_baseAddress, _quoteAddress, liquidity, amountAMin, amountBMin, to, deadline]

    try {
      const tokenContract = getContract({
        address: pairState.pairInfo.pair as `0x${string}`,
        abi: erc20Abi,
        client: dexContract.client
      })

      const allowance = await tokenContract.read.allowance([
        signerAccount,
        dexContract.caller.address
      ])

      if (JSBI.lessThan(JSBI.BigInt(allowance.toString()), selectedLiquidityAmount.quotient)) {

        const approvalTx = await dexContract.wallet.writeContract({
          chain: dexContract.client.chain,
          address: pairState.pairInfo.pair as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [dexContract.address, ethers.MaxUint256],
          account: signerAccount
        })
        const receiptApproval = await waitForTransactionReceipt(dexContract.wallet, {
          hash: approvalTx,
        });
        setSwapResult({
          type: SwapStatusType.SUCCESS,
          message: "Approval Succeed",
        })


      }

      const tx: any = await dexContract.wallet.writeContract({
        chain: dexContract.client.chain,
        address: dexContract.caller.address as `0x${string}`,
        abi: dexContract.abi,
        functionName: functionName,
        args: swapParameters,
        account: signerAccount,
        value: undefined
      })

      const receipt = await waitForTransactionReceipt(dexContract.wallet, {
        hash: tx,
      });

      console.log("receipt", receipt)
      setSwapResult({
        type: SwapStatusType.SUCCESS,
        message: "Liquidity Removed",
        txHash: receipt.transactionHash,
      })





    } catch (error) {
      console.log("error", error)
      setSwapResult({
        type: SwapStatusType.LIQUIDITY_REMOVE_FAILED,
        message: "Liquidity Remove Failed",
      })
    } finally {
      resetSwap()
      setIsSwapping(false)
      await fetchBalances(chainId, signerAccount, walletProvider, tokens, setTokens)
    }
  }

  const fetchClaimedRewards = async (walletProvider: any) => {
    setClaimedRewardsLoading(true);
    const dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);


    const latestBlock = await dexContract.client.getBlockNumber();
    const fromBlock = latestBlock > 5000n ? latestBlock - 5000n : 0n;

    const eventSignature = parseAbiItem('event RewardClaimed(address indexed user, uint8 bountyType, uint256 amount, uint256 timestamp)');
    const rewardClaimedAbi = {
      type: 'event',
      name: 'RewardClaimed',
      inputs: [
        { indexed: true, name: 'user', type: 'address' },
        { indexed: false, name: 'bountyType', type: 'uint256' },
        { indexed: false, name: 'rewardAmount', type: 'uint256' },
        { indexed: false, name: 'timestamp', type: 'uint256' },
      ],
    };

    const logs = await dexContract.client.getLogs({
      address: dexContract.address,
      event: eventSignature,
      fromBlock: fromBlock,
      toBlock: 'latest',
    });
    const simplifiedLogs = logs.map(log => {
      const parsed = decodeEventLog({
        abi: dexContract.abi,
        data: log.data,
        topics: log.topics,
      });
    
      type RewardClaimedEvent = {
        user: Address;
        bountyType: number;
        amount: bigint;
        timestamp: bigint;
      };
      
      const { user, bountyType, amount, timestamp } = parsed.args as unknown as RewardClaimedEvent;
      const date = new Date(Number(timestamp) * 1000); // milisaniyeye çevir
      
const formatted = date.toLocaleString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // 24 saat formatı için
  timeZone: 'UTC', // ya da 'Asia/Istanbul' gibi bir timezone
});
      return {
        user,
        bountyType,
        amount: amount,
        timestamp:formatted,
        proof:log.transactionHash,
        rewardType:BOUNTY_TYPE_ARRAY[bountyType]
      };
    });
    setClaimedRewards(simplifiedLogs.reverse())
    setClaimedRewardsLoading(false);
  }

  const fetchUseTradeStats = async (chainId: string | number, walletProvider: any | undefined, account: string | undefined) => {
    if (tokens.length == 0) {
      return;
    }
    var totalReward: any = 0
    var individualReward: any = 0

    let filteredTokensList = tokens.filter((item: any) => item.address !== ZeroAddress)
    var combinedList: any = []



    let dexContract = await getContractByName(TContractType.DEX, chainId, walletProvider);
    let addressList = filteredTokensList.map((item: any) => item.address);
    let accountAddress = account ? ethers.getAddress(account) as `0x${string}` : ETHER_ADDRESS
    const [signerAccount] = account ? await dexContract.wallet.getAddresses() : ZeroAddress;
    const [individualTrades, totaltrades]: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'getTradeStatsForMultipleTokens',
      args: [addressList, accountAddress],
      account: account ? ethers.getAddress(account) as `0x${string}` : KEWL_DEPLOYER_ADDRESS
    })



    combinedList = filteredTokensList.map((token: any, index: number) => {
      const [total, individual] = [individualTrades[index], totaltrades[index]]

      if (token.address == WETH9[Number(chainId)].address) {
        const rewardInEther = individual;
        individualReward = ethers.formatUnits(rewardInEther.toString(), 18);
      }

      return {
        token: token,
        totalTrades: ethers.formatUnits(total, token.decimals),
        individualTrades: ethers.formatUnits(individual, token.decimals)
      };
    });



    const _userTradingStats: UserTradingStats = {
      totalReward,
      individualReward,
      tradingStats: combinedList,
    };
    setUserTradingStats(_userTradingStats)
    console.log("tradeStats", combinedList)

  }

   const handleClaimedRewards = async (walletProvider: any, claimedRewards: BountyClaimParam) => {
    setIsClaimLoading(true)
    const dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);
    const [signerAccount] = await dexContract.wallet.getAddresses()


      try{
          await dexContract.client.simulateContract({
            chain: dexContract.client.chain,
            address: dexContract.caller.address as `0x${string}`,
            abi: dexContract.abi,
            functionName: "claimReward",
            args: [claimedRewards],
            account: signerAccount,
            value: 0n
          });

          // Eğer simülasyon başarılıysa, işlemi gönder:
          const tx = await dexContract.wallet.writeContract({
            chain: dexContract.client.chain,
            address: dexContract.caller.address as `0x${string}`,
            abi: dexContract.abi,
            functionName: "claimReward",
            args: [claimedRewards],
            account: signerAccount,
            value: 0n
          });
          const receipt = await waitForTransactionReceipt(dexContract.wallet, {
            hash: tx,
          });
          setClaimModal({
            message: 'Reward claimed successfully',
            status: 'success',
            visible: true,
          });
      
          console.log("receipt", receipt)
        
          console.log("Transaction sent:", tx);
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? ''
          // do something with `errorName`
          setClaimModal({
            status: 'error',
            message: errorName,
            visible: true,
          });
        }else if (revertError instanceof ContractFunctionExecutionError){
            setClaimModal({
              status: 'error',
              message: 'Contract function execution error',
              visible: true,
            });
        } else if(revertError instanceof UserRejectedRequestError){
          setClaimModal({
            status: 'error',
            message: 'User rejected the request',
            visible: true,
          });
        }else{
          setClaimModal({
            status: 'error',
            message: err.message,
            visible: true,
          });
        }
      }else{
        const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'An unknown error occurred';
    
        setClaimModal({
          status: 'error',
          message: errorMessage,
          visible: true,
        });
      }
    } finally {
      setIsClaimLoading(false)
      await fetchBountiesInfo(walletProvider)
      await fetchClaimedRewards(walletProvider)
    
    }

  

  }



  const fetchJackPotInfo = async (walletProvider: any, limit:number) => {
    const dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);    

    setJackpotInfo({
      receivers: [],
      jackpotAmount: 0n,
      isLoaded: false,
    })


    const _jackpotInfo: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'fetchJackPotInfo',
      args: [limit],
      account: account ? ethers.getAddress(account) as `0x${string}` : undefined,
    })

    console.log("limit", limit, "jackpotInfo", _jackpotInfo)

    setJackpotInfo({
      receivers: _jackpotInfo[0],
      jackpotAmount: _jackpotInfo[1],
      isLoaded: true,
    })
   
    
  }

  const fetchOrderBook = async (walletProvider: any) => {
    const dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);
    setOrderBook({
      loading: true,
      maxBuyTotal:0n,
      maxSellTotal:0n,  
      buy: [],
      sell: []
    });
    
    const limit = 100;
    const pairHash = "0x476fa95dd4b9e538daae00223eddea9a2d89d85c196266748cc1a1d0fddb7362";
    const _levels: any = await dexContract.client.readContract({
      address: dexContract.caller.address,
      abi: dexContract.abi,
      functionName: 'orderBook',
      args: [pairHash, limit],
      account: account ? ethers.getAddress(account) as `0x${string}` : undefined,
    }) as [PriceLevel[]]

    console.log("_gelenLevels", _levels)


    const mapOrderBookLevels = (levels: PriceLevel[]): OrderBook => {
      const buy: PriceLevelOrderBook[] = [];
      const sell: PriceLevelOrderBook[] = [];
    
      let buyTotal = 0n;
      let sellTotal = 0n;
    
      for (const level of levels) {
        if (!level.exists) continue;
    
        if (level.quoteLiquidity > 0n) {
          buyTotal += level.quoteLiquidity;
          buy.push({
            ...level,
            total: buyTotal,
            amount: level.quoteLiquidity
          });
        }
    
        if (level.baseLiquidity > 0n) {
          sellTotal += level.baseLiquidity;
          sell.push({
            ...level,
            total: sellTotal,
            amount: level.baseLiquidity
          });
        }
      }
      const maxSellTotal = sell.length > 0 ? sell[sell.length - 1].total : 1n;
      const maxBuyTotal = buy.length > 0 ? buy[buy.length - 1].total : 1n;
    
      return {
        loading: false,
        buy,
        sell,
        maxBuyTotal,
        maxSellTotal
      };
    };
    const _orderBook = mapOrderBookLevels(_levels)
    console.log("orderBook", _orderBook)
    setOrderBook(_orderBook)

    
      
     


   
  }

  const placeLimitOrder = async (walletProvider : any,params: LimitOrderParam) => {
    try{
    const dexContract = await getContractByName(TContractType.DEX, Number(chainId), walletProvider);

    const [signerAccount] = await dexContract.wallet.getAddresses()

    const tx: any = await dexContract.wallet.writeContract({
      chain: dexContract.client.chain,
      address: dexContract.caller.address as `0x${string}`,
      abi: dexContract.abi,
      functionName: "create",
      args: params as any,
      account: signerAccount,
      value: undefined
    })
    
    }catch(err){
      console.log("err", err)
    }finally{
      fetchOrderBook(walletProvider)
    }
  }
  
  
  
  // Context değeri
  const value: SwapContextProps = {
    isSwapping,
    canSwap,
    userTradingStats,
    setUserTradingStats,
    fromAmount,
    toAmount,
    tradeInfo,
    toggleDetails,
    swapResult,
    loading,
    pairState,
    removeLiquidityPercent,
    handleRemoveLiquidity,
    setRemoveLiquidityPercent,
    setPairState,
    setLoading,
    setFromAmount,
    setToAmount,
    handleFromChange,
    handleToChange,
    setToggleDetails,
    handleSwap,
    handleAggregatorSwap,
    baseReservePercent,
    quoteReservePercent,
    totalReservePercent,
    baseReserveAmount,
    quoteReserveAmount,
    priceImpactWarningSeverity,
    aggregatorPairs,
    setAggregatorPairs,
    canAggregatorSwap,
    setCanAggregatorSwap,
    handleBundleSwap,
    handleAddLiquidity,
    fetchLiquidityInfo,
    fetchUseTradeStats,

    bountiesInfo,
    setBountiesInfo,
    fetchBountiesInfo,
    fetchClaimedRewards,

    claimedRewards,
    setClaimedRewards,
    handleClaimedRewards,
    claimedRewardsLoading,
    setClaimedRewardsLoading,

    isClaimLoading,
    setIsClaimLoading,
    claimModal,
    setClaimModal,

    jackpotInfo,
    setJackpotInfo,
    fetchJackPotInfo,
    // Diğer değerler...

    orderBook,
    setOrderBook,
    fetchOrderBook,
    placeLimitOrder,
    selectedPair,
    setSelectedPair,
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};

export default SwapContext;

