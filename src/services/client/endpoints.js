export const loginUrl = "auth/api/login/";
export const getDashboardStat = "summary/api/dashboard/";

export const listPatients = "clients/api/patients/";

//Appointment Endpoints
export const createAppointment = "/tests/clients/api/appointments/";
export const fetchAppointments = "/tests/clients/api/appointments/";
export const getAppointmentsDetails = "/tests/clients/api/appointments/${appointmentId}/";

// Patient Examination Endpoints
export const createCaseHistory = "/tests/api/case-history/";
export const updateCaseHistory = (appointmentId) =>
  `/tests/api/case-history/${appointmentId}/`; // Use dynamic parameter
export const fetchCaseHistory = (appointmentId) =>
  `/tests/api/case-history/appointment/${appointmentId}/`; // Fetch by appointmentId

// Patient Details Endpoints
export const fetchPatientDetails = (patientId) =>
  `/clients/api/patient-detail/bf3f6001-e66b-4315-9f8b-0907991bd75d/`;
