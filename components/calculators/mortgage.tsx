"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { CurrencyDisplay } from "@/components/ui/currency"
import { useFormatCurrency } from "@/hooks/use-currency"

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("400000")
  const [downPayment, setDownPayment] = useState("80000")
  const [interestRate, setInterestRate] = useState("6.5")
  const [loanTerm, setLoanTerm] = useState("30")
  const formatCurrency = useFormatCurrency()

  const calculateMortgage = () => {
    const price = Number.parseFloat(homePrice) || 0
    const down = Number.parseFloat(downPayment) || 0
    const rate = Number.parseFloat(interestRate) / 100 / 12
    const term = Number.parseFloat(loanTerm) * 12

    const loanAmount = price - down
    const monthlyPayment = (loanAmount * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)

    const totalPayments = monthlyPayment * term
    const totalInterest = totalPayments - loanAmount

    return {
      loanAmount,
      monthlyPayment,
      totalPayments,
      totalInterest,
      downPaymentPercent: (down / price) * 100,
    }
  }

  const result = calculateMortgage()

  const pieData = [
    { name: "Principal", value: result.loanAmount, color: "#3b82f6" },
    { name: "Interest", value: result.totalInterest, color: "#ef4444" },
  ]

  const chartConfig = {
    value: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
          <CardDescription>Calculate your monthly mortgage payment and total interest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="home-price">Home Price</Label>
            <Input
              id="home-price"
              type="number"
              placeholder="400000"
              value={homePrice}
              onChange={(e) => setHomePrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="down-payment">Down Payment</Label>
            <Input
              id="down-payment"
              type="number"
              placeholder="80000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">{result.downPaymentPercent.toFixed(1)}% of home price</p>
          </div>

          <div>
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              step="0.1"
              placeholder="6.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="loan-term">Loan Term (Years)</Label>
            <Input
              id="loan-term"
              type="number"
              placeholder="30"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Amount:</span>
              <CurrencyDisplay amount={result.loanAmount} />
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Monthly Payment:</span>
              <span className="font-bold text-blue-600">
                <CurrencyDisplay amount={result.monthlyPayment} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-semibold text-red-600">
                <CurrencyDisplay amount={result.totalInterest} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Payments:</span>
              <CurrencyDisplay amount={result.totalPayments} />
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Additional Monthly Costs to Consider:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Property taxes (~1-2% of home value annually)</li>
              <li>• Home insurance (~1,000-2,000 annually)</li>
              <li>• PMI if down payment {"<"} 20%</li>
              <li>• HOA fees (if applicable)</li>
              <li>• Maintenance and repairs (~1% of home value annually)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Principal vs Interest</CardTitle>
          <CardDescription>Breakdown of your total payments over the loan term</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.payload.name}</p>
                          <p className="text-blue-600">{formatCurrency(Number(data.value))}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Principal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Interest</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Money-Saving Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Make extra principal payments to save on interest</li>
              <li>• Consider a 15-year loan for lower total interest</li>
              <li>• Shop around for the best interest rates</li>
              <li>• Improve your credit score before applying</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
