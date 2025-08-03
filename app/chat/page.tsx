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
  const [activeTab, setActiveTab] = useState("assistant")
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
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setCurrentMessages((prev) => [...prev.slice(0, -1), errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Financial Chat</h1>
          <p className="text-gray-600">Get personalized financial guidance from your AI assistants</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Financial Assistant
            </TabsTrigger>
            <TabsTrigger value="future-self" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Future Self
            </TabsTrigger>
          </TabsList>

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
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-white border shadow-sm">
                        <p className="text-sm text-gray-500">Thinking...</p>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {assistantMessages.length <= 1 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion("How should I start investing with limited funds?")}
                        className="text-xs"
                      >
                        How to start investing?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion("What's the best way to create an emergency fund?")}
                        className="text-xs"
                      >
                        Emergency fund tips
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSuggestedQuestion("Explain compound interest with an example")}
                        className="text-xs"
                      >
                        Compound interest
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2">
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

          <TabsContent value="future-self" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Chat with Future You
                  {userData && (
                    <span className="text-sm font-normal text-gray-600">
                      (Age {Number.parseInt(userData.age) + Number.parseInt(userData.timeframe || "10")})
                    </span>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Get motivated by your financially successful future self
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages Container */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-lg">
                  {futureMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                      
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[75%] ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-white border shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.timestamp && (
                          <p className={`text-xs mt-1 ${message.role === "user" ? "text-purple-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                      
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && activeTab === "future-self" && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-white border shadow-sm">
                        <p className="text-sm text-gray-500">Your future self is thinking...</p>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {futureMessages.length <= 1 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Questions for your future self:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion("How did our financial journey turn out?")}
                        className="text-xs"
                      >
                        How did our journey turn out?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion("What's the best advice you can give me?")}
                        className="text-xs"
                      >
                        What advice do you have?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion("Did we achieve our financial goals?")}
                        className="text-xs"
                      >
                        Did we achieve our goals?
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your future self about your financial journey..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoading} 
                    size="icon"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
