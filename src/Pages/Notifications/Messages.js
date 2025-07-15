import React, { useState } from "react";
import { Card, CardBody, Badge, Container } from "reactstrap";
import '../../assets/scss/pages/patient.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markNotificationRead } from '../../store/notifications/actions';

// Inline styles for timeline/alerts UI (from patient.scss)
const timelineStyles = `
.timeline-list {
  margin: 0;
  padding: 0;
  position: relative;
}
.timeline-list::before {
  content: '';
  position: absolute;
  top: 20px;
  bottom: 0;
  left: 26px;
  width: 4px;
  height: auto;
  background: linear-gradient(to bottom, #e3eaf3 0%, #e3eaf3 100%);
  z-index: 0;
  border-radius: 2px;
}
.timeline-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 0.25rem;
  margin-bottom: 0.25rem;
  position: relative;
  background: transparent;
  z-index: 1;
}
.timeline-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
}
.timeline-item .flex-grow-1 {
  box-sizing: border-box;
  min-height: 80px;
  padding: 24px 32px 20px 32px;
  border-radius: 12px;
  border: 1.5px solid #e3eaf3;
  background: hsl(240, 10%, 97%);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0;
  margin-top: 0;
  margin-left: 0;
  box-shadow: none;
}
.timeline-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5fafd;
  font-size: 1.7rem;
  margin-right: 1rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(22, 177, 199, 0.04);
  border: 2px solid #e3eaf3;
}
.timeline-icon i.large-icon {
  font-size: 2rem;
}
.timeline-desc {
  font-size: 1rem;
  color: #495057;
}
`;

const PAGE_SIZE = 40;

const Messages = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(state => state.notifications || {});

  // Debug: Log notifications statep
  console.log('Redux notifications:', notifications);
  console.log('Redux loading:', loading);
  console.log('Redux error:', error);

  React.useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  // Map API notifications to UI structure, including read_at
  const mappedNotifications = (notifications || []).map(n => ({
    id: n.id,
    date: n.date ? n.date.split(' ')[0] : '',
    title: n.title,
    message: n.message,
    read_at: n.read_at,
  }));

  // Debug: Log mappedNotifications
  console.log('mappedNotifications:', mappedNotifications);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mappedNotifications.length / PAGE_SIZE);
  const paginatedNotifications = mappedNotifications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Handler to mark notification as read
  const handleNotificationClick = (id, read_at) => {
    if (read_at == null) {
      dispatch(markNotificationRead(id));
    }
  };

  // Automatically mark all visible unread notifications as read
  React.useEffect(() => {
    if (paginatedNotifications.length > 0) {
      paginatedNotifications.forEach((notification) => {
        if (!notification.read_at) {
          dispatch(markNotificationRead(notification.id));
        }
      });
    }
    // Only run when paginatedNotifications changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedNotifications]);

  return (
    <div className="page-content no-navbar">
      <style>{timelineStyles + `\n.timeline-item.read { opacity: 0.6; }\n.timeline-item.unread { font-weight: bold; }`}</style>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Notifications</h4>
        </div>
        <Card>
          <CardBody>
            {loading ? (
              <div className="text-center text-muted py-5">
                <i className="mdi mdi-bell-outline mb-3" style={{ fontSize: '3rem' }}></i>
                <p className="mb-0">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="text-center text-danger py-5">
                <i className="mdi mdi-alert-circle-outline mb-3" style={{ fontSize: '3rem' }}></i>
                <p className="mb-0">{error}</p>
              </div>
            ) : mappedNotifications.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="mdi mdi-bell-outline mb-3" style={{ fontSize: '3rem' }}></i>
                <p className="mb-0">No notifications to display.</p>
              </div>
            ) : (
              <>
                <div className="timeline-list">
                  {paginatedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`timeline-item d-flex align-items-start ${notification.read_at ? 'read' : 'unread'}`}
                      onClick={() => handleNotificationClick(notification.id, notification.read_at)}
                      style={{ opacity: notification.read_at ? 0.6 : 1 }}
                    >
                      <div className="timeline-icon me-3 mt-3" style={{ color: '#1da5fe' }}>
                        <i className="mdi mdi-bell-outline large-icon"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <span className="fw-bold me-2">{notification.title}</span>
                          <Badge color="light" className="text-muted small fw-normal">
                            {notification.date}
                          </Badge>
                        </div>
                        <div className="timeline-desc text-muted small">
                          {notification.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
                    <span className="mx-2">Page {currentPage} of {totalPages}</span>
                    <button className="btn btn-outline-primary btn-sm ms-2" onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Messages; 