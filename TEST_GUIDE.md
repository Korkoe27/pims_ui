# Review Consultation Frontend - Complete Test Guide

## Test Environment Setup

### Prerequisites
1. Backend API running with `/consultations/versions/{version_id}/initiate-review/` endpoint
2. Frontend application running
3. User logged in as lecturer with `canGradeStudents` permission
4. Appointment in "submitted for review" or "under review" status
5. Browser DevTools open for console logging

## Functional Test Cases

### Test 1: Button Visibility - Lecturer with Permission
**Objective**: Verify ReviewButton shows only for authorized users

**Steps**:
1. Log in as lecturer with `canGradeStudents: true`
2. View appointment with "submitted for review" status
3. Look for "Start Review" button

**Expected Result**:
- ✅ Button is visible
- ✅ Button label is "Start Review"
- ✅ Button is clickable

**Actual Result**: ___________________

---

### Test 2: Button Visibility - Student (No Permission)
**Objective**: Verify ReviewButton doesn't show for non-lecturers

**Steps**:
1. Log in as student
2. View appointment with "submitted for review" status
3. Look for review button

**Expected Result**:
- ✅ Button is NOT visible

**Actual Result**: ___________________

---

### Test 3: Button Visibility - Wrong Status
**Objective**: Verify ReviewButton only shows for correct statuses

**Steps**:
1. Log in as lecturer with `canGradeStudents: true`
2. View appointment with "completed" status
3. Look for review button

**Expected Result**:
- ✅ Button is NOT visible

**Actual Result**: ___________________

---

### Test 4: Modal Opens on Button Click
**Objective**: Verify modal opens when button clicked

**Steps**:
1. Click "Start Review" button
2. Check if modal appears

**Expected Result**:
- ✅ Modal appears
- ✅ Modal shows "Initiating Review" header
- ✅ Modal shows "Checking for existing review..." spinner

**Actual Result**: ___________________

---

### Test 5: Happy Path - New Review Created (201)
**Objective**: Test successful new review creation

**Setup**:
- Appointment with no existing review version
- Backend configured to return 201 CREATED

**Steps**:
1. Click "Start Review" button
2. Modal opens and shows "Checking..."
3. Wait for API call
4. Observe response

**Expected Result**:
- ✅ Modal shows "Checking for existing review..."
- ✅ No existing review found
- ✅ Modal shows "Creating review version..."
- ✅ API call made to `/consultations/versions/{version_id}/initiate-review/`
- ✅ Status code is 201 CREATED
- ✅ Toast shows "Review created successfully with 12 records cloned"
- ✅ Redux state updated with review version ID
- ✅ Page navigates to `/consultation/{appointmentId}?version={reviewVersionId}`
- ✅ Modal closes

**Network Tab**:
- ✅ POST request to correct endpoint
- ✅ Authorization header present with Bearer token
- ✅ Content-Type: application/json
- ✅ No request body (POST with no data)

**Response Headers**:
- ✅ Status: 201 Created
- ✅ Content-Type: application/json

**Response Body**:
- ✅ `detail` field present with success message
- ✅ `version.id` is UUID
- ✅ `version.version_type` is "review"
- ✅ `version.is_final` is false
- ✅ `version.diff_snapshot.records_cloned` is number
- ✅ `version.diff_snapshot.cloned_from` is student version UUID

**Console**:
- ✅ "✅ Found existing review version:" or "📋 No review version found..."
- ✅ "✅ Review initiated successfully:" with version object

**Actual Result**: ___________________

---

### Test 6: Happy Path - Review Already Exists (200)
**Objective**: Test handling of existing review

**Setup**:
- Appointment with existing review version
- Backend configured to return 200 OK

**Steps**:
1. Click "Start Review" button (or "Continue Review" if status is "under review")
2. Modal opens and checks versions
3. Observe response

**Expected Result**:
- ✅ Modal shows "Checking for existing review..."
- ✅ Existing review version found locally
- ✅ NO API call made (check Network tab - should not show POST)
- ✅ Page navigates immediately to review editor
- ✅ Modal closes
- ✅ No toast shown (immediate navigation)

**Console**:
- ✅ "✅ Found existing review version:" with version ID

**Actual Result**: ___________________

---

### Test 7: Error Path - Non-Student Consultation (400)
**Objective**: Test handling of validation error

**Setup**:
- Appointment with professional consultation (not student)
- Backend returns 400 BAD REQUEST

**Steps**:
1. Click "Start Review" button
2. Modal shows "Creating review version..."
3. Wait for API response

