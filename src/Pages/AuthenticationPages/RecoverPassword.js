import React, { useState } from "react";

import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Container, Row, Col, Card, CardBody, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import { passwordResetAPI } from "../../helpers/api_helper";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  document.title =
    "Recover Password | Smileie - React Admin & Dashboard Template";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const response = await passwordResetAPI(email);
      if (response.success) {
        setSuccess(response.message || "Password reset instructions sent to your email.");
      } else {
        setError(response.message || "Failed to send password reset email.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="bg-pattern" style={{ height: "100vh" }}>
        <div className="bg-overlay"></div>
        <div className="account-pages pt-5">
          <Container>
            <Row className="justify-content-center">
              <Col lg={6} md={8} xl={4}>
                <Card className="mt-5">
                  <CardBody className="p-4">
                    <div className="">
                      <div className="text-center">
                        <Link to="/" className="">
                          <img
                            src={logodark}
                            alt=""
                            height="24"
                            className="auth-logo logo-dark mx-auto"
                          />
                          <img
                            src={logolight}
                            alt=""
                            height="24"
                            className="auth-logo logo-light mx-auto"
                          />
                        </Link>
                      </div>
                      <h4 className="font-size-18 text-muted mt-2 text-center">
                        Reset Password
                      </h4>
                      <p className="mb-5 text-center">
                        Reset your Password with Smileie.
                      </p>
                      {success && <Alert color="success">{success}</Alert>}
                      {error && <Alert color="danger">{error}</Alert>}
                      <form className="form-horizontal" onSubmit={handleSubmit}>
                        <Row>
                          <Col md={12}>
                            <div className="alert alert-warning alert-dismissible">
                              Enter your <b>Email</b> and instructions will be
                              sent to you!
                            </div>

                            <div className="mt-4">
                              <label className="form-label" htmlFor="useremail">
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="useremail"
                                placeholder="Enter email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={loading}
                              />
                            </div>
                            <div className="d-grid mt-4">
                              <button
                                className="btn btn-primary waves-effect waves-light"
                                type="submit"
                                disabled={loading || !email}
                              >
                                {loading ? "Sending..." : "Send Email"}
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </form>
                      <div className="text-center mt-3">
                        <Link to="/login" className="btn btn-link p-0 text-primary" style={{textDecoration: 'underline', fontWeight: 500}}>
                          <i className="mdi mdi-arrow-left me-1"></i> Back to Login
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  {/* <p className="text-white-50">Don't have an account ?  <Link to="/auth-register" className="fw-medium text-primary"> Register  </Link> </p> */}
                  <p className="text-white-50">
                    © {new Date().getFullYear()} Developed by Jantrah Tech
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RecoverPassword;
