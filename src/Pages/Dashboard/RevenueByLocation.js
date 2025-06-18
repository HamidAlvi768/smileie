import React from 'react';
import Vector from "./MapVector";
import {
    Card,
    CardBody,
    Col,
} from "reactstrap";

import { Link } from 'react-router-dom';

const RevenueByLocation = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardBody>
                        <h5 className="card-title mb-3">Patient Distribution</h5>

                        <div style={{ height: "226px" }}>
                            <Vector
                                value="us_aea"
                                color="rgb(212, 218, 221)"
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
                            <div className="progress" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: "75%" }}></div>
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