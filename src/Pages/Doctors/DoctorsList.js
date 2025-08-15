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
import ShimmerLoader from "../../components/Common/ShimmerLoader";
import usePerformanceOptimization from "../../Hooks/usePerformanceOptimization";

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
  headRow: {
    style: {
      backgroundColor: "#f8f9fa",
      borderBottom: "2px solid #dee2e6",
      fontWeight: "bold",
    },
  },
  rows: {
    style: {
      minHeight: "60px",
      "&:hover": {
        backgroundColor: "#f8f9fa",
        cursor: "pointer",
      },
    },
  },
};

const DoctorsList = ({ pageTitle = "Doctors" }) => {
  document.title = `${pageTitle} | Smileie`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors = [], loading = false, error = null } = useSelector((state) => state.doctor || {});
  const { specialties = [], practices = [], specialtiesLoading = false, practicesLoading = false, error: genericRecordsError = null } = useSelector((state) => state.genericRecords || {});
  const showToast = useToast();
  const { debounce } = usePerformanceOptimization();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({
    specialty: "All specialties",
    practice: "All practices",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    specialty_id: "",
    practice_id: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Debounced search handler
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
    }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Process doctors data to handle latest_activity
  const processedDoctors = useMemo(() => {
    return doctors.map(doctor => {
      let latestActivity = "No activity";
      let latestActivityTime = "";

      if (doctor.latest_activity) {
        if (typeof doctor.latest_activity === 'object' && doctor.latest_activity !== null) {
          latestActivity = doctor.latest_activity.description || doctor.latest_activity.action || "Activity";
          latestActivityTime = doctor.latest_activity.created_at || "";
        } else if (typeof doctor.latest_activity === 'string') {
          latestActivity = doctor.latest_activity;
          latestActivityTime = doctor.created_at || "";
        }
      }

      return {
        ...doctor,
        latestActivity,
        latestActivityTime
      };
    });
  }, [doctors]);

  // Filter and search logic
  const filteredDoctors = useMemo(() => {
    let filtered = [...processedDoctors];

    if (filters.specialty !== "All specialties") {
      filtered = filtered.filter((doctor) => doctor.specialty === filters.specialty);
    }

    if (filters.practice !== "All practices") {
      filtered = filtered.filter((doctor) => doctor.practice === filters.practice);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
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
  }, [processedDoctors, filters.specialty, filters.practice, searchTerm]);

  // Handle pagination change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePerRowsChange = useCallback((newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { id, value } = e.target;
    const filterKey = id.replace('filter-', '');
    setFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  }, []);

  const handleRowClicked = useCallback((row) => {
      if (!row.id) {
        console.warn("Doctor row missing ID:", row);
        return;
      }
      navigate(`/doctors/${row.id}`);
  }, [navigate]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      specialty: "All specialties",
      practice: "All practices",
    });
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Get dynamic filter options from API data
  const filterOptions = useMemo(() => {
    return getFilterOptions(specialties || [], practices || []);
  }, [specialties, practices]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.specialty !== "All specialties" ||
      filters.practice !== "All practices" ||
      searchTerm.trim() !== ""
    );
  }, [filters.specialty, filters.practice, searchTerm]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Doctor name is required";
    }

    if (!formData.specialty_id) {
      errors.specialty = "Specialty is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.practice_id) {
      errors.practice = "Practice is required";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      specialty_id: "",
      practice_id: "",
    });
    setFormErrors({});
  }, []);

  const handleCreateDoctor = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(addDoctor(formData));
      showToast({
        message: "Doctor created successfully!",
        type: "success",
        title: "Success",
      });
      setShowCreateModal(false);
      resetForm();
      dispatch(clearDoctorError());
    } catch (error) {
      showToast({
        message: error.message || "Failed to create doctor",
        type: "error",
        title: "Error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, formData, validateForm, showToast, resetForm]);

  // Load data on component mount
  useEffect(() => {
    dispatch(getDoctors());
    dispatch(getSpecialties());
    dispatch(getPractices());
  }, [dispatch]);

  return (
    <div className="page-content no-navbar">
      <Container fluid>
        {/* Page Title and New Doctor Button */}
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={4} xs={6} className="text-end">
            <Button color="primary" onClick={() => setShowCreateModal(true)}>
              <i className="ri-add-line me-1"></i> Add Doctor
            </Button>
          </Col>
        </Row>

        {/* Create Doctor Modal */}
        <Modal isOpen={showCreateModal} toggle={() => setShowCreateModal(false)} size="lg">
          <ModalHeader toggle={() => setShowCreateModal(false)}>
            Create New Doctor
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreateDoctor}>
              <Row>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="full_name">
                      Doctor Name <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter doctor's name"
                      required
                    />
                    {formErrors.full_name && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                        {formErrors.full_name}
                      </div>
                    )}
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
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                    {formErrors.email && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
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
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                    {formErrors.phone && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                        {formErrors.phone}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="specialty">
                      Specialty <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Input
                      type="select"
                      id="specialty"
                      value={formData.specialty_id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, specialty_id: e.target.value }))}
                      required
                      disabled={specialtiesLoading}
                    >
                      <option value="">
                        {specialtiesLoading ? "Loading specialties..." : "Select specialty"}
                      </option>
                      {Array.isArray(specialties) && specialties.length > 0 && (
                        specialties.map((spec) => (
                          <option key={spec.id || spec.title} value={spec.id}>
                              {spec.title}
                            </option>
                        ))
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
                    </Label>
                    <Input
                      type="select"
                      id="practice"
                      value={formData.practice_id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, practice_id: e.target.value }))}
                      required
                      disabled={practicesLoading}
                    >
                      <option value="">
                        {practicesLoading ? "Loading practices..." : "Select practice"}
                      </option>
                      {Array.isArray(practices) && practices.length > 0 && (
                        practices.map((prac) => (
                          <option key={prac.id || prac.title} value={prac.id}>
                              {prac.title}
                            </option>
                        ))
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
              <div className="d-flex justify-content-end gap-2">
                <Button
                  color="secondary"
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <ShimmerLoader type="custom" width="16px" height="16px" lines={1} />
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
          <CardBody>
            <div className="control-panel">
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
              data={filteredDoctors}
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
                  <ShimmerLoader type="table" lines={8} />
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