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

export const loginUrl = "auth/api/login/";
export const logoutUrl = "auth/api/logout/";
export const checkSessionUrl = "auth/api/check-session/";

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
export const listAllPatientsUrl = "/clients/api/patients/";

// Create a new patient (removed patientId, as it's not required for creating a new resource)
export const createNewPatientUrl = "/clients/api/create-patient/";


/////////////////////////
// Appointments
/////////////////////////

export const createNewAppointmentUrl = "/tests/clients/api/appointments/";
export const fetchAppointmentsUrl = "clients/api/appointments/";
export const getAppointmentsDetailsUrl = (appointmentId) =>
  `/tests/clients/api/appointments/${appointmentId}/`;

/////////////////////////
// Case History
/////////////////////////

export const createCaseHistoryUrl = "/tests/api/case-history/";
export const updateCaseHistoryUrl = (appointmentId) =>
  `/tests/api/case-history/${appointmentId}/`;
export const fetchCaseHistoryUrl = (appointmentId) =>
  `/tests/api/case-history/${appointmentId}/`;

/////////////////////////
// Visual Acuity
/////////////////////////

export const createVisualAcuityUrl = "/tests/api/visual-acuity/";
export const updateVisualAcuityUrl = (appointmentId) =>
  `/tests/api/visual-acuity/${appointmentId}/`;
export const fetchVisualAcuityUrl = (appointmentId) =>
  `/tests/api/visual-acuity/${appointmentId}/`;

/////////////////////////
// Externals
/////////////////////////

export const createExternalsUrl = "/tests/api/externals/";
export const updateExternalsUrl = (appointmentId) =>
  `/tests/api/externals/${appointmentId}/`;
export const fetchExternalsUrl = (appointmentId) =>
  `/tests/api/externals/${appointmentId}/`;

/////////////////////////
// Internals
/////////////////////////

export const createInternalsUrl = "/tests/api/internals/";
export const updateInternalsUrl = (appointmentId) =>
  `/tests/api/internals/${appointmentId}/`;
export const fetchInternalsUrl = (appointmentId) =>
  `/tests/api/internals/${appointmentId}/`;

/////////////////////////
// Refraction
/////////////////////////

export const createRefractionUrl = "/tests/api/refraction/";
export const updateRefractionUrl = (appointmentId) =>
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
