"use client"

import { useState, useEffect } from "react"
import { Building2, Users, EyeOff, CheckCircle, AlertCircle, Loader2, Wallet } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Badge } from "../../components/ui/badge"
import { salaryApi, API_CONFIG } from "../../lib/api"

interface Employee {
  address: string
  salary: string
  isActive: boolean
  lastPaymentDate?: string
}

interface Company {
  name: string
  address: string
  totalPayroll: string
  employeeCount: number
}

export default function SalaryPaymentPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [companyName, setCompanyName] = useState("")
  const [employeeAddress, setEmployeeAddress] = useState("")
  const [employeeSalary, setEmployeeSalary] = useState("")

  // Check if MetaMask is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // MetaMask is available
      console.log("MetaMask is available");
    } else {
      console.log("MetaMask is not available");
    }
  }, []);

  // Mock MetaMask connection
  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Simulate MetaMask connection
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsConnected(true)
      setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e")
      setNotification({ type: "success", message: "Wallet connected successfully!" })
    } catch (error) {
      setNotification({ type: "error", message: "Failed to connect wallet" })
    } finally {
      setIsLoading(false)
    }
  }

  const registerCompany = async () => {
    if (!companyName.trim()) return

    setIsLoading(true)
    try {
      // Call backend API
      const response = await salaryApi.registerCompany(companyName, walletAddress)
      
      if (response.success && response.data) {
        setCompany({
          name: response.data.name,
          address: response.data.address,
          totalPayroll: response.data.totalPayroll,
          employeeCount: response.data.employeeCount,
        })
        setCompanyName("")
        setNotification({ type: "success", message: "Company registered successfully!" })
      } else {
        throw new Error(response.error || "Failed to register company")
      }
    } catch (error) {
      console.error("Error registering company:", error)
      setNotification({ type: "error", message: "Failed to register company" })
    } finally {
      setIsLoading(false)
    }
  }

  const addEmployee = async () => {
    if (!employeeAddress.trim() || !employeeSalary.trim()) return

    setIsLoading(true)
    try {
      // In a real implementation, this would use FHE encryption
      const encryptedSalary = `encrypted_${employeeSalary}` // Placeholder
      const salaryProof = `proof_${employeeSalary}` // Placeholder

      // Call backend API
      const response = await salaryApi.addEmployee(
        employeeAddress,
        encryptedSalary,
        salaryProof,
        walletAddress
      )

      if (response.success && response.data) {
        const newEmployee: Employee = {
          address: response.data.address,
          salary: response.data.salary,
          isActive: response.data.isActive,
          lastPaymentDate: response.data.lastPaymentDate,
        }

        setEmployees([...employees, newEmployee])
        setCompany((prev) => (prev ? { ...prev, employeeCount: prev.employeeCount + 1 } : null))
        setNotification({ type: "success", message: "Employee added with encrypted salary!" })
        setEmployeeAddress("")
        setEmployeeSalary("")
      } else {
        throw new Error(response.error || "Failed to add employee")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      setNotification({ type: "error", message: "Failed to add employee" })
    } finally {
      setIsLoading(false)
    }
  }

  const paySalary = async (employeeAddr: string) => {
    setIsLoading(true)
    try {
      // Call backend API
      const response = await salaryApi.paySalary(employeeAddr, walletAddress, "0")
      
      if (response.success) {
        setEmployees(
          employees.map((emp) =>
            emp.address === employeeAddr ? { ...emp, lastPaymentDate: new Date().toLocaleDateString() } : emp,
          ),
        )
        setNotification({ type: "success", message: "Salary payment completed!" })
      } else {
        throw new Error(response.error || "Failed to process payment")
      }
    } catch (error) {
      console.error("Error paying salary:", error)
      setNotification({ type: "error", message: "Failed to process payment" })
    } finally {
      setIsLoading(false)
    }
  }

  // Load company info on connection
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadCompanyInfo()
    }
  }, [isConnected, walletAddress])

  const loadCompanyInfo = async () => {
    try {
      const response = await salaryApi.getCompanyInfo(walletAddress)
      if (response.success && response.data) {
        setCompany({
          name: response.data.name,
          address: response.data.address,
          totalPayroll: response.data.totalPayroll,
          employeeCount: response.data.employeeCount,
        })
      }
    } catch (error) {
      console.error("Error loading company info:", error)
    }
  }

  // Load employees when company is loaded
  useEffect(() => {
    if (company) {
      loadEmployees()
    }
  }, [company])

  const loadEmployees = async () => {
    try {
      const response = await salaryApi.getCompanyEmployees(walletAddress)
      if (response.success && response.data) {
        setEmployees(response.data.map(emp => ({
          address: emp.address,
          salary: emp.salary,
          isActive: emp.isActive,
          lastPaymentDate: emp.lastPaymentDate,
        })))
      }
    } catch (error) {
      console.error("Error loading employees:", error)
    }
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  if (!isConnected) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6" />
              Confidential Salary System
            </CardTitle>
            <CardDescription>
              Manage employee salaries with complete privacy using Fully Homomorphic Encryption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-black px-4 py-4 font-semibold text-white text-xl hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wallet className="w-5 h-5 mr-2" />}
              Connect to MetaMask
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Confidential Salary System
          </CardTitle>
          <CardDescription className="text-lg">
            Manage employee salaries with complete privacy using Fully Homomorphic Encryption
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notifications */}
      {notification && (
        <Alert className={`border-2 ${notification.type === "success" ? "border-green-500" : "border-red-500"}`}>
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-700" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-700" />
          )}
          <AlertDescription className={notification.type === "success" ? "text-green-700" : "text-red-700"}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
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
            <Card>
              <CardHeader>
                <CardTitle>Register Your Company</CardTitle>
                <CardDescription>Register your company to start managing confidential salaries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <Button onClick={registerCompany} disabled={!companyName.trim() || isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Register Company
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="text-2xl font-bold">{company.name}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="text-2xl font-bold">{company.employeeCount}</p>
                    </div>
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Payroll</p>
                      <p className="text-2xl font-bold text-green-600">Encrypted</p>
                      <p className="text-xs text-muted-foreground">Encrypted with FHE</p>
                    </div>
                    <EyeOff className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Employee Management Tab */}
        <TabsContent value="employees" className="space-y-6">
          {!company ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please register your company first to manage employees</AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Add Employee Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Employee</CardTitle>
                  <CardDescription>Add an employee with encrypted salary information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeAddress">Employee Address</Label>
                      <Input
                        id="employeeAddress"
                        placeholder="0x..."
                        value={employeeAddress}
                        onChange={(e) => setEmployeeAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeSalary">Salary Amount (USD)</Label>
                      <Input
                        id="employeeSalary"
                        type="number"
                        placeholder="5000"
                        value={employeeSalary}
                        onChange={(e) => setEmployeeSalary(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addEmployee}
                    disabled={!employeeAddress.trim() || !employeeSalary.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Add Employee
                  </Button>
                </CardContent>
              </Card>

              {/* Employee List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Employees ({employees.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employees.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No employees added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {employees.map((employee, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                                </span>
                                <Badge variant={employee.isActive ? "default" : "secondary"}>
                                  {employee.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <EyeOff className="w-4 h-4" />
                                Salary: Encrypted
                              </div>
                              {employee.lastPaymentDate && (
                                <div className="text-sm text-muted-foreground">
                                  Last payment: {employee.lastPaymentDate}
                                </div>
                              )}
                            </div>
                            {employee.isActive && (
                              <Button onClick={() => paySalary(employee.address)} disabled={isLoading} size="sm">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Pay Salary
                              </Button>
                            )}
                          </div>
                        </div>
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
      <Card>
        <CardHeader>
          <CardTitle>How FHE Protects Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Encrypted Salaries</h3>
              <p className="text-sm text-muted-foreground">
                All salary amounts are encrypted using FHE and remain private
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Verifiable Payments</h3>
              <p className="text-sm text-muted-foreground">Payments are verified on-chain without revealing amounts</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Company Control</h3>
              <p className="text-sm text-muted-foreground">
                Companies can manage payroll while maintaining confidentiality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
