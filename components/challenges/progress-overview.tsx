"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Star, Target } from "lucide-react"
import type { UserProgress } from "@/app/challenges/page"

interface ProgressOverviewProps {
  userProgress: UserProgress
}

export function ProgressOverview({ userProgress }: ProgressOverviewProps) {
  const pointsToNextLevel = userProgress.level * 100 - userProgress.totalPoints
  const levelProgress = ((userProgress.totalPoints % 100) / 100) * 100

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {/* Level & Points */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Level {userProgress.level}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{userProgress.totalPoints} pts</div>
          <Progress value={levelProgress} className="h-2 bg-white/20" />
          <p className="text-sm mt-2 opacity-90">
            {pointsToNextLevel > 0 ? `${pointsToNextLevel} pts to level ${userProgress.level + 1}` : "Max level!"}
          </p>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2 text-orange-600">
            <Zap className="h-5 w-5" />
            <span>Streak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
          <p className="text-sm text-gray-600">days tracking</p>
          <p className="text-xs text-gray-500 mt-1">Best: {userProgress.longestStreak} days</p>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2 text-green-600">
            <Target className="h-5 w-5" />
            <span>Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{userProgress.challengesCompleted}</div>
          <p className="text-sm text-gray-600">completed</p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center space-x-2 text-purple-600">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{userProgress.achievementsUnlocked}</div>
          <p className="text-sm text-gray-600">unlocked</p>
        </CardContent>
      </Card>
    </div>
  )
}
