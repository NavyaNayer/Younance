"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, TrendingUp, MessageCircle, Calculator, Target, Sparkles, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-green-100/50 backdrop-blur-sm rounded-3xl my-8 border border-white/20">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6 border border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">World's First Future Self AI</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Chat with Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 animate-gradient">
              Future Self
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Experience the revolutionary AI that lets you have real conversations with your future self who achieved financial freedom, 
            plus get comprehensive AI-powered financial health reports with personalized insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/setup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Meet Your Future Self <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg rounded-xl transition-all duration-300"
              >
                View Demo
              </Button>
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>10K+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Goal Achievement Rate: 85%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-4 py-20 bg-gradient-to-br from-white/50 via-slate-50/50 to-emerald-50/50 backdrop-blur-sm rounded-3xl my-8 border border-white/20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Revolutionary Future Self Experience</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The most advanced AI-powered financial planning experience ever created
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Future Self Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Chat with the AI version of yourself who achieved financial freedom and learn the exact steps you took
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-semibold">AI Financial Health Report</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Get comprehensive AI-powered analysis of your financial health with personalized insights and actionable recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Personalized Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Your future self shows you different paths and outcomes based on your specific financial situation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Wisdom-Driven Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Set goals based on real insights from your future self who knows what actually works for you
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 bg-gradient-to-br from-slate-50/30 via-white/30 to-emerald-50/30 backdrop-blur-sm rounded-3xl my-8 border border-white/20">
        <Card className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <CardContent className="relative text-center py-16 px-8">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Start Your Financial Transformation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to Meet Your Future Self?</h2>
              <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
                Join thousands who've already started their journey to financial freedom. Your future self is waiting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/setup">
                  <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl transition-all duration-300">
                    Try AI Chat Demo
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 text-center">
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">YouNance</span>
          </div>
          <p className="text-gray-600 mb-4">&copy; 2025 YouNance. Empowering financial futures with AI.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
