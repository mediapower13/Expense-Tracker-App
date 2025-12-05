"use client"

import { useState } from "react"
import { User, Bell, Shield, Globe, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SettingsView() {
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: true,
    emailAlerts: false,
    darkMode: true,
    currency: "USD",
    language: "English",
  })

  const handleSave = () => {
    // Save settings logic would go here
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-br from-card via-card to-card/95 rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your preferences and account settings</p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
            <p className="text-sm text-muted-foreground">Update your personal details</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Bell className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.notifications ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.emailAlerts ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailAlerts ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-success/10 rounded-lg">
            <Globe className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Preferences</h3>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Manage your account security</p>
          </div>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
