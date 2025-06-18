import React, { useState, useCallback } from 'react';
import { Card, CardBody, Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Files = ({ patient }) => {
  const [filters, setFilters] = useState({
    fileType: 'ALL',
    source: 'Patient records'
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    // Handle dropped files here
    console.log('Files dropped:', files);
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    // Handle selected files here
    console.log('Files selected:', files);
  };

  return (
    <div className="files-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Files</h4>
        <Button color="primary" size="sm" onClick={toggleUploadModal}>
          <i className="mdi mdi-upload me-1"></i>
          Add a file
        </Button>
      </div>

      <Card className="filter-card mb-4">
        <CardBody>
          <div className="filters-container d-flex justify-content-between gap-4">
            <FormGroup className="mb-0">
              <Label for="fileType" className="text-muted small">File type</Label>
              <Input
                type="select"
                name="fileType"
                id="fileType"
                value={filters.fileType}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="ALL">ALL</option>
                <option value="X-RAY">X-RAY</option>
                <option value="STL">STL</option>
                <option value="PDF">PDF</option>
                <option value="IMAGE">IMAGE</option>
              </Input>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label for="source" className="text-muted small">Source</Label>
              <Input
                type="select"
                name="source"
                id="source"
                value={filters.source}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="Patient records">Patient records</option>
                <option value="Treatment plan">Treatment plan</option>
                <option value="Scans">Scans</option>
                <option value="Other">Other</option>
              </Input>
            </FormGroup>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-center text-muted py-5">
            <i className="mdi mdi-file-outline mb-3" style={{ fontSize: '3rem' }}></i>
            <p className="mb-2">No files have been added yet.</p>
            <p className="small mb-0">You can add files such as X-RAYS, STL or any PDF document here.</p>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isUploadModalOpen} toggle={toggleUploadModal} className="upload-file-modal">
        <ModalHeader toggle={toggleUploadModal}>
          Add a file to {patient.name}'s files
        </ModalHeader>
        <ModalBody>
          <div className="upload-guidelines mb-4">
            <ul className="list-unstyled mb-0">
              <li className="text-danger mb-0">
                <i className="mdi mdi-alert-circle-outline me-2"></i>
                Do not upload files containing personal information
              </li>
              <li className="text-muted mb-0">
                <i className="mdi mdi-information-outline me-2"></i>
                Maximum file size: 150MB
              </li>
              <li className="text-muted">
                <i className="mdi mdi-file-document-outline me-2"></i>
                Supported formats: DCM, DXF, GIF, JPEG, JPG, MP3, MP4, OBJ, PDF, PNG, STL
              </li>
            </ul>
          </div>

          <div 
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="file-input"
              onChange={handleFileSelect}
              accept=".dcm,.dxf,.gif,.jpeg,.jpg,.mp3,.mp4,.obj,.pdf,.png,.stl"
            />
            <div className="upload-content">
              <i className="mdi mdi-cloud-upload-outline mb-3"></i>
              <p className="mb-0">Import or drag & drop your file</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleUploadModal}>
            Cancel
          </Button>
          <Button color="primary">
            Add file
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Files; 