import React, { useState } from "react";
import PatientActionButtons from "./PatientActionButtons";
import { useRoleAccess } from "../../Hooks/RoleHooks";

/**
 * Example component showing how to use PatientActionButtons
 */
const PatientListExample = () => {
  const { userRole, canAccessFeature } = useRoleAccess();
  const [patients] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const handleCreatePatient = () => {
    console.log("Create patient clicked");
    // Add your create patient logic here
  };

  const handleEditPatient = (patient) => {
    console.log("Edit patient clicked:", patient);
    // Add your edit patient logic here
  };

  const handleDeletePatient = (patient) => {
    console.log("Delete patient clicked:", patient);
    // Add your delete patient logic here
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>Patients List</h4>
        <PatientActionButtons
          onCreate={handleCreatePatient}
          createButtonText="Add New Patient"
        />
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Current User Role:</strong> {userRole}
          <br />
          <strong>Can Create Patients:</strong> {canAccessFeature('create_patients') ? 'Yes' : 'No'}
          <br />
          <strong>Can Edit Patients:</strong> {canAccessFeature('edit_patients') ? 'Yes' : 'No'}
          <br />
          <strong>Can Delete Patients:</strong> {canAccessFeature('delete_patients') ? 'Yes' : 'No'}
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>
                    <PatientActionButtons
                      onEdit={handleEditPatient}
                      onDelete={handleDeletePatient}
                      patient={patient}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientListExample; 