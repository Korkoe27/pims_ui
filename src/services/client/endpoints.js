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

/////////////////////////
// Dashboard
/////////////////////////

export const getDashboardStatUrl = "summary/api/dashboard/";

/////////////////////////
// Patients
/////////////////////////

export const fetchSinglePatientDetailsUrl = (patientId) =>
  `/clients/api/patient-detail/${patientId}/`;
export const searchPatientsUrl = (searchQuery) =>
  `/clients/api/search/?search=${searchQuery}`;
export const updatePatientDetailsUrl = (patientId) =>
  `/clients/api/update-patient/${patientId}/`;
export const listAllPatientsUrl = "clients/api/patients/";
export const creatNewPatientUrl = (patientId) =>
  `/clients/api/update-patient/${patientId}/`;

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
