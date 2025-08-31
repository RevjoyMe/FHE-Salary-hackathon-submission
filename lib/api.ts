// API Configuration for Salary System
export const API_CONFIG = {
  // Backend URLs
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8545', // Локальный Hardhat
  
  // Contract addresses
  CONTRACT_ADDRESSES: {
    LOCAL: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Hardhat default
    SEPOLIA: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  },
  
  // Network IDs
  NETWORKS: {
    HARDHAT: 31337,
    SEPOLIA: 11155111,
  },
  
  // API endpoints
  ENDPOINTS: {
    // Contract functions
    REGISTER_COMPANY: '/api/company/register',
    ADD_EMPLOYEE: '/api/employee/add',
    PAY_SALARY: '/api/salary/pay',
    GET_EMPLOYEE_INFO: '/api/employee/info',
    GET_COMPANY_INFO: '/api/company/info',
    GET_COMPANY_EMPLOYEES: '/api/company/employees',
    DEACTIVATE_EMPLOYEE: '/api/employee/deactivate',
  },
};

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Company types
export interface Company {
  address: string;
  name: string;
  totalPayroll: string; // encrypted
  employeeCount: number;
}

// Employee types
export interface Employee {
  address: string;
  salary: string; // encrypted
  isActive: boolean;
  lastPaymentDate?: string;
}

// API functions
export class SalaryApi {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BACKEND_URL;
  }
  
  // Helper function to make API calls
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Company management
  async registerCompany(name: string, userAddress: string): Promise<ApiResponse<Company>> {
    return this.makeRequest<Company>(API_CONFIG.ENDPOINTS.REGISTER_COMPANY, {
      method: 'POST',
      body: JSON.stringify({ name, userAddress }),
    });
  }
  
  async getCompanyInfo(address: string): Promise<ApiResponse<Company>> {
    return this.makeRequest<Company>(`${API_CONFIG.ENDPOINTS.GET_COMPANY_INFO}?address=${address}`);
  }
  
  // Employee management
  async addEmployee(
    employeeAddress: string,
    encryptedSalary: string,
    salaryProof: string,
    companyAddress: string
  ): Promise<ApiResponse<Employee>> {
    return this.makeRequest<Employee>(API_CONFIG.ENDPOINTS.ADD_EMPLOYEE, {
      method: 'POST',
      body: JSON.stringify({
        employeeAddress,
        encryptedSalary,
        salaryProof,
        companyAddress,
      }),
    });
  }
  
  async getEmployeeInfo(address: string): Promise<ApiResponse<Employee>> {
    return this.makeRequest<Employee>(`${API_CONFIG.ENDPOINTS.GET_EMPLOYEE_INFO}?address=${address}`);
  }
  
  async getCompanyEmployees(companyAddress: string): Promise<ApiResponse<Employee[]>> {
    return this.makeRequest<Employee[]>(`${API_CONFIG.ENDPOINTS.GET_COMPANY_EMPLOYEES}?address=${companyAddress}`);
  }
  
  async deactivateEmployee(employeeAddress: string, companyAddress: string): Promise<ApiResponse<boolean>> {
    return this.makeRequest<boolean>(API_CONFIG.ENDPOINTS.DEACTIVATE_EMPLOYEE, {
      method: 'POST',
      body: JSON.stringify({ employeeAddress, companyAddress }),
    });
  }
  
  // Salary management
  async paySalary(employeeAddress: string, companyAddress: string, amount: string): Promise<ApiResponse<boolean>> {
    return this.makeRequest<boolean>(API_CONFIG.ENDPOINTS.PAY_SALARY, {
      method: 'POST',
      body: JSON.stringify({ employeeAddress, companyAddress, amount }),
    });
  }
}

// Export singleton instance
export const salaryApi = new SalaryApi();
