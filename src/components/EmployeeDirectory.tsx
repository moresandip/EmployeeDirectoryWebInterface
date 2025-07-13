import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Plus, Edit, Trash2, Users, ChevronLeft, ChevronRight, X, 
  Download, Upload, Eye, EyeOff, Check, AlertCircle, Calendar, Mail, 
  Phone, MapPin, Building, Award, Clock, RefreshCw, Star, Settings,
  ChevronDown, ChevronUp, Grid, List, SortAsc, SortDesc
} from 'lucide-react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  location: string;
  manager: string;
  skills: string[];
  performance: number; // 1-5 rating
  avatar?: string;
}

interface FilterState {
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  status: string;
  location: string;
  manager: string;
  salaryMin: string;
  salaryMax: string;
  hireDateFrom: string;
  hireDateTo: string;
  skills: string;
  performanceMin: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: string;
  salary?: string;
  hireDate?: string;
  status?: string;
  location?: string;
  manager?: string;
  skills?: string;
  performance?: string;
}

interface SortConfig {
  field: keyof Employee;
  direction: 'asc' | 'desc';
}

const DEPARTMENTS = [
  'Human Resources',
  'Information Technology',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Legal',
  'Customer Service',
  'Research & Development',
  'Quality Assurance'
];

const LOCATIONS = [
  'New York, NY',
  'San Francisco, CA',
  'Chicago, IL',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Remote',
  'London, UK',
  'Toronto, CA'
];

const SKILLS_LIST = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
  'Project Management', 'Leadership', 'Communication', 'Problem Solving',
  'Data Analysis', 'Machine Learning', 'Cloud Computing', 'DevOps',
  'UI/UX Design', 'Marketing Strategy', 'Sales', 'Customer Service',
  'Financial Analysis', 'Legal Research', 'Quality Assurance'
];

