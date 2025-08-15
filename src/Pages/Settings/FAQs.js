import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFaqs, addFaq, updateFaq, deleteFaq } from "../../store/faqs/actions";
import { Container, Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Spinner, Alert } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useToast } from '../../components/Common/ToastContext';

const FAQs = () => {
  document.title = "FAQs | Smileie";
  const dispatch = useDispatch();
  const { faqs, loading, error, adding, addError, updating, updateError, deleting, deleteError } = useSelector(state => state.faqs);
  const showToast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({ id: null, question: "", answer: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  useEffect(() => {
    dispatch(getFaqs());
  }, [dispatch]);

  // Toast notifications for FAQ actions
  useEffect(() => {
    if (!adding && !addError && prevAdding.current) {
      showToast({ message: 'FAQ added successfully!', type: 'success', title: 'Success' });
    }
    if (!updating && !updateError && prevUpdating.current) {
      showToast({ message: 'FAQ updated successfully!', type: 'success', title: 'Success' });
    }
    if (!deleting && !deleteError && prevDeleting.current) {
      showToast({ message: 'FAQ deleted successfully!', type: 'success', title: 'Success' });
    }
    if (addError && !adding) {
      showToast({ message: addError, type: 'error', title: 'Error' });
    }
    if (updateError && !updating) {
      showToast({ message: updateError, type: 'error', title: 'Error' });
    }
    if (deleteError && !deleting) {
      showToast({ message: deleteError, type: 'error', title: 'Error' });
    }
  }, [adding, addError, updating, updateError, deleting, deleteError, showToast]);

  // Close modal and clear form after successful add or update
  const prevAdding = React.useRef(false);
  const prevUpdating = React.useRef(false);
  const prevDeleting = React.useRef(false);
  useEffect(() => {
    // Only close modal if we were adding and now not, and it was successful (add)
    if (prevAdding.current && !adding && modalOpen && !addError && !editMode) {
      setModalOpen(false);
      setCurrentFaq({ id: null, question: "", answer: "" });
    }
    // Only close modal if we were updating and now not, and it was successful (edit)
    if (prevUpdating.current && !updating && modalOpen && !updateError && editMode) {
      setModalOpen(false);
      setCurrentFaq({ id: null, question: "", answer: "" });
    }
    prevAdding.current = adding;
    prevUpdating.current = updating;
    prevDeleting.current = deleting;
  }, [adding, addError, updating, updateError, modalOpen, editMode, deleting]);

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
        <Breadcrumbs title="Smileie" breadcrumbItem="Settings" breadcrumbItem2="FAQs" />
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="header-with-buttons">
                  <h4 className="mb-0">FAQs</h4>
                  <div className="header-buttons">
                    <Button color="primary" onClick={openAddModal} disabled={adding} className="btn-icon btn-icon-left">
                      <i className="ri-add-line"></i>
                      Add FAQ
                    </Button>
                  </div>
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
                            <div className="action-buttons">
                              <Button color="outline-primary" size="sm" onClick={() => openEditModal(faq)} className="btn-icon" title="Edit">
                                <i className="ri-edit-line"></i>
                              </Button>
                              <Button color="outline-danger" size="sm" onClick={() => openDeleteModal(faq)} className="btn-icon" title="Delete">
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
          <div className="modal-buttons">
            <Button color="light" onClick={() => setModalOpen(false)} disabled={adding || updating}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSave} disabled={!currentFaq.question.trim() || !currentFaq.answer.trim() || adding || updating}>
              {(adding || updating) ? <Spinner size="sm" className="me-2" /> : null}
              {editMode ? "Save Changes" : "Add FAQ"}
            </Button>
          </div>
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
          <div className="modal-buttons">
            <Button color="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner size="sm" className="me-2" /> : null}
              Delete
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FAQs; 