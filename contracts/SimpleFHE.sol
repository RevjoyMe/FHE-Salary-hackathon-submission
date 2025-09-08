// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract SimpleFHE {
    euint64 private salary;
    
    event SalarySet(euint64 newSalary);
    event SalaryPaid(address employee, euint64 amount);
    
    function setSalary(euint64 _salary) external {
        salary = _salary;
        emit SalarySet(_salary);
    }
    
    function getSalary() external view returns (euint64) {
        return salary;
    }
    
    function paySalary(address employee) external {
        emit SalaryPaid(employee, salary);
    }
}
