import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, FormGroup, Label, Form, Badge, Spinner, Alert } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { create3DPlan, get3DPlan, update3DPlan, delete3DPlan } from '../../../store/patients/actions';

const TreatmentPlan3D = ({ patient }) => {
  const dispatch = useDispatch();
  const {
    threeDPlan,
    threeDPlanLoading,
    threeDPlanError,
    creating3DPlan,
    updating3DPlan,
    deleting3DPlan
  } = useSelector(state => state.patients);

  // Local state for form
  const [reelLink, setReelLink] = useState('');
  const [description, setDescription] = useState('');
  const [archType, setArchType] = useState('both');
  const [totalAligners, setTotalAligners] = useState(0);
  const [editing, setEditing] = useState(false);

  // Load existing 3D plan when component mounts
  useEffect(() => {
    if (patient?.id) {
      dispatch(get3DPlan(patient.id));
    }
  }, [dispatch, patient?.id]);

  // Update local state when 3D plan is loaded
  useEffect(() => {
    if (threeDPlan) {
      setReelLink(threeDPlan.plan_url || '');
      setDescription(threeDPlan.description || '');
      setArchType(threeDPlan.arch_type || 'both');
      setTotalAligners(threeDPlan.total_aligners || 0);
      setEditing(false);
    }
  }, [threeDPlan]);

  const handleSave = (e) => {
    e.preventDefault();
    
    const planData = {
      patient_id: patient.id,
      plan_url: reelLink,
      description: description,
      arch_type: archType,
      total_aligners: parseInt(totalAligners) || 0
    };

    if (threeDPlan?.id) {
      // Update existing plan
      dispatch(update3DPlan({ ...planData, id: threeDPlan.id }));
    } else {
      // Create new plan
      dispatch(create3DPlan(planData));
    }
  };

  const handleDelete = () => {
    if (threeDPlan?.id) {
      if (window.confirm('Are you sure you want to delete this 3D treatment plan?')) {
        dispatch(delete3DPlan(threeDPlan.id));
      }
    }
  };

  const isApproved = threeDPlan?.approved === 1;

  return (
    <div className="treatment-plan-3d-section">
      <div className="d-flex align-items-center gap-3 mb-3">
        <h4 className="mb-0">3D Treatment Plan</h4>
        {threeDPlan && (
          <Badge color={isApproved ? 'success' : 'secondary'} pill className="approval-badge">
            {isApproved ? 'Approved' : 'Not Approved'}
          </Badge>
        )}
      </div>

      {threeDPlanError && (
        <Alert color="danger" className="mb-3">
          {threeDPlanError}
        </Alert>
      )}

      <Card>
        <CardBody>
          {threeDPlanLoading ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
              <p className="mt-2">Loading 3D treatment plan...</p>
            </div>
          ) : editing || !threeDPlan ? (
            <Form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div className="row">
                <div className="col-md-4">
                  <FormGroup className="mb-0">
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
                </div>
                <div className="col-md-4">
                  <FormGroup className="mb-0">
                    <Label for="archType">Arch Type</Label>
                    <Input
                      id="archType"
                      type="select"
                      value={archType}
                      onChange={e => setArchType(e.target.value)}
                    >
                      <option value="both">Both</option>
                      <option value="upper">Upper</option>
                      <option value="lower">Lower</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup className="mb-0">
                    <Label for="totalAligners">Total Aligners</Label>
                    <Input
                      id="totalAligners"
                      type="number"
                      min="0"
                      placeholder="Enter total number of aligners..."
                      value={totalAligners}
                      onChange={e => setTotalAligners(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <FormGroup className="mb-0">
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
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                {threeDPlan && (
                  <Button 
                    color="secondary" 
                    onClick={() => setEditing(false)}
                    disabled={creating3DPlan || updating3DPlan}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  color="primary" 
                  type="submit" 
                  size="lg"
                  disabled={creating3DPlan || updating3DPlan}
                >
                  {creating3DPlan || updating3DPlan ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      {creating3DPlan ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    threeDPlan ? 'Update Plan' : 'Save Plan'
                  )}
                </Button>
              </div>
            </Form>
          ) : (
            <div className="d-flex flex-column gap-3">

              {threeDPlan.plan_url && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">3D Plan Viewer</h5>
                    <a 
                      href={threeDPlan.plan_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="fw-bold btn btn-link p-0"
                      style={{textDecoration: 'none'}}
                    >
                      View 3D Treatment Plan
                    </a>
                  </div>
                  <div style={{width: '100%', minHeight: 400, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden'}}>
                    <iframe
                      src={threeDPlan.plan_url}
                      title="3D Plan Viewer"
                      width="100%"
                      height="400"
                      style={{border: 'none'}}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="row mt-2">
                <div className="col-md-6">
                  <strong>Arch Type:</strong> {threeDPlan.arch_type}
                </div>
                <div className="col-md-6">
                  <strong>Total Aligners:</strong> {threeDPlan.total_aligners}
                </div>
              </div>

              {threeDPlan.description && (
                <div className="mt-2 text-muted">
                  <strong>Description:</strong>
                  <div>{threeDPlan.description}</div>
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