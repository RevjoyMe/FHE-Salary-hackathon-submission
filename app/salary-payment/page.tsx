"use client"

import { useState, useEffect } from "react"
import { Building2, Users, EyeOff, CheckCircle, AlertCircle, Loader2, Wallet, DollarSign, Target, Calendar } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"

// Add MetaMask types
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}

interface Employee {
  id: string
  name: string
  address: string
  position: string
  baseSalary: number
  currentSalary: number
  kpiScore: number
  tasksCompleted: number
  totalTasks: number
  lastPaymentDate?: string
  paymentPlan: PaymentPlan
  isActive: boolean
}

interface PaymentPlan {
  id: string
  employeeId: string
  baseAmount: number
  kpiBonus: number
  taskBonus: number
  totalAmount: number
  status: 'pending' | 'approved' | 'paid'
  dueDate: string
}

// Demo data
const demoEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "John Smith",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    position: "Senior Developer",
    baseSalary: 8000,
    currentSalary: 8500,
    kpiScore: 92,
    tasksCompleted: 18,
    totalTasks: 20,
    lastPaymentDate: "2024-01-15",
    paymentPlan: {
      id: "plan-001",
      employeeId: "emp-001",
      baseAmount: 8000,
      kpiBonus: 736, // 92% * 800
      taskBonus: 180, // 18/20 * 200
      totalAmount: 8916,
      status: 'pending',
      dueDate: "2024-02-01"
    },
    isActive: true
  },
  {
    id: "emp-002",
    name: "Sarah Johnson",
    address: "0x8ba1f109551bD432803012645Hac136c772c3c3",
    position: "Product Manager",
    baseSalary: 9000,
    currentSalary: 9450,
    kpiScore: 88,
    tasksCompleted: 16,
    totalTasks: 18,
    lastPaymentDate: "2024-01-15",
    paymentPlan: {
      id: "plan-002",
      employeeId: "emp-002",
      baseAmount: 9000,
      kpiBonus: 792, // 88% * 900
      taskBonus: 160, // 16/18 * 180
      totalAmount: 9952,
      status: 'pending',
      dueDate: "2024-02-01"
    },
    isActive: true
  },
  {
    id: "emp-003",
    name: "Michael Chen",
    address: "0x147B8eb97fD247D06C4006D269c90C1908Fb5D54",
    position: "UX Designer",
    baseSalary: 7000,
    currentSalary: 7350,
    kpiScore: 95,
    tasksCompleted: 19,
    totalTasks: 20,
    lastPaymentDate: "2024-01-15",
    paymentPlan: {
      id: "plan-003",
      employeeId: "emp-003",
      baseAmount: 7000,
      kpiBonus: 665, // 95% * 700
      taskBonus: 190, // 19/20 * 200
      totalAmount: 7855,
      status: 'pending',
      dueDate: "2024-02-01"
    },
    isActive: true
  },
  {
    id: "emp-004",
    name: "Emily Davis",
    address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    position: "DevOps Engineer",
    baseSalary: 8500,
    currentSalary: 8925,
    kpiScore: 85,
    tasksCompleted: 17,
    totalTasks: 20,
    lastPaymentDate: "2024-01-15",
    paymentPlan: {
      id: "plan-004",
      employeeId: "emp-004",
      baseAmount: 8500,
      kpiBonus: 680, // 85% * 800
      taskBonus: 170, // 17/20 * 200
      totalAmount: 9350,
      status: 'pending',
      dueDate: "2024-02-01"
    },
    isActive: true
  }
]

export default function SalaryPaymentPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees)

  // Check if MetaMask is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      console.log("MetaMask is available");
      // Check if already connected
      checkConnection();
    } else {
      console.log("MetaMask is not available");
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  // Real MetaMask connection
  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setNotification({ type: "error", message: "MetaMask is not installed. Please install MetaMask first." });
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        setNotification({ type: "success", message: "Wallet connected successfully!" });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setNotification({ type: "error", message: "Failed to connect wallet. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const paySalary = async (employee: Employee) => {
    if (!isConnected) {
      setNotification({ type: "error", message: "Please connect your wallet first" });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Update employee payment status
      const updatedEmployees = employees.map(emp => 
        emp.id === employee.id 
          ? { 
              ...emp, 
              lastPaymentDate: new Date().toISOString().split('T')[0],
              paymentPlan: { ...emp.paymentPlan, status: 'paid' as const }
            }
          : emp
      );
      
      setEmployees(updatedEmployees);
      setNotification({ 
        type: "success", 
        message: `Salary paid successfully to ${employee.name}! Amount: ${employee.paymentPlan.totalAmount} ETH` 
      });
    } catch (error) {
      console.error("Error paying salary:", error);
      setNotification({ type: "error", message: "Failed to pay salary. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getKpiBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return "bg-green-100 text-green-800";
      case 'approved': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Confidential Salary System</h1>
          <p className="text-muted-foreground">FHE-powered confidential salary payments on Sepolia</p>
        </div>
        <Button 
          onClick={connectWallet} 
          disabled={isLoading || isConnected}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isConnected ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <Wallet className="w-4 h-4 mr-2" />
          )}
          {isConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </div>

      {notification && (
        <Alert className={notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Address: <span className="font-mono">{walletAddress}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Network: Sepolia Testnet
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employee Management</TabsTrigger>
          <TabsTrigger value="payments">Payment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{employee.name}</span>
                    <Badge variant={employee.isActive ? "default" : "secondary"}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {employee.position} • {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* KPI Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">KPI Score</Label>
                      <Badge className={getKpiBadge(employee.kpiScore)}>
                        {employee.kpiScore}%
                      </Badge>
                    </div>
                    <Progress value={employee.kpiScore} className="h-2" />
                  </div>

                  {/* Tasks Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Tasks Completed</Label>
                      <span className="text-sm text-muted-foreground">
                        {employee.tasksCompleted}/{employee.totalTasks}
                      </span>
                    </div>
                    <Progress value={(employee.tasksCompleted / employee.totalTasks) * 100} className="h-2" />
                  </div>

                  {/* Salary Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Salary:</span>
                      <span className="font-medium">{employee.baseSalary} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current Salary:</span>
                      <span className="font-medium text-green-600">{employee.currentSalary} ETH</span>
                    </div>
                  </div>

                  {/* Payment Plan Summary */}
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Next Payment</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amount:</span>
                      <span className="font-medium">{employee.paymentPlan.totalAmount} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Due:</span>
                      <span>{employee.paymentPlan.dueDate}</span>
                    </div>
                    <Badge className={`mt-2 ${getStatusBadge(employee.paymentPlan.status)}`}>
                      {employee.paymentPlan.status.charAt(0).toUpperCase() + employee.paymentPlan.status.slice(1)}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => paySalary(employee)}
                    disabled={isLoading || employee.paymentPlan.status === 'paid'}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <DollarSign className="w-4 h-4 mr-2" />
                    )}
                    {employee.paymentPlan.status === 'paid' ? 'Paid' : 'Pay Salary'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Plans Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                      <Badge className={getStatusBadge(employee.paymentPlan.status)}>
                        {employee.paymentPlan.status.charAt(0).toUpperCase() + employee.paymentPlan.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Base Amount:</span>
                        <p className="font-medium">{employee.paymentPlan.baseAmount} ETH</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">KPI Bonus:</span>
                        <p className="font-medium text-green-600">+{employee.paymentPlan.kpiBonus} ETH</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Task Bonus:</span>
                        <p className="font-medium text-blue-600">+{employee.paymentPlan.taskBonus} ETH</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <p className="font-medium text-lg">{employee.paymentPlan.totalAmount} ETH</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
