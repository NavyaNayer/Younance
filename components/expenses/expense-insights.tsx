"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from "lucide-react"
import { CurrencyDisplay } from "@/components/ui/currency"
import { useFormatCurrency } from "@/hooks/use-currency"
import type { Expense, Budget } from "@/app/expenses/page"

interface ExpenseInsightsProps {
  expenses: Expense[]
  budgets: Budget[]
}

export function ExpenseInsights({ expenses, budgets }: ExpenseInsightsProps) {
  const formatCurrency = useFormatCurrency()
  
  // Calculate monthly trends (last 6 months)
  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.getMonth()
    const year = date.getFullYear()

    const monthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year && expense.type === "expense"
    })

    const monthIncome = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year && expense.type === "income"
    })

    return {
      month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      expenses: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      income: monthIncome.reduce((sum, expense) => sum + expense.amount, 0),
    }
  }).reverse()

  // Calculate insights
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear && expense.type === "expense"
    )
  })

  const lastMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    return (
      expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear && expense.type === "expense"
    )
  })

  const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const lastTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0

  // Top spending categories
  const categoryTotals = currentMonthExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Budget analysis
  const overBudgetCategories = budgets.filter((budget) => budget.spent > budget.budgeted)
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)

  // Spending patterns
  const avgDailySpending = currentTotal / new Date().getDate()
  const projectedMonthlySpending = avgDailySpending * new Date(currentYear, currentMonth + 1, 0).getDate()

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-1))",
    },
    income: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Spending Trend</CardTitle>
          <CardDescription>Track your income and expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value / 1000, { showSymbol: false }) + 'k'} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "expenses" ? "Expenses" : "Income",
                  ]}
                />
                <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Monthly Change */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-red-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-600" />
              )}
              <span>Monthly Change</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyChange >= 0 ? "text-red-600" : "text-green-600"}`}>
              {monthlyChange >= 0 ? "+" : ""}
              {monthlyChange.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600 mt-1">{monthlyChange >= 0 ? "Increase" : "Decrease"} from last month</p>
            <p className="text-xs text-gray-500 mt-2">
              Current: <CurrencyDisplay amount={currentTotal} /> | Last: <CurrencyDisplay amount={lastTotal} />
            </p>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Budget Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalSpent > totalBudget ? "text-red-600" : "text-green-600"}`}>
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-sm text-gray-600 mt-1">{totalSpent > totalBudget ? "Over budget" : "Within budget"}</p>
            {overBudgetCategories.length > 0 && (
              <p className="text-xs text-red-600 mt-2">{overBudgetCategories.length} categories over budget</p>
            )}
          </CardContent>
        </Card>

        {/* Projected Spending */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Month Projection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              <CurrencyDisplay amount={projectedMonthlySpending} />
            </div>
            <p className="text-sm text-gray-600 mt-1">Projected monthly total</p>
            <p className="text-xs text-gray-500 mt-2">
              Based on <CurrencyDisplay amount={avgDailySpending} />/day average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>Your biggest expenses this month</CardDescription>
          </CardHeader>
          <CardContent>
            {topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                          index === 0 ? "bg-red-500" : index === 1 ? "bg-orange-500" : "bg-yellow-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        <CurrencyDisplay amount={amount} />
                      </div>
                      <div className="text-sm text-gray-500">{((amount / currentTotal) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No expenses recorded this month</p>
            )}
          </CardContent>
        </Card>

        {/* Alerts & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Recommendations</CardTitle>
            <CardDescription>Personalized insights for better financial health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overBudgetCategories.length > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Budget Alert</h4>
                    <p className="text-sm text-red-700">
                      You're over budget in {overBudgetCategories.length} categories. Consider reducing spending in{" "}
                      {overBudgetCategories[0].category}.
                    </p>
                  </div>
                </div>
              )}

              {monthlyChange > 20 && (
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Spending Increase</h4>
                    <p className="text-sm text-orange-700">
                      Your spending increased by {monthlyChange.toFixed(1)}% this month. Review your recent purchases.
                    </p>
                  </div>
                </div>
              )}

              {projectedMonthlySpending > totalBudget && totalBudget > 0 && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Projection Warning</h4>
                    <p className="text-sm text-yellow-700">
                      At current pace, you'll exceed your monthly budget by{" "}
                      <CurrencyDisplay amount={projectedMonthlySpending - totalBudget} />.
                    </p>
                  </div>
                </div>
              )}

              {overBudgetCategories.length === 0 && monthlyChange < 10 && (
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Great Job!</h4>
                    <p className="text-sm text-green-700">
                      You're staying within budget and maintaining good spending habits. Keep it up!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
