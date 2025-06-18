import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Button, 
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const ScanNotificationFrequency = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "Weekly Scan Reminder",
      frequency: "Weekly",
      day: "Monday",
      time: "09:00",
      status: "Active",
      customMessage: "Don't forget to submit your weekly scan! Your progress depends on it."
    },
    {
      id: 2,
      name: "Monthly Progress Check",
      frequency: "Monthly",
      day: "1st",
      time: "14:00",
      status: "Active",
      customMessage: "Time for your monthly progress review. Keep up the great work!"
    },
    {
      id: 3,
      name: "Daily Follow-up",
      frequency: "Daily",
      day: "Every day",
      time: "10:00",
      status: "Inactive",
      customMessage: "Stay cautious! It's only two days left."
    }
  ]);

  const [modal, setModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "Weekly",
    day: "",
    time: "09:00",
    status: "Active",
    customMessage: ""
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingNotification(null);
      setFormData({
        name: "",
        frequency: "Weekly",
        day: "",
        time: "09:00",
        status: "Active",
        customMessage: ""
      });
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (!deleteModal) {
      setNotificationToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNotification) {
      // Edit existing notification
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === editingNotification.id 
            ? { ...formData, id: notification.id }
            : notification
        )
      );
    } else {
      // Add new notification
      const newNotification = {
        ...formData,
        id: Math.max(...notifications.map(n => n.id)) + 1
      };
      setNotifications(prev => [...prev, newNotification]);
    }
    toggleModal();
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData(notification);
    setModal(true);
  };

  const handleDelete = (notification) => {
    setNotificationToDelete(notification);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (notificationToDelete) {
      setNotifications(prev => prev.filter(notification => notification.id !== notificationToDelete.id));
      toggleDeleteModal();
    }
  };

  const getStatusBadge = (status) => {
    return status === "Active" 
      ? <Badge color="success">{status}</Badge>
      : <Badge color="secondary">{status}</Badge>;
  };

  const getDayDisplay = (frequency, day) => {
    switch (frequency) {
      case "Daily":
        return "Every day";
      case "Weekly":
        return day;
      case "Monthly":
        return `${day} of month`;
      default:
        return day;
    }
  };

  document.title = "Scan Reminder | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs 
            title="Smileie" 
            breadcrumbItem="Settings" 
            breadcrumbItem2="Scan Reminder"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0"></h4>
                    <Button 
                      color="primary" 
                      onClick={toggleModal}
                      className="btn-sm"
                    >
                      <i className="ri-add-line me-1"></i>
                      Add New Notification
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Frequency</th>
                          <th scope="col">Schedule</th>
                          <th scope="col">Message</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notifications.map((notification) => (
                          <tr key={notification.id}>
                            <td>
                              <h6 className="mb-0">{notification.name}</h6>
                            </td>
                            <td>
                              <Badge color="info" className="font-size-12">
                                {notification.frequency}
                              </Badge>
                            </td>
                            <td>
                              <div className="text-muted">
                                {getDayDisplay(notification.frequency, notification.day)}
                                <br />
                                <small>{notification.time}</small>
                              </div>
                            </td>
                            <td>
                              <p className="text-muted mb-0 font-size-13">
                                {notification.customMessage}
                              </p>
                            </td>
                            <td>
                              {getStatusBadge(notification.status)}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(notification)}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(notification)}
                                >
                                  <i className="ri-delete-bin-line"></i>
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg" centered>
        <ModalHeader toggle={toggleModal}>
          {editingNotification ? "Edit Notification" : "Add New Notification"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Notification Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    type="select"
                    value={formData.frequency}
                    onChange={handleInputChange}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="day">
                    {formData.frequency === "Weekly" ? "Day of Week" : 
                     formData.frequency === "Monthly" ? "Day of Month" : "Day"}
                  </Label>
                  {formData.frequency === "Weekly" ? (
                    <Input
                      id="day"
                      name="day"
                      type="select"
                      value={formData.day}
                      onChange={handleInputChange}
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </Input>
                  ) : formData.frequency === "Monthly" ? (
                    <Input
                      id="day"
                      name="day"
                      type="select"
                      value={formData.day}
                      onChange={handleInputChange}
                    >
                      <option value="">Select day</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                          {day}{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}
                        </option>
                      ))}
                    </Input>
                  ) : (
                    <Input
                      id="day"
                      name="day"
                      type="text"
                      value="Every day"
                      disabled
                    />
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    id="statuss"
                    name="status"
                    type="select"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="customMessage">Message</Label>
              <Input
                id="customMessage"
                name="customMessage"
                type="textarea"
                rows="3"
                value={formData.customMessage}
                onChange={handleInputChange}
                placeholder="Enter custom message for this notification..."
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editingNotification ? "Update" : "Create"} Notification
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} size="sm" centered>
        <ModalHeader toggle={toggleDeleteModal}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this notification?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ScanNotificationFrequency; 