"use client";

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
    date: "30.01.2025",
    status: "pending"
  },
  {
    id: "2",
    employeeId: "2",
    amount: 0.113,
    date: "30.01.2025",
    status: "pending"
  },
  {
    id: "3",
    employeeId: "3",
    amount: 0.082,
    date: "30.01.2025",
    status: "pending"
  },
  {
    id: "4",
    employeeId: "4",
    amount: 0.103,
    date: "30.01.2025",
    status: "pending"
  },
  {
    id: "5",
    employeeId: "5",
    amount: 0.089,
    date: "30.01.2025",
    status: "pending"
  }
];

export default function SalaryPaymentPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(demoPaymentPlans);

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
      setPaymentStatus("🔄 Processing salary payment...");
      
      const result = await paySalary(employee.address, employee.totalSalary);
      
      setPaymentStatus(`✅ Salary paid successfully! TX: ${result.txHash}`);
      
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
        return <Badge className="bg-gray-500">Idle</Badge>;
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Confidential Salary Payment</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">FHEVM Status:</span>
          {getStatusBadge(fhevmStatus)}
        </div>
      </div>

      {/* FHEVM Status */}
      <Card>
        <CardHeader>
          <CardTitle>FHEVM Connection Status</CardTitle>
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
          <div className="grid gap-4">
            {employees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <p className="text-xs text-gray-500">Address: {employee.address}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Base: {formatEthAmount(employee.baseSalary)}</p>
                      <p className="text-sm">KPI Bonus: {formatEthAmount(employee.kpiBonus)}</p>
                      <p className="text-sm">Task Bonus: {formatEthAmount(employee.taskBonus)}</p>
                      <p className="font-semibold text-green-600">
                        Total: {formatEthAmount(employee.totalSalary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handlePaySalary(employee)}
                      disabled={!instance || !signer || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Processing..." : "Pay Salary"}
                    </Button>
                    <Badge variant={employee.isActive ? "default" : "secondary"}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
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
          <div className="space-y-2">
            {paymentPlans.map((plan) => {
              const employee = employees.find(emp => emp.id === plan.employeeId);
              return (
                <div key={plan.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{employee?.name}</p>
                    <p className="text-sm text-gray-600">{formatEthAmount(plan.amount)} - {plan.date}</p>
                  </div>
                  <Badge variant={plan.status === "paid" ? "default" : "secondary"}>
                    {plan.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
