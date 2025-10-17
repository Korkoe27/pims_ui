/**
 * API Endpoints
 *
 * This file contains all API endpoint URLs for Authentication, Dashboard,
 * Patients, Appointments, and Examinations. Each section is modular// Create a new diagnosis for an appointment
export const createDiagnosisUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/create/`;

// Update an existing diagnosis for an appointment (same endpoint, different method)
export const updateDiagnosisUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/create/`;

// List all diagnoses (master list)
export const listAllDiagnosesUrl = "/diagnosis/codes/";or better maintainability and scalability.
 *
 */

/////////////////////////
// Authentication
/////////////////////////

export const loginUrl = "auth/api/auth/jwt/create/";
export const logoutUrl = "auth/api/auth/logout/";
export const checkSessionUrl = "auth/api/auth/check-session/";
export const getUserUrl = "auth/api/auth/users/me/";

/////////////////////////
// Dashboard
/////////////////////////

export const getDashboardDataUrl = "summary/api/dashboard/";

/////////////////////////
// Patients
/////////////////////////

// Fetch single patient details
export const fetchSinglePatientDetailsUrl = (patientId) =>
  `/clients/patient-detail/${patientId}/`;

// Search for patients
export const searchPatientsUrl = (searchQuery) =>
  `/clients/search/?search=${searchQuery}`;

// Update patient details
export const updatePatientDetailsUrl = (patientId) =>
  `/clients/update-patient/${patientId}/`;

// List all patients
export const listAllPatientsUrl = `/clients/`;

// Create a new patient
export const createNewPatientUrl = "/clients/";
// Fetch patient appointments
export const fetchPatientAppointmentsUrl = (patientId) =>
  `/clients/${patientId}/appointments/`;

/////////////////////////
// Appointments
/////////////////////////

export const createNewAppointmentUrl = "/clients/appointments/";
export const fetchAppointmentsUrl = "/clients/appointments/";
export const getAppointmentsDetailsUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/`;

// ✅ Mark appointment as completed
export const markAppointmentCompletedUrl = (appointmentId) =>
  `/clients/${appointmentId}/complete/`;

// ✅ Get today's appointments
export const getTodaysAppointmentUrl = "/clients/appointments/today/";

// Reuse your existing FSM transition:
export const transitionAppointmentUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/transition/`;

// Submit for review
export const submitAppointmentForReviewUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/submit_for_review/`;

// Flow context
export const flowContextAppointmentUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/flow-context/`;


//Fetch appointment types
export const fetchAppointmentTypesUrl = "/clients/appointment-types/";

/////////////////////////
// Case History
/////////////////////////

// POST here to create/update by appointment (payload must include `appointment`)
export const createOrUpdateCaseHistoryUrl = "/tests/case-history/";

// GET with query param to fetch latest by appointment
export const fetchCaseHistoryUrl = (appointmentId) =>
  `/tests/case-history/?appointment=${appointmentId}`;

/////////////////////////
// Patient History
/////////////////////////

export const fetchPatientHistoryUrl = (patientId) =>
  `/tests/api/patient-history/latest/?patient=${patientId}`;

// Create a new patient history (only if none exists)
export const createPatientHistoryUrl = "/tests/api/patient-history/";

/////////////////////////
// Medical, Ocular & On Direct Question Conditions
/////////////////////////

export const fetchMedicalConditionsUrl =
  "/tests/case-history/conditions?category=medical_history";
export const fetchOcularConditionsUrl =
  "/tests/case-history/conditions?category=ocular_history";
export const fetchDirectQuestioningConditionsUrl =
  "/tests/case-history/conditions?category=on_direct_questioning";

/////////////////////////
// Visual Acuity
/////////////////////////

// ✅ Create a new Visual Acuity record
export const createVisualAcuityUrl = "/tests/api/visual-acuity/";

// ✅ Fetch an existing Visual Acuity record by appointment ID
export const fetchVisualAcuityUrl = (appointmentId) =>
  `/tests/api/visual-acuity/${appointmentId}/`;

///////////////////////////////
// Externals & Internals Base
//////////////////////////////

const fetchInternalExternalExaminationConditionsUrl = (type) =>
  `/tests/api/examination-conditions/?type=${type}`;

/////////////////////////
// Externals
/////////////////////////

export const externalUrl =
  fetchInternalExternalExaminationConditionsUrl("external");
export const createExternalObservationUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;
export const fetchExternalObservationsUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;

/////////////////////////
// Internals
/////////////////////////

export const internalUrl =
  fetchInternalExternalExaminationConditionsUrl("internal");
