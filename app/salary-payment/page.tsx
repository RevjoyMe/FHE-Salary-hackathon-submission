"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFhevmContext } from "../providers";
import { useConfidentialSalary } from "@/hooks/useConfidentialSalary";
import { ethers } from "ethers";

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
    address: "0x8ba1f109551bD432803012645aac136c772c3c3",
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
  const [isClient, setIsClient] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(demoPaymentPlans);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  // Get FHEVM context
  const {
    instance,
    status: fhevmStatus,
    error: fhevmError,
    provider,
    chainId,
    signer,
    readonlyProvider,
    fhevmDecryptionSignatureStorage,
    sameChain,
    sameSigner,
  } = useFhevmContext();

  // Use Confidential Salary hook
  const {
    paySalary,
    addEmployee,
    registerCompany,
    isLoading,
    error: contractError,
  } = useConfidentialSalary({
    instance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner: signer,
    ethersReadonlyProvider: readonlyProvider,
    sameChain,
    sameSigner,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatEthAmount = (amount: number) => {
    return `${amount.toFixed(3)} ETH`;
  };

  const handlePaySalary = async (employee: Employee) => {
    if (!instance || !signer) {
      setPaymentStatus("❌ FHEVM not initialized or wallet not connected");
      return;
    }

    try {
      setPaymentStatus("🔄 Processing salary payment with FHE encryption...");
      
      const result = await paySalary(employee.address, employee.totalSalary);
      
      setPaymentStatus(`✅ Salary paid successfully with FHE! TX: ${result.txHash}`);
      
      // Update payment plan status
      setPaymentPlans(prev => 
        prev.map(plan => 
          plan.employeeId === employee.id 
            ? { ...plan, status: "paid" as const }
            : plan
        )
      );
      
    } catch (error) {
      console.error("Failed to pay salary:", error);
      setPaymentStatus(`❌ Failed to pay salary: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500">Ready</Badge>;
      case "loading":
        return <Badge className="bg-yellow-500">Loading</Badge>;
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Confidential Salary Payment</h1>
          <p className="text-muted-foreground mt-2">
            Manage confidential salary payments using FHE technology
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">FHEVM Status:</span>
          {getStatusBadge(fhevmStatus)}
        </div>
      </div>

      {/* FHEVM Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">FHEVM Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> {fhevmStatus}</p>
            <p><strong>Chain ID:</strong> {chainId || "Not connected"}</p>
            <p><strong>Wallet:</strong> {signer ? "Connected" : "Not connected"}</p>
            {fhevmError && (
              <p className="text-red-500"><strong>Error:</strong> {fhevmError.message}</p>
            )}
            {contractError && (
              <p className="text-red-500"><strong>Contract Error:</strong> {contractError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      {paymentStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={paymentStatus.includes("❌") ? "text-red-500" : "text-green-500"}>
              {paymentStatus}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Employees */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage employee salary payments with FHE encryption</CardDescription>
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
                    {formatEthAmount(employee.totalSalary)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Base: {formatEthAmount(employee.baseSalary)} | KPI: +{formatEthAmount(employee.kpiBonus)} | Tasks: +{formatEthAmount(employee.taskBonus)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last: {employee.lastPaymentDate}
                  </div>
                </div>

                <div className="ml-6">
                  <Button
                    onClick={() => handlePaySalary(employee)}
                    disabled={!instance || !signer || isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? "Processing..." : "Pay Salary"}
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
          <CardDescription>Current payment schedule</CardDescription>
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
                        {formatEthAmount(plan.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{plan.date}</span>
                    <Badge variant={plan.status === "paid" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
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
