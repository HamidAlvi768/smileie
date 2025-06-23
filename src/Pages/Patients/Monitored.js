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

const filterOptions = {
  compliance: [
    "All patients",
    "2-7 days late",
    "1-2 weeks late",
    "2-4 weeks late",
    "= 4 weeks late",
  ],
  monitoring: [
    "All products",
    "Photo Monitoring Light",
    "Photo Monitoring Full",
    "3D Monitoring Light",
    "3D Monitoring Full",
  ],
  treatmentType: [
    "All types",
    "Orthodontic pre-treatment",
    "Orthodontic treatment",
    "Orthodontic post-treatment",
    "General dentistry",
  ],
  appliance: [
    "All",
    "None",
    "Aligner",
    "Auxiliary Appliance",
    "Customized Buccal",
    "Fixed appliance",
    "Lingual",
    "No appliance",
    "Removable appliance",
    "Standard Buccal",
  ],
  dynamicAlignerChange: [
    "All patients",
    "Only Dynamic Aligner Change patients",
    "Only not Dynamic Aligner Change patients",
  ],
  alignerStatus: ["All", "In progress", "Finished", "Aligner number not set"],
  appActivation: ["All", "Activated", "Not activated"],
  scanBoxModel: [
    "All patients",
    "No ScanBox",
    "ScanBox",
    "ScanBox PRO",
    "Any ScanBox",
  ],
  goalType: [
    "All",
    "Passive archwire and auxiliaries – UPPER",
    "Passive archwire and auxiliaries – LOWER",
    "Loss of all deciduous teeth",
    "Class I canine – RIGHT [-1.0 ; 1.0] mm",
    "Class I canine – LEFT [-1.0 ; 1.0] mm",
    "Class I molar – RIGHT [-1.0 ; 1.0] mm",
    "Class I molar – LEFT [-1.0 ; 1.0] mm",
    "Closure of all anterior space(s)",
    "Closure of extraction space(s)",
    "Normal overjet [1.0 ; 3.0] mm",
    "Correction of midline deviation [-0.5 ; 0.5] mm",
    "Correction of crossbite – RIGHT",
    "Correction of crossbite – LEFT",
  ],
  goalStatus: [
    "Any status",
    "Started",
    "In progress",
    "Achieved",
    "Overdue",
    "Not in progress",
    "Never started",
  ],
  monitoringStatus: ["All", "In progress", "Paused"],
};

