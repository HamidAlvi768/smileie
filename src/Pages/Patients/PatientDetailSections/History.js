import React, { useState } from 'react';
import { Card, CardBody, Button, Badge } from 'reactstrap';

const mockActions = [
  {
    id: 1,
    date: '2025-05-22',
    performer: 'Usha Gurung',
    type: 'review',
    status: 'to-review',
    description: 'Message review: Noticeable unseated still present: 2.2 (ignored), 4.1',
  },
  {
    id: 2,
    date: '2025-05-21',
    performer: 'DentalMonitoring',
    type: 'instruction',
    status: 'all',
    description: 'Patient instructions sent',
  },
  {
    id: 3,
    date: '2025-05-20',
    performer: 'Usha Gurung',
    type: 'observation',
    status: 'all',
    description: 'Noticeable black triangle: 3.2_3.3_4.1_4.2_4.3',
  },
  {
    id: 4,
    date: '2025-05-19',
    performer: 'DentalMonitoring',
    type: 'review',
    status: 'to-review',
    description: 'Message review: Slight unseat still present: 3.3, 3.4, 3.6',
  },
];

const actionTypeMeta = {
  review: { icon: 'mdi-information-outline', color: '#f39c12' },
  instruction: { icon: 'mdi-information-outline', color: '#f39c12' },
  observation: { icon: 'mdi-information-outline', color: '#f39c12' },
};

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

  const filteredActions =
    statusFilter === 'all'
      ? mockActions
      : mockActions.filter((a) => a.status === 'to-review');

  return (
    <div className="history-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">History</h4>
      </div>
      <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
        <div>
          <select
            id="action-type-dropdown"
            className="form-select d-inline-block w-auto"
            value={actionTypeFilter}
            onChange={e => setActionTypeFilter(e.target.value)}
            style={{ minWidth: 200 }}
          >
            {actionTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="d-flex gap-2">
          <Button
            color={statusFilter === 'all' ? 'primary' : 'light'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All Actions
          </Button>
          <Button
            color={statusFilter === 'to-review' ? 'primary' : 'light'}
            size="sm"
            onClick={() => setStatusFilter('to-review')}
          >
            To Review
          </Button>
        </div>
      </div>
      <Card>
        <CardBody>
          {filteredActions.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-history mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="mb-0">No actions to display.</p>
            </div>
          ) : (
            <div className="timeline-list">
              {filteredActions.map((action) => {
                const meta = actionTypeMeta[action.type] || {};
                return (
                  <div key={action.id} className="timeline-item d-flex align-items-start">
                    <div className="timeline-icon me-3 mt-1" style={{ color: meta.color }}>
                      <i className={`mdi ${meta.icon} large-icon`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <span className="fw-bold me-2">{action.performer}</span>
                        <Badge color="light" className="text-muted small fw-normal">
                          {action.date}
                        </Badge>
                      </div>
                      <div className="timeline-desc text-muted small">
                        {action.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default History; 