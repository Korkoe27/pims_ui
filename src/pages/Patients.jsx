import React, { useState } from "react";
import { useGetAllPatientsQuery } from "../redux/api/features/patientApi";
import LoadingSpinner from "../components/LoadingSpinner";
import PatientModal from "../components/SelectClinicModal";
import { GrAdd } from "react-icons/gr";

const Patients = () => {
  const { data: patients, isLoading, error } = useGetAllPatientsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const isTable = true;

  console.log("Patients Data:", patients); // Debugging

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}

      <div className="flex justify-between">
        <h1 className="font-extrabold text-xl">Patients</h1>
        <button
          className="flex items-center p-4 h-14 text-white bg-[#2f3192] gap-2 rounded-md text-sm"
          type="button"
          onClick={openModal}
        >
          <GrAdd />
          Add New Patient
        </button>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner isTable={isTable} />}

      {/* Error State */}
      {error && <p className="text-red-500">Error fetching patients: {error.message}</p>}

      {/* Patients Table */}
      {patients && patients.results && patients.results.length > 0 ? (
        <table className="w-full text-base text-left rtl:text-right text-gray-500">
          <thead className="text-base text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Patient ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Clinic</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-3 min-w-40 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.results.map((patient) => (
              <tr key={patient.id} className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {patient?.patient_id}
                </th>
                <td className="px-6 py-4">
                  {patient?.first_name} {patient?.last_name}
                </td>
                <td className="px-6 py-4">{patient?.clinic}</td>
                <td className="px-6 py-4">{patient?.primary_phone}</td>
                <td className="px-6 py-4 flex gap-4">
                  <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !isLoading && <p className="text-gray-500 text-center">No patients available.</p>
      )}
    </div>
  );
};

export default Patients;
