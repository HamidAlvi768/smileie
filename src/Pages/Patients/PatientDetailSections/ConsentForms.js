import React from 'react';
import { Card, CardBody, Table } from 'reactstrap';

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

const ConsentForms = ({ patient }) => {
  // In a real app, fetch consent forms for the patient from API or Redux
  const consentForms = mockConsentForms;

  return (
    <div className="consent-forms-section">
      <h4 className="mb-3">Consent Forms</h4>
      <Card>
        <CardBody>
          {consentForms.length === 0 ? (
            <div className="text-center text-muted py-4">
              No consent forms have been uploaded by the patient.
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Date Uploaded</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {consentForms.map((form) => (
                  <tr key={form.id}>
                    <td>{form.name}</td>
                    <td>{form.uploadedAt}</td>
                    <td>
                      <a href={form.url} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ConsentForms; 