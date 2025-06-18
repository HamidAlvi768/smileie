import React from "react";
import RadialChart from "./RadialChart";

import { Card, CardBody, Col, Row } from "reactstrap";

// Updated data for patient sources
const PatientSourceData = [
    {
        title: "Referrals",
        count: "425",
        icon: "ri-user-follow-line",
        bgcolor: "primary"
    },
    {
        title: "Website",
        count: "312",
        icon: "ri-global-line",
        bgcolor: "success"
    },
    {
        title: "Direct",
        count: "185",
        icon: "ri-user-line",
        bgcolor: "warning"
    }
];

const SocialSource = () => {
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title">Patient Sources</h5>
              </div>
              <div className="flex-shrink-0">
                <select className="form-select form-select-sm mb-0 my-n1">
                  {[
                    "Last 6 Months",
                    "Last 3 Months",
                    "Last Month",
                    "Last Week",
                    "Today",
                  ].map((item, key) => (
                    <option key={key} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* RadialChart */}
            <RadialChart />
            <Row>
              {PatientSourceData.map((item, key) => (
                <div key={key} className="col-4">
                  <div className="social-source text-center mt-3">
                    <div className="avatar-xs mx-auto mb-3">
                      <span
                        className={
                          "avatar-title rounded-circle font-size-18 bg-" +
                          item.bgcolor
                        }
                      >
                        <i className={item.icon + " text-white"}></i>
                      </span>
                    </div>
                    <h5 className="font-size-15">{item.title}</h5>
                    <p className="text-muted mb-0">{item.count} patients</p>
                  </div>
                </div>
              ))}
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default SocialSource;
