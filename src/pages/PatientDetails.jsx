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
  const { patient, selectedAppointment: initialAppointment, openModal } = state || {};
  const [activeTab, setActiveTab] = useState(openModal ? "appointments" : "info");
  const [modalTab, setModalTab] = useState("casehistory");
  const [selectedAppointment, setSelectedAppointment] = useState(openModal ? initialAppointment : null);

  const {
    data: appointments,
    isLoading,
    error,
  } = useGetPatientAppointmentsQuery(patient?.id, { skip: !patient });

  const tabs = [
    { label: "More Info", value: "info" },
    { label: "Health Insurance", value: "insurance" },
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
        {activeTab === "insurance" && <InsuranceSection patient={patient} />}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#2f3192]">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

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

const AccordionSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
    >
      <h3 className="text-lg font-semibold text-[#2f3192]">{title}</h3>
      <svg
        className={`w-5 h-5 text-[#2f3192] transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {children}
      </div>
    )}
  </div>
);

const PatientInfoSection = ({ patient }) => {
  const [openSections, setOpenSections] = React.useState({
    personal: true,
    identification: false,
    contact: false,
    address: false,
    occupation: false,
    emergency: false,
    dates: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-3">
      {/* Personal Information */}
      <AccordionSection
        title="Personal Information"
        isOpen={openSections.personal}
        onToggle={() => toggleSection("personal")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="Other Names" value={patient.other_names} />
          <Detail label="Patient Type" value={patient.patient_type} />
          <Detail label="Clinic" value={patient.clinic} />
        </div>
      </AccordionSection>

      {/* Identification */}
      <AccordionSection
        title="Identification"
        isOpen={openSections.identification}
        onToggle={() => toggleSection("identification")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="ID Type" value={patient.id_type} />
          <Detail label="ID Number" value={patient.id_number} />
        </div>
      </AccordionSection>

      {/* Contact Information */}
      <AccordionSection
        title="Contact Information"
        isOpen={openSections.contact}
        onToggle={() => toggleSection("contact")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="Primary Phone" value={patient.primary_phone} />
          <Detail label="Alternate Phone" value={patient.alternate_phone} />
          <Detail label="Email Address" value={patient.email} />
        </div>
      </AccordionSection>

      {/* Address & Location */}
      <AccordionSection
        title="Address & Location"
        isOpen={openSections.address}
        onToggle={() => toggleSection("address")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="Address" value={patient.address} />
          <Detail label="Landmark" value={patient.landmark} />
          <Detail label="Hometown" value={patient.hometown} />
          <Detail label="Region" value={patient.region_name || patient.region} />
        </div>
      </AccordionSection>

      {/* Occupation */}
      <AccordionSection
        title="Occupation"
        isOpen={openSections.occupation}
        onToggle={() => toggleSection("occupation")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="Occupation Category" value={patient.occupation_category_name || patient.occupation_category} />
          <Detail label="Occupation" value={patient.occupation} />
        </div>
      </AccordionSection>

      {/* Emergency Contact */}
      <AccordionSection
        title="Emergency Contact"
        isOpen={openSections.emergency}
        onToggle={() => toggleSection("emergency")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="Contact Name" value={patient.emergency_contact_name} />
          <Detail label="Contact Number" value={patient.emergency_contact_number} />
        </div>
      </AccordionSection>

      {/* Important Dates */}
      <AccordionSection
        title="Important Dates"
        isOpen={openSections.dates}
        onToggle={() => toggleSection("dates")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Detail label="Date of First Visit" value={patient.date_of_first_visit} />
          <Detail label="Registration Date" value={patient.registration_date} />
        </div>
      </AccordionSection>
    </div>
  );
};

const InsuranceSection = ({ patient }) => (
  <div className="bg-gray-50 p-6 rounded shadow">
    <h3 className="text-xl font-bold text-[#2f3192] mb-4">Health Insurance Information</h3>
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
  const roleCodes = useSelector((s) => s.auth?.user?.role_codes || []);
  
  // Check if user has permission to view appointment details
  const hasActionAccess = ViewAppointmentButton.shouldShow(roleCodes);

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
