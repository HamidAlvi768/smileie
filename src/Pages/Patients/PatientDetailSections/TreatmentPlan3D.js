import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, FormGroup, Label, Form, Badge, Spinner, Alert } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { create3DPlan, get3DPlan, update3DPlan, delete3DPlan } from '../../../store/patients/actions';
import { getPatientStatsAPI } from '../../../helpers/api_helper';
// import './TreatmentPlan3DStepper.css'; // (optional: for custom stepper styling)

const getCurrentStep = (threeDPlan, editing) => {
  if (editing || !threeDPlan) return 1;
  if (threeDPlan && threeDPlan.approved !== 1) return 2;
  if (threeDPlan && threeDPlan.approved === 1) return 3;
  return 1;
};

const Stepper = ({ currentStep, maxStepReached, onStepClick }) => (
  <div className="treatment-stepper d-flex align-items-center mb-4">
    {[1, 2, 3].map((step, idx) => (
      <React.Fragment key={step}>
        <div
          className={`step-circle${currentStep === step ? ' active' : ''}${currentStep > step ? ' completed' : ''}${step <= maxStepReached ? ' clickable' : ''}`}
          onClick={() => step <= maxStepReached && onStepClick && onStepClick(step)}
          style={{ cursor: step <= maxStepReached ? 'pointer' : 'default' }}
        >
          {step}
        </div>
        <div
          className={`step-label${currentStep === step ? ' active' : ''}${step <= maxStepReached ? ' clickable' : ''}`}
          onClick={() => step <= maxStepReached && onStepClick && onStepClick(step)}
          style={{ cursor: step <= maxStepReached ? 'pointer' : 'default' }}
        >{
          step === 1 ? 'URL & Description' : step === 2 ? 'Approval & 3D View' : 'Arch Type & Aligners'
        }</div>
        {step < 3 && <div className={`step-bar${currentStep > step ? ' completed' : ''}`}></div>}
      </React.Fragment>
    ))}
  </div>
);

const ARCH_TYPE_OPTIONS = [
  { value: '', label: 'Select Arch Type' },
  { value: 'day_dual', label: 'Day time dual arch' },
  { value: 'night_dual', label: 'Night time dual arch' },
  { value: 'day_upper', label: 'Day time upper arch' },
  { value: 'day_lower', label: 'Day time lower arch' },
  { value: 'night_upper', label: 'Night time upper arch' },
  { value: 'night_lower', label: 'Night time lower arch' },
];

function getArchTypeLabel(value) {
  const found = ARCH_TYPE_OPTIONS.find(opt => opt.value === value);
  return found ? found.label : value;
}

