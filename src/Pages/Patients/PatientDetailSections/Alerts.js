import React, { useState } from 'react';
import { Card, CardBody, Badge } from 'reactstrap';

// Mock data based on ScanNotificationFrequency.js and NextStepReminder.js
const mockAlerts = [
  {
    id: 1,
    date: '2025-06-01',
    name: '2 Days Before Aligner Change',
    status: 'Active',
    message: 'Your aligner change is in 2 days. Please prepare accordingly.'
  },
  {
    id: 2,
    date: '2025-06-02',
    name: '1 Day Before Aligner Change',
    status: 'Active',
    message: 'Your aligner change is tomorrow. Get ready!'
  },
  {
    id: 3,
    date: '2025-06-03',
    name: 'On the Day of Aligner Change',
    status: 'Active',
    message: 'Today is the day to change your aligner!'
  },
  {
    id: 4,
    date: '2025-06-05',
    name: 'Appointment Confirmation',
    status: 'Active',
    message: 'Confirm your upcoming appointment.'
  },
  {
    id: 5,
    date: '2025-06-10',
    name: 'Payment Due Reminder',
    status: 'Active',
    message: 'Your payment is due soon.'
  },
];

const Alerts = () => {
  // Removed filter state and logic
  const filteredAlerts = mockAlerts;

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Alerts</h4>
      </div>
      {/* Removed filter buttons as requested */}
      <Card>
        <CardBody>
          {filteredAlerts.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-bell-alert-outline mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="mb-0">No alerts to display.</p>
            </div>
          ) : (
            <div className="timeline-list">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="timeline-item d-flex align-items-start">
                  <div className="timeline-icon me-3 mt-1" style={{ color: '#f39c12' }}>
                    <i className="mdi mdi-bell-alert-outline large-icon"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <span className="fw-bold me-2">{alert.name}</span>
                      <Badge color="light" className="text-muted small fw-normal">
                        {alert.date}
                      </Badge>
                    </div>
                    <div className="timeline-desc text-muted small">
                      {alert.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Alerts; 