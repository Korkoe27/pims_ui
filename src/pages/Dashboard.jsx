import React from "react";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { LuUsers2 } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { useAppointments, } from "../services/queries/appointments-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectAppointment } from "../redux/slices/appointmentsSlice";
import Navbar from "../components/Navbar";


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { user } = useSelector((state) => state.auth); // Fetch user from Redux
  const { data: appointments, isLoading } = useAppointments();

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser()); // Dispatch logout action
      unwrapResult(resultAction); // Ensures successful completion
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAttendToPatient = (appointment) => {
    dispatch(selectAppointment(appointment)); // Set the selected appointment in Redux
    navigate(`/case-history/${appointment.id}`, { state: { appointment } });
  };


  return (
        <div className="px-8 ml-72 flex flex-col mt-4 gap-8 bg-[#f9fafb] w-full">
  <Navbar />

      {/* Appointment Cards */}
      <div className="grid grid-cols-12 gap-9 w-full">
        <div className="bg-[#ececf9] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <LuUsers2 className="w-6 h-6" />
            Today's Appointments
          </h3>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <span className="text-[50px] font-bold text-[#2f3192]">
              {appointments?.data?.today_appointments?.count || 0}
            </span>
          )}
        </div>
        <div className="bg-[#fbeae9] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <LuClock3 className="w-6 h-6" />
            Pending Appointments
          </h3>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <span className="text-[50px] font-bold text-[#d42620]">
              {appointments?.data?.pending_appointments || 0}
            </span>
          )}
        </div>
        <div className="bg-[#e7f6ec] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <FiUserCheck className="w-6 h-6" />
            Completed Appointments
          </h3>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <span className="text-[50px] font-bold text-[#0f973d]">
              {appointments?.data?.completed_appointments || 0}
            </span>
          )}
        </div>
      </div>

      {/* Upcoming Appointments Table */}
      <div>
        <div className="flex justify-between my-[15px]">
          <h2 className="font-bold text-xl">Upcoming Appointments</h2>
          <Link to="/appointments" className="text-[#2f3192] font-semibold">
            See all
          </Link>
        </div>
        <table className="w-full">
          <thead className="text-black uppercase text-left h-16 bg-[#f0f2f5]">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Patient’s ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Appointment Type</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <LoadingSpinner />}
            {appointments?.data?.today_appointments?.data
              ?.slice(0, 3)
              .map((appointment) => (
                <tr key={appointment?.id}>
                  <td className="px-3 py-3">{appointment?.appointment_date}</td>
                  <td className="px-3 py-3">
                    {appointment?.patient?.patient_id}
                  </td>
                  <td className="px-3 py-3">
                    {appointment?.patient?.first_name}{" "}
                    {appointment?.patient?.last_name}
                  </td>
                  <td className="px-3 py-3">{appointment?.appointment_type}</td>
                  <td className="py-3 flex justify-end">
                    <Link
                      to={`/case-history/${appointment.id}`}
                      onClick={() => handleAttendToPatient(appointment)}
                      className="text-white bg-[#2f3192] px-4 py-2 rounded-lg"
                    >
                      Attend to Patient
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Recent Patient Activity Table */}
      <div className="my-5">
        <div className="flex justify-between my-4">
          <h2 className="font-bold text-xl">Recent Patient Activity</h2>
          <Link className="text-[#2f3192] font-semibold">See all</Link>
        </div>
        <table className="w-full">
          <thead className="text-black uppercase text-left h-16 bg-[#f0f2f5]">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Patient’s ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Diagnosis</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-3">07-05-2024</td>
              <td className="px-3 py-3">2122/10/22</td>
              <td className="px-3 py-3">Korkoe A.K Dumashie</td>
              <td className="px-3 py-3">Allergic Conjunctivitis</td>
              <td className="px-3 py-3">
                <span className="bg-[#e7f6ec] text-[#036b26] py-2 px-3 rounded-lg">
                  Completed
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;



const checkStatus = (status)  =>{
  switch(status){
    case  'Completed': return 'bg-green-600';
    case  'Cancelled': return 'bg-red-600';

    default: case  'Scheduled': return 'bg-yellow-400';
  }
};