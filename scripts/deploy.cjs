const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying FHESalary contract to FHEVM testnet...");

  const SimpleFHESalary = await ethers.getContractFactory("SimpleFHESalary");
  const simpleFheSalary = await SimpleFHESalary.deploy();

  console.log("⏳ Waiting for deployment...");
  await simpleFheSalary.waitForDeployment();

  const address = await simpleFheSalary.getAddress();
  console.log("✅ SimpleFHESalary deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    contract: "SimpleFHESalary",
    address: address,
    network: "hardhat",
    chainId: 31337,
    deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    timestamp: new Date().toISOString(),
  };

  console.log("📋 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  // Сохраняем адрес в файл для использования в фронтенде
  fs.writeFileSync('./contract-address.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Contract address saved to contract-address.json");
  
  console.log("🎉 FHE Contract deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
