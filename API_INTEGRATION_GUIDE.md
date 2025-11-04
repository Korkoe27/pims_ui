# Frontend Implementation - Review Consultation API Integration

## Overview
Complete frontend implementation for initiating review consultations using the backend endpoint:
```
POST /consultations/versions/{version_id}/initiate-review/
```

## Files Implemented

### 1. ✅ NEW: `src/hooks/useInitiateReview.js`
Custom React hook that handles the entire review initiation process.

**Key Responsibilities:**
- Fetch API call with Bearer token authentication
- Handle 200 OK, 201 CREATED, and 400 BAD REQUEST responses
- Display toast notifications for user feedback
- Dispatch Redux state updates
- Navigate to review editor page
- Manage loading and error states

**Return Value:**
```javascript
{
  initiateReview: async (studentVersionId) => {
    success: boolean,
    version: { id, version_type, is_final, appointment_id, diff_snapshot? },
    isNewReview: boolean,           // true if 201 CREATED
    recordsCloned: number,          // count from diff_snapshot
    error: string                   // only if success === false
  },
  isLoading: boolean,
  error: string | null
}
```

### 2. ✅ UPDATED: `src/components/ReviewModal.jsx`
Modal component orchestrating the review initiation flow.

**Changes Made:**
- Replaced `useInitiateReviewMutation` with `useInitiateReview` hook
- Updated version_type check from "reviewed" to "review"
- Improved error handling with hook-based approach
- Simplified navigation logic (hook handles it)
- Updated UI text to reflect correct terminology

**Component Flow:**
```
1. Modal opens
2. Fetch existing versions from Redux
3. Check for existing "review" type version
4. If found: Navigate immediately (no API call)
5. If not found: Call useInitiateReview hook
6. Handle response and navigate
7. Show appropriate toast and close modal
```

### 3. ✅ VERIFIED: `src/components/ui/buttons/ReviewButton.jsx`
No changes needed - already properly integrated.

**Current Functionality:**
- Shows only for lecturers with `canGradeStudents` permission
- Shows only for appointments with "submitted for review" or "under review" status
- Opens ReviewModal on click
- Passes appointment and latest_version_id to modal

## Response Handling

### 200 OK - Review Already Exists
```json
{
  "detail": "Review consultation already exists.",
  "version": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "version_type": "review",
    "is_final": false,
    "submitted_at": "2025-11-04 10:30:00",
    "appointment_id": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Frontend Handling:**
- Toast: "Review already exists. Navigating..."
- Extract `version.id`
- Dispatch Redux state update
- Navigate to `/consultation/{appointmentId}?version={reviewVersionId}`
- Close modal

### 201 CREATED - Review Just Created
```json
{
  "detail": "Review consultation created successfully with 12 cloned records.",
  "version": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "version_type": "review",
    "is_final": false,
    "submitted_at": "2025-11-04 10:30:00",
    "appointment_id": "550e8400-e29b-41d4-a716-446655440001",
    "diff_snapshot": {
      "cloned_from": "550e8400-e29b-41d4-a716-446655440003",
      "cloned_at": "2025-11-04T10:30:00Z",
      "records_cloned": 12,
      "changes": {}
    }
  }
}
```

**Frontend Handling:**
- Extract `records_cloned` from `diff_snapshot`
- Toast: "Review created successfully with 12 records cloned"
- Extract `version.id`
- Dispatch Redux state update
- Navigate to `/consultation/{appointmentId}?version={reviewVersionId}`
- Close modal

### 400 BAD REQUEST - Validation Errors
```json
{
  "detail": "Cannot review a Professional Consultation. Only student consultations can be reviewed."
}
```

**Possible Error Messages:**
1. `"Cannot review a {type} consultation. Only student consultations can be reviewed."`
   - Attempting to review non-student consultation
   
2. `"This consultation has not been submitted for review yet. Student must submit the consultation first."`
   - Student consultation not marked as submitted for review
   
3. `"Cannot review a consultation that has been finalized. Only submitted (non-finalized) consultations can be reviewed."`
   - Attempting to review finalized consultation

**Frontend Handling:**
- Extract error message from `detail` field
- Toast: [error message]
- Show error state in modal
- Provide "Retry" button
- Store error message for display

## Usage Example

```javascript
// In ReviewModal.jsx
import useInitiateReview from "../hooks/useInitiateReview";

const { initiateReview, isLoading, error } = useInitiateReview(appointmentId);

// Call when review needed
const result = await initiateReview(studentVersionId);

