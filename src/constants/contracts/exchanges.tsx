
export const LIMIT_ORDER_BOOK_DECIMALS = 8;
export const PRICE_DECIMAL_FACTOR = 10n ** BigInt(LIMIT_ORDER_BOOK_DECIMALS);
export const DECENTRALIZED_EXCHANGES = [
    {
        logo:"/assets/dex/kewl.svg",
        chainId:88888,
        dex:"KEWL",
        router:"0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
        weth:"0x677F7e16C7Dd57be1D4C8aD1244883214953DC47",
        flag:false
    },
    {
        logo:"/assets/dex/fanx.jpg",
        chainId:88888,
        dex:"FANX",
        router:"0xE2918AA38088878546c1A18F2F9b1BC83297fdD3",
        weth:"0x677F7e16C7Dd57be1D4C8aD1244883214953DC47",
        flag:false
    },
    {
        logo:"/assets/dex/chilizswap.svg",
        chainId:88888,
        dex:"CHILIZSWAP",
        router:"0xcF4A2be8Fe92fEe8e350AD8D876274749Ae0CBb1",
        weth:"0x677F7e16C7Dd57be1D4C8aD1244883214953DC47",
        flag:false
    },
    {
        logo:"/assets/dex/dswap.png",
        chainId:88888,
        dex:"DIVISWAP",
        router:"0xbdd9c322ecf401e09c9d2dca3be46a7e45d48bb1",
        weth:"0x677F7e16C7Dd57be1D4C8aD1244883214953DC47",
        flag:false
    },
    {
        logo:"/assets/dex/kewl.svg",
        chainId:88888,
        dex:"KEWLv1",
        router:"0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
        weth:"0x721EF6871f1c4Efe730Dce047D40D1743B886946",
        flag:false
    },

    

    {
        logo:"/assets/dex/kewl.svg",
        chainId:43114,
        dex:"KEWL",
        router:"0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
        weth:"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        flag:false
    },
    {
        logo:"/assets/dex/traderjoe.svg",
        chainId:43114,
        dex:"TRADERJOE",
        router:"0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
        weth:"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        flag:false
    },
    {
        logo:"/assets/dex/pangolin.svg",
        chainId:43114,
        dex:"PANGOLIN",
        router:"0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
        weth:"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        flag:false
    },
    {
        logo:"/assets/dex/uniswap.svg",
        chainId:43114,
        dex:"UNISWAP",
        router:"0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
        weth:"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        flag:false
    }
    ,
    {
        logo:"/assets/dex/sushi.svg",
        chainId:43114,
        dex:"SUSHI",
        router:"0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        weth:"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        flag:false
    },

    {
        logo:"/assets/dex/kewl.svg",
        chainId:146,
        dex:"KEWL",
        router:"0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    },
     
    {
        logo:"/assets/dex/shadow.svg",
        chainId:146,
        dex:"SHADOW",
        router:"0x2dA25E7446A70D7be65fd4c053948BEcAA6374c8",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:true
    },
    {
        logo:"/assets/dex/sonic-market.svg",
        chainId:146,
        dex:"SonicMarket",
        router:"0x01D6747dD2d65dDD90FAEC2C84727c2706ee28E2",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    }
    ,
 

    {
        logo:"/assets/dex/equalizer.svg",
        chainId:146,
        dex:"Equalizer",
        router:"0xDDD9845Ba0D8f38d3045f804f67A1a8B9A528FcC",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:true
    },
    {
        logo:"/assets/dex/metropolis.svg",
        chainId:146,
        dex:"Metropolis",
        router:"0x1570300e9cFEC66c9Fb0C8bc14366C86EB170Ad0",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    },

    {
        logo:"/assets/dex/swapx.svg",
        chainId:146,
        dex:"SwapX",
        router:"0x05c1be79d3aC21Cc4B727eeD58C9B2fF757F5663",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:true
    },
    {
        logo:"/assets/dex/sushi.svg",
        chainId:146,
        dex:"SUSHI",
        router:"0xB45e53277a7e0F1D35f2a77160e91e25507f1763",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    },

    /*
    {
        logo:"/assets/dex/memebox.png",
        chainId:146,
        dex:"MEMEBOX",
        router:"0x079463f811e6EB2E226908E79144CDDB59a7fB71",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    },*/



    {
        logo:"/assets/dex/spooky.png",
        chainId:146,
        dex:"SpookySwap",
        router:"0xEE4bC42157cf65291Ba2FE839AE127e3Cc76f741",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    },

    {
        logo:"/assets/dex/ninemm.png",
        chainId:146,
        dex:"9MM",
        router:"0x0f7B3FcBa276A65dd6E41E400055dcb75BA66750",
        weth:"0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
        flag:false
    },


    
    /*base*/
    {
        logo:"/assets/dex/uniswap.svg",
        chainId:8453,
        dex:"UNISWAP",
        router:"0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
        weth:"0x4200000000000000000000000000000000000006",
        flag:false
    },


    {
        logo:"/assets/dex/kewl.svg",
        chainId:1907,
        dex:"KEWL",
        router:"0x1793515D0E1132C5eF1F32881c6313Fb692D5b12",
        weth:"0xe0D0f25b5FCFa4d3EDD9C2186451d9E04C4B9f11",
        flag:false
    },
     


    {
        logo:"/assets/dex/kewl.svg",
        chainId:56,
        dex:"KEWL",
        router:"0x5636A64B835F4E3821C798fdA16E0bA106357646",
        weth:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        flag:false
    },
    {
        logo:"/assets/dex/pancake.svg",
        chainId:56,
        dex:"PancakeSwapv2",
        router:"0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        weth:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        flag:false
    },
    {
        logo:"/assets/dex/biswap.svg",
        chainId:56,
        dex:"Biswap",
        router:"0x858E3312ed3A876947EA49d572A7C42DE08af7EE",
        weth:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        flag:false
    }


    
   
]

export interface Router {
    router: string; // Address type
    weth: string;   // Address type
  }

export const getRoutersByChainId = (chainId: number): Router[] => {
    return DECENTRALIZED_EXCHANGES.filter((exchange: any) => exchange.chainId === chainId).map((exchange) => ({
      router: exchange.router,
      weth: exchange.weth,
      flag:exchange.flag,
      stable:false
    }));
  };

  export const getExchangeByRouterAndWETH = (routerAddress: string, wethAddress: string,chainId: number): any | undefined => {
    return DECENTRALIZED_EXCHANGES.find(
      (exchange: any) =>
        exchange.chainId === chainId &&
        exchange.router.toLowerCase() === routerAddress.toLowerCase() &&
        exchange.weth.toLowerCase() === wethAddress.toLowerCase()
    );
  };
