import React, { useEffect } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth/login/actions";
import { useNavigate } from "react-router-dom";

const Login = () => {
  document.title = "Login | Smileie - React Admin & Dashboard Template";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.login);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  useEffect(() => {
    document.body.className = "bg-pattern";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }, navigate));
  };
  return (
    <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className="p-4">
                  <div>
                    <div className="text-center">
                      <Link to="/">
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
                      Welcome Back !
                    </h4>
                    <p className="mb-5 text-center">
                      Sign in to continue to Smileie.
                    </p>
                    {error && (
                      <div className="alert alert-danger text-center" role="alert">
                        {typeof error === 'string' ? error : 'Login failed. Please try again.'}
                      </div>
                    )}
                    <Form className="form-horizontal" onSubmit={handleSubmit}>
                      <Row>
                        <Col md={12}>
                          <div className="mb-4">
                            <label className="form-label" htmlFor="email">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="form-label"
                              htmlFor="userpassword"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="userpassword"
                              placeholder="Enter password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                            />
                          </div>

                          <Row>
                            <Col>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customControlInline"
                                />
                                <label
                                  className="form-label form-check-label"
                                  htmlFor="customControlInline"
                                >
                                  Remember me
                                </label>
                              </div>
                            </Col>
                            <Col className="col-7">
                              <div className="text-md-end mt-3 mt-md-0">
                                <Link
                                  to="/auth-recoverpw"
                                  className="text-muted"
                                >
                                  <i className="mdi mdi-lock"></i> Forgot your
                                  password?
                                </Link>
                              </div>
                            </Col>
                          </Row>
                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-primary waves-effect waves-light"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? 'Logging in...' : 'Log In'}
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                {/* <p className="text-white-50">
                  Don't have an account ?{" "}
                  <Link to="/auth-register" className="fw-medium text-primary">
                    {" "}
                    Register{" "}
                  </Link>{" "}
                </p> */}
                <p className="text-white-50">
                  © {new Date().getFullYear()} Developed {" "}
                   by Jantrah Tech
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Login;
