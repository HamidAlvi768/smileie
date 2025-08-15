import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConsentFormQuestions, getConsentFormQuestions, clearConsentFormQuestionsState } from "../../store/consentFormQuestions/actions";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  Button, 
  FormGroup, 
  Label, 
  Input, 
  Spinner, 
  Alert,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useToast } from '../../components/Common/ToastContext';
import ShimmerLoader from '../../components/Common/ShimmerLoader';
import usePerformanceOptimization from '../../Hooks/usePerformanceOptimization';

const ConsentFormQuestions = () => {
  document.title = "Consent Form Questions | Smileie";
  const dispatch = useDispatch();
  const { loading = false, error = null, success = false, message = null, questions: existingQuestions = [] } = useSelector(state => state.consentFormQuestions || {});
  const showToast = useToast();
  const { debounce } = usePerformanceOptimization();

  const [questions, setQuestions] = useState([
    { number: 1, question: "" }
  ]);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalQuestions, setOriginalQuestions] = useState([]);

  const hasShownToastRef = useRef(false);

  // Fetch existing questions on component mount
  useEffect(() => {
    // Clear any existing state first
    dispatch(clearConsentFormQuestionsState());
    // Then fetch questions
    dispatch(getConsentFormQuestions());
  }, [dispatch]);

  // Update local questions when existing questions are loaded
  useEffect(() => {
    if (existingQuestions && existingQuestions.length > 0) {
      setQuestions(existingQuestions);
      setOriginalQuestions(JSON.parse(JSON.stringify(existingQuestions)));
      setHasChanges(false);
    } else if (existingQuestions && existingQuestions.length === 0) {
      // If no existing questions, start with one empty question
      setQuestions([{ number: 1, question: "" }]);
      setOriginalQuestions([{ number: 1, question: "" }]);
      setHasChanges(false);
    }
  }, [existingQuestions]);

  // Check for changes whenever questions change
  useEffect(() => {
    if (originalQuestions.length > 0) {
      const changed = JSON.stringify(questions) !== JSON.stringify(originalQuestions);
      setHasChanges(changed);
    }
  }, [questions, originalQuestions]);

  // Toast notifications for consent form questions actions
  useEffect(() => {
    if (success && message && !hasShownToastRef.current) {
      showToast({ message: message, type: 'success', title: 'Success' });
      setSaving(false);
      hasShownToastRef.current = true;
      // Refresh the questions list after successful save
      dispatch(getConsentFormQuestions());
    }
    if (error && !hasShownToastRef.current) {
      showToast({ message: error, type: 'error', title: 'Error' });
      setSaving(false);
      hasShownToastRef.current = true;
    }
  }, [success, error, message, showToast, dispatch]);

  // Reset toast ref when state changes
  useEffect(() => {
    if (success || error) {
      hasShownToastRef.current = false;
    }
  }, [success, error]);

  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearConsentFormQuestionsState());
    };
  }, [dispatch]);

  const addQuestion = () => {
    const newNumber = questions.length + 1;
    const newQuestions = [...questions, { number: newNumber, question: "" }];
    setQuestions(newQuestions);
    setHasChanges(true);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      // Renumber the questions
      const renumberedQuestions = updatedQuestions.map((q, i) => ({
        ...q,
        number: i + 1
      }));
      setQuestions(renumberedQuestions);
      // Mark that changes have been made
      setHasChanges(true);
    }
  };



  const handleDeleteClick = (index) => {
    setQuestionToDelete({ index, question: questions[index] });
    setDeleteModal(true);
  };

  const confirmDelete = (e) => {
    // Prevent any form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Deleting question:', questionToDelete);
    
    if (questionToDelete) {
      removeQuestion(questionToDelete.index);
    }
    setDeleteModal(false);
    setQuestionToDelete(null);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (deleteModal) {
      setQuestionToDelete(null);
    }
  };

  const updateQuestion = debounce((index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
    setHasChanges(true);
  }, 300);

  const moveQuestion = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const updatedQuestions = [...questions];
      [updatedQuestions[index], updatedQuestions[index - 1]] = [updatedQuestions[index - 1], updatedQuestions[index]];
      // Renumber the questions
      const renumberedQuestions = updatedQuestions.map((q, i) => ({
        ...q,
        number: i + 1
      }));
      setQuestions(renumberedQuestions);
      setHasChanges(true);
    } else if (direction === 'down' && index < questions.length - 1) {
      const updatedQuestions = [...questions];
      [updatedQuestions[index], updatedQuestions[index + 1]] = [updatedQuestions[index + 1], updatedQuestions[index]];
      // Renumber the questions
      const renumberedQuestions = updatedQuestions.map((q, i) => ({
        ...q,
        number: i + 1
      }));
      setQuestions(renumberedQuestions);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    // Validate that all questions have content
    const validQuestions = questions.filter(q => q.question.trim() !== "");
    
    if (validQuestions.length === 0) {
      showToast({ message: 'Please add at least one question', type: 'error', title: 'Error' });
      return;
    }

    if (validQuestions.length !== questions.length) {
      showToast({ message: 'Please fill in all questions', type: 'error', title: 'Error' });
      return;
    }

    setSaving(true);
    
    // Prepare questions for saving with proper IDs
    const questionsToSave = validQuestions.map((q, index) => ({
      ...q,
      number: index + 1,
      // Preserve existing ID if available, otherwise let the API handle it
      id: q.id || undefined
    }));
    
    // Prepare the questions for saving
    const savePayload = {
      questions: questionsToSave
    };
    
    console.log('Saving questions with payload:', savePayload);
    dispatch(createConsentFormQuestions(savePayload));
  };

  const isFormValid = () => {
    return questions.length > 0 && questions.every(q => q.question.trim() !== "");
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs title="Smileie" breadcrumbItem="Settings" breadcrumbItem2="Consent Form Questions" />
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="header-with-buttons">
                  <div>
                    <h4 className="mb-0">Consent Form Questions</h4>
                  </div>
                  <div className="header-buttons">
                    <Button color="success" onClick={addQuestion} className="btn-icon btn-icon-left">
                      <i className="ri-add-line"></i>
                      New Question
                    </Button>
                    <Button 
                      color="primary" 
                      onClick={handleSave} 
                      disabled={!isFormValid() || saving || !hasChanges}
                    >
                      {saving ? <Spinner size="sm" className="me-2" /> : null}
                      Save
                    </Button>
                  </div>
                </div>
                
                {/* Show shimmer loader while loading */}
                {loading && questions.length === 0 ? (
                  <ShimmerLoader type="list" lines={6} />
                ) : (
                  <>
                    {/* Show save reminder when there are changes */}
                    {hasChanges && (
                      <div className="alert alert-info mb-3" style={{width:"fit-content",margin:"auto 0px auto auto"}}>
                        <i className="ri-information-line me-2"></i>
                        <strong>Click save to make changes</strong>
                      </div>
                    )}
                    
                    <ListGroup>
                      {questions.map((question, index) => (
                      <ListGroupItem key={index} className="d-flex align-items-center">
                        <div className="flex-grow-1 me-3">
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-primary me-2">#{question.number}</span>
                            <div className="flex-grow-1">
                              <Input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateQuestion(index, e.target.value)}
                                placeholder="Enter question text..."
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="action-buttons">
                          <Button
                            color="outline-secondary"
                            size="sm"
                            onClick={() => moveQuestion(index, 'up')}
                            disabled={index === 0}
                            className="btn-icon"
                          >
                            <i className="ri-arrow-up-line"></i>
                          </Button>
                          <Button
                            color="outline-secondary"
                            size="sm"
                            onClick={() => moveQuestion(index, 'down')}
                            disabled={index === questions.length - 1}
                            className="btn-icon"
                          >
                            <i className="ri-arrow-down-line"></i>
                          </Button>
                          <Button
                            color="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(index)}
                            disabled={questions.length === 1}
                            className="btn-icon"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                  </>
                )}

                {questions.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted">
                    No questions added yet. Click "New Question" to get started.
                  </div>
                )}


              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>

      {/* Delete Confirmation Modal - Moved outside form container */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal} centered onClosed={() => setQuestionToDelete(null)}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Question</ModalHeader>
        <ModalBody>
          Are you sure you want to delete question #{questionToDelete?.question?.number} "{questionToDelete?.question?.question}"?
        </ModalBody>
        <ModalFooter>
          <div className="modal-buttons" onClick={(e) => e.stopPropagation()}>
            <Button color="light" onClick={toggleDeleteModal} type="button">Cancel</Button>
            <Button color="danger" onClick={(e) => confirmDelete(e)} type="button">Delete</Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConsentFormQuestions;
