# Role-Based Access Control (RBAC) System

This document describes the role-based access control system implemented in the Smileie application.

## Overview

The RBAC system controls access to routes, features, and API endpoints based on user roles. There are three roles defined:

- **admin**: Full access to all features
- **doctor**: Access to patient management, notifications, and limited settings
- **patient**: Access to own profile and dashboard only

## Configuration Files

### 1. Role Access Configuration (`src/config/roleAccess.js`)

This file defines:
- Available roles (`ROLES`)
- Route access permissions (`ROUTE_ACCESS`)
- Feature access permissions (`FEATURE_ACCESS`)
- Helper functions for checking access

#### Route Access Configuration

Routes are mapped to arrays of allowed roles:

```javascript
export const ROUTE_ACCESS = {
  '/dashboard': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  '/settings': [ROLES.ADMIN],
  '/patients': [ROLES.ADMIN, ROLES.DOCTOR],
  // ... more routes
};
```

#### Feature Access Configuration

Features are mapped to arrays of allowed roles:

```javascript
export const FEATURE_ACCESS = {
  'manage_patients': [ROLES.ADMIN, ROLES.DOCTOR],
  'manage_doctors': [ROLES.ADMIN],
  'view_own_profile': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
  // ... more features
};
```

### 2. Helper Functions

- `hasRouteAccess(route, userRole)`: Check if a role can access a route
- `hasFeatureAccess(feature, userRole)`: Check if a role can access a feature
- `getAccessibleRoutes(userRole)`: Get all accessible routes for a role
- `getAccessibleFeatures(userRole)`: Get all accessible features for a role

## Components

### 1. RoleProtected Component (`src/components/Common/RoleProtected.js`)

Protects routes based on user role. Redirects to dashboard if access is denied.

```javascript
import RoleProtected from '../components/Common/RoleProtected';

<RoleProtected route="/settings">
  <SettingsComponent />
</RoleProtected>
```

### 2. RoleBasedRender Component (`src/components/Common/RoleBasedRender.js`)

Conditionally renders content based on role access.

```javascript
import RoleBasedRender from '../components/Common/RoleBasedRender';

<RoleBasedRender feature="manage_doctors">
  <DoctorManagementComponent />
</RoleBasedRender>

<RoleBasedRender route="/settings">
  <SettingsLink />
</RoleBasedRender>
```

## Hooks

### useRoleAccess Hook (`src/Hooks/RoleHooks.js`)

Provides easy access to role checking functions:

```javascript
import { useRoleAccess } from '../Hooks/RoleHooks';

const { 
  userRole, 
  canAccessRoute, 
  canAccessFeature, 
  isAdmin, 
  isDoctor, 
  isPatient 
} = useRoleAccess();
```

## API Integration

### Automatic Role Headers

All API requests automatically include:
- `X-User-Role` header with the user's role
- `role` query parameter in the URL

### Modified API Helper (`src/helpers/api_helper.js`)

The API helper has been updated to:
- Include user role in all requests
- Add role headers automatically
- Include role parameters in URL

## Route Protection

### Automatic Route Protection

All protected routes are automatically checked for role access in `AuthProtected` component.

### Manual Route Protection

You can manually protect routes:

```javascript
import { hasRouteAccess } from '../config/roleAccess';

if (!hasRouteAccess('/settings', userRole)) {
  // Redirect or show error
}
```

## Navigation Filtering

### Role-Based Navigation (`src/utils/roleNavigation.js`)

Navigation items are automatically filtered based on user role:

```javascript
import { getRoleBasedNavigation } from '../utils/roleNavigation';

const { headerMenuItems, headerRightMenuItems } = getRoleBasedNavigation(userRole);
```

## Usage Examples

### 1. Protecting a Route

```javascript
// In routes.js
{ path: "/settings", component: <Settings /> }

// Automatically protected by AuthProtected component
```

### 2. Conditional Rendering

```javascript
import RoleBasedRender from '../components/Common/RoleBasedRender';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <RoleBasedRender feature="manage_patients">
        <PatientList />
      </RoleBasedRender>
      
      <RoleBasedRender feature="manage_doctors">
        <DoctorList />
      </RoleBasedRender>
      
      <RoleBasedRender role="admin">
        <AdminPanel />
      </RoleBasedRender>
    </div>
  );
}
```

### 3. API Calls

```javascript
// Role is automatically included in all API calls
import { getPatientsAPI } from '../helpers/api_helper';

// This will include role in the request
const patients = await getPatientsAPI();
```

### 4. Navigation Items

```javascript
import { useRoleAccess } from '../Hooks/RoleHooks';

function Header() {
  const { userRole } = useRoleAccess();
  const { headerMenuItems } = getRoleBasedNavigation(userRole);
  
  return (
    <nav>
      {headerMenuItems.map(item => (
        <NavItem key={item.id} {...item} />
      ))}
    </nav>
  );
}
```

## Adding New Routes

1. Add the route to `ROUTE_ACCESS` in `src/config/roleAccess.js`
2. Add the route to `authProtectedRoutes` in `src/Routes/routes.js`
3. The route will be automatically protected

## Adding New Features

1. Add the feature to `FEATURE_ACCESS` in `src/config/roleAccess.js`
2. Use `RoleBasedRender` component or `useRoleAccess` hook to check access

## Backend Integration

The backend should:
1. Read the `X-User-Role` header or `role` query parameter
2. Validate user permissions based on role
3. Return appropriate data or error responses

## Security Considerations

1. **Frontend-only protection is not secure**: Always validate permissions on the backend
2. **Role validation**: Backend should verify that the user actually has the claimed role
3. **Token validation**: Ensure JWT tokens are valid and not expired
4. **Audit logging**: Log access attempts for security monitoring

## Testing

Test role-based access by:
1. Logging in with different user roles
2. Attempting to access restricted routes
3. Verifying that navigation items are filtered correctly
4. Checking that API calls include role information
5. Testing conditional rendering of components 