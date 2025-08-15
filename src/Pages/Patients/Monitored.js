import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Form,
  Tooltip,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getMonitoredPatients, addPatient, clearPatientMessages } from "../../store/patients/actions";
import { useToast } from "../../components/Common/ToastContext";
import { getDoctors } from "../../store/doctors/actions";
import Select from 'react-select';
import PatientForm from './PatientForm';
import { useRoleAccess } from "../../Hooks/RoleHooks";
import RoleBasedRender from "../../components/Common/RoleBasedRender";

// Enhanced components
import { withPageTransition } from "../../components/Common/PageTransition";
import ShimmerLoader from "../../components/Common/ShimmerLoader";
import { useOptimizedAPI } from "../../Hooks/useOptimizedAPI";

// Shimmer effect styles
const shimmerStyles = `
  .shimmer-input {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border: 1px solid #e9ecef;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .shimmer-table-row {
    background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    height: 56px;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  
  .shimmer-table-cell {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    height: 16px;
    border-radius: 4px;
    margin: 4px 0;
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-table-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Pagination Loading Bar Styles */
  .pagination-loading-container {
    padding: 8px 16px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease-in-out;
    opacity: 0.7;
  }
  
  .pagination-loading-container.pagination-loading-active {
    opacity: 1;
    background: rgba(29, 165, 254, 0.1);
    border-color: #1da5fe;
    padding: 12px 16px;
  }
  
  .pagination-loading-container.pagination-loading-inactive {
    opacity: 0.5;
    background: #f8f9fa;
    border-color: #e9ecef;
  }
  
  .pagination-loading-bar {
    width: 100%;
    height: 2px;
    background: #e9ecef;
    border-radius: 1px;
    overflow: hidden;
    position: relative;
  }
  
  .pagination-loading-container.pagination-loading-active .pagination-loading-bar {
    height: 3px;
    background: rgba(29, 165, 254, 0.1);
  }
  
  .pagination-loading-progress {
    height: 100%;
    background: #e9ecef;
    border-radius: 1px;
    width: 0%;
    transition: all 0.3s ease-in-out;
  }
  
  .pagination-loading-progress.pagination-loading-progress-active {
    background: linear-gradient(90deg, #1da5fe, #0d8ee6, #1da5fe);
    background-size: 200% 100%;
    border-radius: 2px;
    animation: pagination-loading-progress 1.5s ease-in-out infinite;
    width: 100%;
  }
  
  .pagination-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes pagination-loading-progress {
    0% {
      background-position: -200% 0;
      transform: translateX(-100%);
    }
    50% {
      background-position: 0% 0;
      transform: translateX(0%);
    }
    100% {
      background-position: 200% 0;
      transform: translateX(100%);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const filterOptions = {
  compliance: [
    "All patients",
    "On track (0)",
    "2-7 days late (1-7)",
    "1-2 weeks late (8-14)",
    "2-4 weeks late (15-28)",
    "4+ weeks late (29+)",
  ],
  alignerType: [
    "All",
    "Day time dual arch",
    "Night time dual arch", 
    "Day time upper arch",
    "Day time lower arch",
    "Night time upper arch",
    "Night time lower arch",
    "Day Aligner",
    "Night Aligner",
    "Impression Kit"
  ],
  alignerStatus: ["All", "In progress", "Finished", "Aligner number not set"],
  appActivation: ["All", "Activated", "Not activated"],
  monitoringStatus: ["All", "Monitored", "Not Monitored", "Completed", "Other"],
};

const filterLabels = {
  compliance: "Compliance",
  alignerType: "Aligner Type",
  alignerStatus: "Aligner status",
  appActivation: "App activation",
  monitoringStatus: "Monitoring Status",
};

const columns = [
  {
    name: "PATIENT NAME",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="cell-content">
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.doctor}
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="fw-bold">{row.name}</div>
          {row.coupon_code && (
            <span className="badge bg-info text-white px-2 py-1" style={{ fontSize: "0.7rem" }}>
              {row.coupon_code}
            </span>
          )}
          {row.sourceBadge && (
            <span 
              className={`badge ${row.sourceBadge.color} text-white px-2 py-1 d-inline-flex align-items-center`} 
              style={{ fontSize: "0.7rem", cursor: "help" }}
              id={`source-badge-${row.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <i className={`${row.sourceBadge.icon} me-1`} style={{ fontSize: "0.8rem" }}></i>
            </span>
          )}
          {row.sourceBadge && (
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`source-badge-${row.id}`]}
              target={`source-badge-${row.id}`}
              toggle={() => toggleTooltip(`source-badge-${row.id}`)}
              autohide={false}
              delay={{ show: 100, hide: 100 }}
            >
              {row.sourceBadge.tooltip}
            </Tooltip>
          )}
        </div>
        <div className="text-muted" style={{ fontSize: "0.75em" }}>
          {row.email}
        </div>
      </div>
    ),
    sortable: true,
    minWidth: "200px",
  },
  {
    name: "STATUS",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="d-flex flex-column gap-1">
          <span className={`badge ${row.appActivationBadge} px-2 py-1`} style={{ fontSize: "0.7rem" }}>
            {row.appActivationText}
          </span>
          <span className={`badge ${row.monitoringBadge} px-2 py-1`} style={{ fontSize: "0.7rem" }}>
            {row.monitoringText}
          </span>
        </div>
      </div>
    ),
    minWidth: "120px",
  },
  {
    name: "LATEST ACTIVITY",
    selector: (row) => row.latestActivity,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {row.latestActivityTime}
        </div>
        <div>{row.latestActivity}</div>
      </div>
    ),
    minWidth: "180px",
  },
  {
    name: "ALIGNER TYPE",
    selector: (row) => row.alignerType,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className="fw-bold">{row.alignerType || 'Not set'}</div>
        <div className="text-muted" style={{ fontSize: "0.75em" }}>
          Status: {row.alignerStatus}
        </div>
      </div>
    ),
    minWidth: "160px",
  },
  {
    name: "COMPLIANCE",
    selector: (row) => row.compliance,
    sortable: true,
    cell: (row) => (
      <div className="cell-content">
        <div className={`fw-bold ${row.complianceBadge}`}>
          {row.complianceText}
        </div>
        <div className="text-muted" style={{ fontSize: "0.75em" }}>
          {row.complianceDays} days
        </div>
      </div>
    ),
    minWidth: "120px",
  },
];

