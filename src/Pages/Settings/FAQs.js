import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFaqs, addFaq, updateFaq, deleteFaq } from "../../store/faqs/actions";
import { Container, Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Spinner, Alert } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const FAQs = () => {
  document.title = "FAQs | Smileie";
  const dispatch = useDispatch();
  const { faqs, loading, error, adding, addError, updating, updateError, deleting, deleteError } = useSelector(state => state.faqs);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({ id: null, question: "", answer: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  useEffect(() => {
    dispatch(getFaqs());
  }, [dispatch]);

  // Close modal and clear form after successful add or update
  const prevAdding = React.useRef(false);
  const prevUpdating = React.useRef(false);
  useEffect(() => {
    // Only close modal if we were adding/updating and now not, and it was successful
    if ((prevAdding.current && !adding && modalOpen && !addError && !editMode) ||
        (prevUpdating.current && !updating && modalOpen && !updateError && editMode)) {
      setModalOpen(false);
      setCurrentFaq({ id: null, question: "", answer: "" });
    }
    prevAdding.current = adding;
    prevUpdating.current = updating;
  }, [adding, addError, updating, updateError, modalOpen, editMode]);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentFaq({ id: null, question: "", answer: "" });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditMode(true);
    setCurrentFaq(faq);
    setModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editMode) {
      dispatch(updateFaq({ id: currentFaq.id, question: currentFaq.question, answer: currentFaq.answer }));
    } else {
      dispatch(addFaq({ question: currentFaq.question, answer: currentFaq.answer }));
    }
  };

  const openDeleteModal = (faq) => {
    setFaqToDelete(faq);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (faqToDelete) {
      dispatch(deleteFaq(faqToDelete.id));
    }
    setFaqToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs title="Smileie" breadcrumbItem="FAQs" />
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">FAQs</h4>
                  <Button color="primary" onClick={openAddModal} disabled={adding}>
                    <i className="ri-add-line me-1"></i> Add FAQ
                  </Button>
                </div>
                {loading && <div className="text-center py-4"><Spinner color="primary" /></div>}
                {error && <Alert color="danger">{error}</Alert>}
                <Table responsive hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40%" }}>Question</th>
                      <th>Answer</th>
                      <th style={{ width: 120 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
                          No FAQs found.
                        </td>
                      </tr>
                    ) : (
                      faqs.map((faq) => (
                        <tr key={faq.id}>
                          <td>{faq.question}</td>
                          <td>{faq.answer}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button color="outline-primary" size="sm" onClick={() => openEditModal(faq)}>
                                <i className="ri-edit-line"></i>
                              </Button>
                              <Button color="outline-danger" size="sm" onClick={() => openDeleteModal(faq)}>
                                <i className="ri-delete-bin-line"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {editMode ? "Edit FAQ" : "Add FAQ"}
        </ModalHeader>
        <ModalBody>
          {addError && <Alert color="danger">{addError}</Alert>}
          <FormGroup>
            <Label for="faq-question">Question</Label>
            <Input
              id="faq-question"
              name="question"
              type="text"
              value={currentFaq.question}
              onChange={handleModalChange}
              placeholder="Enter the question"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="faq-answer">Answer</Label>
            <Input
              id="faq-answer"
              name="answer"
              type="textarea"
              value={currentFaq.answer}
              onChange={handleModalChange}
              placeholder="Enter the answer"
              rows={4}
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setModalOpen(false)} disabled={adding || updating}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave} disabled={!currentFaq.question.trim() || !currentFaq.answer.trim() || adding || updating}>
            {(adding || updating) ? <Spinner size="sm" className="me-2" /> : null}
            {editMode ? "Save Changes" : "Add FAQ"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(false)} centered>
        <ModalHeader toggle={() => setDeleteModalOpen(false)}>
          Delete FAQ
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this FAQ?
          <div className="mt-3 p-2 bg-light border rounded">
            <strong>Q:</strong> {faqToDelete?.question}
            <br />
            <strong>A:</strong> {faqToDelete?.answer}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FAQs; 