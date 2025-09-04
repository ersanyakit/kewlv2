'use client';

import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { chiliz as originalChiliz,spicy, bsc, avalanche,base, arbitrum, sonic,hardhat, Chain, AppKitNetwork } from '@reown/appkit/networks';
import { AppKitOptions, createAppKit, useAppKit } from '@reown/appkit/react';
import { createContext, ReactNode, useContext } from 'react';
import { createPublicClient, createWalletClient, http } from 'viem';

const projectId = 'd44052dff4e08d391ea2749cd7df8422';


export const chiliz : any = {
  ...originalChiliz,
  rpcUrls: {
    default: {
      http: ['https://rpc.chiliz.com'], // ← Sadece burası değişiyor
    },
    public: {
      http: ['https://rpc.chiliz.com'],
    },
    explorers: {
      default: {
        name: 'Chiliz Explorer',
        url: 'https://chiliscan.com',
        apiUrl: 'https://scan.chiliz.com/api',
      },
    },
  },
}

export const bitci : any = {
  id: 1907,
  name: 'Bitci Chain',
  network: 'bitci-chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BITCI',
    symbol: 'BITCI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bitci.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliz Explorer',
      url: 'https://v3.bitciexplorer.com',
      apiUrl: 'https://v3.bitciexplorer.com/api/v2',
    },
  },
}

export function getChainById(chainId: number): AppKitNetwork | Chain | undefined {
  return appkitOptions.networks.find((chain) => chain.id === chainId) || appkitOptions.defaultNetwork;
}

const DEFAULT_CHAIN_ID = 88888;
export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    88888: "chiliz",
    88882: "spicy",
    43114: "avax",
    42161: "arbitrum",
    146: "sonic",
    8453:"base",
    31337:"hardhat",
    1907:"bitci",
    56:"bsc"
  };
  return chains[chainId] || chains[DEFAULT_CHAIN_ID];
}

export function getChainDefaultAssetsURI(chainId: number): string {
  let chainName = getChainName(Number(chainId))
  return `https://raw.githubusercontent.com/kewlexchange/assets/main/${chainName}/index.json`
}
const metadata = {
  name: 'KEWL',
  description: 'Intelligent Asset Swapping for the Next Generation of DeFi.',
  url: 'https://www.kewl.exchange',
  icons: ['/assets/logo/logo.svg'],
};



export const appkitOptions: AppKitOptions = {
  adapters: [new EthersAdapter()],
  metadata: metadata,
  networks: [chiliz,bsc,base,sonic, avalanche, bitci,arbitrum,hardhat,spicy],
  defaultNetwork: chiliz,
  chainImages: {
    88888: "/assets/chains/chz.svg",
    88882: "/assets/chains/chz.svg",
    146: "/assets/chains/sonic.svg",
    8453:"/assets/chains/base.svg",
    31337:"/assets/chains/error.svg",
    1907:"/assets/chains/bitci.svg",
    56:"/assets/chains/bsc.svg"
  },
  projectId,
  themeMode: "light",
  features: {
    email: true,
    emailShowWallets: true, // default to true
    socials: ["google","github","apple","facebook","x","discord","farcaster"],
    allWallets: true,
    swaps: false,
    history: false,
    analytics: false,
    onramp: false,
  },
 
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Metamask
    'f323633c1f67055a45aac84e321af6ffe46322da677ffdd32f9bc1e33bafe29c',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
    'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b', // WalletConnect
    '56843177b5e89d4bcb19a27dab7c49e0f33d8d3a6c8c4c7e5274f605e92befd6',//socios
  ],
}

export const publicClient = createPublicClient({
  chain: (appkitOptions.defaultNetwork) as any,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: (appkitOptions.defaultNetwork) as any ,
  transport: http()
})


const appKit = createAppKit(appkitOptions);

type Web3ContextType = {
  appKit:typeof appKit
  appkitOptions: typeof appkitOptions;
  publicClient: typeof publicClient;
  walletClient: typeof walletClient;
};
const Web3Context = createContext<Web3ContextType | undefined>(undefined);


// Sağlayıcı component
export function Web3ProviderContext({ children }: { children: ReactNode }) {

  return (
    <Web3Context.Provider value={{ appKit, appkitOptions, publicClient, walletClient }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3ProviderContext');
  }
  return context;
}
