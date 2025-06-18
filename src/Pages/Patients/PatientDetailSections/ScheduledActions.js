import React, { useState } from 'react';
import { Card, CardBody, FormGroup, Label, Input } from 'reactstrap';

const ScheduledActions = () => {
  const [filters, setFilters] = useState({
    status: 'Pending',
    type: 'All',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="scheduled-actions-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Scheduled Actions</h4>
      </div>

      <Card className="filter-card mb-4">
        <CardBody>
          <div className="filters-container d-flex justify-content-between gap-4">
            <FormGroup className="mb-0">
              <Label for="status" className="text-muted small">Status</Label>
              <Input
                type="select"
                name="status"
                id="scheduled-status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Input>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label for="type" className="text-muted small">Type</Label>
              <Input
                type="select"
                name="type"
                id="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="All">All</option>
                <option value="Message">Message</option>
                <option value="Task">Task</option>
                <option value="Reminder">Reminder</option>
              </Input>
            </FormGroup>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-center text-muted py-5">
            <p className="mb-0">There is currently no item to display.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ScheduledActions; 