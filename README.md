# Salary System - Confidential Payroll Management

A full-stack application for managing employee salaries with complete privacy using Fully Homomorphic Encryption (FHE) technology.

## 🏗️ Project Structure

```
Salary/
├── frontend/          # Next.js frontend application
├── backend/           # Hardhat + FHE smart contracts
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MetaMask browser extension
- Git

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd Hackcaton/Salary

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend/packages/fhevm-hardhat-template
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the `frontend` directory:

```env
# Frontend Environment Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_NETWORK_ID=31337
NEXT_PUBLIC_NETWORK_NAME=Hardhat
NEXT_PUBLIC_FHE_ENABLED=true
NEXT_PUBLIC_DEV_MODE=true
```

### 3. Deploy Smart Contracts

```bash
# Navigate to backend
cd backend/packages/fhevm-hardhat-template

# Start local Hardhat node
npx hardhat node

# In a new terminal, deploy contracts
npx hardhat deploy --network localhost
```

### 4. Start Frontend

```bash
# Navigate to frontend
cd frontend

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Frontend Configuration

The frontend is configured to connect to the Hardhat local network by default. Key configuration files:

- `next.config.mjs` - Next.js configuration with API proxy
- `lib/api.ts` - API client for backend communication
- `.env.local` - Environment variables

### Backend Configuration

The backend uses Hardhat with FHE support:

- `hardhat.config.ts` - Hardhat configuration
- `contracts/ConfidentialSalary.sol` - Main smart contract
- `deploy/deploy.ts` - Deployment script

## 🏛️ Smart Contract Architecture

### ConfidentialSalary Contract

The main contract provides the following functions:

#### Company Management
- `registerCompany(string name)` - Register a new company
- `getCompanyInfo(address)` - Get company information
- `getCompanyEmployees(address)` - Get company employees

#### Employee Management
- `addEmployee(address, encryptedSalary, proof)` - Add employee with encrypted salary
- `getEmployeeInfo(address)` - Get employee information
- `deactivateEmployee(address)` - Deactivate employee

#### Salary Management
- `paySalary(address)` - Pay salary to employee
- `getEmployeeSalary(address)` - Get encrypted salary
- `getCompanyPayroll(address)` - Get encrypted total payroll

### FHE Integration

The contract uses Zama's FHE technology to:
- Encrypt salary amounts using `euint32`
- Perform encrypted calculations
- Maintain privacy while enabling verification

## 🎯 Features

### Frontend Features
- **Company Registration** - Register and manage company information
- **Employee Management** - Add, view, and manage employees
- **Salary Payments** - Process encrypted salary payments
- **Real-time Updates** - Live updates from blockchain
- **Responsive Design** - Works on desktop and mobile

### Backend Features
- **FHE Encryption** - Fully homomorphic encryption for salaries
- **Smart Contract** - Ethereum-based payroll management
- **Event Logging** - Comprehensive event tracking
- **Security** - Access control and validation

## 🔐 Security Features

- **FHE Encryption** - Salaries are encrypted and remain private
- **Access Control** - Only authorized companies can manage their employees
- **Input Validation** - Comprehensive validation of all inputs
- **Event Logging** - All actions are logged on the blockchain

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend/packages/fhevm-hardhat-template
npx hardhat test
```

## 📦 Deployment

### Local Development
1. Start Hardhat node: `npx hardhat node`
2. Deploy contracts: `npx hardhat deploy --network localhost`
3. Start frontend: `npm run dev`

### Testnet Deployment (Sepolia)
1. Set environment variables for Sepolia
2. Deploy contracts: `npx hardhat deploy --network sepolia`
3. Update frontend configuration with deployed contract address

### Production Deployment
1. Configure production environment variables
2. Deploy to mainnet: `npx hardhat deploy --network mainnet`
3. Deploy frontend to hosting service (Vercel, Netlify, etc.)

## 🔧 Development

### Adding New Features

1. **Smart Contract Changes**
   - Modify `contracts/ConfidentialSalary.sol`
   - Add tests in `test/` directory
   - Update deployment script if needed

2. **Frontend Changes**
   - Add new components in `components/` directory
   - Update API client in `lib/api.ts`
   - Add new pages in `app/` directory

3. **Integration**
   - Update API endpoints in `lib/api.ts`
   - Test integration between frontend and backend
   - Update documentation

### Code Style

- **Frontend**: Follow Next.js and React best practices
- **Backend**: Follow Solidity style guide
- **Documentation**: Keep README and comments up to date

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection Failed**
   - Ensure MetaMask is installed and unlocked
   - Check if you're connected to the correct network
   - Clear browser cache and try again

2. **Contract Deployment Failed**
   - Check Hardhat node is running
   - Verify network configuration
   - Check for compilation errors

3. **FHE Encryption Issues**
   - Ensure FHE dependencies are installed
   - Check FHE configuration in hardhat.config.ts
   - Verify FHE network is accessible

### Debug Mode

Enable debug mode by setting `NEXT_PUBLIC_DEV_MODE=true` in your environment variables.

## 📚 Documentation

- [Zama FHE Documentation](https://docs.zama.ai/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethereum Development](https://ethereum.org/developers/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Note**: This is a demonstration project for the Zama hackathon. For production use, additional security measures and testing should be implemented.