const filterLabels = {
  compliance: "Compliance",
  monitoring: "Monitoring",
  treatmentType: "Treatment type",
  appliance: "Appliance",
  dynamicAlignerChange: "Dynamic Aligner Change",
  alignerStatus: "Aligner status",
  appActivation: "App activation",
  scanBoxModel: "ScanBox model",
  goalType: "Goal type",
  goalStatus: "Goal status",
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

const data = [
  {
    name: "Stephen Dyos",
    doctor: "Dr Mark Kruchar",
    latestActivity: "Message sent to patient",
    latestActivityTime: "2025-05-22 23:11 GMT+5",
    type: "Photo Monitoring Full",
    typeDetail: "MX/MD: Orthodontic treatment - Aligner - Other",
    latestScan: "2025-05-13 00:11 GMT+5",
    lateInfo: "3 days late",
    scanInterval: "1 week interval",
  },
  {
    name: "Laura Saez",
    doctor: "Dr Mark Kruchar",
    latestActivity: "Message sent to patient",
    latestActivityTime: "2025-05-22 23:00 GMT+5",
    type: "Photo Monitoring Full",
    typeDetail: "MX/MD: Orthodontic treatment - Aligner - Other",
    latestScan: "2025-05-13 15:44 GMT+5",
    lateInfo: "3 days late",
    scanInterval: "2 weeks interval",
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

  // State for Create Label Modal
  const [createLabelModalOpen, setCreateLabelModalOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [createdLabels, setCreatedLabels] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  const filterKeys = Object.keys(filterOptions);
  const half = Math.ceil(filterKeys.length / 2);
  const firstRowKeys = [
    "compliance",
    "monitoring",
    "treatmentType",
    "appliance",
    "dynamicAlignerChange",
    "alignerStatus",
  ];
  const secondRowKeys = [
    "appActivation",
    "scanBoxModel",
    "goalType",
    "goalStatus",
    "monitoringStatus",
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add a handler for row click
  const handleRowClicked = (row) => {
    // Use a unique identifier for the patient, fallback to name if no id
    const patientId = row.id || row.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/patients/${patientId}`);
  };

  // Add label button handler
  const handleAddLabelClick = (e, row) => {
    e.stopPropagation();
    setSelectedPatientName(row.name);
    setCreateLabelModalOpen(true);
  };

  // Table columns (override to use handler)
  const columnsWithAddLabel = columns.map(col => {
    if (col.name === "PATIENT NAME") {
      return {
        ...col,
        cell: (row) => (
          <div className="cell-content">
            <div className="text-muted" style={{ fontSize: "0.85em" }}>
              {row.doctor}
            </div>
            <div className="fw-bold">{row.name}</div>
            <Button color="link" size="sm" className="p-0" onClick={e => handleAddLabelClick(e, row)}>
              + Add label
            </Button>
          </div>
        ),
      };
    }
    return col;
  });

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
            <Form>
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
                          id="firstName"
                          placeholder="Enter first name"
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
                          id="lastName"
                          placeholder="Enter last name"
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
                    <Input type="date" id="dob" />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="practice">Practice</Label>
                    <Input type="select" id="practice">
                      <option value="">Select practice</option>
                      <option value="smileie-uk">Smileie UK</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="doctor">Doctor</Label>
                    <Input type="select" id="doctor">
                      <option value="">Select doctor</option>
                      <option value="kruchar-mark">Kruchar, Mark (Dr)</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              {/* Second row: Last Name */}
            </Form>

            <div className="text-end mt-4">
              <Button
                color="light"
                className="me-2"
                onClick={toggleCreatePatient}
              >
                Cancel
              </Button>
              <Button color="primary">Create patient</Button>
            </div>
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
              {/* Filter Panel - First Row */}
              <Row className="mb-3 g-2">
                {firstRowKeys.map((key) => (
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
              {/* Filter Panel - Second Row */}
              <Row className="mb-3 g-2">
                {secondRowKeys.map((key) => (
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
                <button className="btn btn-primary text-primary bg-transparent border-0 opacity-50" style={{ cursor: "pointer" }} disabled>
                  ADD LABEL(S)
                </button>
              </Col>
            </Row>
            {/* Patient List Table */}
            <DataTable
              columns={columnsWithAddLabel}
              data={data}
              selectableRows
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
      </Container>
      {/* Create Label Modal */}
      <Modal isOpen={createLabelModalOpen} toggle={() => setCreateLabelModalOpen(false)} centered>
        <div className="modal-header">
          <h5 className="modal-title">Add labels to {selectedPatientName || 'patient'}</h5>
          <button type="button" className="btn-close" onClick={() => setCreateLabelModalOpen(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Create a new label.</label>
            <div className="d-flex align-items-center gap-2">
              <Input type="text" maxLength={20} value={labelInput} onChange={e => setLabelInput(e.target.value)} className="label-input" />
              <Button color="primary" size="sm" disabled={!labelInput.trim() || labelInput.length > 20} onClick={() => {
                if (labelInput.trim() && labelInput.length <= 20) {
                  setCreatedLabels(labels => [...labels, labelInput.trim()]);
                  setLabelInput("");
                }
              }}>Create</Button>
            </div>
            <div className="small text-muted mt-1">{labelInput.length}/20</div>
          </div>
          <div className="mb-3">
            {createdLabels.length === 0 ? (
              <div className="text-muted text-center py-3">No labels created yet.</div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {createdLabels.map((label, idx) => (
                  <span key={idx} className="badge bg-info text-white px-3 py-2 custom-badge">{label}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => setCreateLabelModalOpen(false)}>Cancel</Button>
          <Button color="primary" disabled={createdLabels.length === 0} onClick={() => setCreateLabelModalOpen(false)}>
            Add {createdLabels.length} label{createdLabels.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientsMonitored;
