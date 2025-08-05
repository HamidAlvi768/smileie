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
    border-radius: 2px;
    margin: 4px 0;
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
  monitoringStatus: ["All", "Monitored", "Not Monitored"],
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
    searchTerm.trim() !== "";

  const handleClearFilters = () => {
    setFilters({ ...defaultFilters });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Use optimized API hook for patients data
  const { data: patientsData, loading: patientsLoading, error: patientsError } = useOptimizedAPI(
    () => dispatch(getMonitoredPatients()),
    [],
    { cacheTime: 2 * 60 * 1000, refetchOnMount: true }
  );

  // Use optimized API hook for doctors data
  const { data: doctorsData, loading: doctorsLoading } = useOptimizedAPI(
    () => dispatch(getDoctors()),
    [],
    { cacheTime: 10 * 60 * 1000, refetchOnMount: true }
  );

  // Scroll to top on mount and ensure data is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Ensure we fetch data if not already loaded
    if (!monitoredPatients) {
      dispatch(getMonitoredPatients());
    }
  }, [dispatch, monitoredPatients]);

  // Update loading state based on Redux state and API hooks
  useEffect(() => {
    // Show loading if Redux is loading, API hooks are loading, or we don't have data yet
    const shouldShowLoading = monitoredLoading || patientsLoading || doctorsLoading || !monitoredPatients;
    setIsLoading(shouldShowLoading);
  }, [monitoredLoading, patientsLoading, doctorsLoading, monitoredPatients]);

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
    const isMonitored = isPatientMonitored === "monitored" || isPatientMonitored === true || isPatientMonitored === 1;
    
    return {
      appActivation: {
        text: appActivationNum === 1 ? "Activated" : "Not activated",
        badge: appActivationNum === 1 ? "bg-success" : "bg-secondary"
      },
      monitoring: {
        text: isMonitored ? "Monitored" : "Not Monitored",
        badge: isMonitored ? "bg-info" : "bg-warning"
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

  // Filter and search data
  const filteredData = rawData.filter((item) => {
    // Search filter
    const searchMatch = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchTerm))
      : true;

    // Monitoring Status filter
    let monitoringStatusMatch = true;
    if (filters.monitoringStatus !== 'All') {
      if (filters.monitoringStatus === 'Monitored') {
        monitoringStatusMatch = item.is_patient_monitored === "monitored" || item.is_patient_monitored === true || item.is_patient_monitored === 1;
      } else if (filters.monitoringStatus === 'Not Monitored') {
        monitoringStatusMatch = item.is_patient_monitored === "not_monitored" || item.is_patient_monitored === false || item.is_patient_monitored === 0;
      }
    }

    // App Activation filter
    let appActivationMatch = true;
    if (filters.appActivation !== 'All') {
      if (filters.appActivation === 'Activated') {
        appActivationMatch = item.app_activation === 1 || item.app_activation === true;
      } else if (filters.appActivation === 'Not activated') {
        appActivationMatch = item.app_activation === 0 || item.app_activation === false;
      }
    }

    // Aligner Type filter
    let alignerTypeMatch = true;
    if (filters.alignerType !== 'All') {
      alignerTypeMatch = item.alignerType === filters.alignerType;
    }

    // Aligner Status filter
    let alignerStatusMatch = true;
    if (filters.alignerStatus !== 'All') {
      if (filters.alignerStatus === 'In progress') {
        alignerStatusMatch = item.alignerStatus === 'inprogress';
      } else if (filters.alignerStatus === 'Finished') {
        alignerStatusMatch = item.alignerStatus === 'finished';
      } else if (filters.alignerStatus === 'Aligner number not set') {
        alignerStatusMatch = item.alignerStatus === 'notset';
      }
    }

    // Compliance filter
    let complianceMatch = true;
    if (filters.compliance !== 'All patients') {
      const complianceNum = parseInt(item.compliance) || 0;
      
      if (filters.compliance === 'On track (0)') {
        complianceMatch = complianceNum === 0;
      } else if (filters.compliance === '2-7 days late (1-7)') {
        complianceMatch = complianceNum >= 1 && complianceNum <= 7;
      } else if (filters.compliance === '1-2 weeks late (8-14)') {
        complianceMatch = complianceNum >= 8 && complianceNum <= 14;
      } else if (filters.compliance === '2-4 weeks late (15-28)') {
        complianceMatch = complianceNum >= 15 && complianceNum <= 28;
      } else if (filters.compliance === '4+ weeks late (29+)') {
        complianceMatch = complianceNum >= 29;
      }
    }

    // Email filter
    let emailMatch = true;
    if (filters.email !== 'All') {
      if (filters.email === 'Has email') {
        emailMatch = item.email && item.email.trim() !== '';
      } else if (filters.email === 'No email') {
        emailMatch = !item.email || item.email.trim() === '';
      }
    }

    return searchMatch && monitoringStatusMatch && appActivationMatch && alignerTypeMatch && alignerStatusMatch && complianceMatch && emailMatch;
  });

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
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
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
      dispatch(getMonitoredPatients()); // Refresh the list after creation
    }
  }, [successMessage, showToast, dispatch]);

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
                >
                  Clear Filters
                </Button>
              )}
              <RoleBasedRender feature="create_patients">
                <Button 
                  color="primary" 
                  onClick={toggleCreatePatient}
                  disabled={isLoading}
                >
                  + New patient
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
                    {isLoading ? (
                      <div className="shimmer-input" style={{ height: '38px', borderRadius: '4px' }}></div>
                    ) : (
                      <Input
                        id="search-input"
                        type="search"
                        placeholder="Patient name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    )}
                  </div>
                </Col>
                {filterRowKeys.map((key) => (
                  <Col md={2} sm={6} xs={12} key={key} className="mb-2">
                    <label className="form-label" htmlFor={`filter-${key}`}>
                      {filterLabels[key] || key}
                    </label>
                    {isLoading ? (
                      <div className="shimmer-input" style={{ height: '38px', borderRadius: '4px' }}></div>
                    ) : (
                      <Input 
                        id={`filter-${key}`} 
                        type="select"
                        value={filters[key]}
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                      >
                        {filterOptions[key].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Input>
                    )}
                  </Col>
                ))}
              </Row>
            </div>
            {/* Patient List Table */}
            <DataTable
              columns={columnsWithAddLabel}
              data={filteredData}
              pagination
              paginationServer={false}
              paginationTotalRows={filteredData.length}
              paginationDefaultPage={currentPage}
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[2, 5, 10, 15, 20, 25, 30]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              highlightOnHover
              responsive
              progressPending={isLoading}
              progressComponent={
                <div className="p-4">
                  <div className="shimmer-table-container">
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
                </div>
              }
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