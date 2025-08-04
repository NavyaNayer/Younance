"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CurrencyDisplay } from "@/components/ui/currency"
import {
  ArrowLeft,
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Zap,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

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

export default function ReportPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate metrics
  const calculateMetrics = (userData: UserData) => {
    const income = parseFloat(userData.income) || 0
    const monthlySavings = parseFloat(userData.monthlySavings) || 0
    const currentSavings = parseFloat(userData.currentSavings) || 0
    const goalAmount = parseFloat(userData.goalAmount) || 0
    const targetYears = parseInt(userData.timeframe) || 10

    const savingsRate = income > 0 ? (monthlySavings / (income / 12)) * 100 : 0
    const emergencyFundMonths = currentSavings > 0 ? currentSavings / (income / 12 * 0.7) : 0
    
    // Calculate projected value with compound interest
    const getReturnRate = () => {
      switch (userData.riskTolerance) {
        case "conservative": return 0.06
        case "moderate": return 0.09
        case "aggressive": return 0.11
        default: return 0.09
      }
    }

    const annualRate = getReturnRate()
    const monthlyRate = annualRate / 12
    const months = targetYears * 12
    const futureCurrentSavings = currentSavings * Math.pow(1 + annualRate, targetYears)
    const futureMonthlySavings = (monthlySavings * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate
    const projectedValue = futureCurrentSavings + futureMonthlySavings
    const progressPercentage = goalAmount > 0 ? Math.min((projectedValue / goalAmount) * 100, 100) : 0

    // Calculate health score
    const healthScore = Math.min(100, Math.round(
      (savingsRate * 0.3) + 
      (progressPercentage * 0.3) + 
      (Math.min(emergencyFundMonths * 10, 30) * 0.2) + 
      (20) // Base score for having a plan
    ))

    return {
      savingsRate,
      emergencyFundMonths,
      projectedValue,
      progressPercentage,
      healthScore
    }
  }

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  const generateReport = async () => {
    if (!userData) return

    setIsGenerating(true)
    setError(null)

    try {
      const metrics = calculateMetrics(userData)
      const userProgress = {
        totalPoints: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        challengesCompleted: 0,
        achievementsUnlocked: 0
      }

      // Load user progress if available
      const savedProgress = localStorage.getItem("younance-progress")
      if (savedProgress) {
        Object.assign(userProgress, JSON.parse(savedProgress))
      }

      const response = await fetch('/api/financial-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
          userProgress,
          projectedValue: metrics.projectedValue,
          progressPercentage: metrics.progressPercentage,
          metrics,
          healthScore: metrics.healthScore
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate report')
      }

      setAiInsights(data.insights)
      setReportGenerated(true)
    } catch (error) {
      console.error('Error generating report:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate AI insights')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = () => {
    if (!userData || !aiInsights) return

    const metrics = calculateMetrics(userData)
    const reportContent = `
YouNance AI Financial Health Report
Generated on: ${new Date().toLocaleDateString()}
User: ${userData.name}

FINANCIAL HEALTH SCORE: ${metrics.healthScore}/100

KEY METRICS:
- Current Savings: $${userData.currentSavings}
- Monthly Savings: $${userData.monthlySavings}
- Goal Amount: $${userData.goalAmount}
- Risk Tolerance: ${userData.riskTolerance}
- Savings Rate: ${metrics.savingsRate.toFixed(1)}%
- Goal Progress: ${metrics.progressPercentage.toFixed(1)}%
- Emergency Fund: ${metrics.emergencyFundMonths.toFixed(1)} months

AI FINANCIAL ASSESSMENT:
${aiInsights.healthAssessment}

AI RECOMMENDATIONS:
${aiInsights.recommendations.map((rec: any, index: number) => `
${index + 1}. ${rec.title} (${rec.priority.toUpperCase()} PRIORITY)
   ${rec.description}
   Action: ${rec.action}
   ${rec.timeframe ? `Timeframe: ${rec.timeframe}` : ''}
   ${rec.dollarAmount ? `Amount: ${rec.dollarAmount}` : ''}
   ${rec.impact ? `Impact: ${rec.impact}` : ''}
`).join('')}

PERSONALIZED SUGGESTIONS:
${aiInsights.personalizedSuggestions ? aiInsights.personalizedSuggestions.map((sug: any, index: number) => `
${index + 1}. ${sug.category}: ${sug.suggestion}
   Benefit: ${sug.benefit}
   Difficulty: ${sug.difficulty.toUpperCase()}
`).join('') : 'No personalized suggestions available.'}

MARKET INSIGHTS:
${aiInsights.marketInsights}

MOTIVATIONAL INSIGHT:
${aiInsights.motivationalInsight}

This report was generated by YouNance AI Financial Advisor powered by GPT-4.
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `younance-ai-financial-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!mounted) return null

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Setup Required</CardTitle>
            <CardDescription>Please complete your profile setup to generate a financial report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/setup">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                Complete Setup
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-emerald-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Financial Health Report
                </h1>
                <p className="text-sm text-gray-600">Comprehensive analysis for {userData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!reportGenerated ? (
          /* Report Generation Section */
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overview Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-2 border-emerald-200/50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <span>Generate Your Financial Health Report</span>
                    <div className="text-emerald-100 text-sm font-normal mt-1">
                      AI-powered analysis of your complete financial situation
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">What's Included:</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <BarChart3 className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Complete Financial Analysis</h4>
                            <p className="text-gray-600 text-sm">Detailed review of savings, investments, debt, and spending patterns</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Target className="h-4 w-4 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Goal Progress Assessment</h4>
                            <p className="text-gray-600 text-sm">Track your progress towards financial objectives and milestones</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Zap className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Personalized Recommendations</h4>
                            <p className="text-gray-600 text-sm">AI-generated advice tailored to your specific situation</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Download className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Downloadable PDF Report</h4>
                            <p className="text-gray-600 text-sm">Professional report you can save and share with advisors</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={generateReport}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <FileText className="h-5 w-5 mr-2" />
                          Generate My Financial Report
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Profile Summary</h3>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-semibold">{userData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Age:</span>
                            <span className="font-semibold">{userData.age}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Income:</span>
                            <span className="font-semibold"><CurrencyDisplay amount={userData.income} /></span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Savings:</span>
                            <span className="font-semibold"><CurrencyDisplay amount={userData.monthlySavings} /></span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Goal:</span>
                            <span className="font-semibold"><CurrencyDisplay amount={userData.goalAmount} /></span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Tolerance:</span>
                            <span className="font-semibold capitalize">{userData.riskTolerance}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Profile Complete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Generated Report Section */
          <div className="max-w-6xl mx-auto space-y-8">
            {error ? (
              /* Error State */
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Report Generation Failed</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <div className="space-x-4">
                    <Button onClick={generateReport} className="bg-red-600 hover:bg-red-700">
                      Try Again
                    </Button>
                    <Link href="/dashboard">
                      <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Report Header */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full shadow-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">AI Report Generated Successfully!</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Your AI Financial Health Report</h2>
                  <p className="text-gray-600">Generated on {new Date().toLocaleDateString()} • Powered by GPT-4</p>
                </div>

                {/* Financial Health Score */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <CardTitle className="text-center text-2xl">Overall Financial Health Score</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {calculateMetrics(userData).healthScore}/100
                      </div>
                      <div className="text-xl text-gray-600">
                        {calculateMetrics(userData).healthScore >= 80 ? "Excellent" : 
                         calculateMetrics(userData).healthScore >= 60 ? "Good" : 
                         calculateMetrics(userData).healthScore >= 40 ? "Fair" : "Needs Improvement"} Financial Health
                      </div>
                      <Progress value={calculateMetrics(userData).healthScore} className="w-full max-w-md mx-auto h-4" />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Health Assessment */}
                {aiInsights?.healthAssessment && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-blue-900">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span>AI Financial Assessment</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-800 text-lg leading-relaxed">{aiInsights.healthAssessment}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Key Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PiggyBank className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{calculateMetrics(userData).savingsRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Savings Rate</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{calculateMetrics(userData).progressPercentage.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Goal Progress</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        <CurrencyDisplay amount={Math.round(calculateMetrics(userData).projectedValue)} />
                      </div>
                      <div className="text-sm text-gray-600">Projected Value</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{calculateMetrics(userData).emergencyFundMonths.toFixed(1)}m</div>
                      <div className="text-sm text-gray-600">Emergency Fund</div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Recommendations */}
                {aiInsights?.recommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span>AI-Powered Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {aiInsights.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{rec.description}</p>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-gray-800">Action:</span>
                              <span className="text-gray-600">{rec.action}</span>
                            </div>
                            {rec.timeframe && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-gray-800">Timeframe:</span>
                                <span className="text-gray-600">{rec.timeframe}</span>
                              </div>
                            )}
                            {rec.dollarAmount && (
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="font-medium text-gray-800">Amount:</span>
                                <span className="text-gray-600">{rec.dollarAmount}</span>
                              </div>
                            )}
                            {rec.impact && (
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-purple-500" />
                                <span className="font-medium text-gray-800">Impact:</span>
                                <span className="text-gray-600">{rec.impact}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Personalized Suggestions */}
                {aiInsights?.personalizedSuggestions && (
                  <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-orange-900">
                        <Zap className="h-5 w-5 text-orange-600" />
                        <span>Personalized Action Items for {userData.name}</span>
                      </CardTitle>
                      <CardDescription className="text-orange-700">
                        Specific suggestions tailored to your financial situation and goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {aiInsights.personalizedSuggestions.map((suggestion: any, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{suggestion.category}</h4>
                              <Badge 
                                variant={suggestion.difficulty === 'easy' ? 'secondary' : suggestion.difficulty === 'medium' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {suggestion.difficulty}
                              </Badge>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">{suggestion.suggestion}</p>
                            <div className="flex items-start space-x-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-green-700 font-medium">Benefit:</span>
                              <span className="text-green-600">{suggestion.benefit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Market Insights */}
                {aiInsights?.marketInsights && (
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-purple-900">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span>Market Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-purple-800 leading-relaxed">{aiInsights.marketInsights}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Motivational Insight */}
                {aiInsights?.motivationalInsight && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-900">
                        <Star className="h-5 w-5 text-green-600" />
                        <span>Motivational Insight</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-800 text-lg leading-relaxed font-medium italic">"{aiInsights.motivationalInsight}"</p>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={downloadReport}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download AI Report
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="outline">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
