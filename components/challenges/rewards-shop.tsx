"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, CheckCircle } from "lucide-react"
import type { Reward, UserProgress } from "@/app/challenges/page"

interface RewardsShopProps {
  rewards: Reward[]
  userProgress: UserProgress
  onClaimReward: (rewardId: string) => void
}

export function RewardsShop({ rewards, userProgress, onClaimReward }: RewardsShopProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "badges":
        return "bg-yellow-100 text-yellow-800"
      case "themes":
        return "bg-purple-100 text-purple-800"
      case "features":
        return "bg-blue-100 text-blue-800"
      case "real":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canAfford = (cost: number) => userProgress.totalPoints >= cost

  const availableRewards = rewards.filter((r) => !r.claimed)
  const claimedRewards = rewards.filter((r) => r.claimed)

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Your Points Balance</h3>
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6" />
                <span className="text-3xl font-bold">{userProgress.totalPoints}</span>
                <span className="text-lg opacity-90">points</span>
              </div>
            </div>
            <ShoppingCart className="h-12 w-12 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rewards Shop ({availableRewards.length} available)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.map((reward) => {
            const affordable = canAfford(reward.cost)

            return (
              <Card key={reward.id} className={`${!affordable ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {reward.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <Badge className={getCategoryColor(reward.category)}>{reward.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{reward.description}</CardDescription>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-lg font-bold text-blue-600">
                      <Star className="h-5 w-5" />
                      <span>{reward.cost}</span>
                    </div>

                    <Button
                      onClick={() => onClaimReward(reward.id)}
                      disabled={!affordable}
                      className={affordable ? "bg-blue-600 hover:bg-blue-700" : ""}
                      variant={affordable ? "default" : "secondary"}
                    >
                      {affordable ? "Claim" : "Not enough points"}
                    </Button>
                  </div>

                  {!affordable && (
                    <p className="text-sm text-gray-500">Need {reward.cost - userProgress.totalPoints} more points</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Claimed Rewards */}
      {claimedRewards.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rewards ({claimedRewards.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {claimedRewards.map((reward) => (
              <Card key={reward.id} className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{reward.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">{reward.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>Claimed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reward Categories */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">🎁 Reward Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Badges</h4>
              <p className="text-orange-700">Show off your achievements with special profile badges</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Themes</h4>
              <p className="text-orange-700">Customize your app appearance with new themes</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Features</h4>
              <p className="text-orange-700">Unlock premium features and advanced tools</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Real Rewards</h4>
              <p className="text-orange-700">Redeem points for real-world treats and vouchers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earning Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 How to Earn More Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Complete monthly challenges for big point rewards (75-250 points each)</li>
            <li>• Maintain daily tracking streaks to unlock achievements</li>
            <li>• Stay within your budget to earn bonus points</li>
            <li>• Try harder challenges for more points</li>
            <li>• Unlock achievements for milestone rewards (10-500 points each)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
