import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDoctors, addDoctor, clearDoctorError } from "../../store/doctors/actions";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Form,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { useToast } from "../../components/Common/ToastContext";

const filterOptions = {
  specialty: [
    "All specialties",
    "Orthodontist",
    "General Dentist",
    "Oral Surgeon",
    "Pediatric Dentist",
    "Periodontist",
    "Prosthodontist",
  ],
  practice: ["All practices", "Smileie UK", "Smileie US", "Smileie AU"],
  status: ["All", "Active", "Inactive"],
};

const filterLabels = {
  specialty: "Specialty",
  practice: "Practice",
  status: "Status",
};

const columns = [
  {
    name: "DOCTOR NAME",
    selector: (row) => row.full_name,
    cell: (row) => (
      <div className="cell-content">
        <div className="fw-bold">{row.full_name}</div>
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.specialty}
        </div>
      </div>
    ),
    sortable: true,
    minWidth: "200px",
  },
  {
    name: "EMAIL",
    selector: (row) => row.email,
    sortable: true,
    minWidth: "200px",
  },
  {
    name: "PHONE",
    selector: (row) => row.phone,
    sortable: true,
    minWidth: "150px",
  },
  {
    name: "PRACTICE",
    selector: (row) => row.practice,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "LATEST ACTIVITY",
    selector: (row) => row.latestActivity,
    sortable: true,
    minWidth: "180px",
  },
];

const customStyles = {
  rows: {
    style: {
      minHeight: "56px",
      paddingTop: "8px",
      paddingBottom: "8px",
      cursor: "pointer",
    },
  },
  headCells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontWeight: "bold",
      fontSize: "0.9rem",
      backgroundColor: "#f8f9fa",
      color: "#495057",
      borderBottom: "2px solid #e9ecef",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "0.85rem",
      verticalAlign: "middle",
      margin: "4px 0",
    },
  },
};

