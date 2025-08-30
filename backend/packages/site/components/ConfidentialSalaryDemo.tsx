"use client";

import { useState, useEffect } from "react";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useConfidentialSalary } from "@/hooks/useConfidentialSalary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, Users, DollarSign, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface Employee {
  address: string;
  salary: string;
  isActive: boolean;
  lastPaymentDate: number;
}

interface Company {
  name: string;
  employeeCount: number;
  totalPayroll: string;
}

export function ConfidentialSalaryDemo() {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  // FHEVM instance
  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  // Confidential Salary hook
  const { contract, fhevm, error, contractAddress } = useConfidentialSalary({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [activeTab, setActiveTab] = useState("company");
  const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Check if user is registered as company
  const checkCompanyStatus = async () => {
    if (!contract || !accounts?.[0]) return;
    
    try {
      const info = await contract.getCompanyInfo(accounts![0]);
      setCompanyInfo({
        name: info[0],
        employeeCount: info[1].toNumber(),
        totalPayroll: "Encrypted" // Always encrypted
      });
    } catch (error) {
      // Company not registered
      setCompanyInfo(null);
    }
  };

  // Load employees for company
  const loadEmployees = async () => {
    if (!contract || !accounts?.[0] || !companyInfo) return;
    
    try {
      const employeeAddresses = await contract.getCompanyEmployees(accounts![0]);
      const employeeData: Employee[] = [];
      
      for (const empAddress of employeeAddresses) {
        const info = await contract.getEmployeeInfo(empAddress);
        employeeData.push({
          address: empAddress,
          salary: "Encrypted", // Always encrypted
          isActive: info[1],
          lastPaymentDate: info[2].toNumber()
        });
      }
      
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      checkCompanyStatus();
    }
  }, [isConnected, contract, accounts]);

  useEffect(() => {
    if (companyInfo) {
      loadEmployees();
    }
  }, [companyInfo]);

  const registerCompany = async () => {
    if (!contract || !companyName.trim()) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const tx = await contract.registerCompany(companyName.trim());
      await tx.wait();
      
      setMessage({ type: 'success', text: 'Company registered successfully!' });
      await checkCompanyStatus();
      setCompanyName("");
    } catch (error) {
      console.error("Error registering company:", error);
      setMessage({ type: 'error', text: 'Failed to register company' });
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = async () => {
    if (!contract || !employeeAddress || !salaryAmount) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Create encrypted input using FHE
      const input = fhevm?.createEncryptedInput(
        contractAddress!,
        accounts![0]
      );
      input?.add32(parseInt(salaryAmount));

      // Encrypt the input
      const enc = await input?.encrypt();
      
      if (!enc) {
        throw new Error("Failed to encrypt salary");
      }
      
      const tx = await contract.addEmployee(employeeAddress, enc.handles[0], enc.inputProof);
      await tx.wait();
      
      setMessage({ type: 'success', text: 'Employee added successfully!' });
      await loadEmployees();
      setEmployeeAddress("");
      setSalaryAmount("");
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage({ type: 'error', text: 'Failed to add employee' });
    } finally {
      setIsLoading(false);
    }
  };

  const paySalary = async (employeeAddress: string) => {
    if (!contract) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const tx = await contract.paySalary(employeeAddress, { value: 0 });
      await tx.wait();
      
      setMessage({ type: 'success', text: 'Salary paid successfully!' });
      await loadEmployees();
    } catch (error) {
      console.error("Error paying salary:", error);
      setMessage({ type: 'error', text: 'Failed to pay salary' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="mx-auto">
        <button
          className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-4 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
          onClick={connect}
        >
          <span className="text-4xl p-6">Connect to MetaMask</span>
        </button>
      </div>
    );
  }

  if (!contractAddress) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Contract Not Deployed
          </CardTitle>
          <CardDescription>
            The ConfidentialSalary contract is not deployed on this network. Please deploy it first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6" />
            Confidential Salary System
          </CardTitle>
          <CardDescription className="text-lg">
            Manage employee salaries with complete privacy using Fully Homomorphic Encryption
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Message */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

        <TabsContent value="company" className="space-y-4">
          {!companyInfo ? (
            <Card>
              <CardHeader>
                <CardTitle>Register Your Company</CardTitle>
                <CardDescription>
                  Register your company to start managing confidential salaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={registerCompany} 
                  disabled={isLoading || !companyName.trim()}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Company
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Company Name</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companyInfo.name}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companyInfo.employeeCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{companyInfo.totalPayroll}</div>
                  <p className="text-xs text-muted-foreground">Encrypted with FHE</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          {!companyInfo ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please register your company first to manage employees
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Add Employee Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Employee</CardTitle>
                  <CardDescription>
                    Add an employee with encrypted salary information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Employee Address</label>
                      <Input
                        placeholder="0x..."
                        value={employeeAddress}
                        onChange={(e) => setEmployeeAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Salary Amount (USD)</label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={addEmployee} 
                    disabled={isLoading || !employeeAddress || !salaryAmount}
                    className="w-full"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Employee
                  </Button>
                </CardContent>
              </Card>

              {/* Employees List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employees ({employees.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employees.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No employees added yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {employees.map((employee, index) => (
                        <div key={employee.address} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {employee.address.slice(0, 6)}...{employee.address.slice(-4)}
                                </span>
                                <Badge variant={employee.isActive ? "default" : "secondary"}>
                                  {employee.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-3 w-3" />
                                <span>Salary: {employee.salary}</span>
                                <EyeOff className="h-3 w-3" />
                              </div>
                              {employee.lastPaymentDate > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Last payment: {new Date(employee.lastPaymentDate * 1000).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {employee.isActive && (
                                <Button
                                  size="sm"
                                  onClick={() => paySalary(employee.address)}
                                  disabled={isLoading}
                                >
                                  {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                  Pay Salary
                                </Button>
                              )}
                            </div>
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

      {/* FHE Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5" />
            How FHE Protects Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <EyeOff className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Encrypted Salaries</h3>
              <p className="text-sm text-muted-foreground">
                All salary amounts are encrypted using FHE and remain private
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Verifiable Payments</h3>
              <p className="text-sm text-muted-foreground">
                Payments are verified on-chain without revealing amounts
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="h-6 w-6 text-purple-600" />
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
  );
}
