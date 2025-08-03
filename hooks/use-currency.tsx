"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

// Currency configuration and utilities
export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  position: 'before' | 'after'
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
    position: 'before',
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
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    position: 'before',
    decimalPlaces: 2,
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
    symbol: 'CHF',
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
  NZD: {
    code: 'NZD',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
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
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
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
  ARS: {
    code: 'ARS',
    symbol: '$',
    name: 'Argentine Peso',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    name: 'Chilean Peso',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  COP: {
    code: 'COP',
    symbol: '$',
    name: 'Colombian Peso',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
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
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  THB: {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ','
  },
  PHP: {
    code: 'PHP',
    symbol: '₱',
    name: 'Philippine Peso',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    position: 'after',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ','
  }
}

/**
 * Get user's currency from localStorage or default to USD
 */
export function getUserCurrency(): CurrencyConfig {
  if (typeof window === 'undefined') {
    return CURRENCIES.USD
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
  
  return CURRENCIES.USD
}

interface CurrencyContextType {
  currency: CurrencyConfig
  setCurrency: (currencyCode: string) => void
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(CURRENCIES.USD)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user currency on mount
    const userCurrency = getUserCurrency()
    setCurrencyState(userCurrency)
    setIsLoading(false)

    // Listen for currency changes
    const handleCurrencyChange = () => {
      const newCurrency = getUserCurrency()
      setCurrencyState(newCurrency)
    }

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'younance-user-data') {
        handleCurrencyChange()
      }
    }

    // Listen for custom events
    const handleCustomChange = () => {
      handleCurrencyChange()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('younance-data-updated', handleCustomChange)
    window.addEventListener('currency-changed', handleCustomChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('younance-data-updated', handleCustomChange)
      window.removeEventListener('currency-changed', handleCustomChange)
    }
  }, [])

  const setCurrency = (currencyCode: string) => {
    if (CURRENCIES[currencyCode]) {
      // Update user data in localStorage
      try {
        const userData = localStorage.getItem('younance-user-data')
        if (userData) {
          const parsed = JSON.parse(userData)
          parsed.currency = currencyCode
          localStorage.setItem('younance-user-data', JSON.stringify(parsed))
          
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent('currency-changed'))
        }
      } catch (error) {
        console.error('Error updating currency:', error)
      }
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

// Convenience hook for formatting currency
export function useFormatCurrency() {
  const { currency } = useCurrency()
  
  return (
    amount: number | string,
    options?: {
      showSymbol?: boolean
      compact?: boolean
    }
  ): string => {
    const { showSymbol = true, compact = false } = options || {}
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount
    
    // Handle compact formatting
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
    
    if (!showSymbol) {
      return formattedNumber
    }
    
    return currency.position === 'before'
      ? `${currency.symbol}${formattedNumber}`
      : `${formattedNumber} ${currency.symbol}`
  }
}

// Helper functions
function formatNumberWithSeparators(amount: number, currency: CurrencyConfig): string {
  const fixed = amount.toFixed(currency.decimalPlaces)
  const [integerPart, decimalPart] = fixed.split('.')
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator)
  
  if (currency.decimalPlaces === 0 || !decimalPart) {
    return formattedInteger
  }
  
  return `${formattedInteger}${currency.decimalSeparator}${decimalPart}`
}

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
