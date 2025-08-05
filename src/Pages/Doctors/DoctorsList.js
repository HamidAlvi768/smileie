import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDoctors, addDoctor, clearDoctorError } from "../../store/doctors/actions";
import { getSpecialties, getPractices } from "../../store/genericRecords/actions";
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

// Filter options will be populated from API data
const getFilterOptions = (specialties, practices) => ({
  specialty: ["All specialties", ...specialties.map(spec => spec.title)],
  practice: ["All practices", ...practices.map(prac => prac.title)],
});

const filterLabels = {
  specialty: "Specialty",
  practice: "Practice",
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
    name: "PATIENTS",
    selector: (row) => row.patient_count || 0,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="fw-bold" style={{ color: "#1da5fe" }}>
          {row.patient_count || 0}
        </div>
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          patients
        </div>
      </div>
    ),
    minWidth: "120px",
  },
  {
    name: "LATEST ACTIVITY",
    selector: (row) => row.latestActivity,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.latestActivityTime}
        </div>
        <div>{row.latestActivity}</div>
      </div>
    ),
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

  // Generic records state
  const genericRecordsData = useSelector((state) => {
    console.log('Redux state accessed:', state.genericRecords);
    return state.genericRecords;
  });
  const {
    specialties = [],
    practices = [],
    specialtiesLoading = false,
    practicesLoading = false,
    error: genericRecordsError = null
  } = genericRecordsData;

  // Local state for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [createDoctorModal, setCreateDoctorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    specialty: "All specialties",
    practice: "All practices",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const initialFormState = {
    full_name: "",
    specialty: "",
    email: "",
    phone: "",
    practice: "",
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

  // Process doctors data to handle latest_activity
  const processedDoctors = useMemo(() => {
    return allDoctors.map(doctor => {
      let latestActivity = "No activity";
      let latestActivityTime = "";

      if (doctor.latest_activity) {
        if (typeof doctor.latest_activity === 'object' && doctor.latest_activity !== null) {
          // Handle object format with detailed activity
          latestActivity = doctor.latest_activity.description || doctor.latest_activity.action || "Activity";
          latestActivityTime = doctor.latest_activity.created_at || "";
        } else if (typeof doctor.latest_activity === 'string') {
          // Handle string format (e.g., "Account created")
          latestActivity = doctor.latest_activity;
          latestActivityTime = doctor.created_at || ""; // Use account creation time as fallback
        }
      }

      return {
        ...doctor,
        latestActivity,
        latestActivityTime
      };
    });
  }, [allDoctors.length]); // Only recalculate when doctors array length changes

  // Filter and search logic - frontend only
  const filteredDoctors = useMemo(() => {
    let filtered = [...processedDoctors];

    // Apply specialty filter
    if (filters.specialty !== "All specialties") {
      filtered = filtered.filter((doctor) => doctor.specialty === filters.specialty);
    }

    // Apply practice filter
    if (filters.practice !== "All practices") {
      filtered = filtered.filter((doctor) => doctor.practice === filters.practice);
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
  }, [processedDoctors, filters.specialty, filters.practice, debouncedSearchTerm]);

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



  // Only fetch once on component mount
  useEffect(() => {
    console.log('Component mounted - fetching data...');
    console.log('Dispatching getSpecialties action...');
    console.log('Dispatching getPractices action...');
    fetchDoctors();
    dispatch(getSpecialties());
    dispatch(getPractices());
    window.scrollTo(0, 0);
  }, []); // Empty dependency array - only run once

  // Debug effect to log state changes (only when data changes, not on every render)
  useEffect(() => {
    console.log('=== REDUX STATE DEBUG ===');
    console.log('Specialties:', specialties);
    console.log('Practices:', practices);
    console.log('Specialties Loading:', specialtiesLoading);
    console.log('Practices Loading:', practicesLoading);
    console.log('Generic Records Error:', genericRecordsError);
    console.log('Specialties length:', specialties?.length);
    console.log('Practices length:', practices?.length);
    console.log('========================');
  }, [specialties, practices, specialtiesLoading, practicesLoading, genericRecordsError]);

  // Handle success/error states from Redux
  useEffect(() => {
    if (successMessage) {
      showToast({
        message: successMessage || "Doctor created successfully!",
        type: "success",
        title: "Success",
      });
      setCreateDoctorModal(false);
      resetForm();
      dispatch(clearDoctorError());
    }
  }, [successMessage, showToast, dispatch, resetForm]);

  useEffect(() => {
    if (error) {
      showToast({
        message: typeof error === 'string' ? error : 'Failed to create doctor',
        type: 'error',
        title: 'Error',
      });
      // Do NOT close the modal or reset the form on error
      dispatch(clearDoctorError());
    }
  }, [error, showToast, dispatch]);

  // Handle generic records errors
  useEffect(() => {
    if (genericRecordsError) {
      showToast({
        message: typeof genericRecordsError === 'string' ? genericRecordsError : 'Failed to fetch data',
        type: 'error',
        title: 'Error',
      });
    }
  }, [genericRecordsError, showToast]);

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
        showToast({
          message: "Please fill all the required fields",
          type: "error",
          title: "Validation Error",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        await dispatch(addDoctor(form));
        fetchDoctors();
        setCurrentPage(1); // Reset to first page
      } catch (error) {
        console.error("Error creating doctor:", error);
        // Error toast is handled in useEffect
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, form, validateForm, fetchDoctors, showToast]
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
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Get dynamic filter options from API data
  const filterOptions = useMemo(() => {
    return getFilterOptions(specialties || [], practices || []);
  }, [specialties.length, practices.length]); // Only recalculate when length changes

  const hasActiveFilters = useMemo(() => {
    return (
      filters.specialty !== "All specialties" ||
      filters.practice !== "All practices" ||
      debouncedSearchTerm.trim() !== ""
    );
  }, [filters.specialty, filters.practice, debouncedSearchTerm]);

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
            {/* <Button 
              color="outline-info" 
              size="sm" 
              className="me-2"
              onClick={() => {
                console.log('Manual fetch triggered');
                console.log('Current specialties:', specialties);
                console.log('Current practices:', practices);
                console.log('Current loading states:', { specialtiesLoading, practicesLoading });
                dispatch(getSpecialties());
                dispatch(getPractices());
              }}
              disabled={specialtiesLoading || practicesLoading}
            >
              Refresh Data ({specialties.length}/{practices.length})
            </Button> */}
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
                    <Label for="full_name">
                      Doctor Name <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      id="full_name"
                      value={form.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter doctor's name"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="email">
                      Email <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
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
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="specialty">
                      Specialty <span style={{ color: 'red' }}>*</span>
                      {genericRecordsError && (
                        <Button
                          color="link"
                          size="sm"
                          className="ms-2 p-0"
                          onClick={() => dispatch(getSpecialties())}
                          disabled={specialtiesLoading}
                        >
                          <i className="fas fa-sync-alt"></i>
                        </Button>
                      )}
                    </Label>
                    <Input
                      type="select"
                      id="specialty"
                      value={form.specialty}
                      onChange={handleInputChange}
                      required
                      disabled={specialtiesLoading}
                    >
                      <option value="">
                        {specialtiesLoading ? "Loading specialties..." : "Select specialty"}
                      </option>
                      {specialtiesLoading && (
                        <option value="" disabled>
                          Loading specialties...
                        </option>
                      )}
                      {Array.isArray(specialties) && specialties.length > 0 ? (
                        specialties.map((spec) => {
                          console.log('Rendering specialty option:', spec);
                          return (
                            <option key={spec.id || spec.title} value={spec.title}>
                              {spec.title}
                            </option>
                          );
                        })
                      ) : (
                        <option value="" disabled>
                          {specialtiesLoading ? "Loading..." : genericRecordsError ? "Error loading specialties" : "No specialties available"}
                        </option>
                      )}
                    </Input>
                    {formErrors.specialty && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                        {formErrors.specialty}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="practice">
                      Practice <span style={{ color: 'red' }}>*</span>
                      {genericRecordsError && (
                        <Button
                          color="link"
                          size="sm"
                          className="ms-2 p-0"
                          onClick={() => dispatch(getPractices())}
                          disabled={practicesLoading}
                        >
                          <i className="fas fa-sync-alt"></i>
                        </Button>
                      )}
                    </Label>
                    <Input
                      type="select"
                      id="practice"
                      value={form.practice}
                      onChange={handleInputChange}
                      required
                      disabled={practicesLoading}
                    >
                      <option value="">
                        {practicesLoading ? "Loading practices..." : "Select practice"}
                      </option>
                      {practicesLoading && (
                        <option value="" disabled>
                          Loading practices...
                        </option>
                      )}
                      {Array.isArray(practices) && practices.length > 0 ? (
                        practices.map((prac) => {
                          console.log('Rendering practice option:', prac);
                          return (
                            <option key={prac.id || prac.title} value={prac.title}>
                              {prac.title}
                            </option>
                          );
                        })
                      ) : (
                        <option value="" disabled>
                          {practicesLoading ? "Loading..." : genericRecordsError ? "Error loading practices" : "No practices available"}
                        </option>
                      )}
                    </Input>
                    {formErrors.practice && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                        {formErrors.practice}
                      </div>
                    )}
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