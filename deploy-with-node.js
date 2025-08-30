const { HardhatRuntimeEnvironment } = require("hardhat/runtime");
const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Starting Hardhat node and deploying contract...");
  
  // Создаем локальный провайдер
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Используем первый тестовый аккаунт
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("📋 Using account:", wallet.address);
  
  // Получаем фабрику контракта
  const SimpleFHESalary = await ethers.getContractFactory("SimpleFHESalary", wallet);
  
  console.log("⏳ Deploying SimpleFHESalary...");
  const simpleFheSalary = await SimpleFHESalary.deploy();
  
  console.log("⏳ Waiting for deployment...");
  await simpleFheSalary.waitForDeployment();
  
  const address = await simpleFheSalary.getAddress();
  console.log("✅ SimpleFHESalary deployed to:", address);
  
  // Save deployment info
  const deploymentInfo = {
    contract: "SimpleFHESalary",
    address: address,
    network: "localhost",
    chainId: 31337,
    deployer: wallet.address,
    timestamp: new Date().toISOString(),
  };
  
  console.log("📋 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  // Сохраняем адрес в файл для использования в фронтенде
  fs.writeFileSync('./contract-address.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Contract address saved to contract-address.json");
  
  console.log("🎉 FHE Contract deployment completed successfully!");
  console.log("🌐 Local Hardhat node is running at http://127.0.0.1:8545");
  console.log("🔗 Contract address:", address);
}

main()
  .then(() => {
    console.log("✅ Deployment script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
