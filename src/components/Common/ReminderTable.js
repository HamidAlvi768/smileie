import React, { useState } from "react";
import { Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "./Breadcrumb";

const defaultFieldLabels = {
  name: "Name",
  triggerDays: "Trigger",
  status: "Status",
  customMessage: "Message",
};

const ReminderTable = ({
  title = "Reminders",
  breadcrumbTitle = "Smileie",
  breadcrumbItem = "Settings",
  breadcrumbItem2 = "Reminder",
  initialData = [],
  fieldLabels = {},
  addButtonLabel = "Add New Reminder",
  modalTitleAdd = "Add New Reminder",
  modalTitleEdit = "Edit Reminder",
  onChange,
}) => {
  const labels = { ...defaultFieldLabels, ...fieldLabels };
  const [notifications, setNotifications] = useState(initialData);
  const [modal, setModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    triggerDays: 1,
    status: "Active",
    customMessage: ""
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingNotification(null);
      setFormData({
        name: "",
        triggerDays: 1,
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
      [name]: name === 'triggerDays' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNotification) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === editingNotification.id 
            ? { ...formData, id: notification.id }
            : notification
        )
      );
      if (onChange) onChange(notifications);
    } else {
      const newNotification = {
        ...formData,
        id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1
      };
      setNotifications(prev => [...prev, newNotification]);
      if (onChange) onChange(notifications);
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
      if (onChange) onChange(notifications);
      toggleDeleteModal();
    }
  };

  const getStatusBadge = (status) => {
    return status === "Active" 
      ? <Badge color="success">{status}</Badge>
      : <Badge color="secondary">{status}</Badge>;
  };

  return (
    <div className="page-content no-navbar">
      <Breadcrumbs 
        title={breadcrumbTitle}
        breadcrumbItem={breadcrumbItem}
        breadcrumbItem2={breadcrumbItem2}
      />
      {/* <h4 className="mb-4">{title}</h4> */}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">{title}</h5>
                <Button 
                  color="primary" 
                  onClick={toggleModal}
                  className="btn-sm"
                >
                  <i className="ri-add-line me-1"></i>
                  {addButtonLabel}
                </Button>
              </div>

              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">{labels.name}</th>
                      <th scope="col">{labels.triggerDays}</th>
                      <th scope="col">{labels.customMessage}</th>
                      <th scope="col">{labels.status}</th>
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
                          <span className="text-muted">
                            {notification.triggerDays} day(s) after monitoring start date
                          </span>
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg" centered>
        <ModalHeader toggle={toggleModal}>
          {editingNotification ? modalTitleEdit : modalTitleAdd}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">{labels.name}</Label>
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
                  <Label for="triggerDays">{labels.triggerDays} (days after monitoring start date)</Label>
                  <Input
                    id="triggerDays"
                    name="triggerDays"
                    type="number"
                    min={1}
                    value={formData.triggerDays}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="status">{labels.status}</Label>
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
              <Label for="customMessage">{labels.customMessage}</Label>
              <Input
                id="customMessage"
                name="customMessage"
                type="textarea"
                rows="3"
                value={formData.customMessage}
                onChange={handleInputChange}
                placeholder={`Enter custom message for this ${labels.name.toLowerCase()}...`}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editingNotification ? "Update" : "Create"} {labels.name}
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
          Are you sure you want to delete this {labels.name.toLowerCase()}?
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
    </div>
  );
};

export default ReminderTable; 