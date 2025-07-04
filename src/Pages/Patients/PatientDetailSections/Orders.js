import React, { useState } from 'react';
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
  CardBody
} from 'reactstrap';

const PatientOrders = () => {
  const [orders, setOrders] = useState([
    { id: 1, mainConcern: 'Impression Kit', comments: 'Send ASAP', date: '2024-05-29', status: 'New' },
    { id: 2, mainConcern: 'Day time dual arch', comments: 'Patient prefers day time', date: '2024-05-28', status: 'Shipped' },
    { id: 3, mainConcern: 'Refinement Aligners', comments: 'Second refinement needed', date: '2024-05-27', status: 'Delivered' },
  ]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ mainConcern: '', comments: '', status: 'New', date: '' });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setForm({ mainConcern: '', comments: '', status: 'New', date: '' });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrders([
      ...orders,
      {
        id: orders.length + 1,
        mainConcern: form.mainConcern,
        comments: form.comments,
        date: form.date || new Date().toISOString().split('T')[0],
        status: form.status,
      },
    ]);
    toggleModal();
  };

  return (
    <div className='orders-section'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Orders</h4>
        <Button color="primary" onClick={toggleModal}>
          <i className="ri-add-line me-1"></i> Add New Order
        </Button>
      </div>
      <Row>
        <Col md={10} lg={12} xl={12} className="mx-auto">
          <Card>
            <CardBody>
              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order #</th>
                      <th>Main Concern</th>
                      <th>Comments</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">No orders yet.</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.mainConcern}</td>
                          <td>{order.comments}</td>
                          <td>{order.date}</td>
                          <td>{order.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Add New Order</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="mainConcern">Main Concern</Label>
              <Input
                id="mainConcern"
                name="mainConcern"
                type="select"
                value={form.mainConcern}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select main concern</option>
                <option>Impression Kit</option>
                <option>Day time dual arch</option>
                <option>Night time dual arch</option>
                <option>Day time upper arch</option>
                <option>Day time lower arch</option>
                <option>Night time upper arch</option>
                <option>Night time lower arch</option>
                <option>Refinement Aligners</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="comments">Comments</Label>
              <Input
                id="comments"
                name="comments"
                type="textarea"
                value={form.comments}
                onChange={handleChange}
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    id="status"
                    name="status"
                    type="select"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option>New</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal} type="button">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Order
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientOrders; 