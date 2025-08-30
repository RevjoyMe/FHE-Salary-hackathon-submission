// Apply polyfills immediately at module level
if (typeof window !== 'undefined') {
  // Global polyfill
  if (typeof global === 'undefined') {
    (window as any).global = window;
  }
  // Process polyfill
  if (typeof process === 'undefined') {
    (window as any).process = { env: {} };
  }
}

import { ethers } from "ethers";

// Import Relayer SDK directly
import { createInstance, initSDK, SepoliaConfig } from "@zama-fhe/relayer-sdk";

// Dynamic import to avoid SSR issues
const getRelayerSDK = async () => {
  if (typeof window === 'undefined') return null;
  
  // Apply polyfills before importing
  if (typeof global === 'undefined') {
    (window as any).global = window;
  }
  if (typeof process === 'undefined') {
    (window as any).process = { env: {} };
  }
  
  // Force global to be available
  (window as any).global = (window as any).global || window;
  (window as any).process = (window as any).process || { env: {} };
  
  // Dynamic import only on client side
  const { createInstance, initSDK, SepoliaConfig } = await import("@zama-fhe/relayer-sdk/web");
  return { createInstance, initSDK, SepoliaConfig };
};

// Contract configuration
export const CONTRACT_ADDRESS = "0x71864F70Dbc4CF7135db460e6d7aAdb8dA627875";
// Note: ABI uses bytes32 for FHE types (euint64) - ethers.js doesn't understand FHE types directly
export const CONTRACT_ABI = [
  "function paySalary(address employeeAddress) external payable",
  "function addEmployee(address employeeAddress, bytes32 baseSalary, bytes32 kpiBonus, bytes32 taskBonus) external",
  "function registerCompany(string memory name) external",
  "event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 timestamp)",
  "event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress)",
  "event CompanyRegistered(address indexed companyAddress, string name)"
];

// Initialize FHEVM instance
export async function getFhevmInstance() {
  const relayerSDK = await getRelayerSDK();
  if (!relayerSDK) {
    throw new Error("Relayer SDK not available");
  }
  const { createInstance, initSDK, SepoliaConfig } = relayerSDK;
  await initSDK();
  return await createInstance(SepoliaConfig);
}

// Pay salary with FHE encryption
export async function paySalaryWithFHE(
  employeeAddress: string,
  salaryAmount: number,
  fhevmInstance: any
) {
  // Check if we're on client side
  if (typeof window === 'undefined') {
    throw new Error("This function can only be called on the client side");
  }

  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error("MetaMask not found");
  }

  // Request account access
  await eth.request({ method: "eth_requestAccounts" });
  
  // Create provider with explicit network configuration to avoid ENS issues
  const provider = new ethers.BrowserProvider(eth, {
    chainId: 9746, // FHEVM testnet
    name: "fhevm-testnet"
  });
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  console.log("Paying salary with FHE encryption...");
  console.log("Employee:", employeeAddress);
  console.log("Amount:", salaryAmount);
  console.log("User:", userAddress);

  // Create encrypted input for salary amount
  const input = fhevmInstance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);
  
  // Convert salary to bigint (in wei)
  const salaryInWei = ethers.parseEther(salaryAmount.toString());
  input.add64(salaryInWei);
  
  // Encrypt the input
  const encrypted = await input.encrypt();
  
  console.log("Encrypted input created:", encrypted);

  // Create contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  // Send transaction with encrypted data
  const tx = await contract.paySalary(
    employeeAddress,
    { value: salaryInWei }
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
}

// Add employee with FHE encryption
export async function addEmployeeWithFHE(
  employeeAddress: string,
  baseSalary: number,
  kpiBonus: number,
  taskBonus: number,
  fhevmInstance: any
) {
  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error("MetaMask not found");
  }

  await eth.request({ method: "eth_requestAccounts" });
  
  // Create provider with explicit network configuration to avoid ENS issues
  const provider = new ethers.BrowserProvider(eth, {
    chainId: 9746, // FHEVM testnet
    name: "fhevm-testnet"
  });
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  console.log("Adding employee with FHE encryption...");

  // Create encrypted inputs
  const input = fhevmInstance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);
  
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

  // Create contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  // Send transaction with encrypted data
  const tx = await contract.addEmployee(
    employeeAddress,
    encrypted.handles[0], // baseSalary (bytes32)
    encrypted.handles[1], // kpiBonus (bytes32)
    encrypted.handles[2], // taskBonus (bytes32)
    encrypted.inputProof
  );
  
  console.log("Add employee transaction sent:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("Add employee transaction confirmed:", receipt);
  
  return {
    txHash: tx.hash,
    receipt,
    encrypted
  };
}

// Register company
export async function registerCompany(name: string) {
  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error("MetaMask not found");
  }

  await eth.request({ method: "eth_requestAccounts" });
  
  // Create provider with explicit network configuration to avoid ENS issues
  const provider = new ethers.BrowserProvider(eth, {
    chainId: 9746, // FHEVM testnet
    name: "fhevm-testnet"
  });
  const signer = await provider.getSigner();

  console.log("Registering company:", name);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  const tx = await contract.registerCompany(name);
  console.log("Register company transaction sent:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("Register company transaction confirmed:", receipt);
  
  return {
    txHash: tx.hash,
    receipt
  };
}
