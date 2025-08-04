"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, Sparkles, MessageCircle, Loader2 } from "lucide-react"

interface UserData {
  name: string
  age: string
  income: string
  currentSavings: string
  monthlySavings: string
  goal: string
  goalAmount: string
  timeframe: string
  riskTolerance: string
  expenses: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export default function ChatPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("future-self")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Separate message states for each chat
  const [assistantMessages, setAssistantMessages] = useState<Message[]>([
    {
      id: "welcome-assistant",
      role: "assistant",
      content: "Hi! I'm your financial assistant. I'm here to help you understand financial concepts, answer questions about investing, and guide you on your financial journey. What would you like to know?",
      timestamp: new Date(),
    },
  ])

  const [futureMessages, setFutureMessages] = useState<Message[]>([])

  useEffect(() => {
    setMounted(true)
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      const data = JSON.parse(savedData)
      setUserData(data)

      // Initialize future self chat with personalized welcome
      if (futureMessages.length === 0) {
        const futureAge = Number.parseInt(data.age) + Number.parseInt(data.timeframe || "10")
        const welcomeMessage: Message = {
          id: "welcome-future",
          role: "assistant",
          content: `Hey ${data.name}! It's me - you from the future! I'm ${futureAge} years old now, and I wanted to tell you about our amazing financial journey. Thanks to the smart decisions you're making today, our life has transformed in incredible ways. What would you like to know about our future?`,
          timestamp: new Date(),
        }
        setFutureMessages([welcomeMessage])
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [assistantMessages, futureMessages])

  const currentMessages = activeTab === "assistant" ? assistantMessages : futureMessages
  const setCurrentMessages = activeTab === "assistant" ? setAssistantMessages : setFutureMessages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    // Add user message
    setCurrentMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const endpoint = activeTab === "assistant" ? "/api/chat/assistant" : "/api/chat/future-self"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...currentMessages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          userData: userData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setCurrentMessages((prev) => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantContent += parsed.content
                  setCurrentMessages((prev) =>
                    prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: assistantContent } : msg)),
                  )
                }
              } catch (e) {
                // Ignore parsing errors for malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove the loading assistant message and show error
      setCurrentMessages((prev) => prev.slice(0, -1))
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setCurrentMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-4 border border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">World's First Future Self AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat with Your Future Self</h1>
          <p className="text-lg text-gray-600">Experience conversations with the AI version of yourself who achieved financial freedom</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="future-self" className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />
              Future You
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4" />
              Financial Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="future-self" className="space-y-4">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5"></div>
              <CardHeader className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>Your Future Self</span>
                      {userData && (
                        <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded-full">
                          Age {Number.parseInt(userData.age) + Number.parseInt(userData.timeframe || "10")}
                        </span>
                      )}
                    </div>
                    <div className="text-purple-100 text-sm font-normal mt-1">
                      {userData ? `From ${userData.timeframe || "10"} years in the future` : "From your financial future"}
                    </div>
                  </div>
                </CardTitle>
                {userData && (
                  <div className="bg-white/10 rounded-lg p-3 mt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-200">Goal Achieved:</span>
                        <div className="font-semibold">${Number.parseFloat(userData.goalAmount || "0").toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-purple-200">Status:</span>
                        <div className="font-semibold flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Online & Ready
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="relative z-10 space-y-4 p-6">
                {/* Messages Container */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/30">
                  {futureMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[75%] shadow-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-white/80 backdrop-blur-sm border border-purple-200/50"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.timestamp && (
                          <p className={`text-xs mt-2 ${message.role === "user" ? "text-purple-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      
                      {message.role === "user" && (
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && activeTab === "future-self" && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span className="text-sm text-gray-600">Future you is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions for First Interaction */}
                {futureMessages.length <= 1 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">💡 Try asking your future self:</p>
                    <div className="grid gap-2">
                      {[
                        "What was the best financial decision I made?",
                        "How did you achieve our goal so quickly?",
                        "What should I focus on right now?",
                        "What mistakes should I avoid?",
                      ].map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="text-left p-3 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/30 transition-all duration-200 hover:shadow-md text-sm"
                        >
                          "{question}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your future self anything..."
                    disabled={isLoading}
                    className="flex-1 border-purple-200/50 focus:border-purple-400 bg-white/60 backdrop-blur-sm"
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoading} 
                    size="icon"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Financial Assistant
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Get expert advice on investments, budgeting, and financial planning
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages Container */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50/50 rounded-lg">
                  {assistantMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[75%] ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.timestamp && (
                          <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && activeTab === "assistant" && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {assistantMessages.length <= 1 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">💡 Popular questions:</p>
                    <div className="grid gap-2">
                      {[
                        "How should I start investing?",
                        "What's a good emergency fund size?",
                        "How do I create a budget?",
                        "What are index funds?",
                      ].map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm"
                        >
                          "{question}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about investments, budgeting, savings..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoading} 
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
