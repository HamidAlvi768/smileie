import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getContactUsAPI } from "../../helpers/api_helper";

const ContactUs = () => {
  document.title = "Contact Us | Smileie";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getContactUsAPI();
        if (response.status === "success" && Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        setError("Failed to load messages.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = messages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(messages.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs title="Smileie" breadcrumbItem="Settings" breadcrumbItem2="Contact Us" />
          
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Customer Messages</h4>
                <div className="text-muted">
                  Total: {messages.length} message{messages.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <Row>
                {loading ? (
                  <Col>
                    <div className="text-center text-muted py-5">Loading messages...</div>
                  </Col>
                ) : error ? (
                  <Col>
                    <div className="text-center text-danger py-5">{error}</div>
                  </Col>
                ) : messages.length === 0 ? (
                  <Col>
                    <div className="text-center text-muted py-5">
                      No messages from customers yet.
                    </div>
                  </Col>
                ) : (
                  <Col>
                    <div className="table-responsive">
                      <Table className="table-centered table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{width: '30%'}}>Customer</th>
                            <th scope="col" style={{width: '60%'}}>Message</th>
                            <th scope="col" style={{width: '10%'}}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentMessages.map((msg) => (
                            <tr key={msg.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm flex-shrink-0 me-3">
                                    <span className="avatar-title bg-light text-primary rounded-circle font-size-20">
                                      <i className="ri-user-3-line"></i>
                                    </span>
                                  </div>
                                  <div className="flex-grow-1">
                                    <h6 className="font-size-14 mb-1">{msg.full_name}</h6>
                                    <div className="text-muted small">{msg.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-muted" style={{
                                  maxWidth: '400px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {msg.message}
                                </div>
                              </td>
                              <td>
                                <span className="text-muted small">
                                  {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted small">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, messages.length)} of {messages.length} messages
                        </div>
                        <Pagination aria-label="Page navigation example">
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink first onClick={() => paginate(1)} />
                          </PaginationItem>
                          <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                          </PaginationItem>
                          {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index} active={page === currentPage}>
                              {page === '...' ? (
                                <PaginationLink disabled>{page}</PaginationLink>
                              ) : (
                                <PaginationLink onClick={() => paginate(page)}>{page}</PaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                          </PaginationItem>
                          <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink last onClick={() => paginate(totalPages)} />
                          </PaginationItem>
                        </Pagination>
                      </div>
                    )}
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ContactUs; 