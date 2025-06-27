import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecentPatients } from '../../store/patients/actions';

const LatestTransation = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const recentPatients = useSelector(state => state.patients.recentPatients) || [];

    useEffect(() => {
        dispatch(getRecentPatients());
    }, [dispatch]);

    const handleViewPatient = (patientId) => {
        navigate(`/patients/${patientId}`);
    };

    return (
        <React.Fragment>
            {/* <Row> */}
                <Col lg={8}>
                    <div className="card" style={{height: "95%"}}>
                        <div className="card-body">
                            <h4 className="card-title mb-4">Recent Patients</h4>

                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">Patient Name</th>
                                            <th scope="col">Age</th>
                                            <th scope="col">Contact</th>
                                            <th scope="col">Latest Scan</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPatients.map((item, key) => (
                                            <tr key={item.id || key}>
                                                <td>
                                                    <h5 className="font-size-15 mb-0">{`${item.first_name || ''} ${item.last_name || ''}`}</h5>
                                                </td>
                                                <td>{item.age}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.latest_scan}</td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => handleViewPatient(item.id)}
                                                    >
                                                        View <i className="ri-eye-line align-middle ms-1"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            {/* </Row> */}
        </React.Fragment>
    )
}

export default LatestTransation;