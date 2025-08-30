// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BasicFHE {
    // Простой контракт для тестирования FHE
    // Позже добавим FHE функциональность
    
    uint256 private salary;
    mapping(address => bool) public employees;
    
    event EmployeeAdded(address employee);
    event SalaryPaid(address employee, uint256 amount);
    
    function addEmployee(address employee) external {
        employees[employee] = true;
        emit EmployeeAdded(employee);
    }
    
    function setSalary(uint256 _salary) external {
        salary = _salary;
    }
    
    function getSalary() external view returns (uint256) {
        return salary;
    }
    
    function paySalary(address employee) external {
        require(employees[employee], "Not an employee");
        emit SalaryPaid(employee, salary);
    }
}