function getArchTypeValue(label) {
  const found = ARCH_TYPE_OPTIONS.find(opt => opt.label === label);
  return found ? found.value : label;
}

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

  // Get patient info from Redux
  const patientDetail = useSelector(state => state.patients.patientDetail);
  const patientAlignerType = patientDetail?.aligner_type || '';

  // State for patient stats from API
  const [patientStats, setPatientStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // Local state for form
  const [reelLink, setReelLink] = useState('');
  const [description, setDescription] = useState('');
  // Use patientAlignerType as default if no 3D plan arch_type
  const [archType, setArchType] = useState(threeDPlan?.arch_type || patientAlignerType || 'both');
  const [totalAligners, setTotalAligners] = useState(0);
  const [editing, setEditing] = useState(false);

  // Validation state for URL
  const [urlError, setUrlError] = useState('');

  // Local state for 3rd step fields
  // Use stats API aligner_type as default if no 3D plan arch_type
  const [archTypeStep3, setArchTypeStep3] = useState(threeDPlan?.arch_type || patientStats?.aligner_type || 'day_dual');
  const [upperAligners, setUpperAligners] = useState(0);
  const [lowerAligners, setLowerAligners] = useState(0);
  // Track if step 3 was saved successfully
  const [isStep3Saved, setIsStep3Saved] = useState(false);

  // Track current step in local state for navigation
  const [currentStep, setCurrentStep] = useState(getCurrentStep(threeDPlan, editing));
  // Compute maxStepReached based on data
  let maxStepReached = 1;
  if (threeDPlan) {
    maxStepReached = threeDPlan.approved === 1 ? 3 : 2;
  }
  // Keep currentStep in sync with data/logic
  useEffect(() => {
    const logicalStep = getCurrentStep(threeDPlan, editing);
    if (currentStep > logicalStep) {
      setCurrentStep(logicalStep);
    }
    // If we just advanced, auto-advance
    if (currentStep < logicalStep) {
      setCurrentStep(logicalStep);
    }
  }, [threeDPlan, editing]);

  // Load existing 3D plan when component mounts
  useEffect(() => {
    if (patient?.id) {
      dispatch(get3DPlan(patient.id));
    }
  }, [dispatch, patient?.id]);

  // Load patient stats when component mounts
  useEffect(() => {
    if (patient?.id) {
      setStatsLoading(true);
      setStatsError(null);
      getPatientStatsAPI(patient.id)
        .then((res) => {
          console.log('Patient stats API response:', res);
          setPatientStats(res.data || null);
          setStatsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching patient stats:', err);
          setStatsError("Failed to load patient stats");
          setStatsLoading(false);
        });
    }
  }, [patient?.id]);

  // Update local state when 3D plan is loaded
  useEffect(() => {
    if (threeDPlan) {
      setReelLink(threeDPlan.plan_url || '');
      setDescription(threeDPlan.description || '');
      setArchType(threeDPlan.arch_type || patientAlignerType || 'both');
      setTotalAligners(threeDPlan.total_aligners || 0);
      setEditing(false);
    } else if (patientAlignerType) {
      setArchType(patientAlignerType);
    }
  }, [threeDPlan, patientAlignerType]);

  // When threeDPlan or patientStats changes, update local state for step 3
  useEffect(() => {
    if (threeDPlan) {
      setArchTypeStep3(threeDPlan.arch_type || patientStats?.aligner_type || 'day_dual');
      setUpperAligners(threeDPlan.upper_aligners || 0);
      setLowerAligners(threeDPlan.lower_aligners || 0);
    } else if (patientStats?.aligner_type) {
      setArchTypeStep3(patientStats.aligner_type);
    }
  }, [threeDPlan, patientStats]);

  // Add after the useEffect that updates local state from threeDPlan
  useEffect(() => {
    if (!threeDPlan && patient?.id) {
      setReelLink('');
      setDescription('');
      setArchType(patientStats?.aligner_type || 'both');
      setTotalAligners(0);
      setArchTypeStep3(patientStats?.aligner_type || 'day_dual');
      setUpperAligners(0);
      setLowerAligners(0);
      setEditing(false);
    }
  }, [threeDPlan, patient?.id, patientStats]);

  // Automatically go to step 2 after successful save in step 1
  useEffect(() => {
    // If we were editing, and now not creating/updating, and threeDPlan exists, exit editing mode
    if ((creating3DPlan === false && updating3DPlan === false) && editing && threeDPlan) {
      setEditing(false);
    }
  }, [creating3DPlan, updating3DPlan, editing, threeDPlan]);

  // Track successful save for step 3
  useEffect(() => {
    if (!updating3DPlan && !threeDPlanError) {
      setIsStep3Saved(true);
    }
  }, [updating3DPlan, threeDPlanError]);

  // Reset isStep3Saved if user changes any step 3 field or stats change
  useEffect(() => {
    setIsStep3Saved(false);
  }, [archTypeStep3, upperAligners, lowerAligners, patientStats?.aligner_type]);

  const handleSave = (e) => {
    e.preventDefault();
    // Validate URL
    const urlPattern = /^https:\/\/doctor\.smileie\.com\/\/access\/[a-zA-Z0-9]+$/;
    if (!urlPattern.test(reelLink)) {
      setUrlError('Please enter a valid Smileie 3D plan URL');
      return;
    } else {
      setUrlError('');
    }
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

  // Helper to format approved_at date
  function formatApprovedAt(dateStr) {
    if (!dateStr) return '';
    // Convert 'YYYY-MM-DD HH:mm:ss' to 'YYYY-MM-DDTHH:mm:ss'
    const isoString = dateStr.replace(' ', 'T');
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    // Only return the date part, e.g., 'July 10, 2025'
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Helper: determine which aligner fields to enable based on stats API aligner_type
  const statsAlignerType = patientStats?.aligner_type || '';
  const isDual = statsAlignerType.includes('dual');
  const isUpper = statsAlignerType.includes('upper');
  const isLower = statsAlignerType.includes('lower');

  // Debug logging
  console.log('Patient Stats:', patientStats);
  console.log('Stats Aligner Type:', statsAlignerType);
  console.log('Is Dual:', isDual, 'Is Upper:', isUpper, 'Is Lower:', isLower);

  return (
    <div className="treatment-plan-3d-section">
      <Stepper currentStep={currentStep} maxStepReached={maxStepReached} onStepClick={setCurrentStep} />
      <div className="d-flex align-items-center gap-3 mb-3">
        <h4 className="mb-0">3D Treatment Plan</h4>
        {threeDPlan && (
          <>
            <Badge color={isApproved ? 'success' : 'secondary'} pill className="approval-badge">
              {isApproved ? 'Approved on '+formatApprovedAt(threeDPlan.approved_at) : 'Not Approved'}
            </Badge>
            {isApproved && threeDPlan.approved_at && (
              <span className="approved-on text-muted" style={{ fontSize: '0.98rem', marginLeft: 8 }}> </span>
            )}
          </>
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
          ) : (
            <>
              {currentStep === 1 && (
            <Form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div className="row">
                    <div className="col-md-12">
                  <FormGroup className="mb-0">
                    <Label for="reelLink">3D Reel Link</Label>
                    <Input
                      id="reelLink"
                      type="url"
                      placeholder="Paste the 3D treatment plan link here..."
                      value={reelLink}
                      onChange={e => setReelLink(e.target.value)}
                      required
                      invalid={!!urlError}
                    />
                    {urlError && (
                      <div className="invalid-feedback d-block">{urlError}</div>
                    )}
                  </FormGroup>
                </div>
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
                  disabled={creating3DPlan || updating3DPlan || (threeDPlan && !editing)}
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
              )}
              {currentStep === 2 && threeDPlan && (
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
                          style={{textDecoration: 'none'}}>
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
                    <div className="col-md-12">
                      <strong>Description:</strong> {threeDPlan.description}
                </div>
              </div>
                  {/* No Edit/Delete buttons in step 2 */}
                </div>
              )}
              {currentStep === 3 && threeDPlan && (
                <>
                  <Form onSubmit={e => {
                    e.preventDefault();
                    dispatch(update3DPlan({
                      ...threeDPlan,
                      arch_type: patientStats?.aligner_type || archTypeStep3,
                      upper_aligners: upperAligners,
                      lower_aligners: lowerAligners,
                      patient_id: patient.id,
                    }));
                  }} className="d-flex flex-column gap-3">
                    <div className="row mt-2">
                      <div className="col-md-4">
                        <FormGroup>
                          <Label for="archTypeStep3">Arch Type</Label>
                          <Input
                            id="archTypeStep3"
                            type="text"
                            value={patientStats?.aligner_type || 'Loading...'}
                            disabled
                            className="form-control-plaintext"
                            style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
                          />
                          {statsLoading && (
                            <small className="text-muted">Loading arch type from patient stats...</small>
                          )}
                          {statsError && (
                            <small className="text-danger">Failed to load arch type: {statsError}</small>
                          )}
                        </FormGroup>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label for="upperAligners">Upper Aligners </Label>
                          <Input
                            id="upperAligners"
                            type="number"
                            min="0"
                            value={upperAligners}
                            onChange={e => setUpperAligners(Number(e.target.value))}
                            disabled={!(isDual || isUpper) || (threeDPlan.upper_aligners > 0)}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label for="lowerAligners">Lower Aligners</Label>
                          <Input
                            id="lowerAligners"
                            type="number"
                            min="0"
                            value={lowerAligners}
                            onChange={e => setLowerAligners(Number(e.target.value))}
                            disabled={!(isDual || isLower) || (threeDPlan.lower_aligners > 0)}
                          />
                        </FormGroup>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <Button color="primary" type="submit" size="lg"
                        disabled={
                          updating3DPlan ||
                          isStep3Saved ||
                          statsLoading ||
                          (threeDPlan.upper_aligners > 0 || threeDPlan.lower_aligners > 0)
                        }
                      >
                        {updating3DPlan ? <><Spinner size="sm" className="me-2" />Saving...</> : isStep3Saved ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TreatmentPlan3D; 