import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { WEB_APP_URL } from '../../../config';

const ScanDetail = () => {
  const navigate = useNavigate();
  const { id, arch, idx } = useParams();
  const dispatch = useDispatch();
  const { scanDetail, scanDetailLoading, scanDetailError } = useSelector(state => state.patients);

  useEffect(() => {
    if (id && idx) {
      dispatch({ type: 'GET_SCAN_DETAIL', payload: { id, step_number: Number(idx) } });
    }
  }, [dispatch, id, idx]);

  if (scanDetailLoading) return <div>Loading scan detail...</div>;
  if (scanDetailError) return <div className="text-danger">Error loading scan detail: {scanDetailError.toString()}</div>;

  const scan = Array.isArray(scanDetail) && scanDetail.length > 0 ? scanDetail[0] : null;

  return (
    <div className="scan-detail-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Scan taken on {scan?.created_at || 'N/A'}</h5>
          <a href="#" className="small me-3" onClick={() => navigate(-1)}>
            <i className="mdi mdi-arrow-left"></i> Back to the list
          </a>
        </div>
      </div>
      <Card>
        <CardBody>
          {scan ? (
            <div>
              <div><strong>View Type:</strong> {scan.view_type}</div>
              <div><strong>Status:</strong> {scan.status}</div>
              <div><strong>Scan URL:</strong> <a href={ WEB_APP_URL+scan.scan_url} target="_blank" rel="noopener noreferrer">View Image</a></div>
              {/* Add more fields as needed */}
            </div>
          ) : (
            <div>No scan detail available.</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ScanDetail;