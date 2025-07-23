import React, { useEffect, useState } from 'react';
import { Card, CardBody, Badge, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAlerts, markAlertRead } from '../../../store/alerts/actions';

const Alerts = ({ patientId: propPatientId }) => {
  const dispatch = useDispatch();
  const { alerts, loading } = useSelector(state => state.alerts);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(100);

  useEffect(() => {
    let patientId = propPatientId;
    if (!patientId) {
      // fallback for backward compatibility
      const user = JSON.parse(localStorage.getItem('authUser'));
      patientId = user?.id;
    }
    if (patientId) {
      dispatch(getAlerts(patientId));
    }
  }, [dispatch, propPatientId]);

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

  // Pagination logic
  const totalPages = Math.ceil(alerts.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentAlerts = alerts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Alerts</h4>
        <div className="d-flex align-items-center gap-2">
          <small className="text-muted">
            Showing {startIndex + 1}-{Math.min(endIndex, alerts.length)} of {alerts.length} alerts
          </small>
        </div>
      </div>
      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-bell-alert-outline mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="mb-0">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-bell-alert-outline mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="mb-0">No alerts to display.</p>
            </div>
          ) : (
            <>
              <div className="timeline-list">
                {currentAlerts.map((alert) => (
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
        </CardBody>
      </Card>
    </div>
  );
};

export default Alerts; 