const DoctorsList = ({ pageTitle = "Doctors" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showToast = useToast();

  // Redux state selectors
  const doctorsData = useSelector((state) => state.doctor);
  const {
    doctors: allDoctors = [],
    loading = false,
    error = null,
    success = false,
    successMessage = null,
  } = doctorsData;

  // Local state for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [createDoctorModal, setCreateDoctorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    specialty: "All specialties",
    practice: "All practices",
    status: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const initialFormState = {
    full_name: "",
    specialty: "",
    email: "",
    phone: "",
    practice: "",
    status: "Active",
  };
  const [form, setForm] = useState(initialFormState);

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter and search logic - frontend only
  const filteredDoctors = useMemo(() => {
    let filtered = [...allDoctors];

    // Apply specialty filter
    if (filters.specialty !== "All specialties") {
      filtered = filtered.filter((doctor) => doctor.specialty === filters.specialty);
    }

    // Apply practice filter
    if (filters.practice !== "All practices") {
      filtered = filtered.filter((doctor) => doctor.practice === filters.practice);
    }

    // Apply status filter
    if (filters.status !== "All") {
      filtered = filtered.filter((doctor) => doctor.status === filters.status);
    }

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (doctor) =>
          doctor.full_name?.toLowerCase().includes(searchLower) ||
          doctor.email?.toLowerCase().includes(searchLower) ||
          doctor.phone?.includes(searchLower) ||
          doctor.specialty?.toLowerCase().includes(searchLower) ||
          doctor.practice?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allDoctors, filters, debouncedSearchTerm]);

  // Handle pagination change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle per page change
  const handlePerRowsChange = useCallback((newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!form.full_name.trim()) {
      errors.full_name = "Doctor name is required";
    }

    if (!form.specialty) {
      errors.specialty = "Specialty is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.practice) {
      errors.practice = "Practice is required";
    }

    if (form.phone && !/^[\d\s\-\+\(\)]+$/.test(form.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const resetForm = useCallback(() => {
    setForm(initialFormState);
    setFormErrors({});
  }, []);

  const toggleCreateDoctor = useCallback(() => {
    setCreateDoctorModal((prev) => {
      if (prev) {
        // Closing modal - reset form
        resetForm();
      }
      return !prev;
    });
  }, [resetForm]);

  const fetchDoctors = useCallback(async () => {
    try {
      await dispatch(getDoctors({}));
    } catch (error) {
      console.error("Error fetching doctors:", error);
      showToast({
        message: error?.message || "Failed to fetch doctors",
        type: "error",
        title: "Error",
      });
    }
  }, [dispatch, showToast]);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
    window.scrollTo(0, 0); // Scroll to top like NotMonitored.js
  }, [fetchDoctors]);

  // Handle success/error states from Redux
  useEffect(() => {
    if (successMessage) {
      showToast({
        message: successMessage || "Doctor created successfully!",
        type: "success",
        title: "Success",
      });
      dispatch(clearDoctorError());
    }
  }, [successMessage, showToast, dispatch]);

  useEffect(() => {
    if (error) {
      showToast({
        message: typeof error === 'string' ? error : 'Failed to create doctor',
        type: 'error',
        title: 'Error',
      });
      dispatch(clearDoctorError());
    }
  }, [error, showToast, dispatch]);

  const handleFilterChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      const filterKey = id.replace("filter-", "");
      setFilters((prev) => ({ ...prev, [filterKey]: value }));
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset to first page when search changes
    },
    []
  );

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    // Clear specific field error when user starts typing
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  }, [formErrors]);

  const handleCreateDoctor = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await dispatch(addDoctor(form));
        toggleCreateDoctor();
        fetchDoctors();
        setCurrentPage(1); // Reset to first page
      } catch (error) {
        console.error("Error creating doctor:", error);
        showToast({
          message: error?.response?.data?.message || error?.message || "Failed to create doctor",
          type: "error",
          title: "Error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, form, validateForm, toggleCreateDoctor, fetchDoctors]
  );

  const handleRowClicked = useCallback(
    (row) => {
      if (!row.id) {
        console.warn("Doctor row missing ID:", row);
        return;
      }
      navigate(`/doctors/${row.id}`);
    },
    [navigate]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      specialty: "All specialties",
      practice: "All practices",
      status: "All",
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.specialty !== "All specialties" ||
      filters.practice !== "All practices" ||
      filters.status !== "All" ||
      debouncedSearchTerm.trim() !== ""
    );
  }, [filters, debouncedSearchTerm]);

  return (
    <div className="page-content no-navbar">
      <Container fluid>
        {/* Page Title and New Doctor Button */}
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={4} xs={6} className="text-end">
            {hasActiveFilters && (
              <Button
                color="outline-secondary"
                size="sm"
                className="me-2"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
            <Button color="primary" onClick={toggleCreateDoctor} disabled={isSubmitting}>
              + New doctor
            </Button>
          </Col>
        </Row>

        {/* Create Doctor Modal */}
        <Modal isOpen={createDoctorModal} toggle={toggleCreateDoctor} size="lg" centered>
          <ModalHeader toggle={toggleCreateDoctor}>
            <h4 className="modal-title">Create a new doctor</h4>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreateDoctor} noValidate>
              <Row>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="full_name">Doctor Name *</Label>
                    <Input
                      type="text"
                      id="full_name"
                      value={form.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter doctor's name"
                      invalid={!!formErrors.full_name} required
                    />
                    {formErrors.full_name && (
                      <div className="invalid-feedback d-block">
                        {formErrors.full_name}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="specialty">Specialty *</Label>
                    <Input
                      type="select"
                      id="specialty"
                      value={form.specialty}
                      onChange={handleInputChange}
                      invalid={!!formErrors.specialty}
                      required
                    >
                      <option value="">Select specialty</option>
                      {filterOptions.specialty.slice(1).map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </Input>
                    {formErrors.specialty && (
                      <div className="invalid-feedback d-block">
                        {formErrors.specialty}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      invalid={!!formErrors.email}
                      required
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback d-block">
                        {formErrors.email}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="phone">Phone</Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      invalid={!!formErrors.phone}
                    />
                    {formErrors.phone && (
                      <div className="invalid-feedback d-block">
                        {formErrors.phone}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="practice">Practice *</Label>
                    <Input
                      type="select"
                      id="practice"
                      value={form.practice}
                      onChange={handleInputChange}
                      invalid={!!formErrors.practice}
                      required
                    >
                      <option value="">Select practice</option>
                      {filterOptions.practice.slice(1).map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </Input>
                    {formErrors.practice && (
                      <div className="invalid-feedback d-block">
                        {formErrors.practice}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="status">Status</Label>
                    <Input
                      type="select"
                      id="status"
                      value={form.status}
                      onChange={handleInputChange}
                      required
                    >
                      {filterOptions.status.slice(1).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button
                  color="light"
                  className="me-2"
                  onClick={toggleCreateDoctor}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Creating...
                    </>
                  ) : (
                    "Create doctor"
                  )}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>

        <Card>
          <CardBody>   <div className="control-panel">
            {/* Search Bar */}
            <Row className="mb-3 align-items-center">
              <Col lg={3} md={4} sm={6} xs={12}>
                <label className="form-label" htmlFor="search">
                  Search Doctors
                </label>
                <div className="position-relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <Button
                      color="link"
                      size="sm"
                      className="position-absolute top-50 end-0 translate-middle-y pe-2"
                      onClick={handleClearSearch}
                      style={{ zIndex: 10 }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </Col>
              {Object.keys(filterOptions).map((key) => (
                <Col lg={2} md={3} sm={6} xs={12} key={key}>
                  <label className="form-label" htmlFor={`filter-${key}`}>
                    {filterLabels[key]}
                  </label>
                  <Input
                    id={`filter-${key}`}
                    type="select"
                    value={filters[key]}
                    onChange={handleFilterChange}
                  >
                    {filterOptions[key].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Input>
                </Col>
              ))}
            </Row>
          </div>

            {/* Data Table */}
            <DataTable
              columns={columns}
              data={filteredDoctors} // Fixed: Changed from filteredData to filteredDoctors
              pagination
              paginationServer={false}
              paginationTotalRows={filteredDoctors.length}
              paginationDefaultPage={currentPage}
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              highlightOnHover
              responsive
              customStyles={customStyles}
              progressPending={loading}
              progressComponent={
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading doctors...</p>
                </div>
              }
              noDataComponent={
                <div className="py-5 text-center">
                  <p className="text-muted mb-2">
                    {hasActiveFilters
                      ? "No doctors found matching your criteria"
                      : "No doctors found"}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      color="link"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              }
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default DoctorsList;