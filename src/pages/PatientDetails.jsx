import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetPatientAppointmentsQuery } from "../redux/api/features/patientApi";

const PatientDetails = () => {
  const location = useLocation();
  const { patient } = location.state || {};
  const [activeTab, setActiveTab] = useState("info"); // Default active tab
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For modal
  const [appointmentTab, setAppointmentTab] = useState("casehistory"); // Tabs in modal

  // Fetch appointments for the patient
  const { data: appointments, isLoading, error } = useGetPatientAppointmentsQuery(
    patient?.id,
    { skip: !patient } // Skip the query if no patient data
  );

  const handleViewMore = (appointment) => {
    setSelectedAppointment(appointment); // Open modal with selected appointment details
  };

  const closeModal = () => {
    setSelectedAppointment(null); // Close modal
  };

  // Debugging appointments data
  console.log("Fetched Appointments:", appointments);

  if (!patient) {
    return (
      <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
        <h1 className="font-extrabold text-xl">Patient Details</h1>
        <p className="text-gray-500">No patient details available.</p>
      </div>
    );
  }

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-white w-full shadow-lg rounded-lg">
      {/* Patient Basic Info */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#2f3192]">Patient Details</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          <div>
            <h2 className="font-bold text-gray-700">Name:</h2>
            <p className="text-gray-600">{`${patient.first_name} ${patient.last_name}`}</p>
          </div>
          <div>
            <h2 className="font-bold text-gray-700">Patient ID:</h2>
            <p className="text-gray-600">{patient.patient_id || "N/A"}</p>
          </div>
          <div>
            <h2 className="font-bold text-gray-700">Phone Number:</h2>
            <p className="text-gray-600">{patient.primary_phone || "N/A"}</p>
          </div>
          <div>
            <h2 className="font-bold text-gray-700">Age:</h2>
            <p className="text-gray-600">{patient.age || "N/A"}</p>
          </div>
          <div>
            <h2 className="font-bold text-gray-700">Gender:</h2>
            <p className="text-gray-600">{patient.gender || "N/A"}</p>
          </div>
          <div>
            <h2 className="font-bold text-gray-700">Date of Birth:</h2>
            <p className="text-gray-600">{patient.dob || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-2 font-semibold ${
              activeTab === "info" ? "border-b-2 border-[#2f3192] text-[#2f3192]" : "text-gray-500 hover:text-[#2f3192]"
            }`}
          >
            More Info
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-6 py-2 font-semibold ${
              activeTab === "appointments" ? "border-b-2 border-[#2f3192] text-[#2f3192]" : "text-gray-500 hover:text-[#2f3192]"
            }`}
          >
            Appointments
          </button>
        </div>

        {/* Tabs Content */}
        <div className="mt-4">
          {activeTab === "appointments" && (
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-[#2f3192] mb-4">Appointments</h2>
              {isLoading ? (
                <p className="text-gray-500">Loading appointments...</p>
              ) : error ? (
                <p className="text-red-500">Error fetching appointments.</p>
              ) : appointments && appointments.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="bg-white border-b">
                        <td className="px-6 py-4">{appointment.appointment_date}</td>
                        <td className="px-6 py-4">{appointment.appointment_type}</td>
                        <td className="px-6 py-4">{appointment.status}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewMore(appointment)}
                            className="text-white bg-[#2f3192] hover:bg-[#1e226d] font-medium rounded-lg text-sm px-4 py-2"
                          >
                            View More
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No appointments available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Appointment Details */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4">
            <h2 className="text-xl font-bold text-[#2f3192] mb-4">
              Appointment Details
            </h2>
            {/* Modal Tabs */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setAppointmentTab("casehistory")}
                className={`px-6 py-2 font-semibold ${
                  appointmentTab === "casehistory"
                    ? "border-b-2 border-[#2f3192] text-[#2f3192]"
                    : "text-gray-500 hover:text-[#2f3192]"
                }`}
              >
                Case History
              </button>
              <button
                onClick={() => setAppointmentTab("refraction")}
                className={`px-6 py-2 font-semibold ${
                  appointmentTab === "refraction"
                    ? "border-b-2 border-[#2f3192] text-[#2f3192]"
                    : "text-gray-500 hover:text-[#2f3192]"
                }`}
              >
                Refraction
              </button>
              <button
                onClick={() => setAppointmentTab("extratest")}
                className={`px-6 py-2 font-semibold ${
                  appointmentTab === "extratest"
                    ? "border-b-2 border-[#2f3192] text-[#2f3192]"
                    : "text-gray-500 hover:text-[#2f3192]"
                }`}
              >
                Extra Test
              </button>
            </div>

            {/* Modal Tab Content */}
            <div>
              {appointmentTab === "casehistory" && (
                <div>
                  <h3 className="text-lg font-bold">Case History</h3>
                  <p className="text-gray-600">Details about the case history...</p>
                </div>
              )}
              {appointmentTab === "refraction" && (
                <div>
                  <h3 className="text-lg font-bold">Refraction</h3>
                  <p className="text-gray-600">Details about refraction...</p>
                </div>
              )}
              {appointmentTab === "extratest" && (
                <div>
                  <h3 className="text-lg font-bold">Extra Test</h3>
                  <p className="text-gray-600">Details about extra tests...</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="mt-4 text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
