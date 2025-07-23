import React from "react";
import { useRoleAccess } from "../../Hooks/RoleHooks";
import RoleBasedRender from "./RoleBasedRender";

/**
 * Example component demonstrating role-based access control usage
 */
const RoleBasedExample = () => {
  const { 
    userRole, 
    canAccessRoute, 
    canAccessFeature, 
    isAdmin, 
    isDoctor, 
    isPatient 
  } = useRoleAccess();

  return (
    <div className="card">
      <div className="card-header">
        <h4>Role-Based Access Control Example</h4>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Current User Role:</strong> {userRole || "Not logged in"}
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5>Route Access Examples</h5>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Dashboard Access
                <span className={`badge ${canAccessRoute('/dashboard') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessRoute('/dashboard') ? 'Allowed' : 'Denied'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Settings Access
                <span className={`badge ${canAccessRoute('/settings') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessRoute('/settings') ? 'Allowed' : 'Denied'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Patients Access
                <span className={`badge ${canAccessRoute('/patients') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessRoute('/patients') ? 'Allowed' : 'Denied'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Doctors Access
                <span className={`badge ${canAccessRoute('/doctors') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessRoute('/doctors') ? 'Allowed' : 'Denied'}
                </span>
              </li>
            </ul>
          </div>

          <div className="col-md-6">
            <h5>Feature Access Examples</h5>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Manage Patients
                <span className={`badge ${canAccessFeature('manage_patients') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessFeature('manage_patients') ? 'Allowed' : 'Denied'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Manage Doctors
                <span className={`badge ${canAccessFeature('manage_doctors') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessFeature('manage_doctors') ? 'Allowed' : 'Denied'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Manage Settings
                <span className={`badge ${canAccessFeature('manage_settings') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessFeature('manage_settings') ? 'Allowed' : 'Denied'}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                View Own Profile
                <span className={`badge ${canAccessFeature('view_own_profile') ? 'bg-success' : 'bg-danger'}`}>
                  {canAccessFeature('view_own_profile') ? 'Allowed' : 'Denied'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h5>Conditional Rendering Examples</h5>
          
          <div className="row">
            <div className="col-md-4">
              <RoleBasedRender feature="manage_patients">
                <div className="alert alert-success">
                  <strong>Patient Management Panel</strong><br/>
                  This content is only visible to users who can manage patients.
                </div>
              </RoleBasedRender>
            </div>

            <div className="col-md-4">
              <RoleBasedRender feature="manage_doctors">
                <div className="alert alert-info">
                  <strong>Doctor Management Panel</strong><br/>
                  This content is only visible to admin users.
                </div>
              </RoleBasedRender>
            </div>

            <div className="col-md-4">
              <RoleBasedRender feature="manage_settings">
                <div className="alert alert-warning">
                  <strong>Settings Panel</strong><br/>
                  This content is only visible to admin users.
                </div>
              </RoleBasedRender>
            </div>
          </div>

          <div className="mt-3">
            <RoleBasedRender role="patient">
              <div className="alert alert-primary">
                <strong>Patient Dashboard</strong><br/>
                This content is only visible to patients.
              </div>
            </RoleBasedRender>
          </div>
        </div>

        <div className="mt-4">
          <h5>Role-Specific Actions</h5>
          <div className="btn-group" role="group">
            {isAdmin() && (
              <button className="btn btn-danger">Admin Action</button>
            )}
            {isDoctor() && (
              <button className="btn btn-warning">Doctor Action</button>
            )}
            {isPatient() && (
              <button className="btn btn-info">Patient Action</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedExample; 