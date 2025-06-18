import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import VisTimeline from './VisTimeline';
import { ImageViewer, IndicesPanel, ObservationsGoals } from './Monitoring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../../assets/scss/pages/patient.scss';

const FullscreenComparisonModal = ({
  isOpen,
  toggle,
  leftData,
  rightData
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen className="comparison-modal" fade={false}>
      <ModalBody className="comparison-modal-body" style={{ background: '#f7fafc', padding: 0, position: 'relative' }}>
        {/* Close Button */}
        <button
          onClick={toggle}
          style={{
            position: 'absolute',
            top: 18,
            right: 24,
            background: 'none',
            border: 'none',
            color: '#bfc9d1',
            fontSize: 32,
            cursor: 'pointer',
            zIndex: 10,
            padding: 0,
            lineHeight: 1
          }}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {/* Patient Header Row */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', minHeight: 48 }}>
          <span style={{ marginRight: 16, marginLeft: 24, display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: 32, color: '#bfc9d1' }} />
          </span>
          <span style={{ fontWeight: 600, fontSize: 24, color: '#607181', flex: '0 1 auto', textAlign: 'center' }}>
            {leftData.patientName}
          </span>
          <span style={{ marginLeft: 16, fontSize: 18, color: '#bfc9d1', fontWeight: 400, minWidth: 80, textAlign: 'left' }}>
            {leftData.patientId}
          </span>
        </div>
        <div className="comparison-modal-content" style={{ display: 'flex', height: 'calc(100vh - 48px)', gap: 0 }}>
          {/* Left Side */}
          <div className="comparison-side" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e3eaf3', background: '#fff' }}>
            <div style={{ padding: '0 32px 0 32px', background: '#f7fafc' }}>
              <VisTimeline {...leftData.timelineProps} minimal={true} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px' }}>
              <ImageViewer {...leftData.imageViewerProps} />
              {/* <div style={{ width: '100%', marginTop: 24 }}>
                <IndicesPanel {...leftData.indicesPanelProps} />
                <ObservationsGoals {...leftData.observationsGoalsProps} />
              </div> */}
            </div>
          </div>
          {/* Right Side */}
          <div className="comparison-side" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ padding: '0 32px 0 32px', background: '#f7fafc' }}>
              <VisTimeline {...rightData.timelineProps} minimal={true} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px' }}>
              <ImageViewer {...rightData.imageViewerProps} />
              {/* <div style={{ width: '100%', marginTop: 24 }}>
                <IndicesPanel {...rightData.indicesPanelProps} />
                <ObservationsGoals {...rightData.observationsGoalsProps} />
              </div> */}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FullscreenComparisonModal; 