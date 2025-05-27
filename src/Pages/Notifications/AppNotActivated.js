import React from "react";
import { Card, CardBody, Container, Row, Col, Input } from "reactstrap";

const assignmentOptions = [
  "Show all",
  "Not assigned",
  "Assigned to me (Abid Hussain)",
  "Damodaraswamy, Sudhakar",
  "Gurung, Usha",
  "Ishaq, Rohail",
  "Kruchar, Mark (Dr)"
];

const dueDateOptions = [
  "Any",
  "None",
  "Late",
  "Today",
  "Upcoming"
];

const AppNotActivated = () => {
  return (
    <div className="page-content">
      <Container fluid>
        <div className="filter-panel-bg mb-4">
          <Row className="mb-3 align-items-center">
            <Col md={10} xs={8}>
              <h4 className="mb-0">App Not Activated</h4>
            </Col>
          </Row>
          <Row className="g-2">
            <Col md={3} sm={6} xs={12} className="mb-2">
              <label className="form-label" htmlFor="assignment-filter">Assignment</label>
              <Input id="assignment-filter" type="select" defaultValue={assignmentOptions[0]}>
                {assignmentOptions.map(opt => <option key={opt}>{opt}</option>)}
              </Input>
            </Col>
            <Col md={3} sm={6} xs={12} className="mb-2">
              <label className="form-label" htmlFor="duedate-filter">Due date</label>
              <Input id="duedate-filter" type="select" defaultValue={dueDateOptions[0]}>
                {dueDateOptions.map(opt => <option key={opt}>{opt}</option>)}
              </Input>
            </Col>
          </Row>
        </div>
        <Card>
          <CardBody>
            <div className="text-center py-5">
              <h5>None of your patients require an action on your part.</h5>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AppNotActivated; 