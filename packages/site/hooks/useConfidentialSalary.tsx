"use client";

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

// For now, we'll use a placeholder ABI until the contract is deployed
const CONFIDENTIAL_SALARY_ABI = [
  "function registerCompany(string memory name) external",
  "function addEmployee(address employeeAddress, bytes calldata encryptedSalary, bytes calldata salaryProof) external",
  "function paySalary(address employeeAddress) external payable",
  "function getEmployeeSalary(address employeeAddress) external view returns (bytes memory)",
  "function getCompanyPayroll(address companyAddress) external view returns (bytes memory)",
  "function getEmployeeInfo(address employeeAddress) external view returns (address employeeAddress, bool isActive, uint256 lastPaymentDate)",
  "function getCompanyInfo(address companyAddress) external view returns (string memory name, uint256 employeeCount)",
  "function getCompanyEmployees(address companyAddress) external view returns (address[] memory)",
  "function deactivateEmployee(address employeeAddress) external"
];

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
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
  const [fhevm, setFhevm] = useState<FhevmInstance | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [contractAddress, setContractAddress] = useState<string | undefined>(undefined);

  // Set FHE instance
  useEffect(() => {
    setFhevm(instance);
  }, [instance]);

  // For demo purposes, we'll use a placeholder address
  // In production, this would come from deployment artifacts
  useEffect(() => {
    if (chainId === 31337) {
      // Local hardhat network
      setContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    } else if (chainId === 11155111) {
      // Sepolia testnet
      setContractAddress("0x0000000000000000000000000000000000000000"); // Placeholder
    } else {
      setContractAddress(undefined);
    }
  }, [chainId]);

  // Create contract instance
  useEffect(() => {
    if (!ethersReadonlyProvider || !contractAddress) {
      setContract(undefined);
      return;
    }

    try {
      const newContract = new ethers.Contract(
        contractAddress,
        CONFIDENTIAL_SALARY_ABI,
        ethersReadonlyProvider
      );
      setContract(newContract);
      setError(undefined);
    } catch (e) {
      console.error("Error creating contract instance:", e);
      setError(e as Error);
      setContract(undefined);
    }
  }, [ethersReadonlyProvider, contractAddress]);

  // Check if we're on the same chain and signer
  const isSameChain = useCallback(
    (targetChainId: number | undefined) => {
      return sameChain.current?.(targetChainId) ?? false;
    },
    [sameChain]
  );

  const isSameSigner = useCallback(
    (targetSigner: ethers.JsonRpcSigner | undefined) => {
      return sameSigner.current?.(targetSigner) ?? false;
    },
    [sameSigner]
  );

  return {
    contract,
    fhevm,
    error,
    contractAddress,
    isSameChain,
    isSameSigner,
  };
};
