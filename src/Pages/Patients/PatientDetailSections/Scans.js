import React, { useState, useCallback, useMemo } from 'react';
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
  const [hoveredScan, setHoveredScan] = useState(null);
  
  const toggleTooltip = useCallback((id) => {
    setTooltipOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

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
      upper: upper,
      lower: lower,
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

  // Helper to format time nicely
  function formatTime(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

  // Helper to get status icon
  function getStatusIcon(status) {
    switch (status) {
      case 'completed': return 'ri-checkbox-circle-fill';
      case 'current': return 'ri-play-circle-fill';
      case 'inprogress': return 'ri-loader-4-line';
      case 'pending': return 'ri-time-line';
      case 'not_started': return 'ri-circle-line';
      case 'skipped': return 'ri-skip-forward-fill';
      default: return 'ri-information-line';
    }
  }

  // Helper to get status color
  function getStatusColor(status) {
    switch (status) {
      case 'completed': return '#43a047';
      case 'current': return '#1da5fe';
      case 'inprogress': return '#1da5fe';
      case 'pending': return '#adb5bd';
      case 'not_started': return '#adb5bd';
      case 'skipped': return '#ffb300';
      default: return '#adb5bd';
    }
  }

  // Helper to calculate days remaining or overdue
  function getDaysInfo(scan) {
    if (!scan.end_date) return null;
    
    const dueDate = new Date(scan.end_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { type: 'remaining', days: diffDays };
    } else if (diffDays < 0) {
      return { type: 'overdue', days: Math.abs(diffDays) };
    } else {
      return { type: 'due', days: 0 };
    }
  }

  // Enhanced tooltip content component
  const EnhancedTooltipContent = useMemo(() => {
    return ({ scan, arch, isLate }) => {
      const daysInfo = getDaysInfo(scan);
      const statusColor = getStatusColor(scan.status);
      const statusIcon = getStatusIcon(scan.status);
      
      return (
        <div className="enhanced-scan-tooltip">
          <div className="tooltip-header">
            <div className="tooltip-title">
              <i className={`${statusIcon} me-2`} style={{ color: statusColor }}></i>
              <span className="fw-bold">Aligner #{scan.step_number}</span>
              <Badge 
                color={scan.status === 'completed' ? 'success' : 
                       scan.status === 'current' || scan.status === 'inprogress' ? 'primary' : 
                       scan.status === 'skipped' ? 'warning' : 'secondary'}
                className="ms-2"
                style={{ fontSize: '0.7rem' }}
              >
                {getStatus(scan, isLate)}
              </Badge>
            </div>
            <div className="tooltip-subtitle">
              {arch === 'upper' ? 'Upper Arch' : 'Lower Arch'}
            </div>
          </div>
          
          <div className="tooltip-content">
            <div className="tooltip-section">
              <div className="tooltip-row">
                <span className="tooltip-label">
                  <i className="ri-calendar-line me-1"></i>
                  Start Date:
                </span>
                <span className="tooltip-value">{formatDate(scan.start_date) || 'Not set'}</span>
              </div>
              
              <div className="tooltip-row">
                <span className="tooltip-label">
                  <i className="ri-calendar-check-line me-1"></i>
                  Due Date:
                </span>
                <span className="tooltip-value">{formatDate(scan.end_date) || 'Not set'}</span>
              </div>
              
              {scan.created_at && (
                <div className="tooltip-row">
                  <span className="tooltip-label">
                    <i className="ri-upload-line me-1"></i>
                    Uploaded:
                  </span>
                  <span className="tooltip-value">
                    {formatDate(scan.created_at)}
                  </span>
                </div>
              )}
              
              {daysInfo && (
                <div className="tooltip-row">
                  <span className="tooltip-label">
                    <i className={`${daysInfo.type === 'overdue' ? 'ri-error-warning-line' : 'ri-time-line'} me-1`}></i>
                    {daysInfo.type === 'overdue' ? 'Overdue:' : daysInfo.type === 'due' ? 'Due:' : 'Remaining:'}
                  </span>
                  <span className={`tooltip-value ${daysInfo.type === 'overdue' ? 'text-danger' : daysInfo.type === 'due' ? 'text-warning' : 'text-success'}`}>
                    {daysInfo.type === 'overdue' ? `${daysInfo.days} day${daysInfo.days > 1 ? 's' : ''} overdue` :
                     daysInfo.type === 'due' ? 'Due today' : `${daysInfo.days} day${daysInfo.days > 1 ? 's' : ''} remaining`}
                  </span>
                </div>
              )}
            </div>
            
            {scan.notes && (
              <div className="tooltip-section">
                <div className="tooltip-row">
                  <span className="tooltip-label">
                    <i className="ri-file-text-line me-1"></i>
                    Notes:
                  </span>
                  <span className="tooltip-value">{scan.notes}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="tooltip-footer">
            <small className="text-muted">
              Click to view details
            </small>
          </div>
        </div>
      );
    };
  }, []);

  // Adjusted styles for larger square cards
  const SQUARE_CARD_STYLE = {
    width: '110px',
    height: '110px',
    minWidth: '110px',
    minHeight: '110px',
    aspectRatio: '1/1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '0.75rem',
    borderRadius: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
  };

  const STATUS_COLORS = {
    pending: '#adb5bd', // gray
    inprogress: '#1da5fe', // blue
    current: '#1da5fe', // blue
    skipped: '#ffb300', // orange/yellow
    late: '#e53935', // strong red
    completed: '#43a047', // green
  };

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
      </div>
      
      {/* Upper Section in its own card */}
      <Card className="mb-4">
        <CardBody className='pt-3'>
          <h5 className="mb-3">Upper</h5>
          <div className="scan-cards-flex" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '1.2rem', padding: '0.5rem 0' }}>
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
              // Only 'pending' status disables the card
              const isDisabled = scan.status === 'pending';
              const isClickable = !isDisabled;
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
              const statusKey = scan.status === 'inprogress' ? 'inprogress' : scan.status;
              const statusColor = STATUS_COLORS[statusKey] || '#adb5bd';
              const isSkipped = scan.status === 'skipped';
              
              return (
                <div key={idx} style={{ display: 'inline-block' }}>
                  <Card
                    id={tooltipId}
                    style={{
                      ...SQUARE_CARD_STYLE,
                      border: isLate ? `2px solid ${STATUS_COLORS.late}` : '1.5px solid #e0e0e0',
                      opacity: isDisabled ? 0.6 : 1,
                      background: isDisabled ? '#f8f9fa' : '#fff',
                      boxShadow: (scan.status === 'inprogress' || scan.status === 'current') ? '0 0 0 3px #1da5fe33' : 'none',
                    }}
                    className={`scan-card-ui text-center d-flex align-items-center justify-content-center mx-auto mb-1${isClickable ? ' scan-card-clickable' : ''}${cardStateClass}${isLate ? ' scan-card-late' : ''}${isDisabled ? ' scan-card-disabled' : ''}`}
                    onMouseEnter={() => setHoveredScan({ scan, arch: 'upper', idx })}
                    onMouseLeave={() => setHoveredScan(null)}
                    {...(isClickable
                      ? {
                          onClick: () => handleScanCardClick('upper', idx, scan),
                          tabIndex: 0,
                          role: 'button',
                          'aria-label': `View scan ${scan.step_number}`,
                        }
                      : { 'aria-disabled': true })}
                  >
                    <CardBody className="scan-card-body d-flex flex-column align-items-center justify-content-start p-2" style={{ width: '100%', height: '100%', padding: 0, background: 'none' }}>
                      <div style={{ marginTop: '10px', fontWeight: 700, fontSize: '1.3em', color: statusColor }}>{String(scan.step_number).padStart(2, '0')}</div>
                      <div style={{ marginTop: '7px', fontSize: '0.95em', fontWeight: 600, color: statusColor, minHeight: '1.1em' }}>
                        {isSkipped ? <span style={{ color: STATUS_COLORS.skipped, fontWeight: 600 }}>Skipped</span> : getStatus(scan, isLate)}
                      </div>
                      <div className="scan-card-date-group mt-1" style={{ marginTop: 'auto', fontSize: '0.75em', color: '#888' }}>
                        <div className="scan-card-date">{formatDate(scan.start_date)}</div>
                        {isPending ? (
                          <div className="scan-card-date text-muted" style={{ fontSize: '8px', opacity: 0.5 }}>-</div>
                        ) : showUploaded ? (
                          <div className="scan-card-date text-muted" style={{ fontSize: '8px' }}>{formatDate(scan.end_date)}</div>
                        ) : (
                          <div className="scan-card-date text-muted" style={{ fontSize: '8px', opacity: 0.5 }}>-</div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  
                  {/* Enhanced Tooltip */}
                  <Tooltip
                    placement="top"
                    isOpen={hoveredScan && hoveredScan.scan.step_number === scan.step_number && hoveredScan.arch === 'upper'}
                    target={tooltipId}
                    toggle={() => {}}
                    autohide={false}
                    delay={{ show: 300, hide: 100 }}
                    className="enhanced-scan-tooltip-container"
                  >
                    <EnhancedTooltipContent scan={scan} arch="upper" isLate={isLate} />
                  </Tooltip>
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
          <div className="scan-cards-flex" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '1.2rem', padding: '0.5rem 0' }}>
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
              // Only 'pending' status disables the card
              const isDisabled = scan.status === 'pending';
              const isClickable = !isDisabled;
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
              const statusKey = scan.status === 'inprogress' ? 'inprogress' : scan.status;
              const statusColor = STATUS_COLORS[statusKey] || '#adb5bd';
              const isSkipped = scan.status === 'skipped';
              
              return (
                <div key={idx} style={{ display: 'inline-block' }}>
                  <Card
                    id={tooltipId}
                    style={{
                      ...SQUARE_CARD_STYLE,
                      border: isLate ? `2px solid ${STATUS_COLORS.late}` : '1.5px solid #e0e0e0',
                      opacity: isDisabled ? 0.6 : 1,
                      background: isDisabled ? '#f8f9fa' : '#fff',
                      boxShadow: (scan.status === 'inprogress' || scan.status === 'current') ? '0 0 0 3px #1da5fe33' : 'none',
                    }}
                    className={`scan-card-ui text-center d-flex align-items-center justify-content-center mx-auto mb-1${isClickable ? ' scan-card-clickable' : ''}${cardStateClass}${isLate ? ' scan-card-late' : ''}${isDisabled ? ' scan-card-disabled' : ''}`}
                    onMouseEnter={() => setHoveredScan({ scan, arch: 'lower', idx })}
                    onMouseLeave={() => setHoveredScan(null)}
                    {...(isClickable
                      ? {
                          onClick: () => handleScanCardClick('lower', idx, scan),
                          tabIndex: 0,
                          role: 'button',
                          'aria-label': `View scan ${scan.step_number}`,
                        }
                      : { 'aria-disabled': true })}
                  >
                    <CardBody className="scan-card-body d-flex flex-column align-items-center justify-content-start p-2" style={{ width: '100%', height: '100%', padding: 0, background: 'none' }}>
                      <div style={{ marginTop: '10px', fontWeight: 700, fontSize: '1.2em', color: statusColor }}>{String(scan.step_number).padStart(2, '0')}</div>
                      <div style={{ marginTop: '7px', fontSize: '0.95em', fontWeight: 600, color: statusColor, minHeight: '1.1em' }}>
                        {isSkipped ? <span style={{ color: STATUS_COLORS.skipped, fontWeight: 700 }}>Skipped</span> : getStatus(scan, isLate)}
                      </div>
                      <div className="scan-card-date-group mt-auto" style={{ marginTop: 'auto', fontSize: '0.75em', color: '#888' }}>
                        <div className="scan-card-date">{formatDate(scan.start_date)}</div>
                        {isPending ? (
                          <div className="scan-card-date text-muted" style={{ fontSize: '8px', opacity: 0.5 }}>-</div>
                        ) : showUploaded ? (
                          <div className="scan-card-date text-muted" style={{ fontSize: '8px' }}>{formatDate(scan.end_date)}</div>
                        ) : (
                          <div className="scan-card-date text-muted" style={{ fontSize: '8px', opacity: 0.5 }}>-</div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  
                  {/* Enhanced Tooltip */}
                  <Tooltip
                    placement="top"
                    isOpen={hoveredScan && hoveredScan.scan.step_number === scan.step_number && hoveredScan.arch === 'lower'}
                    target={tooltipId}
                    toggle={() => {}}
                    autohide={false}
                    delay={{ show: 300, hide: 100 }}
                    className="enhanced-scan-tooltip-container"
                  >
                    <EnhancedTooltipContent scan={scan} arch="lower" isLate={isLate} />
                  </Tooltip>
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
