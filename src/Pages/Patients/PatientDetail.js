import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
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
import { setNavbarMenuItems } from "../../store/navigation/actions";
import { getPatientDetail, changeAligner, getTreatmentIssues } from "../../store/patients/actions";
import Monitoring from "./PatientDetailSections/Monitoring";
import Protocol from "./PatientDetailSections/Protocol";
import Info from "./PatientDetailSections/Info";
import Alerts from "./PatientDetailSections/Alerts";
import Notes from "./PatientDetailSections/Notes";
import Files from "./PatientDetailSections/Files";
import Guardians from "./PatientDetailSections/Guardians";
import ScheduledActions from "./PatientDetailSections/ScheduledActions";
import Scans from "./PatientDetailSections/Scans";
import ScanDetail from "./PatientDetailSections/ScanDetail";
import History from "./PatientDetailSections/History";
import {
  fetchMessages,
  sendMessage,
  receiveMessage,
} from "../../store/messages/actions";
import config, { WEB_APP_URL } from "../../config.js";
import PatientOrders from "./PatientDetailSections/Orders.js";
import ConsentForms from "./PatientDetailSections/ConsentForms";
import TreatmentPlan3D from "./PatientDetailSections/TreatmentPlan3D";
import { getPatientStatsAPI, getPatientAlignersAPI } from '../../helpers/api_helper';

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
  { id: "info", label: "Info", url: "/patients/:id/info" },
  { id: "consent-forms", label: "Consent Forms", url: "/patients/:id/consent-forms" },
  { id: "treatment-plan-3d", label: "3D Treatment Plan", url: "/patients/:id/treatment-plan-3d" },
  { id: "scans", label: "Treatment Process", url: "/patients/:id/scans" },
  { id: "order", label: "Orders", url: "/patients/:id/order" },
  { id: "history", label: "History", url: "/patients/:id/history" },
  { id: "alerts", label: "Alerts", url: "/patients/:id/alerts" },
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

// Message Component
function Message({
  sender,
  imagepath,
  content,
  date,
  time,
  index,
  myId,
  onImageClick,
}) {
  const [hovered, setHovered] = React.useState(false);
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
        className={`p-2 rounded ${isSent ? "bg-primary text-white" : "bg-light"}`}
        style={isSent ? { backgroundColor: "#17c3b2", color: "white" } : {}}
      >
        {imagepath && imagepath !== "" && imagepath !== null && (
          <div
            style={{
              display: "flex",
              objectFit: "cover",
              height: "200px",
              width: "100%",
              cursor: "pointer",
            }}
            onClick={() => onImageClick && onImageClick(imagepath)}
          >
            <img
              src={imagepath}
              style={{ width: "100%", height: "auto", borderRadius: "20px" }}
              alt="message attachment"
            />
          </div>
        )}
        <p style={{ margin: "0px", padding: "3px" }}>{content}</p>
      </div>
      <div
        className="d-flex justify-content-between align-items-center mt-1"
        style={{ position: "relative" }}
      >
        <small className="text-muted">{time}</small>
      </div>
    </div>
  );
}

const PatientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { patientDetail, loadingDetail, error, changingAligner, changeAlignerError, changeAlignerResult, treatmentIssues, treatmentIssuesLoading, treatmentIssuesError } = useSelector((state) => state.patients);

  const staticPatientData = {
    id: "P-00123",
    plan: "Photo Monitoring Full",
    alignerType: "Day Aligner",
    status: "Active",
    nextScan: "2025-06-01",
    alignerNumber: 21,
    excludedTeeth: "Not Set",
    started: "2024-01-01",
    app_activation: 1,
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

  const patient = {
    ...staticPatientData,
    id: patientDetail?.id, // use real database id
    public_id: patientDetail?.public_id, // keep public_id for display if needed
    name: patientDetail?.full_name || "Loading...",
    app_activation:
      typeof patientDetail?.app_activation !== "undefined"
        ? patientDetail.app_activation
        : staticPatientData.app_activation,
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(getPatientDetail(id));
    }
  }, [id, dispatch]);

  const quickReplyOptions = QUICK_REPLY_OPTIONS_DATA;

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
  });
  const toggleCollapsibleSection = (key) =>
    setOpenCollapsibles((prev) => ({ ...prev, [key]: !prev[key] }));

  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [communicationPanelMessage, setCommunicationPanelMessage] = useState("");
  const [communicationPanelFile, setCommunicationPanelFile] = useState(null);
  const [communicationPanelFileBase64, setCommunicationPanelFileBase64] = useState(null);
  const [communicationPanelFileLoading, setCommunicationPanelFileLoading] = useState(false);
  const fileInputRef = useRef();

  const [modalStates, setModalStates] = useState({
    quickReply: false,
    aligner: false,
    image: false,
    issues: false,
  });

  const toggleModal = (modalName, explicitState) => {
    setModalStates((prev) => ({
      ...prev,
      [modalName]: explicitState !== undefined ? explicitState : !prev[modalName],
    }));
  };

  const [quickReplySearchQuery, setQuickReplySearchQuery] = useState("");
  const [selectedQuickReplyId, setSelectedQuickReplyId] = useState(null);

  const [alignerModalData, setAlignerModalData] = useState({
    currentAligner: patient.alignerNumber
      ? Math.min(12, patient.alignerNumber).toString()
      : "1",
    totalAligners: patient.alignerNumber
      ? patient.alignerNumber.toString()
      : "20",
  });

  const openQuickReplyModal = () => {
    setQuickReplySearchQuery("");
    setSelectedQuickReplyId(quickReplyOptions.length > 0 ? quickReplyOptions[0].id : null);
    toggleModal("quickReply", true);
  };

  const openAlignerModal = () => {
    setAlignerModalData({
      currentAligner: patient.alignerNumber
        ? Math.min(12, patient.alignerNumber).toString()
        : "1",
      totalAligners: patient.alignerNumber
        ? patient.alignerNumber.toString()
        : "20",
    });
    toggleModal("aligner", true);
  };

  const openIssuesModal = () => {
    if (id) {
      dispatch(getTreatmentIssues(id));
    }
    toggleModal("issues", true);
  };

  const filteredReplies = quickReplyOptions.filter(
    (reply) =>
      reply.title.toLowerCase().includes(quickReplySearchQuery.toLowerCase()) ||
      reply.message.toLowerCase().includes(quickReplySearchQuery.toLowerCase())
  );
  const getSelectedQuickReply = () =>
    quickReplyOptions.find((reply) => reply.id === selectedQuickReplyId);

  const currentSection = location.hash.replace("#", "") || "monitoring";

  const { messages, loading, sending } = useSelector((state) => state.messages);

  const user = JSON.parse(localStorage.getItem("authUser"));
  const myId = user?.id;
  const otherId = id;

  useEffect(() => {
    if (!isCommunicationOpen || !id) return;
    const eventSource = new window.EventSource(
      `${config.API_URL.replace(/\/$/, "")}/chat/stream?myid=${myId}&otherid=${otherId}`
    );
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          data.forEach((msg) => dispatch(receiveMessage(msg)));
        } else if (data) {
          dispatch(receiveMessage(data));
        }
      } catch (err) {
        console.error("Failed to parse SSE message", err, event.data);
      }
    };
    eventSource.onerror = (err) => {
      console.error("SSE error", err);
    };
    return () => {
      eventSource.close();
    };
  }, [isCommunicationOpen, id, dispatch]);

  useEffect(() => {
    if (isCommunicationOpen && id) {
      dispatch(fetchMessages(id));
    }
  }, [isCommunicationOpen, id, dispatch]);

  const handleSendMessage = () => {
    if (
      (communicationPanelMessage && communicationPanelMessage.trim()) ||
      communicationPanelFileBase64
    ) {
      dispatch(
        sendMessage(id, communicationPanelMessage, communicationPanelFileBase64)
      );
      setCommunicationPanelMessage("");
      setCommunicationPanelFile(null);
      setCommunicationPanelFileBase64(null);
      setCommunicationPanelFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isCommunicationOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isCommunicationOpen]);

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
      receipts: [{ id: "RCPT-001", date: "2025-05-28", amount: 109, url: "#" }],
    },
  };

  const PATIENT_MOCK_DATA = {
    name: patientDetail?.full_name || "Stephen Dyos",
    id: patientDetail?.public_id || "P-00123",
    plan: "Photo Monitoring Full",
    alignerType: "Day Aligner",
    status: "Active",
    nextScan: "2025-06-01",
    alignerNumber: 21,
    excludedTeeth: "Not Set",
    started: "2024-01-01",
    app_activation: 1,
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

  const handleFileButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCommunicationPanelFile(file);
      setCommunicationPanelFileLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCommunicationPanelFileBase64(event.target.result);
        setCommunicationPanelFileLoading(false);
      };
      reader.onerror = () => {
        setCommunicationPanelFileBase64(null);
        setCommunicationPanelFileLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setCommunicationPanelFile(null);
    setCommunicationPanelFileBase64(null);
    setCommunicationPanelFileLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState("");

  const [patientStats, setPatientStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setStatsLoading(true);
    setStatsError(null);
    getPatientStatsAPI(id)
      .then((res) => {
        console.log('Patient stats API response:', res);
        setPatientStats(res.data || null);
        setStatsLoading(false);
      })
      .catch((err) => {
        setStatsError("Failed to load patient stats");
        setStatsLoading(false);
      });
  }, [id]);

  // Load treatment issues when component mounts or patient ID changes
  useEffect(() => {
    if (id) {
      dispatch(getTreatmentIssues(id));
    }
  }, [id, dispatch]);

  // Debug: Log patientStats values before rendering Monitoring Information
  if (patientStats) {
    console.log('Rendering aligner_type:', patientStats.aligner_type);
    console.log('Rendering first_step_started_at:', patientStats.first_step_started_at);
    console.log('Rendering app_activation:', patientStats.app_activation);
    console.log('Rendering step_number:', patientStats.step_number, 'total_steps:', patientStats.total_steps);
    console.log('Rendering next_step_started_at:', patientStats.next_step_started_at);
  }

  // Add state for Move to Next modal
  const [moveNextModalOpen, setMoveNextModalOpen] = useState(false);
  const [alignerInfo, setAlignerInfo] = useState(null);
  const [loadingAlignerInfo, setLoadingAlignerInfo] = useState(false);
  const [alignerNote, setAlignerNote] = useState('');

  useEffect(() => {
    if (moveNextModalOpen && id) {
      setLoadingAlignerInfo(true);
      getPatientAlignersAPI(id)
        .then((res) => {
          setAlignerInfo(res.data);
          setLoadingAlignerInfo(false);
        })
        .catch(() => {
          setAlignerInfo(null);
          setLoadingAlignerInfo(false);
        });
    } else if (!moveNextModalOpen) {
      setAlignerInfo(null);
      setLoadingAlignerInfo(false);
    }
  }, [moveNextModalOpen, id]);

  // Helper to get current and next aligner
  const currentAligner = typeof patientStats?.step_number !== 'undefined' ? patientStats.step_number : '';
  const totalAligners = typeof patientStats?.total_steps !== 'undefined' ? patientStats.total_steps : '';
  const nextAligner = currentAligner && totalAligners && currentAligner < totalAligners ? currentAligner + 1 : '';

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not set';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Not set';
    }
  };

  // Check if there are issues for the current step
  const hasCurrentStepIssues = React.useMemo(() => {
    if (!treatmentIssues || !Array.isArray(treatmentIssues) || typeof patientStats?.step_number === 'undefined') {
      return false;
    }
    return treatmentIssues.some(issue => issue.step_number === patientStats.step_number);
  }, [treatmentIssues, patientStats?.step_number]);

  // Refresh patient stats after successful aligner change
  useEffect(() => {
    if (changeAlignerResult && !changingAligner) {
      // Refresh patient stats to show updated information
      if (id) {
        setStatsLoading(true);
        setStatsError(null);
        getPatientStatsAPI(id)
          .then((res) => {
            console.log('Patient stats refreshed after aligner change:', res);
            setPatientStats(res.data || null);
            setStatsLoading(false);
          })
          .catch((err) => {
            setStatsError("Failed to refresh patient stats");
            setStatsLoading(false);
          });
      }
    }
  }, [changeAlignerResult, changingAligner, id]);

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
            onClick={() => navigate("/patients")}
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
              <span className="patient-id">
                ({patientDetail?.public_id || "A78B-58F2-W"})
              </span>
            </div>
          </div>
        </div>
      </Container>
      <Container fluid>
        <Row>
          <Col md={4} lg={3}>
            <Card className="mb-3" style={{ minHeight: '400px' }}>
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
                <CardBody className="py-4">
                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <strong className="text-muted">Aligner Type:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span className="fw-bold">{patientStats?.aligner_type || 'Not set'}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <strong className="text-muted">Started:</strong>
                    <div className="d-flex flex-column align-items-end">
                      <span className="fw-bold">{formatDate(patientStats?.first_step_started_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <strong className="text-muted">Patient app:</strong>
                    <span className={`badge ${typeof patientStats?.app_activation !== 'undefined' && patientStats.app_activation === 1 ? 'bg-success' : 'bg-secondary'}`}>
                      {typeof patientStats?.app_activation !== 'undefined'
                        ? (patientStats.app_activation === 1 ? "Activated" : "Not Activated")
                        : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <strong className="text-muted">Aligner Progress:</strong>
                    <div className="d-flex flex-column align-items-end">
                      {typeof patientStats?.step_number !== 'undefined' && typeof patientStats?.total_steps !== 'undefined' ? (
                        <>
                          <span style={{ fontWeight: 'bold', color: '#1da5fe', fontSize: '1.1em' }}>
                            Current: <span style={{ fontSize: '1.2em' }}>{patientStats.step_number}</span> / <span style={{ fontSize: '1.1em' }}>{patientStats.total_steps}</span>
                          </span>
                        </>
                      ) : (
                        <span className="text-muted">Not set</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Only show next aligner start if patient is not on the last aligner */}
                  {typeof patientStats?.step_number !== 'undefined' && 
                   typeof patientStats?.total_steps !== 'undefined' && 
                   patientStats?.step_number < patientStats?.total_steps && (
                    <div className="mb-4 d-flex align-items-center justify-content-between">
                      <strong className="text-muted">Next aligner start:</strong>
                      <span className="fw-bold">{formatDate(patientStats?.next_step_started_at)}</span>
                    </div>
                  )}
                  
                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <strong></strong>
                    <div className="d-flex align-items-center justify-content-between" style={{ width: '100%', maxWidth: '300px' }}>
                      <div className="d-flex flex-column align-items-center">
                        <Button
                          color="info"
                          size="sm"
                          className="px-3 py-2"
                          onClick={openIssuesModal}
                          disabled={treatmentIssuesLoading}
                        >
                          {treatmentIssuesLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Loading...
                            </>
                          ) : (
                            <>
                              <i className="mdi mdi-alert-circle-outline me-1"></i>
                              Issues
                            </>
                          )}
                        </Button>
                        <small className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                          View issues
                        </small>
                      </div>
                      
                      {typeof patientStats?.step_number !== 'undefined' && 
                       typeof patientStats?.total_steps !== 'undefined' && 
                       patientStats?.total_steps !== 0 && 
                       patientStats?.step_number < patientStats?.total_steps ? (
                        <>
                          <div className="d-flex flex-column align-items-center">
                            <Button
                              color="primary"
                              size="sm"
                              className="px-3 py-2"
                              onClick={() => setMoveNextModalOpen(true)}
                              disabled={changingAligner || !hasCurrentStepIssues}
                              title={!hasCurrentStepIssues ? "No issues found for current step" : ""}
                            >
                              {changingAligner ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Processing...
                                </>
                              ) : (
                                'Move to Next'
                              )}
                            </Button>
                            {!hasCurrentStepIssues && !changingAligner ? (
                              <small className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                No issues for step {patientStats?.step_number}
                              </small>
                            ) : (
                              <small className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                Advance treatment
                              </small>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Add bottom spacing to match right side height */}
                  <div style={{ height: '100px' }}></div>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
          <Col md={8} lg={9} style={{ height: "100%" }}>
            <Routes>
              <Route
                path=""
                element={<Navigate to={`/patients/${id}/monitoring`} replace />}
              />
              <Route
                path="monitoring"
                element={<Monitoring patient={patient} />}
              />
              <Route
                path="info"
                element={<Info patient={PATIENT_MOCK_DATA} />}
              />
              <Route
                path="alerts"
                element={<Alerts patientId={id} patient={PATIENT_MOCK_DATA} />}
              />
              <Route
                path="files"
                element={<Files patient={PATIENT_MOCK_DATA} />}
              />
              <Route
                path="consent-forms"
                element={<ConsentForms patientId={patientDetail?.id} />}
              />
              <Route
                path="treatment-plan-3d"
                element={<TreatmentPlan3D patient={patientDetail} />}
              />
              <Route
                path="scans"
                element={<Scans patient={PATIENT_MOCK_DATA} />}
              />
              <Route
                path="scans/:arch/:scanId"
                element={<ScanDetail />}
              />
              <Route
                path="order"
                element={<PatientOrders order={SAMPLE_ORDER} />}
              />
              <Route path="history" element={<History patient={patient} />} />
              <Route
                path="*"
                element={<Navigate to={`/patients/${id}/monitoring`} replace />}
              />
            </Routes>
          </Col>
          {isCommunicationOpen && (
            <div
              className="communication-backdrop"
              onClick={() => setIsCommunicationOpen(false)}
            ></div>
          )}
          <div
            className={`communication-panel${isCommunicationOpen ? " open" : " closed"}`}
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
                  <div className="text-center text-muted py-3">
                    Loading messages...
                  </div>
                ) : error ? (
                  <div className="text-center text-danger py-3">{error}</div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <Message
                      key={msg.id || idx}
                      sender={msg.sender_id || "Unknown"}
                      imagepath={msg.attachment_url ? WEB_APP_URL + msg.attachment_url : ""}
                      content={msg.message || msg.content}
                      date={msg.created_at ? msg.created_at.split(" ")[0] : ""}
                      time={msg.created_at ? msg.created_at.split(" ")[1] : ""}
                      index={idx}
                      myId={myId}
                      onImageClick={(src) => {
                        setImageModalSrc(src);
                        setImageModalOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    No messages yet.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="input-area border-top">
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
                disabled={sending || communicationPanelFileLoading}
              />
              {communicationPanelFile && (
                <div className="mb-2 d-flex align-items-center gap-2">
                  <span className="badge bg-info text-white">
                    {communicationPanelFile.name}
                  </span>
                  {communicationPanelFileLoading && (
                    <span className="text-muted small">Loading...</span>
                  )}
                  <Button
                    close
                    aria-label="Remove file"
                    onClick={handleRemoveFile}
                    size="sm"
                  />
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <Button
                    color="link"
                    size="sm"
                    className="p-0"
                    onClick={handleFileButtonClick}
                  >
                    <i className="mdi mdi-paperclip"></i>
                  </Button>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="*"
                  />
                </div>
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={
                    sending ||
                    communicationPanelFileLoading ||
                    (!communicationPanelMessage.trim() && !communicationPanelFileBase64)
                  }
                >
                  {sending ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <i className="mdi mdi-send"></i>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`communication-fab${isCommunicationOpen ? " communication-fab--hidden" : ""}`}
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
                className={`p-3 mb-2 rounded quick-reply-item ${
                  selectedQuickReplyId === reply.id
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
                setCommunicationPanelMessage(selected.message);
                toggleModal("quickReply", false);
              }
            }}
          >
            Choose this reply
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

      {/* Image Modal */}
      <Modal
        isOpen={imageModalOpen}
        toggle={() => setImageModalOpen(false)}
        centered
        size="lg"
      >
        <ModalBody style={{ padding: 0, background: "#222" }}>
          <img
            src={imageModalSrc}
            alt="Enlarged"
            style={{ width: "100%", height: "auto", display: "block", maxHeight: "80vh", margin: "0 auto" }}
          />
        </ModalBody>
      </Modal>

      {/* Move to Next Aligner Modal */}
      <Modal isOpen={moveNextModalOpen} toggle={() => setMoveNextModalOpen(false)} centered>
        <div className="modal-header">
          <h5 className="modal-title">Move to Next Aligner</h5>
          <button type="button" className="btn-close" onClick={() => setMoveNextModalOpen(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body py-4">
          {loadingAlignerInfo ? (
            <div className="text-center py-4">
              <span className="spinner-border spinner-border-sm me-2"></span> 
              Loading aligner info...
            </div>
          ) : alignerInfo ? (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong className="text-muted">Total aligners:</strong>
                  <span className="fw-bold">{alignerInfo.total_aligners}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong className="text-muted">Current aligner:</strong>
                  <span className="fw-bold">{alignerInfo.current_aligner}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong className="text-muted">Next aligner:</strong>
                  <span className="fw-bold text-primary">
                    {alignerInfo.current_aligner < alignerInfo.total_aligners ? alignerInfo.current_aligner + 1 : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="alert alert-warning mb-3">
                <i className="mdi mdi-alert-circle-outline me-2"></i>
                <strong>Warning:</strong> This action cannot be undone.
              </div>
              
              <div className="mb-3">
                <Label for="alignerNote" className="form-label">
                  <strong>Note (Optional):</strong>
                </Label>
                <Input
                  type="textarea"
                  id="alignerNote"
                  value={alignerNote}
                  onChange={(e) => setAlignerNote(e.target.value)}
                  placeholder="Add a note about this aligner change..."
                  rows="3"
                  disabled={changingAligner}
                />
              </div>
              
              {changeAlignerError && (
                <div className="alert alert-danger mt-3">
                  <i className="mdi mdi-close-circle-outline me-2"></i>
                  {changeAlignerError.toString()}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-danger py-4">
              <i className="mdi mdi-close-circle-outline me-2"></i>
              Failed to load aligner info.
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => setMoveNextModalOpen(false)} disabled={changingAligner}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={() => {
              if (id && alignerInfo && alignerInfo.current_aligner < alignerInfo.total_aligners) {
                const requestData = {
                  patient_id: id, 
                  next_number: alignerInfo.current_aligner + 1,
                  step_number: alignerInfo.current_aligner + 1,
                  note: alignerNote.trim() || null
                };
                dispatch(changeAligner(requestData));
              }
              setMoveNextModalOpen(false);
            }} 
            disabled={changingAligner || !alignerInfo || alignerInfo.current_aligner >= alignerInfo.total_aligners}
          >
            {changingAligner ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              'Confirm Move to Next'
            )}
          </Button>
        </div>
      </Modal>

      {/* Treatment Issues Modal */}
      <Modal isOpen={modalStates.issues} toggle={() => toggleModal("issues")} centered size="lg">
        <div className="modal-header">
          <h5 className="modal-title">Treatment Issues</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => toggleModal("issues", false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          {treatmentIssuesLoading ? (
            <div className="text-center py-4">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Loading issues...
            </div>
          ) : treatmentIssuesError ? (
            <div className="alert alert-danger">
              <i className="mdi mdi-close-circle-outline me-2"></i>
              {treatmentIssuesError.toString()}
            </div>
          ) : treatmentIssues && treatmentIssues.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Step #</th>
                    <th>Issue</th>
                    <th>Message</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {treatmentIssues.map((issue, index) => (
                    <tr key={index}>
                      <td>
                        <span className="badge bg-primary">{issue.step_number}</span>
                      </td>
                      <td>
                        <strong>{issue.issue}</strong>
                      </td>
                      <td>{issue.message}</td>
                      <td>
                        {issue.created_at ? (
                          <small className="text-muted">
                            {formatDate(issue.created_at)}
                          </small>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="mdi mdi-check-circle-outline text-success" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">No treatment issues found.</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button color="light" onClick={() => toggleModal("issues", false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDetail;