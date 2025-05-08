import { PriceImpact, SwapQuote } from '../types/tokens';

export function formatAmount(amount: string | number, decimals: number = 6): string {
  if (!amount) return '0';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function calculatePriceImpact(fromAmount: string, toAmount: string, exchangeRate: number): PriceImpact {
  if (!fromAmount || !toAmount) {
    return { value: 0, severity: 'low' };
  }
  
  const fromValue = parseFloat(fromAmount);
  const toValue = parseFloat(toAmount);
  const expected = fromValue * exchangeRate;
  
  const impact = Math.abs((toValue - expected) / expected);
  
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (impact > 0.05) severity = 'high';
  else if (impact > 0.01) severity = 'medium';
  
  return { value: impact, severity };
}

export function getRandomAroundValue(value: number, variance: number): number {
  const min = value * (1 - variance);
  const max = value * (1 + variance);
  return min + Math.random() * (max - min);
}

export function calculateSwapQuote(
  fromToken: string, 
  toToken: string, 
  fromAmount: string
): SwapQuote {
  // In a real app, this would call an API
  const exchangeRate = getRandomAroundValue(2.5, 0.01);
  const fromValue = parseFloat(fromAmount) || 0;
  const toValue = fromValue * exchangeRate;
  const fee = fromValue * 0.003; // 0.3% fee
  
  const priceImpact = calculatePriceImpact(
    fromAmount,
    toValue.toString(),
    exchangeRate
  );
  
  const minimumReceived = (toValue * (1 - 0.01)).toString(); // 1% slippage
  
  return {
    fromAmount,
    toAmount: toValue.toString(),
    exchangeRate,
    priceImpact,
    minimumReceived,
    fee,
    gasFee: {
      slow: getRandomAroundValue(0.002, 0.1),
      medium: getRandomAroundValue(0.004, 0.1),
      fast: getRandomAroundValue(0.008, 0.1)
    },
    route: [fromToken, 'WETH', toToken]
  };
}