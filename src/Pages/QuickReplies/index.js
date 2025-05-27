import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Form,
} from "reactstrap";

const quickRepliesData = [
  {
    id: 1,
    category: "Chewies",
    content: "Please use your chewies for 10 minutes after inserting your aligners to ensure a proper fit.",
  },
  {
    id: 2,
    category: "Retainer",
    content: "Remember to wear your retainer every night to maintain your results.",
  },
  {
    id: 3,
    category: "Elastics",
    content: "Wear your elastics as instructed to help move your teeth into the correct position.",
  },
];

const variableOptions = [
  { value: "patient_name", label: "Patient Name" },
  { value: "doctor_name", label: "Doctor Name" },
  { value: "appointment_date", label: "Appointment Date" },
];

const QuickReplies = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(quickRepliesData[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit"); // 'edit' or 'duplicate'
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createVariable, setCreateVariable] = useState("");

  const filteredReplies = quickRepliesData.filter((qr) =>
    qr.category.toLowerCase().includes(search.toLowerCase())
  );
  const selectedReply = quickRepliesData.find((qr) => qr.id === selectedId);

  const openModal = (mode) => {
    setModalMode(mode);
    if (selectedReply) {
      setFormTitle(
        mode === "duplicate" ? `${selectedReply.category} (copy)` : selectedReply.category
      );
      setFormContent(selectedReply.content);
    }
    setSelectedVariable("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleVariableInsert = (e) => {
    const variable = e.target.value;
    if (variable) {
      setFormContent(formContent + ` [${variable}]`);
      setSelectedVariable("");
    }
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openCreateModal = () => {
    setCreateTitle("");
    setCreateContent("");
    setCreateVariable("");
    setCreateModalOpen(true);
  };
  const closeCreateModal = () => setCreateModalOpen(false);
  const handleCreateVariableInsert = (e) => {
    const variable = e.target.value;
    if (variable) {
      setCreateContent(createContent + ` [${variable}]`);
      setCreateVariable("");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="align-items-center mb-3">
          <Col>
            <h4 className="mb-0">Quick Replies</h4>
          </Col>
          <Col className="text-end">
            <Button color="primary" onClick={openCreateModal}>Create a new quick reply</Button>
          </Col>
        </Row>
        <Row>
          {/* Left Navigation Pane */}
          <Col md={3} sm={4} xs={12}>
            <Card className="h-100">
              <CardBody>
                <Input
                  type="search"
                  placeholder="Search quick replies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-3"
                />
                <ListGroup flush>
                  {filteredReplies.length === 0 && (
                    <ListGroupItem>No quick replies found.</ListGroupItem>
                  )}
                  {filteredReplies.map((qr) => (
                    <ListGroupItem
                      key={qr.id}
                      action
                      active={qr.id === selectedId}
                      onClick={() => setSelectedId(qr.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {qr.category}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>

          {/* Right Content Pane */}
          <Col md={9} sm={8} xs={12}>
            <Card className="h-100">
              <CardBody>
                {selectedReply ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h4 className="mb-0">{selectedReply.category}</h4>
                      <div>
                        <Button color="light" className="me-2" onClick={() => openModal("edit")}>Edit</Button>
                        <Button color="light" className="me-2" onClick={() => openModal("duplicate")}>Duplicate</Button>
                        <Button color="danger" onClick={openDeleteModal}>Delete</Button>
                      </div>
                    </div>
                    <div style={{ fontSize: "1.1rem" }}>{selectedReply.content}</div>
                  </div>
                ) : (
                  <div className="text-muted">Select a quick reply to view its content.</div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Edit/Duplicate Modal */}
        <Modal isOpen={modalOpen} toggle={closeModal} centered>
          <ModalHeader toggle={closeModal}>
            {modalMode === "edit" ? "Edit quick reply" : "Duplicate a quick reply"}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup className="mb-3">
                <Label for="quickReplyTitle">Quick Reply Title</Label>
                <Input
                  id="quickReplyTitle"
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="quickReplyContent">Quick Reply Content</Label>
                <Input
                  id="quickReplyContent"
                  type="textarea"
                  rows={4}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                />
                <div className="mt-2">
                  <Input
                    type="select"
                    value={selectedVariable}
                    onChange={handleVariableInsert}
                    style={{ maxWidth: 220, display: "inline-block" }}
                  >
                    <option value="">Select a variable</option>
                    {variableOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={closeModal}>Cancel</Button>
            <Button color="primary">Save</Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal} size="sm" centered>
          <ModalHeader toggle={closeDeleteModal}>Delete quick reply</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this quick reply? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={closeDeleteModal}>Cancel</Button>
            <Button color="danger">Delete</Button>
          </ModalFooter>
        </Modal>

        {/* Create New Quick Reply Modal */}
        <Modal isOpen={createModalOpen} toggle={closeCreateModal} centered>
          <ModalHeader toggle={closeCreateModal}>Create a new quick reply</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup className="mb-3">
                <Label for="createQuickReplyTitle">Quick Reply Title</Label>
                <Input
                  id="createQuickReplyTitle"
                  type="text"
                  value={createTitle}
                  onChange={e => setCreateTitle(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <Label for="createQuickReplyContent">Quick Reply Content</Label>
                <Input
                  id="createQuickReplyContent"
                  type="textarea"
                  rows={4}
                  value={createContent}
                  onChange={e => setCreateContent(e.target.value)}
                />
                <div className="mt-2">
                  <Input
                    type="select"
                    value={createVariable}
                    onChange={handleCreateVariableInsert}
                    style={{ maxWidth: 220, display: "inline-block" }}
                  >
                    <option value="">Select a variable</option>
                    {variableOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={closeCreateModal}>Cancel</Button>
            <Button color="primary">Save</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default QuickReplies; 