import React from "react";
import { useRoleAccess } from "../../Hooks/RoleHooks";
import RoleBasedRender from "./RoleBasedRender";

/**
 * Component that renders patient action buttons based on user role
 * @param {Object} props
 * @param {Function} props.onCreate - Function to call when create button is clicked
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Object} props.patient - Patient data for edit/delete operations
 * @param {string} props.createButtonText - Text for create button (default: "Add Patient")
 * @param {string} props.editButtonText - Text for edit button (default: "Edit")
 * @param {string} props.deleteButtonText - Text for delete button (default: "Delete")
 */
const PatientActionButtons = ({
  onCreate,
  onEdit,
  onDelete,
  patient,
  createButtonText = "Add Patient",
  editButtonText = "Edit",
  deleteButtonText = "Delete"
}) => {
  const { canAccessFeature } = useRoleAccess();

  return (
    <div className="d-flex gap-2">
      {/* Create Patient Button - Admin only */}
      <RoleBasedRender feature="create_patients">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onCreate}
        >
          <i className="mdi mdi-plus me-1"></i>
          {createButtonText}
        </button>
      </RoleBasedRender>

      {/* Edit Patient Button - Admin only */}
      {patient && (
        <RoleBasedRender feature="edit_patients">
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => onEdit(patient)}
          >
            <i className="mdi mdi-pencil me-1"></i>
            {editButtonText}
          </button>
        </RoleBasedRender>
      )}

      {/* Delete Patient Button - Admin only */}
      {patient && (
        <RoleBasedRender feature="delete_patients">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete(patient)}
          >
            <i className="mdi mdi-delete me-1"></i>
            {deleteButtonText}
          </button>
        </RoleBasedRender>
      )}
    </div>
  );
};

export default PatientActionButtons; 