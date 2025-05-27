import React from "react";
import { Table, Button } from "reactstrap";

const PATIENT_PROFILE_ID = "A78B-58F2-W";

const TableRow = ({ label, children }) => (
  <tr>
    <th>{label}</th>
    <td>{children}</td>
  </tr>
);

const ActionButton = ({ actionName, iconClass, children, data }) => (
  <Button
    size="sm"
    color="light"
    data-action_name={actionName}
    {...data}
  >
    <i className={`icon ${iconClass} me-1`} />
    {children}
  </Button>
);

const ActionLink = ({ actionName, children, includePatientId, data = {} }) => {
  const dataAttributes = {
    "data-action_name": actionName,
    ...(includePatientId && { "data-patient_profile_id": PATIENT_PROFILE_ID }),
    ...data,
  };

  return <a href="#" {...dataAttributes}>{children}</a>;
};

const MonitoringTable = () => {
  return (
    <Table bordered>
      <tbody>
        <TableRow label="Plan:">
          Photo Monitoring Full
          <br />
          <ActionLink actionName="convert_patient_protocol_and_monitoring" includePatientId>
            Change monitoring plan
          </ActionLink>
        </TableRow>

        <TableRow label="Started:">
          Feb 25, 2025, 3:59:27 PM GMT+5
          <div className="mt-2 d-flex gap-2">
            <ActionButton
              actionName="pause_monitoring"
              iconClass="icon_icn-pause-circle"
              data={{ "data-patient_profile_id": PATIENT_PROFILE_ID }}
            >
              Pause
            </ActionButton>
            <ActionButton
              actionName="stop_monitoring"
              iconClass="icon_icn-stop-circle"
              data={{ "data-monitoring_id": "1217933" }}
            >
              Stop
            </ActionButton>
          </div>
        </TableRow>

        <TableRow label="Patient app:">
          Activated
        </TableRow>

        <TableRow label="ScanBox:">
          <ActionLink actionName="set_patient_scanbox" includePatientId>
            Add a ScanBox
          </ActionLink>
        </TableRow>

        <TableRow label="Next scan:">
          May 9, 2025
        </TableRow>

        <TableRow label="Frequency:">
          <div>
            Every 2 weeks{" "}
            <span className="text-nowrap">(3 day(s) NO-GO)</span>
          </div>
          <ActionLink actionName="set_monitoring_interval" includePatientId>
            Change
          </ActionLink>
          <div className="mt-2">
            Adaptive: <strong>Off</strong>
          </div>
          <ActionLink actionName="set_dynamic_scan_interval" includePatientId>
            Change
          </ActionLink>
        </TableRow>

        <TableRow label="Upper/Lower:">
          Orthodontic treatment - Aligner - Other
        </TableRow>

        <TableRow label="Aligner #:">
          <strong>#12</strong> of 21
          <br />
          <ActionLink actionName="set_patient_aligner_index" includePatientId>
            Edit aligner number
          </ActionLink>
        </TableRow>

        <TableRow label="Excluded teeth:">
          Not set
          <br />
          <ActionLink
            actionName="edit_protocol_notification_settings"
            data={{
              "data-owner_type": "patient",
              "data-owner_id": "1421345"
            }}
          >
            Edit excluded teeth
          </ActionLink>
        </TableRow>
      </tbody>
    </Table>
  );
};

export default MonitoringTable;