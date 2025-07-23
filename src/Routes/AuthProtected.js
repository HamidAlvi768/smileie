import React from "react";
import { Navigate, Route } from "react-router-dom";

import { useProfile } from "../Hooks/UserHooks";
import { hasRouteAccess } from "../config/roleAccess";

const AuthProtected = (props) => {
  const { userProfile, loading } = useProfile();
  
  console.log('AuthProtected - userProfile:', userProfile, 'loading:', loading, 'route:', props.route);

  /*
    redirect is un-auth access protected routes via url
    */

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

  // If no user profile after loading, redirect to login
  if (!userProfile) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  // Check role-based access if route is provided
  if (props.route && userProfile) {
    const userRole = userProfile.role;
    if (!hasRouteAccess(props.route, userRole)) {
      // Redirect based on user role
      if (userRole === 'doctor') {
        return <Navigate to="/patients" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
