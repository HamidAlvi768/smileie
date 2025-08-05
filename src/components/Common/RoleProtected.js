import React from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../../Hooks/UserHooks";
import { hasRouteAccess } from "../../config/roleAccess";

const RoleProtected = ({ children, route }) => {
  const { userProfile, loading } = useProfile();

  // If still loading, show shimmer loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="shimmer-card" style={{ width: "350px", height: "250px" }}>
          <div className="shimmer-header">
            <div className="shimmer-avatar"></div>
            <div className="shimmer-content">
              <div className="shimmer-line" style={{ width: '60%' }}></div>
              <div className="shimmer-line" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div className="shimmer-body">
            <div className="shimmer-line" style={{ width: '85%' }}></div>
            <div className="shimmer-line" style={{ width: '70%' }}></div>
            <div className="shimmer-line" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // If no user profile, redirect to login
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to this route
  const userRole = userProfile.role;
  if (!hasRouteAccess(route, userRole)) {
    // Redirect to dashboard if user doesn't have access
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleProtected; 