const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@company.com', 
    phone: '+1-555-0101',
    department: 'Information Technology', 
    role: 'Senior Developer',
    salary: 95000,
    hireDate: '2020-03-15',
    status: 'Active',
    location: 'San Francisco, CA',
    manager: 'Sarah Chen',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    performance: 4.5
  },
  { 
    id: 2, 
    firstName: 'Jane', 
    lastName: 'Smith', 
    email: 'jane.smith@company.com', 
    phone: '+1-555-0102',
    department: 'Human Resources', 
    role: 'HR Manager',
    salary: 75000,
    hireDate: '2019-01-20',
    status: 'Active',
    location: 'New York, NY',
    manager: 'Michael Johnson',
    skills: ['Leadership', 'Communication', 'Project Management'],
    performance: 4.8
  },
  { 
    id: 3, 
    firstName: 'Michael', 
    lastName: 'Johnson', 
    email: 'michael.johnson@company.com', 
    phone: '+1-555-0103',
    department: 'Finance', 
    role: 'Financial Analyst',
    salary: 68000,
    hireDate: '2021-06-10',
    status: 'Active',
    location: 'Chicago, IL',
    manager: 'Lisa Anderson',
    skills: ['Financial Analysis', 'Data Analysis', 'Excel'],
    performance: 4.2
  },
  { 
    id: 4, 
    firstName: 'Emily', 
    lastName: 'Brown', 
    email: 'emily.brown@company.com', 
    phone: '+1-555-0104',
    department: 'Marketing', 
    role: 'Marketing Coordinator',
    salary: 55000,
    hireDate: '2022-02-28',
    status: 'Active',
    location: 'Austin, TX',
    manager: 'David Wilson',
    skills: ['Marketing Strategy', 'Social Media', 'Content Creation'],
    performance: 4.0
  },
  { 
    id: 5, 
    firstName: 'David', 
    lastName: 'Wilson', 
    email: 'david.wilson@company.com', 
    phone: '+1-555-0105',
    department: 'Sales', 
    role: 'Sales Representative',
    salary: 62000,
    hireDate: '2020-11-05',
    status: 'Active',
    location: 'Seattle, WA',
    manager: 'Amanda Thomas',
    skills: ['Sales', 'Customer Service', 'Negotiation'],
    performance: 4.3
  },
  { 
    id: 6, 
    firstName: 'Sarah', 
    lastName: 'Davis', 
    email: 'sarah.davis@company.com', 
    phone: '+1-555-0106',
    department: 'Operations', 
    role: 'Operations Manager',
    salary: 82000,
    hireDate: '2018-09-12',
    status: 'Active',
    location: 'Boston, MA',
    manager: 'Robert Miller',
    skills: ['Operations Management', 'Process Improvement', 'Leadership'],
    performance: 4.7
  },
  { 
    id: 7, 
    firstName: 'Robert', 
    lastName: 'Miller', 
    email: 'robert.miller@company.com', 
    phone: '+1-555-0107',
    department: 'Information Technology', 
    role: 'DevOps Engineer',
    salary: 88000,
    hireDate: '2019-07-22',
    status: 'Active',
    location: 'Remote',
    manager: 'Sarah Chen',
    skills: ['DevOps', 'Cloud Computing', 'Docker', 'Kubernetes'],
    performance: 4.4
  },
  { 
    id: 8, 
    firstName: 'Lisa', 
    lastName: 'Anderson', 
    email: 'lisa.anderson@company.com', 
    phone: '+1-555-0108',
    department: 'Human Resources', 
    role: 'Recruiter',
    salary: 58000,
    hireDate: '2021-04-18',
    status: 'On Leave',
    location: 'New York, NY',
    manager: 'Jane Smith',
    skills: ['Recruiting', 'Communication', 'Interviewing'],
    performance: 4.1
  },
  { 
    id: 9, 
    firstName: 'James', 
    lastName: 'Taylor', 
    email: 'james.taylor@company.com', 
    phone: '+1-555-0109',
    department: 'Finance', 
    role: 'Accountant',
    salary: 61000,
    hireDate: '2020-08-30',
    status: 'Active',
    location: 'Chicago, IL',
    manager: 'Michael Johnson',
    skills: ['Accounting', 'Financial Analysis', 'Tax Preparation'],
    performance: 4.0
  },
  { 
    id: 10, 
    firstName: 'Amanda', 
    lastName: 'Thomas', 
    email: 'amanda.thomas@company.com', 
    phone: '+1-555-0110',
    department: 'Marketing', 
    role: 'Digital Marketing Specialist',
    salary: 59000,
    hireDate: '2021-12-01',
    status: 'Active',
    location: 'Austin, TX',
    manager: 'Emily Brown',
    skills: ['Digital Marketing', 'SEO', 'Analytics', 'PPC'],
    performance: 4.2
  },
  // Additional IT employees
  { 
    id: 11, 
    firstName: 'Alex', 
    lastName: 'Rodriguez', 
    email: 'alex.rodriguez@company.com', 
    phone: '+1-555-0111',
    department: 'Information Technology', 
    role: 'Frontend Developer',
    salary: 78000,
    hireDate: '2021-03-10',
    status: 'Active',
    location: 'San Francisco, CA',
    manager: 'Sarah Chen',
    skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
    performance: 4.3
  },
  { 
    id: 12, 
    firstName: 'Maria', 
    lastName: 'Garcia', 
    email: 'maria.garcia@company.com', 
    phone: '+1-555-0112',
    department: 'Information Technology', 
    role: 'Backend Developer',
    salary: 85000,
    hireDate: '2020-05-25',
    status: 'Active',
    location: 'Remote',
    manager: 'Sarah Chen',
    skills: ['Python', 'Django', 'PostgreSQL', 'API Development'],
    performance: 4.6
  },
  { 
    id: 13, 
    firstName: 'Kevin', 
    lastName: 'Chen', 
    email: 'kevin.chen@company.com', 
    phone: '+1-555-0113',
    department: 'Information Technology', 
    role: 'Data Scientist',
    salary: 105000,
    hireDate: '2019-11-08',
    status: 'Active',
    location: 'Seattle, WA',
    manager: 'Sarah Chen',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
    performance: 4.8
  },
  { 
    id: 14, 
    firstName: 'Rachel', 
    lastName: 'Thompson', 
    email: 'rachel.thompson@company.com', 
    phone: '+1-555-0114',
    department: 'Information Technology', 
    role: 'UI/UX Designer',
    salary: 72000,
    hireDate: '2022-01-15',
    status: 'Active',
    location: 'San Francisco, CA',
    manager: 'Sarah Chen',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    performance: 4.4
  },
  { 
    id: 15, 
    firstName: 'Daniel', 
    lastName: 'Kim', 
    email: 'daniel.kim@company.com', 
    phone: '+1-555-0115',
    department: 'Information Technology', 
    role: 'System Administrator',
    salary: 70000,
    hireDate: '2020-10-12',
    status: 'Active',
    location: 'Boston, MA',
    manager: 'Sarah Chen',
    skills: ['Linux', 'Windows Server', 'Network Administration', 'Security'],
    performance: 4.2
  },
  // Additional employees for other departments
  { 
    id: 16, 
    firstName: 'Sophie', 
    lastName: 'Williams', 
    email: 'sophie.williams@company.com', 
    phone: '+1-555-0116',
    department: 'Quality Assurance', 
    role: 'QA Engineer',
    salary: 65000,
    hireDate: '2021-08-20',
    status: 'Active',
    location: 'Remote',
    manager: 'Thomas Anderson',
    skills: ['Quality Assurance', 'Test Automation', 'Selenium', 'JIRA'],
    performance: 4.1
  },
  { 
    id: 17, 
    firstName: 'Marcus', 
    lastName: 'Brown', 
    email: 'marcus.brown@company.com', 
    phone: '+1-555-0117',
    department: 'Information Technology', 
    role: 'Security Analyst',
    salary: 92000,
    hireDate: '2019-04-03',
    status: 'Active',
    location: 'New York, NY',
    manager: 'Sarah Chen',
    skills: ['Cybersecurity', 'Penetration Testing', 'Risk Assessment', 'CISSP'],
    performance: 4.7
  },
  { 
    id: 18, 
    firstName: 'Elena', 
    lastName: 'Petrov', 
    email: 'elena.petrov@company.com', 
    phone: '+1-555-0118',
    department: 'Information Technology', 
    role: 'Database Administrator',
    salary: 80000,
    hireDate: '2020-12-07',
    status: 'Active',
    location: 'Chicago, IL',
    manager: 'Sarah Chen',
    skills: ['SQL', 'Oracle', 'MySQL', 'Database Design'],
    performance: 4.3
  },
  { 
    id: 19, 
    firstName: 'Thomas', 
    lastName: 'Anderson', 
    email: 'thomas.anderson@company.com', 
    phone: '+1-555-0119',
    department: 'Information Technology', 
    role: 'Cloud Architect',
    salary: 115000,
    hireDate: '2018-06-14',
    status: 'Active',
    location: 'Seattle, WA',
    manager: 'Sarah Chen',
    skills: ['AWS', 'Azure', 'Cloud Architecture', 'Microservices'],
    performance: 4.9
  },
  { 
    id: 20, 
    firstName: 'Priya', 
    lastName: 'Patel', 
    email: 'priya.patel@company.com', 
    phone: '+1-555-0120',
    department: 'Information Technology', 
    role: 'Mobile Developer',
    salary: 83000,
    hireDate: '2021-09-22',
    status: 'Active',
    location: 'Austin, TX',
    manager: 'Sarah Chen',
    skills: ['React Native', 'iOS', 'Android', 'Flutter'],
    performance: 4.4
  }
];

