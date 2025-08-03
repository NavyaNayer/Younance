"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, TrendingDown } from "lucide-react"

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

interface WhatIfCalculatorProps {
  userData: UserData
}

export function WhatIfCalculator({ userData }: WhatIfCalculatorProps) {
  const [whatIfSavings, setWhatIfSavings] = useState(userData.monthlySavings)
  const [whatIfTimeframe, setWhatIfTimeframe] = useState(userData.timeframe)

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

  const calculateFutureValue = (monthlySavings: number, years: number) => {
    const currentSavings = Number.parseFloat(userData.currentSavings) || 0
    const annualRate = getReturnRate()
    const monthlyRate = annualRate / 12
    const months = years * 12

    // Future value of current savings
    const futureCurrentSavings = currentSavings * Math.pow(1 + annualRate, years)

    // Future value of monthly contributions
    const futureMonthlySavings = (monthlySavings * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate

    return futureCurrentSavings + futureMonthlySavings
  }

  const originalValue = calculateFutureValue(
    Number.parseFloat(userData.monthlySavings) || 0,
    Number.parseInt(userData.timeframe) || 10,
  )

  const whatIfValue = calculateFutureValue(
    Number.parseFloat(whatIfSavings) || 0,
    Number.parseInt(whatIfTimeframe) || 10,
  )

  const difference = whatIfValue - originalValue
  const percentageChange = (difference / originalValue) * 100

  const scenarios = [
    {
      title: "Save $100 more per month",
      monthlySavings: (Number.parseFloat(userData.monthlySavings) || 0) + 100,
      timeframe: Number.parseInt(userData.timeframe) || 10,
    },
    {
      title: "Start 5 years earlier",
      monthlySavings: Number.parseFloat(userData.monthlySavings) || 0,
      timeframe: (Number.parseInt(userData.timeframe) || 10) + 5,
    },
    {
      title: "Save $200 more + 2 extra years",
      monthlySavings: (Number.parseFloat(userData.monthlySavings) || 0) + 200,
      timeframe: (Number.parseInt(userData.timeframe) || 10) + 2,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>What-If Calculator</span>
          </CardTitle>
          <CardDescription>See how small changes can dramatically impact your future wealth</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="p-4 bg-emerald-50 rounded-lg">
            <h3 className="font-semibold text-emerald-900 mb-2">Your Current Plan</h3>
            <p className="text-emerald-700">
              Save ${userData?.monthlySavings || 500} per month for {userData?.timeframe || 10} years at {(getReturnRate() * 100).toFixed(1)}% annual return
            </p>
            <p className="text-2xl font-bold text-emerald-900 mt-2">${Math.round(originalValue).toLocaleString()}</p>
          </div>

          {/* What-If Inputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatif-savings">Monthly Savings</Label>
              <Input
                id="whatif-savings"
                type="number"
                value={whatIfSavings}
                onChange={(e) => setWhatIfSavings(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="whatif-timeframe">Timeframe (years)</Label>
              <Input
                id="whatif-timeframe"
                type="number"
                value={whatIfTimeframe}
                onChange={(e) => setWhatIfTimeframe(e.target.value)}
              />
            </div>
          </div>

          {/* What-If Result */}
          <div className={`p-4 rounded-lg ${difference >= 0 ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-semibold ${difference >= 0 ? "text-green-900" : "text-red-900"}`}>
                  What-If Scenario
                </h3>
                <p className={`text-2xl font-bold mt-2 ${difference >= 0 ? "text-green-900" : "text-red-900"}`}>
                  ${Math.round(whatIfValue).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {difference >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span className="font-semibold">
                    {difference >= 0 ? "+" : ""}${Math.round(difference).toLocaleString()}
                  </span>
                </div>
                <p className={`text-sm ${difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {percentageChange >= 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Scenarios</CardTitle>
          <CardDescription>See the impact of common financial decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => {
              const scenarioValue = calculateFutureValue(scenario.monthlySavings, scenario.timeframe)
              const scenarioDifference = scenarioValue - originalValue
              const scenarioPercentage = (scenarioDifference / originalValue) * 100

              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{scenario.title}</h4>
                      <p className="text-sm text-gray-600">
                        ${scenario.monthlySavings.toLocaleString()}/month for {scenario.timeframe} years
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${Math.round(scenarioValue).toLocaleString()}</p>
                      <div className="flex items-center space-x-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          +${Math.round(scenarioDifference).toLocaleString()} ({scenarioPercentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => {
                      setWhatIfSavings(scenario.monthlySavings.toString())
                      setWhatIfTimeframe(scenario.timeframe.toString())
                    }}
                  >
                    Try This Scenario
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
