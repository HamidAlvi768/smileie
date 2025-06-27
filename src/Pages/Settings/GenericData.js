import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useParams } from "react-router-dom";
import { getGenericRecordsAPI, addGeneralTypeAPI, updateGeneralTypeAPI, deleteGeneralTypeAPI, getGeneralTypesAPI } from "../../helpers/api_helper";
import { useToast } from '../../components/Common/ToastContext';

const GenericData = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);

  const params = useParams();
  const parentId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    parent_id: parentId,
    status: "Active",
  });

  const showToast = useToast();

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getGenericRecordsAPI(parentId);
        setEntities(res.data || []);
      } catch (err) {
        setError('Failed to load entities');
        showToast({ message: 'Failed to load records', type: 'error', title: 'Error' });
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, [parentId, showToast]);

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingEntity(null);
      setFormData({
        title: "",
        description: "",
        parent_id: parentId,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntity) {
        await updateGeneralTypeAPI({ ...formData, id: editingEntity.id });
        showToast({ message: 'Record updated successfully!', type: 'success', title: 'Success' });
      } else {
        await addGeneralTypeAPI(formData);
        showToast({ message: 'Record added successfully!', type: 'success', title: 'Success' });
      }
      // Refresh list
      const res = await getGenericRecordsAPI(parentId);
      setEntities(res.data || []);
      toggleModal();
    } catch (err) {
      setError('Failed to save entity');
      showToast({ message: 'Failed to save record', type: 'error', title: 'Error' });
    }
  };

  const handleEdit = (entity) => {
    setEditingEntity(entity);
    setFormData({
      title: entity.title || "",
      description: entity.description || "",
      parent_id: parentId,
      status: entity.status || "Active",
    });
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
        showToast({ message: 'Record deleted successfully!', type: 'success', title: 'Success' });
        // Refresh list
        const res = await getGenericRecordsAPI(parentId);
        setEntities(res.data || []);
        toggleDeleteModal();
      } catch (err) {
        setError('Failed to delete entity');
        showToast({ message: 'Failed to delete record', type: 'error', title: 'Error' });
      }
    }
  };

  const getStatusBadge = (status) => {
    return status === true || status === "Active" ? (
      <Badge color="success">Active</Badge>
    ) : (
      <Badge color="secondary">InActive</Badge>
    );
  };

  document.title = "Records | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs
            title="Smileie"
            breadcrumbItem="Settings"
            breadcrumbItem2="Dropdown Settings"
            breadcrumbItem2Link="/settings/dropdown-settings"
            breadcrumbItem3="Records"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Records</h4>
                    <Button color="primary" onClick={toggleModal} className="btn-sm">
                      <i className="ri-add-line me-1"></i>
                      Add New Record
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Description</th>
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entities.map((entity) => (
                          <tr key={entity.id}>
                            <td>
                              <h6 className="mb-0">{entity.title}</h6>
                            </td>
                            <td>{entity.description}</td>
                            <td>{getStatusBadge(entity.active ?? entity.status)}</td>
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
          {editingEntity ? "Edit Record" : "Add New Record"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="title">Record Name</Label>
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
              <Col md={4}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
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
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editingEntity ? "Update" : "Create"} Record
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} size="sm" centered>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this record?
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

export default GenericData; 