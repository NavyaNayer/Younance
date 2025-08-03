"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CurrencyDisplay } from "@/components/ui/currency"
import { useFormatCurrency, useCurrency } from "@/hooks/use-currency"
import {
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Calculator,
  Settings,
  User,
  Trophy,
  Target,
  Zap,
  Star,
  Calendar,
  PiggyBank,
  Sparkles,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { GrowthChart } from "@/components/growth-chart"
import { WhatIfCalculator } from "@/components/what-if-calculator"
import { GoalProgress } from "@/components/goal-progress"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { FinancialInsights } from "@/components/dashboard/financial-insights"
import { ChallengePreview } from "@/components/dashboard/challenge-preview"
import { FinancialNews } from "@/components/dashboard/financial-news"
import { FinancialReport } from "@/components/financial-report"

interface UserData {
  name: string
  age: string
  income: string
  currency: string
  currentSavings: string
  monthlySavings: string
  goal: string
  goalAmount: string
  timeframe: string
  riskTolerance: string
  expenses: string
}

interface UserProgress {
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  challengesCompleted: number
  achievementsUnlocked: number
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    challengesCompleted: 0,
    achievementsUnlocked: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }

    // Load user progress
    const savedProgress = localStorage.getItem("younance-progress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  if (!mounted) return null

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome to YouNance</CardTitle>
            <CardDescription>Let's set up your profile to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/setup">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Complete Setup
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  // Calculate level progress
  const pointsToNextLevel = userProgress.level * 100 - userProgress.totalPoints
  const levelProgress = ((userProgress.totalPoints % 100) / 100) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">YouNance</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Level Badge */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-xl shadow-lg">
              <Star className="h-4 w-4" />
              <span className="text-sm font-semibold">Level {userProgress.level}</span>
            </div>

            {/* Streak Badge */}
            {userProgress.currentStreak > 0 && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-xl shadow-lg">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-semibold">{userProgress.currentStreak} day streak</span>
              </div>
            )}

            <div className="hidden md:block text-right">
              <span className="text-gray-900 font-semibold text-lg">Welcome back, {userData.name}!</span>
              <p className="text-sm font-medium text-gray-600 tabular-nums">{userProgress.totalPoints} points earned</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-2 hover:shadow-lg transition-all duration-300">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Welcome Section with Level Progress */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Your Financial Dashboard</h2>
                <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 animate-pulse">
                  NEW: Financial Report
                </Badge>
              </div>
              <p className="text-xl text-gray-600 font-medium">Track your progress and achieve your financial goals</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tabular-nums">{userProgress.totalPoints} pts</div>
              <div className="text-sm font-medium text-gray-600">
                {pointsToNextLevel > 0 ? `${pointsToNextLevel} to level ${userProgress.level + 1}` : "Max level reached!"}
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">Level Progress</span>
              <span className="text-sm font-medium text-gray-600 tabular-nums">{levelProgress.toFixed(0)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3 bg-gray-200" />
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <DashboardStats
          userData={userData}
          userProgress={userProgress}
          projectedValue={projectedValue}
          progressPercentage={progressPercentage}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Charts and Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goal Progress with Enhanced Visual */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Goal Progress</span>
                </CardTitle>
                                <CardDescription className="text-emerald-100">
                  Your journey to financial freedom
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      <CurrencyDisplay amount={goalAmount} /> by age {Number.parseInt(userData.age) + targetYears}
                    </span>
                    <Badge variant={progressPercentage >= 100 ? "default" : "secondary"} className="text-lg px-3 py-1">
                      {Math.round(progressPercentage)}%
                    </Badge>
                  </div>

                  <Progress value={progressPercentage} className="h-4" />

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        <CurrencyDisplay amount={Math.round(projectedValue)} />
                      </div>
                      <p className="text-sm text-green-700">Projected Value</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">{targetYears} years</div>
                      <p className="text-sm text-emerald-700">Time Remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Insights */}
            <FinancialInsights userData={userData} />

            {/* Growth Chart */}
            <GrowthChart userData={userData} />

            {/* This Month Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span>This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Expenses</span>
                    </div>
                    <span className="font-semibold text-red-600"><CurrencyDisplay amount={1234} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Income</span>
                    </div>
                    <span className="font-semibold text-green-600"><CurrencyDisplay amount={4500} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PiggyBank className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Saved</span>
                    </div>
                    <span className="font-semibold text-emerald-600"><CurrencyDisplay amount={3266} /></span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Savings Rate</span>
                      <span className="font-bold text-green-600">72.6%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity, News and Challenges */}
          <div className="space-y-6">
            {/* Financial News Widget */}
            <FinancialNews />

            {/* Challenge Preview */}
            <ChallengePreview userProgress={userProgress} />

            {/* Recent Activity */}
            <RecentActivity />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Your Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Challenges Completed</span>
                    <span className="font-semibold">{userProgress.challengesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Achievements Unlocked</span>
                    <span className="font-semibold">{userProgress.achievementsUnlocked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Longest Streak</span>
                    <span className="font-semibold">{userProgress.longestStreak} days</span>
                  </div>

                  <Link href="/challenges">
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      <Trophy className="h-4 w-4 mr-2" />
                      View All Challenges
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Report</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>What-If</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <GoalProgress userData={userData} />

              {/* Enhanced What-If Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick What-If Scenario</CardTitle>
                  <CardDescription>See how small changes impact your future</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-emerald-900 mb-2">💡 What if you saved <CurrencyDisplay amount={100} /> more per month?</h4>
                      <div className="text-2xl font-bold text-emerald-600">
                        +<CurrencyDisplay amount={Math.round(calculateFutureValue(targetYears) * 0.15)} />
                      </div>
                      <p className="text-sm text-emerald-700">Additional value in {targetYears} years</p>
                    </div>

                    <Link href="/dashboard?tab=calculator">
                      <Button className="w-full bg-transparent" variant="outline">
                        <Calculator className="h-4 w-4 mr-2" />
                        Explore More Scenarios
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="report">
            <FinancialReport 
              userData={userData}
              userProgress={userProgress}
              projectedValue={projectedValue}
              progressPercentage={progressPercentage}
            />
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat with Your Future Self</CardTitle>
                <CardDescription>Have a conversation with your future self or ask financial questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">✨ Future You</h4>
                      <p className="text-sm text-purple-700 mb-3">
                        Chat with your future self from {targetYears} years ahead
                      </p>
                      <Link href="/chat?tab=future-self">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Start Conversation
                        </Button>
                      </Link>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">🤖 Financial Assistant</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Get expert financial advice and learn about investing
                      </p>
                      <Link href="/chat?tab=assistant">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                          Ask Questions
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <WhatIfCalculator userData={userData} />
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Review and update your financial information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900 font-semibold">{userData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Age</label>
                      <p className="text-gray-900 font-semibold">{userData.age} years old</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Annual Income</label>
                      <p className="text-gray-900 font-semibold">
                        <CurrencyDisplay amount={userData.income} />
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Monthly Savings</label>
                      <p className="text-gray-900 font-semibold">
                        <CurrencyDisplay amount={userData.monthlySavings} />
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Goal</label>
                      <p className="text-gray-900 font-semibold capitalize">{userData.goal}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Target Amount</label>
                      <p className="text-gray-900 font-semibold">
                        <CurrencyDisplay amount={Number.parseFloat(userData.goalAmount)} />
                      </p>
                    </div>
                  </div>
                  <Link href="/setup">
                    <Button variant="outline" className="mt-4 bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Risk Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile</CardTitle>
                  <CardDescription>Your risk tolerance and investment strategy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Risk Tolerance</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={userData.riskTolerance === "conservative" ? "default" : "secondary"}>
                        {userData.riskTolerance}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        ({(getReturnRate() * 100).toFixed(0)}% expected return)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Investment Timeline</label>
                    <p className="text-gray-900 font-semibold">{userData.timeframe} years</p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Recommended Actions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Review your portfolio allocation quarterly</li>
                      <li>• Consider increasing contributions annually</li>
                      <li>• Rebalance investments based on market conditions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
