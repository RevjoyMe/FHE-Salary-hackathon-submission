"use client"

import { Settings, Users, Bell, Shield, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Auto Update</h3>
                <p className="text-sm text-muted-foreground">Update data every 5 minutes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Dark Theme</h3>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Compact Mode</h3>
                <p className="text-sm text-muted-foreground">Reduce interface spacing</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">New User Registration</h3>
                <p className="text-sm text-muted-foreground">Allow self-registration</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Sessions</h3>
                <p className="text-sm text-muted-foreground">Auto logout after 8 hours</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Send important notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Show notifications in browser</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Weekly Reports</h3>
                <p className="text-sm text-muted-foreground">Automatically send reports</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Action Logging</h3>
                <p className="text-sm text-muted-foreground">Log all user actions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Data Encryption</h3>
                <p className="text-sm text-muted-foreground">Encrypt sensitive data</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Backup</h3>
                <p className="text-sm text-muted-foreground">Create daily backups</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-card-foreground mb-2">System Version</h3>
              <p className="text-sm text-muted-foreground">HR System v2.1.0</p>
            </div>
            <div>
              <h3 className="font-medium text-card-foreground mb-2">Database</h3>
              <p className="text-sm text-muted-foreground">PostgreSQL 14.2</p>
            </div>
            <div>
              <h3 className="font-medium text-card-foreground mb-2">Last Update</h3>
              <p className="text-sm text-muted-foreground">December 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
