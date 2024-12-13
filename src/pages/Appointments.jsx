import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppointments } from '../services/queries/appointments-query';

const Appointments = () => {
  const { data: appointments, isLoading } = useAppointments();

  // console.log(JSON.stringify(appointments, null, 3));
  const isTable = true;
  // console.log(JSON.stringify(patients?.data?.results,null,3));
  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      <h1 className="font-extrabold text-xl">Today's Appointments</h1>
      {isLoading && <LoadingSpinner isTable={isTable} />}
     {appointments && appointments?.today_appointments?.data && 
      <table className="w-full text-base text-left rtl:text-right text-gray-500 ">
        <thead className="text-base text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Appointment Date
            </th>
            {/* <th scope="col" className="px-6 py-3">
              Name
            </th> */}
            <th scope="col" className="px-6 py-3">
              Appointment Type
            </th>
            <th scope="col" className="px-6 py-3">
              Appointment Status
            </th>
            <th scope="col" className="px-3 min-w-40 py-3"></th>
          </tr>
        </thead>
        <tbody>
         {appointments?.today_appointments?.data?.map((appointment) => 
        
        <tr key={appointment?.id} className="bg-white border-b ">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {appointment?.appointment_date}
        </th>
        {/* <td className="px-6 py-4">
            {appointment?.first_name}
        </td> */}
        <td className="px-6 py-4">
            {appointment?.appointment_type}
        </td>
        <td className="px-6 py-4">
            {appointment?.status}
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

export default Appointments