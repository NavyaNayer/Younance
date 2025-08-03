"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Star } from "lucide-react"
import type { Challenge, UserProgress } from "@/app/challenges/page"

interface ChallengesListProps {
  challenges: Challenge[]
  onCompleteChallenge: (challengeId: string) => void
  userProgress: UserProgress
}

export function ChallengesList({ challenges, onCompleteChallenge, userProgress }: ChallengesListProps) {
  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    updateChallengeProgress()
  }, [challenges])

  const updateChallengeProgress = () => {
    const expenses = JSON.parse(localStorage.getItem("younance-expenses") || "[]")
    const budgets = JSON.parse(localStorage.getItem("younance-budgets") || "[]")

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const progress: Record<string, number> = {}

    challenges.forEach((challenge) => {
      switch (challenge.id) {
        case "spend-less-dining":
          const diningExpenses = expenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date)
            return (
              expense.category === "Food & Dining" &&
              expense.type === "expense" &&
              expenseDate.getMonth() === currentMonth &&
              expenseDate.getFullYear() === currentYear
            )
          })
          progress[challenge.id] = diningExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
          break

        case "track-daily":
          const uniqueDays = new Set(
            expenses
              .filter((expense: any) => {
                const expenseDate = new Date(expense.date)
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
              })
              .map((expense: any) => expense.date),
          )
          progress[challenge.id] = uniqueDays.size
          break

        case "save-target":
          // This would need integration with actual savings tracking
          progress[challenge.id] = Math.floor(Math.random() * 300) // Placeholder
          break

        case "budget-master":
          const categoriesUnderBudget = budgets.filter((budget: any) => budget.spent <= budget.budgeted).length
          progress[challenge.id] = categoriesUnderBudget
          break

        case "coffee-challenge":
          const coffeeExpenses = expenses.filter((expense: any) => {
            const expenseDate = new Date(expense.date)
            return (
              (expense.description.toLowerCase().includes("coffee") ||
                expense.description.toLowerCase().includes("starbucks") ||
                expense.description.toLowerCase().includes("cafe")) &&
              expense.type === "expense" &&
              expenseDate.getMonth() === currentMonth &&
              expenseDate.getFullYear() === currentYear
            )
          })
          progress[challenge.id] = coffeeExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
          break

        case "no-impulse":
          // Count days without impulse purchases (placeholder logic)
          progress[challenge.id] = Math.floor(Math.random() * 8)
          break

        default:
          progress[challenge.id] = challenge.current
      }
    })

    setChallengeProgress(progress)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (challenge: Challenge) => {
    const current = challengeProgress[challenge.id] || 0
    if (challenge.type === "spending") {
      // For spending challenges, progress is inverse (less spending = more progress)
      return Math.max(0, Math.min(100, ((challenge.target - current) / challenge.target) * 100))
    }
    return Math.min(100, (current / challenge.target) * 100)
  }

  const isCompleted = (challenge: Challenge) => {
    const current = challengeProgress[challenge.id] || 0
    if (challenge.type === "spending") {
      return current <= challenge.target
    }
    return current >= challenge.target
  }

  const formatProgress = (challenge: Challenge) => {
    const current = challengeProgress[challenge.id] || 0
    if (challenge.type === "spending") {
      return `$${current.toLocaleString()} / $${challenge.target.toLocaleString()}`
    }
    return `${current} / ${challenge.target}`
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const activeChallenges = challenges.filter((c) => !c.completed)
  const completedChallenges = challenges.filter((c) => c.completed)

  return (
    <div className="space-y-6">
      {/* Active Challenges */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Challenges</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {activeChallenges.map((challenge) => {
            const progressPercentage = getProgressPercentage(challenge)
            const completed = isCompleted(challenge)
            const daysRemaining = getDaysRemaining(challenge.deadline)

            return (
              <Card key={challenge.id} className={`${completed ? "ring-2 ring-green-500" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{formatProgress(challenge)}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{challenge.points} pts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{daysRemaining} days left</span>
                      </div>
                    </div>

                    {completed && !challenge.completed && (
                      <Button
                        onClick={() => onCompleteChallenge(challenge.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Claim Reward
                      </Button>
                    )}
                  </div>

                  {completed && !challenge.completed && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 text-sm font-medium">
                        🎉 Challenge completed! Click to claim your {challenge.points} points.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Challenges</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{challenge.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">{challenge.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>+{challenge.points} pts earned</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Challenge Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Track your expenses daily to build a strong streak and complete tracking challenges</li>
            <li>• Set up budget alerts to help you stay within spending limits</li>
            <li>• Use the "quick amounts" feature when adding expenses to save time</li>
            <li>• Review your progress weekly to stay motivated and on track</li>
            <li>• Complete easier challenges first to build momentum and earn points</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
