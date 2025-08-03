"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Edit2, Check, X, AlertTriangle, CheckCircle } from "lucide-react"
import { CurrencyDisplay } from "@/components/ui/currency"
import type { Budget } from "@/app/expenses/page"

interface BudgetTrackerProps {
  budgets: Budget[]
  onUpdateBudget?: (category: string, budgeted: number) => void
  editable?: boolean
}

export function BudgetTracker({ budgets, onUpdateBudget, editable = false }: BudgetTrackerProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleEdit = (category: string, currentBudget: number) => {
    setEditingCategory(category)
    setEditValue(currentBudget.toString())
  }

  const handleSave = (category: string) => {
    const newBudget = Number.parseFloat(editValue)
    if (newBudget > 0 && onUpdateBudget) {
      onUpdateBudget(category, newBudget)
    }
    setEditingCategory(null)
    setEditValue("")
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setEditValue("")
  }

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0

  const getBudgetStatus = (budget: Budget) => {
    const percentage = budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0
    if (percentage > 100) return { status: "over", color: "text-red-600", bgColor: "bg-red-50" }
    if (percentage > 80) return { status: "warning", color: "text-orange-600", bgColor: "bg-orange-50" }
    return { status: "good", color: "text-green-600", bgColor: "bg-green-50" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
        <CardDescription>Monitor your spending against your budget</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Overall Budget</span>
            <span className="text-sm text-gray-600">
              <CurrencyDisplay amount={totalSpent} /> / <CurrencyDisplay amount={totalBudgeted} />
            </span>
          </div>
          <Progress value={Math.min(overallProgress, 100)} className="h-3" />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={overallProgress > 100 ? "text-red-600" : "text-gray-600"}>
              {overallProgress.toFixed(1)}% used
            </span>
            <span className={overallProgress > 100 ? "text-red-600" : "text-green-600"}>
              <CurrencyDisplay amount={Math.abs(totalBudgeted - totalSpent)} /> {overallProgress > 100 ? "over" : "remaining"}
            </span>
          </div>
        </div>

        {/* Category Budgets */}
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0
            const status = getBudgetStatus(budget)
            const remaining = budget.budgeted - budget.spent

            return (
              <div key={budget.category} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{budget.category}</h4>
                    {status.status === "over" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {status.status === "good" && percentage > 0 && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>

                  {editable && (
                    <div className="flex items-center space-x-2">
                      {editingCategory === budget.category ? (
                        <>
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 h-8 text-sm"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSave(budget.category)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancel}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(budget.category, budget.budgeted)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Progress value={Math.min(percentage, 100)} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      <CurrencyDisplay amount={budget.spent} /> spent
                    </span>
                    <span className="text-gray-600">
                      <CurrencyDisplay amount={budget.budgeted} /> budgeted
                    </span>
                  </div>

                  <div className={`text-sm font-medium ${status.color}`}>
                    {remaining >= 0
                      ? <><CurrencyDisplay amount={remaining} /> remaining ({(100 - percentage).toFixed(1)}%)</>
                      : <><CurrencyDisplay amount={Math.abs(remaining)} /> over budget ({(percentage - 100).toFixed(1)}% over)</>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Budget Tips */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Budget Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Review and adjust budgets monthly</li>
            <li>• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Track daily to stay on top of spending</li>
            <li>• Set alerts when you reach 80% of any budget</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
