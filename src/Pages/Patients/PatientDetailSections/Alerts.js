import React, { useState, useEffect } from 'react';
import { Card, CardBody, Badge, Button } from 'reactstrap';

// Load notifications from api.json (for demo; replace with API call in production)
import notificationsData from './api.json';

const Alerts = () => {
  // Parse notifications from the api.json structure
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (notificationsData && notificationsData.data) {
      setAlerts(notificationsData.data.map(item => item.notification));
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      // Call the backend API to mark as read
      await fetch(`https://smileie.jantrah.com/backend/api/notifications/read?id=${id}`, {
        method: 'POST',
      });
      // Update UI: set read_at to now for the notification
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? { ...alert, read_at: new Date().toISOString() } : alert
      ));
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Alerts</h4>
      </div>
      <Card>
        <CardBody>
          {alerts.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-bell-alert-outline mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="mb-0">No alerts to display.</p>
            </div>
          ) : (
            <div className="timeline-list">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`timeline-item d-flex align-items-start ${alert.read_at ? 'opacity-50' : ''}`}
                  style={{ cursor: alert.read_at ? 'default' : 'pointer' }}
                  onClick={() => !alert.read_at && markAsRead(alert.id)}
                >
                  <div className="timeline-icon me-3 mt-1" style={{ color: '#f39c12' }}>
                    <i className={`mdi mdi-bell-outline large-icon ${alert.read_at ? 'mdi-check-circle-outline text-success' : ''}`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <span className="fw-bold me-2">{alert.title}</span>
                      <Badge color="light" className="text-muted small fw-normal">
                        {alert.created_at}
                      </Badge>
                      {alert.read_at && (
                        <Badge color="success" className="ms-2">Read</Badge>
                      )}
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