import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyAmount, Pair, Percent, Route, Token, Trade, WETH9 } from '../constants/entities';
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, MINIMUM_LIQUIDITY, TradeType } from '../constants/entities/utils/misc';
import { useTokenContext } from './TokenContext';
import { useAppKitNetwork } from '@reown/appkit/react';
import { ethers, parseEther, ZeroAddress } from 'ethers';
import { getContractByName } from '../constants/contracts/contracts';
import { TContractType } from '../constants/contracts/addresses';
import JSBI from 'jsbi';
import { ALLOWED_PRICE_IMPACT_MEDIUM, warningSeverity } from '../constants/entities/utils/calculateSlippageAmount';
import moment from 'moment';
import { toHex } from '../constants/entities/utils/computePriceImpact';
import { s } from 'framer-motion/client';
import { writeContract } from 'viem/actions';
// Context için tip tanımı
interface SwapContextProps {
  // Diğer özellikler...
  canSwap: boolean;
  toggleDetails: boolean;
  fromAmount: string;
  toAmount: string;
  loading: boolean;
  tradeInfo: Trade<Token, Token, TradeType> | null;
  baseReservePercent: Percent;
  quoteReservePercent: Percent;
  baseReserveAmount:CurrencyAmount<Token> | null;
  quoteReserveAmount:CurrencyAmount<Token> | null;
  priceImpactWarningSeverity: number;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setLoading: (loading: boolean) => void;
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setToggleDetails: (toggleDetails: boolean) => void;
  handleSwap: (walletProvider:any) => void;
}

// Context varsayılan değeri
const defaultContext: SwapContextProps = {
  canSwap: false,
  fromAmount: '',
  toAmount: '',
  tradeInfo: null,
  toggleDetails: false,
  baseReservePercent: new Percent(0, 0),
  quoteReservePercent: new Percent(0, 0), 
  baseReserveAmount:null,
  quoteReserveAmount:null,
  priceImpactWarningSeverity:0,
  loading: false,
  setLoading: () => {},
  setFromAmount: () => {},
  setToAmount: () => {},
  handleFromChange: () => {},
  handleToChange: () => {},
  setToggleDetails: () => {},
  handleSwap: (walleProvider:any) => {},
  // Diğer varsayılan değerler...
};

