"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Calendar, Star, Zap, Gift } from "lucide-react"
import Link from "next/link"

interface ChallengePreviewProps {
  userProgress: any
}

export function ChallengePreview({ userProgress }: ChallengePreviewProps) {
  const activeChallenges = [
    {
      id: "1",
      title: "No Coffee Week",
      description: "Skip coffee purchases for 7 days",
      progress: 3,
      target: 7,
      reward: 100,
      difficulty: "Medium",
      daysLeft: 4,
      type: "spending",
    },
    {
      id: "2",
      title: "Daily Expense Tracker",
      description: "Log expenses every day this month",
      progress: 15,
      target: 30,
      reward: 200,
      difficulty: "Easy",
      daysLeft: 15,
      type: "habit",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "spending":
        return Target
      case "habit":
        return Zap
      case "saving":
        return Star
      default:
        return Trophy
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Active Challenges</span>
          </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Challenges
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeChallenges.map((challenge) => {
            const TypeIcon = getTypeIcon(challenge.type)
            const progressPercentage = (challenge.progress / challenge.target) * 100

            return (
              <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <TypeIcon className="h-4 w-4 text-emerald-600" />
                    <h4 className="font-semibold text-gray-900 text-sm">{challenge.title}</h4>
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">{challenge.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Progress: {challenge.progress}/{challenge.target}
                    </span>
                    <span className="font-semibold text-emerald-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{challenge.daysLeft} days left</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gift className="h-3 w-3" />
                      <span>{challenge.reward} points</span>
                    </div>
                  </div>

                  {progressPercentage === 100 && (
                    <Badge className="bg-green-100 text-green-800 text-xs">Complete! 🎉</Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Complete challenges to earn points and unlock rewards!</div>
            <Link href="/challenges">
              <Button className="w-full bg-transparent" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                View All Challenges
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
