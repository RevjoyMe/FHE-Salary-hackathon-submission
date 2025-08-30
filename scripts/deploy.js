const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying FHESalary contract to FHEVM testnet...");

  const FHESalary = await ethers.getContractFactory("FHESalary");
  const fheSalary = await FHESalary.deploy();

  console.log("⏳ Waiting for deployment...");
  await fheSalary.deployed();

  const address = fheSalary.address;
  console.log("✅ FHESalary deployed to:", address);

  // Save deployment info
  const deploymentInfo = {
    contract: "FHESalary",
    address: address,
    network: "fhevm-testnet",
    chainId: 9746,
    deployer: await ethers.provider.getSigner().getAddress(),
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
