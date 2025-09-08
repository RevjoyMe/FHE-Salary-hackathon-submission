// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Определяем FHE типы вручную для совместимости
type euint64 is bytes32;

contract FHESalary {
    mapping(address => euint64) private salaries;
    mapping(address => bool) public employees;
    
    event EmployeeAdded(address employee);
    event SalarySet(address employee, euint64 salary);
    event SalaryPaid(address employee, euint64 amount);
    
    function addEmployee(address employee) external {
        employees[employee] = true;
        emit EmployeeAdded(employee);
    }
    
    function setSalary(address employee, euint64 _salary) external {
        require(employees[employee], "Not an employee");
        salaries[employee] = _salary;
        emit SalarySet(employee, _salary);
    }
    
    function getSalary(address employee) external view returns (euint64) {
        require(employees[employee], "Not an employee");
        return salaries[employee];
    }
    
    function paySalary(address employee) external {
        require(employees[employee], "Not an employee");
        euint64 salary = salaries[employee];
        emit SalaryPaid(employee, salary);
    }
}
