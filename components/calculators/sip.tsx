"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { CurrencyDisplay } from "@/components/ui/currency"
import { useFormatCurrency } from "@/hooks/use-currency"

export function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000")
  const [expectedReturn, setExpectedReturn] = useState("12")
  const [investmentPeriod, setInvestmentPeriod] = useState("10")
  const [stepUpRate, setStepUpRate] = useState("10")
  const [sipType, setSipType] = useState("regular")
  const formatCurrency = useFormatCurrency()

  const calculateSIP = () => {
    const monthly = Number.parseFloat(monthlyInvestment) || 0
    const rate = Number.parseFloat(expectedReturn) / 100 / 12
    const years = Number.parseFloat(investmentPeriod)
    const stepUp = Number.parseFloat(stepUpRate) / 100
    const months = years * 12

    let futureValue = 0
    let totalInvestment = 0
    let currentMonthly = monthly

    if (sipType === "regular") {
      // Regular SIP calculation
      futureValue = monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)
      totalInvestment = monthly * months
    } else {
      // Step-up SIP calculation
      for (let year = 1; year <= years; year++) {
        const monthsInYear = 12
        const yearlyFV = currentMonthly * ((Math.pow(1 + rate, monthsInYear) - 1) / rate) * (1 + rate)

        // Compound the previous years' value
        futureValue = futureValue * Math.pow(1 + rate, monthsInYear) + yearlyFV
        totalInvestment += currentMonthly * monthsInYear

        // Increase monthly investment for next year
        currentMonthly = currentMonthly * (1 + stepUp)
      }
    }

    const totalReturns = futureValue - totalInvestment

    return {
      futureValue,
      totalInvestment,
      totalReturns,
    }
  }

  const generateSIPData = () => {
    const data = []
    const monthly = Number.parseFloat(monthlyInvestment) || 0
    const rate = Number.parseFloat(expectedReturn) / 100 / 12
    const years = Number.parseFloat(investmentPeriod)
    const stepUp = Number.parseFloat(stepUpRate) / 100

    let cumulativeInvestment = 0
    let cumulativeValue = 0
    let currentMonthly = monthly

    for (let year = 1; year <= years; year++) {
      if (sipType === "regular") {
        const months = year * 12
        cumulativeValue = monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)
        cumulativeInvestment = monthly * months
      } else {
        // Step-up SIP
        const monthsInYear = 12
        const yearlyFV = currentMonthly * ((Math.pow(1 + rate, monthsInYear) - 1) / rate) * (1 + rate)
        cumulativeValue = cumulativeValue * Math.pow(1 + rate, monthsInYear) + yearlyFV
        cumulativeInvestment += currentMonthly * monthsInYear
        currentMonthly = currentMonthly * (1 + stepUp)
      }

      data.push({
        year,
        investment: Math.round(cumulativeInvestment),
        value: Math.round(cumulativeValue),
        returns: Math.round(cumulativeValue - cumulativeInvestment),
      })
    }

    return data
  }

  const result = calculateSIP()
  const chartData = generateSIPData()

  const chartConfig = {
    investment: {
      label: "Total Investment",
      color: "hsl(var(--chart-2))",
    },
    returns: {
      label: "Returns",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>SIP Calculator</CardTitle>
          <CardDescription>Calculate returns from Systematic Investment Plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sip-type">SIP Type</Label>
            <Select value={sipType} onValueChange={setSipType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular SIP</SelectItem>
                <SelectItem value="stepup">Step-up SIP</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {sipType === "regular" ? "Fixed monthly investment amount" : "Increase investment amount annually"}
            </p>
          </div>

          <div>
            <Label htmlFor="monthly-investment">Monthly Investment</Label>
            <Input
              id="monthly-investment"
              type="number"
              placeholder="5000"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <Input
              id="expected-return"
              type="number"
              step="0.1"
              placeholder="12"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Equity funds typically return 10-15% annually</p>
          </div>

          <div>
            <Label htmlFor="investment-period">Investment Period (Years)</Label>
            <Input
              id="investment-period"
              type="number"
              placeholder="10"
              value={investmentPeriod}
              onChange={(e) => setInvestmentPeriod(e.target.value)}
            />
          </div>

          {sipType === "stepup" && (
            <div>
              <Label htmlFor="stepup-rate">Annual Step-up Rate (%)</Label>
              <Input
                id="stepup-rate"
                type="number"
                step="0.1"
                placeholder="10"
                value={stepUpRate}
                onChange={(e) => setStepUpRate(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">Increase investment by this % each year</p>
            </div>
          )}

          {/* Results */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Investment:</span>
              <CurrencyDisplay amount={result.totalInvestment} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Returns:</span>
              <span className="font-semibold text-green-600">
                <CurrencyDisplay amount={result.totalReturns} />
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Maturity Value:</span>
              <span className="font-bold text-blue-600">
                <CurrencyDisplay amount={result.futureValue} />
              </span>
            </div>
          </div>

          {/* SIP Benefits */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">🎯 SIP Benefits</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Rupee cost averaging reduces market risk</li>
              <li>• Disciplined investing builds wealth over time</li>
              <li>• Power of compounding works in your favor</li>
              <li>• Start small, increase gradually</li>
              <li>• Tax benefits under Section 80C (ELSS funds)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>SIP Growth Projection</CardTitle>
          <CardDescription>Your investment vs returns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value / 1000, { compact: true }) + "k"} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "investment" ? "Total Investment" : "Returns",
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stackId="1"
                  stroke="var(--color-investment)"
                  fill="var(--color-investment)"
                />
                <Area
                  type="monotone"
                  dataKey="returns"
                  stackId="1"
                  stroke="var(--color-returns)"
                  fill="var(--color-returns)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Investment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Returns</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
