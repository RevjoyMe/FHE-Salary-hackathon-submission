"use client"

import { TrendingUp, Target, Award, Users } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

export default function KPIPage() {
  const departments = [
    {
      name: "Development",
      kpi: 92,
      employees: 45,
      trend: "+5%",
      color: "bg-primary",
    },
    {
      name: "Product",
      kpi: 88,
      employees: 12,
      trend: "+2%",
      color: "bg-accent",
    },
    {
      name: "Design",
      kpi: 95,
      employees: 8,
      trend: "+8%",
      color: "bg-chart-4",
    },
    {
      name: "Marketing",
      kpi: 85,
      employees: 15,
      trend: "-1%",
      color: "bg-chart-3",
    },
  ]

  const topPerformers = [
    { name: "Elena Kozlova", department: "Design", kpi: 98 },
    { name: "Anna Peterson", department: "Development", kpi: 96 },
    { name: "Michael Sidorov", department: "Product", kpi: 94 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">KPI and Performance</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Target className="w-4 h-4 mr-2" />
          Set Goals
        </Button>
      </div>

      {/* Overall KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Overall KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-card-foreground">87%</span>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <Progress value={87} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Best Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-card-foreground">Design</span>
                <p className="text-sm text-muted-foreground">95% KPI</p>
              </div>
              <Award className="w-8 h-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-card-foreground">24</span>
              <Target className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">18 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-accent">+4.2%</span>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Department KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Department KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-card-foreground">{dept.kpi}%</span>
                    <span className="text-sm text-accent">{dept.trend}</span>
                  </div>
                  <Progress value={dept.kpi} className="w-24 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">{performer.name}</h4>
                    <p className="text-sm text-muted-foreground">{performer.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-accent">{performer.kpi}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
