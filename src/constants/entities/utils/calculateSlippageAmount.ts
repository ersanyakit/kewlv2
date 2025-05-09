import JSBI from 'jsbi'
import { BIPS_BASE } from './misc'
import { CurrencyAmount, Fraction, Percent } from '../fractions'
import { Currency } from '../currency'

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(1, 100) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(3, 100) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(5, 100) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%



const ONE = new Fraction(1, 1)

export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: Percent): [JSBI, JSBI] {
  if (slippage.lessThan(0) || slippage.greaterThan(ONE)) throw new Error('Unexpected slippage')
  return [value.multiply(ONE.subtract(slippage)).quotient, value.multiply(ONE.add(slippage)).quotient]
}


export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}


export function warningSeverityText(severity: number): string {
  switch (severity) {
    case 0:
      return 'Safe';
    case 1:
      return 'Medium';
    case 2:
      return 'High';
    case 3:
      return 'Risky';
    case 4:
      return 'Very High';
    default:
      return 'Very High';
  }
}