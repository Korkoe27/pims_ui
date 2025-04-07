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

export const fetchMedicalConditionsUrl = "/tests/api/medical-conditions/";
export const fetchOcularConditionsUrl = "/tests/api/ocular-conditions/";
export const fetchDirectQuestioningConditionsUrl = "/tests/api/direct-questioning-conditions/";


/////////////////////////
// Visual Acuity
/////////////////////////

// ✅ Create a new Visual Acuity record
export const createVisualAcuityUrl = "/tests/api/visual-acuity/";

// ✅ Fetch an existing Visual Acuity record by appointment ID
export const fetchVisualAcuityUrl = (appointmentId) =>
  `/tests/api/visual-acuity/${appointmentId}/`;

/////////////////////////
// Externals
/////////////////////////

export const fetchExternalConditionsUrl = "/tests/api/external-conditions/";
export const createExternalObservationUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;
export const fetchExternalObservationsUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;

/////////////////////////
// Internals
/////////////////////////

/////////////////////////
// Internals
/////////////////////////

export const fetchInternalConditionsUrl = "/tests/api/internal-conditions/";
export const fetchInternalsUrl = (appointmentId) =>
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

export const createExtraTestsUrl = "/tests/api/extra-tests/";
export const updateExtraTestsUrl = (appointmentId) =>
  `/tests/api/extra-tests/${appointmentId}/`;
export const fetchExtraTestsUrl = (appointmentId) =>
  `/tests/api/extra-tests/${appointmentId}/`;
