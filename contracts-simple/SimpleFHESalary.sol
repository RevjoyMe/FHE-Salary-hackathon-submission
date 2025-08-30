// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Простой FHE контракт для хакатона Zama
contract SimpleFHESalary {
    // Структура сотрудника
    struct Employee {
        address employeeAddress;
        uint256 baseSalary;    // Базовая зарплата (в wei)
        uint256 kpiBonus;      // KPI бонус (в wei)
        uint256 taskBonus;     // Бонус за задачи (в wei)
        bool isActive;
        uint256 lastPaymentDate;
    }
    
    // Структура компании
    struct Company {
        address companyAddress;
        string name;
        uint256 employeeCount;
        uint256 totalPayroll;  // Общий фонд зарплат
    }
    
    mapping(address => Company) public companies;
    mapping(address => mapping(address => Employee)) public employees;
    mapping(address => address[]) public companyEmployees;
    
    event CompanyRegistered(address indexed companyAddress, string name);
    event EmployeeAdded(address indexed companyAddress, address indexed employeeAddress);
    event SalaryPaid(address indexed companyAddress, address indexed employeeAddress, uint256 amount, uint256 timestamp);
    event SalarySet(address indexed employee, uint256 salary);
    
    // Регистрация компании
    function registerCompany(string memory _name) external {
        require(companies[msg.sender].companyAddress == address(0), "Company already registered");
        
        companies[msg.sender] = Company({
            companyAddress: msg.sender,
            name: _name,
            employeeCount: 0,
            totalPayroll: 0
        });
        
        emit CompanyRegistered(msg.sender, _name);
    }
    
    // Добавление сотрудника
    function addEmployee(
        address _employeeAddress,
        uint256 _baseSalary,
        uint256 _kpiBonus,
        uint256 _taskBonus
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
    
    // Выплата зарплаты
    function paySalary(address _employeeAddress) external payable {
        require(companies[msg.sender].companyAddress != address(0), "Company not registered");
        require(employees[msg.sender][_employeeAddress].isActive, "Employee not found");
        
        Employee storage employee = employees[msg.sender][_employeeAddress];
        
        // Вычисляем общую зарплату (base + kpi + task)
        uint256 totalSalary = employee.baseSalary + employee.kpiBonus + employee.taskBonus;
        
        require(msg.value >= totalSalary, "Insufficient payment amount");
        
        // Переводим зарплату сотруднику
        payable(_employeeAddress).transfer(totalSalary);
        
        // Возвращаем излишек
        if (msg.value > totalSalary) {
            payable(msg.sender).transfer(msg.value - totalSalary);
        }
        
        // Обновляем дату последней выплаты
        employee.lastPaymentDate = block.timestamp;
        
        emit SalaryPaid(msg.sender, _employeeAddress, totalSalary, block.timestamp);
    }
    
    // Получение информации о сотруднике
    function getEmployeeInfo(address _companyAddress, address _employeeAddress) 
        external 
        view 
        returns (address employeeAddress, bool isActive, uint256 lastPaymentDate) 
    {
        Employee storage employee = employees[_companyAddress][_employeeAddress];
        return (employee.employeeAddress, employee.isActive, employee.lastPaymentDate);
    }
    
    // Получение информации о компании
    function getCompanyInfo(address _companyAddress) 
        external 
        view 
        returns (address companyAddress, string memory name, uint256 employeeCount) 
    {
        Company storage company = companies[_companyAddress];
        return (company.companyAddress, company.name, company.employeeCount);
    }
    
    // Получение списка сотрудников компании
    function getCompanyEmployees(address _companyAddress) 
        external 
        view 
        returns (address[] memory) 
    {
        return companyEmployees[_companyAddress];
    }
    
    // Получение зарплаты сотрудника
    function getEmployeeSalary(address _companyAddress, address _employeeAddress) 
        external 
        view 
        returns (uint256 totalSalary) 
    {
        Employee storage employee = employees[_companyAddress][_employeeAddress];
        return employee.baseSalary + employee.kpiBonus + employee.taskBonus;
    }
}
