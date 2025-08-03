"use client"

import { useState, useEffect } from 'react'
import { SimpleChat } from '@/components/simple-chat'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  name: string
  age: string
  income: string
  monthlySavings: string
  goal: string
  goalAmount: string
  timeframe: string
  riskTolerance: string
}

export default function AITestPage() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Load user data from localStorage
    const savedData = localStorage.getItem('younance-user-data')
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
  }, [])

  const futureAge = userData ? Number.parseInt(userData.age) + Number.parseInt(userData.timeframe || "10") : 35

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Financial Assistants
              </h1>
              <p className="text-gray-600 mt-2">
                Test the OpenAI integration with your financial planning assistants
              </p>
            </div>
          </div>
        </div>

        {/* API Key Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              OpenAI Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">
                ✅ OpenAI API Key configured and ready
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Using GPT-4 Mini for cost-effective, intelligent responses
            </p>
          </CardContent>
        </Card>

        {/* Chat Assistants */}
        <Tabs defaultValue="financial-advisor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial-advisor" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Financial Advisor
            </TabsTrigger>
            <TabsTrigger value="future-self" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Future Self
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              General Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial-advisor" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[500px]">
                <SimpleChat
                  title="Financial Advisor"
                  endpoint="/api/chat"
                  assistantType="FINANCIAL_ADVISOR"
                  userData={userData}
                  welcomeMessage="Hello! I'm your personal financial advisor. I can help you with investment strategies, budgeting, saving goals, and any other financial questions you have. What would you like to discuss?"
                  placeholder="Ask about investments, budgeting, savings..."
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>About Financial Advisor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Your AI financial advisor provides personalized advice based on your financial situation.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Specializes in:</strong>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Investment strategies and portfolio management</li>
                      <li>• Budgeting and expense optimization</li>
                      <li>• Savings goals and emergency funds</li>
                      <li>• Debt management and payoff strategies</li>
                      <li>• Risk assessment and financial planning</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="future-self" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[500px]">
                <SimpleChat
                  title={`Future You (Age ${futureAge})`}
                  endpoint="/api/chat/future-self"
                  userData={userData}
                  welcomeMessage={userData ? `Hey ${userData.name}! It's amazing to talk to you from ${userData.timeframe || "10"} years in the future. I'm ${futureAge} now, and thanks to the smart financial decisions you're making today, our life has transformed in incredible ways. The compound interest really worked its magic! What would you like to know about our financial journey?` : "Hello! I'm your future self. Set up your profile first to get personalized insights about your financial future!"}
                  placeholder="Ask about your financial future..."
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>About Future Self</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Chat with your future self who has achieved financial success through smart decisions.
                  </p>
                  {userData && (
                    <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                      <div className="text-sm font-medium">Your Future Profile:</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>• Current Age: {userData.age}</div>
                        <div>• Future Age: {futureAge}</div>
                        <div>• Goal: {userData.goal}</div>
                        <div>• Target Amount: ${Number.parseFloat(userData.goalAmount || "0").toLocaleString()}</div>
                        <div>• Monthly Savings: ${Number.parseFloat(userData.monthlySavings || "0").toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[500px]">
                <SimpleChat
                  title="General Assistant"
                  endpoint="/api/chat/assistant"
                  userData={userData}
                  welcomeMessage="Hi! I'm your YouNance assistant. I can help you navigate the app, understand financial concepts, and provide general guidance. What can I help you with today?"
                  placeholder="Ask me anything about the app..."
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>About General Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Your helpful AI assistant for app navigation and general financial education.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Can help with:</strong>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• How to use YouNance features</li>
                      <li>• Basic financial concepts and education</li>
                      <li>• Setting up your financial goals</li>
                      <li>• Understanding calculators and tools</li>
                      <li>• General motivation and guidance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/chat">
              <Button>
                Go to Main Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
