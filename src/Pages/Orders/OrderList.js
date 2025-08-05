import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Badge, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Enhanced components
import { withPageTransition } from "../../components/Common/PageTransition";
import ShimmerLoader from "../../components/Common/ShimmerLoader";
import EnhancedLayout, { EnhancedCard, DataGrid } from "../../components/Common/EnhancedLayout";

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
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state for demo
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
      // Date filter
      let dateMatch = true;
      if (filters.startDate) {
        dateMatch = dateMatch && (order.orderDate >= filters.startDate);
      }
      if (filters.endDate) {
        dateMatch = dateMatch && (order.orderDate <= filters.endDate);
      }
      return searchMatch && typeMatch && statusMatch && dateMatch;
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
    setFilters({ type: "All types", status: "All statuses", startDate: "", endDate: "" });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.type !== "All types" ||
    filters.status !== "All statuses" ||
    filters.startDate !== "" ||
    filters.endDate !== "" ||
    searchTerm.trim() !== "";

  return (
    <EnhancedLayout title="Orders" subtitle="Manage and track all orders">
      <Container fluid={true}>
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">Orders</h4>
            <p className="text-muted mb-0">Track and manage all patient orders</p>
          </Col>
          <Col md={4} xs={6} className="text-end">
            <div className="d-flex align-items-center justify-content-end">
              <div className="me-2">
                <small className="text-muted">Last updated</small>
                <div className="fw-bold">Just now</div>
              </div>
            </div>
          </Col>
        </Row>

        <EnhancedCard 
          title="Order Management"
          subtitle="Filter and search through orders"
          actions={
            <Button color="primary" onClick={() => navigate('/orders/new')}>
              <i className="fas fa-plus me-2"></i>New Order
            </Button>
          }
          loading={isLoading}
          empty={filteredOrders.length === 0 && !isLoading}
          emptyMessage="No orders found matching your criteria"
        >
          {/* Search and Filters */}
          <Row className="mb-3">
            <Col md={6}>
              <Label for="search" className="form-label">Search Orders</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by order ID, patient name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
              />
            </Col>
            <Col md={2}>
              <Label for="filter-type" className="form-label">Type</Label>
              <Input
                id="filter-type"
                type="select"
                value={filters.type}
                onChange={handleFilterChange}
                className="form-control"
              >
                {filterOptions.type.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Input>
            </Col>
            <Col md={2}>
              <Label for="filter-status" className="form-label">Status</Label>
              <Input
                id="filter-status"
                type="select"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-control"
              >
                {filterOptions.status.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Input>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                color="outline-secondary" 
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="w-100"
              >
                <i className="fas fa-times me-2"></i>Clear
              </Button>
            </Col>
          </Row>

          {/* Orders Table */}
          <div className="table-responsive">
            <Table className="table-nowrap align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Type</th>
                  <th scope="col">Patient</th>
                  <th scope="col">Doctor</th>
                  <th scope="col">Order Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Shimmer loading rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><div className="shimmer-line" style={{ width: '80%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '60%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '70%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '75%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '50%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '40%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '30%', height: '16px' }}></div></td>
                      <td><div className="shimmer-line" style={{ width: '60%', height: '16px' }}></div></td>
                    </tr>
                  ))
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="fw-bold">{order.id}</div>
                      </td>
                      <td>
                        <Badge color="info" className="font-size-12">
                          {order.type}
                        </Badge>
                      </td>
                      <td>
                        <div className="fw-bold">{order.patient}</div>
                      </td>
                      <td>
                        <div className="text-muted">{order.doctor}</div>
                      </td>
                      <td>
                        <div>{order.orderDate}</div>
                      </td>
                      <td>
                        <Badge 
                          color={order.status === 'Delivered' ? 'success' : 
                                 order.status === 'Shipped' ? 'warning' : 'secondary'}
                          className="font-size-12"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="fw-bold">${order.amount}</div>
                      </td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <i className="fas fa-eye me-1"></i>View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {!isLoading && filteredOrders.length === 0 && (
            <div className="text-center p-4">
              <i className="fas fa-box-open text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <h5 className="text-muted">No orders found</h5>
              <p className="text-muted">Try adjusting your search criteria or create a new order.</p>
            </div>
          )}
        </EnhancedCard>
      </Container>
    </EnhancedLayout>
  );
};

// Export with page transition
export default withPageTransition(OrderList); 