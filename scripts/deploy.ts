import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ConfidentialSalaryV2 contract...");

  const ConfidentialSalaryV2 = await ethers.getContractFactory("ConfidentialSalaryV2");
  const confidentialSalary = await ConfidentialSalaryV2.deploy();

  await confidentialSalary.waitForDeployment();

  const address = await confidentialSalary.getAddress();
  console.log("ConfidentialSalaryV2 deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    contract: "ConfidentialSalaryV2",
    address: address,
    network: "fhevm-testnet",
    chainId: 9746,
    deployer: await ethers.provider.getSigner().getAddress(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
