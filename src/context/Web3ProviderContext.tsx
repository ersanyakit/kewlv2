'use client';

import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { chiliz, hardhat, avalanche, arbitrum, sonic, Chain, AppKitNetwork } from '@reown/appkit/networks';
import { AppKitOptions, createAppKit } from '@reown/appkit/react';
import { ReactNode } from 'react';
import { createPublicClient, createWalletClient, http } from 'viem';


const projectId = 'd44052dff4e08d391ea2749cd7df8422';



export function getChainById(chainId: number): AppKitNetwork | Chain | undefined {
  return appkitOptions.networks.find((chain) => chain.id === chainId) || appkitOptions.defaultNetwork;
}

export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    88888: "chiliz",
    43114: "avax",
    42161: "arbitrum",
    146: "sonic",
  };
  return chains[chainId] || chains[146];
}

export function getChainDefaultAssetsURI(chainId: number): string {
  let chainName = getChainName(Number(chainId))
  return `https://raw.githubusercontent.com/kewlexchange/assets/main/${chainName}/index.json`
}

const metadata = {
  name: 'KEWL',
  description: 'Intelligent Asset Swapping for the Next Generation of DeFi.',
  url: 'https://kewl.exchange',
  icons: ['/assets/logo/logo.svg'],
};



export const appkitOptions: AppKitOptions = {
  adapters: [new EthersAdapter()],
  metadata: metadata,
  networks: [chiliz,sonic, avalanche, arbitrum],
  defaultNetwork: chiliz,
  chainImages: {
    88888: "/assets/chains/chz.svg",
    146: "/assets/chains/sonic.svg"
  },
  projectId,
  themeMode: "light",
  features: {
    email: false,
    socials: false,
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
  ],
}

export const publicClient = createPublicClient({
  chain: (appkitOptions.defaultNetwork) as Chain,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: (appkitOptions.defaultNetwork) as Chain,
  transport: http()
})

createAppKit(appkitOptions);

export function Web3ProviderContext({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <>{children}</>; // Ensure it returns a valid JSX element
}
