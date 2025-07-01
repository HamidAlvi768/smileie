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
    { id: 1, mainConcern: 'Impression Kit', comments: 'Send ASAP' },
    { id: 2, mainConcern: 'Day time dual arch', comments: 'Patient prefers day time' },
    { id: 3, mainConcern: 'Refinement Aligners', comments: 'Second refinement needed' },
  ]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ mainConcern: '', comments: '' });

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setForm({ mainConcern: '', comments: '' });
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
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">No orders yet.</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.mainConcern}</td>
                          <td>{order.comments}</td>
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