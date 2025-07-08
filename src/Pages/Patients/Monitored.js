import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { getMonitoredPatients, addPatient, clearPatientMessages } from "../../store/patients/actions";
import { useToast } from "../../components/Common/ToastContext";
import { getDoctors } from "../../store/doctors/actions";
import Select from 'react-select';

const filterOptions = {
  compliance: [
    "All patients",
    "2-7 days late",
    "1-2 weeks late",
    "2-4 weeks late",
    "= 4 weeks late",
  ],
  alignerType: ["Day Aligner", "Night Aligner"],
  alignerStatus: ["All", "In progress", "Finished", "Aligner number not set"],
  appActivation: ["All", "Activated", "Not activated"],
  monitoringStatus: ["All", "In progress", "Paused"],
};

const filterLabels = {
  compliance: "Compliance",
  alignerType: "Aligner Type",
  alignerStatus: "Aligner status",
  appActivation: "App activation",
  monitoringStatus: "Monitoring Status",
};

const columns = [
  {
    name: "PATIENT NAME",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="cell-content">
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.doctor}
        </div>
        <div className="fw-bold">{row.name}</div>
      </div>
    ),
    sortable: true,
    minWidth: "200px",
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
  {
    name: "ALIGNER TYPE",
    selector: (row) => row.alignerType,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="fw-bold">{row.alignerType || 'Day Aligner'}</div>
      </div>
    ),
    minWidth: "160px",
  },
  {
    name: "LATEST SCAN",
    selector: (row) => row.latestScan,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="fw-bold">{row.latestScan}</div>
        <div className="text-danger" style={{ fontSize: "0.85em" }}>
          {row.lateInfo}
        </div>
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.scanInterval}
        </div>
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

