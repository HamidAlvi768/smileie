import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import './EntitiesList.css';
import '../../assets/scss/pages/patient.scss'; 
import { getGeneralTypesAPI, addGeneralTypeAPI, updateGeneralTypeAPI, deleteGeneralTypeAPI } from '../../helpers/api_helper';
import { useToast } from '../../components/Common/ToastContext';


const EntitiesList = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
    type: "",
  });

  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getGeneralTypesAPI();
        setEntities(res.data || []);
        console.log(entities)
      } catch (err) {
        setError('Failed to load entities');
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingEntity(null);
      setFormData({
        title: "",
        description: "",
        status: "Active",
        type: "",
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
    if (name === 'title') {
      const typeValue = value.toLowerCase().replace(/\s+/g, '_');
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        type: typeValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntity) {
        await updateGeneralTypeAPI({ ...formData, id: editingEntity.id });
        showToast({ message: 'Entity updated successfully!', type: 'success', title: 'Success' });
      } else {
        await addGeneralTypeAPI(formData);
        showToast({ message: 'Entity added successfully!', type: 'success', title: 'Success' });
      }
      // Refresh list
      const res = await getGeneralTypesAPI();
      setEntities(res.data || []);
      toggleModal();
    } catch (err) {
      setError('Failed to save entity');
      showToast({ message: 'Failed to save entity', type: 'error', title: 'Error' });
    }
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

  const confirmDelete = async () => {
    if (entityToDelete) {
      try {
        await deleteGeneralTypeAPI(entityToDelete.id);
        showToast({ message: 'Entity deleted successfully!', type: 'success', title: 'Success' });
        // Refresh list
        const res = await getGeneralTypesAPI();
        setEntities(res.data || []);
        toggleDeleteModal();
      } catch (err) {
        setError('Failed to delete entity');
        showToast({ message: 'Failed to delete entity', type: 'error', title: 'Error' });
      }
    }
  };

  const handleRowClick = (entity) => {
    let route = "/settings/dropdown-settings/"+entity.id;
    navigate(route);
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
          {loading && <div className="text-center my-3">Loading...</div>}
          {error && <div className="text-center text-danger my-3">{error}</div>}

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
                          <th scope="col">Description</th>
                          <th scope="col">Status</th>
                          {/* <th scope="col">Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {entities.map((entity) => (
                          <tr
                            key={entity.id}
                            className="clickable-row row-hover-gray"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleRowClick(entity)}
                          >
                            <td>
                              <h6 className="mb-0">{entity.title}</h6>
                            </td>
                            <td>{entity.type || (entity.title ? entity.title.toLowerCase().replace(/\s+/g, '_') : '')}</td>
                            <td>{entity.description}</td>
                            <td>
                              <span className={`badge bg-${entity.active === true ? 'success' : 'secondary'}`}>{entity.active?"Active":"InActive"}</span>
                            </td>
                            {/*
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="outline-primary"
                                  size="sm"
                                  onClick={e => { e.stopPropagation(); handleEdit(entity); }}
                                >
                                  <i className="ri-pencil-line"></i>
                                </Button>
                                <Button
                                  color="outline-danger"
                                  size="sm"
                                  onClick={e => { e.stopPropagation(); handleDelete(entity); }}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </Button>
                              </div>
                            </td>
                            */}
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
                  <Label for="title">Entity Name</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="type">Type (autogenerated)</Label>
                  <Input
                    id="type"
                    name="type"
                    type="text"
                    value={formData.type}
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
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