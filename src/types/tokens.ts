export interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  logoUrl: string;
  price: number;
  priceChange24h: number;
  balance?: number;
  verified?: boolean;
}

export interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  showSettings: boolean;
  loading: boolean;
}

export interface PriceImpact {
  value: number;
  severity: 'low' | 'medium' | 'high';
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  exchangeRate: number;
  priceImpact: PriceImpact;
  minimumReceived: string;
  fee: number;
  gasFee: {
    slow: number;
    medium: number;
    fast: number;
  }
  route: string[];
}