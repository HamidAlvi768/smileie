import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTutorials, addTutorial, updateTutorial, deleteTutorial } from "../../store/tutorials/actions";
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useToast } from '../../components/Common/ToastContext';

const VideoTtutorials = () => {
  const dispatch = useDispatch();
  const tutorials = useSelector((state) => state.tutorials.tutorials) || [];
  const error = useSelector((state) => state.tutorials.error);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "", description: "" });
  const [urlError, setUrlError] = useState("");
  const showToast = useToast();

  useEffect(() => {
    dispatch(getTutorials());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast({ message: error, type: 'error', title: 'Error' });
    }
  }, [error, showToast]);

  const toggleModal = () => setModal(!modal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingTutorial(null);
    setFormData({ title: "", url: "", description: "" });
    setUrlError("");
    setModal(true);
  };

  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({ title: tutorial.title, url: tutorial.link, description: tutorial.description });
    setUrlError("");
    setModal(true);
  };

  const handleDelete = (tutorial) => {
    setTutorialToDelete(tutorial);
    setDeleteModal(true);
  };

  const validateUrl = (url) => {
    // Accept only YouTube video URLs (allow extra query params)
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}([?&].*)?$/;
    return youtubePattern.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateUrl(formData.url)) {
      setUrlError("Please enter a valid YouTube video URL.");
      return;
    } else {
      setUrlError("");
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      link: formData.url,
    };
    if (editingTutorial) {
      dispatch(updateTutorial({ ...payload, id: editingTutorial.id }));
      showToast({ message: 'Tutorial updated successfully!', type: 'success', title: 'Success' });
    } else {
      dispatch(addTutorial(payload));
      showToast({ message: 'Tutorial added successfully!', type: 'success', title: 'Success' });
    }
    setModal(false);
  };

  const confirmDelete = () => {
    if (tutorialToDelete) {
      dispatch(deleteTutorial(tutorialToDelete.id));
      showToast({ message: 'Tutorial deleted successfully!', type: 'success', title: 'Success' });
    }
    setDeleteModal(false);
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs
          title="Smileie"
          breadcrumbItem="Settings"
          breadcrumbItem2="Video Tutorials"
        />
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="card-title mb-0">Video Tutorials</h4>
              <Button color="primary" onClick={handleAdd} className="btn-sm">
                <i className="ri-add-line me-1"></i> Add Video Tutorial
              </Button>
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <div className="table-responsive">
              <table className="table table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">URL</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorials.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">No video tutorials found.</td>
                    </tr>
                  ) : (
                    tutorials.map((tutorial) => (
                      <tr key={tutorial.id}>
                        <td>{tutorial.title}</td>
                        <td><a href={tutorial.link} target="_blank" rel="noopener noreferrer">{tutorial.link}</a></td>
                        <td>{tutorial.description}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button color="outline-primary" size="sm" onClick={() => handleEdit(tutorial)}>
                              <i className="ri-pencil-line"></i>
                            </Button>
                            <Button color="outline-danger" size="sm" onClick={() => handleDelete(tutorial)}>
                              <i className="ri-delete-bin-line"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Add/Edit Modal */}
        <Modal isOpen={modal} toggle={toggleModal} centered>
          <ModalHeader toggle={toggleModal}>{editingTutorial ? "Edit Video Tutorial" : "Add Video Tutorial"}</ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="url">URL</Label>
                    <Input id="url" name="url" value={formData.url} onChange={handleInputChange} required />
                    {urlError && <div className="text-danger small mt-1">{urlError}</div>}
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal} type="button">Cancel</Button>
              <Button color="primary" type="submit">
                {editingTutorial ? "Save Changes" : "Add Video Tutorial"}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal} centered>
          <ModalHeader toggle={toggleDeleteModal}>Delete Video Tutorial</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the video tutorial "{tutorialToDelete?.title}"?
          </ModalBody>
          <ModalFooter>
            <Button color="light" onClick={toggleDeleteModal}>Cancel</Button>
            <Button color="danger" onClick={confirmDelete}>Delete</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default VideoTtutorials; 