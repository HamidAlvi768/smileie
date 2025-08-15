import React from "react";
import { Navigate } from "react-router-dom";

import { useProfile } from "../Hooks/UserHooks";
import { hasRouteAccess } from "../config/roleAccess";
import ShimmerLoader from "../components/Common/ShimmerLoader";

const AuthProtected = ({ children, route, location }) => {
  const { userProfile, loading } = useProfile();
  
  console.log('AuthProtected - userProfile:', userProfile, 'loading:', loading, 'route:', route);

  /*
    redirect is un-auth access protected routes via url
    */

  // If still loading, show shimmer loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <ShimmerLoader type="card" lines={4} />
      </div>
    );
  }

  // If no user profile after loading, redirect to login
  if (!userProfile) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: location } }} />
    );
  }

  // Check role-based access if route is provided
  if (route && userProfile) {
    const userRole = userProfile.role;
    if (!hasRouteAccess(route, userRole)) {
      // Redirect based on user role
      if (userRole === 'doctor') {
        return <Navigate to="/patients" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
};

export default AuthProtected;
