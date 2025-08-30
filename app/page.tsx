"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import {
  ChevronRight,
  BarChart3,
  Users,
  DollarSign,
  Target,
  Settings,
  Bell,
  RefreshCw,
  Calendar,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Button } from "../components/ui/button"
// Import all page components
import AnalyticsPage from "./analytics/page"
import CommandCenterPage from "./command-center/page"
import EmployeesPage from "./employees/page"
import IntelligencePage from "./intelligence/page"
import KPIPage from "./kpi/page"
import OperationsPage from "./operations/page"
import PayrollPage from "./payroll/page"
import SalaryPage from "./salary/page"
import SalaryPaymentPage from "./salary-payment/page"
import SettingsPage from "./settings/page"
import SystemsPage from "./systems/page"
import TasksPage from "./tasks/page"

export default function HRDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-72"} bg-sidebar border-r border-sidebar-border transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-primary font-bold text-xl tracking-wide">HR System</h1>
              <p className="text-muted-foreground text-sm">Personnel Management</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-sidebar-foreground hover:text-primary"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "employees", icon: Users, label: "Employees" },
              { id: "payroll", icon: DollarSign, label: "Payroll" },
              { id: "salary-payment", icon: Wallet, label: "Salary Payment" },
              { id: "kpi", icon: TrendingUp, label: "KPI" },
              { id: "tasks", icon: Target, label: "Tasks" },
              { id: "analytics", icon: Calendar, label: "Analytics" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-card-foreground">System Active</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Employees: 247</div>
                <div>Active Tasks: 89</div>
                <div>Updated: Today</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              HR SYSTEM /{" "}
              <span className="text-primary font-medium">
                {activeSection === "overview"
                  ? "OVERVIEW"
                  : activeSection === "employees"
                    ? "EMPLOYEES"
                    : activeSection === "payroll"
                      ? "PAYROLL"
                      : activeSection === "salary-payment"
                        ? "SALARY PAYMENT"
                        : activeSection === "kpi"
                          ? "KPI"
                          : activeSection === "tasks"
                            ? "TASKS"
                            : activeSection === "analytics"
                              ? "ANALYTICS"
                              : "SETTINGS"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US")}</div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-background">
          {activeSection === "overview" && <OverviewPage />}
          {activeSection === "employees" && EmployeesPage && <EmployeesPage />}
          {activeSection === "payroll" && PayrollPage && <PayrollPage />}
          {activeSection === "salary-payment" && SalaryPaymentPage && <SalaryPaymentPage />}
          {activeSection === "kpi" && KPIPage && <KPIPage />}
          {activeSection === "tasks" && TasksPage && <TasksPage />}
          {activeSection === "analytics" && AnalyticsPage && <AnalyticsPage />}
          {activeSection === "settings" && SettingsPage && <SettingsPage />}
        </div>
      </div>
    </div>
  )
}

function OverviewPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">System Overview</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create Report</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-card-foreground">247</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payroll Fund</p>
              <p className="text-2xl font-bold text-card-foreground">$2.1M</p>
            </div>
            <DollarSign className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <p className="text-2xl font-bold text-card-foreground">89</p>
            </div>
            <Target className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average KPI</p>
              <p className="text-2xl font-bold text-card-foreground">87%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">New employee added: John Smith</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">KPI updated for development department</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">December salary payments completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}


