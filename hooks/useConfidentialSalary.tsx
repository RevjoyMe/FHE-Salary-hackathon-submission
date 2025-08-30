"use client";

export const dynamic = 'force-dynamic'

import { ethers } from "ethers";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";

// Contract configuration
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function addEmployee(address employee) external",
  "function setSalary(address employee, bytes32 _salary) external",
  "function getSalary(address employee) external view returns (bytes32)",
  "function paySalary(address employee) external",
  "function employees(address) external view returns (bool)",
  "event EmployeeAdded(address employee)",
  "event SalarySet(address employee, bytes32 salary)",
  "event SalaryPaid(address employee, bytes32 amount)"
];

export type SalaryPaymentResult = {
  txHash: string;
  receipt: ethers.ContractTransactionReceipt;
  encrypted: any;
};

export type AddEmployeeResult = {
  txHash: string;
  receipt: ethers.ContractTransactionReceipt;
  encrypted: any;
};

export type CompanyRegistrationResult = {
  txHash: string;
  receipt: ethers.ContractTransactionReceipt;
};

export const useConfidentialSalary = (parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: RefObject<
    (ethersSigner: ethers.JsonRpcSigner | undefined) => boolean
  >;
}) => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return {
      paySalary: async () => { throw new Error('Not available on server side') },
      addEmployee: async () => { throw new Error('Not available on server side') },
      registerCompany: async () => { throw new Error('Not available on server side') },
      isLoading: false,
      error: null
    };
  }
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create contract instance
  const contract = useMemo(() => {
    if (!ethersSigner || !CONTRACT_ADDRESS) return undefined;
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ethersSigner);
  }, [ethersSigner]);

  // Pay salary with FHE encryption
  const paySalary = useCallback(
    async (
      employeeAddress: string,
      salaryAmount: number
    ): Promise<SalaryPaymentResult> => {
      if (!instance || !contract || !ethersSigner) {
        throw new Error("FHEVM instance, contract, or signer not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Paying salary with FHE encryption...");
        console.log("Employee:", employeeAddress);
        console.log("Amount:", salaryAmount);

        // Get user address
        const userAddress = await ethersSigner.getAddress();
        console.log("User:", userAddress);

        // Create encrypted input for salary amount
        const input = instance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);
        
        // Convert salary to bigint (in wei) and add to encrypted input
        const salaryInWei = ethers.parseEther(salaryAmount.toString());
        input.add64(salaryInWei);
        
        // Encrypt the input
        const encrypted = await input.encrypt();
        
        console.log("Encrypted input created:", encrypted);

        // Send transaction with encrypted data
        const tx = await contract.paySalary(
          employeeAddress,
          encrypted.handles[0], // encryptedSalary (bytes32)
          encrypted.inputProof  // proof (bytes)
        );
        
        console.log("Transaction sent:", tx.hash);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        
        return {
          txHash: tx.hash,
          receipt,
          encrypted
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [instance, contract, ethersSigner]
  );

  // Add employee with FHE encryption
  const addEmployee = useCallback(
    async (
      employeeAddress: string,
      baseSalary: number,
      kpiBonus: number,
      taskBonus: number
    ): Promise<AddEmployeeResult> => {
      if (!instance || !contract || !ethersSigner) {
        throw new Error("FHEVM instance, contract, or signer not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Adding employee with FHE encryption...");

        // Get user address
        const userAddress = await ethersSigner.getAddress();

        // Create encrypted inputs
        const input = instance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);
        
        // Convert amounts to wei and add to input
        const baseSalaryWei = ethers.parseEther(baseSalary.toString());
        const kpiBonusWei = ethers.parseEther(kpiBonus.toString());
        const taskBonusWei = ethers.parseEther(taskBonus.toString());
        
        input.add64(baseSalaryWei);
        input.add64(kpiBonusWei);
        input.add64(taskBonusWei);
        
        // Encrypt the inputs
        const encrypted = await input.encrypt();
        
        console.log("Encrypted inputs created:", encrypted);

        // Send transaction with encrypted data
        const tx = await contract.addEmployee(
          employeeAddress,
          encrypted.handles[0], // baseSalary (bytes32)
          encrypted.handles[1], // kpiBonus (bytes32)
          encrypted.handles[2], // taskBonus (bytes32)
          encrypted.inputProof  // proof (bytes)
        );
        
        console.log("Add employee transaction sent:", tx.hash);
        
        const receipt = await tx.wait();
        console.log("Add employee transaction confirmed:", receipt);
        
        return {
          txHash: tx.hash,
          receipt,
          encrypted
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [instance, contract, ethersSigner]
  );

  // Register company
  const registerCompany = useCallback(
    async (name: string): Promise<CompanyRegistrationResult> => {
      if (!contract || !ethersSigner) {
        throw new Error("Contract or signer not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Registering company:", name);

        const tx = await contract.registerCompany(name);
        console.log("Register company transaction sent:", tx.hash);
        
        const receipt = await tx.wait();
        console.log("Register company transaction confirmed:", receipt);
        
        return {
          txHash: tx.hash,
          receipt
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, ethersSigner]
  );

  return {
    paySalary,
    addEmployee,
    registerCompany,
    isLoading,
    error,
    contract
  };
};
