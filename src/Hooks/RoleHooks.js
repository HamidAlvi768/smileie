import { useProfile } from "./UserHooks";
import { hasFeatureAccess, hasRouteAccess, getAccessibleRoutes, getAccessibleFeatures } from "../config/roleAccess";

export const useRoleAccess = () => {
  const { userProfile } = useProfile();
  
  const userRole = userProfile?.role;

  const canAccessRoute = (route) => {
    if (!userRole) return false;
    return hasRouteAccess(route, userRole);
  };

  const canAccessFeature = (feature) => {
    if (!userRole) return false;
    return hasFeatureAccess(feature, userRole);
  };

  const getAccessibleRoutesForUser = () => {
    if (!userRole) return [];
    return getAccessibleRoutes(userRole);
  };

  const getAccessibleFeaturesForUser = () => {
    if (!userRole) return [];
    return getAccessibleFeatures(userRole);
  };

  const isAdmin = () => userRole === 'admin';
  const isDoctor = () => userRole === 'doctor';
  const isPatient = () => userRole === 'patient';

  return {
    userRole,
    canAccessRoute,
    canAccessFeature,
    getAccessibleRoutesForUser,
    getAccessibleFeaturesForUser,
    isAdmin,
    isDoctor,
    isPatient,
  };
}; 