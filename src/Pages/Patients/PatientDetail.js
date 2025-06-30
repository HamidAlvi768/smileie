import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardBody,
  Badge,
  CardHeader,
  Button,
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";
import {
  Link,
  useParams,
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "../../Layout/HorizontalLayout/NavBar";
import { setNavbarMenuItems } from "../../store/navigation/actions";
import { getPatientDetail } from "../../store/patients/actions";
import Monitoring from "./PatientDetailSections/Monitoring";
import Protocol from "./PatientDetailSections/Protocol";
import Info from "./PatientDetailSections/Info";
import Notes from "./PatientDetailSections/Notes";
import Files from "./PatientDetailSections/Files";
import Guardians from "./PatientDetailSections/Guardians";
import ScheduledActions from "./PatientDetailSections/ScheduledActions";
import Scans from "./PatientDetailSections/Scans";
import ScanDetail from "./PatientDetailSections/ScanDetail";
import History from "./PatientDetailSections/History";
import threeShapeLogo from "../../assets/images/three_shape_logo.png";
import {
  fetchMessages,
  sendMessage,
  receiveMessage,
} from "../../store/messages/actions";
import config from '../../config.js';
import OrderDetail from "./PatientDetailSections/OrderDetail";

// Mock data moved outside the component
const PATIENT_MOCK_DATA = {
  name: "Stephen Dyos",
  id: "P-00123",
  plan: "Photo Monitoring Full",
  alignerType: "Day Aligner",
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
    forceGo: "Enabled",
  },
  goals: {
    "General Goals": ["Closure of all anterior space(s)", "Retention phase"],
    Anteroposterior: ["Class I canine – RIGHT", "Class I canine – LEFT"],
    Vertical: ["Normal overjet [1.0 ; 3.0] mm", "Correction of open bite"],
    Transverse: [
      "Correction of crossbite – RIGHT",
      "Correction of crossbite – LEFT",
    ],
  },
};

const OBSERVATION_SUB_OBSERVATIONS_DATA = {
  Tracking: [
    "First scan – welcome message",
    "Satisfactory aligner tracking",
    "Slight unseat",
    "Noticeable unseat",
    "Noticeable unseat still present",
  ],
  "Attachment loss": ["Loss of attachment", "Attachment still absent"],
  "Auxiliary appliance": [],
  "Aligner damage": [
    "Aligner auxiliary debonding",
    "Aligner auxiliary damage",
    "Loss of button",
    "Button still absent",
  ],
};

const NAVBAR_ITEMS_TEMPLATE = [
  { id: "monitoring", label: "Monitoring", url: "/patients/:id/monitoring" },
  /* Temporarily commented out Protocol
  { id: "protocol", label: "Protocol", url: "/patients/:id/protocol" },
  */
  { id: "info", label: "Info", url: "/patients/:id/info" },
  /* Temporarily commented out Notes
  { id: "notes", label: "Notes", url: "/patients/:id/notes" },
  */
  { id: "files", label: "Files", url: "/patients/:id/files" },
  // { id: "guardians", label: "Guardians", url: "/patients/:id/guardians" },
  /* Temporarily commented out Scheduled Actions
  {
    id: "scheduled-actions",
    label: "Scheduled Actions",
    url: "/patients/:id/scheduled-actions",
  },
  */
  { id: "scans", label: "Scans", url: "/patients/:id/scans" },
  { id: "order", label: "Orders", url: "/patients/:id/order" },
  { id: "history", label: "History", url: "/patients/:id/history" },
];

const QUICK_REPLY_OPTIONS_DATA = [
  {
    id: 1,
    title: "CHEWIES",
    message: "Please use chewies for better aligner fit",
    category: "General",
  },
  {
    id: 2,
    title: "CHEWIES – UNSEATING",
    message: "Please use chewies to help seat your aligners properly",
    category: "General",
  },
  {
    id: 3,
    title: "NEXT APPOINTMENT",
    message: "Please schedule your next appointment",
    category: "Appointments",
  },
  {
    id: 4,
    title: "NEW SCAN",
    message: "Please send a new scan of your teeth",
    category: "Monitoring",
  },
];

const SIDEBAR_SECTIONS_DATA = [
  { id: "overall", label: "Overall view", type: "nav" },
  { id: "allObservations", label: "All observations", type: "search" },
  {
    id: "orthoAligners",
    label: "ORTHODONTIC PARAMETERS – ALIGNERS",
    type: "expandable",
    observations: [
      "Tracking",
      "Attachment loss",
      "Auxiliary appliance",
      "Aligner damage",
    ],
  },
  {
    id: "orthoBraces",
    label: "ORTHODONTIC PARAMETERS – BRACES",
    type: "expandable",
    observations: [
      "Positive notifications for braces",
      "Bracket",
      "Bracket ligature",
      "Archwire",
      "Auxiliaries",
    ],
  },
  {
    id: "oralHealth",
    label: "ORAL HEALTH ASSESSMENT",
    type: "expandable",
    observations: [
      "Oral hygiene",
      "Gingivitis",
      "Soft tissue statement",
      "Spots and suspected cavities",
      "Dental statement",
    ],
  },
  {
    id: "intraoral",
    label: "INTRAORAL EVALUATION",
    type: "expandable",
    observations: ["Tooth position", "Occlusion"],
  },
  {
    id: "retention",
    label: "RETENTION",
    type: "expandable",
    observations: ["Removable retainer tracking", "Retainer damage", "Relapse"],
  },
];

// Move Message to a separate component and pass openSaveQuickReplyModal as a prop
function Message({ sender, content, date, time, index, onSaveQuickReply, myId }) {
  const [hovered, setHovered] = React.useState(false);
  // Determine if this message is sent by the current user
  const isSent = String(sender) === String(myId);
  return (
    <div
      className="message mb-4 position-relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="text-center mb-1">
        <small className="text-muted">{date}</small>
      </div>
      <div
        className={`p-2 rounded ${isSent ? 'bg-teal text-white' : 'bg-light'}`}
        style={isSent ? { backgroundColor: '#17c3b2', color: 'white' } : {}}
      >
        {content}
      </div>
      <div
        className="d-flex justify-content-between align-items-center mt-1"
        style={{ position: "relative" }}
      >
        <small className="text-muted">{time}</small>
        {hovered && (null)}
      </div>
    </div>
  );
}

const PatientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // Patient ID from URL
  const dispatch = useDispatch();

  // Redux state selectors
  const { patientDetail, loadingDetail, error } = useSelector((state) => state.patients);

  // Static patient data (all fields except name)
  const staticPatientData = {
    id: "P-00123",
    plan: "Photo Monitoring Full",
    alignerType: "Day Aligner",
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
      forceGo: "Enabled",
    },
    goals: {
      "General Goals": ["Closure of all anterior space(s)", "Retention phase"],
      Anteroposterior: ["Class I canine – RIGHT", "Class I canine – LEFT"],
      Vertical: ["Normal overjet [1.0 ; 3.0] mm", "Correction of open bite"],
      Transverse: [
        "Correction of crossbite – RIGHT",
        "Correction of crossbite – LEFT",
      ],
    },
  };

  // Combine static data with dynamic name from API
  const patient = {
    ...staticPatientData,
    name: patientDetail?.full_name || "Loading...",
  };

  // Scroll to top on mount or when patient ID changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Fetch patient details when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(getPatientDetail(id));
      console.log(patient)
    }
  }, [id, dispatch]);

  // Assuming patient data might be fetched or come from a store in a real app
  // For now, using the mock data. 'id' would be used to fetch specific patient data.
  // const patient = patientData //PATIENT_MOCK_DATA;
  const observationSubObservations = OBSERVATION_SUB_OBSERVATIONS_DATA;
  const quickReplyOptions = QUICK_REPLY_OPTIONS_DATA;
  const sidebarSections = SIDEBAR_SECTIONS_DATA;

  const memoizedSetNavbarMenuItems = useCallback(setNavbarMenuItems, []);

  useEffect(() => {
    const processedNavbarItems = NAVBAR_ITEMS_TEMPLATE.map((item) => ({
      ...item,
      url: item.url.replace(":id", id),
    }));
    memoizedSetNavbarMenuItems(processedNavbarItems);
  }, [id, memoizedSetNavbarMenuItems]);

  const [openCollapsibles, setOpenCollapsibles] = useState({
    monitoring: true,
    notifications: false,
    goals: false,
  });
  const toggleCollapsibleSection = (key) =>
    setOpenCollapsibles((prev) => ({ ...prev, [key]: !prev[key] }));

  const [expandedGoals, setExpandedGoals] = useState({});
  const toggleGoal = (category, idx) => {
    const key = `${category}-${idx}`;
    setExpandedGoals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [communicationPanelMessage, setCommunicationPanelMessage] =
    useState(""); // Renamed from 'message' to avoid conflict

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
    uploadFile: false,
    clinicalInstruction: false,
    intraoralScan: false,
    loginLink: false,
    additionalScan: false,
    sharePatient: false,
    appActivation: false,
    resetScanSchedule: false,
    quickstart: false,
    newQuickstart: false,
  });

  const toggleModal = (modalName, explicitState) => {
    setModalStates((prev) => ({
      ...prev,
      [modalName]:
        explicitState !== undefined ? explicitState : !prev[modalName],
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
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "05:00",
  });

  const [pauseModalData, setPauseModalData] = useState({
    date: "2025-05-26", // Example date, might need to be dynamic
    message: "",
  });

  const [scanBoxModalData, setScanBoxModalData] = useState({
    selectedBox: null,
  });

  const [frequencyModalData, setFrequencyModalData] = useState({
    scanFrequency: "7",
    followUpFrequency: "3",
  });

  const [adaptiveIntervalSettings, setAdaptiveIntervalSettings] = useState({
    go: {
      enabled: true,
      condition: "all",
      count: "3",
      decrease: "1",
      minimum: "3",
    },
    noGo: {
      enabled: true,
      condition: "all",
      count: "3",
      increase: "1",
      maximum: "10",
    },
  });

  const [alignerModalData, setAlignerModalData] = useState({
    currentAligner: patient.alignerNumber
      ? Math.min(12, patient.alignerNumber).toString()
      : "1", // Example: current aligner #12
    totalAligners: patient.alignerNumber
      ? patient.alignerNumber.toString()
      : "20", // Example: total from patient data
  });

  // Excluded teeth modal internal states (kept separate due to complexity)
  const [expandedExcludedTeethSections, setExpandedExcludedTeethSections] =
    useState({
      overall: true,
      allObservations: false,
      orthoAligners: false,
      orthoBraces: false,
      oralHealth: false,
      intraoral: false,
      retention: false,
    });
  const [selectedExcludedTeethSection, setSelectedExcludedTeethSection] =
    useState("overall");
  const [
    expandedExcludedTeethSidebarSection,
    setExpandedExcludedTeethSidebarSection,
  ] = useState(null);
  const [
    selectedExcludedTeethObservation,
    setSelectedExcludedTeethObservation,
  ] = useState(null);
  const toggleExcludedTeethSection = (section) => {
    setExpandedExcludedTeethSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [addVisitModalData, setAddVisitModalData] = useState({
    date: "2025-05-27",
  });

  const [createLabelModalData, setCreateLabelModalData] = useState({
    input: "",
    labels: [],
  });

  const [intraoralScanTab, setIntraoralScanTab] = useState("upload");

  // Add state for the save quick reply modal
  const [saveQuickReplyModalOpen, setSaveQuickReplyModalOpen] = useState(false);
  const [saveQuickReplyTitle, setSaveQuickReplyTitle] = useState("");
  const [saveQuickReplyContent, setSaveQuickReplyContent] = useState("");
  const [saveQuickReplyVariable, setSaveQuickReplyVariable] = useState("");
  const variableOptions = [
    { value: "patient_name", label: "Patient Name" },
    { value: "doctor_name", label: "Doctor Name" },
    { value: "appointment_date", label: "Appointment Date" },
  ];

  // Handler for opening the modal from the message action
  const openSaveQuickReplyModal = (content = "") => {
    setSaveQuickReplyTitle("");
    setSaveQuickReplyContent(content);
    setSaveQuickReplyVariable("");
    setSaveQuickReplyModalOpen(true);
  };
  const closeSaveQuickReplyModal = () => setSaveQuickReplyModalOpen(false);
  const handleSaveQuickReplyVariableInsert = (e) => {
    const variable = e.target.value;
    if (variable) {
      setSaveQuickReplyContent(saveQuickReplyContent + ` [${variable}]`);
      setSaveQuickReplyVariable("");
    }
  };

  // Modal Opening/Toggling Functions (with state reset)
  const openQuickReplyModal = () => {
    setQuickReplySearchQuery("");
    setSelectedQuickReplyId(
      quickReplyOptions.length > 0 ? quickReplyOptions[0].id : null
    );
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
      scheduledDate: new Date().toISOString().split("T")[0],
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
      go: {
        enabled: true,
        condition: "all",
        count: "3",
        decrease: "1",
        minimum: "3",
      },
      noGo: {
        enabled: true,
        condition: "all",
        count: "3",
        increase: "1",
        maximum: "10",
      },
    });
    toggleModal("adaptiveInterval", true);
  };

  const openAlignerModal = () => {
    setAlignerModalData({
      currentAligner: patient.alignerNumber
        ? Math.min(12, patient.alignerNumber).toString()
        : "1", // Example value
      totalAligners: patient.alignerNumber
        ? patient.alignerNumber.toString()
        : "20", // Example value from patient
    });
    toggleModal("aligner", true);
  };

  const openCreateLabelModal = () => {
    setCreateLabelModalData({ input: "", labels: [] }); // Reset
    toggleModal("createLabel", true);
  };

  const openAddVisitModal = () => {
    setAddVisitModalData({ date: new Date().toISOString().split("T")[0] }); // Default to today
    toggleModal("addVisit", true);
  };

  // Handler to open upload file modal
  const openUploadFileModal = () => {
    toggleModal("newAction", false);
    toggleModal("uploadFile", true);
  };

  // Handlers to open each modal
  const openClinicalInstructionModal = () => {
    toggleModal("newAction", false);
    toggleModal("clinicalInstruction", true);
  };
  const openIntraoralScanModal = () => {
    toggleModal("newAction", false);
    toggleModal("intraoralScan", true);
  };
  const openLoginLinkModal = () => {
    toggleModal("newAction", false);
    toggleModal("loginLink", true);
  };
  const openAdditionalScanModal = () => {
    toggleModal("newAction", false);
    toggleModal("additionalScan", true);
  };
  const openSharePatientModal = () => {
    toggleModal("newAction", false);
    toggleModal("sharePatient", true);
  };
  const openAppActivationModal = () => {
    toggleModal("newAction", false);
    toggleModal("appActivation", true);
  };
  const openResetScanScheduleModal = () => {
    toggleModal("newAction", false);
    toggleModal("resetScanSchedule", true);
  };

  // Handler to open Quickstart modal
  const openQuickstartModal = () => {
    toggleModal("quickstart", true);
  };

  // Handler to open New Quickstart modal
  const openNewQuickstartModal = () => {
    toggleModal("newQuickstart", true);
  };

  const filteredReplies = quickReplyOptions.filter(
    (reply) =>
      reply.title.toLowerCase().includes(quickReplySearchQuery.toLowerCase()) ||
      reply.message.toLowerCase().includes(quickReplySearchQuery.toLowerCase())
  );
  const getSelectedQuickReply = () =>
    quickReplyOptions.find((reply) => reply.id === selectedQuickReplyId);

  // Get the current section from the URL hash
  const currentSection = location.hash.replace("#", "") || "monitoring";

  const { messages, loading, sending } = useSelector((state) => state.messages);

  // Dummy user IDs for SSE (replace with real logic as needed)
  const user = JSON.parse(localStorage.getItem("authUser"));
  const myId = user?.id; // TODO: Replace with actual logged-in user ID
  const otherId = id; // patient id from useParams

  useEffect(() => {
    if (!isCommunicationOpen || !id) return;
    const eventSource = new window.EventSource(
      `${config.API_URL.replace(/\/$/, '')}/chat/stream?myid=${myId}&otherid=${otherId}`
    );
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // If the backend sends an array, loop; else, single message
        if (Array.isArray(data)) {
          data.forEach((msg) => dispatch(receiveMessage(msg)));
        } else if (data) {
          dispatch(receiveMessage(data));
        }
      } catch (err) {
        console.error('Failed to parse SSE message', err, event.data);
      }
    };
    eventSource.onerror = (err) => {
      console.error('SSE error', err);
      // Optionally: eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, [isCommunicationOpen, id, dispatch]);

  // Fetch messages when communication panel opens or patient id changes
  useEffect(() => {
    if (isCommunicationOpen && id) {
      dispatch(fetchMessages(id));
    }
  }, [isCommunicationOpen, id, dispatch]);

  // Send message handler
  const handleSendMessage = () => {
    if (communicationPanelMessage.trim()) {
      dispatch(sendMessage(id, communicationPanelMessage));
      setCommunicationPanelMessage("");
    }
  };

  // Debug: log messages from Redux
  console.log('Messages from Redux:', messages);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change or panel opens
  useEffect(() => {
    if (isCommunicationOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCommunicationOpen]);

  // Add a sample order for demonstration
  const SAMPLE_ORDER = {
    id: "ORD-20240528-001",
    type: "Impression Kit",
    patient: "Stephen Dyos",
    doctor: "Dr Mark Kruchar",
    orderDate: "2025-05-28",
    status: "Shipped",
    items: [
      { name: "Impression Kit", qty: 1, price: 99 },
      { name: "Shipping", qty: 1, price: 10 },
    ],
    timeline: [
      { label: "Ordered", date: "2025-05-28", completed: true },
      { label: "In Production", date: "2025-05-29", completed: true },
      { label: "Shipped", date: "2025-05-30", completed: true },
      { label: "Delivered", date: "2025-06-02", completed: false },
    ],
    payment: {
      status: "Paid",
      amount: 109,
      method: "Credit Card",
      plan: "Installments",
      receipts: [
        { id: "RCPT-001", date: "2025-05-28", amount: 109, url: "#" },
      ],
    },
  };

  return (
    <div className="page-content">
      <div className="topnav patient-detail-topnav">
        <Container fluid>
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={true}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {NAVBAR_ITEMS_TEMPLATE.map((item, key) => {
                  const itemUrl = item.url.replace(":id", id);
                  // Ensure only exact section or nested (with trailing slash or /something) is matched
                  const isActive =
                    location.pathname === itemUrl ||
                    location.pathname.startsWith(itemUrl + "/");
                  return (
                    <li key={key} className="nav-item">
                      <Link
                        to={itemUrl}
                        className={`nav-link${isActive ? " active" : ""}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Collapse>
          </nav>
        </Container>
      </div>
      <Container fluid>
        <div className="patient-header">
          <Button
            color="link"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <i className="mdi mdi-chevron-left"></i>
          </Button>
          <div className="patient-avatar">
            <i className="mdi mdi-account-circle-outline"></i>
          </div>
          <div className="patient-info">
            <div className="info-row">
              <span className="patient-name">
                {loadingDetail ? "Loading..." : patient.name}
              </span>
              <span className="patient-id">(A78B-58F2-W)</span>
            </div>
            <a
              href="#"
              className="before-after-link"
              onClick={(e) => {
                e.preventDefault();
                toggleModal("beforeAfter", true);
              }}
            >
              <i className="mdi mdi-play-circle-outline"></i>
              BEFORE/AFTER VIDEO
            </a>
          </div>
        </div>
      </Container>
      <Container fluid>
        <Row>
          {/* Left Panel */}
          <Col md={4} lg={3}>
            {/* Monitoring Information */}
            <Card className="mb-3">
              <CardHeader
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => toggleCollapsibleSection("monitoring")}
              >
                <span>Monitoring Information</span>
                <Button color="link" size="lg">
                  {openCollapsibles.monitoring ? "−" : "+"}
                </Button>
              </CardHeader>
              <Collapse isOpen={openCollapsibles.monitoring}>
                <CardBody>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Aligner Type:</strong>
                    <div className="d-flex flex-column">
                      <span>{patient.alignerType}</span>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Started:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{patient.started || "2024-01-01"}</span>
                      <div className="mt-1 d-flex gap-2">
                        <Button
                          size="sm"
                          outline
                          color="secondary"
                          className="small-action-button"
                          onClick={openPauseModal}
                        >
                          <i className="mdi mdi-pause me-1"></i>Pause
                        </Button>
                        <Button
                          size="sm"
                          outline
                          color="secondary"
                          className="small-action-button"
                          onClick={() => toggleModal("stop", true)}
                        >
                          <i className="mdi mdi-stop me-1"></i>Stop
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Patient app:</strong>
                    <span>{patient.patientApp || "Activated"}</span>
                  </div>
                  {/*
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>ScanBox:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{patient.scanBox || "Assigned"}</span>
                      <Button
                        color="link"
                        size="sm"
                        className="p-0"
                        onClick={openScanBoxModal}
                      >
                        Change
                      </Button>
                    </div>
                  </div>*/}
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Next scan:</strong>
                    <span>{patient.nextScan}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong className="align-self-baseline">Frequency:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>
                        {patient.frequency ||
                          `Every ${frequencyModalData.scanFrequency} day(s) (${frequencyModalData.followUpFrequency} day(s) NO-GO)`}
                      </span>
                      <div className="d-flex gap-2">
                        <Button
                          color="link"
                          size="sm"
                          className="p-0"
                          onClick={openFrequencyModal}
                        >
                          Change
                        </Button>
                      </div>
                      <div className="mt-2">
                        <span>Adaptive:</span>
                        <span className="fw-bold ms-1">
                          {adaptiveIntervalSettings.go.enabled ||
                            adaptiveIntervalSettings.noGo.enabled
                            ? "On"
                            : "Off"}
                        </span>
                      </div>
                      <Button
                        color="link"
                        size="sm"
                        className="p-0"
                        onClick={openAdaptiveIntervalModal}
                      >
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
                      <Button
                        color="link"
                        size="sm"
                        className="p-0"
                        onClick={openAlignerModal}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  {/* <div className="mb-2 d-flex align-items-center justify-content-between">
                    <strong>Excluded teeth:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span>{patient.excludedTeeth}</span>
                      <Button
                        color="link"
                        size="sm"
                        className="p-0"
                        onClick={() => toggleModal("excludedTeeth", true)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div> */}
                </CardBody>
              </Collapse>
            </Card>
            {/* Notifications to Review */}
            {/* <Card className="mb-3">
              <CardHeader
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => toggleCollapsibleSection("notifications")}
              >
                <div className="d-flex align-items-center">
                  <span>Notifications to Review</span>
                  <Badge color="danger" className="ms-2">
                    1
                  </Badge>
                </div>
                <Button color="link" size="lg">
                  {openCollapsibles.notifications ? "−" : "+"}
                </Button>
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
                    <span className="small">
                      {patient.notificationsPanel.patientInstruction}
                    </span>
                  </div>
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <strong className="small">Team Instruction:</strong>
                    <span className="small">
                      {patient.notificationsPanel.teamInstruction}
                    </span>
                  </div>
                  <div className="mt-3 d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        className="flex-grow-1 notification-action-button"
                        onClick={openTodoModal}
                      >
                        <i className="mdi mdi-clipboard-check-outline me-1"></i>
                        To-Do
                      </Button>
                      <Button
                        size="sm"
                        className="flex-grow-1 notification-action-button"
                        onClick={openInstructionModal}
                      >
                        <i className="mdi mdi-account-group-outline me-1"></i>
                        Instruction to Team
                      </Button>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        className="flex-grow-1 notification-action-button"
                        onClick={() => toggleModal("forceGo", true)}
                      >
                        <i className="mdi mdi-flash-outline me-1"></i>Force GO
                      </Button>
                      <Button
                        size="sm"
                        className="flex-grow-1 notification-action-button"
                        onClick={() => toggleModal("markReviewed", true)}
                      >
                        <i className="mdi mdi-check-all me-1"></i>Mark all as
                        viewed
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Collapse>
            </Card> */}
            {/* Temporarily commented out Goals section
            <Card>
              <CardHeader
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => toggleCollapsibleSection("goals")}
              >
                <span>Goals</span>
                <Button color="link" size="lg">
                  {openCollapsibles.goals ? "−" : "+"}
                </Button>
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
                                <div
                                  className="goal-item"
                                  onClick={() => toggleGoal(category, idx)}
                                >
                                  <i className="mdi mdi-play-circle-outline text-primary play-icon"></i>
                                <span>{goal}</span>
                                  <i
                                    className={`ms-2 mdi ${
                                      expandedGoals[key]
                                        ? "mdi-chevron-up"
                                        : "mdi-chevron-down"
                                    }`}
                                  ></i>
                              </div>
                              <Collapse isOpen={!!expandedGoals[key]}>
                                <div className="ms-4 mb-2 mt-1 d-flex">
                                    <label className="form-label mb-1 goal-notification">
                                      Notify me if the goal is not achieved
                                      after week:
                                    </label>
                                    <select
                                      className="form-select form-select-sm w-auto d-inline-block"
                                      style={{ minWidth: 70 }}
                                    >
                                    {Array.from({ length: 100 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                          {i + 1}
                                        </option>
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
            */}
          </Col>
          {/* Main content */}
          <Col md={8} lg={9}>
            <Routes>
              <Route
                path=""
                element={<Navigate to={`/patients/${id}/monitoring`} replace />}
              />
              <Route
                path="monitoring"
                element={<Monitoring patient={PATIENT_MOCK_DATA} />}
              />
              {/* Temporarily commented out Protocol route
              <Route
                path="protocol"
                element={<Protocol patient={PATIENT_MOCK_DATA} />}
              />
              */}
              <Route
                path="info"
                element={<Info patient={PATIENT_MOCK_DATA} />}
              />
              {/* Temporarily commented out Notes route
              <Route
                path="notes"
                element={<Notes patient={PATIENT_MOCK_DATA} />}
              />
              */}
              <Route
                path="files"
                element={<Files patient={PATIENT_MOCK_DATA} />}
              />
              <Route
                path="guardians"
                element={<Guardians patient={PATIENT_MOCK_DATA} />}
              />
              {/* Temporarily commented out Scheduled Actions route
              <Route path="scheduled-actions" element={<ScheduledActions />} />
              */}
              <Route
                path="scans"
                element={<Scans patient={PATIENT_MOCK_DATA} />}
              />
              <Route path="scans/:scanId" element={<ScanDetail />} />
              <Route path="order" element={<OrderDetail order={SAMPLE_ORDER} />} />
              <Route path="history" element={<History patient={patient} />} />
              <Route
                path="*"
                element={<Navigate to={`/patients/${id}/monitoring`} replace />}
              />
            </Routes>
          </Col>
          {/* Communication Panel */}
          {isCommunicationOpen && (
            <div className="communication-backdrop" onClick={() => setIsCommunicationOpen(false)}></div>
          )}
          <div
            className={`communication-panel${isCommunicationOpen ? ' open' : ' closed'}`}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="mb-0">Communication</h5>
              <Button
                color="link"
                className="p-0"
                onClick={() => setIsCommunicationOpen(false)}
              >
                <i className="mdi mdi-chevron-right"></i>
              </Button>
            </div>
            <div className="messages-container">
              <div className="messages">
                {loading ? (
                  <div className="text-center text-muted py-3">Loading messages...</div>
                ) : error ? (
                  <div className="text-center text-danger py-3">{error}</div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <Message
                      key={msg.id || idx}
                      sender={msg.sender_id || "Unknown"}
                      content={msg.message || msg.content}
                      date={msg.created_at ? msg.created_at.split(' ')[0] : ""}
                      time={msg.created_at ? msg.created_at.split(' ')[1] : ""}
                      index={idx}
                      onSaveQuickReply={openSaveQuickReplyModal}
                      myId={myId}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted py-3">No messages yet.</div>
                )}
                {/* Dummy div for auto-scroll */}
                <div ref={messagesEndRef} />
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
              <Input
                type="textarea"
                value={communicationPanelMessage}
                onChange={(e) => setCommunicationPanelMessage(e.target.value)}
                placeholder="Type a message..."
                rows="3"
                className="mb-2"
                disabled={sending}
              />
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <Button color="link" size="sm" className="p-0">
                    <i className="mdi mdi-paperclip"></i>
                  </Button>
                </div>
                <Button color="primary" size="sm" onClick={handleSendMessage} disabled={sending || !communicationPanelMessage.trim()}>
                  {sending ? <span className="spinner-border spinner-border-sm"></span> : <i className="mdi mdi-send"></i>}
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`communication-fab${isCommunicationOpen ? ' communication-fab--hidden' : ''}`}
            onClick={() => setIsCommunicationOpen(!isCommunicationOpen)}
          >
            <i className="mdi mdi-message-text-outline"></i>
          </div>
        </Row>
      </Container>

      {/* Quick Reply Modal */}
      <Modal
        isOpen={modalStates.quickReply}
        toggle={() => toggleModal("quickReply")}
        centered
        size="lg"
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Select a quick reply to send to your patient {patient.full_name}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("quickReply")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <label className="form-label text-muted small">SEARCH</label>
            <Input
              type="text"
              placeholder="Search quick replies..."
              value={quickReplySearchQuery}
              onChange={(e) => setQuickReplySearchQuery(e.target.value)}
              className="form-control"
            />
          </div>
          <h6 className="mb-3">My quick replies</h6>
          <div className="quick-replies-list">
            {filteredReplies.map((reply) => (
              <div
                key={reply.id}
                className={`p-3 mb-2 rounded quick-reply-item ${selectedQuickReplyId === reply.id
                  ? "bg-light border border-primary"
                  : "border hover:border-primary"
                  }`}
                onClick={() => setSelectedQuickReplyId(reply.id)}
              >
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
          <Button color="light" onClick={() => toggleModal("quickReply")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              const selected = getSelectedQuickReply();
              if (selected) {
                setCommunicationPanelMessage(selected.message); // Set the main message input
                toggleModal("quickReply", false);
              }
            }}
          >
            Choose this reply
          </Button>
        </div>
      </Modal>

      {/* Send Instruction Modal */}
      <Modal
        isOpen={modalStates.instruction}
        toggle={() => toggleModal("instruction")}
        centered
        size="lg"
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Send an instruction to the team regarding {patient.name} ({
              patient.id
            })
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("instruction")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <Form>
            <FormGroup className="mb-4">
              <Label className="fw-bold">WRITE YOUR INSTRUCTION:</Label>
              <Input
                type="textarea"
                rows="4"
                value={instructionModalData.instruction}
                onChange={(e) =>
                  setInstructionModalData((s) => ({
                    ...s,
                    instruction: e.target.value,
                  }))
                }
                className="form-control"
              />
            </FormGroup>
            <FormGroup className="mb-4">
              <Label className="fw-bold">SELECT THE PRIORITY LEVEL:</Label>
              <Input
                type="select"
                value={instructionModalData.priority}
                onChange={(e) =>
                  setInstructionModalData((s) => ({
                    ...s,
                    priority: e.target.value,
                  }))
                }
                className="form-select"
              >
                <option value="Info">Info</option>{" "}
                <option value="Low">Low</option>{" "}
                <option value="Medium">Medium</option>{" "}
                <option value="High">High</option>{" "}
                <option value="Urgent">Urgent</option>
              </Input>
            </FormGroup>
            <FormGroup className="mb-4">
              <div className="form-check mb-3">
                <Input
                  type="checkbox"
                  id="scheduleLater"
                  className="form-check-input"
                />
                <Label
                  className="form-check-label fw-bold"
                  htmlFor="scheduleLater"
                >
                  SEND THIS MESSAGE LATER (CHOOSE A FUTURE TIME AND DATE):
                </Label>
              </div>
              <div className="d-flex gap-3">
                <div className="flex-grow-1">
                  <Input
                    type="date"
                    value={instructionModalData.scheduledDate}
                    onChange={(e) =>
                      setInstructionModalData((s) => ({
                        ...s,
                        scheduledDate: e.target.value,
                      }))
                    }
                    disabled={!instructionModalData.scheduleLater}
                    className="form-control"
                  />
                </div>
                <div className="flex-grow-1">
                  <Input
                    type="time"
                    value={instructionModalData.scheduledTime}
                    onChange={(e) =>
                      setInstructionModalData((s) => ({
                        ...s,
                        scheduledTime: e.target.value,
                      }))
                    }
                    disabled={!instructionModalData.scheduleLater}
                    className="form-control"
                  />
                </div>
              </div>
            </FormGroup>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("instruction")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("instruction", false) /* Handle save */}
          >
            OK
          </Button>
        </div>
      </Modal>

      {/* To-do List Modal */}
      <Modal
        isOpen={modalStates.todo}
        toggle={() => toggleModal("todo")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Add patient to the To-do List</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("todo")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <p className="mb-4">
            Do you want to add the patient {patient.name} to the To-do List?
          </p>
          <div>
            <h6 className="mb-3">YOU CAN ADD AN OPTIONAL COMMENT:</h6>
            <div className="position-relative">
              <Input
                type="textarea"
                rows="4"
                value={todoModalData.comment}
                onChange={(e) =>
                  setTodoModalData((s) => ({ ...s, comment: e.target.value }))
                }
                className="form-control"
                placeholder=" "
              />
              <div className="optional-label">OPTIONAL</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("todo")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("todo", false) /* Handle add */}
          >
            Add to the To-do List
          </Button>
        </div>
      </Modal>

      {/* Force GO Modal */}
      <Modal
        isOpen={modalStates.forceGo}
        toggle={() => toggleModal("forceGo")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Force GO for {patient.name}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("forceGo")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <p className="mb-0">
              When Force Go is activated, the patient will be told to{" "}
              <span className="fw-bold" style={{ color: "#1da5fe" }}>
                switch to their next aligners
              </span>{" "}
              regardless of what is detected on their Scan.
            </p>
          </div>
          <div className="alert alert-info mb-0">
            <p className="mb-0">
              This will apply to the{" "}
              <span className="fw-bold" style={{ color: "#1da5fe" }}>
                next scan only
              </span>
              .
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("forceGo")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("forceGo", false) /* Handle action */}
          >
            Send a GO after next scan
          </Button>
        </div>
      </Modal>

      {/* Mark all as reviewed Modal */}
      <Modal
        isOpen={modalStates.markReviewed}
        toggle={() => toggleModal("markReviewed")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Mark all as reviewed</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("markReviewed")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <p className="mb-0">
            Are you sure you want to mark all patient notifications as reviewed?
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("markReviewed")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={
              () => toggleModal("markReviewed", false) /* Handle action */
            }
          >
            Yes
          </Button>
        </div>
      </Modal>

      {/* Pause Monitoring Modal */}
      <Modal
        isOpen={modalStates.pause}
        toggle={() => toggleModal("pause")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Pause monitoring</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("pause")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <Form>
            <FormGroup className="mb-4">
              <Label className="fw-bold">Pause monitoring until</Label>
              <Input
                type="date"
                value={pauseModalData.date}
                onChange={(e) =>
                  setPauseModalData((s) => ({ ...s, date: e.target.value }))
                }
                className="form-control"
              />
            </FormGroup>
            <FormGroup className="mb-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Label className="fw-bold mb-0">Send message to patient</Label>
                <span className="text-muted small">Optional</span>
              </div>
              <Input
                type="textarea"
                rows="3"
                value={pauseModalData.message}
                onChange={(e) =>
                  setPauseModalData((s) => ({ ...s, message: e.target.value }))
                }
                className="form-control"
                placeholder="Type your message..."
              />
            </FormGroup>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("pause")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("pause", false) /* Handle save */}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Stop Monitoring Modal */}
      <Modal
        isOpen={modalStates.stop}
        toggle={() => toggleModal("stop")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Stop monitoring</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("stop")}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="alert alert-warning mb-4">
            <p className="mb-0">
              Stopping monitoring will reset all settings. The patient will move
              to the "Not Monitored" tab and will still have access to their
              monitoring history.
            </p>
          </div>
          <p className="mb-0">Are you sure you want to stop this monitoring?</p>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("stop")}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("stop", false) /* Handle stop */}
          >
            Yes
          </Button>
        </div>
      </Modal>

      {/* Select ScanBox Modal */}
      <Modal
        isOpen={modalStates.scanBox}
        toggle={() => toggleModal("scanBox")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Select a ScanBox</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("scanBox", false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="d-flex gap-3">
            <div
              className={`flex-grow-1 p-4 border rounded text-center cursor-pointer ${scanBoxModalData.selectedBox === "scanbox"
                ? "border-primary"
                : ""
                }`}
              onClick={() => setScanBoxModalData({ selectedBox: "scanbox" })}
            >
              <i className="mdi mdi-cube-outline mb-3 large-icon"></i>
              <h6>ScanBox</h6>
            </div>
            <div
              className={`flex-grow-1 p-4 border rounded text-center cursor-pointer ${scanBoxModalData.selectedBox === "scanbox-pro"
                ? "border-primary"
                : ""
                }`}
              onClick={() =>
                setScanBoxModalData({ selectedBox: "scanbox-pro" })
              }
            >
              <i className="mdi mdi-cube-scan mb-3 large-icon"></i>
              <h6>ScanBox PRO</h6>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("scanBox", false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("scanBox", false) /* Handle save */}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Change Scan Frequency Modal */}
      <Modal
        isOpen={modalStates.frequency}
        toggle={() => toggleModal("frequency")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Change Scan Frequency</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("frequency", false)}
          ></button>
        </div>
        <div className="modal-body">
          <p className="mb-4">Select the suitable scan frequency</p>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <FormGroup className="mb-4">
                  <Label>Scan frequency</Label>
                  <Input
                    type="select"
                    value={frequencyModalData.scanFrequency}
                    onChange={(e) =>
                      setFrequencyModalData((s) => ({
                        ...s,
                        scanFrequency: e.target.value,
                      }))
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} day{num !== 1 ? "s" : ""}
                        </option>
                      )
                    )}
                  </Input>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup className="mb-4">
                  <Label>Follow-up scan after no-go</Label>
                  <Input
                    type="select"
                    value={frequencyModalData.followUpFrequency}
                    onChange={(e) =>
                      setFrequencyModalData((s) => ({
                        ...s,
                        followUpFrequency: e.target.value,
                      }))
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>
                        {num} day{num !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("frequency", false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("frequency", false) /* Handle apply */}
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Change Adaptive Scan Interval Modal */}
      <Modal
        isOpen={modalStates.adaptiveInterval}
        toggle={() => toggleModal("adaptiveInterval")}
        centered
        size="xl"
        style={{ minWidth: "1100px" }}
      >
        <div className="modal-header">
          <h5 className="modal-title">Change Adaptive Scan Interval</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("adaptiveInterval", false)}
          ></button>
        </div>
        <div className="modal-body">
          <p className="mb-4">Select the suitable adaptive scan interval</p>
          <div className="p-3 mb-4 border rounded bg-light-subtle">
            <div className="d-flex align-items-center mb-3">
              <div className="form-switch me-2">
                <Input
                  type="switch"
                  id="goSwitch"
                  checked={!!adaptiveIntervalSettings.go.enabled}
                  onChange={(e) =>
                    setAdaptiveIntervalSettings((s) => ({
                      ...s,
                      go: { ...s.go, enabled: e.target.checked },
                    }))
                  }
                />
              </div>
              <span
                className={`adaptive-status-label ${adaptiveIntervalSettings.go.enabled ? 'adaptive-status-label--enabled' : 'adaptive-status-label--disabled'}`}
              >
                GO
              </span>
            </div>
            <div className="d-flex flex-nowrap align-items-center gap-2">
              <Input
                type="select"
                value={adaptiveIntervalSettings.go.condition}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    go: { ...s.go, condition: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.go.enabled}
                className="select-wide"
              >
                <option value="all">All throughout treatment</option>
                <option value="after">After</option>
              </Input>
              <span
                className={
                  adaptiveIntervalSettings.go.enabled ? "" : "text-muted"
                }
              >
                after
              </span>
              <Input
                type="select"
                value={adaptiveIntervalSettings.go.count}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    go: { ...s.go, count: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.go.enabled}
                className="select-narrow"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
              <span
                className={
                  adaptiveIntervalSettings.go.enabled ? "" : "text-muted"
                }
              >
                GOs in a row, decrease scan interval by
              </span>
              <Input
                type="select"
                value={adaptiveIntervalSettings.go.decrease}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    go: { ...s.go, decrease: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.go.enabled}
                style={{ width: 70 }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
              <span
                className={
                  adaptiveIntervalSettings.go.enabled ? "" : "text-muted"
                }
              >
                day(s) - not below
              </span>
              <Input
                type="select"
                value={adaptiveIntervalSettings.go.minimum}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    go: { ...s.go, minimum: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.go.enabled}
                style={{ width: 70 }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
            </div>
          </div>
          <div className="p-3 border rounded bg-light-subtle">
            <div className="d-flex align-items-center mb-3">
              <div className="form-switch me-2">
                <Input
                  type="switch"
                  id="noGoSwitch"
                  checked={!!adaptiveIntervalSettings.noGo.enabled}
                  onChange={(e) =>
                    setAdaptiveIntervalSettings((s) => ({
                      ...s,
                      noGo: { ...s.noGo, enabled: e.target.checked },
                    }))
                  }
                />
              </div>
              <span
                className="fw-bold"
                style={{
                  color: adaptiveIntervalSettings.noGo.enabled
                    ? "#1da5fe"
                    : "#bfc9d1",
                }}
              >
                NO-GO/GO-BACK
              </span>
            </div>
            <div className="d-flex flex-nowrap align-items-center gap-2">
              <Input
                type="select"
                value={adaptiveIntervalSettings.noGo.condition}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    noGo: { ...s.noGo, condition: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.noGo.enabled}
                style={{ maxWidth: 200 }}
              >
                <option value="all">All throughout treatment</option>
                <option value="after">After</option>
              </Input>
              <span
                className={
                  adaptiveIntervalSettings.noGo.enabled ? "" : "text-muted"
                }
              >
                after
              </span>
              <Input
                type="select"
                value={adaptiveIntervalSettings.noGo.count}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    noGo: { ...s.noGo, count: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.noGo.enabled}
                style={{ width: 70 }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
              <span
                className={
                  adaptiveIntervalSettings.noGo.enabled ? "" : "text-muted"
                }
              >
                NO-GOs/GO-BACKs in a row, increase scan interval by
              </span>
              <Input
                type="select"
                value={adaptiveIntervalSettings.noGo.increase}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    noGo: { ...s.noGo, increase: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.noGo.enabled}
                style={{ width: 70 }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
              <span
                className={
                  adaptiveIntervalSettings.noGo.enabled ? "" : "text-muted"
                }
              >
                day(s) - not above
              </span>
              <Input
                type="select"
                value={adaptiveIntervalSettings.noGo.maximum}
                onChange={(e) =>
                  setAdaptiveIntervalSettings((s) => ({
                    ...s,
                    noGo: { ...s.noGo, maximum: e.target.value },
                  }))
                }
                disabled={!adaptiveIntervalSettings.noGo.enabled}
                style={{ width: 70 }}
              >
                {[5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Input>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => toggleModal("adaptiveInterval", false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={
              () => toggleModal("adaptiveInterval", false) /* Handle apply */
            }
          >
            Apply
          </Button>
        </div>
      </Modal>

      {/* Change Aligner Number Modal */}
      <Modal
        isOpen={modalStates.aligner}
        toggle={() => toggleModal("aligner")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Change Aligner Number</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("aligner", false)}
          ></button>
        </div>
        <div className="modal-body">
          <Form>
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label for="currentAligner">Current Aligner #</Label>
                  <Input
                    type="number"
                    id="currentAligner"
                    value={alignerModalData.currentAligner}
                    onChange={(e) =>
                      setAlignerModalData((s) => ({
                        ...s,
                        currentAligner: e.target.value,
                      }))
                    }
                  />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="totalAligners">Total Aligners</Label>
                  <Input
                    type="number"
                    id="totalAligners"
                    value={alignerModalData.totalAligners}
                    onChange={(e) =>
                      setAlignerModalData((s) => ({
                        ...s,
                        totalAligners: e.target.value,
                      }))
                    }
                  />
                </FormGroup>
              </div>
            </div>
          </Form>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("aligner", false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("aligner", false) /* Handle save */}
          >
            Save
          </Button>
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
          <h5 className="modal-title">
            Edit excluded teeth for {patient.name}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("excludedTeeth", false)}
          ></button>
        </div>
        <div className="modal-body">
          {/* Two-column layout */}
          <div className="row">
            {/* Sidebar */}
            <div className="col-4 sidebar-section">
              {sidebarSections.map((section) => (
                <div key={section.id}>
                  {/* Navigation or Search section */}
                  {section.type === "nav" && (
                    <div
                      className={`nav-item ${selectedExcludedTeethSection === section.id
                        ? "selected"
                        : ""
                        }`}
                      onClick={() =>
                        setSelectedExcludedTeethSection(section.id)
                      }
                    >
                      {section.label}
                      {selectedExcludedTeethSection === section.id && (
                        <i className="mdi mdi-chevron-right float-end"></i>
                      )}
                    </div>
                  )}
                  {section.type === "search" && (
                    <div
                      className={`search-section ${selectedExcludedTeethSection === section.id
                        ? "selected"
                        : ""
                        }`}
                      onClick={() =>
                        setSelectedExcludedTeethSection(section.id)
                      }
                    >
                      <div className="fw-bold small mb-1">ALL OBSERVATIONS</div>
                      {selectedExcludedTeethSection === section.id && (
                        <Input
                          type="text"
                          placeholder="Search an observation"
                          value={quickReplySearchQuery}
                          onChange={(e) =>
                            setQuickReplySearchQuery(e.target.value)
                          }
                          className="mb-2"
                        />
                      )}
                    </div>
                  )}
                  {/* Expandable section */}
                  {section.type === "expandable" && (
                    <div className="expandable-section">
                      <div
                        className={`header ${expandedExcludedTeethSidebarSection === section.id
                          ? "expanded"
                          : ""
                          }`}
                        onClick={() =>
                          setExpandedExcludedTeethSidebarSection(
                            expandedExcludedTeethSidebarSection === section.id
                              ? null
                              : section.id
                          )
                        }
                      >
                        {section.label}
                        <i
                          className={`mdi ms-1 ${expandedExcludedTeethSidebarSection === section.id
                            ? "mdi-chevron-up"
                            : "mdi-chevron-down"
                            }`}
                          style={{ float: "right" }}
                        ></i>
                      </div>
                      {expandedExcludedTeethSidebarSection === section.id && (
                        <div className="sidebar-collapse ps-3 pb-2 show">
                          {section.observations.map((obs) => (
                            <div
                              key={obs}
                              className={`observation-item ${selectedExcludedTeethObservation === obs
                                ? "selected"
                                : ""
                                }`}
                              onClick={() =>
                                setSelectedExcludedTeethObservation(obs)
                              }
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
                  {observationSubObservations[
                    selectedExcludedTeethObservation
                  ] &&
                    observationSubObservations[selectedExcludedTeethObservation]
                      .length > 0 ? (
                    observationSubObservations[
                      selectedExcludedTeethObservation
                    ].map((sub) => (
                      <div key={sub} className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold">{sub}</div>
                          <button
                            className="btn btn-link btn-sm p-0 ms-2"
                            style={{
                              color: "#1da5fe",
                              fontWeight: 500,
                              textDecoration: "underline",
                            }}
                            onClick={() => alert(`Edit ${sub}`)}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="text-muted small">
                          No teeth selected
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted small">No teeth selected</div>
                  )}
                </div>
              ) : (
                // Default content for each section if no observation is selected
                <>
                  {selectedExcludedTeethSection === "overall" && (
                    <div className="p-4">
                      <p className="text-muted mb-0">
                        You currently have no excluded teeth. Select an
                        observation to exclude one or more
                      </p>
                    </div>
                  )}
                  {selectedExcludedTeethSection === "allObservations" && (
                    <div className="p-4">
                      <Input
                        type="text"
                        placeholder="Search an observation"
                        value={quickReplySearchQuery}
                        onChange={(e) =>
                          setQuickReplySearchQuery(e.target.value)
                        }
                        className="mb-3"
                      />
                    </div>
                  )}
                  {selectedExcludedTeethSection === "orthoAligners" && (
                    <div className="p-4">
                      {/* Content for Orthodontic parameters – Aligners */}
                    </div>
                  )}
                  {selectedExcludedTeethSection === "orthoBraces" && (
                    <div className="p-4">
                      {/* Content for Orthodontic parameters – Braces */}
                    </div>
                  )}
                  {selectedExcludedTeethSection === "oralHealth" && (
                    <div className="p-4">
                      {/* Content for Oral health assessment */}
                    </div>
                  )}
                  {selectedExcludedTeethSection === "intraoral" && (
                    <div className="p-4">
                      {/* Content for Intraoral evaluation */}
                    </div>
                  )}
                  {selectedExcludedTeethSection === "retention" && (
                    <div className="p-4">{/* Content for Retention */}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => toggleModal("excludedTeeth", false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => toggleModal("excludedTeeth", false)}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Change Monitoring Plan Modal */}
      <Modal
        isOpen={modalStates.changeMonitoringPlan}
        toggle={() => toggleModal("changeMonitoringPlan", false)}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Change monitoring plan</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("changeMonitoringPlan", false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <div className="fw-bold mb-2">
              Apply a Quickstart or set up the patient's monitoring manually.
            </div>
            <a
              href="#"
              className="d-block mb-3 text-primary"
              style={{ fontSize: 14 }}
              onClick={(e) => {
                e.preventDefault();
                openQuickstartModal();
              }}
            >
              Can't find the Quickstart you want? Create a new one here
            </a>
            <div className="border rounded p-3 mb-2 bg-light">
              <div className="mb-1">
                Photo Monitoring Full | Aligner protocol | 7 days | Other
              </div>
              <div className="mb-1">MX/MD: Aligner Other</div>
              <div className="mb-1">Teeth excluded from 0 observation(s)</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button
            className="opacity-50"
            color="primary"
            onClick={() => toggleModal("changeMonitoringPlan", false)}
            disabled
          >
            Current settings
          </Button>
        </div>
      </Modal>

      {/* Quickstart Modal */}
      <Modal
        isOpen={modalStates.quickstart}
        toggle={() => toggleModal("quickstart", false)}
        centered
        size="md"
      >
        <ModalHeader toggle={() => toggleModal("quickstart", false)}>
          My Quickstarts
        </ModalHeader>
        <ModalBody>
          <div className="mb-2 text-muted" style={{ fontSize: 15 }}>
            Group your most frequently used protocol, monitoring plan, and
            treatment combinations for one-click application to patients.
          </div>
          <div className="d-flex flex-column gap-4 justify-content-center align-items-start mt-4">
            {/* New Quickstart Button Card */}
            <Button
              color="primary"
              className="d-flex align-items-center"
              style={{ fontSize: 14, fontWeight: 500 }}
              onClick={openNewQuickstartModal}
            >
              <i
                className="mdi mdi-plus-circle-outline me-2"
                style={{ fontSize: 18 }}
              ></i>
              New Quickstart
            </Button>
            {/* Example Quickstart Card */}
            <div
              className="card p-4"
              style={{
                minWidth: "100%",
                minHeight: 180,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div className="fw-bold mb-2">
                Quickstart for Aligner protocol
              </div>
              <div className="text-muted mb-2" style={{ fontSize: 13 }}>
                Created on 2024-02-21 at 17:50 GMT+5
              </div>
              <ul className="mb-2 ps-3" style={{ fontSize: 15 }}>
                <li>Photo Monitoring Full, scan every 7 day(s)</li>
                <li>MX/MD: Aligner Other</li>
                <li>Teeth excluded from observation(s).</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("quickstart", false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* New Quickstart Modal */}
      <Modal
        isOpen={modalStates.newQuickstart}
        toggle={() => toggleModal("newQuickstart", false)}
        centered
        size="lg"
      >
        <ModalHeader toggle={() => toggleModal("newQuickstart", false)}>
          Create New Quickstart
        </ModalHeader>
        <ModalBody>
          <div className="quickstart-modal-body">
            <Form>
              <div className="row g-3 mb-2">
                <div className="col-md-6">
                  <FormGroup>
                    <Label className="form-label-quickstart">
                      Monitoring Plan
                    </Label>
                    <Input type="select">
                      <option>Photo Monitoring Full</option>
                      <option>Photo Monitoring Lite</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label className="form-label-quickstart">
                      Upper Jaw (MX)
                    </Label>
                    <Input type="select">
                      <option>Aligner Other</option>
                      <option>Aligner A</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label className="form-label-quickstart">Protocol</Label>
                    <Input type="select">
                      <option>Standard</option>
                      <option>Custom</option>
                    </Input>
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup>
                    <Label className="form-label-quickstart">
                      Upfront Product{" "}
                      <span className="text-muted small">(optional)</span>
                    </Label>
                    <Input type="select">
                      <option>None</option>
                      <option>Product A</option>
                      <option>Product B</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label className="form-label-quickstart">
                      Lower Jaw (MD)
                    </Label>
                    <Input type="select">
                      <option>Aligner Other</option>
                      <option>Aligner B</option>
                    </Input>
                  </FormGroup>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <FormGroup>
                        <Label className="form-label-quickstart">
                          Scan Frequency
                        </Label>
                        <Input type="select">
                          <option>7</option>
                          <option>14</option>
                        </Input>
                      </FormGroup>
                    </div>
                    <div className="col-md-6">
                      <FormGroup>
                        <Label className="form-label-quickstart">
                          Follow-up Scan After No-Go
                        </Label>
                        <Input type="select">
                          <option>3</option>
                          <option>5</option>
                        </Input>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {/* MX/MD checkbox in its own row */}
              <div className="row mb-2">
                <div className="col-12">
                  <FormGroup check className="mb-2">
                    <Input type="checkbox" id="separateMxMd" />
                    <Label
                      for="separateMxMd"
                      check
                      className="form-label-quickstart"
                    >
                      Set MX/MD options separately
                    </Label>
                  </FormGroup>
                </div>
              </div>
              <div className="p-3 border rounded mb-2 quickstart-adaptive-section">
                <div className="fw-bold mb-2">Adaptive Scan Interval</div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormGroup check className="mb-2">
                      <Input type="checkbox" id="goToggle" />
                      <Label
                        for="goToggle"
                        check
                        className="form-label-quickstart"
                      >
                        Go
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label-quickstart">
                        Treatment duration
                      </Label>
                      <Input type="select">
                        <option>All throughout treatment</option>
                        <option>After</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label-quickstart">
                        GO frequency
                      </Label>
                      <Input type="number" min="1" max="10" defaultValue="3" />
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label-quickstart">
                        Decrease interval by (days)
                      </Label>
                      <Input type="number" min="1" max="10" defaultValue="1" />
                    </FormGroup>
                  </div>
                  <div className="col-md-6">
                    <FormGroup check className="mb-2">
                      <Input type="checkbox" id="noGoToggle" />
                      <Label
                        for="noGoToggle"
                        check
                        className="form-label-quickstart"
                      >
                        No-Go/Go-Back
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label-quickstart">
                        Treatment duration
                      </Label>
                      <Input type="select">
                        <option>All throughout treatment</option>
                        <option>After</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label-quickstart">
                        NO-GO frequency
                      </Label>
                      <Input type="number" min="1" max="10" defaultValue="3" />
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label-quickstart">
                        Increase interval by (days)
                      </Label>
                      <Input type="number" min="1" max="10" defaultValue="1" />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Save</Button>
        </ModalFooter>
      </Modal>

      {/* New Action Modal */}
      <Modal
        isOpen={modalStates.newAction}
        toggle={() => toggleModal("newAction")}
        centered
        size="lg"
      >
        <div className="modal-header">
          <h5 className="modal-title">Create a new action</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("newAction", false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-6">
              <ActionItem
                icon="mdi-account-check-outline"
                label="Send a clinical instruction to DM"
                onClick={openClinicalInstructionModal}
              />
              <ActionItem
                icon="mdi-camera-outline"
                label="Add an intraoral scan"
                onClick={openIntraoralScanModal}
              />
              <ActionItem
                icon="mdi-link-variant"
                label="Generate login link"
                onClick={openLoginLinkModal}
              />
              <ActionItem
                icon="mdi-account-group-outline"
                label="Send an instruction to the team"
                onClick={() => {
                  toggleModal("newAction", false);
                  openInstructionModal();
                }}
              />
              <ActionItem
                icon="mdi-camera-plus-outline"
                label="Ask patient for an additional scan"
                onClick={openAdditionalScanModal}
              />
              <ActionItem
                icon="mdi-calendar-sync-outline"
                label="Change scan frequency"
                onClick={() => {
                  toggleModal("newAction", false);
                  openFrequencyModal();
                }}
              />
              <ActionItem
                icon="mdi-close-circle-outline"
                label="Stop monitoring"
                iconColor="#ff9800"
                onClick={() => {
                  toggleModal("newAction", false);
                  toggleModal("stop", true);
                }}
              />
              <ActionItem
                icon="mdi-file-plus-outline"
                label="Add a file"
                onClick={openUploadFileModal}
              />
              <ActionItem
                icon="mdi-share-variant-outline"
                label="Share Patient"
                onClick={openSharePatientModal}
              />
            </div>
            <div className="col-md-6">
              <ActionItem
                icon="mdi-clipboard-check-outline"
                label="Add to the To-do List"
                onClick={() => {
                  toggleModal("newAction", false);
                  openTodoModal();
                }}
              />
              <ActionItem
                icon="mdi-cellphone-message"
                label="Send app activation code"
                onClick={openAppActivationModal}
              />
              <ActionItem
                icon="mdi-message-outline"
                label="Send a message to patient"
                onClick={() => {
                  toggleModal("newAction", false);
                  setIsCommunicationOpen(true);
                }}
              />
              <ActionItem
                icon="mdi-calendar-refresh-outline"
                label="Reset scan schedule to today"
                onClick={openResetScanScheduleModal}
              />
              <ActionItem
                icon="mdi-pause-circle-outline"
                label="Pause monitoring"
                onClick={() => {
                  toggleModal("newAction", false);
                  openPauseModal();
                }}
              />
              <ActionItem
                icon="mdi-tune-variant"
                label="Change adaptive scan interval"
                onClick={() => {
                  toggleModal("newAction", false);
                  openAdaptiveIntervalModal();
                }}
              />
              <ActionItem
                icon="mdi-numeric"
                label="Change aligner number"
                onClick={() => {
                  toggleModal("newAction", false);
                  openAlignerModal();
                }}
              />
              <ActionItem
                icon="mdi-calendar-blank-outline"
                label="Add a visit"
                onClick={() => {
                  toggleModal("newAction", false);
                  openAddVisitModal();
                }}
              />
              <ActionItem
                icon="mdi-cog-outline"
                label="Change monitoring plan"
                onClick={() => {
                  toggleModal("newAction", false);
                  toggleModal("changeMonitoringPlan", true);
                }}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("newAction", false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Send a clinical instruction to DM Modal */}
      <Modal
        isOpen={modalStates.clinicalInstruction}
        toggle={() => toggleModal("clinicalInstruction", false)}
        centered
      >
        <ModalHeader toggle={() => toggleModal("clinicalInstruction", false)}>
          New clinical instruction to Smileie
        </ModalHeader>
        <ModalBody>
          <Label>Write your clinical instruction to Smileie:</Label>
          <Input type="textarea" rows={4} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("clinicalInstruction", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Send a clinical instruction to DM</Button>
        </ModalFooter>
      </Modal>

      {/* Add an intraoral scan Modal */}
      <Modal
        isOpen={modalStates.intraoralScan}
        toggle={() => toggleModal("intraoralScan", false)}
        centered
        size="lg"
      >
        <ModalHeader toggle={() => toggleModal("intraoralScan", false)}>
          Add an Intraoral Scan - {patient.name}
        </ModalHeader>
        <ModalBody>
          {/* Tabs */}
          <div
            className="d-flex mb-4"
            style={{ borderBottom: "1px solid #e0e0e0" }}
          >
            <div
              className={`me-4 scan-modal-tab ${intraoralScanTab === 'upload' ? 'scan-modal-tab--active' : 'scan-modal-tab--inactive'}`}
              style={{
                cursor: "pointer",
                color: intraoralScanTab === "upload" ? "#16b1c7" : "#607181",
                fontWeight: 500,
              }}
              onClick={() => setIntraoralScanTab("upload")}
            >
              Upload from my computer
            </div>
            <div
              className={`scan-modal-tab ${intraoralScanTab === 'scanner' ? 'scan-modal-tab--active' : 'scan-modal-tab--inactive'}`}
              style={{
                cursor: "pointer",
                color: intraoralScanTab === "scanner" ? "#16b1c7" : "#607181",
                fontWeight: 500,
              }}
              onClick={() => setIntraoralScanTab("scanner")}
            >
              Import from a scanner
            </div>
          </div>
          {intraoralScanTab === "upload" ? (
            <>
              <div className="mb-3 fw-bold text-uppercase scan-upload-desc">
                Upload your patient intraoral scan.
              </div>
              <div className="mb-3 text-center fw-bold scan-upload-title">
                INTRAORAL SCAN
              </div>
              <div className="row mb-4">
                <div className="col-md-6 text-center">
                  <div className="fw-bold mb-1">
                    Upper arch{" "}
                    <span className="text-muted scan-upload-arch-label">(maxillary)</span>
                  </div>
                  <div className="file-drop-zone file-drop-zone--upper">
                    <i className="mdi mdi-upload drop-zone-icon-upload"></i>
                    <div className="drop-zone-text">Import<br />or<br />drag & drop your file</div>
                  </div>
                </div>
                <div className="col-md-6 text-center">
                  <div className="fw-bold mb-1">
                    Lower arch{" "}
                    <span className="text-muted scan-upload-arch-label">(mandibular)</span>
                  </div>
                  <div className="file-drop-zone file-drop-zone--lower">
                    <i className="mdi mdi-upload drop-zone-icon-upload"></i>
                    <div className="drop-zone-text">Import<br />or<br />drag & drop your file</div>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <FormGroup>
                    <Label>Scan date</Label>
                    <Input type="date" />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup>
                    <Label>Scanner brand</Label>
                    <Input type="select">
                      <option>Select</option>
                      <option>Brand A</option>
                      <option>Brand B</option>
                    </Input>
                  </FormGroup>
                </div>
              </div>
              <FormGroup>
                <Label>Your comments</Label>
                <Input type="textarea" />
              </FormGroup>
            </>
          ) : (
            <div className="row mb-4 justify-content-center align-items-center">
              <div className="col-md-4 text-center">
                <div className="bg-light rounded p-4 mb-2 d-flex align-items-center justify-content-center scanner-logo-wrapper">
                  <img src={threeShapeLogo} alt="3shape" className="scanner-logo-img" />
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="bg-light rounded p-4 mb-2 d-flex flex-column align-items-center justify-content-center scanner-logo-wrapper">
                  <div className="medit-link-title">MEDIT Link</div>
                  <div className="medit-link-desc text-muted">coming soon</div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("intraoralScan", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Upload</Button>
        </ModalFooter>
      </Modal>
      {/* Generate login link Modal */}
      <Modal
        isOpen={modalStates.loginLink}
        toggle={() => toggleModal("loginLink", false)}
        centered
      >
        <ModalHeader toggle={() => toggleModal("loginLink", false)}>
          Login link for {patient.name} (to be copied and sent manually to
          patient!)
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            Please copy the following text and send it to the patient (click
            here to copy to clipboard):
          </div>
          <Input
            type="text"
            value="Click on this link from your smartphone to log in: https://eu2.dental-monitoring.com/sn/tVRySuzmJFicmdxo84qyc"
            readOnly
          />
          <div className="mt-2 text-muted small">
            This link is only valid for the next 5 days and can only be used
            once.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => toggleModal("loginLink", false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Ask patient for an additional scan Modal */}
      <Modal
        isOpen={modalStates.additionalScan}
        toggle={() => toggleModal("additionalScan", false)}
        centered
      >
        <ModalHeader toggle={() => toggleModal("additionalScan", false)}>
          Ask for an additional scan
        </ModalHeader>
        <ModalBody>
          <div className="alert alert-warning">
            Your patient already has a scan to take. Are you sure you want to
            ask for an additional scan? The patient will still have to take
            their regular scan afterwards.
          </div>
          <div className="alert alert-info">
            This additional scan will not change the patient's regular scan
            schedule... results will be available under the tab 'Additional
            scans'.
          </div>
          <FormGroup>
            <Label>Add optional message to patient:</Label>
            <Input type="textarea" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("additionalScan", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Ask for an additional scan</Button>
        </ModalFooter>
      </Modal>

      {/* Share Patient Modal */}
      <Modal
        isOpen={modalStates.sharePatient}
        toggle={() => toggleModal("sharePatient", false)}
        centered
      >
        <ModalHeader toggle={() => toggleModal("sharePatient", false)}>
          Share this patient
        </ModalHeader>
        <ModalBody>
          <Label>
            Please enter the e-mail address of the doctor you want to share this
            patient with:
          </Label>
          <Input type="email" placeholder="E-MAIL" />
          <FormGroup className="mt-3">
            <Label>YOU CAN OPTIONALLY ADD A COMMENT:</Label>
            <Input type="textarea" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("sharePatient", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Share this patient</Button>
        </ModalFooter>
      </Modal>

      {/* Send app activation code Modal */}
      <Modal
        isOpen={modalStates.appActivation}
        toggle={() => toggleModal("appActivation", false)}
        centered
      >
        <ModalHeader toggle={() => toggleModal("appActivation", false)}>
          Send app activation code
        </ModalHeader>
        <ModalBody>
          <div>Do you want to send the activation email to {patient.name}?</div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("appActivation", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Send app activation code</Button>
        </ModalFooter>
      </Modal>

      {/* Reset scan schedule to today Modal */}
      <Modal
        isOpen={modalStates.resetScanSchedule}
        toggle={() => toggleModal("resetScanSchedule", false)}
        centered
      >
        <ModalHeader toggle={() => toggleModal("resetScanSchedule", false)}>
          Reset the due date for {patient.name}'s next scan
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            You are going to reset the due date of the patient's next scan to
            today... (future scans will be calculated from today's date + chosen
            scan interval)
          </div>
          <FormGroup>
            <Label>
              You can enter instructions that will be displayed in your
              patient's scan checklist:{" "}
              <span className="text-muted small">(optional)</span>
            </Label>
            <Input type="textarea" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={() => toggleModal("resetScanSchedule", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Reset scan schedule</Button>
        </ModalFooter>
      </Modal>

      {/* Add Visit Modal */}
      <Modal
        isOpen={modalStates.addVisit}
        toggle={() => toggleModal("addVisit")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Add a visit</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("addVisit", false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <label className="form-label fw-bold">Visit date</label>
            <input
              type="date"
              className="form-control"
              value={addVisitModalData.date}
              onChange={(e) => setAddVisitModalData({ date: e.target.value })}
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => {
              toggleModal("addVisit", false);
              toggleModal("newAction", true);
            }}
          >
            Back
          </Button>
          <Button
            color="primary"
            onClick={
              () => toggleModal("addVisit", false) /* Handle add visit */
            }
          >
            Add visit
          </Button>
        </div>
      </Modal>

      {/* Create Label Modal */}
      <Modal
        isOpen={modalStates.createLabel}
        toggle={() => toggleModal("createLabel")}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">Create new label(s)</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("createLabel", false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Create a new label.</label>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="text"
                maxLength={20}
                value={createLabelModalData.input}
                onChange={(e) =>
                  setCreateLabelModalData((s) => ({
                    ...s,
                    input: e.target.value,
                  }))
                }
                className="label-input"
              />
              <Button
                color="primary"
                size="sm"
                disabled={
                  !createLabelModalData.input.trim() ||
                  createLabelModalData.input.length > 20
                }
                onClick={() => {
                  if (
                    createLabelModalData.input.trim() &&
                    createLabelModalData.input.length <= 20
                  ) {
                    setCreateLabelModalData((s) => ({
                      labels: [...s.labels, s.input.trim()],
                      input: "",
                    }));
                  }
                }}
              >
                Create
              </Button>
            </div>
            <div className="small text-muted mt-1">
              {createLabelModalData.input.length}/20
            </div>
          </div>
          <div className="mb-3">
            {createLabelModalData.labels.length === 0 ? (
              <div className="text-muted text-center py-3">
                No labels created yet.
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {createLabelModalData.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="badge bg-info text-white px-3 py-2 custom-badge"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <Button
            color="light"
            onClick={() => toggleModal("createLabel", false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={createLabelModalData.labels.length === 0}
            onClick={
              () => toggleModal("createLabel", false) /* Handle add labels */
            }
          >
            Add {createLabelModalData.labels.length} label
            {createLabelModalData.labels.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </Modal>

      {/* Before/After Video Modal */}
      <Modal
        isOpen={modalStates.beforeAfter}
        toggle={() => toggleModal("beforeAfter", false)}
        centered
        size="md"
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Watch the before/after of {patient.name} ({patient.id})
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("beforeAfter", false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body before-after-modal-body">
          {/* Ensure the image path is correct for your project structure */}
          {/* <img src={require("../../assets/images/demo-before-after.gif")} alt="Before/After Intraoral" className="before-after-modal-img" /> */}
          <p className="text-center">Before/After Video Content Here</p>{" "}
          {/* Placeholder if image is problematic */}
        </div>
      </Modal>

      {/* Upload File Modal (reused from Files.js) */}
      <Modal
        isOpen={modalStates.uploadFile}
        toggle={() => toggleModal("uploadFile", false)}
        className="upload-file-modal"
      >
        <ModalHeader toggle={() => toggleModal("uploadFile", false)}>
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
                Supported formats: DCM, DXF, GIF, JPEG, JPG, MP3, MP4, OBJ, PDF,
                PNG, STL
              </li>
            </ul>
          </div>
          <div
            className={`upload-zone`}
          // Add drag/drop handlers if needed
          >
            <input
              type="file"
              id="file-upload"
              className="file-input"
              // onChange={handleFileSelect} // Implement as needed
              accept=".dcm,.dxf,.gif,.jpeg,.jpg,.mp3,.mp4,.obj,.pdf,.png,.stl"
            />
            <div className="upload-content">
              <i className="mdi mdi-cloud-upload-outline mb-3"></i>
              <p className="mb-0">Import or drag & drop your file</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => toggleModal("uploadFile", false)}
          >
            Cancel
          </Button>
          <Button color="primary">Add file</Button>
        </ModalFooter>
      </Modal>

      {/* Save as a new quick reply Modal */}
      <Modal isOpen={saveQuickReplyModalOpen} toggle={closeSaveQuickReplyModal} centered>
        <ModalHeader toggle={closeSaveQuickReplyModal}>Save as a new quick reply</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup className="mb-3">
              <Label for="saveQuickReplyTitle">Quick Reply Title</Label>
              <Input
                id="saveQuickReplyTitle"
                type="text"
                value={saveQuickReplyTitle}
                onChange={e => setSaveQuickReplyTitle(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label for="saveQuickReplyContent">Quick Reply Content</Label>
              <Input
                id="saveQuickReplyContent"
                type="textarea"
                rows={4}
                value={saveQuickReplyContent}
                onChange={e => setSaveQuickReplyContent(e.target.value)}
              />
              <div className="mt-2">
                <Input
                  type="select"
                  value={saveQuickReplyVariable}
                  onChange={handleSaveQuickReplyVariableInsert}
                  style={{ maxWidth: 220, display: "inline-block" }}
                >
                  <option value="">Select a variable</option>
                  {variableOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={closeSaveQuickReplyModal}>Cancel</Button>
          <Button color="primary">Save</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

function ActionItem({ icon, label, iconColor, onClick }) {
  return (
    <Button
      color="link"
      className="action-button-item d-flex align-items-center p-2 text-start w-100"
      onClick={onClick}
    >
      <i className={`mdi ${icon} me-2 action-button-item__icon`} style={{ color: iconColor || undefined }}></i>
      <span className="action-button-item__label">{label}</span>
    </Button>
  );
}

export default PatientDetail;
