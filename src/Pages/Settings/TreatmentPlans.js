import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const initialPlans = [
  {
    id: 1,
    name: "Standard Ortho Plan",
    duration: 24,
    status: "Active",
  },
  {
    id: 2,
    name: "Express Aligner Plan",
    duration: 8,
    status: "Inactive",
  },
];

const TreatmentPlans = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: "", duration: "", status: "Active" });

  const toggleModal = () => setModal(!modal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({ name: "", duration: "", status: "Active" });
    setModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({ name: plan.name, duration: plan.duration, status: plan.status });
    setModal(true);
  };

  const handleDelete = (plan) => {
    setPlanToDelete(plan);
    setDeleteModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? { ...editingPlan, ...formData } : p)));
    } else {
      setPlans((prev) => [
        ...prev,
        { id: Date.now(), ...formData },
      ]);
    }
    setModal(false);
  };

  const confirmDelete = () => {
    setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
    setDeleteModal(false);
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs
          title="Smileie"
          breadcrumbItem="Settings"
          breadcrumbItem2="Treatment Plans"
        />
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="card-title mb-0">Treatment Plans</h4>
              <Button color="primary" onClick={handleAdd} className="btn-sm">
                <i className="ri-add-line me-1"></i> Add Treatment Plan
              </Button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Duration (weeks)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">No treatment plans found.</td>
                    </tr>
                  ) : (
                    plans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.name}</td>
                        <td>{plan.duration}</td>
                        <td>
                          <span className={`badge bg-${plan.status === "Active" ? "success" : "secondary"}`}>{plan.status}</span>
                        </td>
                        <td>
                          <Button color="link" size="sm" onClick={() => handleEdit(plan)}>
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button color="link" size="sm" className="text-danger" onClick={() => handleDelete(plan)}>
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Add/Edit Modal */}
        <Modal isOpen={modal} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>{editingPlan ? "Edit Treatment Plan" : "Add Treatment Plan"}</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="duration">Duration (weeks)</Label>
                    <Input id="duration" name="duration" type="number" min="1" value={formData.duration} onChange={handleInputChange} required />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Input id="statuss" name="status" type="select" value={formData.status} onChange={handleInputChange}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-end">
                <Button color="primary" type="submit">
                  {editingPlan ? "Save Changes" : "Add Plan"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal} centered>
          <ModalHeader toggle={toggleDeleteModal}>Delete Treatment Plan</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the treatment plan "{planToDelete?.name}"?
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleDeleteModal}>Cancel</Button>
            <Button color="danger" onClick={confirmDelete}>Delete</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default TreatmentPlans; 