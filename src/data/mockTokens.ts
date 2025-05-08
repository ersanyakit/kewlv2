import { Token } from '../types/tokens';

export const mockTokens: Token[] = [
  {
    id: '1',
    symbol: 'ETH',
    name: 'Ethereum',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    price: 3521.48,
    priceChange24h: 2.34,
    balance: 1.245
  },
  {
    id: '2',
    symbol: 'BTC',
    name: 'Bitcoin',
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    price: 65234.12,
    priceChange24h: 1.12,
    balance: 0.032
  },
  {
    id: '3',
    symbol: 'USDC',
    name: 'USD Coin',
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    price: 1.00,
    priceChange24h: 0.01,
    balance: 1450.00
  },
  {
    id: '4',
    symbol: 'SOL',
    name: 'Solana',
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    price: 144.21,
    priceChange24h: 5.43,
    balance: 15.5
  },
  {
    id: '5',
    symbol: 'ARB',
    name: 'Arbitrum',
    logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    price: 1.24,
    priceChange24h: -1.23,
    balance: 320.75
  },
  {
    id: '6',
    symbol: 'AVAX',
    name: 'Avalanche',
    logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    price: 38.56,
    priceChange24h: 3.22,
    balance: 12.34
  },
  {
    id: '7',
    symbol: 'MATIC',
    name: 'Polygon',
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    price: 0.67,
    priceChange24h: -0.35,
    balance: 2450.00
  },
  {
    id: '8',
    symbol: 'DAI',
    name: 'Dai',
    logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    price: 1.00,
    priceChange24h: 0.00,
    balance: 755.32
  }
];