export const fetchInternalObservationsUrl = (appointmentId) =>
  `/tests/api/internal-observations/${appointmentId}/`;
export const createInternalsUrl = (appointmentId) =>
  `/tests/api/internal-observations/${appointmentId}/`;

/////////////////////////
// Refraction
/////////////////////////

export const createRefractionUrl = (appointmentId) =>
  `/tests/api/refraction/${appointmentId}/`;
export const fetchRefractionUrl = (appointmentId) =>
  `/tests/api/refraction/${appointmentId}/`;

/////////////////////////
// Extra Tests
/////////////////////////

export const createExtraTestUrl = (appointmentId) =>
  `/tests/extra-tests/${appointmentId}/`;
export const fetchExtraTestsUrl = (appointmentId) =>
  `/tests/extra-tests/${appointmentId}/`;

/////////////////////////
// Diagnosis
/////////////////////////

// Create a new diagnosis for an appointment
export const createDiagnosisUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/create/`;

// Update an existing diagnosis for an appointment (same endpoint, different method)
export const updateDiagnosisUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/create/`;

// List all diagnoses (master list)
export const listAllDiagnosesUrl = "/diagnosis/codes/";

// Fetch all diagnoses assigned to a specific appointment
export const fetchAppointmentDiagnosesUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/view/`;

/////////////////////////
// Management (Medications)
/////////////////////////

// List all medication types
export const listMedicationTypesUrl = "/pharmacy/medication-types/";

// List all medications
export const listMedicationsUrl = "/pharmacy/medications/";

// Filter medications by type (e.g. /pharmacy/api/medications/?type=1)
export const filterMedicationsUrl = (typeId) =>
  `/pharmacy/api/medications/?type=${typeId}`;

/////////////////////////
// Management Plan
/////////////////////////

// Create a new Management Plan OR fetch the most recent one
export const managementPlanUrl = (appointmentId) =>
  `/management/${appointmentId}/`;

/////////////////////////
// Case Management Guide
/////////////////////////

// Get/Create Case Management Guide
export const caseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/create/${appointmentId}/`;

// Update Case Management Guide
export const updateCaseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/${appointmentId}/`;

// Delete Case Management Guide
export const deleteCaseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/${appointmentId}/`;

/////////////////////////
// Absent Requests
/////////////////////////

// List or create absent requests
export const absentRequestsUrl = "/absences/absent-requests/";

// Update absent request by ID
export const updateAbsentRequestUrl = (id) =>
  `/absences/absent-requests/${id}/`;

/////////////////////////
// Clinic Schedule
/////////////////////////

// List or create clinic schedules
export const clinicScheduleUrl = "/clinic-schedule/schedules/";

// Fetch schedules for a specific date
export const fetchClinicScheduleByDateUrl = (date) =>
  `/clinic-schedule/schedules/?date=${date}`;

// Get all staff that can be scheduled
export const listScheduleStaffUrl = "/clinic-schedule/staff/";

/////////////////////////
// Pharmacy
/////////////////////////

// List or create pharmacy orders
// Pharmacy Order
export const getPharmacyOrderUrl = (appointmentId) =>
  `/pharmacy/api/orders/${appointmentId}/`;
export const upsertPharmacyOrderUrl = (appointmentId) =>
  `/pharmacy/api/orders/${appointmentId}/`;

/////////////////////////
// Grading
/////////////////////////

// Get all grades for an appointment
export const gradingUrl = (appointmentId) =>
  `/grading/api/appointments/${appointmentId}/grades/`;

// Grade a specific section
export const sectionGradingUrl = (appointmentId, section) =>
  `/grading/api/appointments/${appointmentId}/sections/${section}/`;

// Final grading
export const finalGradingUrl = (appointmentId) =>
  `/grading/api/appointments/${appointmentId}/final/`;

/////////////////////////
// Consultation Management
/////////////////////////

// List consultations (with filters)
export const listConsultationsUrl = "/consultations/";

// Get consultation details
export const getConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/`;

// Update consultation
export const updateConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/`;

// Delete consultation (admin only)
export const deleteConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/`;

// Start new consultation
export const startConsultationUrl = "/consultations/start/";

// Transition to new status
export const transitionConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/transition/`;

// Student submits for review
export const submitConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/submit/`;

// Complete consultation (appointment-based)
export const completeConsultationUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/complete/`;

// Admin status override
export const overrideConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/override/`;

/////////////////////////
// WebSocket
/////////////////////////

// Dynamically generate the WebSocket URL for appointments

// export const appointmentsWebSocketUrl = () =>
//   "wss://optometryclinic-production.up.railway.app/ws/appointments/";
