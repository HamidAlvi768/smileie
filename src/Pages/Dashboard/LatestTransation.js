import React from 'react';
import { Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';



// Updated data for recent patients
const RecentPatientsData = [
    {
        id: "john-smith",
        patientName: "John Smith",
        age: "32",
        phone: "+1 (555) 123-4567",
        latestScan: "2024-03-15",
        color: "success"
    },
    {
        id: "sarah-johnson",
        patientName: "Sarah Johnson",
        age: "28",
        phone: "+1 (555) 234-5678",
        latestScan: "2024-03-10",
        color: "primary"
    },
    {
        id: "michael-brown",
        patientName: "Michael Brown",
        age: "45",
        phone: "+1 (555) 345-6789",
        latestScan: "2024-03-05",
        color: "info"
    },
    {
        id: "emily-davis",
        patientName: "Emily Davis",
        age: "35",
        phone: "+1 (555) 456-7890",
        latestScan: "2024-02-28",
        color: "warning"
    }
];

const LatestTransation = () => {
    const navigate = useNavigate();

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
                                        {RecentPatientsData.map((item, key) => (
                                            <tr key={key}>
                                                <td>
                                                    <h5 className="font-size-15 mb-0">{item.patientName}</h5>
                                                </td>
                                                <td>{item.age}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.latestScan}</td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-soft-primary btn-sm"
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