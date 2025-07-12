import React, { useState } from "react";
import { Card, CardBody, Badge, Container } from "reactstrap";
import '../../assets/scss/pages/patient.scss';

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

// Mock notifications data (similar to Alerts.js)
const mockNotifications = [
  {
    id: 1,
    date: '2025-06-01',
    title: 'New Message from Dr. Smith',
    message: 'You have received a new message regarding your treatment plan.'
  },
  {
    id: 2,
    date: '2025-06-02',
    title: 'Appointment Reminder',
    message: 'Your appointment is scheduled for tomorrow at 10:00 AM.'
  },
  {
    id: 3,
    date: '2025-06-03',
    title: 'Lab Results Available',
    message: 'Your recent lab results are now available to view.'
  },
  {
    id: 4,
    date: '2025-06-05',
    title: 'Payment Received',
    message: 'Your payment has been received. Thank you!'
  },
  {
    id: 5,
    date: '2025-06-10',
    title: 'Profile Update',
    message: 'Your profile information was updated successfully.'
  },
];

const PAGE_SIZE = 40;

const Messages = () => {
  const notifications = mockNotifications;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const paginatedNotifications = notifications.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="page-content no-navbar">
      <style>{timelineStyles}</style>
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Notifications</h4>
        </div>
        <Card>
          <CardBody>
            {notifications.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="mdi mdi-bell-outline mb-3" style={{ fontSize: '3rem' }}></i>
                <p className="mb-0">No notifications to display.</p>
              </div>
            ) : (
              <>
                <div className="timeline-list">
                  {paginatedNotifications.map((notification) => (
                    <div key={notification.id} className="timeline-item d-flex align-items-start">
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