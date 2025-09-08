# Confidential Salary System

A FHE-powered confidential salary payment system built on Sepolia testnet using Zama's FHEVM technology.

## Features

- **Real MetaMask Integration**: Connect your wallet to interact with the smart contract
- **Demo Employees**: Pre-loaded employees with KPI scores and task completion data
- **Payment Plans**: Automatic calculation of bonuses based on performance
- **FHE Encryption**: All salary data is encrypted using Fully Homomorphic Encryption
- **Sepolia Testnet**: Deployed on Ethereum Sepolia testnet for testing

## Demo Data

The system includes 4 demo employees:

1. **John Smith** - Senior Developer (KPI: 92%, Tasks: 18/20)
2. **Sarah Johnson** - Product Manager (KPI: 88%, Tasks: 16/18)
3. **Michael Chen** - UX Designer (KPI: 95%, Tasks: 19/20)
4. **Emily Davis** - DevOps Engineer (KPI: 85%, Tasks: 17/20)

## Smart Contract Features

- **Company Registration**: Register your company on the blockchain
- **Employee Management**: Add employees with encrypted salary data
- **Salary Payments**: Process confidential salary payments
- **Performance Tracking**: KPI and task-based bonus calculations
- **FHE Integration**: All sensitive data is encrypted using Zama's FHE technology

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Ethereum Sepolia testnet
- **FHE**: Zama FHEVM (@zama-fhe/relayer-sdk)
- **Wallet**: MetaMask integration
- **Deployment**: Vercel

## Quick Start

### Prerequisites

1. **MetaMask**: Install MetaMask browser extension
2. **Sepolia ETH**: Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
3. **Node.js**: Version 18 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/RevjoyMe/FHE-Salary-hackathon-submission.git
cd FHE-Salary-hackathon-submission

# Install dependencies
npm install

# Run development server
npm run dev
```

### Smart Contract Deployment

1. **Setup Hardhat Environment**:
   ```bash
   # Install Hardhat
   npm install -g hardhat
   
   # Create hardhat config
   npx hardhat init
   ```

2. **Configure Environment Variables**:
   Create `.env.local` file:
   ```
   MNEMONIC=your_wallet_mnemonic_phrase
   INFURA_API_KEY=your_infura_api_key
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
   ```

3. **Deploy Contract**:
   ```bash
   # Compile contracts
   npx hardhat compile
   
   # Deploy to Sepolia
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Update Contract Address**:
   After deployment, update the contract address in your frontend configuration.

### Using the Application

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Switch to Sepolia**: Ensure MetaMask is connected to Sepolia testnet
3. **View Employees**: Browse the demo employees with their KPI and task data
4. **Payment Plans**: View detailed payment breakdowns for each employee
5. **Process Payments**: Click "Pay Salary" to simulate salary payments

## FHE Integration

The system uses Zama's FHEVM for confidential salary management:

- **Encrypted Salaries**: All salary amounts are encrypted on-chain
- **Private Calculations**: KPI and task bonuses are calculated privately
- **Verifiable Payments**: Payments are verified without revealing amounts
- **Company Privacy**: Only authorized companies can access encrypted data

## Contract Functions

### Company Management
- `registerCompany(string name)`: Register a new company
- `getCompanyInfo(address companyAddress)`: Get company information

### Employee Management
- `addEmployee(address employeeAddress, euint32 baseSalary, euint32 kpiBonus, euint32 taskBonus)`: Add employee with encrypted salary
- `getEmployeeInfo(address companyAddress, address employeeAddress)`: Get employee information
- `deactivateEmployee(address employeeAddress)`: Deactivate an employee

### Salary Processing
- `paySalary(address employeeAddress)`: Process salary payment
- `getEmployeeSalary(address companyAddress, address employeeAddress)`: Get encrypted salary
- `getTotalPayroll(address companyAddress)`: Get encrypted total payroll

## Security Features

- **Access Control**: Only registered companies can manage their employees
- **Encrypted Data**: All sensitive salary information is encrypted
- **Event Logging**: All operations are logged as blockchain events
- **Input Validation**: Comprehensive validation of all inputs

## Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── salary-payment/     # Main salary payment page
│   ├── layout.tsx         # Root layout with providers
│   └── providers.tsx      # FHEVM providers
├── components/            # UI components
├── hooks/                 # Custom React hooks
│   ├── metamask/         # MetaMask integration
│   └── useConfidentialSalary.tsx # Contract interaction
├── fhevm/                # FHEVM integration
├── contracts/            # Smart contracts
└── public/              # Static assets
```

### Adding New Features

1. **New Contract Functions**: Add to `ConfidentialSalary.sol`
2. **Frontend Integration**: Update `useConfidentialSalary.tsx`
3. **UI Components**: Create new components in `components/`
4. **Pages**: Add new pages in `app/`

## Testing

### Local Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Contract Testing
```bash
# Test smart contracts
npx hardhat test

# Test on local network
npx hardhat node
npx hardhat test --network localhost
```

## Deployment

### Vercel Deployment
The application is automatically deployed to Vercel:

1. **Build**: `npm run build`
2. **Deploy**: Automatic deployment on push to main branch
3. **Environment**: Production environment with optimized build

### Contract Deployment
```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## Troubleshooting

### Common Issues

1. **MetaMask Connection Failed**:
   - Ensure MetaMask is installed
   - Check if Sepolia network is added
   - Verify wallet has Sepolia ETH

2. **Contract Interaction Errors**:
   - Check contract address is correct
   - Verify network connection
   - Ensure sufficient gas fees

3. **FHE Encryption Issues**:
   - Check FHEVM initialization
   - Verify relayer connection
   - Check browser console for errors

### Support

For issues and questions:
- Check the [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- Review [FHEVM React Template](https://github.com/zama-ai/fhevm-react-template)
- Open an issue on GitHub

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Zama](https://zama.ai/) for FHEVM technology
- [FHEVM React Template](https://github.com/zama-ai/fhevm-react-template) for integration examples
- [shadcn/ui](https://ui.shadcn.com/) for UI components
