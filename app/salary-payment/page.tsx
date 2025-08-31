"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  name: string;
  position: string;
  address: string;
  baseSalary: number;
  kpiBonus: number;
  taskBonus: number;
  totalSalary: number;
  isActive: boolean;
  lastPaymentDate: string;
}

interface PaymentPlan {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  status: "pending" | "paid" | "failed";
}

// Demo employees with realistic ETH amounts
const demoEmployees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    position: "Senior Developer",
    address: "0x8ba1f109551bD432803012645Hac136c772c3c3",
    baseSalary: 0.08,
    kpiBonus: 0.01,
    taskBonus: 0.005,
    totalSalary: 0.095,
    isActive: true,
    lastPaymentDate: "30.01.2025"
  },
  {
    id: "2",
    name: "Bob Smith",
    position: "Product Manager",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    baseSalary: 0.09,
    kpiBonus: 0.015,
    taskBonus: 0.008,
    totalSalary: 0.113,
    isActive: true,
    lastPaymentDate: "30.01.2025"
  },
  {
    id: "3",
    name: "Carol Davis",
    position: "UX Designer",
    address: "0x1234567890123456789012345678901234567890",
    baseSalary: 0.07,
    kpiBonus: 0.008,
    taskBonus: 0.004,
    totalSalary: 0.082,
    isActive: true,
    lastPaymentDate: "30.01.2025"
  },
  {
    id: "4",
    name: "David Wilson",
    position: "DevOps Engineer",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    baseSalary: 0.085,
    kpiBonus: 0.012,
    taskBonus: 0.006,
    totalSalary: 0.103,
    isActive: true,
    lastPaymentDate: "30.01.2025"
  },
  {
    id: "5",
    name: "Eva Brown",
    position: "QA Engineer",
    address: "0xfedcba0987654321fedcba0987654321fedcba09",
    baseSalary: 0.075,
    kpiBonus: 0.009,
    taskBonus: 0.005,
    totalSalary: 0.089,
    isActive: true,
    lastPaymentDate: "30.01.2025"
  }
];

// Demo payment plans
const demoPaymentPlans: PaymentPlan[] = [
  {
    id: "1",
    employeeId: "1",
    amount: 0.095,
    date: "31.01.2025",
    status: "pending"
  },
  {
    id: "2",
    employeeId: "2",
    amount: 0.113,
    date: "31.01.2025",
    status: "pending"
  },
  {
    id: "3",
    employeeId: "3",
    amount: 0.082,
    date: "31.01.2025",
    status: "paid"
  }
];

export default function SalaryPaymentPage() {
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(demoPaymentPlans);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (employee: Employee) => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setPaymentPlans(prev => 
        prev.map(plan => 
          plan.employeeId === employee.id 
            ? { ...plan, status: "paid" as const }
            : plan
        )
      );
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salary Payment System</h1>
          <p className="text-muted-foreground mt-2">
            Manage confidential salary payments using FHE technology
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Report</Button>
          <Button>New Payment Batch</Button>
        </div>
      </div>

      {/* FHE Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">FHE System Status</CardTitle>
          <CardDescription>
            Fully Homomorphic Encryption is currently being configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700">FHE Integration in Progress</span>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees & Salaries</CardTitle>
          <CardDescription>
            View employee information and process salary payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {employee.totalSalary} ETH
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Base: {employee.baseSalary} | KPI: +{employee.kpiBonus} | Tasks: +{employee.taskBonus}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last: {employee.lastPaymentDate}
                  </div>
                </div>

                <div className="ml-6">
                  <Button
                    onClick={() => handlePayment(employee)}
                    disabled={isProcessing}
                    className="min-w-[120px]"
                  >
                    {isProcessing ? "Processing..." : "Pay Salary"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Plans</CardTitle>
          <CardDescription>
            Track salary payment status and history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentPlans.map((plan) => {
              const employee = employees.find(emp => emp.id === plan.employeeId);
              return (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {employee?.name.split(' ').map(n => n[0]).join('') || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">{employee?.name || 'Unknown Employee'}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {plan.amount} ETH
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{plan.date}</span>
                    {getStatusBadge(plan.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* FHE Information */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">About FHE Technology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-purple-700">
            <p>
              <strong>Fully Homomorphic Encryption (FHE)</strong> allows computations on encrypted data 
              without decrypting it first. This ensures complete privacy of salary information.
            </p>
            <p>
              In our system, all salary calculations are performed on encrypted values, 
              making it impossible for anyone to see actual salary amounts while maintaining 
              full functionality for payroll operations.
            </p>
            <div className="flex gap-2 mt-4">
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                Zero-Knowledge Proofs
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                End-to-End Encryption
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                Privacy-Preserving
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
