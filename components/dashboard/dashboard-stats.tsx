"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, PiggyBank, Calendar, Zap, Star } from "lucide-react"
import { useFormatCurrency } from "@/hooks/use-currency"

interface DashboardStatsProps {
  userData: any
  userProgress: any
  projectedValue: number
  progressPercentage: number
}

export function DashboardStats({ userData, userProgress, projectedValue, progressPercentage }: DashboardStatsProps) {
  const currentSavings = Number.parseFloat(userData.currentSavings) || 0
  const monthlySavings = Number.parseFloat(userData.monthlySavings) || 0
  const income = Number.parseFloat(userData.income) || 0
  const savingsRate = ((monthlySavings * 12) / income) * 100
  const formatCurrency = useFormatCurrency()

  const stats = [
    {
      title: "Current Savings",
      value: formatCurrency(currentSavings),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: PiggyBank,
      description: "Total saved so far",
    },
    {
      title: "Projected Value",
      value: formatCurrency(Math.round(projectedValue)),
      change: `${progressPercentage.toFixed(1)}% of goal`,
      changeType: progressPercentage >= 100 ? "positive" : ("neutral" as const),
      icon: TrendingUp,
      description: `In ${userData.timeframe} years`,
    },
    {
      title: "Monthly Savings",
      value: formatCurrency(monthlySavings),
      change: `${savingsRate.toFixed(1)}% of income`,
      changeType: savingsRate >= 20 ? "positive" : ("neutral" as const),
      icon: Calendar,
      description: "Automatic contributions",
    },
    {
      title: "Total Points",
      value: userProgress.totalPoints.toLocaleString(),
      change: `Level ${userProgress.level}`,
      changeType: "positive" as const,
      icon: Star,
      description: "Gamification progress",
    },
    {
      title: "Current Streak",
      value: `${userProgress.currentStreak} days`,
      change: `Best: ${userProgress.longestStreak} days`,
      changeType: userProgress.currentStreak > 0 ? "positive" : ("neutral" as const),
      icon: Zap,
      description: "Daily engagement",
    },
    {
      title: "Goal Progress",
      value: `${Math.round(progressPercentage)}%`,
      change: userData.goal,
      changeType: progressPercentage >= 75 ? "positive" : progressPercentage >= 50 ? "neutral" : ("negative" as const),
      icon: Target,
      description: "On track for success",
    },
  ]

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-emerald-600 bg-emerald-50"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-emerald-600"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.changeType === "positive"
        const isNeutral = stat.changeType === "neutral"

        return (
          <Card 
            key={index} 
            className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            {/* Gradient background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ${
                isPositive ? 'bg-gradient-to-br from-green-100 to-green-200' :
                isNeutral ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                'bg-gradient-to-br from-red-100 to-red-200'
              }`}>
                <Icon className={`h-6 w-6 ${
                  isPositive ? 'text-green-600' :
                  isNeutral ? 'text-emerald-600' :
                  'text-red-600'
                }`} />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={isPositive ? "default" : isNeutral ? "secondary" : "destructive"}
                    className={`${
                      isPositive 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : isNeutral 
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    } border-0`}
                  >
                    {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
                    {!isPositive && !isNeutral && <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{stat.description}</p>

                {/* Progress bar for goal progress */}
                {stat.title === "Goal Progress" && (
                  <Progress 
                    value={Math.min(progressPercentage, 100)} 
                    className="h-2 mt-2 bg-gray-200" 
                  />
                )}

                {/* Level progress for points */}
                {stat.title === "Total Points" && (
                  <Progress 
                    value={((userProgress.totalPoints % 100) / 100) * 100} 
                    className="h-2 mt-2 bg-gray-200" 
                  />
                )}
              </div>
            </CardContent>

            {/* Decorative gradient accent */}
            <div
              className={`absolute top-0 right-0 w-1 h-full ${
                isPositive
                  ? "bg-gradient-to-b from-green-400 to-green-600"
                  : isNeutral
                  ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
                  : "bg-gradient-to-b from-red-400 to-red-600"
              }`}
            />
          </Card>
        )
      })}
    </div>
  )
}