const customStyles = {
  rows: {
    style: {
      minHeight: "56px",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
  headCells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontWeight: "bold",
      fontSize: "0.9rem",
      backgroundColor: "#f8f9fa",
      color: "#495057",
      borderBottom: "2px solid #e9ecef",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "0.85rem",
      verticalAlign: "middle",
      margin: "4px 0",
    },
  },
};

const PatientsMonitored = ({ pageTitle = "Patients" }) => {
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [loadingType, setLoadingType] = useState('initial'); // Track loading type
  const [showShimmer, setShowShimmer] = useState(true); // Control shimmer visibility
  const [isPaginationLoading, setIsPaginationLoading] = useState(false); // Track pagination loading specifically
  const [tooltipOpen, setTooltipOpen] = useState({});
  const { userRole, canAccessFeature } = useRoleAccess();
  
  const toggleTooltip = (id) => {
    setTooltipOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Inject shimmer styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = shimmerStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const toggleCreatePatient = () => {
    if (createPatientModal) {
      // Modal is being closed, reset form
      setPatientForm(initialPatientForm);
      setFormErrors({}); // Reset errors on modal close
    }
    setCreatePatientModal(!createPatientModal);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const monitoredPatients = useSelector((state) => state.patients.monitoredPatients);
  const pagination = useSelector((state) => state.patients.pagination);
  const monitoredLoading = useSelector((state) => state.patients.loading);
  const monitoredError = useSelector((state) => state.patients.error);
  const successMessage = useSelector((state) => state.patients.successMessage);
  const doctors = useSelector((state) => state.doctor.doctors) || [];
  const showToast = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // State for Create Label Modal
  const [createLabelModalOpen, setCreateLabelModalOpen] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [createdLabels, setCreatedLabels] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  // Form state for create patient
  const initialPatientForm = {
    coupon_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    doctor_id: "",
    gender: "",
    patient_source: "",
    address: "",
    address2: "",
    zip_code: "",
    city: "",
    state: "",
    country: "",
    aligner_type: "",
  };
  const [patientForm, setPatientForm] = useState(initialPatientForm);
  const [formErrors, setFormErrors] = useState({}); // NEW: error state

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    compliance: "All patients",
    alignerType: "All",
    alignerStatus: "All",
    appActivation: "All",
    monitoringStatus: "All",
  });

  // Merge filter keys into a single array for one row
  const filterRowKeys = [
    "compliance",
    "alignerType",
    "alignerStatus",
    "appActivation",
    "monitoringStatus",
  ];

  const defaultFilters = {
    compliance: "All patients",
    alignerType: "All",
    alignerStatus: "All",
    appActivation: "All",
    monitoringStatus: "All",
  };

  const hasActiveFilters =
    filters.compliance !== defaultFilters.compliance ||
    filters.alignerType !== defaultFilters.alignerType ||
    filters.alignerStatus !== defaultFilters.alignerStatus ||
    filters.appActivation !== defaultFilters.appActivation ||
    filters.monitoringStatus !== defaultFilters.monitoringStatus ||
    debouncedSearchTerm.trim() !== "";

  const handleClearFilters = () => {
    setFilters({ ...defaultFilters });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
    // The API call will be triggered automatically by the useOptimizedAPI hook
    // when the dependencies (filters, debouncedSearchTerm, currentPage) change
  };

  // Fetch patients data with pagination and filters
  useEffect(() => {
    const params = {
      page: currentPage,
      perpage: perPage,
      ...(debouncedSearchTerm && { name: debouncedSearchTerm }),
      ...(filters.compliance !== 'All patients' && { compliance: getComplianceFilterValue(filters.compliance) }),
      ...(filters.alignerType !== 'All' && { aligner_type: filters.alignerType }),
      ...(filters.alignerStatus !== 'All' && { aligner_status: getAlignerStatusFilterValue(filters.alignerStatus) }),
      ...(filters.appActivation !== 'All' && { app_activation: filters.appActivation === 'Activated' ? 1 : 0 }),
      ...(filters.monitoringStatus !== 'All' && { 
        is_patient_monitored: filters.monitoringStatus === 'Monitored' ? 'monitored' : 
                              filters.monitoringStatus === 'Not Monitored' ? 'not_monitored' :
                              filters.monitoringStatus === 'Completed' ? 'completed' :
                              filters.monitoringStatus === 'Other' ? 'other' : null 
      }),
    };
    
    // Debug: Log the parameters being sent to API
    console.log('API Call Parameters:', params);
    console.log('Monitoring Status Filter:', filters.monitoringStatus);
    
    dispatch(getMonitoredPatients(params));
  }, [currentPage, perPage, debouncedSearchTerm, filters, dispatch]);

  // Use optimized API hook for doctors data
  const { data: doctorsData, loading: doctorsLoading } = useOptimizedAPI(
    () => dispatch(getDoctors()),
    [],
    { cacheTime: 10 * 60 * 1000, refetchOnMount: true }
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update loading state based on Redux state and API hooks
  useEffect(() => {
    // Show loading if Redux is loading, API hooks are loading, or we don't have data yet
    const shouldShowLoading = monitoredLoading || doctorsLoading || !monitoredPatients;
    
    if (shouldShowLoading) {
      setIsLoading(true);
      setShowShimmer(true);
    } else {
      // Add a minimum delay to show shimmer for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowShimmer(false);
        // Keep pagination loading state for a bit longer to show completion
        setTimeout(() => {
          setIsPaginationLoading(false);
        }, 300);
      }, 800); // Minimum 800ms shimmer time
      
      return () => clearTimeout(timer);
    }
    
    // Set loading type based on what's happening
    if (monitoredLoading) {
      if (searchTerm) {
        setLoadingType('searching');
      } else if (hasActiveFilters) {
        setLoadingType('filtering');
      } else if (currentPage > 1) {
        setLoadingType('pagination');
      } else {
        setLoadingType('loading');
      }
    } else if (doctorsLoading) {
      setLoadingType('loading');
    } else if (!monitoredPatients) {
      setLoadingType('initial');
    } else {
      setLoadingType('idle');
    }
  }, [monitoredLoading, doctorsLoading, monitoredPatients, searchTerm, hasActiveFilters, currentPage]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Add a handler for row click
  const handleRowClicked = (row) => {
    // Use a unique identifier for the patient, fallback to name if no id
    const patientId = row.id || row.name.replace(/\s+/g, "-").toLowerCase();
    navigate(`/patients/${patientId}`);
  };

  // Add label button handler
  const handleAddLabelClick = (e, row) => {
    e.stopPropagation();
    setSelectedPatientName(row.name);
    setCreateLabelModalOpen(true);
  };

  // Table columns (override to use handler)
  const columnsWithAddLabel = columns.map((col) => {
    if (col.name === "PATIENT NAME") {
      return {
        ...col,
        cell: (row) => (
          <div className="cell-content">
            <div 
              className="text-muted" 
              style={{ fontSize: "0.85em", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClicked(row);
              }}
            >
              <span className="fw-bold">Dr.</span> {row.doctor}
            </div>
            <div 
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClicked(row);
              }}
            >
              <div className="fw-bold">{row.name}</div>
              {row.coupon_code && (
                <span className="badge bg-info text-white px-2 py-1" style={{ fontSize: "0.7rem" }}>
                  {row.coupon_code}
                </span>
              )}
              {row.sourceBadge && (
                <span 
                  className={`badge ${row.sourceBadge.color} text-white px-2 py-1 d-inline-flex align-items-center`} 
                  style={{ fontSize: "0.7rem", cursor: "help" }}
                  id={`source-badge-${row.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className={`${row.sourceBadge.icon} me-1`} style={{ fontSize: "0.8rem" }}></i>
                </span>
              )}
              {row.sourceBadge && (
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen[`source-badge-${row.id}`]}
                  target={`source-badge-${row.id}`}
                  toggle={() => toggleTooltip(`source-badge-${row.id}`)}
                  autohide={false}
                  delay={{ show: 100, hide: 100 }}
                >
                  {row.sourceBadge.tooltip}
                </Tooltip>
              )}
            </div>
            <div className="text-muted" style={{ fontSize: "0.75em" }}>
              {row.email}
            </div>
          </div>
        ),
      };
    } else if (col.name === "STATUS") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div className="d-flex flex-column gap-1">
              <span className={`badge ${row.appActivationBadge} px-2 py-1`} style={{ fontSize: "0.7rem" }}>
                {row.appActivationText}
              </span>
              <span className={`badge ${row.monitoringBadge} px-2 py-1`} style={{ fontSize: "0.7rem" }}>
                {row.monitoringText}
              </span>
            </div>
          </div>
        ),
      };
    } else if (col.name === "LATEST ACTIVITY") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div className="text-muted" style={{ fontSize: "0.85em" }}>
              {row.latestActivityTime}
            </div>
            <div>{row.latestActivity}</div>
          </div>
        ),
      };
    } else if (col.name === "ALIGNER TYPE") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div>{row.alignerType || 'Not set'}</div>
            <div className="text-muted" style={{ fontSize: "0.75em" }}>
              Status: {row.alignerStatus}
            </div>
          </div>
        ),
      };
    } else if (col.name === "COMPLIANCE") {
      return {
        ...col,
        cell: (row) => (
          <div 
            className="cell-content"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClicked(row);
            }}
          >
            <div className={`fw-bold ${row.complianceBadge}`}>
              {row.complianceText}
            </div>
            <div className="text-muted" style={{ fontSize: "0.75em" }}>
              {row.complianceDays} days
            </div>
          </div>
        ),
      };
    }
    return col;
  });

  // Mock data for fallback
  const mockPatientFields = {
    latestActivity: "Message sent to patient",
    latestActivityTime: "2025-05-22 23:11 GMT+5",
    type: "Photo Monitoring Full",
    typeDetail: "MX/MD: Orthodontic treatment - Aligner - Other",
    latestScan: "2025-05-13 00:11 GMT+5",
    lateInfo: "3 days late",
    scanInterval: "1 week interval",
  };

  // Helper function to get compliance info
  const getComplianceInfo = (compliance) => {
    const complianceNum = parseInt(compliance) || 0;
    
    if (complianceNum === 0) {
      return {
        text: "On track",
        badge: "text-success",
        days: 0
      };
    } else if (complianceNum >= 1 && complianceNum <= 7) {
      return {
        text: "2-7 days late",
        badge: "text-warning",
        days: complianceNum
      };
    } else if (complianceNum >= 8 && complianceNum <= 14) {
      return {
        text: "1-2 weeks late",
        badge: "text-warning",
        days: complianceNum
      };
    } else if (complianceNum >= 15 && complianceNum <= 28) {
      return {
        text: "2-4 weeks late",
        badge: "text-danger",
        days: complianceNum
      };
    } else {
      return {
        text: "4+ weeks late",
        badge: "text-danger",
        days: complianceNum
      };
    }
  };

  // Helper function to get status badges
  const getStatusBadges = (appActivation, isPatientMonitored) => {
    const appActivationNum = parseInt(appActivation) || 0;
    
    // Handle enum values for monitoring status
    let monitoringText = "Not Monitored";
    let monitoringBadge = "bg-warning";
    
    switch (isPatientMonitored) {
      case "monitored":
        monitoringText = "Monitored";
        monitoringBadge = "bg-info";
        break;
      case "completed":
        monitoringText = "Completed";
        monitoringBadge = "bg-success";
        break;
      case "other":
        monitoringText = "Other";
        monitoringBadge = "bg-secondary";
        break;
      case "not_monitored":
      default:
        monitoringText = "Not Monitored";
        monitoringBadge = "bg-warning";
        break;
    }
    
    return {
      appActivation: {
        text: appActivationNum === 1 ? "Activated" : "Not activated",
        badge: appActivationNum === 1 ? "bg-success" : "bg-secondary"
      },
      monitoring: {
        text: monitoringText,
        badge: monitoringBadge
      }
    };
  };

  // Helper function to get patient source badge
  const getPatientSourceBadge = (patientSource) => {
    const source = (patientSource || "").toLowerCase();
    
    switch (source) {
      case 'referral':
        return {
          icon: 'ri-user-received-line',
          color: 'bg-primary',
          tooltip: 'Referral'
        };
      case 'direct':
        return {
          icon: 'ri-user-line',
          color: 'bg-success',
          tooltip: 'Direct'
        };
      case 'website':
        return {
          icon: 'ri-global-line',
          color: 'bg-info',
          tooltip: 'Website'
        };
      default:
        return {
          icon: 'ri-user-question-line',
          color: 'bg-secondary',
          tooltip: 'Unknown Source'
        };
    }
  };

  // Helper function to convert compliance filter to API value
  const getComplianceFilterValue = (complianceFilter) => {
    switch (complianceFilter) {
      case 'On track (0)':
        return 0;
      case '2-7 days late (1-7)':
        return 1; // API will handle range filtering
      case '1-2 weeks late (8-14)':
        return 8; // API will handle range filtering
      case '2-4 weeks late (15-28)':
        return 15; // API will handle range filtering
      case '4+ weeks late (29+)':
        return 29; // API will handle range filtering
      default:
        return null;
    }
  };

  // Helper function to convert aligner status filter to API value
  const getAlignerStatusFilterValue = (alignerStatusFilter) => {
    switch (alignerStatusFilter) {
      case 'In progress':
        return 'inprogress';
      case 'Finished':
        return 'finished';
      case 'Aligner number not set':
        return 'notset';
      default:
        return null;
    }
  };

  // Map API patients to table data
  const rawData =
    monitoredPatients && Array.isArray(monitoredPatients)
      ? monitoredPatients.map((p, idx) => {
          const complianceInfo = getComplianceInfo(p.compliance);
          const statusBadges = getStatusBadges(p.app_activation, p.is_patient_monitored);
          const sourceBadge = getPatientSourceBadge(p.patient_source);
          
          return {
            name:
              `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
              p.username ||
              "",
            doctor: p.doctor_name || "",
            latestActivity: p.latest_activity?.description || (typeof p.latest_activity === 'string' ? p.latest_activity : "No activity"),
            latestActivityTime: p.latest_activity?.created_at || "",
            alignerType: p.aligner_type || 'Not set',
            alignerStatus: p.aligner_status || 'notset',
            id: p.id,
            email: p.email || "",
            coupon_code: p.coupon_code || null,
            patient_source: p.patient_source || "",
            is_patient_monitored: p.is_patient_monitored,
            app_activation: p.app_activation,
            compliance: p.compliance,
            complianceText: complianceInfo.text,
            complianceDays: complianceInfo.days,
            complianceBadge: complianceInfo.badge,
            appActivationBadge: statusBadges.appActivation.badge,
            appActivationText: statusBadges.appActivation.text,
            monitoringBadge: statusBadges.monitoring.badge,
            monitoringText: statusBadges.monitoring.text,
            sourceBadge: sourceBadge,
          };
        })
      : [];

  // Use raw data directly since filtering is now handled by the server
  const filteredData = rawData;

  const handlePatientFormChange = (e) => {
    const { id, value } = e.target;
    setPatientForm((prev) => ({
      ...prev,
      [id === "mobile" ? "phone" : id]: value,
    }));
  };

  // Validation function
  const validatePatientForm = (form) => {
    const errors = {};
    if (!form.first_name) errors.first_name = 'First name is required';
    if (!form.last_name) errors.last_name = 'Last name is required';
    if (!form.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Invalid email address';
    if (!form.phone) errors.phone = 'Mobile phone is required';
    if (!form.dob) errors.dob = 'Date of birth is required';
    if (!form.doctor_id) errors.doctor_id = 'Doctor is required';
    if (!form.gender) errors.gender = 'Gender is required';
    if (!form.patient_source) errors.patient_source = 'Patient source is required';
    if (!form.country) errors.country = 'Country is required';
    if (!form.state) errors.state = 'State is required';
    if (!form.city) errors.city = 'City is required';
    if (!form.address) errors.address = 'Address is required';
    if (!form.address2) errors.address2 = 'Address line 2 is required';
    if (!form.zip_code) errors.zip_code = 'Zip code is required';
    if (!form.aligner_type) errors.aligner_type = 'Aligner type is required';
    return errors;
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    const errors = validatePatientForm(patientForm);
    if (Object.keys(errors).length > 0) {
      showToast({
        message: "Please fill all the required fields",
        type: "error",
        title: "Validation Error",
      });
      return;
    }
    dispatch(addPatient(patientForm));
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setIsPaginationLoading(true);
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerRowsChange = (newPerPage, page) => {
    setIsPaginationLoading(true);
    setPerPage(newPerPage);
    setCurrentPage(page);
  };



  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    // The API call will be triggered automatically by the useOptimizedAPI hook
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    console.log('Filter Change:', filterKey, 'Value:', value);
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
    // The API call will be triggered automatically by the useEffect hook
  };

  // Toast handling for patient creation success/error
  useEffect(() => {
    if (successMessage) {
      showToast({
        message: successMessage || 'Patient created successfully!',
        type: 'success',
        title: 'Success',
      });
      setCreatePatientModal(false);
      setPatientForm(initialPatientForm);
      setFormErrors({}); // Clear errors on successful creation
      dispatch(clearPatientMessages());
      
      // Refresh the patient list to show the newly created patient
      const params = {
        page: currentPage,
        perpage: perPage,
        ...(debouncedSearchTerm && { name: debouncedSearchTerm }),
        ...(filters.compliance !== 'All patients' && { compliance: getComplianceFilterValue(filters.compliance) }),
        ...(filters.alignerType !== 'All' && { aligner_type: filters.alignerType }),
        ...(filters.alignerStatus !== 'All' && { aligner_status: getAlignerStatusFilterValue(filters.alignerStatus) }),
        ...(filters.appActivation !== 'All' && { app_activation: filters.appActivation === 'Activated' ? 1 : 0 }),
        ...(filters.monitoringStatus !== 'All' && { 
          is_patient_monitored: filters.monitoringStatus === 'Monitored' ? 'monitored' : 
                                filters.monitoringStatus === 'Not Monitored' ? 'not_monitored' :
                                filters.monitoringStatus === 'Completed' ? 'completed' :
                                filters.monitoringStatus === 'Other' ? 'other' : null 
        }),
      };
      dispatch(getMonitoredPatients(params));
    }
  }, [successMessage, showToast, dispatch, currentPage, perPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    if (monitoredError) {
      showToast({
        message: typeof monitoredError === 'string' ? monitoredError : 'Failed to create patient',
        type: 'error',
        title: 'Error',
      });
      dispatch(clearPatientMessages());
    }
  }, [monitoredError, showToast, dispatch]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    setIsLoadingCountries(true);
    fetch('https://countriesnow.space/api/v0.1/countries/iso')
      .then(res => res.json())
      .then(data => setCountries(data.data.map(c => c.name)))
      .finally(() => setIsLoadingCountries(false));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (patientForm.country) {
      setIsLoadingStates(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: patientForm.country })
      })
        .then(res => res.json())
        .then(data => setStates(data.data.states.map(s => s.name)))
        .finally(() => setIsLoadingStates(false));
      setPatientForm(prev => ({ ...prev, state: '', city: '' }));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [patientForm.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (patientForm.country && patientForm.state) {
      setIsLoadingCities(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: patientForm.country, state: patientForm.state })
      })
        .then(res => res.json())
        .then(data => setCities(data.data))
        .finally(() => setIsLoadingCities(false));
      setPatientForm(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [patientForm.state, patientForm.country]);

  // Shared aligner type options (from Orders.js main concern)
  const alignerTypeOptions = [
    'Day time dual arch',
    'Night time dual arch',
    'Day time upper arch',
    'Day time lower arch',
    'Night time upper arch',
    'Night time lower arch',
  ];

  return (
    <div className="page-content no-navbar">
      <Container fluid>
        {/* Page Title and New Patient Button */}
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={4} xs={6} className="text-end">
            <div className="d-flex align-items-center justify-content-end">
              {hasActiveFilters && (
                <Button
                  color="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={handleClearFilters}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line me-1" style={{ animation: 'spin 1s linear infinite' }}></i>
                      Clearing...
                    </>
                  ) : (
                    'Clear Filters'
                  )}
                </Button>
              )}
              <RoleBasedRender feature="create_patients">
                <Button 
                  color="primary" 
                  onClick={toggleCreatePatient}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line me-1" style={{ animation: 'spin 1s linear infinite' }}></i>
                      Loading...
                    </>
                  ) : (
                    '+ New patient'
                  )}
                </Button>
              </RoleBasedRender>
            </div>
          </Col>
        </Row>

        {/* Create Patient Modal */}
        <Modal
          isOpen={createPatientModal}
          toggle={toggleCreatePatient}
          size="lg"
          centered
        >
          <ModalHeader toggle={toggleCreatePatient}>
            <h4 className="modal-title">Create a new patient</h4>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreatePatient}>
              <PatientForm
                formState={patientForm}
                onChange={handlePatientFormChange}
                doctors={doctors}
                countries={countries}
                states={states}
                cities={cities}
                isLoadingCountries={isLoadingCountries}
                isLoadingStates={isLoadingStates}
                isLoadingCities={isLoadingCities}
                errors={formErrors} // Pass errors
              />
              <div className="text-end mt-4">
                <Button color="light" className="me-2" onClick={toggleCreatePatient} type="button" disabled={isLoading}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create patient"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>

        <Card>
          <CardBody>
            <div className="control-panel">
              {/* Search Bar */}
              <Row className="mb-3 align-items-center">
                <Col md={2} sm={6} xs={12} className="mb-2">
                  <div>
                    <label className="form-label" htmlFor="search-input">
                      Search Patients
                    </label>
                    <div className="position-relative">
                      <Input
                        id="search-input"
                        type="search"
                        placeholder="Patient name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={isLoading}
                      />
                      {isLoading && loadingType === 'searching' && (
                        <div className="position-absolute" style={{ top: '50%', right: '12px', transform: 'translateY(-50%)' }}>
                          <i className="ri-loader-4-line text-muted" style={{ animation: 'spin 1s linear infinite' }}></i>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                {filterRowKeys.map((key) => (
                  <Col md={2} sm={6} xs={12} key={key} className="mb-2">
                    <label className="form-label" htmlFor={`filter-${key}`}>
                      {filterLabels[key] || key}
                    </label>
                    <div className="position-relative">
                      <Input 
                        id={`filter-${key}`} 
                        type="select"
                        value={filters[key]}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        disabled={isLoading}
                      >
                        {filterOptions[key].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Input>
                      {isLoading && loadingType === 'filtering' && (
                        <div className="position-absolute" style={{ top: '50%', right: '12px', transform: 'translateY(-50%)' }}>
                          <i className="ri-loader-4-line text-muted" style={{ animation: 'spin 1s linear infinite' }}></i>
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            

            
            {/* Shimmer Loading Effect */}
            {showShimmer && (
              <div className="shimmer-table-container mb-3">
                {/* Loading indicator */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="shimmer-table-cell" style={{ width: '150px', height: '16px' }}></div>
                  <div className="text-muted small">
                    <i className="ri-loader-4-line me-1" style={{ animation: 'spin 1s linear infinite' }}></i>
                    Loading {perPage} patients...
                  </div>
                </div>
                
                {/* Table header shimmer */}
                <div className="d-flex mb-3" style={{ borderBottom: '2px solid #e9ecef', paddingBottom: '12px' }}>
                  {['Patient Name', 'Status', 'Latest Activity', 'Aligner Type', 'Compliance'].map((header, index) => (
                    <div key={index} className="shimmer-table-cell" style={{ 
                      flex: index === 0 ? 2 : 1, 
                      marginRight: index < 4 ? '16px' : '0',
                      height: '20px'
                    }}></div>
                  ))}
                </div>
                {/* Table rows shimmer */}
                {Array.from({ length: 8 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="d-flex align-items-center mb-3" style={{ padding: '12px 0' }}>
                    <div className="d-flex align-items-center" style={{ flex: 2, marginRight: '16px' }}>
                      <div className="shimmer-table-cell" style={{ width: '60%', height: '14px', marginRight: '8px' }}></div>
                      <div className="shimmer-table-cell" style={{ width: '30%', height: '12px' }}></div>
                    </div>
                    <div className="d-flex flex-column" style={{ flex: 1, marginRight: '16px' }}>
                      <div className="shimmer-table-cell" style={{ width: '80%', height: '12px', marginBottom: '4px' }}></div>
                      <div className="shimmer-table-cell" style={{ width: '60%', height: '12px' }}></div>
                    </div>
                    <div className="d-flex flex-column" style={{ flex: 1, marginRight: '16px' }}>
                      <div className="shimmer-table-cell" style={{ width: '70%', height: '12px', marginBottom: '4px' }}></div>
                      <div className="shimmer-table-cell" style={{ width: '90%', height: '12px' }}></div>
                    </div>
                    <div className="d-flex flex-column" style={{ flex: 1, marginRight: '16px' }}>
                      <div className="shimmer-table-cell" style={{ width: '85%', height: '12px', marginBottom: '4px' }}></div>
                      <div className="shimmer-table-cell" style={{ width: '50%', height: '12px' }}></div>
                    </div>
                    <div className="d-flex flex-column" style={{ flex: 1 }}>
                      <div className="shimmer-table-cell" style={{ width: '75%', height: '12px', marginBottom: '4px' }}></div>
                      <div className="shimmer-table-cell" style={{ width: '40%', height: '12px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Patient List Table */}
            {!showShimmer && (
              <>
                <DataTable
                  columns={columnsWithAddLabel}
                  data={filteredData}
                  pagination
                  paginationServer={true}
                  paginationTotalRows={pagination?.total_items || 0}
                  paginationDefaultPage={currentPage}
                  paginationPerPage={perPage}
                  paginationRowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  highlightOnHover
                  responsive
                  customStyles={{
                    ...customStyles,
                    rows: {
                      ...customStyles.rows,
                      style: {
                        ...customStyles.rows.style,
                        cursor: "pointer",
                      },
                    },
                  }}
                  onRowClicked={handleRowClicked}
                  noDataComponent={
                    <div className="text-center p-4">
                      {searchTerm ? "No patients found matching your search." : "No patients found."}
                    </div>
                  }
                />
                
                {/* Pagination Loading Bar - Always Visible */}
                <div className={`pagination-loading-container mt-3 ${isPaginationLoading ? 'pagination-loading-active' : 'pagination-loading-inactive'}`}>
                  <div className="pagination-loading-bar">
                    <div className={`pagination-loading-progress ${isPaginationLoading ? 'pagination-loading-progress-active' : ''}`}></div>
                  </div>
                  <div className="pagination-loading-text text-center mt-2">
                    <small className={`${isPaginationLoading ? 'text-primary' : 'text-muted'}`} style={{ color: isPaginationLoading ? '#1da5fe' : undefined }}>
                      <i className={`ri-loader-4-line me-1 ${isPaginationLoading ? 'pagination-spin' : ''}`}></i>
                      {isPaginationLoading 
                        ? `Loading page ${currentPage} of ${pagination?.total_pages || 1}...`
                        : `Page ${currentPage} of ${pagination?.total_pages || 1}`
                      }
                    </small>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Container>
      {/* Create Label Modal */}
      <Modal
        isOpen={createLabelModalOpen}
        toggle={() => setCreateLabelModalOpen(false)}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Add labels to {selectedPatientName || "patient"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setCreateLabelModalOpen(false)}
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
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className="label-input"
              />
              <Button
                color="primary"
                size="sm"
                disabled={!labelInput.trim() || labelInput.length > 20}
                onClick={() => {
                  if (labelInput.trim() && labelInput.length <= 20) {
                    setCreatedLabels((labels) => [
                      ...labels,
                      labelInput.trim(),
                    ]);
                    setLabelInput("");
                  }
                }}
              >
                Create
              </Button>
            </div>
            <div className="small text-muted mt-1">{labelInput.length}/20</div>
          </div>
          <div className="mb-3">
            {createdLabels.length === 0 ? (
              <div className="text-muted text-center py-3">
                No labels created yet.
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {createdLabels.map((label, idx) => (
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
          <Button color="light" onClick={() => setCreateLabelModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={createdLabels.length === 0}
            onClick={() => {
              // Handle label addition here
              setCreateLabelModalOpen(false);
              setCreatedLabels([]);
            }}
          >
            Add {createdLabels.length} label
            {createdLabels.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Export with page transition
export default withPageTransition(PatientsMonitored);