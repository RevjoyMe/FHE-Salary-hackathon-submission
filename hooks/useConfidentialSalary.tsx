import { useCallback, useEffect, useState } from "react";
import { useFhevmContext } from "../fhevm/useFhevm";
import { useMetaMaskEthersSigner } from "./metamask/useMetaMaskEthersSigner";
import { TFHE } from "@zama-fhe/relayer-sdk";

// Contract ABI - you'll need to generate this after compiling the contract
const CONTRACT_ABI = [
  "function registerCompany(string memory _name) external",
  "function addEmployee(address _employeeAddress, euint32 _baseSalary, euint32 _kpiBonus, euint32 _taskBonus) external",
  "function paySalary(address _employeeAddress) external",
  "function deactivateEmployee(address _employeeAddress) external",
  "function getEmployeeInfo(address _companyAddress, address _employeeAddress) external view returns (address employeeAddress, bool isActive, uint256 lastPaymentDate)",
  "function getCompanyInfo(address _companyAddress) external view returns (address companyAddress, string memory name, uint256 employeeCount)",
  "function getCompanyEmployees(address _companyAddress) external view returns (address[] memory)",
  "function getEmployeeSalary(address _companyAddress, address _employeeAddress) external view returns (euint32 totalSalary)",
  "function getTotalPayroll(address _companyAddress) external view returns (euint32 totalPayroll)",
  "event CompanyRegistered(address indexed companyAddress, string name)",
  "event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress)",
  "event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 amount)",
  "event EmployeeDeactivated(address indexed companyAddress, address indexed employeeAddress)"
];

export interface Employee {
  address: string;
  baseSalary: number;
  kpiBonus: number;
  taskBonus: number;
  totalSalary: number;
  isActive: boolean;
  lastPaymentDate: number;
}

export interface Company {
  address: string;
  name: string;
  employeeCount: number;
  totalPayroll: number;
}

export function useConfidentialSalary(contractAddress?: string) {
  const { instance: fhevm } = useFhevmContext();
  const { signer, isConnected } = useMetaMaskEthersSigner();
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (signer && contractAddress) {
      const contractInstance = {
        address: contractAddress,
        abi: CONTRACT_ABI,
        signer,
      };
      setContract(contractInstance);
    }
  }, [signer, contractAddress]);

  const registerCompany = useCallback(async (name: string) => {
    if (!contract || !fhevm) {
      throw new Error("Contract or FHEVM not initialized");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.registerCompany(name);
      await tx.wait();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [contract, fhevm]);

  const addEmployee = useCallback(async (
    employeeAddress: string,
    baseSalary: number,
    kpiBonus: number,
    taskBonus: number
  ) => {
    if (!contract || !fhevm) {
      throw new Error("Contract or FHEVM not initialized");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Encrypt the salary components
      const encryptedBaseSalary = await fhevm.encrypt32(baseSalary);
      const encryptedKpiBonus = await fhevm.encrypt32(kpiBonus);
      const encryptedTaskBonus = await fhevm.encrypt32(taskBonus);

      const tx = await contract.addEmployee(
        employeeAddress,
        encryptedBaseSalary,
        encryptedKpiBonus,
        encryptedTaskBonus
      );
      await tx.wait();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [contract, fhevm]);

  const paySalary = useCallback(async (employeeAddress: string) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.paySalary(employeeAddress);
      await tx.wait();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const getCompanyInfo = useCallback(async (companyAddress: string): Promise<Company | null> => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const [address, name, employeeCount] = await contract.getCompanyInfo(companyAddress);
      return {
        address,
        name,
        employeeCount: employeeCount.toNumber(),
        totalPayroll: 0 // This would need to be decrypted separately
      };
    } catch (err) {
      console.error("Error getting company info:", err);
      return null;
    }
  }, [contract]);

  const getEmployeeInfo = useCallback(async (
    companyAddress: string,
    employeeAddress: string
  ): Promise<Employee | null> => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const [address, isActive, lastPaymentDate] = await contract.getEmployeeInfo(
        companyAddress,
        employeeAddress
      );
      return {
        address,
        baseSalary: 0, // Encrypted, would need to be decrypted
        kpiBonus: 0,   // Encrypted, would need to be decrypted
        taskBonus: 0,  // Encrypted, would need to be decrypted
        totalSalary: 0, // Encrypted, would need to be decrypted
        isActive,
        lastPaymentDate: lastPaymentDate.toNumber()
      };
    } catch (err) {
      console.error("Error getting employee info:", err);
      return null;
    }
  }, [contract]);

  const getCompanyEmployees = useCallback(async (companyAddress: string): Promise<string[]> => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const employees = await contract.getCompanyEmployees(companyAddress);
      return employees;
    } catch (err) {
      console.error("Error getting company employees:", err);
      return [];
    }
  }, [contract]);

  return {
    contract,
    isLoading,
    error,
    isConnected,
    registerCompany,
    addEmployee,
    paySalary,
    getCompanyInfo,
    getEmployeeInfo,
    getCompanyEmployees,
  };
}
