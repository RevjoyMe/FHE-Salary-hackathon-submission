"use client"

import { useState } from "react"
import { Building2, Users, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Employee {
  address: string
  salary: string // encrypted
  isActive: boolean
  lastPaymentDate?: string
}

interface Company {
  name: string
  address: string
  totalPayroll: string // encrypted
  employeeCount: number
}

export default function SalarySystemPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Company state
  const [company, setCompany] = useState<Company | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false)

  // Employee state
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmployeeAddress, setNewEmployeeAddress] = useState("")
  const [newEmployeeSalary, setNewEmployeeSalary] = useState("")
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)

  // Mock MetaMask connection
  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate MetaMask connection
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsConnected(true)
      setUserAddress("0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e")
      showNotification("success", "Wallet connected successfully!")
    } catch (error) {
      showNotification("error", "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const registerCompany = async () => {
    if (!companyName.trim()) return

    setIsRegisteringCompany(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newCompany: Company = {
        name: companyName,
        address: userAddress,
        totalPayroll: "encrypted_payroll_data",
        employeeCount: 0,
      }

      setCompany(newCompany)
      setCompanyName("")
      showNotification("success", "Company registered successfully!")
    } catch (error) {
      showNotification("error", "Failed to register company")
    } finally {
      setIsRegisteringCompany(false)
    }
  }

  const addEmployee = async () => {
    if (!newEmployeeAddress.trim() || !newEmployeeSalary.trim()) return

    setIsAddingEmployee(true)
    try {
      // Simulate FHE encryption and blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const newEmployee: Employee = {
        address: newEmployeeAddress,
        salary: "encrypted_salary_data",
        isActive: true,
      }

      setEmployees((prev) => [...prev, newEmployee])

      // Update company employee count
      if (company) {
        setCompany((prev) => (prev ? { ...prev, employeeCount: prev.employeeCount + 1 } : null))
      }

      setNewEmployeeAddress("")
      setNewEmployeeSalary("")
      showNotification("success", "Employee added successfully!")
    } catch (error) {
      showNotification("error", "Failed to add employee")
    } finally {
      setIsAddingEmployee(false)
    }
  }

  const paySalary = async (employeeAddress: string) => {
    setIsLoading(true)
    try {
      // Simulate salary payment transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.address === employeeAddress ? { ...emp, lastPaymentDate: new Date().toLocaleDateString() } : emp,
        ),
      )

      showNotification("success", "Salary paid successfully!")
    } catch (error) {
      showNotification("error", "Failed to pay salary")
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Confidential Salary System</h1>
            <p className="text-lg text-neutral-400">
              Manage employee salaries with complete privacy using Fully Homomorphic Encryption
            </p>
          </div>

          <Button
            onClick={connectWallet}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-black border border-white px-6 py-4 text-4xl font-semibold text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect to MetaMask"
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6" />
              Confidential Salary System
            </CardTitle>
            <CardDescription className="text-lg text-neutral-400">
              Manage employee salaries with complete privacy using Fully Homomorphic Encryption
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Notifications */}
        {notification && (
          <Alert
            className={`${
              notification.type === "success"
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                notification.type === "success"
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Management
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Management
            </TabsTrigger>
          </TabsList>

          {/* Company Management Tab */}
          <TabsContent value="company" className="space-y-6">
            {!company ? (
              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader>
                  <CardTitle>Register Your Company</CardTitle>
                  <CardDescription>Register your company to start managing confidential salaries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-neutral-800 border-neutral-600"
                    />
                  </div>
                  <Button
                    onClick={registerCompany}
                    disabled={!companyName.trim() || isRegisteringCompany}
                    className="w-full bg-black text-white hover:bg-blue-700"
                  >
                    {isRegisteringCompany ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Company"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-neutral-900 border-neutral-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-400">Company Name</p>
                        <p className="text-2xl font-bold">{company.name}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-neutral-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-400">Employees</p>
                        <p className="text-2xl font-bold">{company.employeeCount}</p>
                      </div>
                      <Users className="h-8 w-8 text-neutral-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-400">Total Payroll</p>
                        <p className="text-2xl font-bold text-green-600">Encrypted</p>
                        <p className="text-xs text-neutral-500">Encrypted with FHE</p>
                      </div>
                      <EyeOff className="h-8 w-8 text-neutral-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Employee Management Tab */}
          <TabsContent value="employees" className="space-y-6">
            {!company ? (
              <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                  Please register your company first to manage employees
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Add Employee Form */}
                <Card className="bg-neutral-900 border-neutral-700">
                  <CardHeader>
                    <CardTitle>Add New Employee</CardTitle>
                    <CardDescription>Add an employee with encrypted salary information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeAddress">Employee Address</Label>
                        <Input
                          id="employeeAddress"
                          placeholder="0x..."
                          value={newEmployeeAddress}
                          onChange={(e) => setNewEmployeeAddress(e.target.value)}
                          className="bg-neutral-800 border-neutral-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary Amount (USD)</Label>
                        <Input
                          id="salary"
                          type="number"
                          placeholder="5000"
                          value={newEmployeeSalary}
                          onChange={(e) => setNewEmployeeSalary(e.target.value)}
                          className="bg-neutral-800 border-neutral-600"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addEmployee}
                      disabled={!newEmployeeAddress.trim() || !newEmployeeSalary.trim() || isAddingEmployee}
                      className="w-full bg-black text-white hover:bg-blue-700"
                    >
                      {isAddingEmployee ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding Employee...
                        </>
                      ) : (
                        "Add Employee"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Employee List */}
                <Card className="bg-neutral-900 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Employees ({employees.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {employees.length === 0 ? (
                      <p className="text-center text-neutral-500 py-8">No employees added yet</p>
                    ) : (
                      <div className="space-y-4">
                        {employees.map((employee, index) => (
                          <Card key={index} className="bg-neutral-800 border-neutral-600">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{formatAddress(employee.address)}</p>
                                    <Badge variant={employee.isActive ? "default" : "secondary"}>
                                      {employee.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                                    <EyeOff className="h-4 w-4" />
                                    <span>Salary: Encrypted</span>
                                  </div>
                                  {employee.lastPaymentDate && (
                                    <p className="text-xs text-neutral-500">Last payment: {employee.lastPaymentDate}</p>
                                  )}
                                </div>
                                {employee.isActive && (
                                  <Button
                                    onClick={() => paySalary(employee.address)}
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Salary"}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* FHE Information Section */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle>How FHE Protects Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <EyeOff className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Encrypted Salaries</h3>
                <p className="text-sm text-neutral-400">
                  All salary amounts are encrypted using FHE and remain private
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Verifiable Payments</h3>
                <p className="text-sm text-neutral-400">Payments are verified on-chain without revealing amounts</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Company Control</h3>
                <p className="text-sm text-neutral-400">
                  Companies can manage payroll while maintaining confidentiality
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
