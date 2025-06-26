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
import { useToast } from '../../components/Common/ToastContext';

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

const NotMonitored = ({ pageTitle = "Not Monitored Patients" }) => {
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const toggleCreatePatient = () => setCreatePatientModal(!createPatientModal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patients = useSelector(state => state.patients.patients);
  const showToast = useToast();

  // Form state for create patient
  const [patientForm, setPatientForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    practice: "",
    doctor_name: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPatients());
  }, [dispatch]);

  // Map API patients to table data
  const data = patients && Array.isArray(patients) ? patients.map((p) => ({
    name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.username || '',
    doctor: p.doctor_name || '',
    created: p.created_at || "2025-05-01 10:00 GMT+5", // fallback/mock
    started: p.started_at || "2025-05-10 10:00 GMT+5", // fallback/mock
    stopped: p.stopped_at || "", // fallback/mock
    id: p.id,
  })) : [];

  const handlePatientFormChange = (e) => {
    const { id, value } = e.target;
    setPatientForm((prev) => ({ ...prev, [id === "mobile" ? "phone" : id === "doctor" ? "doctor_name" : id]: value }));
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
      doctor_name: "",
    });
    showToast({ message: 'Patient created successfully!', type: 'success', title: 'Success' });
  };

  // Table row click handler (optional: navigate to patient detail)
  const handleRowClicked = (row) => {
    const patientId = row.id || row.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/patients/${patientId}`);
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
                    <Label for="practice">Practice</Label>
                    <Input type="select" id="practice" value={patientForm.practice} onChange={handlePatientFormChange}>
                      <option value="">Select practice</option>
                      <option value="smileie-uk">Smileie UK</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-3">
                    <Label for="doctor">Doctor</Label>
                    <Input type="select" id="doctor" value={patientForm.doctor_name} onChange={handlePatientFormChange}>
                      <option value="">Select doctor</option>
                      <option value="kruchar-mark">Kruchar, Mark (Dr)</option>
                    </Input>
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

        <Card>
          <CardBody>
            <DataTable
              columns={columns}
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
                    cursor: 'pointer',
                  },
                },
              }}
              onRowClicked={handleRowClicked}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default NotMonitored; 