**Expected Result**:
- ✅ Modal shows "Checking..." then "Creating..."
- ✅ API call made to endpoint
- ✅ Status code is 400 BAD REQUEST
- ✅ Toast shows error message: "Cannot review a Professional Consultation. Only student consultations can be reviewed."
- ✅ Modal shows error state with icon (⚠️)
- ✅ Error message displayed in red box
- ✅ "Close" button visible and clickable
- ✅ "Retry" button visible and clickable
- ✅ Modal does NOT close automatically

**Network Tab**:
- ✅ POST request made
- ✅ Status 400 Bad Request
- ✅ Response contains `detail` field with error message

**Console**:
- ✅ "❌ Error processing review:" with error message

**User Actions**:
- ✅ Click "Close" → Modal closes
- ✅ Click "Retry" → Modal returns to "checking" state and retries

**Actual Result**: ___________________

---

### Test 8: Error Path - Not Submitted (400)
**Objective**: Test handling of non-submitted consultation

**Setup**:
- Appointment with unsubmitted student consultation
- Backend returns 400 BAD REQUEST

**Steps**:
1. Click "Start Review" button
2. Wait for API response

**Expected Result**:
- ✅ Toast shows error message: "This consultation has not been submitted for review yet. Student must submit the consultation first."
- ✅ Modal shows error state
- ✅ Retry button available

**Actual Result**: ___________________

---

### Test 9: Error Path - Finalized Consultation (400)
**Objective**: Test handling of finalized consultation

**Setup**:
- Appointment with finalized consultation
- Backend returns 400 BAD REQUEST

**Steps**:
1. Click "Start Review" button
2. Wait for API response

**Expected Result**:
- ✅ Toast shows error message: "Cannot review a consultation that has been finalized. Only submitted (non-finalized) consultations can be reviewed."
- ✅ Modal shows error state
- ✅ Retry button available

**Actual Result**: ___________________

---

### Test 10: Missing Authentication Token
**Objective**: Test behavior when token is missing

**Setup**:
- Clear authentication token from Redux
- Try to initiate review

**Steps**:
1. Click "Start Review" button
2. Wait for error

**Expected Result**:
- ✅ Toast shows error message: "No authentication token found"
- ✅ Modal shows error state
- ✅ No API call made (401 from browser due to missing auth)

**Console**:
- ✅ Error message logged

**Actual Result**: ___________________

---

### Test 11: Network Error / Timeout
**Objective**: Test handling of network errors

**Setup**:
- Network connection disrupted or backend unavailable
- Try to initiate review

**Steps**:
1. Click "Start Review" button
2. Wait for network error

**Expected Result**:
- ✅ Toast shows error message
- ✅ Modal shows error state
- ✅ Retry button available
- ✅ User can retry when network restored

**Actual Result**: ___________________

---

### Test 12: Redux State Update - Success
**Objective**: Verify Redux state is correctly updated

**Steps**:
1. Click "Start Review" button
2. Wait for success
3. Check Redux DevTools

**Expected Result**:
- ✅ Redux state contains `consultation` slice
- ✅ `id` equals review version ID
- ✅ `versionId` equals review version ID
- ✅ `version_type` equals "review"
- ✅ `is_final` equals false
- ✅ `flowType` equals "lecturer_reviewing"
- ✅ `appointmentId` equals appointment ID

**Redux Path**: 
`store.consultation` or check ReduxDevTools extension

**Actual Result**: ___________________

---

### Test 13: Navigation - Success
**Objective**: Verify correct navigation after success

**Steps**:
1. Note current URL
2. Click "Start Review" button
3. Wait for success
4. Check new URL

**Expected Result**:
- ✅ URL changes to `/consultation/{appointmentId}?version={reviewVersionId}`
- ✅ Query parameter `version` contains review version UUID
- ✅ Consultation page loads with review version data
- ✅ Modal closes

**Actual Result**: ___________________

---

### Test 14: Bearer Token Format
**Objective**: Verify token is correctly formatted in Authorization header

**Steps**:
1. Open Network tab in DevTools
2. Click "Start Review" button
3. Find POST request to initiate-review endpoint
4. Check Authorization header

**Expected Result**:
- ✅ Authorization header present
- ✅ Format: `Authorization: Bearer {token}`
- ✅ Token is valid JWT
- ✅ Token matches Redux auth.token

**Header Content**:
`Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`

**Actual Result**: ___________________

---

### Test 15: Content-Type Header
**Objective**: Verify Content-Type header is set

**Steps**:
1. Open Network tab
2. Click "Start Review" button
3. Check request headers

