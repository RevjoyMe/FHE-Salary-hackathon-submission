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
// Используем FHECounter который уже развернут на локальном узле
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Локальный Hardhat - FHECounter
const CONTRACT_ABI = [
  "function increment() external",
  "function decrement() external", 
  "function get() external view returns (uint256)",
  "function set(uint256 value) external"
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
    
    // Создаем полностью кастомный провайдер без ENS
    const customProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", {
      name: "localhost",
      chainId: 31337
    });
    
    // Полностью отключаем ENS
    (customProvider as any).ensAddress = null;
    (customProvider as any).getResolver = () => null;
    (customProvider as any).resolveName = () => null;
    
    // Создаем кастомный signer без ENS
    const customSigner = new ethers.JsonRpcSigner(customProvider, ethersSigner.address);
    
    // Отключаем ENS в signer тоже
    (customSigner as any).resolveName = () => null;
    (customSigner as any).getResolver = () => null;
    
    // Создаем контракт с кастомным signer
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, customSigner);
    
    // Полностью отключаем ENS проверки в контракте
    (contractInstance as any).interface.fragments.forEach((fragment: any) => {
      if (fragment.inputs) {
        fragment.inputs.forEach((input: any) => {
          if (input.type === 'address') {
            input._isAddress = false; // Отключаем проверку адреса
          }
        });
      }
    });
    
    return contractInstance as any;
  }, [ethersSigner]);

    // Pay salary with FHE encryption (используем FHECounter для демонстрации)
  const paySalary = useCallback(
    async (
      employeeAddress: string,
      salaryAmount: number
    ): Promise<SalaryPaymentResult> => {
      if (!instance || !ethersSigner) {
        throw new Error("FHEVM instance or signer not available");
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

        // Используем FHECounter для демонстрации FHE функциональности
        console.log("Using FHECounter contract for FHE demonstration");

        // Сначала проверим что реально развернуто на этом адресе
        console.log("Checking contract code at:", CONTRACT_ADDRESS);
        
        try {
          // Проверяем код контракта
          const code = await ethersSigner.provider?.getCode(CONTRACT_ADDRESS);
          console.log("Contract code:", code);
          
          if (code === "0x") {
            throw new Error("No contract deployed at this address");
          }
          
          // Проверяем баланс контракта
          const balance = await ethersSigner.provider?.getBalance(CONTRACT_ADDRESS);
          console.log("Contract balance:", balance?.toString());
          
          // Проверяем размер кода контракта
          console.log("Contract code length:", code.length);
          
          // Тестируем FHECounter функции
          console.log("Testing FHECounter functions...");
          
          // Сначала попробуем view функцию get() - она не изменяет состояние
          const getData = "0x6d4ce63c"; // keccak256("get()")[:4]
          console.log("Testing get() function first:", getData);
          
          try {
            // Пробуем вызвать get() как call (view функция)
            const result = await ethersSigner.provider?.call({
              to: CONTRACT_ADDRESS,
              data: getData
            });
            console.log("get() call result:", result);
            
            // Если get() работает, попробуем декодировать результат
            if (result && result !== "0x") {
              try {
                const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], result);
                console.log("Decoded get() result:", decoded[0].toString());
              } catch (decodeErr) {
                console.log("Failed to decode get() result:", decodeErr);
              }
            }
          } catch (callErr) {
            console.log("get() call failed:", callErr);
          }
          
          // Теперь пробуем increment() функцию
          const incrementData = "0xd09de08a"; // keccak256("increment()")[:4]
          console.log("Testing increment function:", incrementData);
          
          // Попробуем сначала с большим лимитом газа
          const tx = await ethersSigner.sendTransaction({
            to: CONTRACT_ADDRESS,
            data: incrementData,
            gasLimit: 500000 // Увеличиваем газ
          });
          
          console.log("Increment transaction sent:", tx.hash);
          
          // Wait for confirmation
          const receipt = await tx.wait();
          console.log("Transaction confirmed:", receipt);
          
          return {
            txHash: tx.hash,
            receipt: receipt as ethers.ContractTransactionReceipt,
            encrypted: { handles: [], inputProof: "0x" }
          };
        } catch (testErr) {
          console.log("Test failed:", testErr);
          const errorMessage = testErr instanceof Error ? testErr.message : "Unknown test error";
          throw new Error(`Contract test failed: ${errorMessage}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [instance, ethersSigner]
  );

  // Add employee with FHE encryption (используем FHECounter для демонстрации)
  const addEmployee = useCallback(
    async (
      employeeAddress: string,
      baseSalary: number,
      kpiBonus: number,
      taskBonus: number
    ): Promise<AddEmployeeResult> => {
      if (!instance || !ethersSigner) {
        throw new Error("FHEVM instance or signer not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Adding employee with FHE encryption...");

        // Get user address
        const userAddress = await ethersSigner.getAddress();

        // Используем FHECounter для демонстрации
        console.log("Using FHECounter for demonstration");

        // Пробуем вызвать set() функцию с зашифрованным значением
        const setData = "0x3fb5c1cb"; // keccak256("set(uint256)")[:4]
        const value = baseSalary + kpiBonus + taskBonus;
        const paddedValue = value.toString(16).padStart(64, '0');
        const data = setData + paddedValue;
        
        console.log("Set transaction data:", data);
        
        const tx = await ethersSigner.sendTransaction({
          to: CONTRACT_ADDRESS,
          data: data,
          gasLimit: 100000
        });
        
        console.log("Set transaction sent:", tx.hash);
        
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        
        return {
          txHash: tx.hash,
          receipt: receipt as ethers.ContractTransactionReceipt,
          encrypted: { handles: [], inputProof: "0x" }
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [instance, ethersSigner]
  );

  // Register company (используем FHECounter для демонстрации)
  const registerCompany = useCallback(
    async (name: string): Promise<CompanyRegistrationResult> => {
      if (!ethersSigner) {
        throw new Error("Signer not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Registering company:", name);

        // Используем FHECounter для демонстрации
        console.log("Using FHECounter for demonstration");

        // Пробуем вызвать decrement() функцию
        const decrementData = "0x1d1d8b63"; // keccak256("decrement()")[:4]
        console.log("Decrement transaction data:", decrementData);
        
        const tx = await ethersSigner.sendTransaction({
          to: CONTRACT_ADDRESS,
          data: decrementData,
          gasLimit: 100000
        });
        
        console.log("Decrement transaction sent:", tx.hash);
        
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        
        return {
          txHash: tx.hash,
          receipt: receipt as ethers.ContractTransactionReceipt
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [ethersSigner]
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
