# Frontend Role-Based Access Migration

## Overview

The frontend has been updated to use **role-based access control** instead of granular permission flags. The backend now returns only user roles, and the frontend determines access based on those roles.

## What Changed

### Before (Old System)
```javascript
// API Response
{
  "authenticated": true,
  "user": { /* user data */ },
  "access": {
    "canViewAppointments": true,
    "canGradeStudents": false,
    "canViewPharmacy": true,
    // ... 20+ permission flags
  }
}

// Redux State
const { user, access } = useSelector(state => state.auth);

// Component Usage
if (access.canViewAppointments) {
  // Show appointments
}
```

### After (New System)
```javascript
// API Response
{
  "authenticated": true,
  "user": {
    "id": 6,
    "username": "student",
    "first_name": "Solomon",
    "last_name": "Edziah",
    "roles": ["Student", "Pharmacy"],  // Display names
    "role_codes": ["student", "pharmacy"]  // For logic checks
  }
}

// Redux State
const { user } = useSelector(state => state.auth);
const roleCodes = user?.role_codes || [];

// Component Usage
if (roleCodes.includes('student') || roleCodes.includes('clinician')) {
  // Show appointments
}
```

## Available Role Codes

- **`frontdesk`** - Front desk staff (can register patients, create appointments)
- **`student`** - Students (can perform consultations, view own grades)
- **`clinician`** - Clinical staff/optometrists (can perform consultations)
- **`supervisor`** - Supervisors/lecturers (can grade students, access all features)
- **`coordinator`** - Coordinators (administrative access)
- **`pharmacy`** - Pharmacy staff (can view/manage pharmacy)
- **`finance`** - Finance staff (can view bills and financial reports)

## Files Changed

### 1. Redux State (`authSlice.js`)
```javascript
// Before
const initialState = {
  user: null,
  access: null,  // ❌ Removed
  loading: false,
  error: null
};

// After
const initialState = {
  user: null,  // Contains roles and role_codes
  loading: false,
  error: null
};
```

### 2. Auth API (`authApi.js`)
```javascript
// Before
transformResponse: (response) => ({
  authenticated: response.authenticated,
  user: response.user,
  access: response.user?.access || {},  // ❌ Removed
}),

// After
transformResponse: (response) => ({
  authenticated: response.authenticated,
  user: response.user,  // Includes roles and role_codes
}),
```

### 3. Login Page (`Login.jsx`)
```javascript
// Before
const user = await getUser().unwrap();
dispatch(setUser(user));

// After
const { user } = await getUser().unwrap();
dispatch(setUser({ user }));
```

### 4. Protected Routes (`ProtectedRoute.js`)
```javascript
// Before
const access = user?.access || {};
const hasAllAccess = accessKeys.every((key) => access[key]);

// After
const roleCodes = user?.role_codes || [];
const permissionRoleMap = { /* ... */ };
const hasAllAccess = accessKeys.every((key) => {
  const allowedRoles = permissionRoleMap[key] || [];
  return roleCodes.some((code) => allowedRoles.includes(code));
});
```

### 5. Sidebar (`Sidebar.jsx`)
```javascript
// Before
const access = user?.access || {};
const canAccess = (permissionKey) => Boolean(access?.[permissionKey]);

// After
const roleCodes = user?.role_codes || [];
const permissionRoleMap = { /* ... */ };
const canAccess = (permissionKey) => {
  if (!permissionKey) return true;
  const allowedRoles = permissionRoleMap[permissionKey] || [];
  return roleCodes.some((code) => allowedRoles.includes(code));
};
```

### 6. Add Patient Button (`AddPatientButton.jsx`)
```javascript
// Before
const access = user?.access || {};
if (!access?.canAddPatient) return null;

// After
const roleCodes = user?.role_codes || [];
const allowedRoles = ["frontdesk", "supervisor", "coordinator"];
if (!roleCodes.some(code => allowedRoles.includes(code))) return null;
```

## Permission to Role Mapping

| Permission Key | Allowed Roles |
|---|---|
| `canViewPatients` | frontdesk, student, clinician, supervisor |
| `canAddPatient` | frontdesk, supervisor, coordinator |
| `canViewAppointments` | frontdesk, student, clinician, supervisor, coordinator |
| `canCreateAppointment` | frontdesk, supervisor, coordinator |
| `canViewConsultations` | student, clinician, supervisor |
| `canStartConsultation` | student, clinician, supervisor |
| `canViewGrades` | student |
| `canGradeStudents` | supervisor |
| `canViewClinicSchedule` | frontdesk, student, clinician, supervisor, coordinator |
| `canViewReports` | supervisor, coordinator, finance |
| `canViewPharmacy` | pharmacy |
| `canViewBills` | finance |
| `canAccessStudentPortal` | student |
| `canViewAbsentRequests` | supervisor, coordinator |

## Usage Examples

### Basic Role Check
```javascript
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const { user } = useSelector(state => state.auth);
  const roleCodes = user?.role_codes || [];
  
  const isSupervisor = roleCodes.includes('supervisor');
  const isStudent = roleCodes.includes('student');
  
  if (isSupervisor) {
    return <SupervisorView />;
  }
  
  return <StudentView />;
};
```

### Using roleUtils Helper
```javascript
import { useSelector } from 'react-redux';
import { hasPermission, hasRole, hasAnyRole } from '../utils/roleUtils';

const MyComponent = () => {
  const { user } = useSelector(state => state.auth);
  const roleCodes = user?.role_codes || [];
  
  // Check specific permission
  const canGrade = hasPermission(roleCodes, 'canGradeStudents');
  
  // Check specific role
  const isPharmacy = hasRole(roleCodes, 'pharmacy');
  
  // Check multiple roles
  const canConsult = hasAnyRole(roleCodes, ['student', 'clinician', 'supervisor']);
  
  return (
    <>
      {canGrade && <GradingButton />}
      {canConsult && <StartConsultationButton />}
    </>
  );
};
```

### Conditional Rendering
```javascript
const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const roleCodes = user?.role_codes || [];
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {roleCodes.includes('supervisor') && (
        <SupervisorSection />
      )}
      
      {roleCodes.includes('pharmacy') && (
        <PharmacySection />
      )}
      
      {(roleCodes.includes('student') || roleCodes.includes('clinician')) && (
        <ConsultationSection />
      )}
    </div>
  );
};
```

## Testing Checklist

- [x] Login successfully receives user with roles and role_codes
- [x] Redux state stores user without access field
- [ ] Sidebar shows correct menu items based on roles
- [ ] Protected routes allow/deny access correctly
- [ ] Add Patient button shows for frontdesk/supervisor/coordinator only
- [ ] Student portal accessible only to students
- [ ] Pharmacy page accessible only to pharmacy staff
- [ ] Finance page accessible only to finance staff
- [ ] Grading features accessible only to supervisors
- [ ] Multi-role users see all appropriate features

## Benefits

1. **Simpler State**: No separate `access` object to manage
2. **Clearer Logic**: Role checks are explicit and easy to understand
3. **Backend Sync**: Frontend mirrors backend's role-based system
4. **Maintainability**: Adding new features only requires role checks, no new permission flags
5. **Performance**: Smaller API responses (no 20+ permission flags)

## Migration Notes

- All references to `state.auth.access` have been removed
- Components now use `user.role_codes` for access control
- Permission checks are now role-based via mapping functions
- The `roleUtils.js` helper provides reusable utility functions
- Multi-role users (e.g., student + pharmacy) have access to features from both roles
