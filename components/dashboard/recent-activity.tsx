"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingDown, Trophy, Target, Star, Calendar, CheckCircle } from "lucide-react"

interface ActivityItem {
  id: string
  type: "expense" | "achievement" | "challenge" | "goal" | "streak"
  title: string
  description: string
  timestamp: string
  value?: string
  icon: any
  color: string
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "expense",
      title: "Grocery Shopping",
      description: "Added $127.50 expense",
      timestamp: "2 hours ago",
      value: "-$127.50",
      icon: TrendingDown,
      color: "text-red-600 bg-red-50",
    },
    {
      id: "2",
      type: "achievement",
      title: "First Week Complete!",
      description: "Earned 50 points for tracking expenses for 7 days",
      timestamp: "1 day ago",
      value: "+50 pts",
      icon: Trophy,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      id: "3",
      type: "challenge",
      title: "No Coffee Challenge",
      description: "Day 3 of 7 - Keep going!",
      timestamp: "1 day ago",
      value: "3/7 days",
      icon: Target,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "4",
      type: "streak",
      title: "Daily Login Streak",
      description: "Maintained your 5-day streak",
      timestamp: "2 days ago",
      value: "5 days",
      icon: Star,
      color: "text-teal-600 bg-teal-50",
    },
    {
      id: "5",
      type: "goal",
      title: "Monthly Savings Goal",
      description: "Reached 75% of your monthly target",
      timestamp: "3 days ago",
      value: "75%",
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "expense":
        return TrendingDown
      case "achievement":
        return Trophy
      case "challenge":
        return Target
      case "goal":
        return CheckCircle
      case "streak":
        return Star
      default:
        return Activity
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${activity.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{activity.title}</h4>
                    {activity.value && (
                      <Badge variant="secondary" className={`text-xs ml-2 ${activity.color}`}>
                        {activity.value}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="text-center">
            <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">View All Activity</button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
