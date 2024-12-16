import React from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppointments } from "../services/queries/appointments-query";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const { data: appointments, isLoading } = useAppointments();
  const navigate = useNavigate();

  // Navigates to the consultation page with appointment details
  const handleConsult = (appointment) => {
    const { id: appointmentId, patient } = appointment;
    navigate(`/case-history/${appointmentId}`, {
      state: { patient, appointment },
    });
  };

  // console.log(JSON.stringify(appointments, null, 3));
  const isTable = true;
  // console.log(JSON.stringify(appointments, null, 3));
  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      <h1 className="font-extrabold text-xl">Today's Appointments</h1>
      {isLoading && <LoadingSpinner isTable={isTable} />}
     {appointments && appointments?.data?.today_appointments && 
      <table className="w-full text-base text-left rtl:text-right text-gray-500 ">
        <thead className="text-base text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Patient ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-3 min-w-40 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className=''>
         {appointments?.data?.today_appointments?.data?.map((appointment) => 
        
        <tr key={appointment?.id} className="bg-white border-b ">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {appointment?.appointment_date}
        </th>
        <td className="px-6 py-4">
            {appointment?.patient?.patient_id}
        </td>
        <td className="px-6 py-4">
            {appointment?.patient?.first_name} {appointment?.patient?.last_name}
        </td>
        <td className="px-6 py-4">
            {appointment?.appointment_type}
        </td>
        <td className='w-fit mx-auto'>
            
            <span className={`px-6 rounded-full py-2 text-base font-medium text-white w-5 ${checkStatus(appointment?.status)}`}>
              
            {appointment?.status}
            </span>
            
        </td>
        <td className="px-6 py-4 flex gap-10">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none dark:focus:ring-blue-800">View</button>
            <button onClick={() => handleConsult()} className={`focus:outline-none ${showConsultBtn(appointment?.status)} text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}>Consult</button>
        </td>
        
    </tr>
        )}
        </tbody>
      </table>
     }
      
    </div>
  );
};

export default Appointments;

const checkStatus = (status)  =>{
  switch(status){
    case  'Completed': return 'bg-green-600';
    case  'Cancelled': return 'bg-red-600';

    default: case  'Scheduled': return 'bg-yellow-400';
  }
};


const showConsultBtn  = (status)  =>{
  switch(status){
    case  'Completed':  return  'hidden';
    case  'Cancelled':  return  'hidden';

    default:  case  'Scheduled':  return  'block';
  }


}