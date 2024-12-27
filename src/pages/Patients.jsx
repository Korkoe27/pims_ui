import React from "react";
import { useGetAllPatientsQuery } from "../redux/api/features/patientApi";
import usePagination from "../hooks/usePagination";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import useHandlePatientDetails from "../hooks/useHandlePatientDetails";

const Patients = () => {
  const { currentPage, pageSize, handlePageChange } = usePagination();
  const { handlePatientDetails } = useHandlePatientDetails();

  const { data: patients, isLoading, error } = useGetAllPatientsQuery({
    page: currentPage,
    pageSize,
  });

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      <h1 className="font-extrabold text-xl">Patients</h1>

      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Error State */}
      {error && <p className="text-red-500">Error fetching patients: {error.message}</p>}

      {/* Patients Table */}
      {patients && patients.results && patients.results.length > 0 ? (
        <>
          <table className="w-full text-base text-left rtl:text-right text-gray-500">
            <thead className="text-base text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Patient ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Clinic</th>
                <th scope="col" className="px-6 py-3">Phone Number</th>
                <th scope="col" className="px-6 py-3">Actions</th> {/* Added Actions Column */}
              </tr>
            </thead>
            <tbody>
              {patients.results.map((patient) => (
                <tr key={patient.id} className="bg-white border-b">
                  <td className="px-6 py-4">{patient?.patient_id}</td>
                  <td className="px-6 py-4">{`${patient?.first_name} ${patient?.last_name}`}</td>
                  <td className="px-6 py-4">{patient?.clinic}</td>
                  <td className="px-6 py-4">{patient?.primary_phone}</td>
                  <td className="px-6 py-4 flex gap-4">
                    <Link
                      to={"/patients-details/"}
                      className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                      onClick={() => handlePatientDetails()}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(patients.count / pageSize)}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        !isLoading && <p className="text-gray-500 text-center">No patients available.</p>
      )}
    </div>
  );
};

export default Patients;
