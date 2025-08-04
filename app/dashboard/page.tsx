"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Bot,
  BarChart3,
  Download,
} from "lucide-react"
import Link from "next/link"
import { GrowthChart } from "@/components/growth-chart"
import { GoalProgress } from "@/components/goal-progress"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { FinancialInsights } from "@/components/dashboard/financial-insights"
import { ChallengePreview } from "@/components/dashboard/challenge-preview"
import { FinancialNews } from "@/components/dashboard/financial-news"

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

  // Helper functions - must be defined before useMemo
  const getReturnRate = () => {
    if (!userData) return 0.09
    switch (userData?.riskTolerance) {
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
    if (!userData) return 0
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

  // Memoize expensive calculations - must be called before any conditional returns
  const { projectedValue, progressPercentage, targetYears, goalAmount } = useMemo(() => {
    if (!userData) return { projectedValue: 0, progressPercentage: 0, targetYears: 10, goalAmount: 0 }
    
    const targetYears = Number.parseInt(userData.timeframe) || 10
    const projectedValue = calculateFutureValue(targetYears)
    const goalAmount = Number.parseFloat(userData.goalAmount) || 0
    const progressPercentage = goalAmount > 0 ? Math.min((projectedValue / goalAmount) * 100, 100) : 0
    
    return { projectedValue, progressPercentage, targetYears, goalAmount }
  }, [userData])

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

  // Calculate level progress
  const pointsToNextLevel = userProgress.level * 100 - userProgress.totalPoints
  const levelProgress = ((userProgress.totalPoints % 100) / 100) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 relative overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-green-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 overflow-x-hidden">
        <nav className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">YouNance</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 flex-wrap">
            {/* Level Badge */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 md:px-4 py-2 rounded-xl shadow-lg min-w-0">
              <Star className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-semibold whitespace-nowrap">Level {userProgress.level}</span>
            </div>

            {/* Streak Badge */}
            {userProgress.currentStreak > 0 && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 md:px-4 py-2 rounded-xl shadow-lg min-w-0">
                <Zap className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">{userProgress.currentStreak} day streak</span>
              </div>
            )}

            <div className="hidden lg:block text-right min-w-0">
              <span className="text-gray-900 font-semibold text-lg block truncate">Welcome back, {userData.name}!</span>
              <p className="text-sm font-medium text-gray-600 tabular-nums">{userProgress.totalPoints} points earned</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-2 hover:shadow-lg transition-all duration-300 flex-shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 overflow-x-hidden max-w-full">
        {/* Welcome Section with Future You Promotion */}
        <div className="mb-8 max-w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight min-w-0">Your Financial Dashboard</h2>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 animate-pulse whitespace-nowrap flex-shrink-0">
                  ✨ Chat with Future You
                </Badge>
              </div>
              <p className="text-lg md:text-xl text-gray-600 font-medium">Connect with your future self and unlock financial wisdom</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tabular-nums">{userProgress.totalPoints} pts</div>
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

        {/* Future You - Main Feature */}
        <div className="mb-8">
          <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 border-2 border-purple-200/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5"></div>
            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <span>Chat with Your Future Self</span>
                  <Badge className="ml-3 bg-white/20 text-white border-white/30">
                    AI Powered
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription className="text-purple-100 text-lg">
                Experience wisdom from your {targetYears}-year future self who achieved financial freedom
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Meet Your Future Self</h4>
                        <p className="text-gray-600 text-sm">At age {Number.parseInt(userData.age) + targetYears}, you've achieved your <CurrencyDisplay amount={goalAmount} /> goal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <MessageCircle className="h-4 w-4 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Get Personal Wisdom</h4>
                        <p className="text-gray-600 text-sm">Receive specific advice about your financial journey and life decisions</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Learn from Success</h4>
                        <p className="text-gray-600 text-sm">Understand the exact steps that led to your financial independence</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/chat">
                    <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Start Conversation with Future You
                    </Button>
                  </Link>
                </div>

                <div className="relative">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-200/50">
                          <p className="text-gray-800 font-medium text-sm italic">
                            "Hey {userData.name}! It's amazing to look back and see how those small monthly savings of <CurrencyDisplay amount={userData.monthlySavings} /> grew into <CurrencyDisplay amount={Math.round(projectedValue)} />. The compound interest was incredible! You're making all the right moves - keep going! 🚀"
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Future {userData.name} • Age {Number.parseInt(userData.age) + targetYears}</p>
                      </div>
                    </div>
                    
                    <div className="text-center py-4">
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full px-4 py-2 border border-purple-200/30">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">Your future self is online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Financial Report - Second Main Feature */}
        <div className="mb-8">
          <Card className="overflow-hidden bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border-2 border-emerald-200/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5"></div>
            <CardHeader className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>AI Financial Health Report</span>
                    <Badge className="ml-3 bg-white/20 text-white border-white/30">
                      AI Powered
                    </Badge>
                  </div>
                  <div className="text-emerald-100 text-sm font-normal mt-1">
                    Comprehensive analysis with personalized insights and recommendations
                  </div>
                </div>
              </CardTitle>
              <div className="bg-white/10 rounded-lg p-3 mt-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-emerald-200">Health Score:</span>
                    <div className="font-semibold text-lg">85/100</div>
                  </div>
                  <div>
                    <span className="text-emerald-200">Analysis:</span>
                    <div className="font-semibold">Complete</div>
                  </div>
                  <div>
                    <span className="text-emerald-200">Status:</span>
                    <div className="font-semibold flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Ready
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <BarChart3 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Complete Financial Analysis</h4>
                        <p className="text-gray-600 text-sm">AI analyzes 5 key areas: savings rate, debt management, investment strategy, emergency fund, and goal progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Personalized Recommendations</h4>
                        <p className="text-gray-600 text-sm">Get specific, actionable advice tailored to your financial situation and goals</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Download className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Professional PDF Export</h4>
                        <p className="text-gray-600 text-sm">Download your complete financial report as a professional PDF document</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/report">
                    <Button size="lg" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <FileText className="h-5 w-5 mr-2" />
                      Generate My AI Financial Report
                    </Button>
                  </Link>
                </div>

                <div className="relative">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">📊 Financial Health Score</span>
                        <span className="text-2xl font-bold text-emerald-600">85/100</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">💰 Savings Rate</span>
                          <div className="flex items-center gap-2">
                            <Progress value={90} className="w-16 h-2" />
                            <span className="font-semibold text-green-600">90%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">🎯 Goal Progress</span>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercentage} className="w-16 h-2" />
                            <span className="font-semibold text-emerald-600">{Math.round(progressPercentage)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">📈 Investment Strategy</span>
                          <div className="flex items-center gap-2">
                            <Progress value={75} className="w-16 h-2" />
                            <span className="font-semibold text-blue-600">75%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3">
                          <p className="text-xs text-gray-700 font-medium mb-1">💡 AI Insight:</p>
                          <p className="text-xs text-gray-600 italic">
                            "Your savings rate is excellent! Consider diversifying 15% into growth investments to accelerate your goal timeline by 2.3 years."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </div>
  )
}
