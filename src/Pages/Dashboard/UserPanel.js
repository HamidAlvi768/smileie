import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStats } from "../../store/stats/actions";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";

// Simple CountUp animation component
const CountUp = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    let startTime = null;
    let rafId;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setCount(value);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animate(performance.now());
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);
  return <span>{count}</span>;
};

const UserPanel = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.stats.stats);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  const handleViewAll = () => {
    navigate("/patients/monitored");
  };

  const handleViewAllDoctors = () => {
    navigate("/doctors");
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
                      <i className="ri-user-settings-line"></i>
                    </div>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Doctors</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0"><CountUp end={stats.doctors ?? 0} /></h5>
                    <button
                      type="button"
                      className="btn btn-soft-primary btn-sm text-primary ms-auto"
                      onClick={handleViewAllDoctors}
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
                    <h5 className="mb-0"><CountUp end={stats.patients ?? 0} /></h5>
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
                    <h5 className="mb-0"><CountUp end={stats.scans ?? 0} /></h5>
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
                      <i className="fas fa-teeth"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center mb-1">
                    <p className="mb-0">Aligners</p>
                  </div>
                  <h5 className="mb-0"><CountUp end={stats.aligners ?? 0} /></h5>
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
