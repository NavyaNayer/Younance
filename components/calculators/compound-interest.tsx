"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000")
  const [monthlyContribution, setMonthlyContribution] = useState("500")
  const [annualRate, setAnnualRate] = useState("8")
  const [years, setYears] = useState("10")
  const [compoundFrequency, setCompoundFrequency] = useState("12")

  const calculateCompoundInterest = () => {
    const P = Number.parseFloat(principal) || 0
    const PMT = Number.parseFloat(monthlyContribution) || 0
    const r = Number.parseFloat(annualRate) / 100
    const n = Number.parseFloat(compoundFrequency)
    const t = Number.parseFloat(years)

    // Future value of initial principal
    const futureValuePrincipal = P * Math.pow(1 + r / n, n * t)

    // Future value of monthly contributions (annuity)
    const monthlyRate = r / 12
    const months = t * 12
    const futureValueContributions = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

    const totalValue = futureValuePrincipal + futureValueContributions
    const totalContributions = P + PMT * months
    const totalInterest = totalValue - totalContributions

    return {
      totalValue,
      totalContributions,
      totalInterest,
    }
  }

  const generateChartData = () => {
    const data = []
    const P = Number.parseFloat(principal) || 0
    const PMT = Number.parseFloat(monthlyContribution) || 0
    const r = Number.parseFloat(annualRate) / 100
    const maxYears = Number.parseFloat(years)

    for (let year = 0; year <= maxYears; year++) {
      const monthlyRate = r / 12
      const months = year * 12

      // Future value calculations for each year
      const futureValuePrincipal = P * Math.pow(1 + r, year)
      const futureValueContributions = year > 0 ? PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0

      const totalValue = futureValuePrincipal + futureValueContributions
      const totalContributions = P + PMT * months
      const interest = totalValue - totalContributions

      data.push({
        year,
        totalValue: Math.round(totalValue),
        contributions: Math.round(totalContributions),
        interest: Math.round(interest),
      })
    }

    return data
  }

  const result = calculateCompoundInterest()
  const chartData = generateChartData()

  const chartConfig = {
    totalValue: {
      label: "Total Value",
      color: "hsl(var(--chart-1))",
    },
    contributions: {
      label: "Contributions",
      color: "hsl(var(--chart-2))",
    },
    interest: {
      label: "Interest Earned",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Compound Interest Calculator</CardTitle>
          <CardDescription>Calculate how your money grows with compound interest over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="principal">Initial Investment</Label>
            <Input
              id="principal"
              type="number"
              placeholder="10000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="monthly">Monthly Contribution</Label>
            <Input
              id="monthly"
              type="number"
              placeholder="500"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              placeholder="8"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="years">Investment Period (Years)</Label>
            <Input id="years" type="number" placeholder="10" value={years} onChange={(e) => setYears(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="compound">Compound Frequency</Label>
            <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semi-annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="365">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Contributions:</span>
              <span className="font-semibold">${result.totalContributions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Earned:</span>
              <span className="font-semibold text-green-600">${result.totalInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Final Amount:</span>
              <span className="font-bold text-blue-600">${result.totalValue.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Visualization</CardTitle>
          <CardDescription>See how your investment grows over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === "totalValue"
                      ? "Total Value"
                      : name === "contributions"
                        ? "Contributions"
                        : "Interest Earned",
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Bar dataKey="contributions" stackId="a" fill="var(--color-contributions)" />
                <Bar dataKey="interest" stackId="a" fill="var(--color-interest)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
