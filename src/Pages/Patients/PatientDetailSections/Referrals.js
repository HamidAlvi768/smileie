import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { 
  getReferrals, 
  updateReferralStatus, 
  clearReferralStatusMessages,
  getReferralAmount,
  payReferrals
} from "../../../store/referrals/actions";
import { useToast } from "../../../components/Common/ToastContext";
import { updateAxiosHeaders } from "../../../helpers/api_helper";

const Referrals = ({ patientId }) => {
  const dispatch = useDispatch();
  const showToast = useToast();
  const { 
    referrals, 
    loading, 
    error, 
    updatingStatus, 
    updateStatusError, 
    updateStatusSuccess,
    referralAmount,
    amountLoading,
    amountError,
    payingReferrals,
    payError,
    paySuccess
  } = useSelector((state) => state.referrals);
  
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [payConfirmModal, setPayConfirmModal] = useState(false);

  useEffect(() => {
    if (patientId) {
      updateAxiosHeaders(); // Ensure headers are current
      dispatch(getReferrals(patientId));
      dispatch(getReferralAmount(patientId));
    }
  }, [patientId, dispatch]);

  // Show success/error messages
  useEffect(() => {
    if (updateStatusSuccess) {
      showToast({
        message: updateStatusSuccess.message || "Referral status updated successfully",
        type: "success",
        title: "Success",
      });
      
      // Clear the success message first
      dispatch(clearReferralStatusMessages());
      
      // Update headers and refresh data smoothly after a short delay
      setTimeout(() => {
        updateAxiosHeaders(); // Ensure headers are current
        dispatch(getReferrals(patientId));
        dispatch(getReferralAmount(patientId));
      }, 500);
    }
  }, [updateStatusSuccess, showToast, dispatch, patientId]);

  useEffect(() => {
    if (updateStatusError) {
      showToast({
        message: updateStatusError,
        type: "error",
        title: "Error",
      });
      // Clear the error message after showing toast
      dispatch(clearReferralStatusMessages());
    }
  }, [updateStatusError, showToast, dispatch]);

  // Handle payment success/error
  useEffect(() => {
    if (paySuccess) {
      showToast({
        message: "Referrals paid successfully!",
        type: "success",
        title: "Success",
      });
      // Refresh the referral amount
      updateAxiosHeaders(); // Ensure headers are current
      dispatch(getReferralAmount(patientId));
      // Clear the success message
      dispatch(clearReferralStatusMessages());
    }
  }, [paySuccess, showToast, dispatch, patientId]);

  useEffect(() => {
    if (payError) {
      showToast({
        message: payError,
        type: "error",
        title: "Payment Error",
      });
      // Clear the error message
      dispatch(clearReferralStatusMessages());
    }
  }, [payError, showToast, dispatch]);

  const handleStatusUpdate = (referral, action) => {
    setSelectedReferral(referral);
    setSelectedAction(action);
    setConfirmModal(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedReferral && selectedAction) {
      dispatch(updateReferralStatus(selectedReferral.id, selectedAction));
      setConfirmModal(false);
      setSelectedReferral(null);
      setSelectedAction('');
    }
  };

  const handlePayReferrals = () => {
    setPayConfirmModal(true);
  };

  const confirmPayReferrals = () => {
    dispatch(payReferrals(patientId));
    setPayConfirmModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge color="success">Approved</Badge>;
      case 'declined':
        return <Badge color="danger">Declined</Badge>;
      case 'pending':
        return <Badge color="warning">Pending</Badge>;
      default:
        return <Badge color="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-4">
            <span className="spinner-border spinner-border-sm me-2"></span>
            Loading referrals...
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="text-center text-danger py-4">
            <i className="mdi mdi-alert-circle-outline me-2"></i>
            {error}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="referrals-container">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">
              <i className="mdi mdi-account-multiple-outline me-2"></i>
              Patient Referrals
            </h5>
            <div className="text-muted">
              Total: {referrals.length} referral{referrals.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Referral Amount Summary */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card border-0 bg-light">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 text-muted">Total Referral Amount</h6>
                      {amountLoading ? (
                        <div className="d-flex align-items-center">
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          <span>Loading...</span>
                        </div>
                      ) : amountError ? (
                        <span className="text-danger">Error loading amount</span>
                      ) : (
                        <h4 className="mb-0 text-success fw-bold">
                          ${referralAmount?.total_amount || '0.00'}
                        </h4>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="small text-muted mb-1">Paid: ${referralAmount?.total_paid || '0.00'}</div>
                      <div className="small text-muted mb-1">Pending: ${referralAmount?.total_pending || '0.00'}</div>
                      <div className="small text-muted">Rejected: ${referralAmount?.total_rejected || '0.00'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 bg-light">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 text-muted">Payment Actions</h6>
                      <p className="mb-0 small text-muted">Pay unpaid referrals</p>
                    </div>
                    <div>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={handlePayReferrals}
                        disabled={payingReferrals || !referralAmount || parseFloat(referralAmount.total_pending || 0) <= 0}
                        className="px-3"
                      >
                        {payingReferrals ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-credit-card-outline me-1"></i>
                            Pay Referrals
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="mdi mdi-account-multiple-outline" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">No referrals found for this patient.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                 <thead className="table-light">
                   <tr>
                     <th style={{ width: '60px' }}>#</th>
                     <th>Full Name & Contact</th>
                     <th>Order Code</th>
                     <th>Amount</th>
                     <th>Status</th>
                     <th>Created At</th>
                     <th style={{ width: '200px' }}>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {referrals.map((referral, index) => (
                     <tr key={referral.id}>
                       <td>
                         <strong>{index + 1}</strong>
                       </td>
                       <td>
                         <div className="fw-semibold">{referral.full_name}</div>
                         <div className="text-muted small">{referral.contact}</div>
                       </td>
                       <td>
                         <code className="bg-light px-2 py-1 rounded">{referral.order_code}</code>
                       </td>
                       <td>
                         <span className="fw-bold text-success">${referral.amount}</span>
                       </td>
                       <td>
                         {getStatusBadge(referral.status)}
                       </td>
                       <td>
                         <small className="text-muted">{formatDate(referral.created_at)}</small>
                       </td>
                       <td>
                         {referral.status.toLowerCase() === 'pending' && (
                           <div className="d-flex flex-column gap-1">
                             <Button
                               color="success"
                               size="sm"
                               onClick={() => handleStatusUpdate(referral, 'approved')}
                               disabled={updatingStatus}
                               className="w-100"
                               style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                             >
                               <i className="mdi mdi-check me-1"></i>
                               Approve
                             </Button>
                             <Button
                               color="danger"
                               size="sm"
                               onClick={() => handleStatusUpdate(referral, 'declined')}
                               disabled={updatingStatus}
                               className="w-100"
                               style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                             >
                               <i className="mdi mdi-close me-1"></i>
                               Decline
                             </Button>
                           </div>
                         )}
                         {referral.status.toLowerCase() !== 'pending' && (
                           <span className="text-muted small">No actions available</span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </CardBody>
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)} centered>
        <ModalHeader toggle={() => setConfirmModal(false)}>
          Confirm {selectedAction === 'approved' ? 'Approval' : 'Decline'}
        </ModalHeader>
        <ModalBody>
          {selectedReferral && (
            <div>
              <p>
                Are you sure you want to <strong>{selectedAction}</strong> the referral for{' '}
                <strong>{selectedReferral.full_name}</strong>?
              </p>
              <div className="alert alert-info">
                <strong>Referral Details:</strong>
                <ul className="mb-0 mt-2">
                  <li>Order Code: <code>{selectedReferral.order_code}</code></li>
                  <li>Amount: <strong>${selectedReferral.amount}</strong></li>
                  <li>Contact: {selectedReferral.contact}</li>
                </ul>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            color={selectedAction === 'approved' ? 'success' : 'danger'}
            onClick={confirmStatusUpdate}
            disabled={updatingStatus}
          >
            {updatingStatus ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              `Confirm ${selectedAction === 'approved' ? 'Approval' : 'Decline'}`
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal isOpen={payConfirmModal} toggle={() => setPayConfirmModal(false)} centered>
        <ModalHeader toggle={() => setPayConfirmModal(false)}>
          Confirm Payment
        </ModalHeader>
        <ModalBody>
          <div>
            <p>
              Are you sure you want to pay all unpaid referrals for this patient?
            </p>
            <div className="alert alert-info">
              <strong>Payment Summary:</strong>
              <ul className="mb-0 mt-2">
                <li>Total Amount: <strong>${referralAmount?.total_amount || '0.00'}</strong></li>
                <li>Pending Amount: <strong>${referralAmount?.total_pending || '0.00'}</strong></li>
                <li>Already Paid: <strong>${referralAmount?.total_paid || '0.00'}</strong></li>
              </ul>
            </div>
            <div className="alert alert-warning">
              <i className="mdi mdi-alert-outline me-2"></i>
              This action will mark all pending referrals as paid and cannot be undone.
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setPayConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={confirmPayReferrals}
            disabled={payingReferrals}
          >
            {payingReferrals ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing Payment...
              </>
            ) : (
              <>
                <i className="mdi mdi-credit-card-outline me-1"></i>
                Confirm Payment
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Referrals; 