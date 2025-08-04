"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calculator, TrendingDown, Trophy, MessageCircle, Target, BarChart3, FileText, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Chat with Future You",
      description: "Get wisdom from your future self",
      icon: Sparkles,
      href: "/chat",
      color: "bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 border-purple-200",
    },
    {
      title: "Generate Report",
      description: "AI financial analysis",
      icon: FileText,
      href: "/dashboard?tab=report",
      color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      title: "Add Expense",
      description: "Track your spending",
      icon: Plus,
      href: "/expenses",
      color: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
    },
    {
      title: "Use Calculator",
      description: "Financial planning tools",
      icon: Calculator,
      href: "/calculators",
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      title: "What-If Scenarios",
      description: "Explore different outcomes",
      icon: TrendingUp,
      href: "/what-if",
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      title: "View Expenses",
      description: "Analyze your spending",
      icon: TrendingDown,
      href: "/expenses",
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      title: "Challenges",
      description: "Earn points & rewards",
      icon: Trophy,
      href: "/challenges",
      color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      title: "Financial Assistant",
      description: "Get financial advice",
      icon: MessageCircle,
      href: "/chat?tab=assistant",
      color: "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200",
    },
    {
      title: "Update Goals",
      description: "Modify your targets",
      icon: Target,
      href: "/setup",
      color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
    },
  ]

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Regular Actions Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {actions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <div className={`h-auto p-4 flex flex-col items-center space-y-2 w-full transition-all duration-200 cursor-pointer border rounded-lg hover:shadow-md ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs opacity-75">{action.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
