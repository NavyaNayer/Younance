"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calculator, TrendingUp, Home, Car, GraduationCap, PiggyBank } from "lucide-react"
import Link from "next/link"
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest"
import { RetirementCalculator } from "@/components/calculators/retirement"
import { MortgageCalculator } from "@/components/calculators/mortgage"
import { LoanCalculator } from "@/components/calculators/loan"
import { SIPCalculator } from "@/components/calculators/sip"
import { EmergencyFundCalculator } from "@/components/calculators/emergency-fund"

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Financial Calculators</span>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Calculators</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use these powerful calculators to plan your financial future, understand loan payments, and make informed
            investment decisions.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Compound Interest</CardTitle>
              <CardDescription>See how your money grows over time</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <PiggyBank className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Retirement Planning</CardTitle>
              <CardDescription>Plan for your golden years</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Mortgage Calculator</CardTitle>
              <CardDescription>Calculate home loan payments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Car className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Loan Calculator</CardTitle>
              <CardDescription>Calculate any loan payments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calculator className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-lg">SIP Calculator</CardTitle>
              <CardDescription>Systematic Investment Plan returns</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Emergency Fund</CardTitle>
              <CardDescription>Calculate your safety net</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="compound" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="compound" className="text-xs">
              Compound
            </TabsTrigger>
            <TabsTrigger value="retirement" className="text-xs">
              Retirement
            </TabsTrigger>
            <TabsTrigger value="mortgage" className="text-xs">
              Mortgage
            </TabsTrigger>
            <TabsTrigger value="loan" className="text-xs">
              Loan
            </TabsTrigger>
            <TabsTrigger value="sip" className="text-xs">
              SIP
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs">
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compound">
            <CompoundInterestCalculator />
          </TabsContent>

          <TabsContent value="retirement">
            <RetirementCalculator />
          </TabsContent>

          <TabsContent value="mortgage">
            <MortgageCalculator />
          </TabsContent>

          <TabsContent value="loan">
            <LoanCalculator />
          </TabsContent>

          <TabsContent value="sip">
            <SIPCalculator />
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyFundCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