const EmployeeDirectory: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'firstName', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<number>>(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    firstName: '',
    lastName: '',
    department: '',
    role: '',
    status: '',
    location: '',
    manager: '',
    salaryMin: '',
    salaryMax: '',
    hireDateFrom: '',
    hireDateTo: '',
    skills: '',
    performanceMin: ''
  });
  
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    salary: 0,
    hireDate: '',
    status: 'Active',
    location: '',
    manager: '',
    skills: [],
    performance: 3
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
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
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.department) {
      errors.department = 'Department is required';
    }
    
    if (!formData.role.trim()) {
      errors.role = 'Role is required';
    }

    if (!formData.salary || formData.salary <= 0) {
      errors.salary = 'Valid salary is required';
    }

    if (!formData.hireDate) {
      errors.hireDate = 'Hire date is required';
    }

    if (!formData.location) {
      errors.location = 'Location is required';
    }

    if (!formData.manager.trim()) {
      errors.manager = 'Manager is required';
    }

    if (formData.skills.length === 0) {
      errors.skills = 'At least one skill is required';
    }

    if (!formData.performance || formData.performance < 1 || formData.performance > 5) {
      errors.performance = 'Performance rating must be between 1 and 5';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced filtering and sorting
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(searchLower) ||
        employee.lastName.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.role.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.location.toLowerCase().includes(searchLower) ||
        employee.manager.toLowerCase().includes(searchLower) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    // Apply advanced filters
    if (filters.firstName) {
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    }
    if (filters.lastName) {
      result = result.filter(employee =>
        employee.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
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
    if (filters.status) {
      result = result.filter(employee => employee.status === filters.status);
    }
    if (filters.location) {
      result = result.filter(employee => employee.location === filters.location);
    }
    if (filters.manager) {
      result = result.filter(employee =>
        employee.manager.toLowerCase().includes(filters.manager.toLowerCase())
      );
    }
    if (filters.salaryMin) {
      result = result.filter(employee => employee.salary >= parseInt(filters.salaryMin));
    }
    if (filters.salaryMax) {
      result = result.filter(employee => employee.salary <= parseInt(filters.salaryMax));
    }
    if (filters.hireDateFrom) {
      result = result.filter(employee => employee.hireDate >= filters.hireDateFrom);
    }
    if (filters.hireDateTo) {
      result = result.filter(employee => employee.hireDate <= filters.hireDateTo);
    }
    if (filters.skills) {
      result = result.filter(employee =>
        employee.skills.some(skill => 
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }
    if (filters.performanceMin) {
      result = result.filter(employee => employee.performance >= parseFloat(filters.performanceMin));
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

    return result;
  }, [employees, searchTerm, filters, sortConfig]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

  // Notification system
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Employee management functions
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      salary: 0,
      hireDate: '',
      status: 'Active',
      location: '',
      manager: '',
      skills: [],
      performance: 3
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
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      salary: employee.salary,
      hireDate: employee.hireDate,
      status: employee.status,
      location: employee.location,
      manager: employee.manager,
      skills: employee.skills,
      performance: employee.performance
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
      showNotification('success', `Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} has been deleted.`);
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
      showNotification('success', `Employee ${formData.firstName} ${formData.lastName} has been updated.`);
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...formData
      };
      setEmployees([...employees, newEmployee]);
      showNotification('success', `Employee ${formData.firstName} ${formData.lastName} has been added.`);
    }

    setShowForm(false);
    setEditingEmployee(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      salary: 0,
      hireDate: '',
      status: 'Active',
      location: '',
      manager: '',
      skills: [],
      performance: 3
    });
    setFormErrors({});
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    resetForm();
  };

  // Bulk operations
  const handleSelectEmployee = (employeeId: number) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === paginatedEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(paginatedEmployees.map(emp => emp.id)));
    }
  };

  const handleBulkDelete = () => {
    setEmployees(employees.filter(emp => !selectedEmployees.has(emp.id)));
    setSelectedEmployees(new Set());
    showNotification('success', `${selectedEmployees.size} employees have been deleted.`);
  };

  const handleBulkStatusUpdate = (status: Employee['status']) => {
    setEmployees(employees.map(emp => 
      selectedEmployees.has(emp.id) ? { ...emp, status } : emp
    ));
    setSelectedEmployees(new Set());
    showNotification('success', `${selectedEmployees.size} employees status updated to ${status}.`);
  };

  // Sorting
  const handleSort = (field: keyof Employee) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter management
  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
    showNotification('info', 'Filters applied successfully.');
  };

  const clearFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      department: '',
      role: '',
      status: '',
      location: '',
      manager: '',
      salaryMin: '',
      salaryMax: '',
      hireDateFrom: '',
      hireDateTo: '',
      skills: '',
      performanceMin: ''
    });
    setCurrentPage(1);
    showNotification('info', 'All filters cleared.');
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Role', 'Salary', 'Hire Date', 'Status', 'Location', 'Manager', 'Skills', 'Performance'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedEmployees.map(emp => [
        emp.id,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone,
        emp.department,
        emp.role,
        emp.salary,
        emp.hireDate,
        emp.status,
        emp.location,
        emp.manager,
        emp.skills.join(';'),
        emp.performance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('success', 'Employee data exported successfully.');
  };

  // Utility functions
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <Check className="h-5 w-5" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {notification.type === 'info' && <AlertCircle className="h-5 w-5" />}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
                <p className="text-sm text-gray-500">{filteredAndSortedEmployees.length} employees</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          <div className="space-y-6">
            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 items-center flex-wrap">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {Object.values(filters).some(f => f) && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {Object.values(filters).filter(f => f).length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4" />
                  Advanced
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {selectedEmployees.size > 0 && (
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Users className="h-4 w-4" />
                    Bulk Actions ({selectedEmployees.size})
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.salaryMin}
                        onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.salaryMax}
                        onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={filters.hireDateFrom}
                        onChange={(e) => setFilters({ ...filters, hireDateFrom: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="date"
                        value={filters.hireDateTo}
                        onChange={(e) => setFilters({ ...filters, hireDateTo: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Performance</label>
                    <select
                      value={filters.performanceMin}
                      onChange={(e) => setFilters({ ...filters, performanceMin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any Rating</option>
                      <option value="1">1+ Stars</option>
                      <option value="2">2+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {showBulkActions && selectedEmployees.size > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedEmployees.size} employee(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate('Active')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Mark Active
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('Inactive')}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Mark Inactive
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('On Leave')}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                    >
                      Mark On Leave
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sorting Header (for list view) */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.size === paginatedEmployees.length && paginatedEmployees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort('firstName')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Name
                      {sortConfig.field === 'firstName' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Email
                      {sortConfig.field === 'email' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort('department')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Department
                      {sortConfig.field === 'department' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Role
                      {sortConfig.field === 'role' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Status
                      {sortConfig.field === 'status' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
            )}

            {/* Employee Display */}
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
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
                        <input
                          type="checkbox"
                          checked={selectedEmployees.has(employee.id)}
                          onChange={() => handleSelectEmployee(employee.id)}
                          className="rounded border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{employee.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{employee.role}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{employee.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formatDate(employee.hireDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                        <div className="flex items-center gap-1">
                          {getPerformanceStars(employee.performance)}
                          <span className="text-sm text-gray-600 ml-1">{employee.performance}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Salary</p>
                        <p className="text-lg font-semibold text-green-600">{formatSalary(employee.salary)}</p>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {employee.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {employee.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{employee.skills.length - 3} more
                            </span>
                          )}
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
            ) : (
              /* List View */
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {paginatedEmployees.map((employee) => (
                  <div key={employee.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.has(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(employee.firstName, employee.lastName)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-gray-500">ID: {employee.id}</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="text-sm text-gray-900">{employee.email}</p>
                        <p className="text-sm text-gray-500">{employee.phone}</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <p className="text-sm text-gray-900">{employee.department}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="text-sm text-gray-900">{employee.role}</p>
                        <p className="text-sm text-gray-500">{formatSalary(employee.salary)}</p>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
          /* Enhanced Add/Edit Form */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
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

            <form onSubmit={handleSubmitForm} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
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

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
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

                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <input
                      type="number"
                      id="salary"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.salary ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.salary && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Hire Date *
                    </label>
                    <input
                      type="date"
                      id="hireDate"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.hireDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.hireDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.hireDate}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.status ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    {formErrors.status && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <select
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Location</option>
                      {LOCATIONS.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    {formErrors.location && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
                      Manager *
                    </label>
                    <input
                      type="text"
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.manager ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.manager && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.manager}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="performance" className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Rating *
                    </label>
                    <select
                      id="performance"
                      value={formData.performance}
                      onChange={(e) => setFormData({ ...formData, performance: parseFloat(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.performance ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={3}>3 - Average</option>
                      <option value={4}>4 - Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                    {formErrors.performance && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.performance}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {SKILLS_LIST.map(skill => (
                    <label key={skill} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, skills: [...formData.skills, skill] });
                          } else {
                            setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
                {formErrors.skills && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.skills}</p>
                )}
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

      {/* Enhanced Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filter Employees</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={filters.lastName}
                    onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                    placeholder="Filter by last name"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {LOCATIONS.map(location => (
                      <option key={location} value={location}>{location}</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                  <input
                    type="text"
                    value={filters.manager}
                    onChange={(e) => setFilters({ ...filters, manager: e.target.value })}
                    placeholder="Filter by manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <input
                    type="text"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                    placeholder="Filter by skills"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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