import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
}

interface FilterState {
  firstName: string;
  department: string;
  role: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  role?: string;
}

const DEPARTMENTS = [
  'Human Resources',
  'Information Technology',
  'Finance',
  'Marketing',
  'Sales',
  'Operations'
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com', department: 'Information Technology', role: 'Senior Developer' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@company.com', department: 'Human Resources', role: 'HR Manager' },
  { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael.johnson@company.com', department: 'Finance', role: 'Financial Analyst' },
  { id: 4, firstName: 'Emily', lastName: 'Brown', email: 'emily.brown@company.com', department: 'Marketing', role: 'Marketing Coordinator' },
  { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@company.com', department: 'Sales', role: 'Sales Representative' },
  { id: 6, firstName: 'Sarah', lastName: 'Davis', email: 'sarah.davis@company.com', department: 'Operations', role: 'Operations Manager' },
  { id: 7, firstName: 'Robert', lastName: 'Miller', email: 'robert.miller@company.com', department: 'Information Technology', role: 'DevOps Engineer' },
  { id: 8, firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@company.com', department: 'Human Resources', role: 'Recruiter' },
  { id: 9, firstName: 'James', lastName: 'Taylor', email: 'james.taylor@company.com', department: 'Finance', role: 'Accountant' },
  { id: 10, firstName: 'Amanda', lastName: 'Thomas', email: 'amanda.thomas@company.com', department: 'Marketing', role: 'Digital Marketing Specialist' },
  { id: 11, firstName: 'Christopher', lastName: 'Jackson', email: 'chris.jackson@company.com', department: 'Sales', role: 'Sales Manager' },
  { id: 12, firstName: 'Jennifer', lastName: 'White', email: 'jennifer.white@company.com', department: 'Operations', role: 'Supply Chain Coordinator' },
  { id: 13, firstName: 'Alex', lastName: 'Rodriguez', email: 'alex.rodriguez@company.com', department: 'Information Technology', role: 'Frontend Developer' },
  { id: 14, firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@company.com', department: 'Information Technology', role: 'Backend Developer' },
  { id: 15, firstName: 'Kevin', lastName: 'Chen', email: 'kevin.chen@company.com', department: 'Information Technology', role: 'Data Scientist' },
  { id: 16, firstName: 'Rachel', lastName: 'Thompson', email: 'rachel.thompson@company.com', department: 'Information Technology', role: 'UI/UX Designer' },
  { id: 17, firstName: 'Daniel', lastName: 'Kim', email: 'daniel.kim@company.com', department: 'Information Technology', role: 'System Administrator' },
  { id: 18, firstName: 'Sophie', lastName: 'Williams', email: 'sophie.williams@company.com', department: 'Information Technology', role: 'QA Engineer' },
  { id: 19, firstName: 'Marcus', lastName: 'Brown', email: 'marcus.brown@company.com', department: 'Information Technology', role: 'Security Analyst' },
  { id: 20, firstName: 'Elena', lastName: 'Petrov', email: 'elena.petrov@company.com', department: 'Information Technology', role: 'Database Administrator' },
  { id: 21, firstName: 'Thomas', lastName: 'Anderson', email: 'thomas.anderson@company.com', department: 'Information Technology', role: 'Cloud Architect' },
  { id: 22, firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@company.com', department: 'Information Technology', role: 'Mobile Developer' },
  { id: 23, firstName: 'Carlos', lastName: 'Mendez', email: 'carlos.mendez@company.com', department: 'Information Technology', role: 'Machine Learning Engineer' },
  { id: 24, firstName: 'Anna', lastName: 'Kowalski', email: 'anna.kowalski@company.com', department: 'Information Technology', role: 'Product Manager' },
  { id: 25, firstName: 'Ryan', lastName: 'O\'Connor', email: 'ryan.oconnor@company.com', department: 'Information Technology', role: 'Technical Lead' }
];

const EmployeeDirectory: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    firstName: '',
    department: '',
    role: ''
  });
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    
    if (!formData.role.trim()) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.firstName) {
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    }
    if (filters.department) {
      result = result.filter(employee => employee.department === filters.department);
    }
    if (filters.role) {
      result = result.filter(employee =>
        employee.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const [field, direction] = sortBy.split('-');
        const aValue = field === 'firstName' ? a.firstName : a.department;
        const bValue = field === 'firstName' ? b.firstName : b.department;
        
        if (direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return result;
  }, [employees, searchTerm, filters, sortBy]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: ''
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      role: employee.role
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...editingEmployee, ...formData }
          : emp
      ));
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...formData
      };
      setEmployees([...employees, newEmployee]);
    }

    setShowForm(false);
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: ''
    });
    setFormErrors({});
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: ''
    });
    setFormErrors({});
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setFilters({
      firstName: '',
      department: '',
      role: ''
    });
    setCurrentPage(1);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
            </div>
            <button
              onClick={handleAddEmployee}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sort by...</option>
                  <option value="firstName-asc">First Name (A-Z)</option>
                  <option value="firstName-desc">First Name (Z-A)</option>
                  <option value="department-asc">Department (A-Z)</option>
                  <option value="department-desc">Department (Z-A)</option>
                </select>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {getInitials(employee.firstName, employee.lastName)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {employee.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Email</span>
                        <span className="text-sm text-gray-900">{employee.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Department</span>
                        <span className="text-sm text-gray-900">{employee.department}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600 font-medium">Role</span>
                        <span className="text-sm text-gray-900">{employee.role}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredAndSortedEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-500 mb-4">No employees match your current search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    clearFilters();
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredAndSortedEmployees.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedEmployees.length)} of {filteredAndSortedEmployees.length} employees
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Add/Edit Form */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button
                onClick={handleCancelForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <Users className="h-5 w-5" />
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filter Employees</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={filters.firstName}
                  onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                  placeholder="Filter by first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  placeholder="Filter by role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {employeeToDelete.firstName} {employeeToDelete.lastName}
                </h4>
                <p className="text-sm text-gray-600">
                  {employeeToDelete.email}
                </p>
                <p className="text-sm text-gray-600">
                  {employeeToDelete.department} - {employeeToDelete.role}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;