"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, User, DollarSign, Target, Settings, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: "",
    income: "",
    currency: "",
    currentSavings: "",
    monthlySavings: "",
    goal: "",
    goalAmount: "",
    timeframe: "",
    riskTolerance: "moderate",
    expenses: "",
  })

  const totalSteps = 3
  const progressPercentage = (step / totalSteps) * 100

  const stepIcons = [User, DollarSign, Target]
  const stepTitles = [
    "Personal Information",
    "Financial Overview", 
    "Goals & Timeline"
  ]

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save data to localStorage and redirect to dashboard
      localStorage.setItem("younance-user-data", JSON.stringify(userData))
      
      // Dispatch custom event to notify sidebar of data update
      window.dispatchEvent(new CustomEvent('younance-data-updated'))
      
      console.log("Saved user data:", userData) // Debug log
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userData.name && userData.age && userData.income && userData.currency
      case 2:
        return userData.currentSavings && userData.monthlySavings
      case 3:
        return userData.goal && userData.goalAmount && userData.timeframe
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-300">
            <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">YouNance</span>
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">Step {step} of {totalSteps}</div>
            <div className="text-xs text-gray-500">• Setup</div>
          </div>
        </nav>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Progress Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Financial Profile Setup</h1>
              <span className="text-lg font-semibold text-blue-600">{Math.round(progressPercentage)}% Complete</span>
            </div>
            
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-4">
              {stepTitles.map((title, index) => {
                const StepIcon = stepIcons[index]
                const isCompleted = index + 1 < step
                const isCurrent = index + 1 === step
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : isCurrent 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                    </div>
                    <span className={`text-sm font-medium text-center ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {title}
                    </span>
                  </div>
                )
              })}
            </div>
            
            <Progress value={progressPercentage} className="h-2 bg-gray-200" />
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Let's get to know you</CardTitle>
                <CardDescription className="text-lg">Tell us about yourself to personalize your financial journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">What's your name?</Label>
                    <Input
                      id="name"
                      placeholder="Enter your first name"
                      value={userData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2 h-12 rounded-xl border-2 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-base font-medium">How old are you?</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={userData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="mt-2 h-12 rounded-xl border-2 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="income" className="text-base font-medium">What's your annual income?</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="50000"
                    value={userData.income}
                    onChange={(e) => handleInputChange("income", e.target.value)}
                    className="mt-2 h-12 rounded-xl border-2 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter in your local currency</p>
                </div>
                <div>
                  <Label htmlFor="currency" className="text-base font-medium">What's your preferred currency?</Label>
                  <Select value={userData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger className="mt-2 h-12 rounded-xl border-2 focus:border-blue-500">
                      <SelectValue placeholder="Select your currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                      <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                      <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                      <SelectItem value="CAD">CAD (C$) - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD (A$) - Australian Dollar</SelectItem>
                      <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                      <SelectItem value="CNY">CNY (¥) - Chinese Yuan</SelectItem>
                      <SelectItem value="KRW">KRW (₩) - South Korean Won</SelectItem>
                      <SelectItem value="SGD">SGD (S$) - Singapore Dollar</SelectItem>
                      <SelectItem value="HKD">HKD (HK$) - Hong Kong Dollar</SelectItem>
                      <SelectItem value="NZD">NZD (NZ$) - New Zealand Dollar</SelectItem>
                      <SelectItem value="SEK">SEK (kr) - Swedish Krona</SelectItem>
                      <SelectItem value="NOK">NOK (kr) - Norwegian Krone</SelectItem>
                      <SelectItem value="DKK">DKK (kr) - Danish Krone</SelectItem>
                      <SelectItem value="PLN">PLN (zł) - Polish Zloty</SelectItem>
                      <SelectItem value="CZK">CZK (Kč) - Czech Koruna</SelectItem>
                      <SelectItem value="HUF">HUF (Ft) - Hungarian Forint</SelectItem>
                      <SelectItem value="RUB">RUB (₽) - Russian Ruble</SelectItem>
                      <SelectItem value="BRL">BRL (R$) - Brazilian Real</SelectItem>
                      <SelectItem value="MXN">MXN ($) - Mexican Peso</SelectItem>
                      <SelectItem value="ARS">ARS ($) - Argentine Peso</SelectItem>
                      <SelectItem value="CLP">CLP ($) - Chilean Peso</SelectItem>
                      <SelectItem value="COP">COP ($) - Colombian Peso</SelectItem>
                      <SelectItem value="ZAR">ZAR (R) - South African Rand</SelectItem>
                      <SelectItem value="TRY">TRY (₺) - Turkish Lira</SelectItem>
                      <SelectItem value="THB">THB (฿) - Thai Baht</SelectItem>
                      <SelectItem value="MYR">MYR (RM) - Malaysian Ringgit</SelectItem>
                      <SelectItem value="IDR">IDR (Rp) - Indonesian Rupiah</SelectItem>
                      <SelectItem value="PHP">PHP (₱) - Philippine Peso</SelectItem>
                      <SelectItem value="VND">VND (₫) - Vietnamese Dong</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">This will be used for all calculations and displays</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Savings Info */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Your current savings</CardTitle>
                <CardDescription>Help us understand your current financial situation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="currentSavings">Current savings/investments</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="10000"
                    value={userData.currentSavings}
                    onChange={(e) => handleInputChange("currentSavings", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">How much do you have saved right now?</p>
                </div>
                <div>
                  <Label htmlFor="monthlySavings">Monthly savings amount</Label>
                  <Input
                    id="monthlySavings"
                    type="number"
                    placeholder="1000"
                    value={userData.monthlySavings}
                    onChange={(e) => handleInputChange("monthlySavings", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">How much can you save each month?</p>
                </div>
                <div>
                  <Label htmlFor="riskTolerance">Risk tolerance</Label>
                  <Select
                    value={userData.riskTolerance}
                    onValueChange={(value) => handleInputChange("riskTolerance", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative (5-7% returns)</SelectItem>
                      <SelectItem value="moderate">Moderate (8-10% returns)</SelectItem>
                      <SelectItem value="aggressive">Aggressive (10-12% returns)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>What's your financial goal?</CardTitle>
                <CardDescription>Let's set a target to work towards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="goal">Primary financial goal</Label>
                  <Select value={userData.goal} onValueChange={(value) => handleInputChange("goal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="house">Buy a house</SelectItem>
                      <SelectItem value="travel">Dream vacation/travel</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="emergency">Emergency fund</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goalAmount">Target amount</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder="100000"
                    value={userData.goalAmount}
                    onChange={(e) => handleInputChange("goalAmount", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={userData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you want to achieve this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="25">25+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expenses">Monthly expenses (optional)</Label>
                  <Textarea
                    id="expenses"
                    placeholder="Rent: 1200, Food: 400, Transport: 200..."
                    value={userData.expenses}
                    onChange={(e) => handleInputChange("expenses", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">This helps us give better savings advice</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {step === 3 ? "Complete Setup" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
