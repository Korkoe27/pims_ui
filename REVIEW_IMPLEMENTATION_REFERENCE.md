# Review Consultation Frontend Implementation - Quick Reference

## 📋 Endpoint
```
POST /consultations/versions/{version_id}/initiate-review/
```

## 🔐 Authentication
- JWT Bearer token required in Authorization header
- Token automatically included from Redux auth state

## 📦 Response Handling

### ✅ 200 OK - Review Already Exists
```json
{
  "detail": "Review consultation already exists.",
  "version": {
    "id": "uuid",
    "version_type": "review",
    "is_final": false,
    "submitted_at": "2025-11-04 10:30:00",
    "appointment_id": "uuid"
  }
}
```
**User Experience**: Toast shows "Review already exists. Navigating..." → Navigates to review editor

### ✅ 201 CREATED - Review Just Created
```json
{
  "detail": "Review consultation created successfully with 12 cloned records.",
  "version": {
    "id": "uuid",
    "version_type": "review",
    "is_final": false,
    "submitted_at": "2025-11-04 10:30:00",
    "appointment_id": "uuid",
    "diff_snapshot": {
      "cloned_from": "student-version-uuid",
      "cloned_at": "2025-11-04T10:30:00Z",
      "records_cloned": 12,
      "changes": {}
    }
  }
}
```
**User Experience**: Toast shows "Review created successfully with 12 records cloned" → Navigates to review editor

### ❌ 400 BAD REQUEST - Validation Errors
```json
{
  "detail": "Cannot review a Professional Consultation. Only student consultations can be reviewed."
}
```
**Possible Errors**:
- `"Cannot review a {type} consultation. Only student consultations can be reviewed."`
- `"This consultation has not been submitted for review yet. Student must submit the consultation first."`
- `"Cannot review a consultation that has been finalized. Only submitted (non-finalized) consultations can be reviewed."`

**User Experience**: Toast shows error message → Provides retry option in modal

## 🎯 Flow Diagram

```
ReviewButton Clicked
    ↓
ReviewModal Opens
    ↓
Check Local Versions
    ├─→ Review Version Found → Navigate Immediately
    │
    └─→ Review Version NOT Found
            ↓
        Call POST /consultations/versions/{version_id}/initiate-review/
            ↓
        Check Response Status
        ├─→ 200 OK → Info Toast + Navigate
        ├─→ 201 CREATED → Success Toast (with record count) + Navigate
        └─→ 400 BAD REQUEST → Error Toast + Retry Button
```

## 🔧 Key Components

### 1. `useInitiateReview` Hook
**Location**: `src/hooks/useInitiateReview.js`

**Usage**:
```javascript
const { initiateReview, isLoading, error } = useInitiateReview(appointmentId);

const result = await initiateReview(studentVersionId);
// result.success: boolean
// result.version: version object
// result.isNewReview: boolean (201 created)
// result.recordsCloned: number
```

**Handles**:
- ✅ API call with Bearer token
- ✅ 200/201/400 response handling
- ✅ Toast notifications
- ✅ Redux state dispatch
- ✅ Navigation to review editor

### 2. `ReviewModal` Component
**Location**: `src/components/ReviewModal.jsx`

**Props**:
- `appointmentId`: Appointment UUID
- `studentVersionId`: Student consultation version UUID
- `onClose`: Callback when modal closes
- `onSuccess`: Callback on successful review initiation

**States**:
- `checking`: Fetching versions
- `processing`: Calling initiate-review
- `navigating`: Ready, navigating to editor
- `error`: Error occurred

### 3. `ReviewButton` Component
**Location**: `src/components/ui/buttons/ReviewButton.jsx`

**Shows for**:
- ✅ Lecturers (with canGradeStudents permission)
- ✅ Appointments with status "submitted for review" or "under review"

**Labels**:
- "Start Review" → submitted for review
- "Continue Review" → under review

## 🎨 UI/UX Details

### Modal Progress States

**Checking State**:
- Spinner animation
- "Checking for existing review..."
- Progress steps list
- "Please wait..." disabled button

**Processing State**:
- Spinner animation
- "Creating review version..."
- Progress steps list
- "Please wait..." disabled button

**Navigating State**:
- Success checkmark (✅)
- "Review ready! Navigating to review editor..."
- "Please wait..." disabled button

**Error State**:
- Error icon (⚠️)
- Error message in red box
- "Close" button
- "Retry" button

### Toast Messages

| Event | Message | Type |
|-------|---------|------|
| New review created | "Review created successfully with X records cloned" | success |
| Review exists | "Review already exists. Navigating..." | info |
| Error | [Backend error message] | error |

## 🔄 Redux State Updates

After successful review initiation:
```javascript
dispatch(setCurrentConsultation({
  id: "review-version-uuid",
  versionId: "review-version-uuid",
  version_type: "review",
  is_final: false,
  flowType: "lecturer_reviewing",
  appointmentId: "appointment-uuid"
}))
```

## 📍 Navigation

After review initiation:
```
/consultation/{appointmentId}?version={reviewVersionId}
```

## ✨ Key Features

| Feature | Status | Details |
|---------|--------|---------|
| Idempotent | ✅ | Safe to call multiple times |
| Single Review | ✅ | Only one active review per appointment |
| Auto-Clone | ✅ | All data auto-cloned from student version |
| Change Tracking | ✅ | diff_snapshot available in 201 response |
| Error Handling | ✅ | Graceful handling with user-friendly messages |
| Authentication | ✅ | JWT Bearer token included automatically |
| Retry Logic | ✅ | Retry button in error state |

## 🧪 Testing Scenarios

### Scenario 1: New Review Creation
1. Click "Start Review" button
2. Verify API call to `/consultations/versions/{version_id}/initiate-review/`
3. Verify 201 CREATED response handling
4. Verify success toast with record count
5. Verify navigation to review editor
6. Verify Redux state updated

### Scenario 2: Review Already Exists
1. Click "Continue Review" button
2. Verify API call to initiate-review endpoint
3. Verify 200 OK response handling
4. Verify info toast displayed
5. Verify navigation to review editor

### Scenario 3: Error Handling
1. Try to review non-student consultation
2. Verify 400 BAD REQUEST response
3. Verify error message in toast
4. Verify "Retry" button appears in modal
5. Verify user can fix issue and retry

## 🚀 Deployment Notes

### Prerequisites
- Backend must implement POST `/consultations/versions/{version_id}/initiate-review/` endpoint
- Backend must return proper response structure as documented
- JWT authentication must be configured

### Configuration
- Token stored in Redux state at `state.auth.token`
- API base URL configured in `/src/services/client/baseurl.js`
- Toast notifications require `ToasterHelper` component

### Browser Compatibility
- Modern browsers with Promise/async-await support
- Fetch API support required

## 🔗 Related Files
- `/src/redux/slices/consultationSlice.js` - setCurrentConsultation action
- `/src/redux/api/features/consultationsApi.js` - Consultation APIs
- `/src/components/ToasterHelper.jsx` - Toast notifications
- `/src/redux/api/end_points/endpoints.js` - API endpoint configurations
