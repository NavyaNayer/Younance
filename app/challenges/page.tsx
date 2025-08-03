"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Target, Zap, Star, Gift } from "lucide-react"
import Link from "next/link"
import { ChallengesList } from "@/components/challenges/challenges-list"
import { AchievementsList } from "@/components/challenges/achievements-list"
import { RewardsShop } from "@/components/challenges/rewards-shop"
import { ProgressOverview } from "@/components/challenges/progress-overview"

export interface Challenge {
  id: string
  title: string
  description: string
  type: "spending" | "saving" | "tracking" | "budget"
  target: number
  current: number
  points: number
  difficulty: "easy" | "medium" | "hard"
  deadline: string
  completed: boolean
  icon: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedDate?: string
  category: "spending" | "saving" | "tracking" | "streak" | "special"
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: "badges" | "themes" | "features" | "real"
  icon: string
  claimed: boolean
}

export interface UserProgress {
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  challengesCompleted: number
  achievementsUnlocked: number
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
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
    initializeGameData()
  }, [])

  const initializeGameData = () => {
    // Load or initialize challenges
    const savedChallenges = localStorage.getItem("younance-challenges")
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges))
    } else {
      const defaultChallenges = generateMonthlyChallenges()
      setChallenges(defaultChallenges)
      localStorage.setItem("younance-challenges", JSON.stringify(defaultChallenges))
    }

    // Load or initialize achievements
    const savedAchievements = localStorage.getItem("younance-achievements")
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      const defaultAchievements = generateAchievements()
      setAchievements(defaultAchievements)
      localStorage.setItem("younance-achievements", JSON.stringify(defaultAchievements))
    }

    // Load or initialize rewards
    const savedRewards = localStorage.getItem("younance-rewards")
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards))
    } else {
      const defaultRewards = generateRewards()
      setRewards(defaultRewards)
      localStorage.setItem("younance-rewards", JSON.stringify(defaultRewards))
    }

    // Load user progress
    const savedProgress = localStorage.getItem("younance-progress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }

    // Update progress based on current data
    updateUserProgress()
  }

  const generateMonthlyChallenges = (): Challenge[] => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0]

    return [
      {
        id: "spend-less-dining",
        title: "Dining Out Detective",
        description: "Spend less than $200 on dining out this month",
        type: "spending",
        target: 200,
        current: 0,
        points: 150,
        difficulty: "medium",
        deadline: endOfMonth,
        completed: false,
        icon: "🍽️",
      },
      {
        id: "track-daily",
        title: "Daily Tracker",
        description: "Log expenses for 20 days this month",
        type: "tracking",
        target: 20,
        current: 0,
        points: 100,
        difficulty: "easy",
        deadline: endOfMonth,
        completed: false,
        icon: "📝",
      },
      {
        id: "save-target",
        title: "Savings Superstar",
        description: "Save $500 more than your usual monthly savings",
        type: "saving",
        target: 500,
        current: 0,
        points: 200,
        difficulty: "hard",
        deadline: endOfMonth,
        completed: false,
        icon: "💰",
      },
      {
        id: "budget-master",
        title: "Budget Master",
        description: "Stay within budget in all categories",
        type: "budget",
        target: 7,
        current: 0,
        points: 250,
        difficulty: "hard",
        deadline: endOfMonth,
        completed: false,
        icon: "🎯",
      },
      {
        id: "coffee-challenge",
        title: "Coffee Shop Cutback",
        description: "Spend less than $50 on coffee this month",
        type: "spending",
        target: 50,
        current: 0,
        points: 75,
        difficulty: "easy",
        deadline: endOfMonth,
        completed: false,
        icon: "☕",
      },
      {
        id: "no-impulse",
        title: "Impulse Control Champion",
        description: "Go 10 days without unplanned purchases over $25",
        type: "spending",
        target: 10,
        current: 0,
        points: 180,
        difficulty: "medium",
        deadline: endOfMonth,
        completed: false,
        icon: "🛡️",
      },
    ]
  }

  const generateAchievements = (): Achievement[] => {
    return [
      {
        id: "first-expense",
        title: "Getting Started",
        description: "Log your first expense",
        icon: "🌟",
        points: 10,
        unlocked: false,
        category: "tracking",
      },
      {
        id: "week-streak",
        title: "Week Warrior",
        description: "Track expenses for 7 consecutive days",
        icon: "🔥",
        points: 50,
        unlocked: false,
        category: "streak",
      },
      {
        id: "month-streak",
        title: "Monthly Master",
        description: "Track expenses for 30 consecutive days",
        icon: "🏆",
        points: 200,
        unlocked: false,
        category: "streak",
      },
      {
        id: "budget-hero",
        title: "Budget Hero",
        description: "Stay under budget for 3 consecutive months",
        icon: "🦸",
        points: 300,
        unlocked: false,
        category: "budget",
      },
      {
        id: "savings-milestone",
        title: "Savings Milestone",
        description: "Save $1000 in a single month",
        icon: "💎",
        points: 250,
        unlocked: false,
        category: "saving",
      },
      {
        id: "challenge-champion",
        title: "Challenge Champion",
        description: "Complete 10 monthly challenges",
        icon: "👑",
        points: 500,
        unlocked: false,
        category: "special",
      },
      {
        id: "frugal-master",
        title: "Frugal Master",
        description: "Reduce spending by 20% compared to previous month",
        icon: "🎖️",
        points: 150,
        unlocked: false,
        category: "spending",
      },
      {
        id: "category-king",
        title: "Category King",
        description: "Stay under budget in all categories for one month",
        icon: "👑",
        points: 200,
        unlocked: false,
        category: "budget",
      },
    ]
  }

  const generateRewards = (): Reward[] => {
    return [
      {
        id: "gold-badge",
        title: "Gold Star Badge",
        description: "Show off your financial prowess",
        cost: 100,
        category: "badges",
        icon: "⭐",
        claimed: false,
      },
      {
        id: "dark-theme",
        title: "Dark Mode Theme",
        description: "Unlock sleek dark mode for the app",
        cost: 200,
        category: "themes",
        icon: "🌙",
        claimed: false,
      },
      {
        id: "premium-charts",
        title: "Premium Charts",
        description: "Access advanced analytics and charts",
        cost: 300,
        category: "features",
        icon: "📊",
        claimed: false,
      },
      {
        id: "coffee-voucher",
        title: "$5 Coffee Voucher",
        description: "Treat yourself to your favorite coffee",
        cost: 250,
        category: "real",
        icon: "☕",
        claimed: false,
      },
      {
        id: "diamond-badge",
        title: "Diamond Badge",
        description: "The ultimate achievement badge",
        cost: 500,
        category: "badges",
        icon: "💎",
        claimed: false,
      },
      {
        id: "custom-categories",
        title: "Custom Categories",
        description: "Create your own expense categories",
        cost: 150,
        category: "features",
        icon: "🏷️",
        claimed: false,
      },
    ]
  }

  const updateUserProgress = () => {
    const expenses = JSON.parse(localStorage.getItem("younance-expenses") || "[]")
    const currentChallenges = JSON.parse(localStorage.getItem("younance-challenges") || "[]")
    const currentAchievements = JSON.parse(localStorage.getItem("younance-achievements") || "[]")

    // Calculate tracking streak
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateString = checkDate.toISOString().split("T")[0]

      const hasExpenseOnDate = expenses.some((expense: any) => expense.date === dateString)
      if (hasExpenseOnDate) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    const completedChallenges = currentChallenges.filter((c: Challenge) => c.completed).length
    const unlockedAchievements = currentAchievements.filter((a: Achievement) => a.unlocked).length
    const totalPoints =
      currentChallenges.reduce((sum: number, c: Challenge) => sum + (c.completed ? c.points : 0), 0) +
      currentAchievements.reduce((sum: number, a: Achievement) => sum + (a.unlocked ? a.points : 0), 0)

    const level = Math.floor(totalPoints / 100) + 1

    const newProgress: UserProgress = {
      totalPoints,
      level,
      currentStreak: streak,
      longestStreak: Math.max(streak, userProgress.longestStreak),
      challengesCompleted: completedChallenges,
      achievementsUnlocked: unlockedAchievements,
    }

    setUserProgress(newProgress)
    localStorage.setItem("younance-progress", JSON.stringify(newProgress))
  }

  const completeChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.map((challenge) =>
      challenge.id === challengeId ? { ...challenge, completed: true } : challenge,
    )
    setChallenges(updatedChallenges)
    localStorage.setItem("younance-challenges", JSON.stringify(updatedChallenges))
    updateUserProgress()
    checkForNewAchievements()
  }

  const unlockAchievement = (achievementId: string) => {
    const updatedAchievements = achievements.map((achievement) =>
      achievement.id === achievementId
        ? { ...achievement, unlocked: true, unlockedDate: new Date().toISOString() }
        : achievement,
    )
    setAchievements(updatedAchievements)
    localStorage.setItem("younance-achievements", JSON.stringify(updatedAchievements))
    updateUserProgress()
  }

  const claimReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (reward && userProgress.totalPoints >= reward.cost) {
      const updatedRewards = rewards.map((r) => (r.id === rewardId ? { ...r, claimed: true } : r))
      setRewards(updatedRewards)
      localStorage.setItem("younance-rewards", JSON.stringify(updatedRewards))

      // Deduct points
      const newProgress = { ...userProgress, totalPoints: userProgress.totalPoints - reward.cost }
      setUserProgress(newProgress)
      localStorage.setItem("younance-progress", JSON.stringify(newProgress))
    }
  }

  const checkForNewAchievements = () => {
    const expenses = JSON.parse(localStorage.getItem("younance-expenses") || "[]")

    // Check for first expense achievement
    if (expenses.length >= 1 && !achievements.find((a) => a.id === "first-expense")?.unlocked) {
      unlockAchievement("first-expense")
    }

    // Check for streak achievements
    if (userProgress.currentStreak >= 7 && !achievements.find((a) => a.id === "week-streak")?.unlocked) {
      unlockAchievement("week-streak")
    }

    if (userProgress.currentStreak >= 30 && !achievements.find((a) => a.id === "month-streak")?.unlocked) {
      unlockAchievement("month-streak")
    }

    // Check for challenge completion achievements
    if (userProgress.challengesCompleted >= 10 && !achievements.find((a) => a.id === "challenge-champion")?.unlocked) {
      unlockAchievement("challenge-champion")
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/expenses" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Expenses</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Financial Challenges</span>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Challenges & Rewards</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete challenges, unlock achievements, and earn rewards while building better financial habits
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview userProgress={userProgress} />

        {/* Main Content */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            <ChallengesList
              challenges={challenges}
              onCompleteChallenge={completeChallenge}
              userProgress={userProgress}
            />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsList achievements={achievements} userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsShop rewards={rewards} userProgress={userProgress} onClaimReward={claimReward} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Your Financial Journey Stats</CardTitle>
                <CardDescription>Track your progress and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{userProgress.currentStreak}</div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{userProgress.challengesCompleted}</div>
                    <p className="text-sm text-gray-600">Challenges Completed</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{userProgress.achievementsUnlocked}</div>
                    <p className="text-sm text-gray-600">Achievements Unlocked</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Gift className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{userProgress.level}</div>
                    <p className="text-sm text-gray-600">Current Level</p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-2">Keep Going! 🚀</h3>
                  <p className="mb-4">
                    You're doing great with your financial journey. Every expense tracked and challenge completed brings
                    you closer to your goals!
                  </p>
                  <div className="text-sm opacity-90">
                    Next milestone: {Math.ceil(userProgress.totalPoints / 100) * 100} points (Level{" "}
                    {userProgress.level + 1})
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
