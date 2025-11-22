/**
 * IMPLEMENTATION GUIDE: Review Consultation Frontend
 * 
 * ===============================================
 * Endpoint: POST /consultations/versions/{version_id}/initiate-review/
 * ===============================================
 * 
 * FLOW DIAGRAM:
 * 
 *   User clicks "Review Case" button
 *         ↓
 *   ReviewModal opens
 *         ↓
 *   Check existing versions (via Redux query)
 *         ↓
 *   ├─→ Review version EXISTS
 *   │       ↓
 *   │   Navigate to existing review
 *   │
 *   └─→ Review version NOT FOUND
 *           ↓
 *       Call useInitiateReview hook
 *           ↓
 *       POST /consultations/versions/{version_id}/initiate-review/
 *           ↓
 *       Check Response Status:
 *       ├─ 200 OK → Review already exists (show info toast)
 *       ├─ 201 CREATED → New review created (show success toast with record count)
 *       └─ 400 BAD REQUEST → Show error message to user
 *           ↓
 *       Extract version.id from response
 *           ↓
 *       Dispatch to Redux (setCurrentConsultation)
 *           ↓
 *       Navigate to /consultation/{appointmentId}?version={reviewVersionId}
 *           ↓
 *       Close Modal
 * 
 * ===============================================
 * FILES INVOLVED:
 * ===============================================
 * 
 * 1. /src/hooks/useInitiateReview.js (NEW)
 *    └─ Custom hook for review initiation logic
 *    └─ Handles API call, error handling, Redux dispatch, navigation
 * 
 * 2. /src/components/ReviewModal.jsx (UPDATED)
 *    └─ Modal component that orchestrates the review process
 *    └─ Shows progress states: checking → processing → navigating → error
 *    └─ Uses useInitiateReview hook for API call
 * 
 * 3. /src/components/ui/buttons/ReviewButton.jsx (NO CHANGES NEEDED)
 *    └─ Button component that opens ReviewModal
 *    └─ Already properly integrated
 * 
 * 4. /src/redux/api/features/consultationsApi.js (NO CHANGES NEEDED)
 *    └─ Redux Toolkit Query for consultation endpoints
 *    └─ useInitiateReviewMutation not used anymore
 * 
 * ===============================================
 * RESPONSE STRUCTURE:
 * ===============================================
 * 
 * Response 200 OK (Review Already Exists):
 * {
 *   "detail": "Review consultation already exists.",
 *   "version": {
 *     "id": "uuid",
 *     "version_type": "review",
 *     "is_final": false,
 *     "submitted_at": "2025-11-04 10:30:00",
 *     "appointment_id": "uuid"
 *   }
 * }
 * 
 * Response 201 CREATED (Review Just Created):
 * {
 *   "detail": "Review consultation created successfully with 12 cloned records.",
 *   "version": {
 *     "id": "uuid",
 *     "version_type": "review",
 *     "is_final": false,
 *     "submitted_at": "2025-11-04 10:30:00",
 *     "appointment_id": "uuid",
 *     "diff_snapshot": {
 *       "cloned_from": "student-version-uuid",
 *       "cloned_at": "2025-11-04T10:30:00Z",
 *       "records_cloned": 12,
 *       "changes": {}
 *     }
 *   }
 * }
 * 
 * Response 400 BAD REQUEST:
 * {
 *   "detail": "Cannot review a Professional Consultation. Only student consultations can be reviewed."
 * }
 * 
 * Possible Error Messages:
 * - "Cannot review a {type} consultation. Only student consultations can be reviewed."
 * - "This consultation has not been submitted for review yet. Student must submit the consultation first."
 * - "Cannot review a consultation that has been finalized. Only submitted (non-finalized) consultations can be reviewed."
 * 
 * ===============================================
 * USAGE EXAMPLE:
 * ===============================================
 * 
 * In ReviewModal.jsx:
 * 
 *   const { initiateReview, isLoading, error } = useInitiateReview(appointmentId);
 *   
 *   const result = await initiateReview(studentVersionId);
 *   
 *   if (result.success) {
 *     // result.version contains the review version data
 *     // result.isNewReview indicates if this was just created (201) or already existed (200)
 *     // result.recordsCloned contains the count of cloned records
 *     // Navigation and Redux dispatch handled automatically
 *   } else {
 *     // result.error contains the error message
 *   }
 * 
 * ===============================================
 * KEY POINTS:
 * ===============================================
 * 
 * ✅ IDEMPOTENT
 *    └─ Safe to call multiple times
 *    └─ Returns 200 if review already exists
 *    └─ Returns 201 if new review created
 * 
 * ✅ SINGLE REVIEW PER APPOINTMENT
 *    └─ Only one active review per appointment
 *    └─ Multiple calls won't create duplicate reviews
 * 
 * ✅ AUTO-CLONE
 *    └─ All exam data automatically cloned from student version
 *    └─ Records cloned count returned in response
 * 
 * ✅ CHANGE TRACKING
 *    └─ diff_snapshot tracks modifications from original
 *    └─ Available in 201 CREATED response
 * 
 * ✅ ERROR HANDLING
 *    └─ All validation errors return 400 with descriptive message
 *    └─ User-friendly error messages displayed in toast notifications
 *    └─ Retry button available in error state
 * 
 * ✅ AUTHENTICATION
 *    └─ Requires JWT Bearer token in Authorization header
 *    └─ Token automatically included from Redux state
 * 
 * ===============================================
 * TOAST MESSAGES:
 * ===============================================
 * 
 * ON SUCCESS (201 CREATED):
 *   "Review created successfully with 12 records cloned"
 * 
 * ON EXISTING (200 OK):
 *   "Review already exists. Navigating..."
 * 
 * ON ERROR:
 *   [Descriptive error message from backend]
 * 
 * ===============================================
 * COMPONENT STATES:
 * ===============================================
 * 
 * step === "checking"
 * └─ Fetching versions, checking for existing review
 * └─ Shows spinner + progress steps
 * 
 * step === "processing"
 * └─ Calling initiate-review endpoint
 * └─ Shows spinner + progress steps
 * 
 * step === "navigating"
 * └─ Review ready, navigating to editor
 * └─ Shows success checkmark
 * 
 * step === "error"
 * └─ Error occurred during process
 * └─ Shows error icon + message
 * └─ Provides "Close" and "Retry" buttons
 * 
 * ===============================================
 * REDUX STATE UPDATES:
 * ===============================================
 * 
 * On successful review initiation, the following is dispatched:
 * 
 *   setCurrentConsultation({
 *     id: "review-version-uuid",
 *     versionId: "review-version-uuid",
 *     version_type: "review",
 *     is_final: false,
 *     flowType: "lecturer_reviewing",
 *     appointmentId: "appointment-uuid"
 *   })
 * 
 * This prepares the Redux state for the consultation editor view.
 * 
 * ===============================================
 * TESTING CHECKLIST:
 * ===============================================
 * 
 * □ Button shows only for lecturers with canGradeStudents permission
 * □ Button shows only for "submitted for review" and "under review" statuses
 * □ Clicking button opens ReviewModal
 * □ Modal fetches existing versions on open
 * □ Modal checks for existing review version
 * □ If review exists: navigates immediately without API call
 * □ If review doesn't exist: calls initiate-review endpoint
 * □ 200 OK response: shows info toast and navigates
 * □ 201 CREATED response: shows success toast with record count and navigates
 * □ 400 BAD REQUEST: shows error toast and provides retry option
 * □ Redux state updated with review version data
 * □ Navigation works to /consultation/{appointmentId}?version={reviewVersionId}
 * □ Modal closes after successful navigation
 * □ Retry button works in error state
 * 
 */

export const REVIEW_ENDPOINT = "/consultations/versions/{version_id}/initiate-review/";
export const REVIEW_VERSION_TYPE = "reviewed";
export const FLOW_TYPE_LECTURER = "lecturer_reviewing";
