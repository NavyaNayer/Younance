"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Home, 
  Calculator, 
  MessageCircle, 
  Target, 
  Receipt, 
  Settings,
  Menu,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils" 
  Calculator, 
  MessageCircle, 
  Target, 
  Receipt, 
  Settings,
  Menu,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Calculators", href: "/calculators", icon: Calculator },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Expenses", href: "/expenses", icon: Receipt },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              mobile ? "w-full" : ""
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-2">
        <NavItems />
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="md:hidden rounded-xl">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">YouNance</span>
          </div>
          
          <div className="space-y-2">
            <NavItems mobile />
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/setup"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export function AppHeader({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string
  subtitle?: string
  children?: React.ReactNode 
}) {
  return (
    <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">YouNance</h1>
                {subtitle && <p className="text-sm text-gray-600 truncate">{subtitle}</p>}
              </div>
            </Link>
            
            <div className="hidden lg:block">
              <Navigation />
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            {children}
            <div className="lg:hidden">
              <Navigation />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
