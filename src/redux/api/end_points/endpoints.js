/**
 * API Endpoints
 *
 * This file contains all API endpoint URLs for Authentication, Dashboard,
 * Patients, Appointments, and Examinations. Each section is modularized
 * for better maintainability and scalability.
 *
 */

/////////////////////////
// Authentication
/////////////////////////

export const loginUrl = "auth/auth/jwt/create/";
export const logoutUrl = "/auth/api/logout/";
export const checkSessionUrl = "auth/api/check-session/";
export const getUserUrl = "auth/auth/users/me/";

/////////////////////////
// Dashboard
/////////////////////////

export const getDashboardDataUrl = "summary/api/dashboard/";

/////////////////////////
// Patients
/////////////////////////

// Fetch single patient details
export const fetchSinglePatientDetailsUrl = (patientId) =>
  `/clients/api/patient-detail/${patientId}/`;

// Search for patients
export const searchPatientsUrl = (searchQuery) =>
  `/clients/api/search/?search=${searchQuery}`;

// Update patient details
export const updatePatientDetailsUrl = (patientId) =>
  `/clients/api/update-patient/${patientId}/`;

// List all patients
export const listAllPatientsUrl = `/clients/api/patients/`;

// Create a new patient
export const createNewPatientUrl = "/clients/api/patients/";

// Fetch patient appointments
export const fetchPatientAppointmentsUrl = (patientId) =>
  `/clients/api/${patientId}/appointments/`;

/////////////////////////
// Appointments
/////////////////////////

export const createNewAppointmentUrl = "/clients/api/appointments/";
export const fetchAppointmentsUrl = "clients/api/appointments/";
export const getAppointmentsDetailsUrl = (appointmentId) =>
  `/clients/api/appointments/${appointmentId}/`;

// ✅ Mark appointment as completed
export const markAppointmentCompletedUrl = (appointmentId) =>
  `/clients/api/${appointmentId}/complete/`;

// ✅ Get today's appointments
export const getTodaysAppointmentUrl = "/clients/api/appointments/today/";

/////////////////////////
// Case History
/////////////////////////

export const createCaseHistoryUrl = "/tests/api/case-history/";
export const updateCaseHistoryUrl = (appointmentId) =>
  `/tests/api/case-history/${appointmentId}/`;
export const fetchCaseHistoryUrl = (appointmentId) =>
  `/tests/api/case-history/${appointmentId}/`;

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
  "/tests/conditions?category=medical_history";
export const fetchOcularConditionsUrl =
  "/tests/conditions?category=ocular_history";
export const fetchDirectQuestioningConditionsUrl =
  "/tests/conditions?category=on_direct_questioning";

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
// Absent Requests
/////////////////////////

// List or create absent requests
export const absentRequestsUrl = "/absences/absent-requests/";

// Update absent request by ID
export const updateAbsentRequestUrl = (id) => `/absences/absent-requests/${id}/`;


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
// WebSocket
/////////////////////////

// Dynamically generate the WebSocket URL for appointments

// export const appointmentsWebSocketUrl = () =>
//   "wss://optometryclinic-production.up.railway.app/ws/appointments/";
