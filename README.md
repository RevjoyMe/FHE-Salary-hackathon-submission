# Confidential Salary System

A decentralized application for managing employee salaries with complete privacy using Fully Homomorphic Encryption (FHE) on the Zama Protocol.

## 🏆 Zama Hackathon Project

This project was built for the Zama Confidential Blockchain Protocol hackathon, demonstrating how FHE can be used to create confidential financial applications.

## 🎯 Problem Statement

Traditional blockchain-based salary systems expose sensitive financial information publicly, which can lead to:
- Privacy violations
- Competitive disadvantages
- Employee discomfort
- Compliance issues

## 💡 Solution

**Confidential Salary System** uses FHE to encrypt all salary data while maintaining:
- ✅ **Complete Privacy**: Salary amounts are encrypted end-to-end
- ✅ **Verifiable Payments**: Transactions are verified on-chain without revealing amounts
- ✅ **Company Control**: Employers can manage payroll while maintaining confidentiality
- ✅ **Compliance Ready**: Built-in audit trails without exposing sensitive data

## 🚀 Features

### For Companies
- **Register Company**: Create a company profile on the blockchain
- **Add Employees**: Add employees with encrypted salary information
- **Manage Payroll**: Track total encrypted payroll without revealing individual amounts
- **Pay Salaries**: Execute salary payments with full privacy

### For Employees
- **Private Salaries**: Salary amounts remain completely private
- **Verifiable Payments**: Confirm payments were made without revealing amounts
- **Secure Access**: Only authorized parties can view encrypted data

### Technical Features
- **FHE Integration**: Uses Zama's FHE protocol for encryption
- **Smart Contracts**: Solidity contracts with FHE operations
- **Modern UI**: React + TypeScript + Tailwind CSS
- **MetaMask Integration**: Seamless wallet connectivity

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: Smart contract language
- **FHE**: Fully Homomorphic Encryption via Zama Protocol
- **Hardhat**: Development and deployment framework

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Ethers.js**: Ethereum interaction
- **FHEVM**: FHE integration

### Infrastructure
- **Zama Protocol**: FHE layer
- **Ethereum/Sepolia**: Blockchain network
- **MetaMask**: Wallet integration

## 📁 Project Structure

```
confidential-salary/
├── packages/
│   ├── fhevm-hardhat-template/     # Smart contracts
│   │   ├── contracts/
│   │   │   └── ConfidentialSalary.sol
│   │   ├── deploy/
│   │   │   └── deploy.ts
│   │   └── hardhat.config.ts
│   └── site/                       # Frontend
│       ├── app/
│       ├── components/
│       ├── hooks/
│       └── fhevm/
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd confidential-salary
   ```

2. **Install dependencies**
   ```bash
npm install
```

3. **Start local Hardhat node**
   ```bash
cd packages/fhevm-hardhat-template
npx hardhat node --verbose
   ```

4. **Deploy contracts**
   ```bash
   # In a new terminal
   cd packages/fhevm-hardhat-template
npx hardhat deploy --network localhost
```

5. **Start frontend**
   ```bash
   # In a new terminal
   cd packages/site
npm run dev:mock
```

6. **Connect MetaMask**
   - Add Hardhat network (Chain ID: 31337, RPC: http://127.0.0.1:8545)
   - Import test accounts from Hardhat output

## 🎮 How to Use

### 1. Connect Wallet
- Click "Connect to MetaMask"
- Ensure you're on the correct network (Hardhat local or Sepolia)

### 2. Register Company
- Go to "Company Management" tab
- Enter your company name
- Click "Register Company"

### 3. Add Employees
- Go to "Employee Management" tab
- Enter employee wallet address and salary amount
- Click "Add Employee" (salary will be encrypted)

### 4. Manage Payroll
- View company statistics (encrypted total payroll)
- Pay salaries to employees
- Track payment history

## 🔐 FHE Security Features

### Encryption
- All salary amounts are encrypted using FHE
- Even node operators cannot see the data
- Encryption is end-to-end

### Access Control
- Companies can view their employees' encrypted salaries
- Employees can verify payments without revealing amounts
- Public verification of payment existence

### Compliance
- Audit trails are maintained
- Regulatory requirements can be met
- No sensitive data exposure

## 🎯 Use Cases

### Enterprise Payroll
- Large companies managing thousands of employees
- Maintaining salary confidentiality across departments
- Compliance with privacy regulations

### Startup Compensation
- Early-stage companies with sensitive compensation data
- Equity and salary management
- Investor confidentiality

### Freelancer Payments
- Confidential contractor payments
- Project-based compensation
- Multi-client privacy

## 🔮 Future Enhancements

- **Multi-currency Support**: Handle different currencies with FHE
- **Bonus Management**: Encrypted bonus and incentive systems
- **Tax Integration**: Automated tax calculations with privacy
- **Benefits Management**: Health insurance and benefits tracking
- **Mobile App**: Native mobile application
- **API Integration**: Connect with existing HR systems

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Zama Team**: For the amazing FHE protocol and developer tools
- **Hackathon Mentors**: For guidance and support
- **Open Source Community**: For the incredible tools and libraries

## 📞 Contact

- **Project**: Confidential Salary System
- **Hackathon**: Zama Confidential Blockchain Protocol
- **Team**: [Your Team Name]

---

**Built with ❤️ for the Zama Hackathon**