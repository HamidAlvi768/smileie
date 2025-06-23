import React from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import {
    Card,
    CardBody,
    Col,
} from "reactstrap";

import { Link } from 'react-router-dom';

const markers = [
  { latLng: [40.7128, -74.0060], name: 'New York (553)' },
  { latLng: [34.0522, -118.2437], name: 'Los Angeles (387)' },
  { latLng: [51.5074, -0.1278], name: 'London (520)' }
];

const RevenueByLocation = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardBody>
                        <h5 className="card-title mb-3">Patient Distribution</h5>

                        <div style={{ height: "226px" }}>
                            <VectorMap
                              map={worldMill}
                              markers={markers}
                              markerStyle={{
                                initial: { fill: '#F8E23B', stroke: '#383f47' }
                              }}
                              regionStyle={{
                                initial: {
                                  fill: "#a0d8f1", // light blue for land
                                  "fill-opacity": 1,
                                  stroke: "#ffffff",
                                  "stroke-width": 0.5,
                                  "stroke-opacity": 0.8
                                },
                                hover: {
                                  fill: "#4fc3f7", // darker blue on hover
                                  "fill-opacity": 1
                                },
                                selected: {
                                  fill: "#0288d1" // even darker blue when selected
                                }
                              }}
                              containerStyle={{
                                width: '100%',
                                height: '226px'
                              }}
                            />
                        </div>

                        <div className="mt-4">
                            <div className="d-flex justify-content-between mb-3">
                                <div>
                                    <p className="text-muted mb-1">Total Patients</p>
                                    <h5 className="mb-0">1,284</h5>
                                </div>
                                <div>
                                    <p className="text-muted mb-1">New This Month</p>
                                    <h5 className="mb-0">156</h5>
                                </div>
                            </div>
                            {/* <div className="progress" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: "75%" }}></div>
                            </div> */}
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