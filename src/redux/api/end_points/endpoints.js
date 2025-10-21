/**
 * API Endpoints
 *
 * Centralized list of all backend REST endpoints.
 * Organized by module for easy maintainability and scalability.
 */

/////////////////////////
// Authentication
/////////////////////////

export const loginUrl = "auth/api/auth/jwt/create/";
export const logoutUrl = "auth/api/auth/logout/";
export const checkSessionUrl = "auth/api/auth/check-session/";


/////////////////////////
// Dashboard
/////////////////////////

export const getDashboardDataUrl = "summary/api/dashboard/";


/////////////////////////
// Patients
/////////////////////////

// List or create patients
export const listAllPatientsUrl = "/clients/";
export const createNewPatientUrl = "/clients/";

// Retrieve or update a single patient
export const fetchSinglePatientDetailsUrl = (patientId) => `/clients/${patientId}/`;
export const updatePatientDetailsUrl = (patientId) => `/clients/${patientId}/`;

// Search for patients
export const searchPatientsUrl = (searchQuery) =>
  `/clients/search/?search=${searchQuery}`;

// Fetch all appointments for a patient
export const fetchPatientAppointmentsUrl = (patientId) =>
  `/clients/${patientId}/appointments/`;


/////////////////////////
// Appointments
/////////////////////////

// List or create appointments
export const createNewAppointmentUrl = "/clients/appointments/";
export const fetchAppointmentsUrl = "/clients/appointments/";

// Retrieve, update, or delete appointment
export const getAppointmentsDetailsUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/`;

// Mark appointment as completed
export const markAppointmentCompletedUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/complete/`;

// Submit appointment for lecturer review
export const submitAppointmentForReviewUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/submit-for-review/`;

// View grading checklist for appointment
export const fetchAppointmentGradingChecklistUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/grading-checklist/`;

// Get today's appointments
export const getTodaysAppointmentUrl = "/clients/appointments/today/";

// Fetch appointment types
export const fetchAppointmentTypesUrl = "/clients/appointments/types/";


/////////////////////////
// Case History
/////////////////////////

export const createOrUpdateCaseHistoryUrl = "/tests/case-history/";
export const fetchCaseHistoryUrl = (appointmentId) =>
  `/tests/case-history/?appointment=${appointmentId}`;


/////////////////////////
// Patient History
/////////////////////////

export const fetchPatientHistoryUrl = (patientId) =>
  `/tests/api/patient-history/latest/?patient=${patientId}`;
export const createPatientHistoryUrl = "/tests/api/patient-history/";


/////////////////////////
// Medical, Ocular & Direct Question Conditions
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

export const createVisualAcuityUrl = "/tests/api/visual-acuity/";
export const fetchVisualAcuityUrl = (appointmentId) =>
  `/tests/api/visual-acuity/${appointmentId}/`;


/////////////////////////
// External & Internal Observations
/////////////////////////

const fetchInternalExternalExaminationConditionsUrl = (type) =>
  `/tests/api/examination-conditions/?type=${type}`;

export const externalUrl =
  fetchInternalExternalExaminationConditionsUrl("external");
export const createExternalObservationUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;
export const fetchExternalObservationsUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;

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

export const createDiagnosisUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/create/`;
export const updateDiagnosisUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/create/`;
export const listAllDiagnosesUrl = "/diagnosis/codes/";
export const fetchAppointmentDiagnosesUrl = (appointmentId) =>
  `/diagnosis/${appointmentId}/view/`;


/////////////////////////
// Management (Medications)
/////////////////////////

export const listMedicationTypesUrl = "/pharmacy/medication-types/";
export const listMedicationsUrl = "/pharmacy/medications/";
export const filterMedicationsUrl = (typeId) =>
  `/pharmacy/api/medications/?type=${typeId}`;


/////////////////////////
// Management Plan
/////////////////////////

export const managementPlanUrl = (appointmentId) =>
  `/management/${appointmentId}/`;


/////////////////////////
// Case Management Guide
/////////////////////////

export const caseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/create/${appointmentId}/`;
export const updateCaseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/${appointmentId}/`;
export const deleteCaseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/${appointmentId}/`;


/////////////////////////
// Absent Requests
/////////////////////////

export const absentRequestsUrl = "/absences/absent-requests/";
export const updateAbsentRequestUrl = (id) =>
  `/absences/absent-requests/${id}/`;


/////////////////////////
// Clinic Schedule
/////////////////////////

export const clinicScheduleUrl = "/clinic-schedule/schedules/";
export const fetchClinicScheduleByDateUrl = (date) =>
  `/clinic-schedule/schedules/?date=${date}`;
export const listScheduleStaffUrl = "/clinic-schedule/staff/";


/////////////////////////
// Pharmacy
/////////////////////////

export const getPharmacyOrderUrl = (appointmentId) =>
  `/pharmacy/api/orders/${appointmentId}/`;
export const upsertPharmacyOrderUrl = (appointmentId) =>
  `/pharmacy/api/orders/${appointmentId}/`;


/////////////////////////
// Grading
/////////////////////////

export const gradingUrl = (appointmentId) =>
  `/grading/api/appointments/${appointmentId}/grades/`;
export const sectionGradingUrl = (appointmentId, section) =>
  `/grading/api/appointments/${appointmentId}/sections/${section}/`;
export const finalGradingUrl = (appointmentId) =>
  `/grading/api/appointments/${appointmentId}/final/`;


/////////////////////////
// Consultation Management
/////////////////////////

export const listConsultationsUrl = "/consultations/";
export const getConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/`;
export const updateConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/`;
export const deleteConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/`;
export const startConsultationUrl = "/consultations/start/";
export const transitionConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/transition/`;
export const submitConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/submit/`;
export const completeConsultationUrl = (appointmentId) =>
  `/clients/appointments/${appointmentId}/complete/`;
export const overrideConsultationUrl = (consultationId) =>
  `/consultations/${consultationId}/override/`;

/////////////////////////
// Reports
/////////////////////////

// Base Reports Endpoints
export const reportsBaseUrl = "/reports/";

// Individual Report Endpoints
export const patientsReportUrl = "/reports/patients/";
export const appointmentsReportUrl = "/reports/appointments/";
export const gradingsReportUrl = "/reports/gradings/";
export const diagnosisReportUrl = "/reports/diagnosis/";
export const inventoryReportUrl = "/reports/inventory/";


/////////////////////////
// WebSocket
/////////////////////////

// export const appointmentsWebSocketUrl = () =>
//   "wss://optometryclinic-production.up.railway.app/ws/appointments/";
