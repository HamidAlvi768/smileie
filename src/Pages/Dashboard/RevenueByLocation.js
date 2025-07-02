import React from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import {
    Card,
    CardBody,
    Col,
} from "reactstrap";

import { Link } from 'react-router-dom';

// Data aggregated by country using ISO 3166-1 alpha-2 codes
const countryData = {
  'US': 940,  // New York (553) + Los Angeles (387)
  'GB': 520,  // London
  // Add other countries here e.g., 'CA': 300
};

const RevenueByLocation = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardBody>
                        <h5 className="card-title mb-3">Patient Distribution by Country</h5>

                        <div style={{ height: "226px" }}>
                            <VectorMap
                                map={worldMill}
                                backgroundColor="transparent" // To match the card's background
                                series={{
                                    regions: [
                                        {
                                            values: countryData,
                                            scale: ["#56B3B4"], // Teal for countries with data
                                        },
                                    ],
                                }}
                                onRegionTipShow={(event, label, code) => {
                                    // Check if the country has data
                                    if (countryData[code]) {
                                        label.html(
                                            `${label.html()}: ${countryData[code]} Patients`
                                        );
                                    } else {
                                         label.html(
                                            `${label.html()}: No Data`
                                        );
                                    }
                                }}
                                regionStyle={{
                                    initial: {
                                        fill: "#d1d5db", // Neutral grey for countries with no data
                                    },
                                    hover: {
                                        "fill-opacity": 0.8,
                                        cursor: 'pointer'
                                    },
                                }}
                                containerStyle={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        </div>

                        <div className="mt-4">
                            <div className="d-flex justify-content-between mb-3">
                                <div>
                                    <p className="text-muted mb-1">Total Patients</p>
                                    {/* Updated total from countryData */}
                                    <h5 className="mb-0">1,460</h5>
                                </div>
                                <div>
                                    <p className="text-muted mb-1">New This Month</p>
                                    <h5 className="mb-0">156</h5>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/patients/monitored" className="btn btn-primary btn-sm">View Patient Details</Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RevenueByLocation;