**Expected Result**:
- ✅ Content-Type header present
- ✅ Value: `application/json`

**Actual Result**: ___________________

---

### Test 16: Toast Notification - Success Message
**Objective**: Verify toast shows correct success message

**Steps**:
1. Clear any existing toasts
2. Click "Start Review" for new review
3. Wait for response
4. Check toast content

**Expected Result**:
- ✅ Toast appears
- ✅ Type: "success" (green)
- ✅ Message: "Review created successfully with 12 records cloned"
- ✅ Toast auto-dismisses after 3-5 seconds

**Actual Result**: ___________________

---

### Test 17: Toast Notification - Info Message
**Objective**: Verify toast shows info for existing review

**Steps**:
1. Clear toasts
2. Click "Start Review" for existing review (200 response)
3. Check toast

**Expected Result**:
- ✅ Toast appears
- ✅ Type: "info" (blue)
- ✅ Message: "Review already exists. Navigating..."

**Actual Result**: ___________________

---

### Test 18: Toast Notification - Error Message
**Objective**: Verify toast shows error message

**Steps**:
1. Clear toasts
2. Click "Start Review" for invalid consultation
3. Check toast

**Expected Result**:
- ✅ Toast appears
- ✅ Type: "error" (red)
- ✅ Message: Descriptive error from backend
- ✅ Toast stays visible longer than success

**Actual Result**: ___________________

---

### Test 19: Retry Button Functionality
**Objective**: Verify retry button resets modal state

**Steps**:
1. Trigger an error (e.g., invalid consultation)
2. Modal shows error state
3. Click "Retry" button
4. Observe modal reset

**Expected Result**:
- ✅ Modal returns to "Checking for existing review..." state
- ✅ Spinner visible
- ✅ Previous error message cleared
- ✅ Process starts again from beginning

**Actual Result**: ___________________

---

### Test 20: Close Button in Error State
**Objective**: Verify close button works in error state

**Steps**:
1. Trigger an error
2. Modal shows error state
3. Click "Close" button

