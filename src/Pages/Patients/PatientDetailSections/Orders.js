import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Spinner
} from 'reactstrap';
import { getOrders, addOrder, clearOrderMessages } from '../../../store/orders/actions';

const PatientOrders = ({ patientId }) => {
  const dispatch = useDispatch();
  const { orders, loading, error, successMessage, adding, addError } = useSelector(state => state.orders);
  
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ 
    patient_id: patientId,
    tracking_id: '',
    main_concern: '', 
    comment: '',
    date: new Date().toISOString().split('T')[0] // Default to today's date
  });

  useEffect(() => {
    if (patientId) {
      dispatch(getOrders(patientId));
    }
  }, [dispatch, patientId]);

  useEffect(() => {
    if (successMessage) {
      // Close modal and clear success message after 3 seconds
      setModal(false);
      const timer = setTimeout(() => {
        dispatch(clearOrderMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setForm({ 
        patient_id: patientId,
        tracking_id: '',
        main_concern: '', 
        comment: '',
        date: new Date().toISOString().split('T')[0] // Default to today's date
      });
      dispatch(clearOrderMessages());
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addOrder(form));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'New': 'primary',
      'Shipped': 'warning',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return <span className={`badge bg-${statusColors[status] || 'secondary'}`}>{status}</span>;
  };

  const handleTrackOrder = (trackingId) => {
    if (trackingId) {
      const fedexUrl = `http://fedex.com/fedextrack/?trknbr=${trackingId}`;
      window.open(fedexUrl, '_blank');
    }
  };

  return (
    <div className='orders-section'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Orders</h4>
        <Button color="primary" onClick={toggleModal}>
          <i className="ri-add-line me-1"></i> Add New Order
        </Button>
      </div>

      {successMessage && (
        <Alert color="success" className="mb-3">
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert color="danger" className="mb-3">
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </Alert>
      )}

      <Row>
        <Col md={10} lg={12} xl={12} className="mx-auto">
          <Card>
            <CardBody>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading orders...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>S.No</th>
                        <th>Tracking ID</th>
                        <th>Main Concern</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted">No orders yet.</td>
                        </tr>
                      ) : (
                        orders.map((order, index) => (
                          <tr key={order.id || index}>
                            <td>{index + 1}</td>
                            <td>{order.tracking_id || '-'}</td>
                            <td>{order.main_concern}</td>
                            <td>{order.comment || '-'}</td>
                            <td>
                              {order.date ? new Date(order.date).toLocaleDateString() : 
                               order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                            </td>
                            <td>
                              {order.tracking_id ? (
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => handleTrackOrder(order.tracking_id)}
                                >
                                  <i className="ri-external-link-line me-1"></i>
                                  Track
                                </Button>
                              ) : (
                                <span className="text-muted">No tracking ID</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Add New Order</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            {addError && (
              <Alert color="danger" className="mb-3">
                {typeof addError === 'string' ? addError : addError?.message || 'Failed to add order'}
              </Alert>
            )}
            
            <FormGroup>
              <Label for="tracking_id">Tracking ID</Label>
              <Input
                id="tracking_id"
                name="tracking_id"
                type="text"
                value={form.tracking_id}
                onChange={handleChange}
                placeholder="Enter tracking ID"
              />
            </FormGroup>

            <FormGroup>
              <Label for="main_concern">Main Concern</Label>
              <Input
                id="main_concern"
                name="main_concern"
                type="select"
                value={form.main_concern}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select main concern</option>
                <option value="Impression Kit">Impression Kit</option>
                <option value="Day time dual arch">Day time dual arch</option>
                <option value="Night time dual arch">Night time dual arch</option>
                <option value="Day time upper arch">Day time upper arch</option>
                <option value="Day time lower arch">Day time lower arch</option>
                <option value="Night time upper arch">Night time upper arch</option>
                <option value="Night time lower arch">Night time lower arch</option>
                <option value="Refinement Aligners">Refinement Aligners</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="comment">Comment</Label>
              <Input
                id="comment"
                name="comment"
                type="textarea"
                value={form.comment}
                onChange={handleChange}
                placeholder="Enter any additional comments"
                rows="3"
              />
            </FormGroup>

            <FormGroup>
              <Label for="date">Order Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal} type="button" disabled={adding}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={adding}>
              {adding ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Adding...
                </>
              ) : (
                'Add Order'
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientOrders; 