import React from "react";
import LineColumnArea from "./LineColumnArea";

import { Card, CardBody, Col, Row } from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import { getStats } from '../../store/stats/actions';

const OverView = () => {
  const dispatch = useDispatch();
  const stats = useSelector(state => state.stats.stats);
  React.useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);
  const overview = stats && stats.overview ? stats.overview : {};
  const OverViewData = [
    {
      title: "Total Patients",
      count: overview.total_patients ?? 0,
      color: "success",
    },
    {
      title: "Activated Patients",
      count: overview.activated_patients ?? 0,
      color: "light",
    },
    {
      title: "Patients with Scans",
      count: overview.patients_with_scans ?? 0,
      color: "info",
    },
  ];
  return (
    <React.Fragment>
      <Col xl={8}>
        <Card style={{ height: "96%" }}>
          <CardBody className="h-80">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title">Overview</h5>
              </div>
              <div className="flex-shrink-0">
                <div>
                  <button
                    type="button"
                    className="btn btn-soft-secondary btn-sm me-1"
                  >
                    ALL
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft-primary btn-sm me-1"
                  >
                    1M
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft-secondary btn-sm me-1"
                  >
                    3M
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft-secondary btn-sm me-1 active"
                  >
                    6M
                  </button>
                </div>
              </div>
            </div>
            <div>
              <LineColumnArea />
            </div>
          </CardBody>
          <CardBody className="border-top">
            <div className="text-muted text-center">
              <Row>
                {OverViewData.map((item, key) => (
                  <Col md={4} key={key} className="border-end">
                    <div className="d-flex w-full justify-content-center gap-3">
                      <p className="mb-2">
                        <i
                          className={
                            "mdi mdi-circle font-size-12 me-1 text-" +
                            item.color
                          }
                        ></i>{" "}
                        {item.title}
                      </p>
                      <h5 className="font-size-16 mb-0">
                        {item.count}{" "}
                      </h5>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default OverView;
