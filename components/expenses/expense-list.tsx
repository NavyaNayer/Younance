"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, Filter, TrendingDown, TrendingUp } from "lucide-react"
import { CurrencyDisplay } from "@/components/ui/currency"
import type { Expense } from "@/app/expenses/page"

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const categories = Array.from(new Set(expenses.map((expense) => expense.category)))

  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || expense.category === filterCategory
      const matchesType = filterType === "all" || expense.type === filterType
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "amount":
          return b.amount - a.amount
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View and manage all your transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm">Try adjusting your filters or add some transactions</p>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      expense.type === "expense" ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {expense.type === "expense" ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${expense.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                    {expense.type === "expense" ? "-" : "+"}
                    <CurrencyDisplay amount={expense.amount} />
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredExpenses.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-lg font-semibold">{filteredExpenses.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-lg font-semibold text-red-600">
                  -<CurrencyDisplay amount={filteredExpenses
                    .filter((e) => e.type === "expense")
                    .reduce((sum, e) => sum + e.amount, 0)} />
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-lg font-semibold text-green-600">
                  +<CurrencyDisplay amount={filteredExpenses
                    .filter((e) => e.type === "income")
                    .reduce((sum, e) => sum + e.amount, 0)} />
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
