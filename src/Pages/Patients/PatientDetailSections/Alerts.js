import React, { useEffect, useState } from 'react';
import { Card, CardBody, Badge, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAlerts, markAlertRead } from '../../../store/alerts/actions';

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

const Alerts = ({ patientId: propPatientId }) => {
  const dispatch = useDispatch();
  const { alerts, loading } = useSelector(state => state.alerts);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showShimmer, setShowShimmer] = useState(true);

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
    let patientId = propPatientId;
    if (!patientId) {
      // fallback for backward compatibility
      const user = JSON.parse(localStorage.getItem('authUser'));
      patientId = user?.id;
    }
    if (patientId) {
      const params = {
        page: currentPage,
        perpage: perPage,
      };
      dispatch(getAlerts(patientId, params));
    }
  }, [dispatch, propPatientId, currentPage, perPage]);

  // Handler to mark alert as read
  const handleAlertClick = (id, read_at) => {
    if (!read_at) {
      dispatch(markAlertRead(id));
    }
  };

  // Optionally, auto-mark all visible alerts as read (like Messages.js)
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      alerts.forEach(alert => {
        if (!alert.read_at) {
          dispatch(markAlertRead(alert.id));
        }
      });
    }
    // Only run when alerts change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  // Helper to format date and time like Messages.js
  const formatDateTime = (dateString) => {
    let date = '';
    let time = '';
    if (dateString) {
      const dt = new Date(dateString);
      if (!isNaN(dt.getTime())) {
        date = dt.toISOString().slice(0, 10);
        let hours = dt.getHours();
        let minutes = dt.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        time = `${hours}:${minutesStr} ${ampm}`;
      } else if (typeof dateString === 'string' && dateString.includes(' ')) {
        const [d, t] = dateString.split(' ');
        date = d;
        if (t) {
          let [h, m] = t.split(':');
          h = parseInt(h, 10);
          m = m ? m.padStart(2, '0') : '00';
          const ampm = h >= 12 ? 'pm' : 'am';
          let hour12 = h % 12;
          hour12 = hour12 ? hour12 : 12;
          time = `${hour12}:${m} ${ampm}`;
        }
      }
    }
    return { date, time };
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // Get pagination info from Redux state (assuming it's available)
  const pagination = useSelector(state => state.alerts.pagination);
  const totalItems = pagination?.total_items || alerts.length;
  const totalPages = pagination?.total_pages || Math.ceil(totalItems / perPage);

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

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Alerts</h4>
        <div className="d-flex align-items-center gap-2">
          <small className="text-muted">
            Total: {totalItems} alert{totalItems !== 1 ? 's' : ''}
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
                  Loading {perPage} alerts...
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
              {alerts.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="mdi mdi-bell-alert-outline mb-3" style={{ fontSize: '3rem' }}></i>
                  <p className="mb-0">No alerts to display.</p>
                </div>
              ) : (
                <>
                  <div className="timeline-list">
                    {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`timeline-item d-flex align-items-start ${alert.read_at ? 'read' : 'unread'}`}
                    onClick={() => handleAlertClick(alert.id, alert.read_at)}
                  >
                    <div className="flex-grow-1 p-2">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold text-primary">{alert.title}</span>
                        <Badge color="light" className="text-muted small fw-normal">
                          {formatDateTime(alert.created_at).date} {formatDateTime(alert.created_at).time && <span>{formatDateTime(alert.created_at).time}</span>}
                        </Badge>
                      </div>
                      <div className="timeline-desc text-muted small">
                        <small>{alert.message}</small>
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

export default Alerts; 