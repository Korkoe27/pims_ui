import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPatientAppointmentsQuery } from "../redux/api/features/patientApi";
import CaseHistoryView from "../components/CaseHistoryView";
import PersonalHistoryView from "../components/PersonalHistoryView";
import VisualAcuityView from "../components/VisualAcuityView";
import ExternalsView from "../components/ExternalsView";
import InternalsView from "../components/InternalsView";
import RefractionView from "../components/RefractionView";
import ExtraTestsView from "../components/ExtraTestsView";
import DiagnosisView from "../components/DiagnosisView";
import ManagementView from "../components/ManagementView";
import PageContainer from "../components/PageContainer";
import ViewAppointmentButton from "../components/ui/buttons/ViewAppointmentButton";

const TabButton = ({ label, value, active, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-6 py-2 font-semibold ${
      active === value
        ? "border-b-2 border-[#2f3192] text-[#2f3192]"
        : "text-gray-500 hover:text-[#2f3192]"
    }`}
  >
    {label}
  </button>
);

const PatientDetails = () => {
  const { state } = useLocation();
  const { patient } = state || {};
  const [activeTab, setActiveTab] = useState("info");
  const [modalTab, setModalTab] = useState("casehistory");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const {
    data: appointments,
    isLoading,
    error,
  } = useGetPatientAppointmentsQuery(patient?.id, { skip: !patient });

  const tabs = [
    { label: "More Info", value: "info" },
    { label: "Appointments", value: "appointments" },
  ];

  const modalTabs = [
    { label: "Case History", value: "casehistory" },
    { label: "Oculo-Medical History", value: "personalhistory" },
    { label: "Visual Acuity", value: "visualacuity" },
    { label: "Externals", value: "externals" },
    { label: "Internals", value: "internals" },
    { label: "Refraction", value: "refraction" },
    { label: "Extra Test", value: "extratest" },
    { label: "Diagnosis", value: "diagnosis" },
    { label: "Management", value: "management" },
  ];

  if (!patient) {
    return (
      <PageContainer>
        <div className="text-gray-500">
          <h1 className="text-xl font-bold">Patient Details</h1>
          <p>No patient data available.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="w-full space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold text-[#2f3192] mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Detail label="Name" value={`${patient.first_name} ${patient.last_name}`} />
            <Detail label="Patient ID" value={patient.patient_id} />
            <Detail label="Phone" value={patient.primary_phone} />
            <Detail label="Age" value={patient.age} />
            <Detail label="Gender" value={patient.gender} />
            <Detail label="Date of Birth" value={patient.dob} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b flex">
          {tabs.map((tab) => (
            <TabButton key={tab.value} {...tab} active={activeTab} onClick={setActiveTab} />
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && <PatientInfoSection patient={patient} />}
        {activeTab === "appointments" && (
          <AppointmentSection
            appointments={appointments}
            isLoading={isLoading}
            error={error}
            onView={(appt) => setSelectedAppointment(appt)}
          />
        )}
      </div>

      {/* Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 w-3/4 rounded shadow-lg relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#2f3192] mb-4">Appointment Details</h3>

            <div className="border-b flex">
              {modalTabs.map((tab) => (
                <TabButton key={tab.value} {...tab} active={modalTab} onClick={setModalTab} />
              ))}
            </div>

            <div className="mt-4">
              {modalTab === "casehistory" && (
                <CaseHistoryView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "personalhistory" && (
                <PersonalHistoryView
                  patientId={selectedAppointment.patient}
                  appointmentId={selectedAppointment.id}
                />
              )}
              {modalTab === "visualacuity" && (
                <VisualAcuityView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "externals" && (
                <ExternalsView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "internals" && (
                <InternalsView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "refraction" && (
                <RefractionView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "extratest" && (
                <ExtraTestsView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "diagnosis" && (
                <DiagnosisView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "management" && (
                <ManagementView appointmentId={selectedAppointment.id} />
              )}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <h4 className="font-bold text-gray-700">{label}</h4>
    <p className="text-gray-600">{value || "N/A"}</p>
  </div>
);

const PatientInfoSection = ({ patient }) => (
  <div className="space-y-6">
    {/* Patient Information */}
    <div className="bg-gray-50 p-6 rounded shadow">
      <h3 className="text-xl font-bold text-[#2f3192] mb-4">Patient Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Detail label="ID Type" value={patient.id_type} />
        <Detail label="ID Number" value={patient.id_number} />
        <Detail label="Primary Phone" value={patient.primary_phone} />
        <Detail label="Alternate Phone" value={patient.alternate_phone} />
        <Detail label="Address" value={patient.address} />
        <Detail label="Landmark" value={patient.landmark} />
        <Detail label="Region" value={patient.region} />
        <Detail label="Emergency Contact" value={patient.emergency_contact_name} />
        <Detail label="Emergency Number" value={patient.emergency_contact_number} />
        <Detail label="Date of First Visit" value={patient.date_of_first_visit} />
        <Detail label="Registration Date" value={patient.registration_date} />
      </div>
    </div>

    {/* Insurance Section */}
    <div className="bg-gray-50 p-6 rounded shadow">
      <h3 className="text-xl font-bold text-[#2f3192] mb-4">Insurance Information</h3>
      {patient.insurances && patient.insurances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patient.insurances.map((insurance) => (
            <InsuranceCard key={insurance.id} insurance={insurance} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No insurance records available.</p>
      )}
    </div>
  </div>
);

const InsuranceCard = ({ insurance }) => {
  const isExpired = insurance.is_expired;
  const isActive = insurance.is_active;
  
  // Determine status badge
  let statusBadge;
  if (isExpired) {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        Expired
      </span>
    );
  } else if (isActive) {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        Active
      </span>
    );
  } else {
    statusBadge = (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
        Inactive
      </span>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-800 text-lg">
            {insurance.insurance_provider_name || insurance.insurance_provider}
          </h4>
          <p className="text-sm text-gray-500">
            {insurance.insurance_type_name || insurance.insurance_type}
          </p>
        </div>
        {insurance.is_primary && (
          <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
            Primary
          </span>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Insurance Number:</span>
          <span className="text-sm font-semibold text-gray-800">
            {insurance.insurance_number}
          </span>
        </div>

        {insurance.expiry_date && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Expiry Date:</span>
            <span className="text-sm font-semibold text-gray-800">
              {new Date(insurance.expiry_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Status:</span>
        {statusBadge}
      </div>
    </div>
  );
};

const AppointmentSection = ({ appointments, isLoading, error, onView }) => {
  const access = useSelector((s) => s.auth?.user?.access || {});
  
  // Check if user has permission to view appointment details
  const hasActionAccess = ViewAppointmentButton.shouldShow(access);

  return (
    <div className="bg-gray-50 p-6 rounded shadow">
      <h3 className="text-xl font-bold text-[#2f3192] mb-4">Appointments</h3>
      {isLoading && <p>Loading appointments...</p>}
      {error && <p className="text-red-500">Error fetching appointments.</p>}
      {!isLoading && appointments?.length === 0 && (
        <p className="text-gray-500">No appointments available.</p>
      )}
      {!isLoading && appointments?.length > 0 && (
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              {hasActionAccess && (
                <th className="px-6 py-3">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="bg-white border-b">
                <td className="px-6 py-4">{appt.appointment_date}</td>
                <td className="px-6 py-4">{appt.appointment_type_name}</td>
                <td className="px-6 py-4">{appt.status}</td>
                {hasActionAccess && (
                  <td className="px-6 py-4">
                    <ViewAppointmentButton
                      appointment={appt}
                      onView={() => onView(appt)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientDetails;
