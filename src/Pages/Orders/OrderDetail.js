import React from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Badge } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const order = {
  id: "ORD-20240528-001",
  type: "Impression Kit",
  patient: "Stephen Dyos",
  doctor: "Dr Mark Kruchar",
  orderDate: "2025-05-28",
  status: "Shipped",
  items: [
    { name: "Impression Kit", qty: 1, price: 99 },
    { name: "Shipping", qty: 1, price: 10 },
  ],
  timeline: [
    { label: "Ordered", date: "2025-05-28", completed: true },
    { label: "In Production", date: "2025-05-29", completed: true },
    { label: "Shipped", date: "2025-05-30", completed: true },
    { label: "Delivered", date: "2025-06-02", completed: false },
  ],
  payment: {
    status: "Paid",
    amount: 109,
    method: "Credit Card",
    receipts: [
      { id: "RCPT-001", date: "2025-05-28", amount: 109, url: "#" },
    ],
  },
};

const OrderDetail = () => {
  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs
          title="Smileie"
          breadcrumbItem="Orders"
          breadcrumbItem2={`Order #${order.id}`}
        />
        <h4 className="mb-4">Order Details</h4>
        <Row>
          {/* Order Summary */}
          <Col md={4}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="mb-3">Order Summary</h5>
                <div className="mb-2"><b>Order ID:</b> {order.id}</div>
                <div className="mb-2"><b>Type:</b> {order.type}</div>
                <div className="mb-2"><b>Patient:</b> {order.patient}</div>
                {/* <div className="mb-2"><b>Doctor:</b> {order.doctor}</div> */}
                <div className="mb-2"><b>Order Date:</b> {order.orderDate}</div>
                <div className="mb-2"><b>Status:</b> <Badge color={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'secondary'}>{order.status}</Badge></div>
                <hr />
                <h6>Items</h6>
                <ul className="mb-0 ps-3">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} <span className="text-muted">x{item.qty}</span> <span className="float-end">${item.price}</span></li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>

          {/* Timeline Tracker */}
          <Col md={4}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="mb-3">Order Timeline</h5>
                <ul className="timeline list-unstyled mb-0">
                  {order.timeline.map((step, idx) => (
                    <li key={idx} className="mb-3 d-flex align-items-center">
                      <span
                        className={`d-inline-block rounded-circle me-3 ${step.completed ? 'bg-success' : 'bg-light'}`}
                        style={{ width: 18, height: 18, border: '2px solid #198754' }}
                      >
                        {step.completed && <i className="ri-check-line text-white" style={{ fontSize: 12, marginLeft: 2 }}></i>}
                      </span>
                      <div>
                        <div className="fw-semibold">{step.label}</div>
                        <div className="small text-muted">{step.date}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>

          {/* Payment Details */}
          <Col md={4}>
            <Card className="mb-4">
              <CardBody>
                <h5 className="mb-3">Payment Details</h5>
                <div className="mb-2"><b>Status:</b> <Badge color={order.payment.status === 'Paid' ? 'success' : 'warning'}>{order.payment.status}</Badge></div>
                <div className="mb-2"><b>Amount:</b> ${order.payment.amount}</div>
                <div className="mb-2"><b>Method:</b> {order.payment.method}</div>
                <hr />
                <h6>Receipts</h6>
                <Table size="sm" borderless className="mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payment.receipts.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.date}</td>
                        <td>${r.amount}</td>
                        <td>
                          <Button color="link" size="sm" href={r.url} target="_blank">
                            <i className="ri-download-2-line"></i> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderDetail; 