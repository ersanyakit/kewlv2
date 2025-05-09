import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyAmount, Pair, Percent, Route, Token, Trade, WETH9 } from '../constants/entities';
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, MINIMUM_LIQUIDITY, TradeType } from '../constants/entities/utils/misc';
import { useTokenContext } from './TokenContext';
import { useAppKitNetwork } from '@reown/appkit/react';
import { ethers, parseEther, ZeroAddress } from 'ethers';
import { fetchBalances, getContractByName } from '../constants/contracts/contracts';
import { TContractType } from '../constants/contracts/addresses';
import JSBI from 'jsbi';
import { ALLOWED_PRICE_IMPACT_HIGH, ALLOWED_PRICE_IMPACT_MEDIUM, warningSeverity } from '../constants/entities/utils/calculateSlippageAmount';
import moment from 'moment';
import { toHex } from '../constants/entities/utils/computePriceImpact';
import { erc20Abi, getContract } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';

// Context için tip tanımı
interface SwapContextProps {
  // Diğer özellikler...
  swapResult: SwapResult | null;
  canSwap: boolean;
  isSwapping: boolean;
  toggleDetails: boolean;
  fromAmount: string;
  toAmount: string;
  loading: boolean;
  tradeInfo: Trade<Token, Token, TradeType> | null;
  baseReservePercent: Percent;
  quoteReservePercent: Percent;
  baseReserveAmount: CurrencyAmount<Token> | null;
  quoteReserveAmount: CurrencyAmount<Token> | null;
  priceImpactWarningSeverity: number;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setLoading: (loading: boolean) => void;
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setToggleDetails: (toggleDetails: boolean) => void;
  handleSwap: (walletProvider: any) => void;
}

// Context varsayılan değeri
const defaultContext: SwapContextProps = {
  swapResult: null,
  canSwap: false,
  isSwapping: false,
  fromAmount: '',
  toAmount: '',
  tradeInfo: null,
  toggleDetails: false,
  baseReservePercent: new Percent(0, 0),
  quoteReservePercent: new Percent(0, 0),
  baseReserveAmount: null,
  quoteReserveAmount: null,
  priceImpactWarningSeverity: 0,
  loading: false,
  setLoading: () => { },
  setFromAmount: () => { },
  setToAmount: () => { },
  handleFromChange: () => { },
  handleToChange: () => { },
  setToggleDetails: () => { },
  handleSwap: (walleProvider: any) => { },
  // Diğer varsayılan değerler...
};

// Context oluşturma
const SwapContext = createContext<SwapContextProps>(defaultContext);

export enum SwapStatusType {
  SUCCESS = "SUCCESS",
  INVALID_ACCOUNT = "INVALID_ACCOUNT",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  SLIPPAGE_TOO_HIGH = "SLIPPAGE_TOO_HIGH",
  PRICE_IMPACT_TOO_HIGH = "PRICE_IMPACT_TOO_HIGH",
  INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY",
  TOKEN_NOT_SUPPORTED = "TOKEN_NOT_SUPPORTED",
  INVALID_ADDRESS = "INVALID_ADDRESS",
  NETWORK_ERROR = "NETWORK_ERROR",
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
    setTokens
  } = useTokenContext();
  const { chainId } = useAppKitNetwork();

  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [tradeInfo, setTradeInfo] = useState<Trade<Token, Token, TradeType> | null>(null);
  const [toggleDetails, setToggleDetails] = useState<boolean>(false);
  const [baseReservePercent, setBaseReservePercent] = useState<Percent>(new Percent(0, 0));
  const [quoteReservePercent, setQuoteReservePercent] = useState<Percent>(new Percent(0, 0));
  const [baseReserveAmount, setBaseReserveAmount] = useState<CurrencyAmount<Token> | null>(null);
  const [quoteReserveAmount, setQuoteReserveAmount] = useState<CurrencyAmount<Token> | null>(null);
  const [priceImpactWarningSeverity, setPriceImpactWarningSeverity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [canSwap, setCanSwap] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null);
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
  }




  const fetchPairInfo = async () => {
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
      account: ethers.getAddress(account) as `0x${string}`,
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

    if (_tradeInfo.priceImpact.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
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


      if(baseToken.address != ZeroAddress){
        const tokenContract = getContract({
          address: baseToken.address as `0x${string}`,
          abi: erc20Abi,
          client: dexContract.client
        })
        
        const allowance = await tokenContract.read.allowance([
          signerAccount,
          dexContract.caller.address
        ])

        if(allowance < BigInt(tradeInfo.inputAmount.quotient.toString())){

        
        const approvalTx = await dexContract.wallet.writeContract({
            chain: dexContract.client.chain,
            address: baseToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [dexContract.address,ethers.MaxUint256],
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
        type: SwapStatusType.CONTRACT_ERROR,
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
 
    await fetchBalances(chainId,signerAccount,walletProvider, tokens,setTokens)





  }

  useEffect(() => {
    fetchPairInfo();
  }, [baseToken, quoteToken, fromAmount, toAmount, tradeType]);







  // Context değeri
  const value: SwapContextProps = {
    isSwapping,
    canSwap,
    fromAmount,
    toAmount,
    tradeInfo,
    toggleDetails,
    swapResult,
    loading,
    setLoading,
    setFromAmount,
    setToAmount,
    handleFromChange,
    handleToChange,
    setToggleDetails,
    handleSwap,
    baseReservePercent,
    quoteReservePercent,
    baseReserveAmount,
    quoteReserveAmount,
    priceImpactWarningSeverity,
    // Diğer değerler...
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};

export default SwapContext;
