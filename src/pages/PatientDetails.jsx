import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetPatientAppointmentsQuery } from "../redux/api/features/patientApi";
import CaseHistoryView from "../components/CaseHistoryView";
import PersonalHistoryView from "../components/PersonalHistoryView";

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
  } = useGetPatientAppointmentsQuery(patient?.id, {
    skip: !patient,
  });

  if (!patient) {
    return (
      <div className="px-8 ml-72 mt-8 text-gray-500">
        <h1 className="text-xl font-bold">Patient Details</h1>
        <p>No patient data available.</p>
      </div>
    );
  }

  const tabs = [
    { label: "More Info", value: "info" },
    { label: "Appointments", value: "appointments" },
  ];

  const modalTabs = [
    { label: "Case History", value: "casehistory" },
    { label: "Personal History", value: "personalhistory" },
    { label: "Visual Acuity", value: "visualacuity" },
    { label: "Externals", value: "externals" },
    { label: "Internals", value: "internals" },
    { label: "Refraction", value: "refraction" },
    { label: "Extra Test", value: "extratest" },
    { label: "Diagnosis", value: "diagnosis" },
    { label: "Management", value: "management" },
  ];

  return (
    <div className="px-8 ml-72 mt-8 w-full space-y-8">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-[#2f3192] mb-4">
          Patient Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail
            label="Name"
            value={`${patient.first_name} ${patient.last_name}`}
          />
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
          <TabButton
            key={tab.value}
            {...tab}
            active={activeTab}
            onClick={setActiveTab}
          />
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

      {/* Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 w-3/4 rounded shadow-lg relative">
            <h3 className="text-xl font-bold text-[#2f3192] mb-4">
              Appointment Details
            </h3>

            {/* Modal Tabs */}
            <div className="border-b flex">
              {modalTabs.map((tab) => (
                <TabButton
                  key={tab.value}
                  {...tab}
                  active={modalTab}
                  onClick={setModalTab}
                />
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
              {/* {modalTab === "visualacuity" && (
                <VisualAcuityView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "diagnosis" && (
                <DiagnosisView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "management" && (
                <ManagementView appointmentId={selectedAppointment.id} />
              )}
              {modalTab === "refraction" && <p>Details about refraction...</p>}
              {modalTab === "extratest" && <p>Details about extra tests...</p>} */}
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
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <h4 className="font-bold text-gray-700">{label}</h4>
    <p className="text-gray-600">{value || "N/A"}</p>
  </div>
);

const PatientInfoSection = ({ patient }) => (
  <div className="bg-gray-50 p-6 rounded shadow">
    <h3 className="text-xl font-bold text-[#2f3192] mb-4">
      Patient Information
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Detail label="Generated ID" value={patient.generated_id_number} />
      <Detail label="ID Type" value={patient.id_type} />
      <Detail label="ID Number" value={patient.id_number} />
      <Detail label="Primary Phone" value={patient.primary_phone} />
      <Detail label="Alternate Phone" value={patient.alternate_phone} />
      <Detail label="Address" value={patient.address} />
      <Detail label="Landmark" value={patient.landmark} />
      <Detail label="Region" value={patient.region} />
      <Detail
        label="Emergency Contact"
        value={patient.emergency_contact_name}
      />
      <Detail
        label="Emergency Number"
        value={patient.emergency_contact_number}
      />
      <Detail label="Insurance Type" value={patient.insurance_type} />
      <Detail label="Insurance Provider" value={patient.insurance_provider} />
      <Detail label="Insurance Number" value={patient.insurance_number} />
      <Detail label="Date of First Visit" value={patient.date_of_first_visit} />
      <Detail label="Registration Date" value={patient.registration_date} />
    </div>
  </div>
);

const AppointmentSection = ({ appointments, isLoading, error, onView }) => (
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
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id} className="bg-white border-b">
              <td className="px-6 py-4">{appt.appointment_date}</td>
              <td className="px-6 py-4">{appt.appointment_type}</td>
              <td className="px-6 py-4">{appt.status}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onView(appt)}
                  className="bg-[#2f3192] text-white px-4 py-2 rounded hover:bg-[#1e226d]"
                >
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default PatientDetails;
