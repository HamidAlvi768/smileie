import React, { useEffect } from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getConsentForms } from '../../../store/patients/actions';
import { WEB_APP_URL } from '../../../config';

// Mock data for consent forms
const mockConsentForms = [
  {
    id: 1,
    name: 'General Consent.pdf',
    uploadedAt: '2024-05-28',
    url: '#',
  },
  {
    id: 2,
    name: 'Photo Release.pdf',
    uploadedAt: '2024-05-20',
    url: '#',
  },
];

const ConsentForms = ({ patientId = null }) => {
  const dispatch = useDispatch();
  const consentForms = useSelector(state => state.patients.consentForms) || [];
  const loading = useSelector(state => state.patients.consentFormsLoading);
  const error = useSelector(state => state.patients.consentFormsError);

  useEffect(() => {
    if (patientId) {
      dispatch(getConsentForms(patientId));
    }
  }, [dispatch, patientId]);

  // Debug: log consentForms to verify data
  console.log('ConsentForms data:', consentForms);

  return (
    <div className="consent-forms-section">
      <h4 className="mb-3">Consent Forms</h4>
      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center text-muted py-4">Loading consent forms...</div>
          ) : error ? (
            <div className="text-center text-danger py-4">Error: {error}</div>
          ) : (Array.isArray(consentForms) && consentForms.length > 0) ? (
              <Table className="table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>Date Uploaded</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {consentForms.map((form, idx) => (
                    <tr key={form.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <a href={WEB_APP_URL+form.file_url} target="_blank" rel="noopener noreferrer">
                          {form.file_url.split('/').pop()}
                        </a>
                      </td>
                      <td>{form.created_at}</td>
                      <td>
                        <a href={form.file_url} download target="_blank" rel="noopener noreferrer" className="btn btn-link p-0">Download</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center text-muted py-4">
                No consent forms have been uploaded by the patient.
              </div>
            )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ConsentForms; 