import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Badge, Spinner, Alert, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getPatientHistoryAPI } from '../../../helpers/api_helper';

// Shimmer effect styles
const shimmerStyles = `
  .shimmer-timeline-item {
    background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 16px;
    border: 1px solid #e9ecef;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .shimmer-title {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    height: 18px;
    border-radius: 4px;
    margin-bottom: 8px;
    width: 60%;
  }
  
  .shimmer-date {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    height: 14px;
    border-radius: 4px;
    width: 30%;
    margin-left: auto;
  }
  
  .shimmer-message {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    height: 14px;
    border-radius: 4px;
    margin-bottom: 4px;
    width: 100%;
  }
  
  .shimmer-message:last-child {
    width: 80%;
  }
  
  .shimmer-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
  const [perPage, setPerPage] = useState(20);
  const [showShimmer, setShowShimmer] = useState(true);
  const [pagination, setPagination] = useState(null);

  // Inject shimmer styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = shimmerStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (!patient?.id) return;
    setLoading(true);
    setError(null);
    setShowShimmer(true);
    
    const params = {
      page: currentPage,
      perpage: perPage,
    };
    
    getPatientHistoryAPI(patient.id, params)
      .then(res => {
        // API returns { status, code, data: [...], pagination }
        setActions(res.data || []);
        setPagination(res.pagination || null);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load history.');
        setLoading(false);
      });
  }, [patient?.id, currentPage, perPage]);

  // Update shimmer visibility based on loading state
  useEffect(() => {
    if (loading) {
      setShowShimmer(true);
    } else {
      // Add a minimum delay to show shimmer for better UX
      const timer = setTimeout(() => {
        setShowShimmer(false);
      }, 800); // Minimum 800ms shimmer time
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const filteredActions =
    statusFilter === 'all'
      ? actions
      : actions.filter((a) => a.status === 'to-review');

  // Get pagination info from state
  const totalItems = pagination?.total_items || actions.length;
  const totalPages = pagination?.total_pages || Math.ceil(totalItems / perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">History</h4>
        <div className="d-flex align-items-center gap-2">
          <small className="text-muted">
            Total: {totalItems} action{totalItems !== 1 ? 's' : ''}
          </small>
        </div>
      </div>
      <Card>
        <CardBody>
          {/* Shimmer Loading Effect */}
          {showShimmer && (
            <div className="shimmer-container">
              {/* Loading indicator */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="shimmer-title" style={{ width: '100px' }}></div>
                <div className="text-muted small">
                  <i className="ri-loader-4-line me-1" style={{ animation: 'spin 1s linear infinite' }}></i>
                  Loading {perPage} actions...
                </div>
              </div>
              
              {/* Timeline items shimmer */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="shimmer-timeline-item">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="shimmer-title"></div>
                    <div className="shimmer-date"></div>
                  </div>
                  <div className="shimmer-message"></div>
                  <div className="shimmer-message"></div>
                </div>
              ))}
            </div>
          )}
          
          {/* Actual Content */}
          {!showShimmer && (
            <>
              {error ? (
                <Alert color="danger">{error}</Alert>
              ) : filteredActions.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="mdi mdi-history mb-3" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-0">No actions to display.</p>
                </div>
              ) : (
                <>
                  <div className="timeline-list">
                    {filteredActions.map((action) => (
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
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default History; 