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
import { getNotMonitoredPatients, addPatient, clearPatientMessages } from "../../store/patients/actions";
import { getDoctors } from "../../store/doctors/actions";
import { useToast } from '../../components/Common/ToastContext';
import Select from 'react-select';

const columns = [
  {
    name: "PATIENT NAME",
    selector: (row) => row.name,
    sortable: true,
    minWidth: "200px",
  },
  {
    name: "DOCTOR",
    selector: (row) => row.doctor,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "CREATED",
    selector: (row) => row.created,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "STARTED",
    selector: (row) => row.started,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "STOPPED",
    selector: (row) => row.stopped,
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

// Add filter options and labels as in Monitored.js
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
};

const filterLabels = {
  compliance: "Compliance",
  alignerType: "Aligner Type",
  alignerStatus: "Aligner status",
  appActivation: "App activation",
};

// Merge filter keys into a single array for one row
const filterRowKeys = [
  "compliance",
  "alignerType",
  "alignerStatus",
  "appActivation",
];

const defaultFilters = {
  compliance: "All patients",
  alignerType: "Day Aligner",
  alignerStatus: "All",
  appActivation: "All",
};

const NotMonitored = ({ pageTitle = "Not Monitored Patients" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const toggleCreatePatient = () => setCreatePatientModal(!createPatientModal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patients = useSelector(state => state.patients.notMonitoredPatients);
  const doctors = useSelector(state => state.doctor.doctors) || [];
  const successMessage = useSelector(state => state.patients.successMessage);
  const error = useSelector(state => state.patients.error);
  const showToast = useToast();

  // Form state for create patient
  const [patientForm, setPatientForm] = useState({
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
  });

  // Add search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    compliance: "All patients",
    alignerType: "Day Aligner",
    alignerStatus: "All",
    appActivation: "All",
  });

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    dispatch(getNotMonitoredPatients());
    dispatch(getDoctors());
  }, [dispatch]);

  const notMonitoredPatients = useSelector((state) => state.patients.notMonitoredPatients);
  const notMonitoredError = useSelector((state) => state.patients.error);

  useEffect(() => {
    if (notMonitoredPatients || notMonitoredError) {
      setIsLoading(false);
    }
  }, [notMonitoredPatients, notMonitoredError]);

  // Map API patients to table data
  const data = patients && Array.isArray(patients) ? patients.map((p) => ({
    name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.username || '',
    doctor: p.doctor_name || '',
    created: p.created_at || "2025-05-01 10:00 GMT+5", // fallback/mock
    started: p.started_at || "Not Started", // fallback/mock
    stopped: p.stopped_at || "", // fallback/mock
    id: p.id,
  })) : [];

  // Filter and search data (add this logic)
  const filteredData = data.filter((item) => {
    // Search filter
    const searchMatch = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchTerm))
      : true;
    // Apply other filters here if needed (currently just search)
    return searchMatch;
  });

  const handlePatientFormChange = (e) => {
    const { id, value } = e.target;
    setPatientForm((prev) => ({ ...prev, [id === "mobile" ? "phone" : id === "doctor" ? "doctor_id" : id]: value }));
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    dispatch(addPatient(patientForm));
    // Do not close modal or show toast here; wait for Redux state
  };

  // Listen for patient creation success/error and show toast
  useEffect(() => {
    if (successMessage) {
      showToast({ message: successMessage || 'Patient created successfully!', type: 'success', title: 'Success' });
      setCreatePatientModal(false);
      setPatientForm({
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
      });
      dispatch(clearPatientMessages());
      dispatch(getNotMonitoredPatients()); // Refresh the list after creation
    }
  }, [successMessage, showToast, dispatch]);

  useEffect(() => {
    if (notMonitoredError) {
      showToast({ message: typeof notMonitoredError === 'string' ? notMonitoredError : 'Failed to create patient', type: 'error', title: 'Error' });
      dispatch(clearPatientMessages());
    }
  }, [notMonitoredError, showToast, dispatch]);

  // Table row click handler (optional: navigate to patient detail)
  const handleRowClicked = (row) => {
    const patientId = row.id || row.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/patients/${patientId}`);
  };

  // Add filter and search handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const hasActiveFilters =
    filters.compliance !== defaultFilters.compliance ||
    filters.alignerType !== defaultFilters.alignerType ||
    filters.alignerStatus !== defaultFilters.alignerStatus ||
    filters.appActivation !== defaultFilters.appActivation ||
    searchTerm.trim() !== "";

  const handleClearFilters = () => {
    setFilters({ ...defaultFilters });
    setSearchTerm("");
  };

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
              <Button color="primary" onClick={toggleCreatePatient}>
                + New patient
              </Button>
            </div>
          </Col>
        </Row>

        <Card>
          <CardBody>
            {/* Filter Section (now inside Card) */}
            <div className="control-panel">
              {/* Single Row for Search and Filters (Monitored.js style) */}
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
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              responsive
              customStyles={{
                ...customStyles,
                rows: {
                  ...customStyles.rows,
                  style: {
                    ...customStyles.rows.style,
                    cursor: 'pointer',
                  },
                },
              }}
              onRowClicked={handleRowClicked}
            />
          </CardBody>
        </Card>

        {/* Create Patient Modal (reused from Monitored.js) */}
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
                          Email <span className="text-muted">(optional)</span>
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
                    <Input type="date" id="dob" value={patientForm.dob} onChange={handlePatientFormChange} />
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
                    <Label for="address">Address</Label>
                    <Input type="text" id="address" value={patientForm.address} onChange={handlePatientFormChange} />
                  </FormGroup>
                </Col>
                <Col md={4}>
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
              </Row>
              <div className="text-end mt-4">
                <Button color="light" className="me-2" onClick={toggleCreatePatient} type="button">
                  Cancel
                </Button>
                <Button color="primary" type="submit">Create patient</Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
};

export default NotMonitored; 