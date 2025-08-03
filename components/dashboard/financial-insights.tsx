"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb, ArrowUpRight, Target } from "lucide-react"

interface FinancialInsightsProps {
  userData: any
}

export function FinancialInsights({ userData }: FinancialInsightsProps) {
  const monthlySavings = Number.parseFloat(userData.monthlySavings) || 0
  const income = Number.parseFloat(userData.income) || 0
  const savingsRate = ((monthlySavings * 12) / income) * 100

  const insights = [
    {
      type: "positive",
      title: "Great Savings Rate!",
      description: `Your ${savingsRate.toFixed(1)}% savings rate is above the recommended 20%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      type: "tip",
      title: "Compound Interest Power",
      description: "Starting early gives you a 10+ year advantage over late starters",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      type: "opportunity",
      title: "Emergency Fund Check",
      description: "Consider building 3-6 months of expenses as an emergency fund",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      type: "insight",
      title: "Investment Diversification",
      description: "Your moderate risk profile suggests a balanced portfolio approach",
      icon: Target,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <span>Financial Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}>
              <div className="flex items-start space-x-3">
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1">
                  <h4 className={`font-semibold ${insight.color} mb-1`}>{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                </div>
                {insight.type === "opportunity" && <ArrowUpRight className={`h-4 w-4 ${insight.color}`} />}
              </div>
            </div>
          ))}
        </div>

        {/* Key Metrics Summary */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold text-gray-900 mb-3">Your Financial Health Score</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">A+</div>
              <div className="text-xs text-gray-600">Savings Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">B+</div>
              <div className="text-xs text-gray-600">Goal Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">A</div>
              <div className="text-xs text-gray-600">Risk Balance</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
