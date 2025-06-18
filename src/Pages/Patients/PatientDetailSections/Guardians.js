import React, { useState } from 'react';
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';

const Guardians = ({ patient }) => {
  const [isAddGuardianModalOpen, setIsAddGuardianModalOpen] = useState(false);
  const [newGuardian, setNewGuardian] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: ''
  });

  const toggleAddGuardianModal = () => {
    setIsAddGuardianModalOpen(!isAddGuardianModalOpen);
    if (!isAddGuardianModalOpen) {
      setNewGuardian({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        relationship: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuardian(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGuardian = () => {
    // Here you would typically make an API call to add the guardian
    console.log('Adding guardian:', newGuardian);
    toggleAddGuardianModal();
  };

  return (
    <div className="guardians-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Patient Guardians</h4>
        <Button color="primary" size="sm" onClick={toggleAddGuardianModal}>
          <i className="mdi mdi-account-plus me-1"></i>
          Add Guardian
        </Button>
      </div>

      <Card>
        <CardBody>
          <div className="text-center text-muted py-4">
            <i className="mdi mdi-account-multiple-outline mb-2" style={{ fontSize: '2rem' }}></i>
            <p className="mb-0">No guardians have been added for this patient.</p>
          </div>
        </CardBody>
      </Card>

      {/* Add Guardian Modal */}
      <Modal isOpen={isAddGuardianModalOpen} toggle={toggleAddGuardianModal} centered>
        <ModalHeader toggle={toggleAddGuardianModal}>
          Add New Guardian
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row>
              <Col md={6}>
                <Label for="firstName">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={newGuardian.firstName}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={6}>
                <Label for="lastName">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={newGuardian.lastName}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={4}>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={newGuardian.email}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={4}>
                <Label for="phone">Phone</Label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={newGuardian.phone}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={4}>
                <Label style={{ whiteSpace: 'nowrap' }} for="relationship">Relationship to Patient</Label>
                <Input
                  type="select"
                  name="relationship"
                  id="relationship"
                  value={newGuardian.relationship}
              onChange={handleInputChange}
            >
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="legal_guardian">Legal Guardian</option>
              <option value="sibling">Sibling</option>
              <option value="other">Other</option>
            </Input>
            </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleAddGuardianModal}>Cancel</Button>
          <Button color="primary" onClick={handleAddGuardian}>Add Guardian</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Guardians; 