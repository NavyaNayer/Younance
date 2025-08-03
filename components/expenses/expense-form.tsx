"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus } from "lucide-react"
import type { Expense } from "@/app/expenses/page"

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [type, setType] = useState<"expense" | "income">("expense")

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Travel",
    "Education",
    "Personal Care",
    "Gifts & Donations",
    "Other",
  ]

  const incomeCategories = ["Salary", "Freelance", "Business", "Investments", "Rental", "Gifts", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category || !description) return

    onAddExpense({
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
      type,
    })

    // Reset form
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const quickAmounts = type === "expense" ? [5, 10, 25, 50, 100] : [500, 1000, 2000, 5000]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {type === "expense" ? (
            <Minus className="h-5 w-5 text-red-600" />
          ) : (
            <Plus className="h-5 w-5 text-green-600" />
          )}
          <span>Add {type === "expense" ? "Expense" : "Income"}</span>
        </CardTitle>
        <CardDescription>
          Track your {type === "expense" ? "spending" : "earnings"} to better understand your financial habits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={type} onValueChange={(value) => setType(value as "expense" | "income")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="expense" className="flex items-center space-x-2">
              <Minus className="h-4 w-4" />
              <span>Expense</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Income</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={type}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm text-gray-600">Quick amounts:</span>
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="h-7 px-2 text-xs"
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${type} category`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(type === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder={`What was this ${type} for?`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <Button
                type="submit"
                className={`w-full ${
                  type === "expense" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Add {type === "expense" ? "Expense" : "Income"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
