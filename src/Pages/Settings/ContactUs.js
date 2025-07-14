import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const ContactUs = () => {
  document.title = "Contact Us | Smileie";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://smileie.jantrah.com/backend/api/contactus");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.data)) {
          setMessages(data.data);
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

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs title="Settings" breadcrumbItem="Contact Us" />
          {/* <h4 className="mb-4">Customer Messages</h4> */}
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
              messages.map((msg) => (
                <Col xl={4} md={6} sm={12} key={msg.id} className="mb-4">
                  <Card className="shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm flex-shrink-0 me-3">
                            <span className="avatar-title bg-light text-primary rounded-circle font-size-20">
                              <i className="ri-user-3-line"></i>
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-16 mb-1">{msg.full_name}</h5>
                            <div className="text-muted small">{msg.email}</div>
                          </div>
                        </div>
                        <div className="text-muted small text-end" style={{minWidth: '110px'}}>
                          {msg.created_at ? msg.created_at.split(" ")[0] : ""}
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="text-muted">{msg.message}</div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ContactUs; 