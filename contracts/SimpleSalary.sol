// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleSalary {
    mapping(address => uint256) private salaries;
    mapping(address => bool) public employees;
    
    event EmployeeAdded(address employee);
    event SalarySet(address employee, uint256 salary);
    event SalaryPaid(address employee, uint256 amount);
    
    function addEmployee(address employee) external {
        employees[employee] = true;
        emit EmployeeAdded(employee);
    }
    
    function setSalary(address employee, uint256 _salary) external {
        require(employees[employee], "Not an employee");
        salaries[employee] = _salary;
        emit SalarySet(employee, _salary);
    }
    
    function getSalary(address employee) external view returns (uint256) {
        require(employees[employee], "Not an employee");
        return salaries[employee];
    }
    
    function paySalary(address employee) external payable {
        require(employees[employee], "Not an employee");
        uint256 salary = salaries[employee];
        require(msg.value >= salary, "Insufficient payment");
        
        // Transfer salary to employee
        payable(employee).transfer(salary);
        
        // Refund excess
        if (msg.value > salary) {
            payable(msg.sender).transfer(msg.value - salary);
        }
        
        emit SalaryPaid(employee, salary);
    }
}
