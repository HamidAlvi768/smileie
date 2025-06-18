import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const States = () => {
  const [states, setStates] = useState([
    {
      id: 1,
      name: "California",
      code: "CA",
      country: "United States",
      status: "Active",
    },
    {
      id: 2,
      name: "New York",
      code: "NY",
      country: "United States",
      status: "Active",
    },
    {
      id: 3,
      name: "Ontario",
      code: "ON",
      country: "Canada",
      status: "Inactive",
    },
  ]);

  const [modal, setModal] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    country: "",
    status: "Active",
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingState(null);
      setFormData({
        name: "",
        code: "",
        country: "",
        status: "Active",
      });
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (!deleteModal) {
      setStateToDelete(null);
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
    if (editingState) {
      setStates((prev) =>
        prev.map((state) =>
          state.id === editingState.id ? { ...formData, id: state.id } : state
        )
      );
    } else {
      const newState = {
        ...formData,
        id: Math.max(...states.map((s) => s.id), 0) + 1,
      };
      setStates((prev) => [...prev, newState]);
    }
    toggleModal();
  };

  const handleEdit = (state) => {
    setEditingState(state);
    setFormData(state);
    setModal(true);
  };

  const handleDelete = (state) => {
    setStateToDelete(state);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (stateToDelete) {
      setStates((prev) =>
        prev.filter((state) => state.id !== stateToDelete.id)
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

  document.title = "States | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs
            title="Smileie"
            breadcrumbItem="Settings"
            breadcrumbItem2="States"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">States</h4>
                    <Button color="primary" onClick={toggleModal} className="btn-sm">
                      <i className="ri-add-line me-1"></i>
                      Add New State
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Code</th>
                          <th scope="col">Country</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {states.map((state) => (
                          <tr key={state.id}>
                            <td>
                              <h6 className="mb-0">{state.name}</h6>
                            </td>
                            <td>{state.code}</td>
                            <td>{state.country}</td>
                            <td>{getStatusBadge(state.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(state)}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(state)}
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
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {editingState ? "Edit State" : "Add New State"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">State Name</Label>
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
                  <Label for="code">State Code</Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    id="status"
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
              {editingState ? "Update" : "Create"} State
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} size="sm">
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this state?
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

export default States; 