import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import {
    Card,
    CardBody,
    Col,
} from "reactstrap";

import { Link } from 'react-router-dom';
import { getPatients } from '../../store/patients/actions';
import { getCountryCode } from './countries';

// Data aggregated by country using ISO 3166-1 alpha-2 codes
const RevenueByLocation = () => {
    const dispatch = useDispatch();
    const stats = useSelector(state => state.stats.stats);
    
    // Get all patients list from Redux
    const patients = useSelector(state => state.patients && state.patients.patients ? state.patients.patients : []);
    const patientsLoading = useSelector(state => state.patients.loading);

    // Fetch patients data on component mount
    useEffect(() => {
        dispatch(getPatients());
    }, [dispatch]);

    // Calculate new patients this month
    const getNewThisMonth = () => {
        const now = new Date();
        const thisMonth = now.getMonth(); // 0-11 (January = 0)
        const thisYear = now.getFullYear();

        console.log(`Current date: ${now}`);
        console.log(`Filtering for month: ${thisMonth} (${now.toLocaleString('default', { month: 'long' })}) and year: ${thisYear}`);
        console.log("Patients data:", patients);

        if (!Array.isArray(patients) || patients.length === 0) {
            console.log("Patients array is empty or not an array.");
            return 0;
        }

        const filteredPatients = patients.filter(patient => {
            if (!patient.created_at) {
                console.log("Patient is missing created_at property:", patient);
                return false;
            }

            const created = new Date(patient.created_at);
            
            // Check if the date is valid
            if (isNaN(created.getTime())) {
                console.log(`Invalid date format for patient: ${patient.created_at}`, patient);
                return false;
            }

            const createdMonth = created.getMonth();
            const createdYear = created.getFullYear();

            const isMatch = createdMonth === thisMonth && createdYear === thisYear;
            
            if (isMatch) {
                console.log(`✓ Patient matched - Created: ${patient.created_at}, Name: ${patient.first_name} ${patient.last_name}`);
            }

            return isMatch;
        });

        console.log(`Total patients: ${patients.length}, This month: ${filteredPatients.length}`);
        return filteredPatients.length;
    };

    const newThisMonthCount = getNewThisMonth();

    // Show loading state if patients are being fetched
    if (patientsLoading) {
        console.log("Loading patients data...");
    }

    // Use stats['global-stats'] for country data
    const countryData = React.useMemo(() => {
      const arr = stats && stats['global-stats'] ? stats['global-stats'] : [];
      // Map country names to patient counts (for display)
      // If you need ISO codes, you may need a mapping function
      const data = {};
      arr.forEach(item => {
        if (item.country && item['patient-count']) {
          // You may want to map country names to ISO codes here
          data[getCountryCode(item.country)] = item['patient-count'];
        }
      });
      return data;
    }, [stats]);


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
                                    <h5 className="mb-0">{stats.patients ?? 0}</h5>
                                </div>
                                <div>
                                    <p className="text-muted mb-1">New This Month</p>
                                    <h5 className="mb-0">{newThisMonthCount}</h5>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/patients" className="btn btn-primary btn-sm">View Patient Details</Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RevenueByLocation;