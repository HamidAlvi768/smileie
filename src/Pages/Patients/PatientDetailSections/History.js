import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Badge, Spinner, Alert, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getPatientHistoryAPI } from '../../../helpers/api_helper';

const actionTypeOptions = [
  { value: 'all', label: 'ALL ACTIONS' },
  { value: 'results', label: 'Results' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: '3d-model', label: '3D Model' },
  { value: 'patient-communication', label: 'Patient communication' },
  { value: 'dynamic-aligner-change', label: 'Dynamic Aligner Change notifications' },
  { value: 'comments', label: 'Comments' },
  { value: 'clinical-instructions', label: 'Clinical instructions to the DM' },
  { value: 'todo-list', label: 'To-do List' },
  { value: 'patient-info', label: 'Patient Info' },
  { value: 'patient-payments', label: 'Patient payments' },
];

const History = ({ patient }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(100);

  useEffect(() => {
    if (!patient?.id) return;
    setLoading(true);
    setError(null);
    getPatientHistoryAPI(patient.id)
      .then(res => {
        // API returns { status, code, data: [...] }
        setActions(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load history.');
        setLoading(false);
      });
  }, [patient?.id]);

  const filteredActions =
    statusFilter === 'all'
      ? actions
      : actions.filter((a) => a.status === 'to-review');

  // Pagination logic
  const totalPages = Math.ceil(filteredActions.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentActions = filteredActions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">History</h4>
        <div className="d-flex align-items-center gap-2">
          <small className="text-muted">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredActions.length)} of {filteredActions.length} actions
          </small>
        </div>
      </div>
      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : filteredActions.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-history mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="mb-0">No actions to display.</p>
            </div>
          ) : (
            <>
              <div className="timeline-list">
                {currentActions.map((action) => (
                  <div key={action.id} className="timeline-item d-flex align-items-start">
                    <div className="flex-grow-1 p-2">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold text-primary">{action.action}</span>
                        <Badge color="light" className="text-muted small fw-normal">
                          {action.created_at ? action.created_at.slice(0, 10) : ''}
                        </Badge>
                      </div>
                      <div className="timeline-desc text-muted small">
                        <small>{action.description}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum} active={pageNum === currentPage}>
                          <PaginationLink onClick={() => handlePageChange(pageNum)}>
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default History; 