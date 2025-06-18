import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronRight, faTooth, faBroom, faClock } from '@fortawesome/free-solid-svg-icons';

const ProgressBar = ({ segments, small, noLabels }) => (
  <div className="progress-bar-container">
    <div className={`progress-bar-visual ${small ? 'progress-bar-visual-small' : 'progress-bar-visual-large'}`}>
      {segments.map((seg, idx) => (
        <div
          key={idx}
          className="progress-bar-segment"
          style={{ width: `${seg.percentage}%`, background: seg.color }}
        />
      ))}
    </div>
    {!noLabels && (
      <div className="progress-bar-labels">
        {segments.map((seg, idx) => (
          <div key={idx} className="progress-bar-label-item">
            <span className="progress-bar-label-swatch" style={{ background: seg.color }} />
            <span>{seg.label}</span>
            {typeof seg.percentage === 'number' && (
              <span>: {seg.percentage}%</span>
            )}
            {seg.scans !== undefined && (
              <span className="progress-bar-label-scans">({seg.scans} scan(s))</span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const DetailedStatsModal = ({ isOpen, toggle, statsData }) => {
  const [activeTab, setActiveTab] = useState('aligners');
  const { aligners, hygiene, scan, debondedAttachments } = statsData || {};

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl" fade={false} backdrop="static" className="detailed-stats-modal-wide">
      <ModalHeader className="detailed-stats-modal-header">
        Detailed statistics
        <Button close onClick={toggle} className="detailed-stats-modal-close-btn" />
      </ModalHeader>
      <ModalBody className="detailed-stats-modal-body">
        <div className="modal-body-content-wrapper">
          {/* Left Sidebar Tabs */}
          <div className="modal-sidebar">
            <button
              onClick={() => setActiveTab('aligners')}
              className={`sidebar-tab sidebar-tab-with-border${activeTab === 'aligners' ? ' active' : ''}`}
            >
              <FontAwesomeIcon icon={faTooth} /> ALIGNERS
            </button>
            <button
              onClick={() => setActiveTab('hygiene')}
              className={`sidebar-tab sidebar-tab-with-border${activeTab === 'hygiene' ? ' active' : ''}`}
            >
              <FontAwesomeIcon icon={faBroom} /> HYGIENE
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`sidebar-tab${activeTab === 'scan' ? ' active' : ''}`}
            >
              <FontAwesomeIcon icon={faClock} /> SCAN COMPLIANCE
            </button>
          </div>
          {/* Main Content Area */}
          <div className="modal-main-content">
            {activeTab === 'aligners' && (
              <>
                <ProgressBar segments={aligners || []} />
                <div className="debonded-attachments-info">
                  <b>{debondedAttachments ?? 0}</b> attachment(s) debonded
                </div>
                {/* Unseat metrics below attachments - now in a single row per metric */}
                {(scan?.slightUnseat || []).length > 0 && (
                  <Row className="subbar-row align-items-center mb-2">
                    <Col xs="auto" className="stat-title-primary mb-0 subbar-title-col">Slight unseat</Col>
                    <Col xs="auto" className="subbar-bar-container">
                      <ProgressBar small segments={scan.slightUnseat.map(seg => ({ ...seg, color: '#008b94' }))} noLabels />
                    </Col>
                    <Col xs="auto" className="subbar-label text-muted small mb-0">
                      {scan.slightUnseat[0].percentage}% - {scan.slightUnseat[0].scans} scan(s)
                    </Col>
                  </Row>
                )}
                {(scan?.noticeableUnseat || []).length > 0 && (
                  <Row className="subbar-row align-items-center mb-2">
                    <Col xs="auto" className="stat-title-secondary mb-0 subbar-title-col">Noticeable unseat</Col>
                    <Col xs="auto" className="subbar-bar-container">
                      <ProgressBar small segments={scan.noticeableUnseat.map(seg => ({ ...seg, color: '#008b94' }))} noLabels />
                    </Col>
                    <Col xs="auto" className="subbar-label text-muted small mb-0">
                      {scan.noticeableUnseat[0].percentage}% - {scan.noticeableUnseat[0].scans} scan(s)
                    </Col>
                  </Row>
                )}
              </>
            )}
            {activeTab === 'hygiene' && (
              <div className="tab-content-text">
                {/* Main hygiene progress bar (green/red) */}
                <ProgressBar segments={hygiene || []} />
                {/* List of hygiene conditions with progress bars */}
                <div className="conditions-container">
                  {(statsData.hygieneConditions || []).map((cond, idx) => (
                    cond.segments && cond.segments.length > 0 ? (
                      <Row key={cond.label || idx} className="subbar-row align-items-center mb-2">
                        <Col xs="auto" className="stat-title-primary mb-0 subbar-title-col">{cond.label}</Col>
                        <Col xs="auto" className="subbar-bar-container">
                          <ProgressBar small segments={cond.segments.map(seg => ({ ...seg, color: '#008b94' }))} noLabels />
                        </Col>
                        <Col xs="auto" className="subbar-label text-muted small mb-0">
                          {cond.segments[0].percentage}% - {cond.segments[0].scans} scan(s)
                        </Col>
                      </Row>
                    ) : null
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'scan' && (
              <div className="tab-content-text">
                {/* Main scan compliance progress bar (green/red) */}
                <ProgressBar segments={statsData.scanCompliance || []} />
                {/* List of scan compliance timeframes with progress bars */}
                <div className="conditions-container">
                  {(statsData.scanComplianceTimeframes || []).map((tf, idx) => (
                    tf.segments && tf.segments.length > 0 ? (
                      <Row key={tf.label || idx} className="subbar-row align-items-center mb-2">
                        <Col xs="auto" className="stat-title-primary mb-0 subbar-title-col">{tf.label}</Col>
                        <Col xs="auto" className="subbar-bar-container">
                          <ProgressBar small segments={tf.segments.map(seg => ({ ...seg, color: '#008b94' }))} noLabels />
                        </Col>
                        <Col xs="auto" className="subbar-label text-muted small mb-0">
                          {tf.segments[0].percentage}% - {tf.segments[0].scans} scan(s)
                        </Col>
                      </Row>
                    ) : null
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DetailedStatsModal; 