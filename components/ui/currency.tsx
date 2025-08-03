"use client"

import { useFormatCurrency, useCurrency } from '@/hooks/use-currency'

interface CurrencyDisplayProps {
  amount: number | string
  showSymbol?: boolean
  compact?: boolean
  className?: string
}

export function CurrencyDisplay({ 
  amount, 
  showSymbol = true, 
  compact = false,
  className = ""
}: CurrencyDisplayProps) {
  const formatCurrency = useFormatCurrency()
  
  const formatted = formatCurrency(amount, { showSymbol, compact })
  
  return (
    <span className={className}>
      {formatted}
    </span>
  )
}

interface CurrencyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CurrencyInput({ 
  value, 
  onChange, 
  placeholder,
  className = ""
}: CurrencyInputProps) {
  const { currency } = useCurrency()
  
  return (
    <div className={`relative ${className}`}>
      {currency.position === 'before' && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {currency.symbol}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${currency.position === 'before' ? 'pl-8' : 'pr-8'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      />
      {currency.position === 'after' && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {currency.symbol}
        </span>
      )}
    </div>
  )
}
