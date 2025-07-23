import React from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../../Hooks/UserHooks";
import { hasRouteAccess } from "../../config/roleAccess";

const RoleProtected = ({ children, route }) => {
  const { userProfile, loading } = useProfile();

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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