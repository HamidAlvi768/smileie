// Role-based access control configuration
// Defines which routes and features are accessible to each role

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
};

// Route access configuration
export const ROUTE_ACCESS = {
  // Dashboard - accessible to admin only
  '/dashboard': [ROLES.ADMIN],
  
  // Settings - Admin only
  '/settings': [ROLES.ADMIN],
  '/settings/application-settings': [ROLES.ADMIN],
  '/settings/users': [ROLES.ADMIN],
  '/settings/doctors': [ROLES.ADMIN],
  '/settings/patients': [ROLES.ADMIN],
  '/settings/dropdown-settings': [ROLES.ADMIN],
  '/settings/dropdown-settings/:id': [ROLES.ADMIN],
  '/settings/scan-notification-frequency': [ROLES.ADMIN],
  '/settings/sms-templates': [ROLES.ADMIN],
  '/settings/email-templates': [ROLES.ADMIN],
  '/settings/reminders': [ROLES.ADMIN],
  '/settings/photo-upload-reminder': [ROLES.ADMIN],
  '/settings/next-step-reminder': [ROLES.ADMIN],
  '/settings/treatment-plans': [ROLES.ADMIN],
  '/settings/video-tutorials': [ROLES.ADMIN],
  '/settings/faqs': [ROLES.ADMIN],
  '/settings/contact-us': [ROLES.ADMIN],
  '/settings/instructions': [ROLES.ADMIN],
  '/settings/aligner-tips': [ROLES.ADMIN],
  '/settings/impressions-guide': [ROLES.ADMIN],

  // Calendar - Admin and Doctor
  '/calendar': [ROLES.ADMIN, ROLES.DOCTOR],

  // Profile - All roles
  '/userprofile': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  '/my-account': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],

  // Email - Admin and Doctor
  '/inbox': [ROLES.ADMIN, ROLES.DOCTOR],
  '/read-email': [ROLES.ADMIN, ROLES.DOCTOR],
  '/compose-email': [ROLES.ADMIN, ROLES.DOCTOR],

  // Patients - Admin and Doctor
  '/patients': [ROLES.ADMIN, ROLES.DOCTOR],
  '/patients/not-monitored': [ROLES.ADMIN, ROLES.DOCTOR],
  '/patients/guardians': [ROLES.ADMIN, ROLES.DOCTOR],
  '/patients/:id/*': [ROLES.ADMIN, ROLES.DOCTOR],

  // Notifications - Admin and Doctor
  '/notifications/messages': [ROLES.ADMIN, ROLES.DOCTOR],
  '/notifications/clinical-instructions': [ROLES.ADMIN, ROLES.DOCTOR],
  '/notifications/additional-scans': [ROLES.ADMIN, ROLES.DOCTOR],
  '/notifications/app-not-activated': [ROLES.ADMIN, ROLES.DOCTOR],

  // Doctors - Admin only
  '/doctors': [ROLES.ADMIN],

  // Orders - Admin and Doctor
  '/orders': [ROLES.ADMIN, ROLES.DOCTOR],
  '/orders/detail': [ROLES.ADMIN, ROLES.DOCTOR],

  // Todo - Admin and Doctor
  '/todo/monitored': [ROLES.ADMIN, ROLES.DOCTOR],
  '/todo/not-monitored': [ROLES.ADMIN, ROLES.DOCTOR],
  '/todo/guardians': [ROLES.ADMIN, ROLES.DOCTOR],
  '/todo-list': [ROLES.ADMIN, ROLES.DOCTOR],

  // Quick Replies - Admin and Doctor
  '/quick-replies': [ROLES.ADMIN, ROLES.DOCTOR],

  // Utility Pages - Admin only
  '/pages-starter': [ROLES.ADMIN],
  '/pages-timeline': [ROLES.ADMIN],
  '/pages-faqs': [ROLES.ADMIN],
  '/pages-pricing': [ROLES.ADMIN],

  // UI Elements - Admin only
  '/ui-alerts': [ROLES.ADMIN],
  '/ui-badge': [ROLES.ADMIN],
  '/ui-breadcrumb': [ROLES.ADMIN],
  '/ui-buttons': [ROLES.ADMIN],
  '/ui-cards': [ROLES.ADMIN],
  '/ui-carousel': [ROLES.ADMIN],
  '/ui-dropdowns': [ROLES.ADMIN],
  '/ui-grid': [ROLES.ADMIN],
  '/ui-images': [ROLES.ADMIN],
  '/ui-lightbox': [ROLES.ADMIN],
  '/ui-modals': [ROLES.ADMIN],
  '/ui-offcanvas': [ROLES.ADMIN],
  '/ui-rangeslider': [ROLES.ADMIN],
  '/ui-sessiontimeout': [ROLES.ADMIN],
  '/ui-pagination': [ROLES.ADMIN],
  '/ui-progressbars': [ROLES.ADMIN],
  '/ui-placeholders': [ROLES.ADMIN],
  '/ui-tabs-accordions': [ROLES.ADMIN],
  '/ui-typography': [ROLES.ADMIN],
  '/ui-toasts': [ROLES.ADMIN],
  '/ui-video': [ROLES.ADMIN],
  '/ui-popovers': [ROLES.ADMIN],
  '/ui-rating': [ROLES.ADMIN],

  // Forms - Admin only
  '/form-elements': [ROLES.ADMIN],
  '/form-validation': [ROLES.ADMIN],
  '/form-advanced': [ROLES.ADMIN],
  '/form-editor': [ROLES.ADMIN],
  '/form-uploads': [ROLES.ADMIN],
  '/form-wizard': [ROLES.ADMIN],
  '/form-mask': [ROLES.ADMIN],

  // Tables - Admin only
  '/tables-basic': [ROLES.ADMIN],
  '/tables-listjs': [ROLES.ADMIN],
  '/table-datatables': [ROLES.ADMIN],

  // Charts - Admin only
  '/chart-apexcharts': [ROLES.ADMIN],
  '/chart-chartjscharts': [ROLES.ADMIN],
  '/chart-floatcharts': [ROLES.ADMIN],
  '/chart-jknobcharts': [ROLES.ADMIN],
  '/chart-sparklinecharts': [ROLES.ADMIN],

  // Icons - Admin only
  '/icon-boxicon': [ROLES.ADMIN],
  '/icons-materialdesign': [ROLES.ADMIN],
  '/icons-fontawesome': [ROLES.ADMIN],
  '/icon-dripicons': [ROLES.ADMIN],

  // Maps - Admin only
  '/maps-vector': [ROLES.ADMIN],
  '/maps-google': [ROLES.ADMIN],
};

