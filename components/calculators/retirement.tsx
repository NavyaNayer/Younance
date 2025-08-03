"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("25")
  const [retirementAge, setRetirementAge] = useState("65")
  const [currentSavings, setCurrentSavings] = useState("50000")
  const [monthlyContribution, setMonthlyContribution] = useState("1000")
  const [expectedReturn, setExpectedReturn] = useState("8")
  const [inflationRate, setInflationRate] = useState("3")
  const [desiredIncome, setDesiredIncome] = useState("5000")

  const calculateRetirement = () => {
    const age = Number.parseFloat(currentAge) || 25
    const retAge = Number.parseFloat(retirementAge) || 65
    const savings = Number.parseFloat(currentSavings) || 0
    const monthly = Number.parseFloat(monthlyContribution) || 0
    const returnRate = Number.parseFloat(expectedReturn) / 100
    const inflation = Number.parseFloat(inflationRate) / 100
    const income = Number.parseFloat(desiredIncome) || 0

    const yearsToRetirement = retAge - age
    const monthlyRate = returnRate / 12
    const months = yearsToRetirement * 12

    // Future value of current savings
    const futureCurrentSavings = savings * Math.pow(1 + returnRate, yearsToRetirement)

    // Future value of monthly contributions
    const futureMonthlyContributions = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

    const totalRetirementSavings = futureCurrentSavings + futureMonthlyContributions

    // Adjust desired income for inflation
    const inflationAdjustedIncome = income * Math.pow(1 + inflation, yearsToRetirement)

    // Calculate required savings for desired income (4% rule)
    const requiredSavings = inflationAdjustedIncome * 12 * 25 // 4% withdrawal rate

    const shortfall = requiredSavings - totalRetirementSavings

    return {
      totalRetirementSavings,
      requiredSavings,
      shortfall,
      inflationAdjustedIncome,
      yearsToRetirement,
    }
  }

  const generateProjectionData = () => {
    const data = []
    const age = Number.parseFloat(currentAge) || 25
    const retAge = Number.parseFloat(retirementAge) || 65
    const savings = Number.parseFloat(currentSavings) || 0
    const monthly = Number.parseFloat(monthlyContribution) || 0
    const returnRate = Number.parseFloat(expectedReturn) / 100

    for (let year = 0; year <= retAge - age; year++) {
      const currentAgeAtYear = age + year
      const monthlyRate = returnRate / 12
      const months = year * 12

      const futureCurrentSavings = savings * Math.pow(1 + returnRate, year)
      const futureMonthlyContributions =
        year > 0 ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0

      const totalValue = futureCurrentSavings + futureMonthlyContributions

      data.push({
        age: currentAgeAtYear,
        value: Math.round(totalValue),
      })
    }

    return data
  }

  const result = calculateRetirement()
  const projectionData = generateProjectionData()

  const chartConfig = {
    value: {
      label: "Retirement Savings",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Retirement Calculator</CardTitle>
          <CardDescription>Plan for your retirement and see if you're on track</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-age">Current Age</Label>
              <Input
                id="current-age"
                type="number"
                placeholder="25"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="retirement-age">Retirement Age</Label>
              <Input
                id="retirement-age"
                type="number"
                placeholder="65"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="current-savings">Current Retirement Savings</Label>
            <Input
              id="current-savings"
              type="number"
              placeholder="50000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
            <Input
              id="monthly-contribution"
              type="number"
              placeholder="1000"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <Input
              id="expected-return"
              type="number"
              step="0.1"
              placeholder="8"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="inflation">Expected Inflation Rate (%)</Label>
            <Input
              id="inflation"
              type="number"
              step="0.1"
              placeholder="3"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="desired-income">Desired Monthly Income in Retirement</Label>
            <Input
              id="desired-income"
              type="number"
              placeholder="5000"
              value={desiredIncome}
              onChange={(e) => setDesiredIncome(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Years to Retirement:</span>
              <span className="font-semibold">{result.yearsToRetirement} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projected Savings:</span>
              <span className="font-semibold text-blue-600">${result.totalRetirementSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required Savings:</span>
              <span className="font-semibold">${result.requiredSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">{result.shortfall > 0 ? "Shortfall:" : "Surplus:"}</span>
              <span className={`font-bold ${result.shortfall > 0 ? "text-red-600" : "text-green-600"}`}>
                ${Math.abs(result.shortfall).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Retirement Savings Projection</CardTitle>
          <CardDescription>Your savings growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <XAxis dataKey="age" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Retirement Savings"]}
                  labelFormatter={(label) => `Age ${label}`}
                />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
