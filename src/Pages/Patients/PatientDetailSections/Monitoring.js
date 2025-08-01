import React, { useState, Fragment, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import VisTimeline from "./VisTimeline";
import FullscreenImageModal from "./FullscreenImageModal";
import FullscreenComparisonModal from "./FullscreenComparisonModal";
import DetailedStatsModal from "./DetailedStatsModal";
import {
  getPatientMonitoringScansAPI,
  getPatientProgressAPI,
} from "../../../helpers/api_helper";
import config from "../../../config";

// --- MOCK DATA ---
const mockImages = [
  {
    src: require("../../../assets/images/intraoral_1.jpg"),
    date: "2025-05-01",
  },
  {
    src: require("../../../assets/images/intraoral_2.jpg"),
    date: "2025-05-10",
  },
  {
    src: require("../../../assets/images/intraoral_1.jpg"),
    date: "2025-05-15",
  },
  {
    src: require("../../../assets/images/intraoral_2.jpg"),
    date: "2025-05-20",
  },
];

const mockObservations = {
  alert: ["Noticeable unseat still present: 2.2 (ignored), 3.1, 4.1"],
  warning: [
    "Slight unseat still present: 3.3, 3.4, 3.6",
    "Noticeable unseat: 3.2, 4.2",
  ],
  silent: [
    "Persistent buccal dental calculus: 2.1, 3.1, 3.2, 4.1, 4.2, 4.3",
    "Slight gingivitis still present: Upper, Lower",
    "Spots on teeth still present (Brown spot): Upper, Lower",
  ],
  info: [],
  generalGoals: ["No Information"],
  anteroposterior: [],
  transverse: [],
  vertical: [],
};

const mockIndices = {
  overbite: "2mm",
  overjet: "1.5mm",
  midlineDeviation: "0.5mm Right",
  right: { molar: "-", cuspid: "-" },
  left: { molar: "-", cuspid: "-" },
};

const mockTimelinePoints = [
  {
    alignerIndex: "Slight unseat",
    dataObjectLabel: "2025-05-01",
    tooltip: "Slight unseat: 1.2",
  },
  {
    alignerIndex: "Noticeable unseat",
    dataObjectLabel: "2025-05-10",
    tooltip: "Noticeable unseat: 2.2",
  },
  {
    alignerIndex: "Slight unseat",
    dataObjectLabel: "2025-05-15",
    tooltip: "Slight unseat: 1.3",
  },
  {
    alignerIndex: "Noticeable unseat",
    dataObjectLabel: "2025-05-20",
    tooltip: "Noticeable unseat: 2.3",
  },
  // ... more points as needed
];

// --- CONSTANTS ---
const QUICK_REPLIES = [
  "",
  "Please use chewies for better aligner fit",
  "Please send a new scan",
  "Please schedule your next appointment",
];

// --- PRESENTATIONAL COMPONENTS ---

const ImageViewer = ({
  images,
  selectedDate,
  setSelectedDate,
  selectedImageIndex,
  onSendPhoto,
  onSendVideo,
  onMainImageClick,
}) => {
  const thumbnailsRef = useRef(null);

  // Ensure images is an array and has valid items
  const validImages = Array.isArray(images)
    ? images.filter((img) => img && img.src)
    : [];

  // Get the currently selected image with fallback
  // If selectedImageIndex is out of bounds, default to 0
  const safeImageIndex =
    selectedImageIndex >= 0 && selectedImageIndex < validImages.length
      ? selectedImageIndex
      : 0;
  const mainImage =
    validImages.length > 0
      ? validImages[safeImageIndex].src
      : "placeholder.jpg";

  // Handler for thumbnail click
  const handleThumbnailClick = (index) => {
    if (validImages[index] && validImages[index].date) {
      setSelectedDate(validImages[index].date);
    }
  };

  // Update selectedImageIndex when validImages changes to ensure first image is shown
  useEffect(() => {
    if (validImages.length > 0 && selectedImageIndex < 0) {
      // If no image is selected but we have images, select the first one
      handleThumbnailClick(0);
    }
  }, [validImages.length, selectedImageIndex]);

  // Scroll the selected thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const selectedThumb = thumbnailsRef.current.children[selectedImageIndex];
      if (selectedThumb) {
        // Only scroll if the selected index is 3 or greater (4th thumbnail onwards)
        if (selectedImageIndex >= 3) {
          // Calculate the scroll position to center the thumbnail
          const containerHeight = thumbnailsRef.current.clientHeight;
          const thumbHeight = selectedThumb.offsetHeight;
          const thumbTop = selectedThumb.offsetTop;
          const scrollPosition =
            thumbTop - containerHeight / 2 + thumbHeight / 2;

          thumbnailsRef.current.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedImageIndex]);

  return (
    <div className="image-viewer-container">
      <div className="image-viewer-main-content">
        <img
          src={mainImage}
          alt="Main intraoral"
          className={`image-viewer-main-image ${onMainImageClick ? "clickable" : ""
            }`}
          style={{ cursor: onMainImageClick ? "zoom-in" : "default" }}
          onClick={onMainImageClick}
        />
        <div className="image-viewer-actions">
          {/*
          <button type="button" className="image-viewer-action-button" onClick={onSendPhoto}>
            <i className="mdi mdi-camera-outline"></i>
            Send photo
          </button>
          <button type="button" className="image-viewer-action-button" onClick={onSendVideo}>
            <i className="mdi mdi-video-outline"></i>
            Send video
          </button>
          */}
          <button
            type="button"
            className="image-viewer-action-button"
            onClick={() => {
              // Download the main image
              const link = document.createElement("a");
              link.href = mainImage;
              link.download = "photo.jpg";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <i className="mdi mdi-download"></i>
            Download Photo
          </button>
        </div>
      </div>
      <div
        className="image-viewer-thumbnails"
        ref={thumbnailsRef}
        onWheel={(e) => {
          // Prevent the page from scrolling when using the mouse wheel on thumbnails
          e.stopPropagation();
        }}
      >
        {validImages.length > 0 ? (
          validImages.map((img, idx) => (
            <img
              key={`thumb-${idx}`}
              src={img.src}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => handleThumbnailClick(idx)}
              className={`thumbnail-image ${idx === safeImageIndex ? "active" : ""
                }`}
            />
          ))
        ) : (
          <div className="text-center text-muted py-3">
            <i
              className="mdi mdi-image-off-outline"
              style={{ fontSize: "1.5em" }}
            ></i>
            <p className="mb-0 mt-2">No images available</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ObservationsGoals = ({ obs }) => {
  const observationCategories = [
    { type: "alert", title: "Alert", className: "text-alert" },
    { type: "warning", title: "Warning", className: "text-warning" },
    { type: "silent", title: "Silent", className: "text-silent" }, // Assuming 'text-silent' is a defined CSS class
    { type: "info", title: "Info", className: "" }, // No specific class for info or add one if needed
  ];

  return (
    <div className="observations-goals-container">
      <div className="observations-goals-title-group">
        <h5>Goal(s)</h5>
        {obs.generalGoals && obs.generalGoals.length > 0 ? (
          <ul>
            {obs.generalGoals.map((item, i) => (
              <li key={`goal-${i}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No general goals specified.</p>
        )}
      </div>
      <h5>Observation(s)</h5>
      {observationCategories.map((category) => {
        const items = obs[category.type];
        if (items && items.length > 0) {
          return (
            <div className="observation-category" key={category.type}>
              <strong className={category.className}>{category.title}</strong>
              <ul>
                {items.map((item, i) => (
                  <li key={`${category.type}-item-${i}`}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const IndicesPanel = ({ indices }) => (
  <div className="indices-panel">
    <h6 className="indices-panel-title">Indices</h6>
    <table className="indices-table">
      <tbody>
        <tr>
          <td>Overbite</td>
          <td>{indices.overbite || "-"}</td>
        </tr>
        <tr>
          <td>Overjet</td>
          <td>{indices.overjet || "-"}</td>
        </tr>
        <tr>
          <td>Midline deviation</td>
          <td>{indices.midlineDeviation || "-"}</td>
        </tr>
      </tbody>
    </table>
    <h6 className="indices-panel-title">Occlusions</h6>
    <table className="occlusions-table">
      <thead>
        <tr>
          <th></th>
          <th>Right</th>
          <th>Left</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Molar</td>
          <td>{indices.right?.molar || "-"}</td>
          <td>{indices.left?.molar || "-"}</td>
        </tr>
        <tr>
          <td>Cuspid</td>
          <td>{indices.right?.cuspid || "-"}</td>
          <td>{indices.left?.cuspid || "-"}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// --- MAIN COMPONENT ---

const Monitoring = ({ patient }) => {
  const [sendPhotoModalOpen, setSendPhotoModalOpen] = useState(false);
  const [sendVideoModalOpen, setSendVideoModalOpen] = useState(false);
  const [fullscreenModalOpen, setFullscreenModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  // State for Send Photo Modal
  const [photoQuickReply, setPhotoQuickReply] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoScheduleLater, setPhotoScheduleLater] = useState(false);
  const [photoScheduledDate, setPhotoScheduledDate] = useState("2025-05-27"); // Default or set dynamically
  const [photoScheduledTime, setPhotoScheduledTime] = useState("12:00"); // Default or set dynamically

  const [scansByDate, setScansByDate] = useState({});
  const [scanDates, setScanDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadingScans, setLoadingScans] = useState(false);
  const [scansError, setScansError] = useState(null);
  const [progressData, setProgressData] = useState({
    start_date: "",
    end_date: "",
    progress: 0,
  });
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    // Use the correct patient id for API calls (not public_id)
    const realPatientId = patient?.patient_id || patient?.id;
    if (!realPatientId) return;
    setLoadingScans(true);
    getPatientMonitoringScansAPI(realPatientId)
      .then((res) => {
        if (
          res.status === "success" &&
          res.data &&
          Object.keys(res.data).length > 0
        ) {
          setScansByDate(res.data);
          // Sort dates descending (latest first)
          const dates = Object.keys(res.data).sort(
            (a, b) => new Date(b) - new Date(a)
          );
          setScanDates(dates);
          // Set the latest date as selected by default
          setSelectedDate(dates[0]);
          setSelectedImageIndex(0);
        } else {
          setScansByDate({});
          setScanDates([]);
          setSelectedDate("");
          setSelectedImageIndex(-1); // Use -1 to indicate no image selected
        }
        setLoadingScans(false);
      })
      .catch(() => {
        setScansByDate({});
        setScanDates([]);
        setSelectedDate("");
        setSelectedImageIndex(-1); // Use -1 to indicate no image selected
        setLoadingScans(false);
        setScansError("Failed to load scans");
      });

    // Fetch progress data
    setLoadingProgress(true);
    getPatientProgressAPI(realPatientId)
      .then((res) => {
        if (res.status === "success" && res.data) {
          setProgressData({
            start_date: res.data.start_date || "",
            end_date: res.data.end_date || "",
            progress:
              typeof res.data.progress === "number" ? res.data.progress : 0,
          });
        } else {
          setProgressData({ start_date: "", end_date: "", progress: 0 });
        }
        setLoadingProgress(false);
      })
      .catch(() => {
        setProgressData({ start_date: "", end_date: "", progress: 0 });
        setLoadingProgress(false);
      });
  }, [patient?.patient_id, patient?.id]);

  // Get scans for selected date
  const scansForDate =
    selectedDate && scansByDate[selectedDate] ? scansByDate[selectedDate] : [];
  const mainScan = scansForDate[selectedImageIndex] || null;
  const mainImageUrl =
    mainScan && mainScan.scan_url
      ? mainScan.scan_url.startsWith("http")
        ? mainScan.scan_url
        : config.WEB_APP_URL + mainScan.scan_url
      : "";

  // Ensure first image is selected when scans are loaded
  useEffect(() => {
    if (scansForDate.length > 0 && selectedImageIndex < 0) {
      setSelectedImageIndex(0);
    }
  }, [scansForDate.length, selectedImageIndex]);

  // Handler for thumbnail click
  const handleThumbnailClick = (idx) => setSelectedImageIndex(idx);

  // Handler for download
  const handleDownloadPhoto = () => {
    if (!mainImageUrl) return;
    const link = document.createElement("a");
    link.href = mainImageUrl;
    link.download = "scan.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSendPhotoModal = () => setSendPhotoModalOpen(!sendPhotoModalOpen);
  const toggleSendVideoModal = () => setSendVideoModalOpen(!sendVideoModalOpen);

  const handleSendPhoto = () => {
    // Logic to send photo message
    console.log({
      patient: patient?.name,
      quickReply: photoQuickReply,
      message: photoMessage,
      scheduleLater: photoScheduleLater,
      scheduledDate: photoScheduleLater ? photoScheduledDate : null,
      scheduledTime: photoScheduleLater ? photoScheduledTime : null,
    });
    toggleSendPhotoModal();
    // Reset form fields if needed
    setPhotoQuickReply("");
    setPhotoMessage("");
    setPhotoScheduleLater(false);
  };

  const handleSendVideo = () => {
    // Logic to proceed with video
    console.log(
      "Proceeding to video recording steps for patient:",
      patient?.name
    );
    // This would typically involve more complex logic, perhaps another modal step or redirect.
    toggleSendVideoModal();
  };

  const handleOpenFullscreenModal = () => setFullscreenModalOpen(true);
  const handleCloseFullscreenModal = () => setFullscreenModalOpen(false);
  const handleOpenComparisonModal = () => {
    console.log("Opening comparison modal with data:");
    console.log("scansForDate:", scansForDate);
    console.log("selectedDate:", selectedDate);
    console.log("scansByDate:", scansByDate);
    console.log("mainImageUrl:", mainImageUrl);
    setComparisonModalOpen(true);
  };
  const handleCloseComparisonModal = () => setComparisonModalOpen(false);
  const handleOpenStatsModal = () => setStatsModalOpen(true);
  const handleCloseStatsModal = () => setStatsModalOpen(false);

  // Prepare real data for both sides using actual scan data
  const leftData = {
    patientName: patient?.name || "Patient Left",
    patientId: patient?.public_id || patient?.id || "ID-LEFT",
    timelineProps: {
      timelinePoints: scanDates.map((date) => ({
        alignerIndex: date,
        dataObjectLabel: date,
        tooltip: `Scans from ${date} (${scansByDate[date]?.length || 0} scan${scansByDate[date]?.length !== 1 ? "s" : ""
          })`,
        date: date,
        scanCount: scansByDate[date]?.length || 0,
      })),
      hygienePoints: [],
      height: 120,
    },
    imageViewerProps: {
      images: scanDates.length > 0 ?
        // Get all images from all dates, not just the current selected date
        scanDates.flatMap((date) => {
          const dateScans = scansByDate[date] || [];
          return dateScans
            .map((scan) => {
              if (!scan || !scan.scan_url) return null;
              return {
                src: scan.scan_url.startsWith("http")
                  ? scan.scan_url
                  : config.WEB_APP_URL + scan.scan_url,
                date: date,
                id: scan.id,
                clickable: true,
              };
            })
            .filter(Boolean);
        }) : [],
      selectedDate,
      setSelectedDate,
      selectedImageIndex,
      onSendPhoto: toggleSendPhotoModal,
      onSendVideo: toggleSendVideoModal,
      onMainImageClick: handleOpenFullscreenModal,
    },
    indicesPanelProps: { indices: mockIndices },
    observationsGoalsProps: { obs: mockObservations },
  };

  // Debug logging for comparison data
  console.log("Comparison Data - scansForDate:", scansForDate);
  console.log(
    "Comparison Data - leftData images:",
    leftData.imageViewerProps.images
  );
  console.log("Comparison Data - config.WEB_APP_URL:", config.WEB_APP_URL);
  console.log("Comparison Data - selectedDate:", selectedDate);
  console.log("Comparison Data - scanDates:", scanDates);
  console.log("Comparison Data - scansByDate:", scansByDate);
  const rightData = {
    patientName: patient?.name || "Patient Right",
    patientId: patient?.public_id || patient?.id || "ID-RIGHT",
    timelineProps: {
      timelinePoints: scanDates.map((date) => ({
        alignerIndex: date,
        dataObjectLabel: date,
        tooltip: `Scans from ${date} (${scansByDate[date]?.length || 0} scan${scansByDate[date]?.length !== 1 ? "s" : ""
          })`,
        date: date,
        scanCount: scansByDate[date]?.length || 0,
      })),
      hygienePoints: [],
      height: 120,
    },
    imageViewerProps: {
      images: scanDates.length > 0 ?
        // Get all images from all dates, not just the current selected date
        scanDates.flatMap((date) => {
          const dateScans = scansByDate[date] || [];
          return dateScans
            .map((scan) => {
              if (!scan || !scan.scan_url) return null;
              return {
                src: scan.scan_url.startsWith("http")
                  ? scan.scan_url
                  : config.WEB_APP_URL + scan.scan_url,
                date: date,
                id: scan.id,
                clickable: true,
              };
            })
            .filter(Boolean);
        }) : [],
      selectedDate,
      setSelectedDate,
      selectedImageIndex,
      onSendPhoto: toggleSendPhotoModal,
      onSendVideo: toggleSendVideoModal,
      onMainImageClick: handleOpenFullscreenModal,
    },
    indicesPanelProps: { indices: mockIndices },
    observationsGoalsProps: { obs: mockObservations },
  };

  // Example stats data for the modal
  const statsData = {
    aligners: [
      { label: "GO", color: "#16b77c", percentage: 67 },
      { label: "NO-GO/GO-BACK", color: "#e74c3c", percentage: 33 },
    ],
    debondedAttachments: 2,
    hygiene: [
      { label: "No issues", color: "#16b77c", percentage: 50, scans: 3 },
      {
        label: "At least one issue",
        color: "#e74c3c",
        percentage: 50,
        scans: 3,
      },
    ],
    hygieneConditions: [
      { label: "Slight gingivitis", segments: [{ percentage: 40, scans: 2 }] },
      {
        label: "Buccal dental calculus",
        segments: [{ percentage: 30, scans: 1 }],
      },
      {
        label: "Slight gingivitis still present",
        segments: [{ percentage: 20, scans: 1 }],
      },
      {
        label: "Noticeable gingivitis",
        segments: [{ percentage: 10, scans: 1 }],
      },
      {
        label: "Persistent buccal dental calculus",
        segments: [{ percentage: 5, scans: 1 }],
      },
    ],
    scan: {
      slightUnseat: [
        { label: "Slight unseat", color: "#1da5fe", percentage: 60 },
        { label: "", color: "#e9ecef", percentage: 40 },
      ],
      noticeableUnseat: [
        { label: "Noticeable unseat", color: "#e74c3c", percentage: 30 },
        { label: "", color: "#e9ecef", percentage: 70 },
      ],
    },
    scanCompliance: [
      { label: "On time", color: "#16b77c", percentage: 55, scans: 5 },
      { label: "Late", color: "#e74c3c", percentage: 45, scans: 4 },
    ],
    scanComplianceTimeframes: [
      { label: "On time", segments: [{ percentage: 55, scans: 5 }] },
      { label: "2 days to 1 week", segments: [{ percentage: 20, scans: 2 }] },
      { label: "1-2 weeks", segments: [{ percentage: 10, scans: 1 }] },
      { label: "2-4 weeks", segments: [{ percentage: 10, scans: 1 }] },
      { label: "More than 4 weeks", segments: [{ percentage: 5, scans: 1 }] },
    ],
  };

  return (
    <div className="monitoring-section" style={{ gap: "10px" }}>
      <Card className="monitoring-main-card">
        <CardBody>
          <div className="timeline-section mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Scan Timeline</h6>
              {selectedDate && (
                <small className="text-muted">
                  Selected: {selectedDate} ({scansForDate.length} scan
                  {scansForDate.length !== 1 ? "s" : ""})
                </small>
              )}
            </div>
            {scanDates.length > 0 ? (
              <VisTimeline
                timelinePoints={scanDates.map((date) => ({
                  alignerIndex: date,
                  dataObjectLabel: date,
                  tooltip: `Scans from ${date} (${scansByDate[date]?.length || 0
                    } scan${scansByDate[date]?.length !== 1 ? "s" : ""})`,
                  date: date,
                  scanCount: scansByDate[date]?.length || 0,
                }))}
                hygienePoints={[]}
                height={120}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  console.log("Timeline date changed to:", date);
                  setSelectedDate(date);
                  setSelectedImageIndex(0); // Reset to first image when date changes
                }}
                onCompare={handleOpenComparisonModal}
                onShowStats={handleOpenStatsModal}
                progressPercent={progressData.progress}
                startDate={progressData.start_date}
                endDate={progressData.end_date}
              />
            ) : (
              <div className="text-center text-muted py-4">
              </div>
            )}
          </div>
          <div className="monitoring-scans-section mb-3">
            {loadingScans ? (
              <div className="text-center py-4">
                <span className="spinner-border spinner-border-sm me-2"></span>
                Loading scans...
              </div>
            ) : scanDates.length === 0 ? (
              <div
                className="text-center text-muted py-4"
                style={{ fontSize: "1.1em" }}
              >
                <i
                  className="mdi mdi-image-off-outline"
                  style={{ fontSize: "2em", color: "#ccc" }}
                ></i>
                <br />
                No scans uploaded yet.
              </div>
            ) : (
              <div className="image-viewer-container">
                {mainImageUrl ? (
                  <div className="image-viewer-main-content">
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={mainImageUrl}
                        alt="Main scan"
                        className="image-viewer-main-image"
                        style={{
                          cursor: "zoom-in",
                          maxHeight: 320,
                          maxWidth: 480,
                          borderRadius: 8,
                          boxShadow: "0 2px 8px #0001",
                        }}
                        onClick={handleOpenFullscreenModal}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          pointerEvents: "none",
                        }}
                      >
                        <i className="mdi mdi-magnify-plus"></i> Click to view
                        fullscreen
                      </div>
                    </div>
                    <div className="image-viewer-actions">
                      <button
                        type="button"
                        className="image-viewer-action-button"
                        onClick={handleDownloadPhoto}
                      >
                        <i className="mdi mdi-download"></i>
                        Download Photo
                      </button>
                    </div>
                  </div>
                ) : scansForDate.length > 0 ? (
                  <div className="text-center text-muted py-4">
                    <i
                      className="mdi mdi-image-off-outline"
                      style={{ fontSize: "2em", color: "#ccc" }}
                    ></i>
                    <br />
                    Loading scan image...
                  </div>
                ) : null}
                <div
                  className="image-viewer-thumbnails mt-2"
                  style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    padding: 4,
                  }}
                >
                  {scansForDate.map((scan, idx) => {
                    // Ensure scan and scan_url exist before accessing
                    if (!scan || !scan.scan_url) return null;

                    const thumbUrl = scan.scan_url.startsWith("http")
                      ? scan.scan_url
                      : config.WEB_APP_URL + scan.scan_url;
                    const isActive = idx === selectedImageIndex;
                    return (
                      <img
                        key={scan.id || `scan-${idx}`}
                        src={thumbUrl}
                        alt={`Scan ${idx + 1}`}
                        onClick={() => handleThumbnailClick(idx)}
                        className={`thumbnail-image${isActive ? " active" : ""
                          }`}
                        style={{
                          height: 56,
                          width: 56,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: isActive
                            ? "2px solid #1da5fe"
                            : "1.5px solid #eee",
                          cursor: "pointer",
                          boxShadow: isActive ? "0 0 0 2px #1da5fe33" : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* <div className="monitoring-details-flex">
            <div className="monitoring-observations-wrapper">
              <ObservationsGoals obs={mockObservations} />
            </div>
            <div className="monitoring-indices-wrapper">
              <IndicesPanel indices={mockIndices} />
            </div>
          </div> */}
          <div className="monitoring-details-flex">
            <div className="monitoring-observations-wrapper">
              {/* long but meaning full description text instead of any component */}
              <p>
                Clinical assessment reveals the presence of a slight unseat
                involving the patient's right coxofemoral prosthesis.{" "}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Send Photo Modal */}
      <Modal
        isOpen={sendPhotoModalOpen}
        toggle={toggleSendPhotoModal}
        centered
        size="lg"
      >
        <ModalHeader toggle={toggleSendPhotoModal}>
          Write a message to send to your patient{" "}
          {patient?.name || "[Patient Name]"}
        </ModalHeader>
        <ModalBody className="send-message-modal-body">
          <div className="modal-image-preview-container">
            {mockImages.length > 0 &&
              selectedImageIndex >= 0 &&
              selectedImageIndex < mockImages.length &&
              mockImages[selectedImageIndex] && (
                <img
                  src={mockImages[selectedImageIndex].src}
                  alt="Intraoral preview"
                  className="modal-image-preview"
                />
              )}
            <div>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="modal-annotate-link">
                Annotate picture
              </a>
            </div>
          </div>
          <div className="message-label-container">
            <Label className="form-label-block fw-bold mb-2">
              WRITE YOUR MESSAGE:
            </Label>
            <div className="message-input-area-wrapper">
              <div className="message-toolbar">
                <Input
                  type="select"
                  value={photoQuickReply}
                  onChange={(e) => setPhotoQuickReply(e.target.value)}
                  className="quick-reply-select"
                  bsSize="sm" // Optional: for smaller select
                >
                  {QUICK_REPLIES.map((qr, idx) => (
                    <option key={`qr-${idx}`} value={qr}>
                      {qr ? qr : "Select a quick reply"}
                    </option>
                  ))}
                </Input>
              </div>
              <Input
                type="textarea"
                rows="6"
                value={photoMessage}
                onChange={(e) => setPhotoMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-textarea"
              />
            </div>
          </div>
          <div className="schedule-message-container">
            <FormGroup check className="mb-2">
              <Input type="checkbox" id="send-photo-schedule-later" />
              <Label
                for="send-photo-schedule-later"
                check
                className="checkbox-label-styled"
              >
                Send this message later
              </Label>
            </FormGroup>
            <div className="datetime-input-group">
              <Input type="date" className="date-input-flex" />
              <Input type="time" className="time-input-flex" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleSendPhotoModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSendPhoto}>
            Send
          </Button>
        </ModalFooter>
      </Modal>

      {/* Send Video Modal */}
      <Modal
        isOpen={sendVideoModalOpen}
        toggle={toggleSendVideoModal}
        centered
        size="lg"
      >
        <ModalHeader toggle={toggleSendVideoModal}>
          Send a video message to {patient?.name || "[Patient Name]"}
        </ModalHeader>
        <ModalBody className="send-message-modal-body">
          <div className="video-modal-steps-header">
            <ol className="video-modal-steps-list">
              <li className="video-modal-step-item">Define settings</li>
              <li className="video-modal-step-item">
                Share the screen (select current browser tab)
              </li>
              <li className="video-modal-step-item">Record video (max 2min)</li>
              <li>Preview and send</li>
            </ol>
          </div>
          <div className="d-flex gap-4 mb-3">
            <FormGroup check className="mb-0">
              <Input type="checkbox" id="video-mic" />
              <Label for="video-mic" check className="checkbox-label-styled">
                I have a microphone
              </Label>
            </FormGroup>
            <FormGroup check className="mb-0">
              <Input type="checkbox" id="video-webcam" />
              <Label for="video-webcam" check className="checkbox-label-styled">
                I have a webcam
              </Label>
            </FormGroup>
          </div>
          <div className="warning-box-modal">
            <i className="mdi mdi-alert-circle-outline warning-box-icon"></i>
            <div>
              Your browser will request authorization for <b>screen</b>,{" "}
              <b>microphone</b>, and <b>webcam</b> access. Please accept these
              requests. You can disable access later in your browser settings.
            </div>
          </div>
          <div className="tip-box-modal">
            <i className="mdi mdi-lightbulb-on-outline tip-box-icon"></i>
            <div>
              Tip: Use <b>arrow keys</b> to navigate scans/photos and{" "}
              <b>draw with your mouse</b> for annotations.
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="video-modal-footer">
          <Button color="light" onClick={toggleSendVideoModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSendVideo}>
            Next
          </Button>
        </ModalFooter>
      </Modal>

      {/* Fullscreen Image Modal */}
      <FullscreenImageModal
        isOpen={fullscreenModalOpen}
        toggle={handleCloseFullscreenModal}
        onCompare={handleOpenComparisonModal}
        scansByDate={scansByDate}
        scanDates={scanDates}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedImageIndex={selectedImageIndex}
        onImageIndexChange={setSelectedImageIndex}
      />

      <FullscreenComparisonModal
        isOpen={comparisonModalOpen}
        toggle={handleCloseComparisonModal}
        leftData={leftData}
        rightData={rightData}
      />

      <DetailedStatsModal
        isOpen={statsModalOpen}
        toggle={handleCloseStatsModal}
        statsData={statsData}
      />
    </div>
  );
};

// To use this component, you would import it and pass a patient object:
// import Monitoring from './Monitoring'; // Assuming this file is named Monitoring.js
// <Monitoring patient={{ name: 'Jane Doe' }} />

export { ImageViewer, IndicesPanel, ObservationsGoals };
export default Monitoring;
