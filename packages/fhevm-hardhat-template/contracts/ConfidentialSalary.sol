// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Confidential Salary Contract
/// @author Zama Hackathon
/// @notice A contract for managing confidential salary payments using FHE
contract ConfidentialSalary is SepoliaConfig {
    
    struct Employee {
        address employeeAddress;
        euint64 salary; // Encrypted salary amount
        bool isActive;
        uint256 lastPaymentDate;
    }
    
    struct Company {
        address companyAddress;
        string name;
        euint64 totalPayroll; // Encrypted total payroll
        uint256 employeeCount;
    }
    
    // Mapping from company address to company info
    mapping(address => Company) public companies;
    
    // Mapping from employee address to employee info
    mapping(address => Employee) public employees;
    
    // Mapping from company to employees
    mapping(address => address[]) public companyEmployees;
    
    // Events
    event CompanyRegistered(address indexed companyAddress, string name);
    event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress);
    event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 timestamp);
    event EmployeeDeactivated(address indexed companyAddress, address indexed employeeAddress);
    
    /// @notice Register a new company
    /// @param name Company name
    function registerCompany(string memory name) external {
        require(companies[msg.sender].companyAddress == address(0), "Company already registered");
        
        companies[msg.sender] = Company({
            companyAddress: msg.sender,
            name: name,
            totalPayroll: FHE.asEuint64(0),
            employeeCount: 0
        });
        
        emit CompanyRegistered(msg.sender, name);
    }
    
    /// @notice Add an employee with encrypted salary
    /// @param employeeAddress Employee's wallet address
    /// @param encryptedSalary Encrypted salary amount
    /// @param salaryProof Proof for the encrypted salary
    function addEmployee(
        address employeeAddress, 
        externalEuint64 encryptedSalary, 
        bytes calldata salaryProof
    ) external {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(employees[employeeAddress].employeeAddress == address(0), "Employee already exists");
        
        euint64 salary = FHE.fromExternal(encryptedSalary, salaryProof);
        
        employees[employeeAddress] = Employee({
            employeeAddress: employeeAddress,
            salary: salary,
            isActive: true,
            lastPaymentDate: 0
        });
        
        companyEmployees[msg.sender].push(employeeAddress);
        companies[msg.sender].employeeCount++;
        
        // Update total payroll (encrypted)
        companies[msg.sender].totalPayroll = FHE.add(companies[msg.sender].totalPayroll, salary);
        
        // Allow company to see employee salary
        FHE.allow(salary, msg.sender);
        
        emit EmployeeAdded(msg.sender, employeeAddress);
    }
    
    /// @notice Pay salary to an employee
    /// @param employeeAddress Employee's wallet address
    function paySalary(address employeeAddress) external payable {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(employees[employeeAddress].isActive, "Employee not active");
        
        Employee storage employee = employees[employeeAddress];
        
        // In a real implementation, you would verify the payment amount matches the salary
        // For demo purposes, we'll just record the payment
        
        employee.lastPaymentDate = block.timestamp;
        
        emit SalaryPaid(msg.sender, employeeAddress, block.timestamp);
    }
    
    /// @notice Get employee salary (encrypted)
    /// @param employeeAddress Employee's wallet address
    /// @return Encrypted salary amount
    function getEmployeeSalary(address employeeAddress) external view returns (euint64) {
        require(employees[employeeAddress].employeeAddress != address(0), "Employee not found");
        return employees[employeeAddress].salary;
    }
    
    /// @notice Get company total payroll (encrypted)
    /// @param companyAddress Company's wallet address
    /// @return Encrypted total payroll amount
    function getCompanyPayroll(address companyAddress) external view returns (euint64) {
        require(companies[companyAddress].companyAddress != address(0), "Company not found");
        return companies[companyAddress].totalPayroll;
    }
    
    /// @notice Get employee info
    /// @param employeeAddress Employee's wallet address
    /// @return addr Employee's address
    /// @return isActive Whether employee is active
    /// @return lastPaymentDate Last payment timestamp
    function getEmployeeInfo(address employeeAddress) external view returns (
        address addr,
        bool isActive,
        uint256 lastPaymentDate
    ) {
        Employee storage employee = employees[employeeAddress];
        require(employee.employeeAddress != address(0), "Employee not found");
        
        return (employee.employeeAddress, employee.isActive, employee.lastPaymentDate);
    }
    
    /// @notice Get company info
    /// @param companyAddress Company's wallet address
    /// @return name Company name
    /// @return employeeCount Number of employees
    function getCompanyInfo(address companyAddress) external view returns (
        string memory name,
        uint256 employeeCount
    ) {
        Company storage company = companies[companyAddress];
        require(company.companyAddress != address(0), "Company not found");
        
        return (company.name, company.employeeCount);
    }
    
    /// @notice Get all employees for a company
    /// @param companyAddress Company's wallet address
    /// @return Array of employee addresses
    function getCompanyEmployees(address companyAddress) external view returns (address[] memory) {
        require(companies[companyAddress].companyAddress != address(0), "Company not found");
        return companyEmployees[companyAddress];
    }
    
    /// @notice Deactivate an employee
    /// @param employeeAddress Employee's wallet address
    function deactivateEmployee(address employeeAddress) external {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(employees[employeeAddress].isActive, "Employee already inactive");
        
        employees[employeeAddress].isActive = false;
        
        // Update total payroll (subtract employee salary)
        euint64 salary = employees[employeeAddress].salary;
        companies[msg.sender].totalPayroll = FHE.sub(companies[msg.sender].totalPayroll, salary);
        companies[msg.sender].employeeCount--;
        
        emit EmployeeDeactivated(msg.sender, employeeAddress);
    }
}
