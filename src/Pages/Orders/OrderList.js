import React from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Badge } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const orders = [
  {
    id: "ORD-20240528-001",
    type: "Impression Kit",
    patient: "Stephen Dyos",
    doctor: "Dr Mark Kruchar",
    orderDate: "2025-05-28",
    status: "Shipped",
    amount: 109,
  },
  {
    id: "ORD-20240527-002",
    type: "Aligner",
    patient: "Laura Saez",
    doctor: "Dr Laura Smith",
    orderDate: "2025-05-27",
    status: "Delivered",
    amount: 350,
  },
];

const OrderList = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs
          title="Smileie"
          breadcrumbItem="Orders"
        />
        <h4 className="mb-4">Orders</h4>
        <Card>
          <CardBody>
            <Table hover responsive className="align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Type</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.type}</td>
                    <td>{order.patient}</td>
                    <td>{order.doctor}</td>
                    <td>{order.orderDate}</td>
                    <td>
                      <Badge color={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'secondary'}>{order.status}</Badge>
                    </td>
                    <td>${order.amount}</td>
                    <td>
                      <Button color="primary" size="sm" onClick={() => navigate('/orders/detail')}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default OrderList; 