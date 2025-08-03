"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [userData, setUserData] = useState<any>(null)
  const [notifications, setNotifications] = useState({
    goalReminders: true,
    weeklyReports: true,
    marketUpdates: false,
    challengeUpdates: true
  })
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: true,
    marketingEmails: false
  })

  useEffect(() => {
    // Load user data
    const savedData = localStorage.getItem("younance-user-data")
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData))
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }

    // Load settings
    const savedNotifications = localStorage.getItem("younance-notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }

    const savedPrivacy = localStorage.getItem("younance-privacy")
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy))
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("younance-notifications", JSON.stringify(notifications))
    localStorage.setItem("younance-privacy", JSON.stringify(privacy))
    // Show success message (you could add a toast here)
    alert("Settings saved successfully!")
  }

  const exportData = () => {
    const allData = {
      userData,
      notifications,
      privacy,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = `younance-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("younance-user-data")
      localStorage.removeItem("younance-notifications")
      localStorage.removeItem("younance-privacy")
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your basic profile information and financial goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-gray-600 mt-1">{userData.name}</p>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <p className="text-sm text-gray-600 mt-1">{userData.age} years</p>
                  </div>
                  <div>
                    <Label>Financial Goal</Label>
                    <p className="text-sm text-gray-600 mt-1">{userData.goal}</p>
                  </div>
                  <div>
                    <Label>Target Amount</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      ${Number.parseFloat(userData.goalAmount || "0").toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Monthly Savings</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      ${Number.parseFloat(userData.monthlySavings || "0").toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Time Frame</Label>
                    <p className="text-sm text-gray-600 mt-1">{userData.timeframe} years</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No profile information found</p>
                  <Link href="/setup">
                    <Button>Complete Profile Setup</Button>
                  </Link>
                </div>
              )}
              
              {userData && (
                <div className="pt-4">
                  <Link href="/setup">
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Goal Reminders</Label>
                  <p className="text-sm text-gray-600">Weekly reminders about your financial goals</p>
                </div>
                <Switch
                  checked={notifications.goalReminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, goalReminders: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Summary of your financial progress</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Market Updates</Label>
                  <p className="text-sm text-gray-600">Important market news and trends</p>
                </div>
                <Switch
                  checked={notifications.marketUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, marketUpdates: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Challenge Updates</Label>
                  <p className="text-sm text-gray-600">Progress on financial challenges and achievements</p>
                </div>
                <Switch
                  checked={notifications.challengeUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, challengeUpdates: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Control how your data is used and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Collection</Label>
                  <p className="text-sm text-gray-600">Allow anonymous usage analytics to improve the app</p>
                </div>
                <Switch
                  checked={privacy.dataCollection}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, dataCollection: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-gray-600">Help us understand how features are used</p>
                </div>
                <Switch
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-gray-600">Receive tips and updates about personal finance</p>
                </div>
                <Switch
                  checked={privacy.marketingEmails}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, marketingEmails: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-orange-600" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Export Data</Label>
                  <p className="text-sm text-gray-600">Download all your data as a JSON file</p>
                </div>
                <Button variant="outline" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Clear All Data</Label>
                  <p className="text-sm text-red-600">Permanently delete all your data and settings</p>
                </div>
                <Button variant="destructive" onClick={clearAllData}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="flex justify-center pt-4">
            <Button onClick={saveSettings} size="lg" className="min-w-40">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
