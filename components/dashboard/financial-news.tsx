"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CurrencyDisplay } from "@/components/ui/currency"
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  DollarSign,
  BarChart3,
  Bitcoin,
  Globe,
} from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  category: "market" | "economy" | "crypto" | "personal"
  sentiment: "positive" | "negative" | "neutral"
  impact: "high" | "medium" | "low"
  source: string
  timestamp: string
  url: string
}

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  icon: any
}

export function FinancialNews() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Fed Signals Potential Rate Cuts in 2024",
      summary: "Federal Reserve hints at possible interest rate reductions amid cooling inflation data.",
      category: "economy",
      sentiment: "positive",
      impact: "high",
      source: "Reuters",
      timestamp: "2 hours ago",
      url: "#",
    },
    {
      id: "2",
      title: "S&P 500 Reaches New All-Time High",
      summary: "Major stock indices continue their upward trajectory as investor confidence grows.",
      category: "market",
      sentiment: "positive",
      impact: "medium",
      source: "MarketWatch",
      timestamp: "4 hours ago",
      url: "#",
    },
    {
      id: "3",
      title: "401(k) Contribution Limits Increase for 2024",
      summary: "IRS announces higher contribution limits for retirement accounts, benefiting savers.",
      category: "personal",
      sentiment: "positive",
      impact: "medium",
      source: "IRS",
      timestamp: "1 day ago",
      url: "#",
    },
    {
      id: "4",
      title: "Bitcoin Volatility Continues Amid Regulatory News",
      summary: "Cryptocurrency markets show mixed signals following latest regulatory developments.",
      category: "crypto",
      sentiment: "neutral",
      impact: "medium",
      source: "CoinDesk",
      timestamp: "6 hours ago",
      url: "#",
    },
    {
      id: "5",
      title: "Emergency Fund: Why 6 Months Isn't Always Enough",
      summary: "Financial experts recommend larger emergency funds in uncertain economic times.",
      category: "personal",
      sentiment: "neutral",
      impact: "low",
      source: "Financial Planning",
      timestamp: "1 day ago",
      url: "#",
    },
  ]

  const marketData: MarketData[] = [
    {
      symbol: "SPY",
      name: "S&P 500",
      price: 4756.5,
      change: 23.45,
      changePercent: 0.49,
      icon: BarChart3,
    },
    {
      symbol: "QQQ",
      name: "NASDAQ",
      price: 408.12,
      change: -2.34,
      changePercent: -0.57,
      icon: TrendingUp,
    },
    {
      symbol: "VTI",
      name: "Total Stock Market",
      price: 245.67,
      change: 1.23,
      changePercent: 0.5,
      icon: Globe,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 43250.0,
      change: -1250.0,
      changePercent: -2.81,
      icon: Bitcoin,
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "market":
        return BarChart3
      case "economy":
        return TrendingUp
      case "crypto":
        return Bitcoin
      case "personal":
        return DollarSign
      default:
        return Newspaper
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market":
        return "bg-emerald-100 text-emerald-800"
      case "economy":
        return "bg-green-100 text-green-800"
      case "crypto":
        return "bg-orange-100 text-orange-800"
      case "personal":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-emerald-600" />
            <span>Financial News</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-8 w-8 p-0">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news" className="text-xs">
              Latest News
            </TabsTrigger>
            <TabsTrigger value="market" className="text-xs">
              Market Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4 mt-4">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {newsItems.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category)
                return (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="h-4 w-4 text-gray-600" />
                        <Badge className={`text-xs ${getCategoryColor(item.category)}`}>{item.category}</Badge>
                        <Badge className={`text-xs ${getImpactColor(item.impact)}`}>{item.impact}</Badge>
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </div>

                    <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{item.title}</h4>

                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.summary}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{item.source}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{item.timestamp}</span>
                      </div>
                      <div className={`font-medium ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment === "positive" && "↗"}
                        {item.sentiment === "negative" && "↘"}
                        {item.sentiment === "neutral" && "→"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4 mt-4">
            <div className="space-y-3">
              {marketData.map((data) => {
                const isPositive = data.change > 0
                const IconComponent = data.icon
                return (
                  <div
                    key={data.symbol}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{data.symbol}</div>
                        <div className="text-xs text-gray-600">{data.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-sm text-gray-900">
                        <CurrencyDisplay amount={data.price} />
                      </div>
                      <div
                        className={`text-xs flex items-center space-x-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>
                          {isPositive ? "+" : ""}<CurrencyDisplay amount={Math.abs(data.change)} />({isPositive ? "+" : ""}
                          {data.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Market data delayed by 15 minutes. For informational purposes only.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
