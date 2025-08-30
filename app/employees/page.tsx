"use client"

import { useState } from "react"
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const employees = [
    {
      id: 1,
      name: "Anna Peterson",
      position: "Senior Developer",
      department: "Development",
      salary: "$8,000",
      kpi: 92,
      email: "anna.peterson@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "/professional-woman.png",
    },
    {
      id: 2,
      name: "Michael Sidorov",
      position: "Product Manager",
      department: "Product",
      salary: "$9,000",
      kpi: 88,
      email: "michael.sidorov@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "/professional-man.png",
    },
    {
      id: 3,
      name: "Elena Kozlova",
      position: "UX Designer",
      department: "Design",
      salary: "$7,500",
      kpi: 95,
      email: "elena.kozlova@company.com",
      phone: "+1 (555) 345-6789",
      avatar: "/woman-designer.png",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Employees</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={employee.avatar || "/placeholder.svg"}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Department:</span>
                <span className="text-sm font-medium">{employee.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Salary:</span>
                <span className="text-sm font-medium">{employee.salary}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">KPI:</span>
                <span
                  className={`text-sm font-medium ${employee.kpi >= 90 ? "text-accent" : employee.kpi >= 80 ? "text-primary" : "text-destructive"}`}
                >
                  {employee.kpi}%
                </span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
