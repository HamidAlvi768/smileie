import React, { useState } from 'react';
import { Card, CardBody, Button, Input, FormGroup, Label, Form, Badge } from 'reactstrap';

const TreatmentPlan3D = ({ patient }) => {
  // Mock state for the 3D reel link and description
  const [reelLink, setReelLink] = useState('');
  const [description, setDescription] = useState('');
  const [savedLink, setSavedLink] = useState('');
  const [savedDescription, setSavedDescription] = useState('');
  const [editing, setEditing] = useState(false);
  // Mock approval state (in real app, this would come from backend)
  const [approved, setApproved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedLink(reelLink);
    setSavedDescription(description);
    setEditing(false);
  };

  // For demo: toggle approval
  const handleToggleApproval = () => setApproved((a) => !a);

  return (
    <div className="treatment-plan-3d-section">
      <div className="d-flex align-items-center gap-3 mb-3">
        <h4 className="mb-0">3D Treatment Plan</h4>
        <Badge color={approved ? 'success' : 'secondary'} pill className="approval-badge">
          {approved ? 'Approved' : 'Not Approved'}
        </Badge>
        {/* Approval button removed: approval is controlled by the patient */}
      </div>
      <Card>
        <CardBody>
          {editing || !savedLink ? (
            <Form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <FormGroup className="mb-0 flex-grow-1">
                <Label for="reelLink">3D Reel Link</Label>
                <Input
                  id="reelLink"
                  type="url"
                  placeholder="Paste the 3D treatment plan link here..."
                  value={reelLink}
                  onChange={e => setReelLink(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup className="mb-0 flex-grow-1">
                <Label for="reelDescription">Description</Label>
                <Input
                  id="reelDescription"
                  type="textarea"
                  placeholder="Add a description for the 3D treatment plan..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                />
              </FormGroup>
              <div className="d-flex justify-content-end">
                <Button color="primary" type="submit" size="lg">
                  Save
                </Button>
              </div>
            </Form>
          ) : (
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <a href={savedLink} target="_blank" rel="noopener noreferrer" className="fw-bold">
                  View 3D Treatment Plan
                </a>
                <Button color="secondary" size="sm" onClick={() => setEditing(true)}>
                  Edit Link
                </Button>
              </div>
              {savedDescription && (
                <div className="mt-2 text-muted">
                  <strong>Description:</strong>
                  <div>{savedDescription}</div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TreatmentPlan3D; 