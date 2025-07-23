import React from "react";
import { useRoleAccess } from "../../Hooks/RoleHooks";

/**
 * Component that conditionally renders content based on user role
 * @param {Object} props
 * @param {string} props.feature - Feature to check access for
 * @param {string} props.route - Route to check access for
 * @param {React.ReactNode} props.children - Content to render if user has access
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have access (optional)
 * @param {string} props.role - Specific role to check (optional, defaults to user's role)
 */
const RoleBasedRender = ({ 
  feature, 
  route, 
  children, 
  fallback = null, 
  role = null 
}) => {
  const { userRole, canAccessFeature, canAccessRoute } = useRoleAccess();
  
  const checkRole = role || userRole;
  
  let hasAccess = false;
  
  if (feature) {
    hasAccess = canAccessFeature(feature);
  } else if (route) {
    hasAccess = canAccessRoute(route);
  } else if (role) {
    hasAccess = userRole === role;
  }
  
  return hasAccess ? children : fallback;
};

export default RoleBasedRender; 