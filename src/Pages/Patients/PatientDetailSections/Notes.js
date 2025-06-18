import React, { useState } from 'react';
import { Card, CardBody, Button, FormGroup, Label, Input } from 'reactstrap';

const Notes = ({ patient }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSave = () => {
    // Here you would typically make an API call to save the notes
    console.log('Saving notes:', noteContent);
  };

  return (
    <div className="notes-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Notes about {patient.name}</h4>
        <Button color="primary" size="sm" onClick={handleSave}>
          <i className="mdi mdi-content-save me-1"></i>
          Save
        </Button>
      </div>

      <Card>
        <CardBody>
          <FormGroup>
            <Input
              type="textarea"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your notes here..."
              style={{ minHeight: '300px', resize: 'vertical' }}
              className="notes-textarea"
            />
          </FormGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default Notes; 