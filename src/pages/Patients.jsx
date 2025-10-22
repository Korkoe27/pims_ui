import React from "react";
import { useGetAllPatientsQuery } from "../redux/api/features/patientApi";
import usePagination from "../hooks/usePagination";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandlePatientDetails from "../hooks/useHandlePatientDetails";
import useHandleAppointmentNavigation from "../hooks/useHandleAppointmentNavigation";
import PageContainer from "../components/PageContainer";
import CanAccess from "../components/auth/CanAccess";

const Patients = () => {
  const { currentPage, pageSize, handlePageChange } = usePagination();
  const { handlePatientDetails } = useHandlePatientDetails();
  const { goToCreateAppointment } = useHandleAppointmentNavigation();

  const {
    data: patients,
    isLoading,
    error,
  } = useGetAllPatientsQuery({
    page: currentPage,
    pageSize,
  });

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-extrabold text-xl">Patients</h1>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-4">
          Error fetching patients: {error.message}
        </p>
      )}

      {patients?.results?.length > 0 && (
        <>
          <table className="w-full text-base text-left text-gray-500 border rounded-lg overflow-hidden">
            <thead className="text-base text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Patient ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Clinic</th>
                <th scope="col" className="px-6 py-3">Phone Number</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.results.map((patient) => (
                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{patient.patient_id || "N/A"}</td>
                  <td className="px-6 py-4">
                    {`${patient.first_name} ${patient.last_name || ""}`}
                  </td>
                  <td className="px-6 py-4">{patient.clinic || "Not assigned"}</td>
                  <td className="px-6 py-4">
                    {patient.primary_phone || "Not provided"}
                  </td>
                  <td className="px-6 py-4 flex flex-wrap gap-3">
                    {/* ✅ Access-based control for appointment booking */}
                    <CanAccess accessKeys={["canCreateAppointment"]}>
                      <button
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
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
                    </CanAccess>

                    {/* ✅ Access-based control for viewing patient details */}
                    <CanAccess accessKeys={["canViewPatients"]}>
                      <button
                        className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
                        onClick={() => handlePatientDetails(patient)}
                      >
                        View
                      </button>
                    </CanAccess>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(patients.count / pageSize)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </PageContainer>
  );
};

export default Patients;
