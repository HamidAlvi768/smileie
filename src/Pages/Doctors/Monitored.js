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
  specialty: [
    "All specialties",
    "Orthodontist",
    "General Dentist",
    "Oral Surgeon",
    "Pediatric Dentist",
    "Periodontist",
    "Prosthodontist",
  ],
  practice: [
    "All practices",
    "Smileie UK",
    "Smileie US",
    "Smileie AU",
  ],
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
    selector: (row) => row.name,
    cell: (row) => (
      <div className="cell-content">
        <div className="fw-bold">{row.name}</div>
        <div className="text-muted" style={{ fontSize: "0.85em" }}>{row.specialty}</div>
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

const data = [
  {
    name: "Dr Mark Kruchar",
    specialty: "Orthodontist",
    email: "mark.kruchar@smileie.com",
    phone: "+1 (555) 123-4567",
    practice: "Smileie UK",
    latestActivity: "Reviewed patient scans",
  },
  {
    name: "Dr Laura Smith",
    specialty: "General Dentist",
    email: "laura.smith@smileie.com",
    phone: "+1 (555) 987-6543",
    practice: "Smileie US",
    latestActivity: "Sent message to patient",
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

const DoctorsMonitored = ({ pageTitle = "Doctors" }) => {
  const [createDoctorModal, setCreateDoctorModal] = useState(false);
  const toggleCreateDoctor = () => setCreateDoctorModal(!createDoctorModal);
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Table row click handler (could navigate to doctor detail page)
  const handleRowClicked = (row) => {
    const doctorId = row.id || row.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/doctors/${doctorId}`);
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid>
        {/* Page Title and New Doctor Button */}
        <Row className="mb-3 align-items-center">
          <Col md={10} xs={8}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={2} xs={4} className="text-end">
            <Button color="primary" onClick={toggleCreateDoctor}>
              + New doctor
            </Button>
          </Col>
        </Row>

        {/* Create Doctor Modal */}
        <Modal
          isOpen={createDoctorModal}
          toggle={toggleCreateDoctor}
          size="lg"
          centered
        >
          <ModalHeader toggle={toggleCreateDoctor}>
            <h4 className="modal-title">Create a new doctor</h4>
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="doctorName">Doctor Name</Label>
                    <Input type="text" id="doctorName" placeholder="Enter doctor's name" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="specialty">Specialty</Label>
                    <Input type="select" id="specialty">
                      <option value="">Select specialty</option>
                      <option>Orthodontist</option>
                      <option>General Dentist</option>
                      <option>Oral Surgeon</option>
                      <option>Pediatric Dentist</option>
                      <option>Periodontist</option>
                      <option>Prosthodontist</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="email">Email</Label>
                    <Input type="email" id="email" placeholder="Enter email address" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="phone">Phone</Label>
                    <Input type="tel" id="phone" placeholder="Enter phone number" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="practice">Practice</Label>
                    <Input type="select" id="practice">
                      <option value="">Select practice</option>
                      <option>Smileie UK</option>
                      <option>Smileie US</option>
                      <option>Smileie AU</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label for="status">Status</Label>
                    <Input type="select" id="status">
                      <option>Active</option>
                      <option>Inactive</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
            <div className="text-end mt-4">
              <Button color="light" className="me-2" onClick={toggleCreateDoctor}>
                Cancel
              </Button>
              <Button color="primary">Create doctor</Button>
            </div>
          </ModalBody>
        </Modal>

        <Card>
          <CardBody>
            <div className="control-panel">
              {/* Filter Panel */}
              <Row className="mb-3 g-2">
                {Object.keys(filterOptions).map((key) => (
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
            <DataTable
              columns={columns}
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
                    cursor: 'default',
                  },
                },
              }}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default DoctorsMonitored; 