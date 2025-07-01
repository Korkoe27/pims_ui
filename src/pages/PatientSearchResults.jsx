import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchPatientsQuery } from "../redux/api/features/patientApi";
import usePagination from "../hooks/usePagination";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandlePatientDetails from "../hooks/useHandlePatientDetails";
import useHandleAppointmentNavigation from "../hooks/useHandleAppointmentNavigation";
import PageContainer from "../components/PageContainer";

const PatientSearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const { currentPage, pageSize, handlePageChange } = usePagination();
  const { handlePatientDetails } = useHandlePatientDetails();
  const { goToCreateAppointment } = useHandleAppointmentNavigation();

  const {
    data: patients,
    isLoading,
    error,
  } = useSearchPatientsQuery(searchQuery, {
    skip: !searchQuery,
  });

  return (
    <PageContainer>
      <div className="flex justify-between">
        <h1 className="font-extrabold text-xl">
          Search Results for "{searchQuery}"
        </h1>
      </div>

      {patients && patients.length > 0 ? (
        <table className="w-full text-base text-left text-gray-500 bg-white shadow-md rounded-lg">
          <thead className="text-base text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Patient ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Clinic</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="bg-white border-b hover:bg-gray-100"
              >
                <td className="px-6 py-4">{patient.patient_id || "N/A"}</td>
                <td className="px-6 py-4">
                  {`${patient.first_name} ${patient.last_name || ""}`}
                </td>
                <td className="px-6 py-4">
                  {patient.clinic || "Not assigned"}
                </td>
                <td className="px-6 py-4">
                  {patient.primary_phone || "Not provided"}
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    onClick={() =>
                      goToCreateAppointment({
                        id: patient.id,
                        patient_id: patient.patient_id,
                        first_name: patient.first_name,
                        last_name: patient.last_name,
                      })
                    }
                  >
                    Book Appointment
                  </button>
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    onClick={() => handlePatientDetails(patient)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !isLoading && (
          <p className="text-gray-500 text-center mt-8">No patients found.</p>
        )
      )}

      {isLoading && <LoadingSpinner />}

      {error && (
        <p className="text-red-500 text-center">
          Error fetching patients: {error.message}
        </p>
      )}

      {patients && patients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(patients.length / pageSize)}
          onPageChange={handlePageChange}
        />
      )}
    </PageContainer>
  );
};

export default PatientSearchResults;
