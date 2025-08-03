"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { CurrencyDisplay } from "@/components/ui/currency"
import { useFormatCurrency } from "@/hooks/use-currency"

export function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("4000")
  const [currentSavings, setCurrentSavings] = useState("5000")
  const [jobStability, setJobStability] = useState("stable")
  const [dependents, setDependents] = useState("0")
  const [monthlySavings, setMonthlySavings] = useState("500")
  const formatCurrency = useFormatCurrency()

  const calculateEmergencyFund = () => {
    const expenses = Number.parseFloat(monthlyExpenses) || 0
    const savings = Number.parseFloat(currentSavings) || 0
    const dependentCount = Number.parseFloat(dependents) || 0
    const monthlySave = Number.parseFloat(monthlySavings) || 0

    // Base months of expenses needed
    let baseMonths = 6

    // Adjust based on job stability
    if (jobStability === "unstable") baseMonths = 9
    else if (jobStability === "freelance") baseMonths = 12
    else if (jobStability === "very-stable") baseMonths = 3

    // Adjust for dependents
    const dependentAdjustment = dependentCount * 1
    const totalMonths = baseMonths + dependentAdjustment

    const targetAmount = expenses * totalMonths
    const shortfall = Math.max(0, targetAmount - savings)
    const monthsToTarget = shortfall > 0 ? Math.ceil(shortfall / monthlySave) : 0
    const progressPercentage = Math.min((savings / targetAmount) * 100, 100)

    return {
      targetAmount,
      shortfall,
      monthsToTarget,
      progressPercentage,
      totalMonths,
      currentMonthsCovered: savings / expenses,
    }
  }

  const result = calculateEmergencyFund()

  const getStatusInfo = () => {
    if (result.progressPercentage >= 100) {
      return {
        status: "excellent",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        message: "Excellent! You have a fully funded emergency fund.",
      }
    } else if (result.progressPercentage >= 75) {
      return {
        status: "good",
        icon: Shield,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        message: "Good progress! You're almost there.",
      }
    } else {
      return {
        status: "needs-work",
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        message: "Keep building your emergency fund for better financial security.",
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  const expenseCategories = [
    { name: "Housing (Rent/Mortgage)", percentage: 30, amount: Number.parseFloat(monthlyExpenses) * 0.3 || 0 },
    { name: "Food & Groceries", percentage: 15, amount: Number.parseFloat(monthlyExpenses) * 0.15 || 0 },
    { name: "Transportation", percentage: 15, amount: Number.parseFloat(monthlyExpenses) * 0.15 || 0 },
    { name: "Utilities", percentage: 10, amount: Number.parseFloat(monthlyExpenses) * 0.1 || 0 },
    { name: "Insurance", percentage: 10, amount: Number.parseFloat(monthlyExpenses) * 0.1 || 0 },
    { name: "Other Essentials", percentage: 20, amount: Number.parseFloat(monthlyExpenses) * 0.2 || 0 },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Fund Calculator</CardTitle>
          <CardDescription>Calculate how much you need for financial emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="monthly-expenses">Monthly Essential Expenses</Label>
            <Input
              id="monthly-expenses"
              type="number"
              placeholder="4000"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Include only essential expenses (rent, food, utilities, etc.)</p>
          </div>

          <div>
            <Label htmlFor="current-savings">Current Emergency Savings</Label>
            <Input
              id="current-savings"
              type="number"
              placeholder="5000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="job-stability">Job Stability</Label>
            <Select value={jobStability} onValueChange={setJobStability}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-stable">Very Stable (Government/Tenured)</SelectItem>
                <SelectItem value="stable">Stable (Regular Employment)</SelectItem>
                <SelectItem value="unstable">Somewhat Unstable</SelectItem>
                <SelectItem value="freelance">Freelance/Variable Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dependents">Number of Dependents</Label>
            <Input
              id="dependents"
              type="number"
              placeholder="0"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Children, elderly parents, etc.</p>
          </div>

          <div>
            <Label htmlFor="monthly-savings">Monthly Savings Capacity</Label>
            <Input
              id="monthly-savings"
              type="number"
              placeholder="500"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Recommended Fund Size:</span>
              <span className="font-semibold">{result.totalMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Target Amount:</span>
              <span className="font-semibold text-blue-600">
                <CurrencyDisplay amount={result.targetAmount} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Coverage:</span>
              <span className="font-semibold">{result.currentMonthsCovered.toFixed(1)} months</span>
            </div>
            {result.shortfall > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Needed:</span>
                  <span className="font-semibold text-orange-600">
                    <CurrencyDisplay amount={result.shortfall} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time to Target:</span>
                  <span className="font-semibold">{result.monthsToTarget} months</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status and Breakdown */}
      <div className="space-y-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
              <span>Emergency Fund Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={result.progressPercentage} className="h-3" />
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold">{Math.round(result.progressPercentage)}%</span>
              </div>
              <div className={`p-4 rounded-lg ${statusInfo.bgColor}`}>
                <p className={`${statusInfo.color} font-medium`}>{statusInfo.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Breakdown</CardTitle>
            <CardDescription>Typical essential expenses to consider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({category.percentage}%)</span>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Emergency Fund Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep funds in a high-yield savings account</li>
                <li>• Don't invest emergency funds in stocks</li>
                <li>• Review and adjust annually</li>
                <li>• Replenish immediately after use</li>
                <li>• Consider separate fund for home/car repairs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
