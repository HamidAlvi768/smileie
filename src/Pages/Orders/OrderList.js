import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Badge, Input, Label } from "reactstrap";
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

const filterOptions = {
  type: ["All types", ...Array.from(new Set(orders.map(o => o.type)))],
  status: ["All statuses", ...Array.from(new Set(orders.map(o => o.status)))],
};

const filterLabels = {
  type: "Type",
  status: "Status",
};

const OrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "All types",
    status: "All statuses",
  });

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const searchMatch = searchTerm.trim() === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient.toLowerCase().includes(searchTerm.toLowerCase());
      // Type filter
      const typeMatch = filters.type === "All types" || order.type === filters.type;
      // Status filter
      const statusMatch = filters.status === "All statuses" || order.status === filters.status;
      return searchMatch && typeMatch && statusMatch;
    });
  }, [searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id.replace("filter-", "")]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    setFilters({ type: "All types", status: "All statuses" });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.type !== "All types" ||
    filters.status !== "All statuses" ||
    searchTerm.trim() !== "";

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
            {/* Filter Section */}
            <div className="control-panel mb-3">
              <Row className="align-items-end g-2">
                <Col lg={3} md={4} sm={6} xs={12}>
                  <Label className="form-label" htmlFor="search-orders">Search Orders</Label>
                  <Input
                    id="search-orders"
                    type="text"
                    placeholder="Search by order ID, patient..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </Col>
                {Object.keys(filterOptions).map((key) => (
                  <Col lg={2} md={3} sm={6} xs={12} key={key}>
                    <Label className="form-label" htmlFor={`filter-${key}`}>{filterLabels[key]}</Label>
                    <Input
                      id={`filter-${key}`}
                      type="select"
                      value={filters[key]}
                      onChange={handleFilterChange}
                    >
                      {filterOptions[key].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Input>
                  </Col>
                ))}
                <Col lg={2} md={3} sm={6} xs={12} className="mt-2 mt-lg-0">
                  {hasActiveFilters && (
                    <Button color="outline-secondary" size="sm" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
            <Table hover responsive className="align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Type</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.type}</td>
                      <td>{order.patient}</td>
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
                  ))
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default OrderList; 