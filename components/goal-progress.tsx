"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Calendar } from "lucide-react"

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

interface GoalProgressProps {
  userData: UserData
}

export function GoalProgress({ userData }: GoalProgressProps) {
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

  const calculateFutureValue = (years: number) => {
    const currentSavings = Number.parseFloat(userData.currentSavings) || 0
    const monthlySavings = Number.parseFloat(userData.monthlySavings) || 0
    const annualRate = getReturnRate()
    const monthlyRate = annualRate / 12
    const months = years * 12

    // Future value of current savings
    const futureCurrentSavings = currentSavings * Math.pow(1 + annualRate, years)

    // Future value of monthly contributions
    const futureMonthlySavings = (monthlySavings * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate

    return futureCurrentSavings + futureMonthlySavings
  }

  const targetYears = Number.parseInt(userData.timeframe) || 10
  const projectedValue = calculateFutureValue(targetYears)
  const goalAmount = Number.parseFloat(userData.goalAmount) || 0
  const progressPercentage = Math.min((projectedValue / goalAmount) * 100, 100)
  const surplus = projectedValue - goalAmount
  const currentAge = Number.parseInt(userData.age) || 25
  const futureAge = currentAge + targetYears

  const getGoalEmoji = (goal: string) => {
    switch (goal) {
      case "retirement":
        return "🏖️"
      case "house":
        return "🏠"
      case "travel":
        return "✈️"
      case "education":
        return "🎓"
      case "emergency":
        return "🛡️"
      default:
        return "🎯"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Goal Progress</span>
        </CardTitle>
        <CardDescription>Track your progress towards your {userData.goal} goal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal Overview */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-4xl mb-2">{getGoalEmoji(userData.goal)}</div>
          <h3 className="font-semibold text-lg capitalize">{userData.goal}</h3>
          <p className="text-gray-600">
            ${goalAmount.toLocaleString()} by age {futureAge}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Projected Value</p>
            <p className="font-semibold text-green-600">${Math.round(projectedValue).toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Time to Goal</p>
            <p className="font-semibold text-blue-600">{targetYears} years</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-4 rounded-lg bg-gray-50">
          {progressPercentage >= 100 ? (
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-2">🎉 Congratulations!</p>
              <p className="text-sm text-gray-600">
                You're on track to exceed your goal by ${Math.round(surplus).toLocaleString()}! Your future self will
                thank you for starting early.
              </p>
            </div>
          ) : progressPercentage >= 80 ? (
            <div className="text-center">
              <p className="text-blue-600 font-semibold mb-2">🚀 Almost There!</p>
              <p className="text-sm text-gray-600">
                You're very close to your goal. Consider increasing your monthly savings by just a little bit to reach
                it faster.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-orange-600 font-semibold mb-2">💪 Keep Going!</p>
              <p className="text-sm text-gray-600">
                You're making great progress! Consider increasing your monthly savings or extending your timeframe to
                reach your goal.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
