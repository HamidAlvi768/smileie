import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Countries = () => {
  const [countries, setCountries] = useState([
    {
      id: 1,
      name: "United States",
      code: "US",
      currency: "USD",
      status: "Active",
    },
    {
      id: 2,
      name: "Canada",
      code: "CA",
      currency: "CAD",
      status: "Active",
    },
    {
      id: 3,
      name: "Mexico",
      code: "MX",
      currency: "MXN",
      status: "Inactive",
    },
  ]);

  const [modal, setModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    currency: "",
    status: "Active",
  });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingCountry(null);
      setFormData({
        name: "",
        code: "",
        currency: "",
        status: "Active",
      });
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (!deleteModal) {
      setCountryToDelete(null);
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
    if (editingCountry) {
      setCountries((prev) =>
        prev.map((country) =>
          country.id === editingCountry.id ? { ...formData, id: country.id } : country
        )
      );
    } else {
      const newCountry = {
        ...formData,
        id: Math.max(...countries.map((c) => c.id), 0) + 1,
      };
      setCountries((prev) => [...prev, newCountry]);
    }
    toggleModal();
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData(country);
    setModal(true);
  };

  const handleDelete = (country) => {
    setCountryToDelete(country);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (countryToDelete) {
      setCountries((prev) =>
        prev.filter((country) => country.id !== countryToDelete.id)
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

  document.title = "Countries | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs
            title="Smileie"
            breadcrumbItem="Settings"
            breadcrumbItem2="Dropdown Settings"
            breadcrumbItem2Link="/settings/dropdown-settings"
            breadcrumbItem3="Countries"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Countries</h4>
                    <Button color="primary" onClick={toggleModal} className="btn-sm">
                      <i className="ri-add-line me-1"></i>
                      Add New Country
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
                        {countries.map((country) => (
                          <tr key={country.id}>
                            <td>
                              <h6 className="mb-0">{country.name}</h6>
                            </td>
                            <td>{getStatusBadge(country.status)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(country)}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(country)}
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
          {editingCountry ? "Edit Country" : "Add New Country"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Country Name</Label>
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
              {editingCountry ? "Update" : "Create"} Country
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} size="sm" centered>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this country?
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

export default Countries; 