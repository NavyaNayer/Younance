"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Expense } from "@/app/expenses/page"

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const expenseData = expenses.filter((expense) => expense.type === "expense")

  // Category breakdown
  const categoryData = expenseData
    .reduce(
      (acc, expense) => {
        const existing = acc.find((item) => item.category === expense.category)
        if (existing) {
          existing.amount += expense.amount
        } else {
          acc.push({ category: expense.category, amount: expense.amount })
        }
        return acc
      },
      [] as { category: string; amount: number }[],
    )
    .sort((a, b) => b.amount - a.amount)

  // Daily spending for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const dailyData = last7Days.map((date) => {
    const dayExpenses = expenseData.filter((expense) => expense.date === date)
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
      amount: total,
    }
  })

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6b7280",
  ]

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Analysis</CardTitle>
        <CardDescription>Visual breakdown of your spending patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="daily">Daily Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            {categoryData.length > 0 ? (
              <>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="amount"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0]
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold">{data.payload.category}</p>
                                <p className="text-blue-600">${Number(data.value).toLocaleString()}</p>
                                <p className="text-sm text-gray-500">
                                  {(
                                    (Number(data.value) / categoryData.reduce((sum, item) => sum + item.amount, 0)) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryData.slice(0, 6).map((item, index) => (
                    <div key={item.category} className="flex items-center space-x-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="truncate">{item.category}</span>
                      <span className="font-semibold ml-auto">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No expense data available</p>
                <p className="text-sm">Add some expenses to see the breakdown</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} fontSize={12} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Spent"]}
                  />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Total spent in last 7 days:
                <span className="font-semibold ml-1">
                  ${dailyData.reduce((sum, day) => sum + day.amount, 0).toLocaleString()}
                </span>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
