"use client"

import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

const employeeGrowthData = [
  { month: "Jan", employees: 210, newHires: 15, departures: 8 },
  { month: "Feb", employees: 217, newHires: 12, departures: 5 },
  { month: "Mar", employees: 225, newHires: 18, departures: 10 },
  { month: "Apr", employees: 233, newHires: 14, departures: 6 },
  { month: "May", employees: 241, newHires: 16, departures: 8 },
  { month: "Jun", employees: 247, newHires: 11, departures: 5 },
]

const departmentData = [
  { name: "Engineering", value: 89, color: "#0ea5e9" },
  { name: "Sales", value: 45, color: "#84cc16" },
  { name: "Marketing", value: 32, color: "#f59e0b" },
  { name: "HR", value: 28, color: "#ef4444" },
  { name: "Finance", value: 25, color: "#8b5cf6" },
  { name: "Operations", value: 28, color: "#06b6d4" },
]

const salaryTrendData = [
  { month: "Jan", avgSalary: 48000, totalPayroll: 10080000 },
  { month: "Feb", avgSalary: 48500, totalPayroll: 10524500 },
  { month: "Mar", avgSalary: 49200, totalPayroll: 11070000 },
  { month: "Apr", avgSalary: 50100, totalPayroll: 11673300 },
  { month: "May", avgSalary: 51200, totalPayroll: 12339200 },
  { month: "Jun", avgSalary: 52000, totalPayroll: 12844000 },
]

const kpiPerformanceData = [
  { department: "Engineering", performance: 92, target: 85 },
  { department: "Sales", performance: 88, target: 90 },
  { department: "Marketing", performance: 85, target: 80 },
  { department: "HR", performance: 91, target: 85 },
  { department: "Finance", performance: 89, target: 85 },
  { department: "Operations", performance: 87, target: 85 },
]

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Period
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">+12%</span>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">3.2%</span>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Below industry average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">$52K</span>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">+5% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">4.6/5</span>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Survey results</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={employeeGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="employees" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Salary Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "avgSalary" ? `$${value.toLocaleString()}` : `$${(value / 1000000).toFixed(1)}M`,
                      name === "avgSalary" ? "Average Salary" : "Total Payroll",
                    ]}
                  />
                  <Line type="monotone" dataKey="avgSalary" stroke="#84cc16" strokeWidth={2} />
                  <Line type="monotone" dataKey="totalPayroll" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPI Performance by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="performance" fill="#0ea5e9" name="Performance" />
                  <Bar dataKey="target" fill="#84cc16" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Ready Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-card-foreground mb-2">Salary Report</h3>
              <p className="text-sm text-muted-foreground mb-3">Detailed payroll fund analysis</p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-card-foreground mb-2">KPI Report</h3>
              <p className="text-sm text-muted-foreground mb-3">Employee performance indicators</p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-card-foreground mb-2">Task Report</h3>
              <p className="text-sm text-muted-foreground mb-3">Task completion statistics</p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