if (result.success) {
  console.log("Review initiated:", result.version.id);
  console.log("New review created:", result.isNewReview);
  console.log("Records cloned:", result.recordsCloned);
  // Navigation handled automatically by hook
} else {
  console.error("Failed to initiate review:", result.error);
  // Error toast already shown by hook
}
```

## Redux State Update

After successful review initiation, hook dispatches:

```javascript
dispatch(setCurrentConsultation({
  id: reviewVersionId,              // From response.version.id
  versionId: reviewVersionId,       // Same as id
  version_type: "review",           // From response.version.version_type
  is_final: false,                  // From response.version.is_final
  flowType: "lecturer_reviewing",   // Indicates review flow
  appointmentId: appointmentId      // From hook parameter
}))
```

## Navigation

After successful initiation:
```
navigate(`/consultation/${appointmentId}?version=${reviewVersionId}`)
```

**Parameters:**
- `appointmentId`: Original appointment UUID
- `reviewVersionId`: Newly created/existing review version UUID

**Query String:** Tells consultation page which version to load

## Toast Notifications

### Success Cases

**201 CREATED - New Review:**
```javascript
showToast("Review created successfully with 12 records cloned", "success")
```

**200 OK - Existing Review:**
```javascript
showToast("Review already exists. Navigating...", "info")
```

### Error Cases

**400 BAD REQUEST:**
```javascript
showToast("Cannot review a Professional Consultation. Only student consultations can be reviewed.", "error")
```

**Authentication Error:**
```javascript
showToast("No authentication token found", "error")
```

**Network Error:**
```javascript
showToast("Failed to initiate review. Please try again.", "error")
```

## Authentication

### Token Source
- Stored in Redux: `state.auth.token`
- Retrieved from Redux in useInitiateReview hook
- Injected into Authorization header

### Token Validation
```javascript
if (!token) {
  throw new Error("No authentication token found");
}
```

### Header Format
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Modal States

### Checking State
- Shows while fetching existing versions
- Spinner animation
- Progress steps visible
- "Please wait..." disabled button

### Processing State
- Shows while calling initiate-review endpoint
- Spinner animation
- Progress steps visible
- "Please wait..." disabled button

### Navigating State
- Shows when ready to navigate
- Success checkmark icon
- "Review ready! Navigating to review editor..."
- "Please wait..." disabled button

### Error State
- Shows when error occurs
- Error icon (⚠️)
- Error message in red box
- "Close" button (closes modal)
- "Retry" button (resets to checking state)

## Key Features

### ✅ Idempotent
- Safe to call multiple times
- Backend returns 200 if review already exists
- Backend returns 201 only on creation
- Frontend checks locally first to avoid unnecessary API calls

### ✅ Single Review Per Appointment
- Backend enforces only one active review
- Frontend checks existing versions first
- No duplicate reviews created

### ✅ Auto-Clone
- Backend automatically clones all exam data from student version
- Record count returned in response
- All records immediately available in review version

### ✅ Change Tracking
- `diff_snapshot` tracks what was cloned
- `cloned_from`: student version ID
- `cloned_at`: timestamp of cloning
- `records_cloned`: count of cloned records
- `changes`: tracks modifications (empty on creation)

### ✅ Error Handling
- Graceful handling of validation errors
- User-friendly error messages
- Retry capability
- Full error logging

## Validation

### Pre-API Call Validation
```javascript
if (!token) throw new Error("No authentication token found");
if (!studentVersionId) throw new Error("Student version ID is required");
```

### Backend Validation
- Can only review student consultations (not professional)
- Consultation must be submitted for review
- Consultation must not be finalized
- Appointment must exist

## Testing Checklist

- [ ] Button visibility correct for lecturers
- [ ] Button shows for correct appointment statuses
- [ ] Modal opens on button click
- [ ] API call has correct endpoint
- [ ] API call has Bearer token in header
- [ ] 201 response handled correctly
- [ ] Toast shows record count for 201
- [ ] 200 response handled correctly
- [ ] Toast shows for 200
- [ ] 400 response handled correctly
- [ ] Error message displayed
- [ ] Retry button works
- [ ] Navigation occurs after success
- [ ] Redux state updated correctly
- [ ] Modal closes after success
- [ ] Local version check works (no API call if review exists)

## Deployment Requirements

### Backend Prerequisites
1. Endpoint implemented: `POST /consultations/versions/{version_id}/initiate-review/`
2. Returns proper response structure as documented
3. Returns 200 OK for existing reviews
4. Returns 201 CREATED for new reviews
5. Returns 400 BAD REQUEST for validation errors
6. Clones exam data from student version
7. Returns `records_cloned` count in diff_snapshot

### Frontend Prerequisites
1. Redux auth slice with token storage
2. Redux consultation slice with setCurrentConsultation action
3. ToasterHelper component for notifications
4. Consultation page that loads review versions
5. Proper routing to consultation page
6. Authentication middleware configured

### Environment Configuration
1. API base URL configured
2. JWT authentication enabled
3. CORS configured for endpoints
4. Redux store properly initialized

## Implementation Status

| Component | Status | Details |
|-----------|--------|---------|
| useInitiateReview hook | ✅ CREATED | Full implementation with error handling |
| ReviewModal updates | ✅ UPDATED | Uses new hook, proper state handling |
| ReviewButton | ✅ VERIFIED | No changes needed, already integrated |
| Toast notifications | ✅ IMPLEMENTED | Success and error messages |
| Redux dispatch | ✅ IMPLEMENTED | State updated on success |
| Navigation | ✅ IMPLEMENTED | Redirects to review editor |
| Error recovery | ✅ IMPLEMENTED | Retry button in error state |
| Documentation | ✅ CREATED | Complete reference guides |

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| src/hooks/useInitiateReview.js | CREATED | Review initiation logic |
| src/components/ReviewModal.jsx | UPDATED | Modal orchestration |
| src/components/ui/buttons/ReviewButton.jsx | VERIFIED | No changes needed |
| REVIEW_IMPLEMENTATION_REFERENCE.md | CREATED | Quick reference guide |
| IMPLEMENTATION_SUMMARY.js | CREATED | Detailed implementation info |
| Frontend Implementation - Review Consultation API Integration | CREATED | This file |
