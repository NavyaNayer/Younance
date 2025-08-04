"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { CurrencyDisplay } from '@/components/ui/currency'

interface UserData {
  name: string
  age: string
  income: string
  currentSavings: string
  monthlySavings: string
  goal: string
  goalAmount: string
  timeframe: string
  riskTolerance: string
  expenses: string
}

interface GrowthChartProps {
  userData: UserData
}

export function GrowthChart({ userData }: GrowthChartProps) {
  // Use demo data if no userData
  const demoData = {
    name: "Demo User",
    age: "25",
    income: "60000",
    currentSavings: "5000",
    monthlySavings: "500",
    goal: "retirement",
    goalAmount: "1000000",
    timeframe: "30",
    riskTolerance: "moderate",
    expenses: "3000"
  }

  const effectiveUserData = userData || demoData

  // Simple currency formatter
  const formatCurrency = (value: number, options?: { showSymbol?: boolean }) => {
    const showSymbol = options?.showSymbol !== false
    const formatted = new Intl.NumberFormat('en-US', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
    return formatted
  }

  const getReturnRate = () => {
    switch (effectiveUserData.riskTolerance) {
      case "conservative":
        return 0.06
      case "moderate":
        return 0.09
      case "aggressive":
        return 0.11
      default:
        return 0.09
    }
  }

  const calculateFutureValue = (years: number) => {
    // Use baseline values to ensure chart visibility
    const currentSavings = Math.max(Number.parseFloat(effectiveUserData.currentSavings || '0') || 0, 1000)
    const monthlySavings = Math.max(Number.parseFloat(effectiveUserData.monthlySavings || '0') || 0, 100)
    const annualRate = getReturnRate()
    const monthlyRate = annualRate / 12
    const months = years * 12

    // Future value of current savings
    const futureCurrentSavings = currentSavings * Math.pow(1 + annualRate, years)

    // Future value of monthly contributions
    const futureMonthlySavings = monthlySavings > 0 
      ? (monthlySavings * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate
      : 0

    return futureCurrentSavings + futureMonthlySavings
  }

  const generateChartData = () => {
    const data = []
    const maxYears = Math.max(Number.parseInt(effectiveUserData.timeframe || '10') || 10, 20)
    const goalAmount = Number.parseFloat(effectiveUserData.goalAmount || '0') || 0
    
    // Ensure we have some baseline values for visualization
    const currentSavings = Math.max(Number.parseFloat(effectiveUserData.currentSavings || '0') || 0, 1000)
    const monthlySavings = Math.max(Number.parseFloat(effectiveUserData.monthlySavings || '0') || 0, 100)

    for (let year = 0; year <= maxYears; year++) {
      const value = calculateFutureValue(year)
      const contributions = currentSavings + monthlySavings * 12 * year

      data.push({
        year,
        value: Math.max(Math.round(value), 1000), // Ensure minimum value for visibility
        contributions: Math.max(Math.round(contributions), 1000),
        goal: goalAmount > 0 ? goalAmount : undefined, // Add goal to each data point
      })
    }

    return data
  }

  const chartData = generateChartData()
  const goalAmount = Number.parseFloat(effectiveUserData.goalAmount || '0') || 0
  const targetYears = Number.parseInt(effectiveUserData.timeframe || '10') || 10
  const projectedValue = calculateFutureValue(targetYears)

  // Debug logging - remove console.log to check for errors
  // console.log('Chart Data:', chartData.slice(0, 3)) // Show first 3 data points
  // console.log('Goal Amount:', goalAmount)
  // console.log('User Data:', {
  //   currentSavings: effectiveUserData.currentSavings,
  //   monthlySavings: effectiveUserData.monthlySavings,
  //   timeframe: effectiveUserData.timeframe
  // })

  // Ensure we have at least some data
  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Wealth Growth Journey</CardTitle>
          <CardDescription>Please complete your financial information to see your growth projection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            Insufficient data for chart generation
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "#10b981", // emerald-500
    },
    contributions: {
      label: "Total Contributions",
      color: "#6b7280", // gray-500
    },
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Your Wealth Growth Journey</CardTitle>
            <CardDescription className="text-lg font-medium text-gray-600 leading-relaxed">
              {!userData ? "Demo projection - complete setup for personalized data" : "See how your money grows over time with compound interest"}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 ml-6">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Projected Value</div>
              <div className="text-2xl font-bold text-green-600 tabular-nums">
                <CurrencyDisplay amount={Math.round(projectedValue)} />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[350px] w-full border border-gray-200 rounded-lg bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="year" 
                tickLine={true} 
                axisLine={true} 
                tickMargin={8}
                className="text-sm font-medium text-gray-600"
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => formatCurrency(value / 1000, { showSymbol: false }) + 'k'}
                className="text-sm font-medium text-gray-600 tabular-nums"
              />
              <ChartTooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "value" ? "Portfolio Value" : "Total Contributions",
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Line
                type="monotone"
                dataKey="contributions"
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls={true}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false} 
                connectNulls={true}
              />
              {goalAmount > 0 && (
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={false}
                  connectNulls={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-8 mt-6 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-600 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Portfolio Value</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-gray-400 rounded"></div>
            <span className="text-gray-700">Contributions</span>
          </div>
          {goalAmount > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-red-500 rounded"></div>
              <span className="text-gray-700">Goal</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