**Expected Result**:
- ✅ Modal closes
- ✅ User stays on current page (doesn't navigate)

**Actual Result**: ___________________

---

### Test 21: Modal Disabled Close During Processing
**Objective**: Verify close button is disabled during processing

**Steps**:
1. Click "Start Review"
2. While modal is checking/processing, try to close
3. Check if close button is clickable

**Expected Result**:
- ✅ Close button visible but disabled (grayed out)
- ✅ Button text: "Please wait..."
- ✅ Cursor shows "not-allowed" on hover
- ✅ Clicking has no effect

**Actual Result**: ___________________

---

### Test 22: Modal Auto-Navigation
**Objective**: Verify modal auto-navigates and doesn't require user action

**Steps**:
1. Click "Start Review"
2. Do NOT click anything in modal
3. Wait for success

**Expected Result**:
- ✅ Modal automatically navigates without user clicking anything
- ✅ Page loads review editor
- ✅ Modal closes automatically
- ✅ No stuck modal states

**Actual Result**: ___________________

---

### Test 23: Multiple Rapid Clicks
**Objective**: Test that rapid button clicks don't cause issues

**Steps**:
1. Click "Start Review" button rapidly 3-4 times
2. Observe behavior

**Expected Result**:
- ✅ Only one modal opens
- ✅ Only one API call made
- ✅ No duplicate submissions
- ✅ Process completes normally

**Actual Result**: ___________________

---

### Test 24: Label Change Based on Status
**Objective**: Verify button label changes with appointment status

**Test Case 1: submitted for review**
- ✅ Button label: "Start Review"
- ✅ Tooltip: "Initiate review of this consultation"

**Test Case 2: under review**
- ✅ Button label: "Continue Review"
- ✅ Tooltip: "Review and finalize this case"

**Test Case 3: Other statuses**
- ✅ Button not visible

**Actual Result**: ___________________

---

## Performance Tests

### Test P1: Response Time
**Objective**: Measure API response time

**Steps**:
1. Open DevTools Network tab
2. Click "Start Review"
3. Measure time from request to response

**Expected Result**:
- ✅ Response time < 2 seconds
- ✅ Modal shows spinner during wait

**Actual Response Time**: ___________________

---

### Test P2: Large Record Count
**Objective**: Test handling of large number of cloned records

**Setup**:
- Appointment with 100+ records to clone

**Steps**:
1. Click "Start Review"
2. Wait for response
3. Check if toast shows correct count

**Expected Result**:
- ✅ Toast shows all records cloned (e.g., "Review created successfully with 147 records cloned")
- ✅ Navigation completes without delay
- ✅ Redux state updated correctly

**Actual Result**: ___________________

---

## Browser Compatibility Tests

### Test B1: Chrome
- [ ] Button shows correctly
- [ ] Modal opens
- [ ] API call successful
- [ ] Navigation works
- [ ] Toasts display

**Result**: PASS / FAIL

---

### Test B2: Firefox
- [ ] Button shows correctly
- [ ] Modal opens
- [ ] API call successful
- [ ] Navigation works
- [ ] Toasts display

**Result**: PASS / FAIL

---

### Test B3: Safari
- [ ] Button shows correctly
- [ ] Modal opens
- [ ] API call successful
- [ ] Navigation works
- [ ] Toasts display

**Result**: PASS / FAIL

---

## Edge Cases

### Test E1: Expired Token During Processing
**Objective**: Test behavior when token expires mid-request

**Steps**:
1. Start review initiation
2. During processing, clear auth token
3. Wait for response

**Expected Result**:
- ✅ Request fails with auth error
- ✅ Error toast shown
- ✅ Retry button available
- ✅ User can re-authenticate and retry

**Actual Result**: ___________________

---

### Test E2: Backend Returns Unexpected Status
**Objective**: Test handling of unexpected HTTP status

**Setup**:
- Backend returns 500 Server Error

**Steps**:
1. Click "Start Review"
2. Observe error handling

**Expected Result**:
- ✅ Error handled gracefully
- ✅ Toast shows error message
- ✅ Retry available
- ✅ No console errors

**Actual Result**: ___________________

---

### Test E3: Malformed JSON Response
**Objective**: Test handling of invalid JSON

**Setup**:
- Backend returns malformed JSON

**Steps**:
1. Click "Start Review"
2. Observe error handling

**Expected Result**:
- ✅ Error caught
- ✅ User-friendly error message shown
- ✅ Modal shows error state

**Actual Result**: ___________________

---

### Test E4: Missing Fields in Response
**Objective**: Test handling of incomplete response

**Setup**:
- Backend returns response missing `version.id`

**Steps**:
1. Click "Start Review"
2. Observe error handling

**Expected Result**:
- ✅ Error detected and handled
- ✅ User informed with error message
- ✅ Retry available

**Actual Result**: ___________________

---

## Accessibility Tests

### Test A1: Keyboard Navigation
**Objective**: Verify buttons work with keyboard

**Steps**:
1. Use Tab to navigate to button
2. Press Enter/Space to activate
3. Use Tab to navigate modal buttons

**Expected Result**:
- ✅ Button receives focus
- ✅ Button activates with Enter/Space
- ✅ Modal buttons keyboard accessible
- ✅ Focus visible on focused elements

**Actual Result**: ___________________

---

### Test A2: Screen Reader
**Objective**: Verify accessibility for screen readers

**Steps**:
1. Use screen reader to read button label
2. Use screen reader to read modal content
3. Use screen reader to read error messages

**Expected Result**:
- ✅ Button label read correctly
- ✅ Modal title and content read
- ✅ Error messages conveyed

**Actual Result**: ___________________

---

## Regression Tests

### Test R1: Other Buttons Still Work
**Objective**: Verify review button doesn't break other functionality

**Steps**:
1. Verify other buttons/features work before review
2. Use review feature
3. Verify other buttons/features still work

**Expected Result**:
- ✅ No side effects on other components
- ✅ Redux state clean
- ✅ Navigation works for other routes

**Actual Result**: ___________________

---

### Test R2: Multiple Appointments
**Objective**: Test switching between appointments

**Steps**:
1. Use review on appointment A
2. Navigate back to appointments
3. Use review on appointment B
4. Verify correct appointment data in both cases

**Expected Result**:
- ✅ Correct appointment context maintained
- ✅ Correct version IDs used
- ✅ Navigation works for both

**Actual Result**: ___________________

---

## Summary

| Test Category | Total | Passed | Failed | Notes |
|---------------|-------|--------|--------|-------|
| Functional | 22 | ___ | ___ | |
| Performance | 2 | ___ | ___ | |
| Browser | 3 | ___ | ___ | |
| Edge Cases | 4 | ___ | ___ | |
| Accessibility | 2 | ___ | ___ | |
| Regression | 2 | ___ | ___ | |
| **TOTAL** | **35** | **___** | **___** | |

### Overall Status: ___________________

### Notes:
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

### Issues Found:
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

### Recommendations:
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________
