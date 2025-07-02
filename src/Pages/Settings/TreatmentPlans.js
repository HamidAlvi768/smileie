import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPlans, addPlan, deletePlan, updatePlan, clearPlanMessages } from "../../store/plans/actions";
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useToast } from '../../components/Common/ToastContext';

const TreatmentPlans = () => {
  const dispatch = useDispatch();
  const plansRaw = useSelector((state) => state.plans.plans);
  const plans = Array.isArray(plansRaw) ? plansRaw : [];
  const successMessage = useSelector((state) => state.plans.successMessage);
  const error = useSelector((state) => state.plans.error);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: "", duration: "", status: "Active" });
  const showToast = useToast();

  useEffect(() => {
    dispatch(getPlans());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage && !error) {
      showToast({ message: successMessage, type: 'success', title: 'Success' });
      setModal(false);
      dispatch(clearPlanMessages());
    }
  }, [successMessage, error, showToast, dispatch]);

  useEffect(() => {
    if (error) {
      showToast({ message: typeof error === 'string' ? error : 'Failed to add plan', type: 'error', title: 'Error' });
      dispatch(clearPlanMessages());
    }
  }, [error, showToast, dispatch]);

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
    setFormData({ name: plan.name, duration: plan.weeks, status: plan.status });
    setModal(true);
  };

  const handleDelete = (plan) => {
    setPlanToDelete(plan);
    setDeleteModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      dispatch(updatePlan({
        id: editingPlan.id,
        name: formData.name,
        weeks: formData.duration,
        active: formData.status === "Active",
      }));
    } else {
      dispatch(addPlan({
        name: formData.name,
        weeks: formData.duration,
        active: formData.status === "Active",
      }));
    }
    // Do not close modal or show toast here; wait for Redux state
  };

  const confirmDelete = () => {
    try {
      if (planToDelete) {
        dispatch(deletePlan(planToDelete.id));
        showToast({ message: 'Plan deleted successfully!', type: 'success', title: 'Success' });
      }
      setDeleteModal(false);
    } catch (err) {
      showToast({ message: 'Failed to delete plan', type: 'error', title: 'Error' });
    }
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
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Duration (weeks)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
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
                        <td>{plan.weeks}</td>
                        <td>
                          <span className={`badge bg-${plan.active ? "success" : "secondary"}`}>{plan.active ? "Active" : "Inactive"}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button color="outline-primary" size="sm" onClick={() => handleEdit(plan)}>
                              <i className="ri-pencil-line"></i>
                            </Button>
                            <Button color="outline-danger" size="sm" onClick={() => handleDelete(plan)}>
                              <i className="ri-delete-bin-line"></i>
                            </Button>
                          </div>
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
          <Form onSubmit={handleSubmit}>
            <ModalBody>
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
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal} type="button">Cancel</Button>
              <Button color="primary" type="submit">
                {editingPlan ? "Save Changes" : "Add Plan"}
              </Button>
            </ModalFooter>
          </Form>
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