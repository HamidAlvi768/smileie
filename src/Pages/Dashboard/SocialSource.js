import React from "react";
import RadialChart from "./RadialChart";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useSelector } from 'react-redux';

// Map API source names to icons/colors
const sourceIconMap = {
  "Referral": { icon: "ri-user-follow-line", bgcolor: "success" },
  "Referrals": { icon: "ri-user-follow-line", bgcolor: "success" },
  "Website": { icon: "ri-global-line", bgcolor: "primary" },
  "Direct": { icon: "ri-user-line", bgcolor: "warning" },
};

const SocialSource = () => {
  const stats = useSelector((state) => state.stats.stats);
  const sources = stats && stats.patient_sources ? stats.patient_sources : [];

  // Prepare data for chart
  const chartLabels = sources.map(s => s.source);
  const chartSeries = sources.map(s => s.patient_count);
  const chartColors = sources.map(s => {
    const map = sourceIconMap[s.source] || sourceIconMap[s.source + 's'] || {};
    if (map.bgcolor === "success") return "#099680";
    if (map.bgcolor === "primary") return "#4aa3ff";
    if (map.bgcolor === "warning") return "#f0ad4e";
    return "#adb5bd";
  });

  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-center mb-2">
              <div className="flex-grow-1">
                <h5 className="card-title">Patient Sources</h5>
              </div>
            </div>
            {/* RadialChart with API data */}
            <RadialChart labels={chartLabels} series={chartSeries} colors={chartColors} />
            <Row>
              {sources.map((item, key) => {
                const map = sourceIconMap[item.source] || sourceIconMap[item.source + 's'] || {};
                return (
                  <div key={key} className="col-4">
                    <div className="social-source text-center mt-3">
                      <div className="avatar-xs mx-auto mb-3">
                        <span
                          className={
                            "avatar-title rounded-circle font-size-18 bg-" +
                            (map.bgcolor || "secondary")
                          }
                        >
                          <i className={(map.icon || "ri-question-line") + " text-white"}></i>
                        </span>
                      </div>
                      <h5 className="font-size-15">{item.source}</h5>
                      <p className="text-muted mb-0">{item.patient_count} patients</p>
                    </div>
                  </div>
                );
              })}
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default SocialSource;
