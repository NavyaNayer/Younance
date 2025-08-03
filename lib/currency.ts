// Currency configuration and utilities
export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  position: 'before' | 'after' // Symbol position relative to amount
  decimalPlaces: number
  thousandsSeparator: string
  decimalSeparator: string
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  CHF: {
    code: 'CHF',
    symbol: 'Fr',
    name: 'Swiss Franc',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: "'",
    decimalSeparator: '.'
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  HKD: {
    code: 'HKD',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ','
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ','
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  PLN: {
    code: 'PLN',
    symbol: 'zł',
    name: 'Polish Zloty',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ','
  },
  CZK: {
    code: 'CZK',
    symbol: 'Kč',
    name: 'Czech Koruna',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ','
  },
  HUF: {
    code: 'HUF',
    symbol: 'Ft',
    name: 'Hungarian Forint',
    position: 'after',
    decimalPlaces: 0,
    thousandsSeparator: ' ',
    decimalSeparator: ','
  },
  RON: {
    code: 'RON',
    symbol: 'lei',
    name: 'Romanian Leu',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.'
  },
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ','
  },
  NZD: {
    code: 'NZD',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  }
}

/**
 * Get user's currency from localStorage or default to USD
 */
export function getUserCurrency(): CurrencyConfig {
  if (typeof window === 'undefined') {
    return CURRENCIES.USD // Server-side default
  }
  
  try {
    const userData = localStorage.getItem('younance-user-data')
    if (userData) {
      const parsed = JSON.parse(userData)
      const currencyCode = parsed.currency
      if (currencyCode && CURRENCIES[currencyCode]) {
        return CURRENCIES[currencyCode]
      }
    }
  } catch (error) {
    console.error('Error getting user currency:', error)
  }
  
  return CURRENCIES.USD // Default fallback
}

/**
 * Format a number as currency according to user's preferences
 */
export function formatCurrency(
  amount: number | string,
  options?: {
    showSymbol?: boolean
    currencyOverride?: string
    compact?: boolean
  }
): string {
  const { showSymbol = true, currencyOverride, compact = false } = options || {}
  
  // Get currency config
  const currency = currencyOverride 
    ? CURRENCIES[currencyOverride] || getUserCurrency()
    : getUserCurrency()
  
  // Convert to number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount
  
  // Handle compact formatting (e.g., 1.2K, 1.5M)
  if (compact && Math.abs(numAmount) >= 1000) {
    const formatted = formatCompactNumber(numAmount)
    return showSymbol 
      ? currency.position === 'before' 
        ? `${currency.symbol}${formatted}`
        : `${formatted} ${currency.symbol}`
      : formatted
  }
  
  // Format the number with proper separators
  const formattedNumber = formatNumberWithSeparators(numAmount, currency)
  
  // Add currency symbol if requested
  if (!showSymbol) {
    return formattedNumber
  }
  
  return currency.position === 'before'
    ? `${currency.symbol}${formattedNumber}`
    : `${formattedNumber} ${currency.symbol}`
}

/**
 * Format number with thousands and decimal separators
 */
function formatNumberWithSeparators(amount: number, currency: CurrencyConfig): string {
  const fixed = amount.toFixed(currency.decimalPlaces)
  const [integerPart, decimalPart] = fixed.split('.')
  
  // Add thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator)
  
  // Return with or without decimal part
  if (currency.decimalPlaces === 0 || !decimalPart) {
    return formattedInteger
  }
  
  return `${formattedInteger}${currency.decimalSeparator}${decimalPart}`
}

/**
 * Format large numbers in compact form (K, M, B)
 */
function formatCompactNumber(amount: number): string {
  const absAmount = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  
  if (absAmount >= 1e9) {
    return `${sign}${(absAmount / 1e9).toFixed(1)}B`
  } else if (absAmount >= 1e6) {
    return `${sign}${(absAmount / 1e6).toFixed(1)}M`
  } else if (absAmount >= 1e3) {
    return `${sign}${(absAmount / 1e3).toFixed(1)}K`
  }
  
  return amount.toString()
}

/**
 * Get currency symbol only
 */
export function getCurrencySymbol(currencyCode?: string): string {
  const currency = currencyCode 
    ? CURRENCIES[currencyCode] || getUserCurrency()
    : getUserCurrency()
  return currency.symbol
}

/**
 * Parse a currency string back to a number
 */
export function parseCurrencyString(currencyString: string): number {
  // Remove all non-digit, non-decimal characters
  const cleaned = currencyString.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  return `${value.toFixed(decimalPlaces)}%`
}