// Context oluşturma
const SwapContext = createContext<SwapContextProps>(defaultContext);

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
  // Input değişiklikleri için handler'lar
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    let value = e.target.value.replace(",", ".")
    if (regex.test(value)) {
        setTradeType(TradeType.EXACT_INPUT)
        setFromAmount(value);
    }
    if(value == ""){
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
    if(value == ""){
      setFromAmount("");
    }
  };


  const fetchPairInfo = async () => {
    setCanSwap(false);
    if(!chainId){
        setTradeInfo(null);
        return null;
    }
    if (!baseToken || !quoteToken) {
        setTradeInfo(null);
        return null;
    }

    if(tradeType == TradeType.EXACT_INPUT){
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setToAmount("");
        setTradeInfo(null);
        return null;
      }
    }else if(tradeType == TradeType.EXACT_OUTPUT){
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
 

    const _pairInfo : any = await dexContract.client.readContract({
        address: dexContract.caller.address,
        abi: dexContract.abi,
        functionName: 'getPairInfo',
        args: [_baseAddress, _quoteAddress],
        account: ethers.getAddress(account) as `0x${string}`,
      })

      if(!_pairInfo){
        setTradeInfo(null);
        return null;
      }

      if(!_pairInfo.valid){
        setTradeInfo(null);
        return null;
      }
      
      if(_pairInfo.reserveBase <= MINIMUM_LIQUIDITY || _pairInfo.reserveQuote <= MINIMUM_LIQUIDITY){
        console.log("ersan _pairInfo.reserveBase",_pairInfo.reserveBase);
        setTradeInfo(null);
        return null;
      }

      const _baseToken = new Token(baseToken.chainId, _baseAddress, baseToken.decimals, baseToken.symbol,baseToken.name)
      const _quoteToken = new Token(quoteToken.chainId, _quoteAddress, quoteToken.decimals, quoteToken.symbol,quoteToken.name)

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

    const tradeAmount : CurrencyAmount<Token> = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(ethers.parseUnits(inputAmount, inputDecimals).toString()));
    
    let _tradeInfo = new Trade(
        new Route([exchangePair], _baseToken, _quoteToken),
        CurrencyAmount.fromRawAmount(inputToken, tradeAmount.quotient),
        tradeType
    )
    
    if(tradeType == TradeType.EXACT_INPUT){
        setToAmount(_tradeInfo.outputAmount.toSignificant());

    }else if(tradeType == TradeType.EXACT_OUTPUT){
        setFromAmount(_tradeInfo.inputAmount.toSignificant());
    }

    setPriceImpactWarningSeverity(warningSeverity(_tradeInfo.priceImpact));
    setTradeInfo(_tradeInfo);

    if(_tradeInfo.priceImpact.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)){
      setCanSwap(true);
    }else{
      setCanSwap(false);
    }
  }

  const handleSwap = async (walletProvider:any) => {
    if(!tradeInfo){
      return;
    }

    if(!account){
      return;
    }

    if(!chainId){
      return;
    }

    if(!baseToken || !quoteToken){
      return;
    }
    setLoading(true);


    let dexContract = await getContractByName(TContractType.DEX, Number(chainId),walletProvider );
    const etherIn = baseToken.address === ZeroAddress
    const etherOut = quoteToken.address === ZeroAddress


    const DEFAULT_ADD_SLIPPAGE_TOLERANCE = new Percent(INITIAL_ALLOWED_SLIPPAGE, 10_000)


    const amountIn: string = toHex(tradeInfo.inputAmount)
    const amountOut: string = toHex(tradeInfo.outputAmount)
    const amountInMax: string = toHex(tradeInfo.maximumAmountIn(DEFAULT_ADD_SLIPPAGE_TOLERANCE))
    const amountOutMin: string = toHex(tradeInfo.minimumAmountOut(DEFAULT_ADD_SLIPPAGE_TOLERANCE))
    const addressTo : string = account;
    let overrides = {
      value: etherIn ? BigInt(tradeInfo.maximumAmountIn(DEFAULT_ADD_SLIPPAGE_TOLERANCE).quotient.toString()) : undefined,
    }
    const deadline = moment().utc().unix() + (DEFAULT_DEADLINE_FROM_NOW)
    const path: string[] = tradeInfo.route.path.map((token: Token) => token.address)


    var functionName : string = "";
    var swapParameters : any[] = [];
    if (tradeInfo.tradeType === TradeType.EXACT_INPUT) {
      if (etherIn) {
        functionName = enableTaxesContract
          ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
          : "swapExactETHForTokens";

          swapParameters = enableTaxesContract ?[amountOutMin, path, addressTo, deadline]:[amountOutMin, path, addressTo, deadline]
      } else if (etherOut) {
        functionName = enableTaxesContract
          ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
          : "swapExactTokensForETH";

          swapParameters = enableTaxesContract ?[amountIn, amountOutMin, path, addressTo, deadline]:[amountIn, amountOutMin, path, addressTo, deadline]
      } else {
        functionName = enableTaxesContract
          ? "swapExactTokensForTokensSupportingFeeOnTransferTokens"
          : "swapExactTokensForTokens";
          swapParameters = enableTaxesContract ? [ amountIn,  amountOutMin,  path, addressTo,  deadline] : [ amountIn,  amountOutMin, path, addressTo, deadline]
      }
    } else if (tradeInfo.tradeType === TradeType.EXACT_OUTPUT) {
      if (etherIn) {
        functionName = "swapETHForExactTokens"; // No tax-supporting variant exists
        swapParameters = [ amountOut,  path, addressTo, deadline]
      } else if (etherOut) {
        functionName = "swapTokensForExactETH";
        swapParameters =[ amountOut,  amountInMax, path, addressTo, deadline]
      } else {
        functionName = "swapTokensForExactTokens";
        swapParameters = [amountOut, amountInMax, path, addressTo, deadline]
      }
    }

  
    const [signerAccount] = await dexContract.wallet.getAddresses();
 
     const tx : any = await dexContract.wallet.writeContract({
      chain: dexContract.client.chain,
      address: dexContract.caller.address as `0x${string}`,
      abi: dexContract.abi,
      functionName: functionName,
      args: swapParameters,
      account:signerAccount,
      value:overrides.value
    })

    console.log("returnValue",tx)
    setLoading(false);

  
    

  }

  useEffect(()=>{
    fetchPairInfo();
  },[baseToken,quoteToken,fromAmount,toAmount,tradeType]);
  
  
  

  


  // Context değeri
  const value: SwapContextProps = {
    canSwap,
    fromAmount,
    toAmount,
    tradeInfo,
    toggleDetails,
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
