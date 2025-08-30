# Деплой FHE Контракта

## Шаги для деплоя:

### 1. Подготовка
```bash
# Убедитесь, что у вас есть приватный ключ кошелька с ETH на FHEVM testnet
# Добавьте приватный ключ в .env файл (без 0x префикса)
echo "PRIVATE_KEY=your_actual_private_key_here" > .env
```

### 2. Компиляция
```bash
npx hardhat compile --config hardhat.config.js contracts/FHESalary.sol
```

### 3. Деплой на FHEVM Testnet
```bash
npx hardhat run scripts/deploy.js --network fhevm
```

### 4. Обновление адреса контракта
После успешного деплоя:
1. Скопируйте адрес контракта из вывода
2. Обновите `CONTRACT_ADDRESS` в `hooks/useConfidentialSalary.tsx`
3. Обновите `CONTRACT_ADDRESS` в `app/salary-payment/page.tsx`

### 5. Тестирование
```bash
# Запустите фронтенд
npm run dev
```

## FHEVM Testnet Информация:
- **RPC URL**: https://fhevm-testnet.zama.ai
- **Chain ID**: 9746
- **Explorer**: https://fhevm-testnet.zama.ai
- **Faucet**: https://fhevm-testnet.zama.ai/faucet

## Важные замечания:
1. Убедитесь, что у вас есть ETH на FHEVM testnet
2. Приватный ключ должен быть без 0x префикса
3. Контракт использует euint64 для FHE операций
4. После деплоя обновите адрес в коде фронтенда
