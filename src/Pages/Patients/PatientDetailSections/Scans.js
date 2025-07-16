import React, { useState } from 'react';
import { Card, CardBody, Button, Badge, Tooltip } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTreatmentSteps } from '../../../store/patients/actions';

const Scans = ({ patient }) => {
  const [sortBy, setSortBy] = useState('dueOn');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { treatmentSteps, treatmentStepsLoading, treatmentStepsError } = useSelector(state => state.patients);

  // Debug: Log the raw treatmentSteps from backend
  console.log('Raw treatmentSteps from backend:', treatmentSteps);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState({});
  const toggleTooltip = (id) => {
    setTooltipOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  React.useEffect(() => {
    if (id) dispatch(getTreatmentSteps(id));
  }, [id, dispatch]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedScans = React.useMemo(() => {
    // New: If treatmentSteps is not an object, return empty arrays
    if (!treatmentSteps || typeof treatmentSteps !== 'object') {
      return { upper: [], lower: [] };
    }
    // Extract upper and lower aligners arrays
    const upper = Array.isArray(treatmentSteps.upper_aligners) ? [...treatmentSteps.upper_aligners] : [];
    const lower = Array.isArray(treatmentSteps.lower_aligners) ? [...treatmentSteps.lower_aligners] : [];
    // Sort each array
    const sortFn = (a, b) => {
      const aVal = a[sortBy === 'dueOn' ? 'end_date' : 'created_at'];
      const bVal = b[sortBy === 'dueOn' ? 'end_date' : 'created_at'];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    };
    return {
      upper: upper.sort(sortFn),
      lower: lower.sort(sortFn),
    };
  }, [treatmentSteps, sortBy, sortOrder]);

  // Use sorted upper and lower arrays
  const upperScans = sortedScans.upper || [];
  const lowerScans = sortedScans.lower || [];

  // Debug: Log the processed upperScans and lowerScans
  console.log('Processed upperScans:', upperScans);
  console.log('Processed lowerScans:', lowerScans);

  // Helper to format date nicely, fallback for invalid dates
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Helper to get status label from backend
  function getStatus(scan, isLate) {
    if (isLate) return 'Late';
    // Use backend status directly
    if (scan.status) {
      // Optionally, map backend status to display label
      switch (scan.status) {
        case 'completed': return 'Completed';
        case 'current': return 'Current';
        case 'inprogress': return 'In-Progress';
        case 'pending': return 'Pending';
        case 'not_started': return 'Not Started';
        default:
          // Capitalize first letter and replace underscores with spaces
          return scan.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    }
    return 'Unknown';
  }

  if (treatmentStepsLoading) return <div>Loading scans...</div>;
  if (treatmentStepsError) return <div className="text-danger">Error loading scans: {treatmentStepsError.toString()}</div>;
  if (!upperScans.length && !lowerScans.length) {
    return (
      <div className="scans-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Treatment Process</h4>
        </div>
        <Card>
          <CardBody className="text-center py-5">
            <div className="mb-3">
              <i className="mdi mdi-clock-outline" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            </div>
            <h5 className="text-muted mb-2">No Scans Available</h5>
            <p className="text-muted mb-0">Waiting for the patient to upload the scan</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // For scan detail
  const handleScanCardClick = (arch, idx, scan) => {
    dispatch({ type: 'GET_SCAN_DETAIL', payload: { id, step_number: scan.step_number } });
    navigate(`/patients/${id}/scans/${arch}/${scan.step_number}`);
  };

  return (
    <div className="scans-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 me-2">Treatment Process</h4>
          <span id="scans-info-icon" style={{ cursor: 'pointer', color: '#1da5fe', display: 'inline-flex', alignItems: 'center' }}>
            <i className="mdi mdi-information-outline" aria-label="Info" tabIndex={0}></i>
          </span>
          <Tooltip
            placement="top"
            className="scans-info-tooltip-fix"
            isOpen={infoTooltipOpen}
            target="scans-info-icon"
            toggle={() => setInfoTooltipOpen(!infoTooltipOpen)}
            autohide={false}
          >
            <div style={{ textAlign: 'left' }}>
              <div><strong>Top date (completed/current):</strong> Due date</div>
              <div><strong>Top date (upcoming):</strong> Start date</div>
              <div><strong>Bottom date:</strong> Uploaded date (if available)</div>
            </div>
          </Tooltip>
        </div>
        {/* <span className="text-muted small">26 result(s)</span> */}
      </div>
      {/* Upper Section in its own card */}
      <Card className="mb-4">
        <CardBody className='pt-3'>
          <h5 className="mb-3">Upper</h5>
          <div className="scan-cards-grid">
            {upperScans.map((scan, idx) => {
              // Use backend status to determine card class
              let cardStateClass = '';
              switch (scan.status) {
                case 'completed': cardStateClass = ' scan-card-completed'; break;
                case 'current':
                case 'inprogress': // Treat inprogress as current for styling
                  cardStateClass = ' scan-card-current';
                  break;
                case 'pending': cardStateClass = ' scan-card-pending'; break;
                case 'not_started': cardStateClass = ' scan-card-notstarted'; break;
                default: cardStateClass = '';
              }
              // Make completed/inprogress cards clickable
              const isClickable = scan.status === 'completed' || scan.status === 'inprogress';
              const showUploaded = !!scan.created_at;
              let isLate = false;
              if (showUploaded) {
                const due = new Date(scan.end_date);
                const uploaded = new Date(scan.created_at);
                isLate = uploaded > due;
              }
              // Determine which date to show on top
              let topDate = '';
              if (['completed', 'current', 'inprogress'].includes(scan.status)) {
                topDate = formatDate(scan.end_date);
              } else if (['pending', 'not_started'].includes(scan.status)) {
                topDate = formatDate(scan.start_date);
              } else {
                topDate = formatDate(scan.end_date);
              }
              const tooltipId = `scan-card-tooltip-upper-${idx}`;
              const isPending = ['pending', 'not_started'].includes(scan.status);
              return (
                <div key={idx}>
                  <Card
                    id={tooltipId}
                    className={`scan-card-ui text-center d-flex align-items-center justify-content-center mx-auto mb-1${isClickable ? ' scan-card-clickable' : ''}${cardStateClass}${isLate ? ' scan-card-late' : ''}${scan.status === 'not_started' ? ' scan-card-disabled' : ''}`}
                    {...(isClickable
                      ? {
                          onClick: () => handleScanCardClick('upper', idx, scan),
                          tabIndex: 0,
                          role: 'button',
                          'aria-label': `View scan ${scan.step_number}`,
                        }
                      : { 'aria-disabled': true })}
                  >
                    <CardBody className="scan-card-body d-flex flex-column align-items-center justify-content-center p-3">
                      <div className="scan-card-aligner-number">{String(scan.step_number).padStart(2, '0')}</div>
                      <div className="scan-card-date-group">
                        <div className="scan-card-date">{topDate}</div>
                        {isPending ? (
                          <div className="scan-card-date text-muted" style={{fontSize: '9px', opacity: 0.5}}>-</div>
                        ) : showUploaded ? (
                          <div className="scan-card-date text-muted" style={{fontSize: '9px'}}>{formatDate(scan.created_at)}</div>
                        ) : (
                          <div className="scan-card-date text-muted" style={{fontSize: '9px', opacity: 0.5}}>-</div>
                        )}
                      </div>
                    </CardBody>
                    <Tooltip
                      placement="top"
                      isOpen={tooltipOpen[tooltipId]}
                      target={tooltipId}
                      toggle={() => toggleTooltip(tooltipId)}
                      autohide={false}
                      delay={{ show: 100, hide: 100 }}
                      className="scan-card-tooltip-white"
                    >
                      <div style={{ textAlign: 'left', minWidth: 160 }}>
                        <div><strong>Aligner #:</strong> {scan.step_number}</div>
                        {isPending ? (
                          <div><strong>Starting :</strong> {formatDate(scan.start_date)}</div>
                        ) : showUploaded ? (
                          <div><strong>Uploaded:</strong> {formatDate(scan.created_at)}</div>
                        ) : null}
                        <div><strong>Due date:</strong> {formatDate(scan.end_date)}</div>
                        <div><strong>Status:</strong> {getStatus(scan, isLate)}</div>
                      </div>
                    </Tooltip>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
      {/* Lower Section in its own card */}
      <Card>
        <CardBody className='pt-3'>
          <h5 className="mb-3">Lower</h5>
          <div className="scan-cards-grid">
            {lowerScans.map((scan, idx) => {
              // Use backend status to determine card class
              let cardStateClass = '';
              switch (scan.status) {
                case 'completed': cardStateClass = ' scan-card-completed'; break;
                case 'current':
                case 'inprogress': // Treat inprogress as current for styling
                  cardStateClass = ' scan-card-current';
                  break;
                case 'pending': cardStateClass = ' scan-card-pending'; break;
                case 'not_started': cardStateClass = ' scan-card-notstarted'; break;
                default: cardStateClass = '';
              }
              // Make completed/inprogress cards clickable
              const isClickable = scan.status === 'completed' || scan.status === 'inprogress';
              const showUploaded = !!scan.created_at;
              let isLate = false;
              if (showUploaded) {
                const due = new Date(scan.end_date);
                const uploaded = new Date(scan.created_at);
                isLate = uploaded > due;
              }
              // Determine which date to show on top
              let topDate = '';
              if (['completed', 'current', 'inprogress'].includes(scan.status)) {
                topDate = formatDate(scan.end_date);
              } else if (['pending', 'not_started'].includes(scan.status)) {
                topDate = formatDate(scan.start_date);
              } else {
                topDate = formatDate(scan.end_date);
              }
              const tooltipId = `scan-card-tooltip-lower-${idx}`;
              const isPending = ['pending', 'not_started'].includes(scan.status);
              return (
                <div key={idx}>
                  <Card
                    id={tooltipId}
                    className={`scan-card-ui text-center d-flex align-items-center justify-content-center mx-auto mb-1${isClickable ? ' scan-card-clickable' : ''}${cardStateClass}${isLate ? ' scan-card-late' : ''}${scan.status === 'not_started' ? ' scan-card-disabled' : ''}`}
                    {...(isClickable
                      ? {
                          onClick: () => handleScanCardClick('lower', idx, scan),
                          tabIndex: 0,
                          role: 'button',
                          'aria-label': `View scan ${scan.step_number}`,
                        }
                      : { 'aria-disabled': true })}
                  >
                    <CardBody className="scan-card-body d-flex flex-column align-items-center justify-content-center p-3">
                      <div className="scan-card-aligner-number">{String(scan.step_number).padStart(2, '0')}</div>
                      <div className="scan-card-date-group">
                        <div className="scan-card-date">{topDate}</div>
                        {isPending ? (
                          <div className="scan-card-date text-muted" style={{fontSize: '9px', opacity: 0.5}}>-</div>
                        ) : showUploaded ? (
                          <div className="scan-card-date text-muted" style={{fontSize: '9px'}}>{formatDate(scan.created_at)}</div>
                        ) : (
                          <div className="scan-card-date text-muted" style={{fontSize: '9px', opacity: 0.5}}>-</div>
                        )}
                      </div>
                    </CardBody>
                    <Tooltip
                      placement="top"
                      isOpen={tooltipOpen[tooltipId]}
                      target={tooltipId}
                      toggle={() => toggleTooltip(tooltipId)}
                      autohide={false}
                      delay={{ show: 100, hide: 100 }}
                      className="scan-card-tooltip-white"
                    >
                      <div style={{ textAlign: 'left', minWidth: 160 }}>
                        <div><strong>Aligner #:</strong> {scan.step_number}</div>
                        {isPending ? (
                          <div><strong>Starting :</strong> {formatDate(scan.start_date)}</div>
                        ) : showUploaded ? (
                          <div><strong>Uploaded:</strong> {formatDate(scan.created_at)}</div>
                        ) : null}
                        <div><strong>Due date:</strong> {formatDate(scan.end_date)}</div>
                        <div><strong>Status:</strong> {getStatus(scan, isLate)}</div>
                      </div>
                    </Tooltip>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Scans;