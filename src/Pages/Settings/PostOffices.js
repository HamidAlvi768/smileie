import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PostOffices = () => {
  const [postOffices, setPostOffices] = useState([
    {
      id: 1,
      name: "Main Post Office",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "90210",
      status: "Active",
    },
    {
      id: 2,
      name: "Downtown Branch",
      address: "456 Oak Ave",
      city: "Anytown",
      state: "CA",
      zipCode: "90211",
      status: "Active",
    },
    {
      id: 3,
      name: "Suburban Center",
      address: "789 Pine Ln",
      city: "Otherville",
      state: "NY",
      zipCode: "10001",
      status: "Inactive",
    },
  ]);

  const [modal, setModal] = useState(false);
  const [editingPostOffice, setEditingPostOffice] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [postOfficeToDelete, setPostOfficeToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    status: "Active",
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingPostOffice(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        status: "Active",
      });
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (!deleteModal) {
      setPostOfficeToDelete(null);
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
    if (editingPostOffice) {
      setPostOffices((prev) =>
        prev.map((postOffice) =>
          postOffice.id === editingPostOffice.id ? { ...formData, id: postOffice.id } : postOffice
        )
      );
    } else {
      const newPostOffice = {
        ...formData,
        id: Math.max(...postOffices.map((po) => po.id), 0) + 1,
      };
      setPostOffices((prev) => [...prev, newPostOffice]);
    }
    toggleModal();
  };

  const handleEdit = (postOffice) => {
    setEditingPostOffice(postOffice);
    setFormData(postOffice);
    setModal(true);
  };

  const handleDelete = (postOffice) => {
    setPostOfficeToDelete(postOffice);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (postOfficeToDelete) {
      setPostOffices((prev) =>
        prev.filter((postOffice) => postOffice.id !== postOfficeToDelete.id)
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

  document.title = "Post Offices | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs
            title="Smileie"
            breadcrumbItem="Settings"
            breadcrumbItem2="Dropdown Settings"
            breadcrumbItem2Link="/settings/dropdown-settings"
            breadcrumbItem3="Post Offices"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Post Offices</h4>
                    <Button color="primary" onClick={toggleModal} className="btn-sm">
                      <i className="ri-add-line me-1"></i>
                      Add New Post Office
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postOffices.map((postOffice) => (
                          <tr key={postOffice.id}>
                            <td>
                              <h6 className="mb-0">{postOffice.name}</h6>
                            </td>
                            <td>{getStatusBadge(postOffice.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(postOffice)}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(postOffice)}
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
          {editingPostOffice ? "Edit Post Office" : "Add New Post Office"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Post Office Name</Label>
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
              {editingPostOffice ? "Update" : "Create"} Post Office
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} size="sm">
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this post office?
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

export default PostOffices; 