"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

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
  const getReturnRate = () => {
    switch (userData.riskTolerance) {
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
    const currentSavings = Number.parseFloat(userData.currentSavings) || 0
    const monthlySavings = Number.parseFloat(userData.monthlySavings) || 0
    const annualRate = getReturnRate()
    const monthlyRate = annualRate / 12
    const months = years * 12

    // Future value of current savings
    const futureCurrentSavings = currentSavings * Math.pow(1 + annualRate, years)

    // Future value of monthly contributions
    const futureMonthlySavings = (monthlySavings * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate

    return futureCurrentSavings + futureMonthlySavings
  }

  const generateChartData = () => {
    const data = []
    const maxYears = Math.max(Number.parseInt(userData.timeframe) || 10, 20)

    for (let year = 0; year <= maxYears; year++) {
      data.push({
        year,
        value: Math.round(calculateFutureValue(year)),
        contributions: Math.round(
          Number.parseFloat(userData.currentSavings) + Number.parseFloat(userData.monthlySavings) * 12 * year,
        ),
      })
    }

    return data
  }

  const chartData = generateChartData()
  const goalAmount = Number.parseFloat(userData.goalAmount) || 0
  const targetYears = Number.parseInt(userData.timeframe) || 10
  const projectedValue = calculateFutureValue(targetYears)

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "hsl(var(--chart-1))",
    },
    contributions: {
      label: "Total Contributions",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Your Wealth Growth Journey</CardTitle>
            <CardDescription className="text-lg font-medium text-gray-600 leading-relaxed">See how your money grows over time with compound interest</CardDescription>
          </div>
          <div className="flex items-center space-x-2 ml-6">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Projected Value</div>
              <div className="text-2xl font-bold text-green-600 tabular-nums">${Math.round(projectedValue).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="year" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                className="text-sm font-medium text-gray-600"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                className="text-sm font-medium text-gray-600 tabular-nums"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString()}`,
                  name === "value" ? "Portfolio Value" : "Total Contributions",
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Line
                type="monotone"
                dataKey="contributions"
                stroke="var(--color-contributions)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={false} />
              {goalAmount > 0 && (
                <Line
                  type="monotone"
                  dataKey={() => goalAmount}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
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
