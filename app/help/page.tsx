"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  MessageCircle, 
  Calculator, 
  Target, 
  Receipt,
  Book,
  Video,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

const helpSections = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Complete Your Profile Setup", href: "/setup", description: "Set your financial goals and preferences" },
      { title: "Understanding Your Dashboard", href: "/dashboard", description: "Navigate your financial overview" },
      { title: "Chat with AI Assistants", href: "/chat", description: "Get personalized financial guidance" },
    ]
  },
  {
    title: "Features & Tools",
    icon: Calculator,
    items: [
      { title: "Financial Calculators", href: "/calculators", description: "Plan investments, loans, and savings" },
      { title: "Expense Tracking", href: "/expenses", description: "Monitor and categorize your spending" },
      { title: "Financial Challenges", href: "/challenges", description: "Achieve goals and earn rewards" },
    ]
  },
  {
    title: "AI Chat Help",
    icon: MessageCircle,
    items: [
      { title: "Financial Assistant", href: "/chat", description: "Ask about investments, budgeting, and planning" },
      { title: "Future Self Chat", href: "/chat", description: "Get motivated by your financially successful future" },
      { title: "Chat Tips & Examples", href: "/ai-test", description: "Learn how to get the best AI responses" },
    ]
  }
]

const faqItems = [
  {
    question: "How does the AI financial assistant work?",
    answer: "Our AI assistant uses advanced language models to provide personalized financial advice based on your profile, goals, and questions. It can help with investment strategies, budgeting, savings goals, and financial planning."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, your data security is our top priority. All information is stored locally in your browser and encrypted. We don't store sensitive financial information on our servers."
  },
  {
    question: "How accurate are the financial calculators?",
    answer: "Our calculators use industry-standard formulas and are regularly updated. However, they provide estimates for planning purposes and should not replace professional financial advice."
  },
  {
    question: "Can I export my financial data?",
    answer: "Currently, data is stored locally in your browser. We're working on export features for future updates. You can manually record important calculations and insights."
  },
  {
    question: "How often should I update my financial goals?",
    answer: "We recommend reviewing and updating your goals quarterly or whenever you have significant life changes like job changes, major purchases, or family changes."
  }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Everything you need to know about using YouNance effectively</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Help Sections */}
          {helpSections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAQ Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-green-600" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions and answers about YouNance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact & Resources */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Contact Support
                </CardTitle>
                <CardDescription>
                  Need more help? We're here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                  <Badge variant="secondary" className="ml-auto">
                    24h response
                  </Badge>
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                  <Badge variant="secondary" className="ml-auto">
                    Online
                  </Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-orange-600" />
                  Learning Resources
                </CardTitle>
                <CardDescription>
                  Improve your financial knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Financial Guides
                </Button>
                
                <Link href="/ai-test">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    AI Chat Examples
                    <Badge variant="secondary" className="ml-auto">
                      New
                    </Badge>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

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
                Chat with AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
