import React from "react";
import LineColumnArea from "./LineColumnArea";

import { Card, CardBody, Col, Row } from "reactstrap";

// Updated data for dental practice overview
const OverViewData = [
  {
    title: "Inquiries",
    count: "89",
    percentage: "8.2",
    color: "success",
  },
  {
    title: "Orders",
    count: "156",
    percentage: "12.5",
    color: "light",
  },
  {
    title: "Treatments Completed",
    count: "23",
    percentage: "3.1",
    color: "info",
  },
];

const OverView = () => {
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
