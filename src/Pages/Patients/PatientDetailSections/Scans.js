import React, { useState } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';

const mockScans = Array.from({ length: 8 }, (_, i) => ({
  protocol: `Aligner protocol - Stephen Dyos`,
  dueOn: `2025-05-27 12:1${i} GMT+5`,
  uploadedOn: `2025-05-27 11:5${i} GMT+5`,
}));

const Scans = ({ patient }) => {
  const [sortBy, setSortBy] = useState('dueOn');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedScans = [...mockScans].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="scans-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Scans</h4>
        <span className="text-muted small">8 result(s)</span>
      </div>
      <Card>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>PROTOCOL</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('dueOn')}>
                    DUE ON{' '}
                    <i className={`mdi mdi-arrow-${sortBy === 'dueOn' && sortOrder === 'asc' ? 'up' : 'down'}-bold`}></i>
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => handleSort('uploadedOn')}>
                    UPLOADED ON{' '}
                    <i className={`mdi mdi-arrow-${sortBy === 'uploadedOn' && sortOrder === 'asc' ? 'up' : 'down'}-bold`}></i>
                  </th>
                  <th>View scan</th>
                </tr>
              </thead>
              <tbody>
                {sortedScans.map((scan, idx) => (
                  <tr key={idx}>
                    <td>{scan.protocol}</td>
                    <td>{scan.dueOn}</td>
                    <td>{scan.uploadedOn}</td>
                    <td>
                      <Button color="primary" size="sm" onClick={() => navigate(`/patients/${id}/scans/${idx}`)}>
                        <i className="mdi mdi-eye-outline me-1"></i>View scan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Scans; 