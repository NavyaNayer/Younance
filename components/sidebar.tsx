"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Home, 
  Calculator, 
  MessageCircle, 
  Target, 
  Receipt, 
  Settings,
  Menu,
  TrendingUp,
  User,
  HelpCircle,
  BarChart3,
  PiggyBank,
  CreditCard,
  Smartphone,
  X,
  ChevronLeft,
  Sparkles,
  Bot,
  BookOpen,
  DollarSign,
  TrendingDown,
  Calendar,
  FileText,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainNavigationItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: Home,
    description: "Overview & insights"
  },
  { 
    name: "AI Chat", 
    href: "/chat", 
    icon: MessageCircle,
    description: "Financial assistant & future self",
    badge: "AI"
  },
  { 
    name: "Calculators", 
    href: "/calculators", 
    icon: Calculator,
    description: "Financial planning tools"
  },
  { 
    name: "What-If", 
    href: "/what-if", 
    icon: TrendingUp,
    description: "Scenario planning & analysis",
    badge: "Popular"
  },
  { 
    name: "Challenges", 
    href: "/challenges", 
    icon: Target,
    description: "Goals & achievements"
  },
  { 
    name: "Expenses", 
    href: "/expenses", 
    icon: Receipt,
    description: "Track & manage spending"
  },
]

const calculatorItems = [
  { name: "Compound Interest", href: "/calculators#compound", icon: TrendingUp },
  { name: "SIP Calculator", href: "/calculators#sip", icon: PiggyBank },
  { name: "Loan Calculator", href: "/calculators#loan", icon: CreditCard },
  { name: "Retirement Planning", href: "/calculators#retirement", icon: Calendar },
  { name: "Emergency Fund", href: "/calculators#emergency", icon: Smartphone },
  { name: "Mortgage Calculator", href: "/calculators#mortgage", icon: Home },
]

const quickActions = [
  { name: "Setup Profile", href: "/setup", icon: User },
  { name: "AI Test", href: "/ai-test", icon: Bot, badge: "New" },
  { name: "Financial News", href: "/dashboard#news", icon: FileText },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const pathname = usePathname()
  const [userData, setUserData] = useState<any>(null)

  // Load user data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }, [])

  const NavSection = ({ 
    title, 
    items, 
    showDescriptions = true 
  }: { 
    title: string
    items: any[]
    showDescriptions?: boolean 
  }) => (
    <div className="space-y-2 overflow-x-hidden">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 truncate">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3 py-2 mx-2 rounded-lg transition-all duration-200 group min-w-0",
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {showDescriptions && item.description && (
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-white/80" : "text-gray-500"
                    )}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"} 
                  className={cn(
                    "text-xs ml-2 flex-shrink-0",
                    isActive ? "bg-white/20 text-white border-white/30" : ""
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        // Mobile: fixed overlay, Desktop: fixed positioned sidebar
        "w-80 max-w-[80vw] bg-white border-r border-gray-200 z-50 overflow-x-hidden",
        // Mobile positioning and transforms
        "fixed left-0 top-0 h-full transform transition-transform duration-300 ease-in-out lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop positioning 
        "lg:fixed lg:left-0 lg:top-0 lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 min-w-0">
            <Link href="/" className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent truncate">
                  YouNance
                </h1>
                <p className="text-xs text-gray-500 truncate">Financial Planning</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Profile Section */}
          {userData && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 overflow-x-hidden">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData.name || "Welcome"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Goal: {userData.goal || "Set your goal"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6">
            {/* Main Navigation */}
            <NavSection title="Main" items={mainNavigationItems} />
            
            <Separator className="mx-4" />
            
            {/* Quick Calculators */}
            <NavSection 
              title="Calculators" 
              items={calculatorItems} 
              showDescriptions={false}
            />
            
            <Separator className="mx-4" />
            
            {/* Quick Actions */}
            <NavSection 
              title="Quick Actions" 
              items={quickActions} 
              showDescriptions={false}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2 overflow-x-hidden">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors min-w-0"
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">Settings</span>
            </Link>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">© 2025 YouNance</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface SidebarLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function SidebarLayout({ children, showSidebar = true }: SidebarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  // Load user data to check if setup is complete
  useEffect(() => {
    const loadUserData = () => {
      const savedData = localStorage.getItem("younance-user-data")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log("Loaded user data:", parsedData) // Debug log
          setUserData(parsedData)
        } catch (error) {
          console.error("Failed to parse user data:", error)
        }
      }
      setIsLoading(false)
    }

    loadUserData()

    // Listen for storage changes (when user completes setup)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "younance-user-data") {
        loadUserData()
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadUserData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('younance-data-updated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('younance-data-updated', handleCustomStorageChange)
    }
  }, [])

  // Re-check user data when pathname changes (navigation)
  useEffect(() => {
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setUserData(parsedData)
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }, [pathname])

  // Hide sidebar on landing page and before setup is complete
  const isSetupComplete = userData && userData.name && userData.goal && userData.currency
  console.log("Setup complete check:", { userData, isSetupComplete }) // Debug log
  const shouldShowSidebar = showSidebar && pathname !== '/' && pathname !== '/setup' && isSetupComplete

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 overflow-x-hidden">
      {!isLoading && shouldShowSidebar && (
        <>
          {/* Mobile Header - only show on mobile */}
          <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30 overflow-x-hidden">
            <div className="flex items-center justify-between p-4 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="h-10 w-10 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Link href="/" className="flex items-center space-x-2 min-w-0 flex-1 justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent truncate">
                  YouNance
                </span>
              </Link>
              
              <div className="w-10 flex-shrink-0" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Desktop Sidebar - always visible on desktop */}
          <div className="hidden lg:block">
            <Sidebar 
              isOpen={true} 
              onClose={() => {}} 
            />
          </div>

          {/* Mobile Sidebar - overlay on mobile */}
          <div className="lg:hidden">
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 overflow-x-hidden min-w-0 w-full",
        !isLoading && shouldShowSidebar ? "lg:ml-80 lg:w-[calc(100%-20rem)]" : ""
      )}>
        {children}
      </div>
    </div>
  )
}
