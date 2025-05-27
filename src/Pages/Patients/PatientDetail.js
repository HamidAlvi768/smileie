import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux"; // Assuming this is used, though not directly in the provided snippet for patient data
import { Container, Row, Col, Collapse, Card, CardBody, Badge, CardHeader, Button, Input, FormGroup, Label, Modal, Form } from "reactstrap";
import { Link, useParams, useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../../Layout/HorizontalLayout/NavBar"; // Assuming this path is correct
import { setNavbarMenuItems } from "../../store/navigation/actions"; // Assuming this path is correct
import Monitoring from "./PatientDetailSections/Monitoring";
import Protocol from "./PatientDetailSections/Protocol";
import Info from "./PatientDetailSections/Info";
import Notes from "./PatientDetailSections/Notes";
import Files from "./PatientDetailSections/Files";

// Mock data moved outside the component
const PATIENT_MOCK_DATA = {
  name: "Stephen Dyos",
  id: "P-00123",
  plan: "Photo Monitoring Full",
  status: "Active",
  nextScan: "2025-06-01",
  alignerNumber: 21,
  excludedTeeth: "Not Set",
  started: "2024-01-01",
  patientApp: "Activated",
  scanBox: "Assigned",
  frequency: "Every week (3 day(s) NO-GO)",
  upperLower: "Both",
  notificationsPanel: {
    date: "2024-03-15",
    title: "New scan received",
    patientInstruction: "Please continue wearing aligners as prescribed",
    teamInstruction: "Review scan for proper aligner fit",
    todo: "Review new scan",
    instruction: "Remind patient to use chewies daily.",
    forceGo: "Enabled"
  },
  goals: {
    "General Goals": ["Closure of all anterior space(s)", "Retention phase"],
    Anteroposterior: ["Class I canine – RIGHT", "Class I canine – LEFT"],
    Vertical: ["Normal overjet [1.0 ; 3.0] mm", "Correction of open bite"],
    Transverse: ["Correction of crossbite – RIGHT", "Correction of crossbite – LEFT"],
  }
};

const OBSERVATION_SUB_OBSERVATIONS_DATA = {
  'Tracking': [
    'First scan – welcome message',
    'Satisfactory aligner tracking',
    'Slight unseat',
    'Noticeable unseat',
    'Noticeable unseat still present',
  ],
  'Attachment loss': [
    'Loss of attachment',
    'Attachment still absent',
  ],
  'Auxiliary appliance': [],
  'Aligner damage': [
    'Aligner auxiliary debonding',
    'Aligner auxiliary damage',
    'Loss of button',
    'Button still absent',
  ],
};

const NAVBAR_ITEMS_TEMPLATE = [
    { id: "monitoring", label: "Monitoring", url: "/patients/:id/monitoring" },
    { id: "protocol", label: "Protocol", url: "/patients/:id/protocol" },
    { id: "info", label: "Info", url: "/patients/:id/info" },
    { id: "notes", label: "Notes", url: "/patients/:id/notes" },
    { id: "files", label: "Files", url: "/patients/:id/files" },
    { id: "guardians", label: "Guardians", url: "/patients/:id/guardians" },
    {
      id: "scheduled-actions",
      label: "Scheduled Actions",
      url: "/patients/:id/scheduled-actions",
    },
    { id: "scans", label: "Scans", url: "/patients/:id/scans" },
    { id: "history", label: "History", url: "/patients/:id/history" },
  ];

const QUICK_REPLY_OPTIONS_DATA = [
  { id: 1, title: "CHEWIES", message: "Please use chewies for better aligner fit", category: "General" },
  { id: 2, title: "CHEWIES – UNSEATING", message: "Please use chewies to help seat your aligners properly", category: "General" },
  { id: 3, title: "NEXT APPOINTMENT", message: "Please schedule your next appointment", category: "Appointments" },
  { id: 4, title: "NEW SCAN", message: "Please send a new scan of your teeth", category: "Monitoring" }
];

const SIDEBAR_SECTIONS_DATA = [
  { id: 'overall', label: 'Overall view', type: 'nav' },
  { id: 'allObservations', label: 'All observations', type: 'search' },
  { id: 'orthoAligners', label: 'ORTHODONTIC PARAMETERS – ALIGNERS', type: 'expandable', observations: ['Tracking', 'Attachment loss', 'Auxiliary appliance', 'Aligner damage'] },
  { id: 'orthoBraces', label: 'ORTHODONTIC PARAMETERS – BRACES', type: 'expandable', observations: ['Positive notifications for braces', 'Bracket', 'Bracket ligature', 'Archwire', 'Auxiliaries'] },
  { id: 'oralHealth', label: 'ORAL HEALTH ASSESSMENT', type: 'expandable', observations: ['Oral hygiene', 'Gingivitis', 'Soft tissue statement', 'Spots and suspected cavities', 'Dental statement'] },
  { id: 'intraoral', label: 'INTRAORAL EVALUATION', type: 'expandable', observations: ['Tooth position', 'Occlusion'] },
  { id: 'retention', label: 'RETENTION', type: 'expandable', observations: ['Removable retainer tracking', 'Retainer damage', 'Relapse'] },
];

// Add this style block at the top or in your SCSS file
const communicationPanelStyle = `
  .communication-panel-fx {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 380px;
    max-width: 100vw;
    background: #fff;
    box-shadow: -2px 0 16px rgba(0,0,0,0.08);
    z-index: 1100;
    display: flex;
    flex-direction: column;
    transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s cubic-bezier(.4,0,.2,1);
    transform: translateX(100%);
    opacity: 0;
    pointer-events: none;
    padding: 10px;
  }
  .communication-panel-fx.open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    padding: 10px;
  }
  .communication-panel-fx .messages-container {
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0;
    margin-bottom: 0.5rem;
  }
  .communication-panel-fx .input-area {
    margin-top: auto;
    background: #fff;
    padding-top: 10px;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('communication-panel-fx-style')) {
  const style = document.createElement('style');
  style.id = 'communication-panel-fx-style';
  style.innerHTML = communicationPanelStyle;
  document.head.appendChild(style);
}

const PatientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Patient ID from URL

  // Assuming patient data might be fetched or come from a store in a real app
  // For now, using the mock data. 'id' would be used to fetch specific patient data.
  const patient = PATIENT_MOCK_DATA; 
  const observationSubObservations = OBSERVATION_SUB_OBSERVATIONS_DATA;
  const quickReplyOptions = QUICK_REPLY_OPTIONS_DATA;
  const sidebarSections = SIDEBAR_SECTIONS_DATA;

  const memoizedSetNavbarMenuItems = useCallback(setNavbarMenuItems, []);

  useEffect(() => {
    const processedNavbarItems = NAVBAR_ITEMS_TEMPLATE.map(item => ({
      ...item,
      url: item.url.replace(":id", id)
    }));
    memoizedSetNavbarMenuItems(processedNavbarItems);
  }, [id, memoizedSetNavbarMenuItems]);

  const [openCollapsibles, setOpenCollapsibles] = useState({
    monitoring: true,
    notifications: false,
    goals: false,
  });
  const toggleCollapsibleSection = (key) => setOpenCollapsibles((prev) => ({ ...prev, [key]: !prev[key] }));

  const [expandedGoals, setExpandedGoals] = useState({});
  const toggleGoal = (category, idx) => {
    const key = `${category}-${idx}`;
    setExpandedGoals(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [communicationPanelMessage, setCommunicationPanelMessage] = useState(""); // Renamed from 'message' to avoid conflict

  // Centralized modal visibility state
  const [modalStates, setModalStates] = useState({
    quickReply: false,
    todo: false,
    instruction: false,
    forceGo: false,
    markReviewed: false,
    pause: false,
    stop: false,
    scanBox: false,
    frequency: false,
    adaptiveInterval: false,
    aligner: false,
    excludedTeeth: false,
    changeMonitoringPlan: false,
    newAction: false,
    addVisit: false,
    createLabel: false,
    beforeAfter: false,
  });

  const toggleModal = (modalName, explicitState) => {
    setModalStates(prev => ({
      ...prev,
      [modalName]: explicitState !== undefined ? explicitState : !prev[modalName],
    }));
  };

  // States for Modals
  const [quickReplySearchQuery, setQuickReplySearchQuery] = useState("");
  const [selectedQuickReplyId, setSelectedQuickReplyId] = useState(null);

  const [todoModalData, setTodoModalData] = useState({ comment: "" });

  const [instructionModalData, setInstructionModalData] = useState({
    instruction: "",
    priority: "Info",
    scheduleLater: false,
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: "05:00",
  });

  const [pauseModalData, setPauseModalData] = useState({
    date: "2025-05-26", // Example date, might need to be dynamic
    message: "",
  });
  
  const [scanBoxModalData, setScanBoxModalData] = useState({ selectedBox: null });
  
  const [frequencyModalData, setFrequencyModalData] = useState({
    scanFrequency: "7",
    followUpFrequency: "3",
  });

  const [adaptiveIntervalSettings, setAdaptiveIntervalSettings] = useState({
    go: { enabled: true, condition: "all", count: "3", decrease: "1", minimum: "3" },
    noGo: { enabled: true, condition: "all", count: "3", increase: "1", maximum: "10" },
  });

  const [alignerModalData, setAlignerModalData] = useState({
    currentAligner: patient.alignerNumber ? Math.min(12, patient.alignerNumber).toString() : "1", // Example: current aligner #12
    totalAligners: patient.alignerNumber ? patient.alignerNumber.toString() : "20", // Example: total from patient data
  });

  // Excluded teeth modal internal states (kept separate due to complexity)
  const [expandedExcludedTeethSections, setExpandedExcludedTeethSections] = useState({
    overall: true, allObservations: false, orthoAligners: false, orthoBraces: false,
    oralHealth: false, intraoral: false, retention: false
  });
  const [selectedExcludedTeethSection, setSelectedExcludedTeethSection] = useState('overall');
  const [expandedExcludedTeethSidebarSection, setExpandedExcludedTeethSidebarSection] = useState(null);
  const [selectedExcludedTeethObservation, setSelectedExcludedTeethObservation] = useState(null);
  const toggleExcludedTeethSection = (section) => {
    setExpandedExcludedTeethSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const [addVisitModalData, setAddVisitModalData] = useState({ date: '2025-05-27' });

  const [createLabelModalData, setCreateLabelModalData] = useState({ input: "", labels: [] });


  // Modal Opening/Toggling Functions (with state reset)
  const openQuickReplyModal = () => {
    setQuickReplySearchQuery("");
    setSelectedQuickReplyId(quickReplyOptions.length > 0 ? quickReplyOptions[0].id : null);
    toggleModal("quickReply", true);
  };

  const openTodoModal = () => {
    setTodoModalData({ comment: "" });
    toggleModal("todo", true);
  };

  const openInstructionModal = () => {
    setInstructionModalData({
      instruction: "",
      priority: "Info",
      scheduleLater: false,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: "05:00",
    });
    toggleModal("instruction", true);
  };
  
  const openPauseModal = () => {
    setPauseModalData({ date: "2025-05-26", message: "" }); // Reset or fetch default
    toggleModal("pause", true);
  };

  const openScanBoxModal = () => {
    setScanBoxModalData({ selectedBox: patient.scanBoxType || null }); // Init with current or null
    toggleModal("scanBox", true);
  };

  const openFrequencyModal = () => {
    // Initialize with patient's current frequency settings if available
    setFrequencyModalData({ scanFrequency: "7", followUpFrequency: "3" });
    toggleModal("frequency", true);
  };

  const openAdaptiveIntervalModal = () => {
    // Initialize with patient's current adaptive settings if available
    setAdaptiveIntervalSettings({
        go: { enabled: true, condition: "all", count: "3", decrease: "1", minimum: "3" },
        noGo: { enabled: true, condition: "all", count: "3", increase: "1", maximum: "10" },
    });
    toggleModal("adaptiveInterval", true);
  };

  const openAlignerModal = () => {
    setAlignerModalData({
        currentAligner: patient.alignerNumber ? Math.min(12, patient.alignerNumber).toString() : "1", // Example value
        totalAligners: patient.alignerNumber ? patient.alignerNumber.toString() : "20" // Example value from patient
    });
    toggleModal("aligner", true);
  };

  const openCreateLabelModal = () => {
    setCreateLabelModalData({ input: "", labels: [] }); // Reset
    toggleModal("createLabel", true);
  };

  const openAddVisitModal = () => {
    setAddVisitModalData({ date: new Date().toISOString().split('T')[0] }); // Default to today
    toggleModal("addVisit", true);
  };


  const filteredReplies = quickReplyOptions.filter(reply =>
    reply.title.toLowerCase().includes(quickReplySearchQuery.toLowerCase()) ||
    reply.message.toLowerCase().includes(quickReplySearchQuery.toLowerCase())
  );
  const getSelectedQuickReply = () => quickReplyOptions.find(reply => reply.id === selectedQuickReplyId);


  const Message = ({ sender, content, date, time, index }) => (
    <div 
      className="message mb-4 position-relative"
      onMouseEnter={() => setHoveredMessage(index)}
      onMouseLeave={() => setHoveredMessage(null)}
    >
      <div className="text-center mb-1">
        <small className="text-muted">{date}</small>
      </div>
      <div className={`p-2 ${sender === 'Patient' ? 'bg-primary text-white' : 'bg-light'} rounded`}>
        {content}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-1">
        <small className="text-muted">{time}</small>
        {hoveredMessage === index && (
          <div 
            className="save-quick-reply"
            style={{ fontSize: '0.8rem', color: '#16b1c7', cursor: 'pointer', backgroundColor: 'white', padding: '2px 8px', borderRadius: '4px', zIndex: 1 }}
            onClick={openQuickReplyModal} // Example action: open quick reply modal to save this message
          >
            Save as a new quick reply
          </div>
        )}
      </div>
    </div>
  );

  // Get the current section from the URL hash
  const currentSection = location.hash.replace('#', '') || 'monitoring';

  return (
    <div className="page-content">
      <div className="topnav" style={{ marginTop: '-67px' }}>
        <Container fluid>
          <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
            <Collapse isOpen={true} className="navbar-collapse" id="topnav-menu-content">
              <ul className="navbar-nav">
                {NAVBAR_ITEMS_TEMPLATE.map((item, key) => (
                  <li key={key} className="nav-item">
                    <Link
                      to={item.url.replace(":id", id)}
                      className={`nav-link${location.pathname === item.url.replace(":id", id) ? ' active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Collapse>
          </nav>
        </Container>
      </div>
      <Container fluid>
        <div className="patient-header">
          <Button color="link" className="back-button" onClick={() => navigate(-1)}>
            <i className="mdi mdi-chevron-left"></i>
          </Button>
          <div className="patient-avatar">
            <i className="mdi mdi-account-circle-outline"></i>
          </div>
          <div className="patient-info">
            <div className="info-row">
              <span className="patient-name">{patient.name}</span>
              <span className="patient-id">(A78B-58F2-W)</span> {/* This ID seems different from patient.id */}
              <Button color="link" className="add-label-btn" onClick={openCreateLabelModal}>
                <i className="mdi mdi-plus-circle-outline"></i>
                Add label
              </Button>
            </div>
            <a href="#" className="before-after-link" onClick={e => { e.preventDefault(); toggleModal('beforeAfter', true); }}>
              <i className="mdi mdi-play-circle-outline"></i>
                BEFORE/AFTER VIDEO
              </a>
            </div>
          <div className="action-buttons">
            <Button color="link" className="add-visit-btn" onClick={() => { toggleModal('newAction', false); openAddVisitModal(); }}>
              Add a visit
            </Button>
            <Button color="primary" className="new-action-btn" onClick={() => toggleModal('newAction', true)}>
              <i className="mdi mdi-plus-circle-outline"></i>
              New action
            </Button>
          </div>
        </div>
      </Container>
      <Container fluid>
        <Row>
          {/* Left Panel */}
          <Col md={4} lg={3}>
            {/* Monitoring Information */}
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => toggleCollapsibleSection("monitoring")}>
                <span>Monitoring Information</span>
                <Button color="link" size="lg">{openCollapsibles.monitoring ? "−" : "+"}</Button>
              </CardHeader>
              <Collapse isOpen={openCollapsibles.monitoring}>
                <CardBody>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Plan:</strong>
                    <div className="d-flex flex-column">
                      <span>{patient.plan}</span>
                      <Button color="link" size="sm" className="p-0 ms-2" onClick={() => toggleModal('changeMonitoringPlan', true)}>Change monitoring plan</Button>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Started:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{patient.started || "2024-01-01"}</span>
                      <div className="mt-1 d-flex gap-2">
                        <Button size="sm" outline color="secondary" className="small-action-button" onClick={openPauseModal}>
                          <i className="mdi mdi-pause me-1"></i>Pause
                        </Button>
                        <Button size="sm" outline color="secondary" className="small-action-button" onClick={() => toggleModal('stop', true)}>
                          <i className="mdi mdi-stop me-1"></i>Stop
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Patient app:</strong>
                    <span>{patient.patientApp || "Activated"}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>ScanBox:</strong>
                    <div className="d-flex flex-column align-items-end">
                    <span>{patient.scanBox || "Assigned"}</span>
                      <Button color="link" size="sm" className="p-0" onClick={openScanBoxModal}>
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Next scan:</strong>
                    <span>{patient.nextScan}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong className="align-self-baseline">Frequency:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{patient.frequency || `Every ${frequencyModalData.scanFrequency} day(s) (${frequencyModalData.followUpFrequency} day(s) NO-GO)`}</span>
                      <div className="d-flex gap-2">
                        <Button color="link" size="sm" className="p-0" onClick={openFrequencyModal}>
                          Change
                        </Button>
                      </div>
                      <div className="mt-2">
                        <span>Adaptive:</span>
                        <span className="fw-bold ms-1">{(adaptiveIntervalSettings.go.enabled || adaptiveIntervalSettings.noGo.enabled) ? 'On' : 'Off'}</span>
                      </div>
                      <Button color="link" size="sm" className="p-0" onClick={openAdaptiveIntervalModal}>
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Upper/Lower:</strong>
                    <span>{patient.upperLower || "Both"}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Aligner #:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{`#${alignerModalData.currentAligner} of ${alignerModalData.totalAligners}`}</span>
                      <Button color="link" size="sm" className="p-0" onClick={openAlignerModal}>
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Excluded teeth:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{patient.excludedTeeth}</span>
                      <Button color="link" size="sm" className="p-0" onClick={() => toggleModal('excludedTeeth', true)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Collapse>
            </Card>
            {/* Notifications to Review */}
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => toggleCollapsibleSection("notifications")}>
                <div className="d-flex align-items-center">
                  <span>Notifications to Review</span>
                  <Badge color="danger" className="ms-2">1</Badge>
                </div>
                <Button color="link" size="lg">{openCollapsibles.notifications ? "−" : "+"}</Button>
              </CardHeader>
              <Collapse isOpen={openCollapsibles.notifications}>
                <CardBody>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Date:</strong>
                    <span>{patient.notificationsPanel.date}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Notification:</strong>
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-check-circle text-success me-2"></i>
                      <span>{patient.notificationsPanel.title}</span>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <strong className="small">Patient Instruction:</strong>
                    <span className="small">{patient.notificationsPanel.patientInstruction}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <strong className="small">Team Instruction:</strong>
                    <span className="small">{patient.notificationsPanel.teamInstruction}</span>
                  </div>
                  <div className="mt-3 d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                      <Button size="sm" className="flex-grow-1 notification-action-button" onClick={openTodoModal}>
                        <i className="mdi mdi-clipboard-check-outline me-1"></i>To-Do
                      </Button>
                      <Button size="sm" className="flex-grow-1 notification-action-button" onClick={openInstructionModal}>
                        <i className="mdi mdi-account-group-outline me-1"></i>Instruction to Team
                      </Button>
                    </div>
                    <div className="d-flex gap-2">
                      <Button size="sm" className="flex-grow-1 notification-action-button" onClick={() => toggleModal('forceGo', true)}>
                        <i className="mdi mdi-flash-outline me-1"></i>Force GO
                      </Button>
                      <Button size="sm" className="flex-grow-1 notification-action-button" onClick={() => toggleModal('markReviewed', true)}>
                        <i className="mdi mdi-check-all me-1"></i>Mark all as viewed
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Collapse>
            </Card>
            {/* Goals */}
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => toggleCollapsibleSection("goals")}>
                <span>Goals</span>
                <Button color="link" size="lg">{openCollapsibles.goals ? "−" : "+"}</Button>
              </CardHeader>
              <Collapse isOpen={openCollapsibles.goals}>
                <CardBody>
                  <div className="goals-section">
                  {Object.entries(patient.goals).map(([category, goals]) => (
                    <div key={category} className="mb-2">
                      <strong>{category}</strong>
                      <ul className="mb-1 ms-3 list-unstyled">
                        {goals.map((goal, idx) => {
                          const key = `${category}-${idx}`;
                          return (
                            <li key={idx} className="mb-1">
                                <div className="goal-item" onClick={() => toggleGoal(category, idx)}>
                                  <i className="mdi mdi-play-circle-outline text-primary play-icon"></i>
                                <span>{goal}</span>
                                <i className={`ms-2 mdi ${expandedGoals[key] ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i>
                              </div>
                              <Collapse isOpen={!!expandedGoals[key]}>
                                <div className="ms-4 mb-2 mt-1 d-flex">
                                    <label className="form-label mb-1 goal-notification">Notify me if the goal is not achieved after week:</label>
                                  <select className="form-select form-select-sm w-auto d-inline-block" style={{ minWidth: 70 }}>
                                    {Array.from({ length: 100 }, (_, i) => (
                                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                  </select>
                                </div>
                              </Collapse>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  </div>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
          {/* Main content */}
          <Col md={8} lg={8}>
            <Routes>
              <Route path="" element={<Navigate to={`/patients/${id}/monitoring`} replace />} />
              <Route path="monitoring" element={<Monitoring patient={PATIENT_MOCK_DATA} />} />
              <Route path="protocol" element={<Protocol patient={PATIENT_MOCK_DATA} />} />
              <Route path="info" element={<Info patient={PATIENT_MOCK_DATA} />} />
              <Route path="notes" element={<Notes patient={PATIENT_MOCK_DATA} />} />
              <Route path="files" element={<Files patient={PATIENT_MOCK_DATA} />} />
              <Route path="*" element={<Navigate to={`/patients/${id}/monitoring`} replace />} />
            </Routes>
          </Col>
          {/* Communication Panel */}
          <div>
            <div
              className="communication-icon"
              onClick={() => setIsCommunicationOpen(true)}
              style={{
                position: 'fixed',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1050,
                background: '#16b1c7',
                color: 'white',
                borderRadius: '24px 0 0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                width: 48,
                height: 48,
                display: isCommunicationOpen ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 28,
              }}
            >
              <i className="mdi mdi-message-text-outline"></i>
            </div>
            <div className={`communication-panel-fx${isCommunicationOpen ? ' open' : ''}`}>
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="mb-0">Communication</h5>
                <Button color="link" className="p-0" onClick={() => setIsCommunicationOpen(false)}>
                  <i className="mdi mdi-chevron-right"></i>
                </Button>
              </div>
              <div className="messages-container">
                <div className="messages">
                  <Message sender="Dr. Smith" content="Please continue wearing aligners as prescribed. Use chewies for better fit." date="March 15, 2024" time="10:30 AM" index={0} />
                  <Message sender="Patient" content="Will do, thank you doctor." date="March 15, 2024" time="10:35 AM" index={1} />
                </div>
                </div>
              {/* Input area for sending message - always at the bottom */}
              <div className="input-area border-top">
                {/* Use a quick reply button */}
                <div className="mb-2">
                  <Button 
                    outline
                    color="primary"
                    size="sm"
                    className="w-100"
                    onClick={openQuickReplyModal}
                  >
                    <i className="mdi mdi-lightning-bolt-outline me-1"></i>
                    Use a quick reply
                  </Button>
                </div>
                <Input type="textarea" value={communicationPanelMessage} onChange={(e) => setCommunicationPanelMessage(e.target.value)} placeholder="Type a message..." rows="3" className="mb-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <Button color="link" size="sm" className="p-0">
                      <i className="mdi mdi-paperclip"></i>
                    </Button>
                    <Button color="link" size="sm" className="p-0">
                      <i className="mdi mdi-emoticon-outline"></i>
                    </Button>
                  </div>
                  <Button color="primary" size="sm">
                    <i className="mdi mdi-send"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>

      {/* Quick Reply Modal */}
      <Modal isOpen={modalStates.quickReply} toggle={() => toggleModal("quickReply")} centered size="lg">
        <div className="modal-header">
          <h5 className="modal-title">Select a quick reply to send to your patient {patient.name}</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("quickReply")} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <label className="form-label text-muted small">SEARCH</label>
            <Input type="text" placeholder="Search quick replies..." value={quickReplySearchQuery} onChange={(e) => setQuickReplySearchQuery(e.target.value)} className="form-control" />
          </div>
          <h6 className="mb-3">My quick replies</h6>
          <div className="quick-replies-list">
            {filteredReplies.map((reply) => (
              <div key={reply.id} className={`p-3 mb-2 rounded quick-reply-item ${selectedQuickReplyId === reply.id ? 'bg-light border border-primary' : 'border hover:border-primary'}`} onClick={() => setSelectedQuickReplyId(reply.id)}>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-1">{reply.title}</h6>
                  <small className="text-muted">{reply.category}</small>
                </div>
                <p className="mb-0 text-muted small">{reply.message}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("quickReply")}>Cancel</Button>
          <Button color="primary" onClick={() => {
            const selected = getSelectedQuickReply();
              if (selected) {
              setCommunicationPanelMessage(selected.message); // Set the main message input
              toggleModal("quickReply", false);
              }
          }}>Choose this reply</Button>
        </div>
      </Modal>

      {/* Send Instruction Modal */}
      <Modal isOpen={modalStates.instruction} toggle={() => toggleModal("instruction")} centered size="lg">
        <div className="modal-header">
          <h5 className="modal-title">Send an instruction to the team regarding {patient.name} ({patient.id})</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("instruction")} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Form>
            <FormGroup className="mb-4">
              <Label className="fw-bold">WRITE YOUR INSTRUCTION:</Label>
              <Input type="textarea" rows="4" value={instructionModalData.instruction} onChange={(e) => setInstructionModalData(s => ({ ...s, instruction: e.target.value }))} className="form-control" />
            </FormGroup>
            <FormGroup className="mb-4">
              <Label className="fw-bold">SELECT THE PRIORITY LEVEL:</Label>
              <Input type="select" value={instructionModalData.priority} onChange={(e) => setInstructionModalData(s => ({ ...s, priority: e.target.value }))} className="form-select">
                <option value="Info">Info</option> <option value="Low">Low</option> <option value="Medium">Medium</option> <option value="High">High</option> <option value="Urgent">Urgent</option>
              </Input>
            </FormGroup>
            <FormGroup className="mb-4">
              <div className="form-check mb-3">
                <Input type="checkbox" id="scheduleLater" checked={instructionModalData.scheduleLater} onChange={(e) => setInstructionModalData(s => ({ ...s, scheduleLater: e.target.checked }))} className="form-check-input" />
                <Label className="form-check-label fw-bold" htmlFor="scheduleLater">SEND THIS MESSAGE LATER (CHOOSE A FUTURE TIME AND DATE):</Label>
              </div>
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <Input type="date" value={instructionModalData.scheduledDate} onChange={(e) => setInstructionModalData(s => ({ ...s, scheduledDate: e.target.value }))} disabled={!instructionModalData.scheduleLater} className="form-control" />
                </div>
                <div className="flex-grow-1">
                  <Input type="time" value={instructionModalData.scheduledTime} onChange={(e) => setInstructionModalData(s => ({ ...s, scheduledTime: e.target.value }))} disabled={!instructionModalData.scheduleLater} className="form-control" />
                </div>
              </div>
            </FormGroup>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("instruction")}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("instruction", false) /* Handle save */}>OK</Button>
        </div>
      </Modal>

      {/* To-do List Modal */}
      <Modal isOpen={modalStates.todo} toggle={() => toggleModal("todo")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Add patient to the To-do List</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("todo")} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p className="mb-4">Do you want to add the patient {patient.name} to the To-do List?</p>
          <div>
            <h6 className="mb-3">YOU CAN ADD AN OPTIONAL COMMENT:</h6>
            <div className="position-relative">
              <Input type="textarea" rows="4" value={todoModalData.comment} onChange={(e) => setTodoModalData(s => ({ ...s, comment: e.target.value }))} className="form-control" placeholder=" " />
              <div className="optional-label">OPTIONAL</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("todo")}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("todo", false) /* Handle add */}>Add to the To-do List</Button>
        </div>
      </Modal>

      {/* Force GO Modal */}
      <Modal isOpen={modalStates.forceGo} toggle={() => toggleModal("forceGo")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Force GO for {patient.name}</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("forceGo")} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="mb-4"><p className="mb-0">When Force Go is activated, the patient will be told to <span className="fw-bold" style={{ color: '#16b1c7' }}>switch to their next aligners</span> regardless of what is detected on their Scan.</p></div>
          <div className="alert alert-info mb-0"><p className="mb-0">This will apply to the <span className="fw-bold" style={{ color: '#16b1c7' }}>next scan only</span>.</p></div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("forceGo")}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("forceGo", false) /* Handle action */}>Send a GO after next scan</Button>
        </div>
      </Modal>

      {/* Mark all as reviewed Modal */}
      <Modal isOpen={modalStates.markReviewed} toggle={() => toggleModal("markReviewed")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Mark all as reviewed</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("markReviewed")} aria-label="Close"></button>
        </div>
        <div className="modal-body"><p className="mb-0">Are you sure you want to mark all patient notifications as reviewed? This action cannot be undone.</p></div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("markReviewed")}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("markReviewed", false) /* Handle action */}>Yes</Button>
        </div>
      </Modal>

      {/* Pause Monitoring Modal */}
      <Modal isOpen={modalStates.pause} toggle={() => toggleModal("pause")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Pause monitoring</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("pause")} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Form>
            <FormGroup className="mb-4">
              <Label className="fw-bold">Pause monitoring until</Label>
              <Input type="date" value={pauseModalData.date} onChange={(e) => setPauseModalData(s => ({ ...s, date: e.target.value }))} className="form-control" />
            </FormGroup>
            <FormGroup className="mb-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Label className="fw-bold mb-0">Send message to patient</Label>
                <span className="text-muted small">Optional</span>
              </div>
              <Input type="textarea" rows="3" value={pauseModalData.message} onChange={(e) => setPauseModalData(s => ({ ...s, message: e.target.value }))} className="form-control" placeholder="Type your message..." />
            </FormGroup>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("pause")}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("pause", false) /* Handle save */}>Save</Button>
        </div>
      </Modal>

      {/* Stop Monitoring Modal */}
      <Modal isOpen={modalStates.stop} toggle={() => toggleModal("stop")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Stop monitoring</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("stop")} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="alert alert-warning mb-4"><p className="mb-0">Stopping monitoring will reset all settings. The patient will move to the "Not Monitored" tab and will still have access to their monitoring history.</p></div>
          <p className="mb-0">Are you sure you want to stop this monitoring?</p>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("stop")}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("stop", false) /* Handle stop */}>Yes</Button>
        </div>
      </Modal>

      {/* Select ScanBox Modal */}
      <Modal isOpen={modalStates.scanBox} toggle={() => toggleModal("scanBox")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Select a ScanBox</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("scanBox", false)}></button>
        </div>
        <div className="modal-body">
          <div className="d-flex gap-3">
            <div className={`flex-grow-1 p-4 border rounded text-center cursor-pointer ${scanBoxModalData.selectedBox === 'scanbox' ? 'border-primary' : ''}`} onClick={() => setScanBoxModalData({ selectedBox: 'scanbox' })}>
              <i className="mdi mdi-cube-outline mb-3 large-icon"></i><h6>ScanBox</h6>
            </div>
            <div className={`flex-grow-1 p-4 border rounded text-center cursor-pointer ${scanBoxModalData.selectedBox === 'scanbox-pro' ? 'border-primary' : ''}`} onClick={() => setScanBoxModalData({ selectedBox: 'scanbox-pro' })}>
              <i className="mdi mdi-cube-scan mb-3 large-icon"></i><h6>ScanBox PRO</h6>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("scanBox", false)}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("scanBox", false) /* Handle save */}>Save</Button>
        </div>
      </Modal>

      {/* Change Scan Frequency Modal */}
      <Modal isOpen={modalStates.frequency} toggle={() => toggleModal("frequency")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Change Scan Frequency</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("frequency", false)}></button>
        </div>
        <div className="modal-body">
          <p className="mb-4">Select the suitable scan frequency</p>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <FormGroup className="mb-4">
                  <Label>Scan frequency</Label>
                  <Input type="select" value={frequencyModalData.scanFrequency} onChange={(e) => setFrequencyModalData(s => ({ ...s, scanFrequency: e.target.value }))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(num => (<option key={num} value={num}>{num} day{num !== 1 ? 's' : ''}</option>))}
                  </Input>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup className="mb-4">
                  <Label>Follow-up scan after no-go</Label>
                  <Input type="select" value={frequencyModalData.followUpFrequency} onChange={(e) => setFrequencyModalData(s => ({ ...s, followUpFrequency: e.target.value }))}>
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (<option key={num} value={num}>{num} day{num !== 1 ? 's' : ''}</option>))}
                  </Input>
                </FormGroup>
              </div>
            </div>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("frequency", false)}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("frequency", false) /* Handle apply */}>Apply</Button>
        </div>
      </Modal>

      {/* Change Adaptive Scan Interval Modal */}
      <Modal isOpen={modalStates.adaptiveInterval} toggle={() => toggleModal("adaptiveInterval")} centered size="xl" style={{ minWidth: '1100px' }}>
        <div className="modal-header">
          <h5 className="modal-title">Change Adaptive Scan Interval</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("adaptiveInterval", false)}></button>
        </div>
        <div className="modal-body">
          <p className="mb-4">Select the suitable adaptive scan interval</p>
          <div className="p-3 mb-4 border rounded bg-light-subtle">
            <div className="d-flex align-items-center mb-3">
              <div className="form-switch me-2"><Input type="switch" id="goSwitch" checked={!!adaptiveIntervalSettings.go.enabled} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, go: { ...s.go, enabled: e.target.checked } }))} /></div>
              <span className="fw-bold" style={{ color: adaptiveIntervalSettings.go.enabled ? '#16b1c7' : '#bfc9d1' }}>GO</span>
            </div>
            <div className="d-flex flex-nowrap align-items-center gap-2">
              <Input type="select" value={adaptiveIntervalSettings.go.condition} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, go: { ...s.go, condition: e.target.value } }))} disabled={!adaptiveIntervalSettings.go.enabled} className="select-wide"><option value="all">All throughout treatment</option><option value="after">After</option></Input>
              <span className={adaptiveIntervalSettings.go.enabled ? '' : 'text-muted'}>after</span>
              <Input type="select" value={adaptiveIntervalSettings.go.count} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, go: { ...s.go, count: e.target.value } }))} disabled={!adaptiveIntervalSettings.go.enabled} className="select-narrow">{[1, 2, 3, 4, 5].map(num => (<option key={num} value={num}>{num}</option>))}</Input>
              <span className={adaptiveIntervalSettings.go.enabled ? '' : 'text-muted'}>GOs in a row, decrease scan interval by</span>
              <Input type="select" value={adaptiveIntervalSettings.go.decrease} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, go: { ...s.go, decrease: e.target.value } }))} disabled={!adaptiveIntervalSettings.go.enabled} style={{ width: 70 }}>{[1, 2, 3, 4, 5].map(num => (<option key={num} value={num}>{num}</option>))}</Input>
              <span className={adaptiveIntervalSettings.go.enabled ? '' : 'text-muted'}>day(s) - not below</span>
              <Input type="select" value={adaptiveIntervalSettings.go.minimum} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, go: { ...s.go, minimum: e.target.value } }))} disabled={!adaptiveIntervalSettings.go.enabled} style={{ width: 70 }}>{[1, 2, 3, 4, 5].map(num => (<option key={num} value={num}>{num}</option>))}</Input>
            </div>
          </div>
          <div className="p-3 border rounded bg-light-subtle">
            <div className="d-flex align-items-center mb-3">
              <div className="form-switch me-2"><Input type="switch" id="noGoSwitch" checked={!!adaptiveIntervalSettings.noGo.enabled} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, noGo: { ...s.noGo, enabled: e.target.checked } }))} /></div>
              <span className="fw-bold" style={{ color: adaptiveIntervalSettings.noGo.enabled ? '#16b1c7' : '#bfc9d1' }}>NO-GO/GO-BACK</span>
            </div>
            <div className="d-flex flex-nowrap align-items-center gap-2">
              <Input type="select" value={adaptiveIntervalSettings.noGo.condition} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, noGo: { ...s.noGo, condition: e.target.value } }))} disabled={!adaptiveIntervalSettings.noGo.enabled} style={{ maxWidth: 200 }}><option value="all">All throughout treatment</option><option value="after">After</option></Input>
              <span className={adaptiveIntervalSettings.noGo.enabled ? '' : 'text-muted'}>after</span>
              <Input type="select" value={adaptiveIntervalSettings.noGo.count} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, noGo: { ...s.noGo, count: e.target.value } }))} disabled={!adaptiveIntervalSettings.noGo.enabled} style={{ width: 70 }}>{[1, 2, 3, 4, 5].map(num => (<option key={num} value={num}>{num}</option>))}</Input>
              <span className={adaptiveIntervalSettings.noGo.enabled ? '' : 'text-muted'}>NO-GOs/GO-BACKs in a row, increase scan interval by</span>
              <Input type="select" value={adaptiveIntervalSettings.noGo.increase} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, noGo: { ...s.noGo, increase: e.target.value } }))} disabled={!adaptiveIntervalSettings.noGo.enabled} style={{ width: 70 }}>{[1, 2, 3, 4, 5].map(num => (<option key={num} value={num}>{num}</option>))}</Input>
              <span className={adaptiveIntervalSettings.noGo.enabled ? '' : 'text-muted'}>day(s) - not above</span>
              <Input type="select" value={adaptiveIntervalSettings.noGo.maximum} onChange={e => setAdaptiveIntervalSettings(s => ({ ...s, noGo: { ...s.noGo, maximum: e.target.value } }))} disabled={!adaptiveIntervalSettings.noGo.enabled} style={{ width: 70 }}>{[5, 6, 7, 8, 9, 10].map(num => (<option key={num} value={num}>{num}</option>))}</Input>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("adaptiveInterval", false)}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("adaptiveInterval", false) /* Handle apply */}>Apply</Button>
        </div>
      </Modal>

      {/* Change Aligner Number Modal */}
       <Modal isOpen={modalStates.aligner} toggle={() => toggleModal("aligner")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Change Aligner Number</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("aligner", false)}></button>
        </div>
        <div className="modal-body">
          <Form>
            <FormGroup className="mb-3">
              <Label for="currentAligner">Current Aligner #</Label>
              <Input type="number" id="currentAligner" value={alignerModalData.currentAligner} onChange={e => setAlignerModalData(s => ({...s, currentAligner: e.target.value}))} />
                </FormGroup>
            <FormGroup>
              <Label for="totalAligners">Total Aligners</Label>
              <Input type="number" id="totalAligners" value={alignerModalData.totalAligners} onChange={e => setAlignerModalData(s => ({...s, totalAligners: e.target.value}))} />
                </FormGroup>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("aligner", false)}>Cancel</Button>
          <Button color="primary" onClick={() => toggleModal("aligner", false) /* Handle save */}>Save</Button>
        </div>
      </Modal>

      {/* Edit Excluded Teeth Modal */}
      <Modal
        isOpen={modalStates.excludedTeeth}
        toggle={() => toggleModal("excludedTeeth")}
        centered
        size="xl"
        className="excluded-teeth-modal"
      >
        <div className="modal-header">
          <h5 className="modal-title">Edit excluded teeth for {patient.name}</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("excludedTeeth", false)}></button>
        </div>
        <div className="modal-body">
          {/* Two-column layout */}
          <div className="row">
            {/* Sidebar */}
            <div className="col-4 sidebar-section">
              {sidebarSections.map(section => (
                <div key={section.id}>
                  {/* Navigation or Search section */}
                  {section.type === 'nav' && (
                    <div
                      className={`nav-item ${selectedExcludedTeethSection === section.id ? 'selected' : ''}`}
                      onClick={() => setSelectedExcludedTeethSection(section.id)}
                    >
                      {section.label}
                      {selectedExcludedTeethSection === section.id && <i className="mdi mdi-chevron-right float-end"></i>}
                    </div>
                  )}
                  {section.type === 'search' && (
                    <div
                      className={`search-section ${selectedExcludedTeethSection === section.id ? 'selected' : ''}`}
                      onClick={() => setSelectedExcludedTeethSection(section.id)}
                    >
                      <div className="fw-bold small mb-1">ALL OBSERVATIONS</div>
                      {selectedExcludedTeethSection === section.id && (
                        <Input
                          type="text"
                          placeholder="Search an observation"
                          value={quickReplySearchQuery}
                          onChange={(e) => setQuickReplySearchQuery(e.target.value)}
                          className="mb-2"
                        />
                      )}
                    </div>
                  )}
                  {/* Expandable section */}
                  {section.type === 'expandable' && (
                    <div className="expandable-section">
                      <div
                        className={`header ${expandedExcludedTeethSidebarSection === section.id ? 'expanded' : ''}`}
                        onClick={() => setExpandedExcludedTeethSidebarSection(expandedExcludedTeethSidebarSection === section.id ? null : section.id)}
                      >
                        {section.label}
                        <i className={`mdi ms-1 ${expandedExcludedTeethSidebarSection === section.id ? 'mdi-chevron-up' : 'mdi-chevron-down'}`} style={{ float: 'right' }}></i>
                      </div>
                      {expandedExcludedTeethSidebarSection === section.id && (
                        <div className="sidebar-collapse ps-3 pb-2 show">
                          {section.observations.map(obs => (
                            <div
                              key={obs}
                              className={`observation-item ${selectedExcludedTeethObservation === obs ? 'selected' : ''}`}
                              onClick={() => setSelectedExcludedTeethObservation(obs)}
                            >
                              {obs}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Content area */}
            <div className="col-8">
              {/* If a sidebar observation is selected, show its sub-observations on the right */}
              {selectedExcludedTeethObservation ? (
                <div className="p-4">
                  <h5 className="mb-3">{selectedExcludedTeethObservation}</h5>
                  {(observationSubObservations[selectedExcludedTeethObservation] && observationSubObservations[selectedExcludedTeethObservation].length > 0) ? (
                    observationSubObservations[selectedExcludedTeethObservation].map(sub => (
                      <div key={sub} className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold">{sub}</div>
                          <button
                            className="btn btn-link btn-sm p-0 ms-2"
                            style={{ color: '#16b1c7', fontWeight: 500, textDecoration: 'underline' }}
                            onClick={() => alert(`Edit ${sub}`)}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="text-muted small">No teeth selected</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted small">No teeth selected</div>
                  )}
                </div>
              ) : (
                // Default content for each section if no observation is selected
                <>
                  {selectedExcludedTeethSection === 'overall' && (
                    <div className="p-4">
                      <p className="text-muted mb-0">
                        You currently have no excluded teeth. Select an observation to exclude one or more
                      </p>
                    </div>
                  )}
                  {selectedExcludedTeethSection === 'allObservations' && (
                    <div className="p-4">
                      <Input
                        type="text"
                        placeholder="Search an observation"
                        value={quickReplySearchQuery}
                        onChange={(e) => setQuickReplySearchQuery(e.target.value)}
                        className="mb-3"
                      />
                    </div>
                  )}
                  {selectedExcludedTeethSection === 'orthoAligners' && (
                    <div className="p-4">{/* Content for Orthodontic parameters – Aligners */}</div>
                  )}
                  {selectedExcludedTeethSection === 'orthoBraces' && (
                    <div className="p-4">{/* Content for Orthodontic parameters – Braces */}</div>
                  )}
                  {selectedExcludedTeethSection === 'oralHealth' && (
                    <div className="p-4">{/* Content for Oral health assessment */}</div>
                  )}
                  {selectedExcludedTeethSection === 'intraoral' && (
                    <div className="p-4">{/* Content for Intraoral evaluation */}</div>
                  )}
                  {selectedExcludedTeethSection === 'retention' && (
                    <div className="p-4">{/* Content for Retention */}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("excludedTeeth", false)}>
             Cancel
          </Button>
          <Button color="primary" onClick={() => toggleModal("excludedTeeth", false)}>
            Save
          </Button>
        </div>
      </Modal>

      {/* Change Monitoring Plan Modal */}
      <Modal isOpen={modalStates.changeMonitoringPlan} toggle={() => toggleModal("changeMonitoringPlan", false)} centered>
        <div className="modal-header">
          <h5 className="modal-title">Change monitoring plan</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("changeMonitoringPlan", false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <div className="fw-bold mb-2">Apply a Quickstart or set up the patient's monitoring manually.</div>
            <a href="#" className="d-block mb-3 text-primary" style={{ fontSize: 14 }}>Can't find the Quickstart you want? Create a new one here</a>
            <div className="border rounded p-3 mb-2 bg-light">
              <div className="mb-1">Photo Monitoring Full | Aligner protocol | 7 days | Other</div>
              <div className="mb-1">MX/MD: Aligner Other</div>
              <div className="mb-1">Teeth excluded from 0 observation(s)</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="primary" onClick={() => toggleModal("changeMonitoringPlan", false)}>Current settings</Button>
        </div>
      </Modal>

      {/* New Action Modal */}
      <Modal isOpen={modalStates.newAction} toggle={() => toggleModal("newAction")} centered size="lg">
        <div className="modal-header">
          <h5 className="modal-title">Create a new action</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("newAction", false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-6">
              <ActionItem icon="mdi-account-check-outline" label="Send a clinical instruction to DM" />
              <ActionItem icon="mdi-camera-outline" label="Add an intraoral scan" />
              <ActionItem icon="mdi-link-variant" label="Generate login link" />
              <ActionItem icon="mdi-account-group-outline" label="Send an instruction to the team" onClick={() => { toggleModal('newAction', false); openInstructionModal(); }}/>
              <ActionItem icon="mdi-camera-plus-outline" label="Ask patient for an additional scan" />
              <ActionItem icon="mdi-calendar-sync-outline" label="Change scan frequency" onClick={() => { toggleModal('newAction', false); openFrequencyModal(); }}/>
              <ActionItem icon="mdi-close-circle-outline" label="Stop monitoring" iconColor="#ff9800" onClick={() => { toggleModal('newAction', false); toggleModal('stop', true); }}/>
              <ActionItem icon="mdi-file-plus-outline" label="Add a file" />
              <ActionItem icon="mdi-share-variant-outline" label="Share Patient" />
            </div>
            <div className="col-md-6">
              <ActionItem icon="mdi-clipboard-check-outline" label="Add to the To-do List" onClick={() => { toggleModal('newAction', false); openTodoModal(); }}/>
              <ActionItem icon="mdi-cellphone-message" label="Send app activation code" />
              <ActionItem icon="mdi-message-outline" label="Send a message to patient" onClick={() => { toggleModal('newAction', false); setIsCommunicationOpen(true); }} />
              <ActionItem icon="mdi-calendar-refresh-outline" label="Reset scan schedule to today" />
              <ActionItem icon="mdi-pause-circle-outline" label="Pause monitoring" onClick={() => { toggleModal('newAction', false); openPauseModal(); }} />
              <ActionItem icon="mdi-tune-variant" label="Change adaptive scan interval" onClick={() => { toggleModal('newAction', false); openAdaptiveIntervalModal(); }} />
              <ActionItem icon="mdi-numeric" label="Change aligner number" onClick={() => { toggleModal('newAction', false); openAlignerModal(); }} />
              <ActionItem icon="mdi-calendar-blank-outline" label="Add a visit" onClick={() => { toggleModal('newAction', false); openAddVisitModal(); }} />
              <ActionItem icon="mdi-cog-outline" label="Change monitoring plan" onClick={() => { toggleModal('newAction', false); toggleModal('changeMonitoringPlan', true); }}/>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("newAction", false)}>Cancel</Button>
        </div>
      </Modal>

      {/* Add Visit Modal */}
      <Modal isOpen={modalStates.addVisit} toggle={() => toggleModal("addVisit")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Add a visit</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("addVisit", false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <label className="form-label fw-bold">Visit date</label>
            <input type="date" className="form-control" value={addVisitModalData.date} onChange={e => setAddVisitModalData({ date: e.target.value })} />
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => { toggleModal("addVisit", false); toggleModal("newAction", true); }}>Back</Button>
          <Button color="primary" onClick={() => toggleModal("addVisit", false) /* Handle add visit */}>Add visit</Button>
        </div>
      </Modal>

      {/* Create Label Modal */}
      <Modal isOpen={modalStates.createLabel} toggle={() => toggleModal("createLabel")} centered>
        <div className="modal-header">
          <h5 className="modal-title">Create new label(s)</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("createLabel", false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Create a new label.</label>
            <div className="d-flex align-items-center gap-2">
              <Input type="text" maxLength={20} value={createLabelModalData.input} onChange={e => setCreateLabelModalData(s => ({ ...s, input: e.target.value }))} className="label-input" />
              <i className="mdi mdi-emoticon-outline emoticon-icon"></i>
              <Button color="primary" size="sm" disabled={!createLabelModalData.input.trim() || createLabelModalData.input.length > 20} onClick={() => {
                  if (createLabelModalData.input.trim() && createLabelModalData.input.length <= 20) {
                    setCreateLabelModalData(s => ({ labels: [...s.labels, s.input.trim()], input: "" }));
                  }
                }}>Create</Button>
            </div>
            <div className="small text-muted mt-1">{createLabelModalData.input.length}/20</div>
          </div>
          <div className="mb-3">
            {createLabelModalData.labels.length === 0 ? (
              <div className="text-muted text-center py-3">No labels created yet.</div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {createLabelModalData.labels.map((label, idx) => ( <span key={idx} className="badge bg-info text-white px-3 py-2 custom-badge">{label}</span> ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("createLabel", false)}>Cancel</Button>
          <Button color="primary" disabled={createLabelModalData.labels.length === 0} onClick={() => toggleModal("createLabel", false) /* Handle add labels */}>
            Add {createLabelModalData.labels.length} label{createLabelModalData.labels.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </Modal>

      {/* Before/After Video Modal */}
      <Modal isOpen={modalStates.beforeAfter} toggle={() => toggleModal("beforeAfter", false)} centered size="md">
        <div className="modal-header">
          <h5 className="modal-title">Watch the before/after {patient.name} ({patient.id})</h5>
          <button type="button" className="btn-close" onClick={() => toggleModal("beforeAfter", false)} aria-label="Close"></button>
        </div>
        <div className="modal-body before-after-modal-body">
          {/* Ensure the image path is correct for your project structure */}
          {/* <img src={require("../../assets/images/demo-before-after.gif")} alt="Before/After Intraoral" className="before-after-modal-img" /> */}
          <p className="text-center">Before/After Video Content Here</p> {/* Placeholder if image is problematic */}
        </div>
      </Modal>
    </div>
  );
};

function ActionItem({ icon, label, iconColor, onClick }) {
  return (
    <Button color="link" className="action-item d-flex align-items-center p-2 text-start w-100" onClick={onClick} style={{textDecoration: 'none'}}>
      <i className={`mdi ${icon} me-2`} style={{ color: iconColor || '#16b1c7', fontSize: '1.2rem' }}></i>
      <span style={{color: '#495057'}}>{label}</span>
    </Button>
  );
}

export default PatientDetail;