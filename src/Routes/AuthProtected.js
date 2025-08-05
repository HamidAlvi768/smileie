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

  // If still loading, show shimmer loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="shimmer-card" style={{ width: "400px", height: "300px" }}>
          <div className="shimmer-header">
            <div className="shimmer-avatar"></div>
            <div className="shimmer-content">
              <div className="shimmer-line" style={{ width: '70%' }}></div>
              <div className="shimmer-line" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="shimmer-body">
            <div className="shimmer-line" style={{ width: '90%' }}></div>
            <div className="shimmer-line" style={{ width: '80%' }}></div>
            <div className="shimmer-line" style={{ width: '75%' }}></div>
            <div className="shimmer-line" style={{ width: '85%' }}></div>
          </div>
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
