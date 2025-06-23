import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const EntitiesList = () => {
  const [entities, setEntities] = useState([
    {
      id: 1,
      name: "Countries",
      type: "country",
      status: "Active",
    },
    {
      id: 2,
      name: "Post Offices",
      type: "post_office",
      status: "Active",
    },
    {
      id: 3,
      name: "States",
      type: "state",
      status: "Active",
    },
    {
      id: 4,
      name: "SMS Templates",
      type: "sms_template",
      status: "Active",
    },
    {
      id: 5,
      name: "Email Templates",
      type: "email_template",
      status: "Active",
    },
  ]);

  const [modal, setModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Active",
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingEntity(null);
      setFormData({
        name: "",
        type: "",
        status: "Active",
      });
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (!deleteModal) {
      setEntityToDelete(null);
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
    if (editingEntity) {
      setEntities((prev) =>
        prev.map((entity) =>
          entity.id === editingEntity.id ? { ...formData, id: entity.id } : entity
        )
      );
    } else {
      const newEntity = {
        ...formData,
        id: Math.max(...entities.map((e) => e.id), 0) + 1,
      };
      setEntities((prev) => [...prev, newEntity]);
    }
    toggleModal();
  };

  const handleEdit = (entity) => {
    setEditingEntity(entity);
    setFormData(entity);
    setModal(true);
  };

  const handleDelete = (entity) => {
    setEntityToDelete(entity);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (entityToDelete) {
      setEntities((prev) =>
        prev.filter((entity) => entity.id !== entityToDelete.id)
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

  document.title = "Entities List | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs 
            title="Smileie" 
            breadcrumbItem="Settings" 
            breadcrumbItem2="Dropdown Settings"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Entities List</h4>
                    <Button 
                      color="primary" 
                      onClick={toggleModal}
                      className="btn-sm"
                    >
                      <i className="ri-add-line me-1"></i>
                      Add New Entity
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
                        {entities.map((entity) => (
                          <tr key={entity.id}>
                            <td>
                              <h6 className="mb-0">{entity.name}</h6>
                            </td>
                            <td>{entity.type}</td>
                            <td>{getStatusBadge(entity.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(entity)}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(entity)}
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
          {editingEntity ? "Edit Entity" : "Add New Entity"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Entity Name</Label>
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
                  <Label for="type">Entity Type</Label>
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
              {editingEntity ? "Update" : "Create"} Entity
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
          Are you sure you want to delete this entity?
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

export default EntitiesList; 