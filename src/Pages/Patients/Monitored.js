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
import { getPatients, addPatient } from "../../store/patients/actions";
import { useToast } from "../../components/Common/ToastContext";
import { getDoctors } from "../../store/doctors/actions";

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
        <Button color="link" size="sm" className="p-0">
          + Add label
        </Button>
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
    name: "TYPE (MX/MD)",
    selector: (row) => row.type,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div>{row.type}</div>
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.typeDetail}
        </div>
      </div>
    ),
    minWidth: "200px",
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
  const toggleCreatePatient = () => setCreatePatientModal(!createPatientModal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patients = useSelector((state) => state.patients.patients);
  const doctors = useSelector((state) => state.doctor.doctors) || [];
  const showToast = useToast();

  // State for Create Label Modal
  const [createLabelModalOpen, setCreateLabelModalOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [createdLabels, setCreatedLabels] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  // Form state for create patient
  const [patientForm, setPatientForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    practice: "",
    doctor_id: "",
  });

  // Merge filter keys into a single array for one row
  const filterRowKeys = [
    "compliance",
    "alignerType",
    "alignerStatus",
    "appActivation",
    "monitoringStatus",
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPatients());
    dispatch(getDoctors());
  }, [dispatch]);

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
            <div className="text-muted" style={{ fontSize: "0.85em" }}>
              {row.doctor}
            </div>
            <div className="fw-bold">{row.name}</div>
            <Button
              color="link"
              size="sm"
              className="p-0"
              onClick={(e) => handleAddLabelClick(e, row)}
            >
              + Add label
            </Button>
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
  const data =
    patients && Array.isArray(patients)
      ? patients.map((p, idx) => ({
          name:
            `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
            p.username ||
            "",
          doctor:p.doctor_name,
          latestActivity: p.latestActivity || mockPatientFields.latestActivity,
          latestActivityTime:
            p.latestActivityTime || mockPatientFields.latestActivityTime,
          type: p.type || mockPatientFields.type,
          typeDetail: p.typeDetail || mockPatientFields.typeDetail,
          latestScan: p.latestScan || mockPatientFields.latestScan,
          lateInfo: p.lateInfo || mockPatientFields.lateInfo,
          scanInterval: p.scanInterval || mockPatientFields.scanInterval,
          id: p.id,
        }))
      : [];

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
    setCreatePatientModal(false);
    setPatientForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      dob: "",
      practice: "",
      doctor_id: "",
    });
    showToast({
      message: "Patient created successfully!",
      type: "success",
      title: "Success",
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page Title and New Patient Button */}
        <Row className="mb-3 align-items-center">
          <Col md={10} xs={8}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={2} xs={4} className="text-end">
            <Button color="primary" onClick={toggleCreatePatient}>
              + New patient
            </Button>
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
                        <Label
                          for="firstName"
                          className="fw-semibold text-uppercase"
                          style={{ letterSpacing: "0.03em" }}
                        >
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
                        <Label
                          for="lastName"
                          className="fw-semibold text-uppercase"
                          style={{ letterSpacing: "0.03em" }}
                        >
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
                  <Label
                    className="fw-semibold text-uppercase"
                    style={{ letterSpacing: "0.03em" }}
                  >
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
                    <i
                      className="mdi mdi-account-circle-outline"
                      style={{ fontSize: "48px", color: "#8ca0b3" }}
                    ></i>
                    <div
                      className="mt-2"
                      style={{
                        color: "#8ca0b3",
                        fontSize: "15px",
                        lineHeight: "1.2",
                      }}
                    >
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
                    <Input
                      type="date"
                      id="dob"
                      value={patientForm.dob}
                      onChange={handlePatientFormChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="practice">Practice</Label>
                    <Input
                      type="select"
                      id="practice"
                      value={patientForm.practice}
                      onChange={handlePatientFormChange}
                    >
                      <option value="">Select practice</option>
                      <option value="smileie-uk">Smileie UK</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="doctor">Doctor</Label>
                    <Input
                      type="select"
                      id="doctor_id"
                      value={patientForm.doctor_id}
                      onChange={handlePatientFormChange}
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.full_name}
                        </option>
                      ))}
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
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Create patient
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
                <Col>
                  <div>
                    <label className="form-label" htmlFor="search-input">
                      Search in name/email/profile ID/external ID
                    </label>
                    <Input
                      id="search-input"
                      type="search"
                      placeholder="Search in name/email/profile ID/external ID"
                    />
                  </div>
                </Col>
              </Row>
              {/* Filter Panel - Single Row */}
              <Row className="mb-3 g-2">
                {filterRowKeys.map((key) => (
                  <Col md={2} sm={6} xs={12} key={key} className="mb-2">
                    <label className="form-label" htmlFor={`filter-${key}`}>
                      {filterLabels[key] || key}
                    </label>
                    <Input id={`filter-${key}`} type="select">
                      {filterOptions[key].map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </Input>
                  </Col>
                ))}
              </Row>
            </div>
            {/* Bulk Actions */}
            <Row className="mb-2">
              <Col>
                {/* text/ghost button no border color dull to show disabled */}
                <button
                  className="btn btn-primary text-primary bg-transparent border-0 opacity-50"
                  style={{ cursor: "pointer" }}
                  disabled
                >
                  ADD LABEL(S)
                </button>
              </Col>
            </Row>
            {/* Patient List Table */}
            <DataTable
              columns={columnsWithAddLabel}
              data={data}
              pagination
              highlightOnHover
              responsive
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
            onClick={() => setCreateLabelModalOpen(false)}
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
