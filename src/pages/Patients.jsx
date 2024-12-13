import React, { useState } from "react";
import { useShowPatients } from "../services/queries/patients-query";
import LoadingSpinner from "../components/LoadingSpinner";
import PatientModal from "../components/SelectClinicModal";
import { GrAdd } from "react-icons/gr";
// import { useAuth } from '../hooks/AuthProvider';

const Patients = () => {
  const { data: patients, isLoading } = useShowPatients();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const isTable = true;
  // console.log(JSON.stringify(patients?.data?.results,null,3));
  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">


{isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}
      <div className="flex justify-between">
      <h1 className="font-extrabold text-xl">My Patients</h1>
                  <button className='flex items-center p-4 h-14 text-white bg-[#2f3192] gap-2 rounded-md text-sm' 
                    type='button'
                    onClick={openModal}
                  >
                    <GrAdd/>Add New Patient
                  </button>
      </div>
      {isLoading && <LoadingSpinner isTable={isTable} />}
     {patients && patients?.data && 
      <table className="w-full text-base text-left rtl:text-right text-gray-500 ">
        <thead className="text-base text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Patient ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Clinic
            </th>
            <th scope="col" className="px-6 py-3">
              Phone Number
            </th>
            <th scope="col" className="px-3 min-w-40 py-3"></th>
          </tr>
        </thead>
        <tbody>
         {patients?.data?.results.map((patient) => 
        
        <tr key={patient.id} className="bg-white border-b ">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {patient?.patient_id}
        </th>
        <td className="px-6 py-4">
            {patient?.first_name} {patient?.last_name}
        </td>
        <td className="px-6 py-4">
            {patient?.clinic}
        </td>
        <td className="px-6 py-4">
            {patient?.primary_phone}
        </td>
        <td className="px-6 py-4 flex gap-10">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none dark:focus:ring-blue-800">View</button>
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Consult</button>
        </td>
        
    </tr>
        )}
        </tbody>
      </table>
     }
      
    </div>
  );
};

export default Patients;
