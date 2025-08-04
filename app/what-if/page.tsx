"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { WhatIfCalculator } from "@/components/what-if-calculator"

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

export default function WhatIfPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  if (!mounted) return null

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Setup Required</CardTitle>
            <CardDescription>Complete your profile to access What-If scenarios</CardDescription>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                What-If Calculator
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Explore different financial scenarios and see how changes impact your future
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-600">Current Goal</p>
                    <p className="font-bold text-gray-900">${Number.parseFloat(userData.goalAmount || "0").toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calculator className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Monthly Savings</p>
                    <p className="font-bold text-gray-900">${Number.parseFloat(userData.monthlySavings || "0").toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">{userData.timeframe}Y</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Frame</p>
                    <p className="font-bold text-gray-900">{userData.timeframe} years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What-If Calculator Component */}
        <WhatIfCalculator userData={userData} />
      </div>
    </div>
  )
}
