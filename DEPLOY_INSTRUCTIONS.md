лай # 🚀 FHEVM Contract Deployment Instructions

## Quick Deploy (Recommended for Hackathon)

### Step 1: Navigate to Backend
```bash
cd Hackcaton/confidential-salary/packages/fhevm-hardhat-template
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Environment Variables
Create a `.env` file in the `fhevm-hardhat-template` directory:
```env
MNEMONIC=your_metamask_seed_phrase_here
INFURA_API_KEY=your_infura_project_id_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Step 4: Deploy to Sepolia
```bash
npx hardhat run deploy/deploy.ts --network sepolia
```

### Step 5: Copy Contract Address
After deployment, copy the contract address from the output.

### Step 6: Update Frontend Environment
Create `.env.local` in the `Salary` root directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
```

### Step 7: Redeploy Frontend
Push changes to GitHub to trigger Vercel redeploy.

## Alternative: Use Temple Wallet (No RPC Setup)

If you want to use Temple wallet without setting up RPC:

1. **Deploy contract** using the steps above
2. **Update frontend** with contract address
3. **Connect Temple wallet** instead of MetaMask
4. **Transactions will work** through Temple's infrastructure

## Testing Transactions

1. Connect wallet to Sepolia testnet
2. Ensure you have Sepolia ETH
3. Try paying a salary - should trigger real FHEVM transaction
4. Check transaction hash in notification

## Troubleshooting

- **"FHEVM not initialized"**: Make sure wallet is connected
- **"MetaMask not found"**: Install MetaMask or use Temple
- **"Insufficient funds"**: Get Sepolia ETH from faucet
- **"Contract not found"**: Check contract address in environment variables
