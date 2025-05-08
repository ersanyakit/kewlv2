import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyAmount, Pair, Percent, Route, Token, Trade, WETH9 } from '../constants/entities';
import { MINIMUM_LIQUIDITY, TradeType } from '../constants/entities/utils/misc';
import { useTokenContext } from './TokenContext';
import { useAppKitNetwork } from '@reown/appkit/react';
import { ethers, ZeroAddress } from 'ethers';
import { getContractByName } from '../constants/contracts/contracts';
import { TContractType } from '../constants/contracts/addresses';
import JSBI from 'jsbi';

// Context için tip tanımı
interface SwapContextProps {
  // Diğer özellikler...
  toggleDetails: boolean;
  fromAmount: string;
  toAmount: string;
  tradeInfo: Trade<Token, Token, TradeType> | null;
  baseReservePercent: Percent;
  quoteReservePercent: Percent;
  baseReserveAmount:CurrencyAmount<Token> | null;
  quoteReserveAmount:CurrencyAmount<Token> | null;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  handleFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setToggleDetails: (toggleDetails: boolean) => void;
}

// Context varsayılan değeri
const defaultContext: SwapContextProps = {
  fromAmount: '',
  toAmount: '',
  tradeInfo: null,
  toggleDetails: false,
  baseReservePercent: new Percent(0, 0),
  quoteReservePercent: new Percent(0, 0), 
  baseReserveAmount:null,
  quoteReserveAmount:null,
  setFromAmount: () => {},
  setToAmount: () => {},
  handleFromChange: () => {},
  handleToChange: () => {},
  setToggleDetails: () => {},
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
    if(!chainId){
        setTradeInfo(null);
        return null;
    }
    if (!baseToken || !quoteToken) {
        setTradeInfo(null);
        return null;
    }

    if(tradeType == TradeType.EXACT_INPUT){
        if( fromAmount == ""){
            setToAmount("");
            setTradeInfo(null);
            return null;
        }   
    }else if(tradeType == TradeType.EXACT_OUTPUT){
        if( toAmount == ""){
            setFromAmount("");
            setTradeInfo(null);
            return null;
        }   
    }

 
    console.log("ersan chainId",chainId);

    console.log("ersan baseToken",baseToken);
    console.log("ersan quoteToken",quoteToken);
    console.log("ersan fromAmount",fromAmount);
    console.log("ersan toAmount",toAmount);
    console.log("ersan tradeType",tradeType);

    let WRAPPED_TOKEN = WETH9[Number(chainId)].address;

    let _baseAddress = baseToken.address == ZeroAddress ? WRAPPED_TOKEN : baseToken.address;
    let _quoteAddress = quoteToken.address == ZeroAddress ? WRAPPED_TOKEN : quoteToken.address;

  
    let dexContract = getContractByName(TContractType.DEX, Number(chainId));
 

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

 

//console.log('Base %:', basePercent.toFixed(2))
//console.log('Quote %:', quotePercent.toFixed(2))

    
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

    setTradeInfo(_tradeInfo);

  

    console.log("exchangePair",exchangePair)
      

    console.log("ersan _pairInfo",_tradeInfo);

    console.log("priceImpactFirst", _tradeInfo.priceImpact.toFixed(2));
    console.log("priceImpactNext", _tradeInfo.priceImpact.invert().toFixed(2));

    console.log("inputAmount", _tradeInfo.inputAmount.toSignificant());
    console.log("outputAmount", _tradeInfo.outputAmount.toSignificant());
    console.log("outputAmount22", _tradeInfo.outputAmount.toExact());

    console.log("executionPrice", _tradeInfo.executionPrice.toSignificant());
    console.log("executionPriceEx", _tradeInfo.executionPrice.invert().toSignificant());

  }

  useEffect(()=>{
    fetchPairInfo();
  },[baseToken,quoteToken,fromAmount,toAmount,tradeType]);
  
  
  

  


  // Context değeri
  const value: SwapContextProps = {
    fromAmount,
    toAmount,
    tradeInfo,
    toggleDetails,
    setFromAmount,
    setToAmount,
    handleFromChange,
    handleToChange,
    setToggleDetails,
    baseReservePercent,
    quoteReservePercent,  
    baseReserveAmount,
    quoteReserveAmount,
    // Diğer değerler...
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};

export default SwapContext;