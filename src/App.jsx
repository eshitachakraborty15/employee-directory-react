import { useEffect, useState } from "react";
import "./App.css";

const initialEmployees = [
  {
    id: 1,
    name: "Arjun Sen",
    employeeId: "EMP001",
    department: "Farm Management",
    gender: "Male",
    phone: "9876543210",
    localAddress: "Salt Lake, Kolkata",
    permanentAddress: "Siliguri, West Bengal",
  },
  {
    id: 2,
    name: "Maya Das",
    employeeId: "EMP002",
    department: "Agriculture",
    gender: "Female",
    phone: "9830123456",
    localAddress: "New Town, Kolkata",
    permanentAddress: "Durgapur, West Bengal",
  },
  {
    id: 3,
    name: "Rohan Roy",
    employeeId: "EMP003",
    department: "Maintenance",
    gender: "Male",
    phone: "9123456789",
    localAddress: "Ballygunge, Kolkata",
    permanentAddress: "Howrah, West Bengal",
  },
];

const emptyForm = {
  name: "",
  employeeId: "",
  department: "",
  gender: "",
  phone: "",
  localAddress: "",
  permanentAddress: "",
};

function App() {
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem("employees");

    return savedEmployees
      ? JSON.parse(savedEmployees)
      : initialEmployees;
  });

  const [formData, setFormData] = useState(emptyForm);

  const [searchTerm, setSearchTerm] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  // Save employees whenever the employee list changes
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  // Handle all form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Add or update employee
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.employeeId.trim() ||
      !formData.department ||
      !formData.gender ||
      !formData.phone.trim() ||
      !formData.localAddress.trim() ||
      !formData.permanentAddress.trim()
    ) {
      alert("Please fill in all employee details.");
      return;
    }

    if (editingId !== null) {
      setEmployees((previousEmployees) =>
        previousEmployees.map((employee) =>
          employee.id === editingId
            ? {
                ...employee,
                ...formData,
              }
            : employee
        )
      );

      setEditingId(null);
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
      };

      setEmployees((previousEmployees) => [
        ...previousEmployees,
        newEmployee,
      ]);
    }

    setFormData(emptyForm);
  };

  // Delete employee
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmed) {
      setEmployees((previousEmployees) =>
        previousEmployees.filter((employee) => employee.id !== id)
      );
    }
  };

  // Load employee details into form for editing
  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      gender: employee.gender,
      phone: employee.phone,
      localAddress: employee.localAddress,
      permanentAddress: employee.permanentAddress,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  // Clear form
  const handleClear = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  // Get unique departments
  const departments = [
    "All",
    ...new Set(employees.map((employee) => employee.department)),
  ];

  // Search + department filtering
  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(search) ||
      employee.employeeId.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search) ||
      employee.phone.includes(search);

    const matchesDepartment =
      departmentFilter === "All" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div>
          <p className="eyebrow">FARM MANAGEMENT SYSTEM</p>

          <h1>
            Employee <span>Directory</span>
          </h1>

          <p className="subtitle">
            Manage employee information in one place.
          </p>
        </div>

        <div className="header-icon">ED</div>
      </header>

      <main className="container">
        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>

            <div>
              <p>Total Employees</p>
              <h2>{employees.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔎</div>

            <div>
              <p>Showing</p>
              <h2>{filteredEmployees.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏢</div>

            <div>
              <p>Departments</p>
              <h2>{departments.length - 1}</h2>
            </div>
          </div>
        </section>

        {/* Add/Edit Form */}
        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <p className="section-label">
                {editingId !== null
                  ? "EDIT EMPLOYEE"
                  : "EMPLOYEE REGISTRATION"}
              </p>

              <h2>
                {editingId !== null
                  ? "Update Employee"
                  : "Add New Employee"}
              </h2>
            </div>

            {editingId !== null && (
              <button
                className="cancel-top"
                onClick={handleCancelEdit}
                type="button"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter employee name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Employee ID</label>

                <input
                  type="text"
                  name="employeeId"
                  placeholder="Example: EMP004"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Department</label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="Farm Management">
                    Farm Management
                  </option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Human Resources">
                    Human Resources
                  </option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div className="input-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="10 digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                />
              </div>

              <div className="input-group">
                <label>Local Address</label>

                <input
                  type="text"
                  name="localAddress"
                  placeholder="Current/local address"
                  value={formData.localAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group full-width">
                <label>Permanent Address</label>

                <textarea
                  name="permanentAddress"
                  placeholder="Enter permanent address"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                {editingId !== null
                  ? "✓ Update Employee"
                  : "+ Add Employee"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* Search and Filter */}
        <section className="panel directory-panel">
          <div className="directory-top">
            <div>
              <p className="section-label">EMPLOYEE RECORDS</p>

              <h2>Directory</h2>
            </div>

            <div className="controls">
              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>

              <select
                className="filter-select"
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
              >
                {departments.map((department) => (
                  <option
                    value={department}
                    key={department}
                  >
                    {department === "All"
                      ? "All Departments"
                      : department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Rendering */}
          {filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>

              <h3>No employees found</h3>

              <p>
                Try changing your search or department filter.
              </p>
            </div>
          ) : (
            <div className="employee-list">
              {filteredEmployees.map((employee) => (
                <article
                  className="employee-card"
                  key={employee.id}
                >
                  <div className="employee-main">
                    <div className="avatar">
                      {employee.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-title">
                      <h3>{employee.name}</h3>

                      <span>{employee.employeeId}</span>
                    </div>
                  </div>

                  <div className="employee-details">
                    <div className="detail">
                      <span className="detail-label">
                        Department
                      </span>

                      <strong>
                        {employee.department}
                      </strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Gender
                      </span>

                      <strong>{employee.gender}</strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Phone
                      </span>

                      <strong>{employee.phone}</strong>
                    </div>

                    <div className="detail">
                      <span className="detail-label">
                        Local Address
                      </span>

                      <strong>
                        {employee.localAddress}
                      </strong>
                    </div>

                    <div className="detail address-detail">
                      <span className="detail-label">
                        Permanent Address
                      </span>

                      <strong>
                        {employee.permanentAddress}
                      </strong>
                    </div>
                  </div>

                  <div className="employee-actions">
                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(employee)
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(employee.id)
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          Employee Directory • Built with React & useState
        </p>
      </footer>
    </div>
  );
}

export default App;