# FHEVM Contract Deployment Guide

## Prerequisites
1. Node.js and npm installed
2. MetaMask wallet with Sepolia testnet configured
3. Sepolia ETH for gas fees

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 2: Configure Environment
Create a `.env` file in the `backend` directory:
```env
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
```

## Step 3: Deploy Contract
```bash
npx hardhat run deploy/deploy.ts --network sepolia
```

## Step 4: Update Frontend
After deployment, copy the contract address and update the frontend environment:

1. Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
```

2. Redeploy the frontend to Vercel

## Step 5: Test Transactions
1. Connect MetaMask to Sepolia testnet
2. Ensure you have Sepolia ETH
3. Try paying a salary - it should now trigger real FHEVM transactions

## Troubleshooting
- Make sure MetaMask is connected to Sepolia testnet
- Ensure you have enough Sepolia ETH for gas fees
- Check that the contract address is correctly set in environment variables
