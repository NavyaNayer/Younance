"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Sparkles, MessageCircle, Clock, CheckCircle2 } from "lucide-react"

interface ChatBubbleProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp?: Date
  }
  isTyping?: boolean
  assistantType?: "financial" | "future"
}

export function ChatBubble({ message, isTyping = false, assistantType = "financial" }: ChatBubbleProps) {
  const isUser = message.role === "user"
  const [showTimestamp, setShowTimestamp] = useState(false)

  const assistantColors = {
    financial: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      userBg: "bg-emerald-600",
      gradient: "bg-emerald-600 hover:bg-emerald-700"
    },
    future: {
      bg: "bg-teal-100", 
      text: "text-teal-600",
      userBg: "bg-gradient-to-r from-teal-600 to-green-600",
      gradient: "bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700"
    }
  }

  const colors = assistantColors[assistantType]

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} group`}>
      {!isUser && (
        <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          {assistantType === "financial" ? (
            <Bot className={`h-4 w-4 ${colors.text}`} />
          ) : (
            <Sparkles className={`h-4 w-4 ${colors.text}`} />
          )}
        </div>
      )}
      
      <div
        className={`rounded-lg px-4 py-2 max-w-[75%] relative ${
          isUser
            ? `${colors.userBg} text-white`
            : "bg-white border shadow-sm hover:shadow-md transition-shadow"
        }`}
        onClick={() => setShowTimestamp(!showTimestamp)}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        
        {/* Typing indicator */}
        {isTyping && !isUser && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">Typing...</span>
          </div>
        )}
        
        {/* Timestamp */}
        {message.timestamp && showTimestamp && (
          <div className={`text-xs mt-2 flex items-center gap-1 ${
            isUser ? "text-white/70" : "text-gray-500"
          }`}>
            <Clock className="h-3 w-3" />
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        
        {/* Message status for user messages */}
        {isUser && (
          <div className="absolute -right-1 -bottom-1">
            <CheckCircle2 className="h-3 w-3 text-white/70" />
          </div>
        )}
      </div>
      
      {isUser && (
        <div className={`w-8 h-8 rounded-full ${colors.userBg} flex items-center justify-center flex-shrink-0`}>
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  )
}

interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  type?: "financial" | "future"
}

export function SuggestedQuestions({ questions, onQuestionClick, type = "financial" }: SuggestedQuestionsProps) {
  const colors = {
    financial: "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50",
    future: "border-teal-200 hover:border-teal-300 hover:bg-teal-50"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {type === "financial" ? (
            <MessageCircle className="h-4 w-4 text-emerald-600" />
          ) : (
            <Sparkles className="h-4 w-4 text-teal-600" />
          )}
          <p className="text-sm text-gray-600 font-medium">
            {type === "financial" ? "Try asking:" : "Questions for your future self:"}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Suggestions
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onQuestionClick(question)}
            className={`text-xs text-left h-auto py-2 px-3 whitespace-normal ${colors[type]} transition-all duration-200`}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
