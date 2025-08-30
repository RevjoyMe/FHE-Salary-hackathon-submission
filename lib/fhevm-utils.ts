import { ethers } from "ethers";
import { createInstance, initSDK, SepoliaConfig } from "@zama-fhe/relayer-sdk";

// Contract configuration
export const CONTRACT_ADDRESS = "0x4a3401547b8607612328334C947e7E011eBC4312";
export const CONTRACT_ABI = [
  "function paySalary(address employeeAddress) external payable",
  "function addEmployee(address employeeAddress, euint32 baseSalary, euint32 kpiBonus, euint32 taskBonus) external",
  "function registerCompany(string memory name) external",
  "event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 timestamp)",
  "event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress)",
  "event CompanyRegistered(address indexed companyAddress, string name)"
];

// Initialize FHEVM instance
export async function getFhevmInstance() {
  await initSDK();
  return await createInstance(SepoliaConfig);
}

// Pay salary with FHE encryption
export async function paySalaryWithFHE(
  employeeAddress: string,
  salaryAmount: number,
  fhevmInstance: any
) {
  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error("MetaMask not found");
  }

  // Request account access
  await eth.request({ method: "eth_requestAccounts" });
  
  const provider = new ethers.BrowserProvider(eth);
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
  input.add32(salaryInWei);
  
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
  
  const provider = new ethers.BrowserProvider(eth);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  console.log("Adding employee with FHE encryption...");

  // Create encrypted inputs
  const input = fhevmInstance.createEncryptedInput(CONTRACT_ADDRESS, userAddress);
  
  // Convert amounts to wei and add to input
  const baseSalaryWei = ethers.parseEther(baseSalary.toString());
  const kpiBonusWei = ethers.parseEther(kpiBonus.toString());
  const taskBonusWei = ethers.parseEther(taskBonus.toString());
  
  input.add32(baseSalaryWei);
  input.add32(kpiBonusWei);
  input.add32(taskBonusWei);
  
  // Encrypt the inputs
  const encrypted = await input.encrypt();
  
  console.log("Encrypted inputs created:", encrypted);

  // Create contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  // Send transaction with encrypted data
  const tx = await contract.addEmployee(
    employeeAddress,
    encrypted.handles[0], // baseSalary
    encrypted.handles[1], // kpiBonus
    encrypted.handles[2], // taskBonus
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
  
  const provider = new ethers.BrowserProvider(eth);
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
