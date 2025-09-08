// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@zama-fhe/contracts/FHE.sol";

contract ConfidentialSalary {
    struct Employee {
        address employeeAddress;
        euint32 baseSalary; // Encrypted base salary
        euint32 kpiBonus;   // Encrypted KPI bonus
        euint32 taskBonus;  // Encrypted task bonus
        euint32 totalSalary; // Encrypted total salary
        bool isActive;
        uint256 lastPaymentDate;
    }

    struct Company {
        address companyAddress;
        string name;
        uint256 employeeCount;
        euint32 totalPayroll; // Encrypted total payroll
    }

    mapping(address => Company) public companies;
    mapping(address => mapping(address => Employee)) public employees; // company => employee => Employee
    mapping(address => address[]) public companyEmployees; // company => employee addresses

    event CompanyRegistered(address indexed companyAddress, string name);
    event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress);
    event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 amount);
    event EmployeeDeactivated(address indexed companyAddress, address indexed employeeAddress);

    modifier onlyCompany() {
        require(companies[msg.sender].companyAddress != address(0), "Not a registered company");
        _;
    }

    modifier onlyEmployee(address _companyAddress) {
        require(employees[_companyAddress][msg.sender].employeeAddress != address(0), "Not an employee");
        _;
    }

    function registerCompany(string memory _name) external {
        require(companies[msg.sender].companyAddress == address(0), "Company already registered");
        
        companies[msg.sender] = Company({
            companyAddress: msg.sender,
            name: _name,
            employeeCount: 0,
            totalPayroll: TFHE.asEuint32(0)
        });

        emit CompanyRegistered(msg.sender, _name);
    }

    function addEmployee(
        address _employeeAddress,
        euint32 _baseSalary,
        euint32 _kpiBonus,
        euint32 _taskBonus
    ) external onlyCompany {
        require(_employeeAddress != address(0), "Invalid employee address");
        require(employees[msg.sender][_employeeAddress].employeeAddress == address(0), "Employee already exists");

        euint32 totalSalary = TFHE.add(_baseSalary, TFHE.add(_kpiBonus, _taskBonus));

        employees[msg.sender][_employeeAddress] = Employee({
            employeeAddress: _employeeAddress,
            baseSalary: _baseSalary,
            kpiBonus: _kpiBonus,
            taskBonus: _taskBonus,
            totalSalary: totalSalary,
            isActive: true,
            lastPaymentDate: 0
        });

        companyEmployees[msg.sender].push(_employeeAddress);
        companies[msg.sender].employeeCount++;
        
        // Update total payroll (encrypted)
        companies[msg.sender].totalPayroll = TFHE.add(companies[msg.sender].totalPayroll, totalSalary);

        emit EmployeeAdded(msg.sender, _employeeAddress);
    }

    function paySalary(address _employeeAddress) external onlyCompany {
        Employee storage employee = employees[msg.sender][_employeeAddress];
        require(employee.employeeAddress != address(0), "Employee not found");
        require(employee.isActive, "Employee is not active");

        // In a real implementation, this would transfer ETH to the employee
        // For now, we just update the last payment date
        employee.lastPaymentDate = block.timestamp;

        emit SalaryPaid(msg.sender, _employeeAddress, TFHE.decrypt(employee.totalSalary));
    }

    function deactivateEmployee(address _employeeAddress) external onlyCompany {
        Employee storage employee = employees[msg.sender][_employeeAddress];
        require(employee.employeeAddress != address(0), "Employee not found");
        require(employee.isActive, "Employee already inactive");

        employee.isActive = false;
        companies[msg.sender].employeeCount--;

        // Remove from total payroll (encrypted)
        companies[msg.sender].totalPayroll = TFHE.sub(companies[msg.sender].totalPayroll, employee.totalSalary);

        emit EmployeeDeactivated(msg.sender, _employeeAddress);
    }

    function getEmployeeInfo(address _companyAddress, address _employeeAddress) 
        external 
        view 
        returns (
            address employeeAddress,
            bool isActive,
            uint256 lastPaymentDate
        ) 
    {
        Employee storage employee = employees[_companyAddress][_employeeAddress];
        return (
            employee.employeeAddress,
            employee.isActive,
            employee.lastPaymentDate
        );
    }

    function getCompanyInfo(address _companyAddress) 
        external 
        view 
        returns (
            address companyAddress,
            string memory name,
            uint256 employeeCount
        ) 
    {
        Company storage company = companies[_companyAddress];
        return (
            company.companyAddress,
            company.name,
            company.employeeCount
        );
    }

    function getCompanyEmployees(address _companyAddress) external view returns (address[] memory) {
        return companyEmployees[_companyAddress];
    }

    // Function to get encrypted salary (only for the company)
    function getEmployeeSalary(address _companyAddress, address _employeeAddress) 
        external 
        view 
        onlyCompany 
        returns (euint32 totalSalary) 
    {
        Employee storage employee = employees[_companyAddress][_employeeAddress];
        require(employee.employeeAddress != address(0), "Employee not found");
        return employee.totalSalary;
    }

    // Function to get encrypted total payroll (only for the company)
    function getTotalPayroll(address _companyAddress) 
        external 
        view 
        onlyCompany 
        returns (euint32 totalPayroll) 
    {
        Company storage company = companies[_companyAddress];
        require(company.companyAddress != address(0), "Company not found");
        return company.totalPayroll;
    }
}