const PatientsMonitored = ({ pageTitle = "Monitored Patients" }) => {
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleCreatePatient = () => {
    if (createPatientModal) {
      // Modal is being closed, reset form
      setPatientForm(initialPatientForm);
    }
    setCreatePatientModal(!createPatientModal);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const monitoredPatients = useSelector((state) => state.patients.monitoredPatients);
  const monitoredError = useSelector((state) => state.patients.error);
  const successMessage = useSelector((state) => state.patients.successMessage);
  const doctors = useSelector((state) => state.doctor.doctors) || [];
  const showToast = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // State for Create Label Modal
  const [createLabelModalOpen, setCreateLabelModalOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [createdLabels, setCreatedLabels] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  // Form state for create patient
  const initialPatientForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    doctor_id: "",
    gender: "",
    address: "",
    address2: "",
    zip_code: "",
    city: "",
    state: "",
    country: "",
  };
  const [patientForm, setPatientForm] = useState(initialPatientForm);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    compliance: "All patients",
    alignerType: "Day Aligner",
    alignerStatus: "All",
    appActivation: "All",
    monitoringStatus: "All",
  });

  // Merge filter keys into a single array for one row
  const filterRowKeys = [
    "compliance",
    "alignerType",
    "alignerStatus",
    "appActivation",
    "monitoringStatus",
  ];

  const defaultFilters = {
    compliance: "All patients",
    alignerType: "Day Aligner",
    alignerStatus: "All",
    appActivation: "All",
    monitoringStatus: "All",
  };

  const hasActiveFilters =
    filters.compliance !== defaultFilters.compliance ||
    filters.alignerType !== defaultFilters.alignerType ||
    filters.alignerStatus !== defaultFilters.alignerStatus ||
    filters.appActivation !== defaultFilters.appActivation ||
    filters.monitoringStatus !== defaultFilters.monitoringStatus ||
    searchTerm.trim() !== "";

  const handleClearFilters = () => {
    setFilters({ ...defaultFilters });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Scroll to top on mount and fetch data
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    dispatch(getMonitoredPatients());
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (monitoredPatients || monitoredError) {
      setIsLoading(false);
    }
  }, [monitoredPatients, monitoredError]);

  // Add a handler for row click
  const handleRowClicked = (row) => {
    // Use a unique identifier for the patient, fallback to name if no id
    const patientId = row.id || row.name.replace(/\s+/g, "-").toLowerCase();
    navigate(`/patients/${patientId}`);
  };

  // Add label button handler
  const handleAddLabelClick = (e, row) => {
    e.stopPropagation();
    setSelectedPatientName(row.name);
    setCreateLabelModalOpen(true);
  };

  // Table columns (override to use handler)
  const columnsWithAddLabel = columns.map((col) => {
    if (col.name === "PATIENT NAME") {
      return {
        ...col,
        cell: (row) => (
          <div className="cell-content">
            <div 
              className="text-muted" 
              style={{ fontSize: "0.85em", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClicked(row);
              }}
            >
              {row.doctor}
            </div>
            <div 
              className="fw-bold"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClicked(row);
              }}
            >
              {row.name}
            </div>
          </div>
        ),
      };
    } else if (col.name === "LATEST ACTIVITY") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div className="text-muted" style={{ fontSize: "0.85em" }}>
              {row.latestActivityTime}
            </div>
            <div>{row.latestActivity}</div>
          </div>
        ),
      };
    } else if (col.name === "ALIGNER TYPE") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div>{row.alignerType || 'Day Aligner'}</div>
          </div>
        ),
      };
    } else if (col.name === "LATEST SCAN") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div className="fw-bold">{row.latestScan}</div>
            <div className="text-danger" style={{ fontSize: "0.85em" }}>
              {row.lateInfo}
            </div>
            <div className="text-muted" style={{ fontSize: "0.85em" }}>
              {row.scanInterval}
            </div>
          </div>
        ),
      };
    }
    return col;
  });

  // Mock data for fallback
  const mockPatientFields = {
    latestActivity: "Message sent to patient",
    latestActivityTime: "2025-05-22 23:11 GMT+5",
    type: "Photo Monitoring Full",
    typeDetail: "MX/MD: Orthodontic treatment - Aligner - Other",
    latestScan: "2025-05-13 00:11 GMT+5",
    lateInfo: "3 days late",
    scanInterval: "1 week interval",
  };

  // Map API patients to table data
  const rawData =
    monitoredPatients && Array.isArray(monitoredPatients)
      ? monitoredPatients.map((p, idx) => ({
          name:
            `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
            p.username ||
            "",
          doctor: p.doctor_name,
          latestActivity: p.latestActivity || mockPatientFields.latestActivity,
          latestActivityTime:
            p.latestActivityTime || mockPatientFields.latestActivityTime,
          alignerType: p.alignerType || 'Day Aligner',
          latestScan: p.latestScan || mockPatientFields.latestScan,
          lateInfo: p.lateInfo || mockPatientFields.lateInfo,
          scanInterval: p.scanInterval || mockPatientFields.scanInterval,
          id: p.id,
          email: p.email || "",
        }))
      : [];

  // Filter and search data
  const filteredData = rawData.filter((item) => {
    // Search filter
    const searchMatch = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchTerm))
      : true;

    // Apply other filters here if needed
    // For now, just return search match
    return searchMatch;
  });

  const handlePatientFormChange = (e) => {
    const { id, value } = e.target;
    setPatientForm((prev) => ({
      ...prev,
      [id === "mobile" ? "phone" : id]: value,
    }));
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    dispatch(addPatient(patientForm));
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Toast handling for patient creation success/error
  useEffect(() => {
    if (successMessage) {
      showToast({
        message: successMessage || 'Patient created successfully!',
        type: 'success',
        title: 'Success',
      });
      setCreatePatientModal(false);
      setPatientForm(initialPatientForm);
      dispatch(clearPatientMessages());
      dispatch(getMonitoredPatients()); // Refresh the list after creation
    }
  }, [successMessage, showToast, dispatch]);

  useEffect(() => {
    if (monitoredError) {
      showToast({
        message: typeof monitoredError === 'string' ? monitoredError : 'Failed to create patient',
        type: 'error',
        title: 'Error',
      });
      dispatch(clearPatientMessages());
    }
  }, [monitoredError, showToast, dispatch]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    setIsLoadingCountries(true);
    fetch('https://countriesnow.space/api/v0.1/countries/iso')
      .then(res => res.json())
      .then(data => setCountries(data.data.map(c => c.name)))
      .finally(() => setIsLoadingCountries(false));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (patientForm.country) {
      setIsLoadingStates(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: patientForm.country })
      })
        .then(res => res.json())
        .then(data => setStates(data.data.states.map(s => s.name)))
        .finally(() => setIsLoadingStates(false));
      setPatientForm(prev => ({ ...prev, state: '', city: '' }));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [patientForm.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (patientForm.country && patientForm.state) {
      setIsLoadingCities(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: patientForm.country, state: patientForm.state })
      })
        .then(res => res.json())
        .then(data => setCities(data.data))
        .finally(() => setIsLoadingCities(false));
      setPatientForm(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [patientForm.state, patientForm.country]);

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page Title and New Patient Button */}
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={4} xs={6} className="text-end">
            <div className="d-flex align-items-center justify-content-end">
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
              <Button 
                color="primary" 
                onClick={toggleCreatePatient}
                disabled={isLoading}
              >
                + New patient
              </Button>
            </div>
          </Col>
        </Row>

        {/* Create Patient Modal */}
        <Modal
          isOpen={createPatientModal}
          toggle={toggleCreatePatient}
          size="lg"
          centered
        >
          <ModalHeader toggle={toggleCreatePatient}>
            <h4 className="modal-title">Create a new patient</h4>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreatePatient}>
              {/* Upper area: First Name and Photo side by side */}
              <Row>
                <Col md={9}>
                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label for="firstName" className="fw-semibold text-uppercase" style={{ letterSpacing: "0.03em" }}>
                          First Name
                        </Label>
                        <Input
                          type="text"
                          id="first_name"
                          placeholder="Enter first name"
                          value={patientForm.first_name}
                          onChange={handlePatientFormChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label for="lastName" className="fw-semibold text-uppercase" style={{ letterSpacing: "0.03em" }}>
                          Last Name
                        </Label>
                        <Input
                          type="text"
                          id="last_name"
                          placeholder="Enter last name"
                          value={patientForm.last_name}
                          onChange={handlePatientFormChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label for="email">
                          Email *
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Enter email address"
                          value={patientForm.email}
                          onChange={handlePatientFormChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label for="mobile">Mobile Phone</Label>
                        <Input
                          type="tel"
                          id="mobile"
                          placeholder="Enter mobile number"
                          value={patientForm.phone}
                          onChange={handlePatientFormChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md={3} className="text-center">
                  <Label className="fw-semibold text-uppercase" style={{ letterSpacing: "0.03em" }}>
                    Photo
                  </Label>
                  <div
                    className="photo-upload d-flex flex-column align-items-center justify-content-center mt-1 mb-3"
                    style={{
                      border: "2px dashed #bfc9d9",
                      borderRadius: "8px",
                      background: "#f5f8fa",
                      minHeight: "140px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <i className="mdi mdi-account-circle-outline" style={{ fontSize: "48px", color: "#8ca0b3" }}></i>
                    <div className="mt-2" style={{ color: "#8ca0b3", fontSize: "15px", lineHeight: "1.2" }}>
                      Click to browse or
                      <br />
                      drag a picture
                    </div>
                    <Input type="file" className="d-none" id="photo-upload" />
                  </div>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="dob">Date of Birth</Label>
                    <Input type="date" id="dob" value={patientForm.dob} onChange={handlePatientFormChange} max={new Date().toISOString().split('T')[0]} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="doctor">Doctor</Label>
                    <Input type="select" id="doctor" value={patientForm.doctor_id} onChange={handlePatientFormChange}>
                      <option value="">Select doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="gender">Gender</Label>
                    <Input type="select" id="gender" value={patientForm.gender} onChange={handlePatientFormChange}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="country">Country</Label>
                    <Select
                      id="country"
                      options={countries.map(c => ({ value: c, label: c }))}
                      value={patientForm.country ? { value: patientForm.country, label: patientForm.country } : null}
                      onChange={option => setPatientForm(prev => ({ ...prev, country: option ? option.value : '' }))}
                      isClearable
                      placeholder="Select country"
                      isLoading={isLoadingCountries}
                      loadingMessage={() => "Loading countries..."}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="state">State</Label>
                    <Select
                      id="state"
                      options={states.map(s => ({ value: s, label: s }))}
                      value={patientForm.state ? { value: patientForm.state, label: patientForm.state } : null}
                      onChange={option => setPatientForm(prev => ({ ...prev, state: option ? option.value : '' }))}
                      isClearable
                      placeholder="Select state"
                      isDisabled={!patientForm.country}
                      isLoading={isLoadingStates}
                      loadingMessage={() => "Loading states..."}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="city">City</Label>
                    <Select
                      id="city"
                      options={cities.map(c => ({ value: c, label: c }))}
                      value={patientForm.city ? { value: patientForm.city, label: patientForm.city } : null}
                      onChange={option => setPatientForm(prev => ({ ...prev, city: option ? option.value : '' }))}
                      isClearable
                      placeholder="Select city"
                      isDisabled={!patientForm.state}
                      isLoading={isLoadingCities}
                      loadingMessage={() => "Loading cities..."}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="address">Address</Label>
                    <Input type="text" id="address" value={patientForm.address} onChange={handlePatientFormChange} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="address2">Address Line 2</Label>
                    <Input type="text" id="address2" value={patientForm.address2} onChange={handlePatientFormChange} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="zip_code">Zip Code</Label>
                    <Input type="text" id="zip_code" value={patientForm.zip_code} onChange={handlePatientFormChange} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="aligner_type">Aligner Type</Label>
                    <Input 
                      type="select" 
                      id="aligner_type" 
                      value={patientForm.aligner_type} 
                      onChange={handlePatientFormChange}
                    >
                      <option value="">Select aligner type</option>
                      <option value="Day Aligner">Day Aligner</option>
                      <option value="Night Aligner">Night Aligner</option>
                    </Input>
                  </FormGroup>
                </Col>
                
              </Row>
              {/* Second row: Last Name */}
              <div className="text-end mt-4">
                <Button
                  color="light"
                  className="me-2"
                  onClick={toggleCreatePatient}
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create patient"}
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
                <Col md={2} sm={6} xs={12} className="mb-2">
                  <div>
                    <label className="form-label" htmlFor="search-input">
                      Search Patients
                    </label>
                    <Input
                      id="search-input"
                      type="search"
                      placeholder="Patient name"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </Col>
                {filterRowKeys.map((key) => (
                  <Col md={2} sm={6} xs={12} key={key} className="mb-2">
                    <label className="form-label" htmlFor={`filter-${key}`}>
                      {filterLabels[key] || key}
                    </label>
                    <Input 
                      id={`filter-${key}`} 
                      type="select"
                      value={filters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    >
                      {filterOptions[key].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Input>
                  </Col>
                ))}
              </Row>
            </div>
            {/* Patient List Table */}
            <DataTable
              columns={columnsWithAddLabel}
              data={filteredData}
              pagination
              paginationServer={false}
              paginationTotalRows={filteredData.length}
              paginationDefaultPage={currentPage}
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              highlightOnHover
              responsive
              progressPending={isLoading}
              progressComponent={<div className="text-center p-4">Loading...</div>}
              customStyles={{
                ...customStyles,
                rows: {
                  ...customStyles.rows,
                  style: {
                    ...customStyles.rows.style,
                    cursor: "pointer",
                  },
                },
              }}
              onRowClicked={handleRowClicked}
              noDataComponent={
                <div className="text-center p-4">
                  {searchTerm ? "No patients found matching your search." : "No patients found."}
                </div>
              }
            />
          </CardBody>
        </Card>
      </Container>
      {/* Create Label Modal */}
      <Modal
        isOpen={createLabelModalOpen}
        toggle={() => setCreateLabelModalOpen(false)}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Add labels to {selectedPatientName || "patient"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setCreateLabelModalOpen(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Create a new label.</label>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="text"
                maxLength={20}
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className="label-input"
              />
              <Button
                color="primary"
                size="sm"
                disabled={!labelInput.trim() || labelInput.length > 20}
                onClick={() => {
                  if (labelInput.trim() && labelInput.length <= 20) {
                    setCreatedLabels((labels) => [
                      ...labels,
                      labelInput.trim(),
                    ]);
                    setLabelInput("");
                  }
                }}
              >
                Create
              </Button>
            </div>
            <div className="small text-muted mt-1">{labelInput.length}/20</div>
          </div>
          <div className="mb-3">
            {createdLabels.length === 0 ? (
              <div className="text-muted text-center py-3">
                No labels created yet.
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {createdLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className="badge bg-info text-white px-3 py-2 custom-badge"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => setCreateLabelModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={createdLabels.length === 0}
            onClick={() => {
              // Handle label addition here
              setCreateLabelModalOpen(false);
              setCreatedLabels([]);
            }}
          >
            Add {createdLabels.length} label
            {createdLabels.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientsMonitored;