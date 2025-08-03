"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle, Star, Trophy } from "lucide-react"
import type { Achievement, UserProgress } from "@/app/challenges/page"

interface AchievementsListProps {
  achievements: Achievement[]
  userProgress: UserProgress
}

export function AchievementsList({ achievements, userProgress }: AchievementsListProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "spending":
        return "bg-red-100 text-red-800"
      case "saving":
        return "bg-green-100 text-green-800"
      case "tracking":
        return "bg-blue-100 text-blue-800"
      case "streak":
        return "bg-orange-100 text-orange-800"
      case "special":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlocked Achievements ({unlockedAchievements.length})</h2>
        {unlockedAchievements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-yellow-900">{achievement.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Unlocked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-yellow-800 mb-3">{achievement.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(achievement.category)}>{achievement.category}</Badge>
                    <div className="flex items-center space-x-1 text-yellow-700">
                      <Star className="h-4 w-4" />
                      <span className="font-semibold">+{achievement.points} pts</span>
                    </div>
                  </div>
                  {achievement.unlockedDate && (
                    <p className="text-xs text-yellow-600 mt-2">Unlocked on {formatDate(achievement.unlockedDate)}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No achievements unlocked yet</p>
              <p className="text-sm text-gray-500">Complete challenges and track expenses to unlock achievements!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Locked Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Locked Achievements ({lockedAchievements.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements.map((achievement) => (
            <Card key={achievement.id} className="bg-gray-50 border-gray-200 opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl grayscale">
                      {achievement.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-700">{achievement.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Locked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-3">{achievement.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <Badge className="bg-gray-200 text-gray-600">{achievement.category}</Badge>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Star className="h-4 w-4" />
                    <span>{achievement.points} pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Categories */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">🏆 Achievement Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Tracking</h4>
              <p className="text-purple-700">Achievements for consistent expense tracking and building habits</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Streak</h4>
              <p className="text-purple-700">Rewards for maintaining daily tracking streaks</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Spending</h4>
              <p className="text-purple-700">Achievements for smart spending and cost reduction</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Saving</h4>
              <p className="text-purple-700">Milestones for reaching savings goals and targets</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
