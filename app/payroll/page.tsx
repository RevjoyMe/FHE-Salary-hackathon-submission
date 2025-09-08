"use client"

export const dynamic = 'force-dynamic'

import { Calendar, Download, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function PayrollPage() {
  const payrollData = [
    {
      month: "December 2024",
      totalAmount: "$1,240,000",
      employeeCount: 247,
      avgSalary: "$5,020",
      change: "+3.2%",
      isPositive: true,
    },
    {
      month: "November 2024",
      totalAmount: "$1,201,500",
      employeeCount: 245,
      avgSalary: "$4,904",
      change: "+1.8%",
      isPositive: true,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Payroll Fund</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Select Period
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Fund (December)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">$1.24M</span>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">+3.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">$5,020</span>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">+2.4% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Number of Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">247</span>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent">+2 new employees</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payrollData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{data.month}</h3>
                    <p className="text-sm text-muted-foreground">{data.employeeCount} employees</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-card-foreground">{data.totalAmount}</p>
                  <div className="flex items-center gap-1">
                    {data.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-accent" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm ${data.isPositive ? "text-accent" : "text-destructive"}`}>
                      {data.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
