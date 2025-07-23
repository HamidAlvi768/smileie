import React from "react";
import { useProfile } from "../../Hooks/UserHooks";
import { useRoleAccess } from "../../Hooks/RoleHooks";

/**
 * Debug component to troubleshoot authentication issues
 */
const AuthDebug = () => {
  const { userProfile, loading } = useProfile();
  const { userRole } = useRoleAccess();

  // Get localStorage data directly
  const localStorageUser = localStorage.getItem("authUser");
  const parsedLocalStorageUser = localStorageUser ? JSON.parse(localStorageUser) : null;

  return (
    <div className="card">
      <div className="card-header">
        <h4>Authentication Debug</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h5>useProfile Hook</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Loading:</strong> {loading ? 'true' : 'false'}
              </li>
              <li className="list-group-item">
                <strong>User Profile:</strong> {userProfile ? 'Present' : 'null'}
              </li>
              {userProfile && (
                <li className="list-group-item">
                  <strong>User Data:</strong>
                  <pre style={{ fontSize: '12px', marginTop: '10px' }}>
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </li>
              )}
            </ul>
          </div>

          <div className="col-md-6">
            <h5>useRoleAccess Hook</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>User Role:</strong> {userRole || 'null'}
              </li>
            </ul>

            <h5 className="mt-3">LocalStorage</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Raw localStorage:</strong> {localStorageUser || 'null'}
              </li>
              <li className="list-group-item">
                <strong>Parsed localStorage:</strong> {parsedLocalStorageUser ? 'Present' : 'null'}
              </li>
              {parsedLocalStorageUser && (
                <li className="list-group-item">
                  <strong>Parsed Data:</strong>
                  <pre style={{ fontSize: '12px', marginTop: '10px' }}>
                    {JSON.stringify(parsedLocalStorageUser, null, 2)}
                  </pre>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-3">
          <h5>Route Access Test</h5>
          <div className="row">
            <div className="col-md-4">
              <strong>Dashboard:</strong> {userRole === 'admin' ? 'Should be accessible' : 'Not accessible (admin only)'}
            </div>
            <div className="col-md-4">
              <strong>Patients:</strong> {userRole === 'admin' || userRole === 'doctor' ? 'Should be accessible' : 'Not accessible'}
            </div>
            <div className="col-md-4">
              <strong>Settings:</strong> {userRole === 'admin' ? 'Should be accessible' : 'Not accessible'}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h5>Patient Management Permissions</h5>
          <div className="row">
            <div className="col-md-3">
              <strong>View Patients:</strong> {userRole === 'admin' || userRole === 'doctor' ? 'Yes' : 'No'}
            </div>
            <div className="col-md-3">
              <strong>Create Patients:</strong> {userRole === 'admin' ? 'Yes' : 'No (admin only)'}
            </div>
            <div className="col-md-3">
              <strong>Edit Patients:</strong> {userRole === 'admin' ? 'Yes' : 'No (admin only)'}
            </div>
            <div className="col-md-3">
              <strong>Delete Patients:</strong> {userRole === 'admin' ? 'Yes' : 'No (admin only)'}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <button 
            className="btn btn-primary me-2"
            onClick={() => {
              console.log('Current localStorage:', localStorage.getItem("authUser"));
              console.log('Current userProfile:', userProfile);
              console.log('Current userRole:', userRole);
            }}
          >
            Log to Console
          </button>
          
          <button 
            className="btn btn-warning me-2"
            onClick={() => {
              localStorage.removeItem("authUser");
              window.location.reload();
            }}
          >
            Clear localStorage & Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug; 