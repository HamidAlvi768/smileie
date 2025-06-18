import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Form,
  Table,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const ToDoList = () => {
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const toggle = (type, patient = null) => {
    setActionType(type);
    setSelectedPatient(patient);
    setModal(!modal);
  };

  // Get the current view based on the route
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/todo/monitored")) return "Monitored";
    if (path.includes("/todo/not-monitored")) return "Not Monitored";
    if (path.includes("/todo/guardians")) return "Guardians";
    return "All Tasks";
  };

  // Dummy data for the table
  const todoList = [
    {
      id: 1,
      patientName: "John Doe",
      task: "Follow-up scan required",
      dueDate: "2024-03-20",
      status: "Pending",
      priority: "High",
      type: "Monitored",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      task: "Review new scan",
      dueDate: "2024-03-21",
      status: "In Progress",
      priority: "Medium",
      type: "Not Monitored",
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      task: "Guardian approval needed",
      dueDate: "2024-03-22",
      status: "Pending",
      priority: "High",
      type: "Guardians",
    },
  ];

  // Filter tasks based on current view
  const filteredTasks = todoList.filter(task => {
    const currentView = getCurrentView();
    if (currentView === "All Tasks") return true;
    return task.type === currentView;
  });

  const renderActionModal = () => {
    return (
      <Modal isOpen={modal} toggle={() => toggle("")} size="lg">
        <ModalHeader toggle={() => toggle("")}>
          {actionType === "assign" && "Assign Task"}
          {actionType === "message" && "Send Message"}
          {actionType === "clinical" && "Clinical Action"}
          {actionType === "review" && "Mark as Reviewed"}
        </ModalHeader>
        <ModalBody>
          {actionType === "assign" && (
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Assignee</Label>
                    <Input type="select">
                      <option>Select Assignee</option>
                      <option>Dr. Smith</option>
                      <option>Dr. Johnson</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                      <Label>Comments</Label>
                    <Input type="textarea" />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
          {actionType === "message" && (
            <Form>
              <FormGroup>
                <Label>Message</Label>
                <Input type="textarea" />
              </FormGroup>
              <FormGroup>
                <Label>Attachment</Label>
                <Input type="file" />
              </FormGroup>
            </Form>
          )}
          {actionType === "clinical" && (
            <Form>
              <FormGroup>
                <Label>Action Type</Label>
                <Input type="select">
                  <option>Select Action</option>
                  <option>Exclude Detail</option>
                  <option>Change Aligner Number</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>Comments</Label>
                <Input type="textarea" />
              </FormGroup>
            </Form>
          )}
          {actionType === "review" && (
            <Form>
              <FormGroup>
                <Label>Review Notes</Label>
                <Input type="textarea" />
              </FormGroup>
            </Form>
          )}
          <div className="text-end mt-3">
            <Button color="primary" className="me-2">
              Submit
            </Button>
            <Button color="secondary" onClick={() => toggle("")}>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="To-Do List" breadcrumbItem={getCurrentView()} />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  {/* Filter Section */}
                  <Row className="mb-4">
                    <Col md={3}>
                      <Input type="text" placeholder="Search..." />
                    </Col>
                    <Col md={3}>
                      <Input type="select">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </Input>
                    </Col>
                    <Col md={3}>
                      <Input type="select">
                        <option>All Priority</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </Input>
                    </Col>
                    <Col md={3}>
                      <Input type="date" />
                    </Col>
                  </Row>

                  {/* Table Section */}
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Patient Name</th>
                          <th>Task</th>
                          <th>Due Date</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((item) => (
                          <tr key={item.id}>
                            <td>{item.patientName}</td>
                            <td>{item.task}</td>
                            <td>{item.dueDate}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.status === "Pending"
                                    ? "bg-warning"
                                    : item.status === "In Progress"
                                    ? "bg-info"
                                    : "bg-success"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  item.priority === "High"
                                    ? "bg-danger"
                                    : item.priority === "Medium"
                                    ? "bg-warning"
                                    : "bg-success"
                                }`}
                              >
                                {item.priority}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => toggle("assign", item)}
                                >
                                  Assign
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {renderActionModal()}
    </React.Fragment>
  );
};

export default ToDoList; 