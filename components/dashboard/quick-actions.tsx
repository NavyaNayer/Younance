"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calculator, TrendingDown, Trophy, MessageCircle, Target, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Financial Report",
      description: "Comprehensive analysis",
      icon: FileText,
      href: "/dashboard?tab=report",
      color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
      featured: true,
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
      title: "Chat Assistant",
      description: "Get financial advice",
      icon: MessageCircle,
      href: "/chat",
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
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Featured Action - Financial Report */}
          <div className="mb-4">
            <Link href="/dashboard?tab=report">
              <Button className="w-full h-auto p-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold">Generate Financial Report</div>
                    <div className="text-emerald-100">Get comprehensive insights about your financial health</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>

          {/* Regular Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {actions.slice(1).map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 w-full transition-all duration-200 ${action.color}`}
                >
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs opacity-75">{action.description}</div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
