"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingDown, TrendingUp, DollarSign, Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseChart } from "@/components/expenses/expense-chart"
import { BudgetTracker } from "@/components/expenses/budget-tracker"
import { ExpenseInsights } from "@/components/expenses/expense-insights"
import { Button } from "@/components/ui/button"

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: "expense" | "income"
}

export interface Budget {
  category: string
  budgeted: number
  spent: number
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem("younance-expenses")
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }

    // Load budgets from localStorage
    const savedBudgets = localStorage.getItem("younance-budgets")
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    } else {
      // Initialize default budgets
      const defaultBudgets: Budget[] = [
        { category: "Food & Dining", budgeted: 800, spent: 0 },
        { category: "Transportation", budgeted: 400, spent: 0 },
        { category: "Shopping", budgeted: 300, spent: 0 },
        { category: "Entertainment", budgeted: 200, spent: 0 },
        { category: "Bills & Utilities", budgeted: 600, spent: 0 },
        { category: "Healthcare", budgeted: 200, spent: 0 },
        { category: "Other", budgeted: 200, spent: 0 },
      ]
      setBudgets(defaultBudgets)
      localStorage.setItem("younance-budgets", JSON.stringify(defaultBudgets))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("younance-expenses", JSON.stringify(expenses))
      updateBudgetSpending()
    }
  }, [expenses, mounted])

  const updateBudgetSpending = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const updatedBudgets = budgets.map((budget) => {
      const categoryExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expense.category === budget.category &&
          expense.type === "expense" &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        )
      })

      const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return { ...budget, spent }
    })

    setBudgets(updatedBudgets)
    localStorage.setItem("younance-budgets", JSON.stringify(updatedBudgets))
  }

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const updateBudget = (category: string, budgeted: number) => {
    setBudgets((prev) => prev.map((budget) => (budget.category === category ? { ...budget, budgeted } : budget)))
  }

  // Calculate current month stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })

  const totalExpenses = currentMonthExpenses
    .filter((expense) => expense.type === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const totalIncome = currentMonthExpenses
    .filter((expense) => expense.type === "income")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const budgetRemaining = totalBudget - totalExpenses

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/challenges">
              <Button variant="outline" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                Challenges
              </Button>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Expense Tracker</span>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your spending, set budgets, and gain insights into your financial habits
          </p>
        </div>

        {/* Monthly Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingDown className="h-4 w-4 mr-2" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
              <p className="text-sm text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
              <p className="text-sm text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${budgetRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${Math.abs(budgetRemaining).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">{budgetRemaining >= 0 ? "Under budget" : "Over budget"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{currentMonthExpenses.length}</div>
              <p className="text-sm text-gray-500">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ExpenseChart expenses={currentMonthExpenses} />
              <BudgetTracker budgets={budgets} />
            </div>
          </TabsContent>

          <TabsContent value="add">
            <ExpenseForm onAddExpense={addExpense} />
          </TabsContent>

          <TabsContent value="transactions">
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetTracker budgets={budgets} onUpdateBudget={updateBudget} editable={true} />
          </TabsContent>

          <TabsContent value="insights">
            <ExpenseInsights expenses={expenses} budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
