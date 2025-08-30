// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/FHE.sol";

contract ConfidentialSalaryV2 {
    struct Employee {
        address employeeAddress;
        euint64 baseSalary;
        euint64 kpiBonus;
        euint64 taskBonus;
        bool isActive;
        uint256 lastPaymentDate;
    }

    struct Company {
        address companyAddress;
        string name;
        uint256 employeeCount;
        euint64 totalPayroll;
    }

    mapping(address => Company) public companies;
    mapping(address => mapping(address => Employee)) public employees;
    mapping(address => address[]) public companyEmployees;

    event CompanyRegistered(address indexed companyAddress, string name);
    event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress);
    event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 timestamp);

    function registerCompany(string memory _name) external {
        require(companies[msg.sender].companyAddress == address(0), "Company already registered");
        
        companies[msg.sender] = Company({
            companyAddress: msg.sender,
            name: _name,
            employeeCount: 0,
            totalPayroll: FHE.asEuint64(0)
        });

        emit CompanyRegistered(msg.sender, _name);
    }

    function addEmployee(
        address _employeeAddress,
        euint64 _baseSalary,
        euint64 _kpiBonus,
        euint64 _taskBonus
    ) external {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(_employeeAddress != address(0), "Invalid employee address");
        require(!employees[msg.sender][_employeeAddress].isActive, "Employee already exists");

        employees[msg.sender][_employeeAddress] = Employee({
            employeeAddress: _employeeAddress,
            baseSalary: _baseSalary,
            kpiBonus: _kpiBonus,
            taskBonus: _taskBonus,
            isActive: true,
            lastPaymentDate: 0
        });

        companyEmployees[msg.sender].push(_employeeAddress);
        companies[msg.sender].employeeCount++;

        emit EmployeeAdded(msg.sender, _employeeAddress);
    }

    function paySalary(address _employeeAddress) external payable {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(employees[msg.sender][_employeeAddress].isActive, "Employee not found");

        Employee storage employee = employees[msg.sender][_employeeAddress];
        
        // Calculate total salary (base + kpi + task bonuses)
        euint64 totalSalary = employee.baseSalary.add(employee.kpiBonus).add(employee.taskBonus);
        
        // Convert to uint256 for payment (this would need proper decryption in real implementation)
        uint256 salaryAmount = FHE.decrypt(totalSalary);
        
        require(msg.value >= salaryAmount, "Insufficient payment amount");

        // Update employee payment date
        employee.lastPaymentDate = block.timestamp;

        // Transfer salary to employee
        payable(_employeeAddress).transfer(salaryAmount);

        // Refund excess payment
        if (msg.value > salaryAmount) {
            payable(msg.sender).transfer(msg.value - salaryAmount);
        }

        emit SalaryPaid(msg.sender, _employeeAddress, block.timestamp);
    }

    function deactivateEmployee(address _employeeAddress) external {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(employees[msg.sender][_employeeAddress].isActive, "Employee not found");

        employees[msg.sender][_employeeAddress].isActive = false;
        companies[msg.sender].employeeCount--;
    }

    function getEmployeeInfo(address _companyAddress, address _employeeAddress) 
        external 
        view 
        returns (address employeeAddress, bool isActive, uint256 lastPaymentDate) 
    {
        Employee storage employee = employees[_companyAddress][_employeeAddress];
        return (employee.employeeAddress, employee.isActive, employee.lastPaymentDate);
    }

    function getCompanyInfo(address _companyAddress) 
        external 
        view 
        returns (address companyAddress, string memory name, uint256 employeeCount) 
    {
        Company storage company = companies[_companyAddress];
        return (company.companyAddress, company.name, company.employeeCount);
    }

    function getCompanyEmployees(address _companyAddress) 
        external 
        view 
        returns (address[] memory) 
    {
        return companyEmployees[_companyAddress];
    }

    function getEmployeeSalary(address _companyAddress, address _employeeAddress) 
        external 
        view 
        returns (euint64 totalSalary) 
    {
        Employee storage employee = employees[_companyAddress][_employeeAddress];
        return employee.baseSalary.add(employee.kpiBonus).add(employee.taskBonus);
    }

    function getTotalPayroll(address _companyAddress) 
        external 
        view 
        returns (euint64 totalPayroll) 
    {
        return companies[_companyAddress].totalPayroll;
    }
}
