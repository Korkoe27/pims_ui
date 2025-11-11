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

// Fetch all insurances for a patient
export const fetchPatientInsurancesUrl = (patientId) =>
  `/clients/${patientId}/insurances/`;

// Create a new insurance for a patient
export const createInsuranceUrl = (patientId) =>
  `/clients/${patientId}/insurances/create/`;

// Fetch insurance options (types and providers)
export const fetchInsuranceOptionsUrl = "/clients/insurance/options/";

// Fetch patient registration options (regions and occupation categories)
export const fetchPatientOptionsUrl = "/clients/options/";

// Fetch regions
export const fetchRegionsUrl = "/clients/regions/";

// Fetch occupation categories
export const fetchOccupationCategoriesUrl = "/clients/occupation-categories/";


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
export const fetchCaseHistoryByVersionUrl = (appointmentId, versionId) =>
  `/tests/case-history/?appointment=${appointmentId}&consultation_version=${versionId}`;


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
// Visual Acuity
/////////////////////////

export const createVisualAcuityUrl = "/tests/api/visual-acuity/";
export const fetchVisualAcuityUrl = (appointmentId) =>
  `/tests/api/visual-acuity/${appointmentId}/`;
export const fetchVisualAcuityByVersionUrl = (appointmentId, versionId) =>
  `/tests/api/visual-acuity/${appointmentId}/?consultation_version=${versionId}`;
// External & Internal Observations
/////////////////////////
// External & Internal Observations
/////////////////////////

const fetchInternalExternalExaminationConditionsUrl = (type) =>
  `/tests/api/conditions?type=${type}`;

export const externalUrl =
  fetchInternalExternalExaminationConditionsUrl("external");
export const createExternalObservationUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;
export const fetchExternalObservationsUrl = (appointmentId) =>
  `/tests/api/external-observations/${appointmentId}/`;
export const fetchExternalObservationsByVersionUrl = (appointmentId, versionId) =>
  `/tests/api/external-observations/${appointmentId}/?consultation_version=${versionId}`;

export const internalUrl =
  fetchInternalExternalExaminationConditionsUrl("internal");
export const fetchInternalObservationsUrl = (appointmentId) =>
  `/tests/api/internal-observations/${appointmentId}/`;
export const fetchInternalObservationsByVersionUrl = (appointmentId, versionId) =>
  `/tests/api/internal-observations/${appointmentId}/?consultation_version=${versionId}`;
export const createInternalsUrl = (appointmentId) =>
  `/tests/api/internal-observations/${appointmentId}/`;


/////////////////////////
// Refraction
/////////////////////////

export const createRefractionUrl = (appointmentId) =>
  `/tests/api/refraction/${appointmentId}/`;
export const fetchRefractionUrl = (appointmentId) =>
  `/tests/api/refraction/${appointmentId}/`;
export const fetchRefractionByVersionUrl = (appointmentId, versionId) =>
  `/tests/api/refraction/${appointmentId}/?consultation_version=${versionId}`;


/////////////////////////
// Extra Tests
/////////////////////////

export const fetchTonometryMethodsUrl = "/tests/extra-tests/tonometry-methods/";
export const createExtraTestUrl = (appointmentId) =>
  `/tests/extra-tests/${appointmentId}/`;
export const fetchExtraTestsUrl = (appointmentId) =>
  `/tests/extra-tests/${appointmentId}/`;
export const fetchExtraTestsByVersionUrl = (appointmentId, versionId) =>
  `/tests/extra-tests/${appointmentId}/?consultation_version=${versionId}`;


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
export const fetchAppointmentDiagnosesByVersionUrl = (appointmentId, versionId) =>
  `/diagnosis/${appointmentId}/view/?consultation_version=${versionId}`;


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
export const managementPlanByVersionUrl = (appointmentId, versionId) =>
  `/management/${appointmentId}/?consultation_version=${versionId}`;


/////////////////////////
// Case Management Guide
/////////////////////////

export const caseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/create/${appointmentId}/`;
export const caseManagementGuideByVersionUrl = (appointmentId, versionId) =>
  `/management/case-guide/create/${appointmentId}/?consultation_version=${versionId}`;
export const updateCaseManagementGuideUrl = (appointmentId) =>
  `/management/case-guide/${appointmentId}/`;
export const updateCaseManagementGuideByVersionUrl = (appointmentId, versionId) =>
  `/management/case-guide/${appointmentId}/?consultation_version=${versionId}`;
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
export const availableStaffUrl = (date = null) =>
  date ? `/clinic-schedule/available-staff/?date=${date}` : "/clinic-schedule/available-staff/";


/////////////////////////
// Pharmacy
/////////////////////////

export const getPharmacyOrderUrl = (appointmentId) =>
  `/pharmacy/api/orders/${appointmentId}/`;
export const upsertPharmacyOrderUrl = (appointmentId) =>
  `/pharmacy/api/orders/${appointmentId}/`;


/////////////////////////
// Billing & Payments
/////////////////////////

// Pharmacy Bills
export const pharmacyBillsUrl = "/billing/bills/";
export const pharmacyBillDetailUrl = (billId) => `/billing/bills/${billId}/`;
export const appointmentBillsUrl = (appointmentId) =>
  `/billing/bills/appointment/${appointmentId}/`;
export const pendingBillsUrl = "/billing/bills/pending/";

// Payments
export const paymentsUrl = "/billing/payments/";
export const paymentDetailUrl = (paymentId) => `/billing/payments/${paymentId}/`;
export const billPaymentsUrl = (billId) =>
  `/billing/payments/bill/${billId}/`;
export const billPaymentSummaryUrl = (billId) =>
  `/billing/payments/bill/${billId}/summary/`;


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
// Consultation Versions
/////////////////////////

/**
 * Version listing and history per appointment
 * Example: GET consultations/versions/<appointment_id>/
 */
export const listConsultationVersionsUrl = (appointmentId) =>
  `consultations/versions/${appointmentId}/`; // ✅ no leading slash

/**
 * Fetch a specific version's data (optional, if backend supports)
 * Example: GET consultations/versions/view/<version_id>/
 */
export const getConsultationVersionUrl = (versionId) =>
  `consultations/versions/view/${versionId}/`; // ✅ no leading slash

/**
 * Initiate review: Clone student version to reviewed version
 * Example: POST consultations/versions/<version_id>/initiate-review/
 * Only works for submitted student consultations
 * Creates new reviewed version with cloned data
 */
export const initiateReviewUrl = (versionId) =>
  `consultations/versions/${versionId}/initiate-review/`; // ✅ no leading slash

/**
 * Mark a version as final (optional administrative endpoint)
 * Example: POST consultations/versions/<version_id>/finalize/
 */
export const finalizeConsultationVersionUrl = (versionId) =>
  `consultations/versions/${versionId}/finalize/`; // ✅ no leading slash



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
