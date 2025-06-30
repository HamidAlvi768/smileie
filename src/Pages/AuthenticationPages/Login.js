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
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={12} sm={10} md={8} lg={6} xl={4}>
              <Card className="shadow border-0 rounded-4">
                <CardBody className="p-4">
                  <div>
                    <div className="text-center mb-4">
                      <Link to="/">
                        <img
                          src={logodark}
                          alt=""
                          height="32"
                          className="auth-logo logo-dark mx-auto d-block mb-2"
                        />
                        <img
                          src={logolight}
                          alt=""
                          height="32"
                          className="auth-logo logo-light mx-auto d-block"
                        />
                      </Link>
                    </div>
                    <h4 className="font-size-20 text-muted mt-2 text-center fw-semibold">
                      Welcome Back!
                    </h4>
                    <p className="mb-4 text-center text-secondary">
                      Sign in to continue to Smileie.
                    </p>
                    {error && (
                      <div className="alert alert-danger text-center" role="alert">
                        {typeof error === 'string' ? error : 'Login failed. Please try again.'}
                      </div>
                    )}
                    <Form className="form-horizontal" onSubmit={handleSubmit}>
                      <Row>
                        <Col xs={12}>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="email">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control form-control-lg"
                              id="email"
                              placeholder="Enter email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="userpassword"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control form-control-lg"
                              id="userpassword"
                              placeholder="Enter password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                            />
                          </div>

                          <Row className="align-items-center mb-3">
                            <Col xs={6}>
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
                            <Col xs={6} className="text-end">
                              <Link
                                to="/auth-recoverpw"
                                className="text-muted small"
                              >
                                <i className="mdi mdi-lock"></i> Forgot your password?
                              </Link>
                            </Col>
                          </Row>
                          <div className="d-grid mt-3">
                            <button
                              className="btn btn-primary btn-lg waves-effect waves-light"
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
              <div className="mt-4 text-center">
                <p className="text-white-50 mb-0">
                  © {new Date().getFullYear()} Developed by Jantrah Tech
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
