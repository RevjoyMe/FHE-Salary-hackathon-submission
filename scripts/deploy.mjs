import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FHESalary contract...");

  const FHESalary = await ethers.getContractFactory("FHESalary");
  const fheSalary = await FHESalary.deploy();

  await fheSalary.waitForDeployment();

  const address = await fheSalary.getAddress();
  console.log("FHESalary deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    contract: "FHESalary",
    address: address,
    network: "fhevm-testnet",
    chainId: 9746,
    deployer: await ethers.provider.getSigner().getAddress(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  // Сохраняем адрес в файл для использования в фронтенде
  const fs = await import('fs');
  fs.writeFileSync('./contract-address.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Contract address saved to contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
