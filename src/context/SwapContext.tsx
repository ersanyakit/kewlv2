import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Token, Trade, WETH9 } from '../constants/entities';
import { MINIMUM_LIQUIDITY, TradeType } from '../constants/entities/utils/misc';
import { useTokenContext } from './TokenContext';
import { useAppKitNetwork } from '@reown/appkit/react';
import { ethers, ZeroAddress } from 'ethers';
import { getContractByName } from '../constants/contracts/contracts';
import { TContractType } from '../constants/contracts/addresses';

// Context için tip tanımı
interface SwapContextProps {
  getSimpleSwapTradeInfo: () => Trade<Token, Token, TradeType> | null;
  // Diğer özellikler...
}

// Context varsayılan değeri
const defaultContext: SwapContextProps = {
  getSimpleSwapTradeInfo: () => null,
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
    fromAmount,
    toAmount,
    tradeType,
  } = useTokenContext();
  const { chainId } = useAppKitNetwork();

  const fetchPairInfo = async () => {
    if (!baseToken || !quoteToken) {
        return null;
    }

    console.log("ersan baseToken",baseToken);
    console.log("ersan quoteToken",quoteToken);
    console.log("ersan fromAmount",fromAmount);
    console.log("ersan toAmount",toAmount);
    console.log("ersan tradeType",tradeType);

    let _baseAsset = baseToken.address == ZeroAddress ? WETH9[Number(chainId)].address : baseToken.address;
    let _quoteAsset = quoteToken.address == ZeroAddress ? WETH9[Number(chainId)].address : quoteToken.address;

    console.log("ersan _baseAsset",_baseAsset);
    console.log("ersan _quoteAsset",_quoteAsset); 
    
    let dexContract = getContractByName(TContractType.DEX, Number(chainId));
 

    const _pairInfo : any = await dexContract.client.readContract({
        address: dexContract.caller.address,
        abi: dexContract.abi,
        functionName: 'getPairInfo',
        args: [_baseAsset, _quoteAsset],
        account: ethers.getAddress(account) as `0x${string}`,
      })

      if(!_pairInfo){
        return null;
      }

      if(!_pairInfo.valid){
        return null;
      }

      let _baseReserve = _pairInfo.reserveBase;
      let _quoteReserve = _pairInfo.reserveQuote;

      
      if(_baseReserve <= MINIMUM_LIQUIDITY || _quoteReserve <= MINIMUM_LIQUIDITY){
        return null;
      }

      
      

    console.log("ersan _pairInfo",_pairInfo);

  }

  useEffect(()=>{
    fetchPairInfo();
  },[baseToken,quoteToken,fromAmount,toAmount,tradeType]);
  
  // Trade bilgilerini döndüren fonksiyon
  const getSimpleSwapTradeInfo = (): Trade<Token, Token, TradeType> | null => {
    if (!baseToken || !quoteToken) {
      return null;
    }


    
    
    try {
     
        console.log("ersan baseToken",baseToken);
        console.log("ersan quoteToken",quoteToken);
        console.log("ersan fromAmount",fromAmount);


  
    
      
    } catch (error) {
      console.error("Trade bilgisi hesaplanırken hata:", error);
      return null;
    }

    return null;
  };

  // Context değeri
  const value: SwapContextProps = {
    getSimpleSwapTradeInfo,
    // Diğer değerler...
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};

export default SwapContext;