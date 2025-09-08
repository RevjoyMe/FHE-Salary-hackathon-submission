const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SimpleCounter contract...");

  // Получаем аккаунт для деплоя
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Деплоим SimpleCounter контракт
  const SimpleCounter = await ethers.getContractFactory("SimpleCounter");
  const simpleCounter = await SimpleCounter.deploy();

  await simpleCounter.deployed();

  console.log("✅ SimpleCounter deployed to:", simpleCounter.address);
  console.log("📝 Contract address for frontend:", simpleCounter.address);

  // Проверяем что контракт работает
  try {
    const initialValue = await simpleCounter.get();
    console.log("🎯 Initial counter value:", initialValue.toString());
    
    // Тестируем increment
    const tx = await simpleCounter.increment();
    await tx.wait();
    
    const newValue = await simpleCounter.get();
    console.log("🎯 After increment:", newValue.toString());
    
    console.log("✅ Contract is working correctly!");
  } catch (error) {
    console.log("⚠️ Warning: Could not test contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
