import React from "react";

import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

const RecoverPassword = () => {
  document.title =
    "Recover Password | Smileie - React Admin & Dashboard Template";
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
                      <form className="form-horizontal" action="#">
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
                              />
                            </div>
                            <div className="d-grid mt-4">
                              <a
                                href="/dashboard"
                                className="btn btn-primary waves-effect waves-light"
                                type="submit"
                              >
                                Send Email
                              </a>
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
