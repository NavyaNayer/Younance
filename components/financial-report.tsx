"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CurrencyDisplay } from "@/components/ui/currency"
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Download,
  Share,
  Calendar,
  Zap,
  Shield,
  Award,
  ArrowRight,
  Star,
  Printer,
} from "lucide-react"

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

interface UserProgress {
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  challengesCompleted: number
  achievementsUnlocked: number
}

interface FinancialReportProps {
  userData: UserData
  userProgress: UserProgress
  projectedValue: number
  progressPercentage: number
}

export function FinancialReport({ userData, userProgress, projectedValue, progressPercentage }: FinancialReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const getReturnRate = () => {
    switch (userData.riskTolerance) {
      case "conservative":
        return 0.06
      case "moderate":
        return 0.09
      case "aggressive":
        return 0.11
      default:
        return 0.09
    }
  }

  const calculateMetrics = () => {
    const currentSavings = Number.parseFloat(userData.currentSavings) || 0
    const monthlySavings = Number.parseFloat(userData.monthlySavings) || 0
    const annualIncome = Number.parseFloat(userData.income) || 0
    const goalAmount = Number.parseFloat(userData.goalAmount) || 0
    const timeframe = Number.parseInt(userData.timeframe) || 10
    
    const annualSavings = monthlySavings * 12
    const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0
    const monthsToGoal = goalAmount > 0 && monthlySavings > 0 ? goalAmount / monthlySavings : 0
    const yearsToGoal = monthsToGoal / 12
    
    return {
      currentSavings,
      monthlySavings,
      annualSavings,
      annualIncome,
      goalAmount,
      timeframe,
      savingsRate,
      yearsToGoal,
      monthsToGoal,
      projectedShortfall: Math.max(0, goalAmount - projectedValue),
      emergencyFundMonths: currentSavings / (monthlySavings * 12 / 12),
    }
  }

  const metrics = calculateMetrics()

  const getFinancialHealthScore = () => {
    let score = 0
    const maxScore = 100

    // Savings rate (30 points)
    if (metrics.savingsRate >= 20) score += 30
    else if (metrics.savingsRate >= 15) score += 25
    else if (metrics.savingsRate >= 10) score += 20
    else if (metrics.savingsRate >= 5) score += 10

    // Goal progress (25 points)
    if (progressPercentage >= 100) score += 25
    else if (progressPercentage >= 75) score += 20
    else if (progressPercentage >= 50) score += 15
    else if (progressPercentage >= 25) score += 10
    else if (progressPercentage >= 10) score += 5

    // Emergency fund (20 points)
    if (metrics.emergencyFundMonths >= 6) score += 20
    else if (metrics.emergencyFundMonths >= 3) score += 15
    else if (metrics.emergencyFundMonths >= 1) score += 10
    else if (metrics.emergencyFundMonths >= 0.5) score += 5

    // Investment timeline vs goal (15 points)
    if (metrics.yearsToGoal <= metrics.timeframe) score += 15
    else if (metrics.yearsToGoal <= metrics.timeframe * 1.2) score += 10
    else if (metrics.yearsToGoal <= metrics.timeframe * 1.5) score += 5

    // Consistency (user progress) (10 points)
    if (userProgress.currentStreak >= 30) score += 10
    else if (userProgress.currentStreak >= 14) score += 8
    else if (userProgress.currentStreak >= 7) score += 5
    else if (userProgress.currentStreak >= 1) score += 3

    return Math.min(score, maxScore)
  }

  const healthScore = getFinancialHealthScore()

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200"
    if (score >= 60) return "bg-yellow-50 border-yellow-200"
    if (score >= 40) return "bg-orange-50 border-orange-200"
    return "bg-red-50 border-red-200"
  }

  const generateRecommendations = () => {
    const recommendations = []

    if (metrics.savingsRate < 20) {
      recommendations.push({
        type: "savings",
        priority: "high",
        title: "Increase Savings Rate",
        description: `Your current savings rate is ${metrics.savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of income.`,
        action: `Try to increase monthly savings by $${Math.round((0.2 * metrics.annualIncome / 12) - metrics.monthlySavings)}`,
        icon: PiggyBank,
      })
    }

    if (metrics.emergencyFundMonths < 6) {
      recommendations.push({
        type: "emergency",
        priority: "high",
        title: "Build Emergency Fund",
        description: `You have ${metrics.emergencyFundMonths.toFixed(1)} months of expenses saved. Aim for 6 months.`,
        action: `Save an additional $${Math.round((6 - metrics.emergencyFundMonths) * (metrics.monthlySavings * 12 / 12))} for emergencies`,
        icon: Shield,
      })
    }

    if (progressPercentage < 50) {
      recommendations.push({
        type: "goal",
        priority: "medium",
        title: "Accelerate Goal Progress",
        description: `You're ${progressPercentage.toFixed(1)}% towards your goal. Consider optimizing your strategy.`,
        action: "Review investment allocation or increase contributions",
        icon: Target,
      })
    }

    if (userProgress.currentStreak < 7) {
      recommendations.push({
        type: "consistency",
        priority: "medium",
        title: "Improve Consistency",
        description: "Regular financial check-ins lead to better outcomes.",
        action: "Set a weekly reminder to review your finances",
        icon: Calendar,
      })
    }

    if (userData.riskTolerance === "conservative" && Number.parseInt(userData.age) < 35) {
      recommendations.push({
        type: "investment",
        priority: "low",
        title: "Consider Growth Investments",
        description: "With your age and timeframe, you might benefit from moderate risk investments.",
        action: "Research balanced or growth-oriented investment options",
        icon: TrendingUp,
      })
    }

    return recommendations.slice(0, 5) // Limit to top 5 recommendations
  }

  const recommendations = generateRecommendations()

  const generateReport = async () => {
    setIsGenerating(true)
    
    try {
      // Generate AI insights
      setAiLoading(true)
      const response = await fetch('/api/financial-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData,
          userProgress,
          projectedValue,
          progressPercentage,
          metrics,
          healthScore
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAiInsights(data.insights)
        } else {
          console.warn('AI insights not available:', data.error)
          // Set fallback insights when API key is not configured
          setAiInsights({
            healthAssessment: "Your financial health analysis shows areas for both celebration and improvement. Focus on building consistent saving habits and optimizing your investment strategy for long-term growth.",
            recommendations: [
              {
                title: "Optimize Savings Rate",
                description: "Consider increasing your monthly savings to accelerate goal achievement",
                action: "Review budget for additional savings opportunities",
                priority: "high"
              },
              {
                title: "Build Emergency Fund",
                description: "Establish a safety net for unexpected expenses",
                action: "Set aside funds for 3-6 months of expenses",
                priority: "high"
              }
            ],
            marketInsights: "Current market conditions favor long-term investors with diversified portfolios. Consider maintaining consistent contributions regardless of short-term market fluctuations.",
            motivationalInsight: "Your commitment to financial planning puts you ahead of most people. Stay consistent with your savings goals and you'll see significant progress over time."
          })
        }
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
    } finally {
      setAiLoading(false)
    }

    // Simulate additional processing time for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsGenerating(false)
    setReportGenerated(true)
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    
    try {
      // Try advanced PDF generation first
      try {
        // Dynamically import the libraries to avoid SSR issues
        const html2canvas = (await import('html2canvas')).default
        const { jsPDF } = await import('jspdf')

        if (!reportRef.current) {
          throw new Error('Report content not found')
        }

        // Wait a bit for any pending renders
        await new Promise(resolve => setTimeout(resolve, 500))

        // Configure html2canvas options for better quality
        const canvas = await html2canvas(reportRef.current, {
          scale: 1.5, // Reduced scale for better performance
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: reportRef.current.scrollWidth,
          height: reportRef.current.scrollHeight,
          foreignObjectRendering: true,
        })

        const imgData = canvas.toDataURL('image/png', 0.95)
        
        // Calculate PDF dimensions
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        let position = 0

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        // Add additional pages if content is longer than one page
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        // Save the PDF
        const fileName = `Financial_Report_${userData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        pdf.save(fileName)
        
        // Show success message
        alert('PDF generated successfully!')
      } catch (pdfError) {
        console.error('Advanced PDF generation failed:', pdfError)
        
        // Fallback to browser print
        const printWindow = window.open('', '_blank')
        if (printWindow && reportRef.current) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Financial Report - ${userData.name}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>
                ${reportRef.current.innerHTML}
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 500)
          alert('Please use your browser\'s print dialog to save as PDF')
        } else {
          throw new Error('Unable to open print dialog')
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try using your browser's print function instead.`)
    } finally {
      setIsExporting(false)
    }
  }

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData.name}'s Financial Health Report`,
          text: `Financial Health Score: ${healthScore}/100. Check out my comprehensive financial analysis!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `${userData.name}'s Financial Health Report - Score: ${healthScore}/100\n${window.location.href}`
      try {
        await navigator.clipboard.writeText(text)
        alert('Report link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        alert('Share functionality not supported in this browser.')
      }
    }
  }

  const printReport = () => {
    window.print()
  }

  if (!reportGenerated) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Generate Your Financial Report</CardTitle>
          <CardDescription className="text-lg">
            Get a comprehensive analysis of your financial health with personalized insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <BarChart3 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-semibold text-emerald-900">Financial Health Score</h4>
              <p className="text-sm text-emerald-700">Comprehensive scoring system</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
              <Target className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <h4 className="font-semibold text-teal-900">Goal Analysis</h4>
              <p className="text-sm text-teal-700">Progress tracking & projections</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Recommendations</h4>
              <p className="text-sm text-green-700">Personalized action plan</p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Generate My Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>
      
      {/* Feature Header Banner */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-4 py-2 mb-4 border border-emerald-200">
          <Zap className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">AI-Powered Financial Analysis</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Your Comprehensive{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Financial Health Report
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced AI analysis of your financial situation with personalized insights and actionable recommendations for achieving your goals faster.
        </p>
      </div>

      <div ref={reportRef} className="w-full max-w-6xl mx-auto space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <FileText className="h-6 w-6" />
                <span>Financial Health Report</span>
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Generated for {userData.name} • {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex space-x-2 no-print">
              <Button 
                onClick={exportToPDF}
                disabled={isExporting}
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Generating PDF...' : 'Export PDF'}
              </Button>
              <Button 
                onClick={printReport}
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                onClick={shareReport}
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AI-Powered Insights */}
      {aiInsights && (
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <span>AI-Powered Financial Analysis</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                Personalized
              </Badge>
            </CardTitle>
            <CardDescription>
              Advanced insights generated by our AI financial advisor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Health Assessment */}
            <div className="p-4 bg-white/70 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Professional Assessment</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{aiInsights.healthAssessment}</p>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-900 flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>AI-Generated Recommendations</span>
              </h4>
              {aiInsights.recommendations?.map((rec: any, index: number) => (
                <div key={index} className="p-4 bg-white/70 rounded-lg border border-emerald-200">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === "high" ? "bg-red-100" :
                      rec.priority === "medium" ? "bg-yellow-100" : "bg-blue-100"
                    }`}>
                      <span className={`text-xs font-bold ${
                        rec.priority === "high" ? "text-red-600" :
                        rec.priority === "medium" ? "text-yellow-600" : "text-blue-600"
                      }`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                        <Badge variant={
                          rec.priority === "high" ? "destructive" :
                          rec.priority === "medium" ? "secondary" : "outline"
                        } className="text-xs">
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-emerald-600">{rec.action}</span>
                      </div>
                      {rec.impact && (
                        <div className="mt-2 p-2 bg-emerald-50 rounded text-xs text-emerald-700">
                          <strong>Expected Impact:</strong> {rec.impact}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Insights */}
            <div className="p-4 bg-white/70 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Market Insights</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{aiInsights.marketInsights}</p>
            </div>

            {/* Motivational Insight */}
            <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2 flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Your Financial Journey</span>
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed font-medium">{aiInsights.motivationalInsight}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state for AI insights */}
      {aiLoading && reportGenerated && (
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-white animate-spin" />
              </div>
              <span className="text-lg font-semibold text-emerald-900">AI Analyzing Your Financial Profile...</span>
            </div>
            <p className="text-sm text-emerald-700">Our AI financial advisor is generating personalized insights for you</p>
          </CardContent>
        </Card>
      )}

      {/* Financial Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <span>Financial Health Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded-lg border-2 ${getHealthScoreBg(healthScore)}`}>
            <div className="text-center mb-4">
              <div className={`text-6xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}
              </div>
              <div className="text-lg text-gray-600">out of 100</div>
              <div className="mt-2">
                <Badge variant={healthScore >= 80 ? "default" : healthScore >= 60 ? "secondary" : "destructive"}>
                  {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : healthScore >= 40 ? "Fair" : "Needs Improvement"}
                </Badge>
              </div>
            </div>
            <Progress value={healthScore} className="h-3 mb-4" />
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Strengths:</strong>
                <ul className="mt-1 space-y-1 text-gray-600">
                  {metrics.savingsRate >= 15 && <li>• Strong savings rate ({metrics.savingsRate.toFixed(1)}%)</li>}
                  {progressPercentage >= 50 && <li>• Good progress towards goal ({progressPercentage.toFixed(1)}%)</li>}
                  {userProgress.currentStreak >= 7 && <li>• Consistent financial habits</li>}
                  {metrics.emergencyFundMonths >= 3 && <li>• Adequate emergency fund</li>}
                </ul>
              </div>
              <div>
                <strong>Areas for Improvement:</strong>
                <ul className="mt-1 space-y-1 text-gray-600">
                  {metrics.savingsRate < 15 && <li>• Increase savings rate</li>}
                  {progressPercentage < 50 && <li>• Accelerate goal progress</li>}
                  {userProgress.currentStreak < 7 && <li>• Build consistent habits</li>}
                  {metrics.emergencyFundMonths < 3 && <li>• Build emergency fund</li>}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <PiggyBank className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">Savings Rate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{metrics.savingsRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Target: 20%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-teal-600" />
              <span className="font-semibold">Goal Progress</span>
            </div>
            <div className="text-2xl font-bold text-teal-600">{progressPercentage.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">
              <CurrencyDisplay amount={projectedValue} /> / <CurrencyDisplay amount={metrics.goalAmount} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Emergency Fund</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{metrics.emergencyFundMonths.toFixed(1)}</div>
            <div className="text-sm text-gray-600">months of expenses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="font-semibold">Streak</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
            <div className="text-sm text-gray-600">days active</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Goal Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <span>Goal Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Current Trajectory</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Goal Amount:</span>
                  <span className="font-semibold"><CurrencyDisplay amount={metrics.goalAmount} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Value:</span>
                  <span className="font-semibold"><CurrencyDisplay amount={projectedValue} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Goal:</span>
                  <span className="font-semibold">{metrics.yearsToGoal.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Timeline:</span>
                  <span className="font-semibold">{metrics.timeframe} years</span>
                </div>
              </div>
            </div>

            {metrics.projectedShortfall > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-red-900">Potential Shortfall</span>
                </div>
                <p className="text-sm text-red-700">
                  You may fall short by <CurrencyDisplay amount={metrics.projectedShortfall} /> based on current savings.
                </p>
              </div>
            )}

            {progressPercentage >= 100 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-900">On Track!</span>
                </div>
                <p className="text-sm text-green-700">
                  Congratulations! You're on track to exceed your goal.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span>Investment Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Portfolio Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Risk Tolerance:</span>
                  <span className="font-semibold capitalize">{userData.riskTolerance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Return:</span>
                  <span className="font-semibold">{(getReturnRate() * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Savings:</span>
                  <span className="font-semibold"><CurrencyDisplay amount={metrics.currentSavings} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Contribution:</span>
                  <span className="font-semibold"><CurrencyDisplay amount={metrics.monthlySavings} /></span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-2">Growth Potential</h4>
              <p className="text-sm text-emerald-700">
                With consistent contributions and compound growth, your savings could reach{" "}
                <span className="font-semibold"><CurrencyDisplay amount={projectedValue} /></span> in {metrics.timeframe} years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <span>Personalized Recommendations</span>
          </CardTitle>
          <CardDescription>
            Based on your financial profile, here are the top actions to improve your financial health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    rec.priority === "high" ? "bg-red-100" :
                    rec.priority === "medium" ? "bg-yellow-100" : "bg-blue-100"
                  }`}>
                    <rec.icon className={`h-5 w-5 ${
                      rec.priority === "high" ? "text-red-600" :
                      rec.priority === "medium" ? "text-yellow-600" : "text-blue-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <Badge variant={
                        rec.priority === "high" ? "destructive" :
                        rec.priority === "medium" ? "secondary" : "outline"
                      } className="text-xs">
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-600">{rec.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>30-Day Action Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h4 className="font-semibold text-emerald-900 mb-2">Week 1-2</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Review and optimize budget</li>
                <li>• Set up automatic transfers</li>
                <li>• Research investment options</li>
              </ul>
            </div>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <h4 className="font-semibold text-teal-900 mb-2">Week 3-4</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Implement savings increase</li>
                <li>• Start emergency fund</li>
                <li>• Track daily expenses</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Ongoing</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Weekly financial check-ins</li>
                <li>• Monthly goal review</li>
                <li>• Quarterly portfolio rebalance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
