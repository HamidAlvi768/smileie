import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";

const UserPanel = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/patients/monitored");
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-user-line"></i>
                    </div>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Total Users</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0">1.5k</h5>
                    <button
                      type="button"
                      className="btn btn-soft-primary btn-sm text-primary ms-auto"
                      onClick={handleViewAll}
                    >
                      View All{" "}
                      <i className="ri-arrow-right-line align-middle ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-user-settings-line"></i>
                    </div>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Active Doctors</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0">24</h5>
                    <button
                      type="button"
                      className="btn btn-soft-primary btn-sm text-primary ms-auto"
                      onClick={handleViewAll}
                    >
                      View All{" "}
                      <i className="ri-arrow-right-line align-middle ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-user-heart-line"></i>
                    </div>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Total Patients</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0">1.2k</h5>
                    <button
                      type="button"
                      className="btn btn-soft-primary btn-sm text-primary ms-auto"
                      onClick={handleViewAll}
                    >
                      View All{" "}
                      <i className="ri-arrow-right-line align-middle ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-scan-2-line"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Today's Scans</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0">28</h5>
                    {/* <button
                      type="button"
                      className="btn btn-soft-primary btn-sm text-primary ms-auto"
                      onClick={handleViewAll}
                    >
                      View All{" "}
                      <i className="ri-arrow-right-line align-middle ms-1"></i>
                    </button> */}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-inbox-archive-line"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Impression Kits Ordered</p>
                  </div>
                  <h5 className="mb-0">156</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="fas fa-teeth"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Aligners Ordered</p>
                  </div>
                  <h5 className="mb-0">32</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-shield-user-line"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Retainers Ordered</p>
                  </div>
                  <h5 className="mb-0">89</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="ri-sun-line"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Teeth Whitening Kit Ordered</p>
                  </div>
                  <h5 className="mb-0">45</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default UserPanel;
