import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Reminders = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      name: "Scan Reminder",
      status: "Active",
      type: "scan",
    },
    {
      id: 2,
      name: "Photo Upload Reminder",
      status: "Active",
      type: "photo_upload",
    },
    {
      id: 3,
      name: "Next Step Reminder",
      status: "Active",
      type: "next_step",
    },
  ]);

  const [modal, setModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    type: "",
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingReminder(null);
      setFormData({
        name: "",
        status: "Active",
        type: "",
      });
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (!deleteModal) {
      setReminderToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReminder) {
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === editingReminder.id ? { ...formData, id: reminder.id } : reminder
        )
      );
    } else {
      const newReminder = {
        ...formData,
        id: Math.max(...reminders.map((r) => r.id), 0) + 1,
      };
      setReminders((prev) => [...prev, newReminder]);
    }
    toggleModal();
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    const { schedule, ...rest } = reminder;
    setFormData(rest);
    setModal(true);
  };

  const handleDelete = (reminder) => {
    setReminderToDelete(reminder);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (reminderToDelete) {
      setReminders((prev) =>
        prev.filter((reminder) => reminder.id !== reminderToDelete.id)
      );
      toggleDeleteModal();
    }
  };

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <Badge color="success">{status}</Badge>
    ) : (
      <Badge color="secondary">{status}</Badge>
    );
  };

  document.title = "Reminders | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs 
            title="Smileie" 
            breadcrumbItem="Settings" 
            breadcrumbItem2="Reminders"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Reminders</h4>
                    <Button 
                      color="primary" 
                      onClick={toggleModal}
                      className="btn-sm"
                    >
                      <i className="ri-add-line me-1"></i>
                      Add New Reminder
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Type</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reminders.map((reminder) => (
                          <tr key={reminder.id}>
                            <td>
                              <h6 className="mb-0">{reminder.name}</h6>
                            </td>
                            <td>{reminder.type}</td>
                            <td>{getStatusBadge(reminder.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(reminder)}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(reminder)}
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
          {editingReminder ? "Edit Reminder" : "Add New Reminder"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Reminder Name</Label>
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
                  <Label for="type">Reminder Type</Label>
                  <Input
                    id="type"
                    name="type"
                    type="text"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
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
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editingReminder ? "Update" : "Create"} Reminder
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
          Are you sure you want to delete this reminder?
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

export default Reminders; 