// Feature access configuration
export const FEATURE_ACCESS = {
  // Patient management
  'manage_patients': [ROLES.ADMIN, ROLES.DOCTOR],
  'view_patients': [ROLES.ADMIN, ROLES.DOCTOR],
  'create_patients': [ROLES.ADMIN],
  'edit_patients': [ROLES.ADMIN],
  'delete_patients': [ROLES.ADMIN],

  // Doctor management
  'manage_doctors': [ROLES.ADMIN],
  'view_doctors': [ROLES.ADMIN],
  'create_doctors': [ROLES.ADMIN],
  'edit_doctors': [ROLES.ADMIN],
  'delete_doctors': [ROLES.ADMIN],

  // Settings management
  'manage_settings': [ROLES.ADMIN],
  'view_settings': [ROLES.ADMIN],

  // Notifications
  'manage_notifications': [ROLES.ADMIN, ROLES.DOCTOR],
  'view_notifications': [ROLES.ADMIN, ROLES.DOCTOR],

  // Orders
  'manage_orders': [ROLES.ADMIN, ROLES.DOCTOR],
  'view_orders': [ROLES.ADMIN, ROLES.DOCTOR],

  // Calendar
  'manage_calendar': [ROLES.ADMIN, ROLES.DOCTOR],
  'view_calendar': [ROLES.ADMIN, ROLES.DOCTOR],

  // Patient specific features
  'view_own_profile': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  'edit_own_profile': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
};

// Helper functions
export const hasRouteAccess = (route, userRole) => {
  console.log('hasRouteAccess - route:', route, 'userRole:', userRole);
  const allowedRoles = ROUTE_ACCESS[route];
  console.log('hasRouteAccess - allowedRoles:', allowedRoles);
  if (!allowedRoles) {
    // If route is not defined, deny access by default
    console.log('hasRouteAccess - route not found, denying access');
    return false;
  }
  const hasAccess = allowedRoles.includes(userRole);
  console.log('hasRouteAccess - hasAccess:', hasAccess);
  return hasAccess;
};

export const hasFeatureAccess = (feature, userRole) => {
  const allowedRoles = FEATURE_ACCESS[feature];
  if (!allowedRoles) {
    // If feature is not defined, deny access by default
    return false;
  }
  return allowedRoles.includes(userRole);
};

export const getAccessibleRoutes = (userRole) => {
  return Object.keys(ROUTE_ACCESS).filter(route => 
    ROUTE_ACCESS[route].includes(userRole)
  );
};

export const getAccessibleFeatures = (userRole) => {
  return Object.keys(FEATURE_ACCESS).filter(feature => 
    FEATURE_ACCESS[feature].includes(userRole)
  );
}; 