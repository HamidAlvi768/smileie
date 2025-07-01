import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

// Sub-component for individual day items
const DayItem = ({ day, date, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="day-item">
      <div className="day-item-header">
        <input
          type="checkbox"
          defaultChecked={true}
          className="item-checkbox"
        />
        <div
          className="day-item-title"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{`${day} day(s) (${date})`}</span>
          <small>Event calculated from the monitoring start date</small>
        </div>
        <button
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
      </div>
      {isExpanded && (
        <div className="day-item-content">
          <div className="parameters-section">
            <h5>Parameters</h5>
            <div className="priority-options">
              <span>Priority:</span>
              <label>
                <input
                  type="radio"
                  name={`priority-${day}`}
                  value="Silent"
                  defaultChecked={false}
                />{" "}
                Silent
              </label>
              <label>
                <input
                  type="radio"
                  name={`priority-${day}`}
                  value="Info"
                  defaultChecked={true}
                />{" "}
                Info
              </label>
              <label>
                <input
                  type="radio"
                  name={`priority-${day}`}
                  value="Warning"
                  defaultChecked={false}
                />{" "}
                Warning
              </label>
              <label>
                <input
                  type="radio"
                  name={`priority-${day}`}
                  value="Alert"
                  defaultChecked={false}
                />{" "}
                Alert
              </label>
            </div>
            <div className="trigger-section">
              <label htmlFor={`trigger-${day}`}>Trigger:</label>
              <input type="number" id={`trigger-${day}`} defaultValue={day} />
              <span>day(s) after monitoring start date</span>
            </div>
          </div>
          <div
            className="instructions-section"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <label
              htmlFor={`team-instructions-${day}`}
              style={{ marginBottom: 0 }}
            >
              Team Instructions
            </label>
            <div
              className="instructions-section-form"
              style={{ display: "flex", gap: 4 }}
            >
              <select
                id={`team-instructions-${day}`}
                style={{
                  flex: 1,
                  marginBottom: 0,
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "#fff",
                }}
                defaultValue="Check all patient personal messages and goals are set-up. Add birthday, events, IPR etc."
              >
                <option>
                  Check all patient personal messages and goals are set-up. Add
                  birthday, events, IPR etc.
                </option>
                <option>Send reminder to patient</option>
                <option>Review aligner fit</option>
                <option>Schedule follow-up</option>
              </select>
              <button
                className="delete-button"
                style={{ marginLeft: 8, marginBottom: 0 }}
              >
                Delete
              </button>
            </div>

            <div
              className="instructions-section-form"
              style={{ display: "flex", gap: 4 }}
            >
              <select
                style={{
                  flex: "0.93 1 0%",
                  marginBottom: 0,
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "#fff",
                }}
                defaultValue="Add instruction for team"
              >
                <option disabled>Add instruction for team</option>
                <option>Send welcome message</option>
                <option>Request new photos</option>
                <option>Contact support</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for collapsible sections
const CollapsibleSection = ({
  title,
  description,
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Prevent toggle when clicking the checkbox
  const handleHeaderClick = (e) => {
    if (e.target.type === "checkbox") return;
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`collapsible-section ${isExpanded ? "expanded" : ""}`}>
      <div
        className="section-header"
        onClick={handleHeaderClick}
        style={{ cursor: "pointer" }}
      >
        <input
          type="checkbox"
          defaultChecked={true}
          onClick={(e) => e.stopPropagation()}
        />
        <div style={{ flexGrow: 1 }}>
          <h5>{title}</h5>
          {description && (
            <div className="section-description">{description}</div>
          )}
        </div>
        <button
          className="expand-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
        >
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
      </div>
      {isExpanded && <div className="section-content">{children}</div>}
    </div>
  );
};

const defaultProtocolDescription = `Monitoring and notification of all aspects of aligner treatment.\n- Monitoring every X days\n- GO/NO-GO\n- Detection of loss of attachments, buttons, etc.`;

const Protocol = () => {
  const [description, setDescription] = useState(defaultProtocolDescription);
  const daysData = [
    { day: 2, date: "20/12/2024", expanded: false },
    { day: 5, date: "23/12/2024" },
    { day: 10, date: "28/12/2024" },
    { day: 15, date: "02/01/2025" },
    { day: 45, date: "01/02/2025" },
    { day: 60, date: "18/03/2025" },
    { day: 90, date: "18/03/2025" },
    { day: 180, date: "16/06/2025" },
    { day: 225, date: "31/07/2025" },
    { day: 270, date: "14/09/2025" },
    { day: 315, date: "29/10/2025" },
    { day: 360, date: "13/12/2025" },
  ];

  return (
    <div className="protocol-container">
      {/* Protocol Header */}
      <div className="protocol-header">
        <div className="protocol-title">
          <h3>Protocol for Paula Barr</h3>
          <small>
            Originally created from "Aligner protocol" - Last update: 2024/12/18
            18:23 GMT+5
          </small>
          <small>The protocol follows the patient's workflow - #R</small>
        </div>
        <div className="protocol-actions">
          <button className="change-notice-button">Change notice</button>
          <button className="save-button btn btn-primary">Save</button>
        </div>
      </div>

      {/* Owner: Dr Mark Kruchar */}
      <div className="owner-section" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, marginBottom: 10, color: "#607080" }}>
        <h5 style={{ color: "#607080" }}>Owner:</h5>
        <div className="owner-section-content">
          <h6 style={{ marginBottom: 3, textAlign: "center", alignSelf: "center" , color: "#607080"}}>Dr Mark Kruchar</h6>
        </div>
      </div>

      {/* Protocol Description and Objective */}
      <div className="protocol-description-section">
        <h4>Protocol description and objective</h4>
        <div className="protocol-description-box">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="protocol-description-textarea"
          />
        </div>
      </div>

      {/* Notification Settings Section */}
      <div className="main-section">
        <h4>Notification settings</h4>
      </div>
      <div className="notification-settings">
        <CollapsibleSection
          title="Timeframe"
          description="Messages triggered following a certain timeframe in the patient's monitoring journey."
          defaultExpanded={false}
        >
          <CollapsibleSection
            title="Days since monitoring"
            description="Set messages for a patient a certain number of days after the patient's monitoring start date."
            defaultExpanded={false}
          >
            {daysData.map((item) => (
              <DayItem
                key={item.day}
                day={item.day}
                date={item.date}
                defaultExpanded={item.expanded}
              />
            ))}
            <button className="add-new-date-button">
              # day(s) Add a new date
            </button>
          </CollapsibleSection>
        </CollapsibleSection>
      </div>

      {/* Other Sections */}
      <CollapsibleSection title="Goals">
        <textarea placeholder="Track precise milestones in your patient's treatment including: Antero-posterior, transverse and vertical connections."></textarea>
      </CollapsibleSection>
      <CollapsibleSection title="Orthodontic parameters - Aligners">
        <textarea placeholder="Track aligner changes (e.g., starting appliance, aligner damage, aligners remaining, aligner number, rescans)"></textarea>
      </CollapsibleSection>
      <CollapsibleSection title="Oral health assessment">
        <textarea placeholder="Check for bleeding, soft tissue statement, spots and cavities, dental statement."></textarea>
      </CollapsibleSection>
      <CollapsibleSection title="Intraoral evaluation">
        <textarea placeholder="Tooth position, occlusion"></textarea>
      </CollapsibleSection>
    </div>
  );
};

export default Protocol;
