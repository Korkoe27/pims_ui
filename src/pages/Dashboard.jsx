import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HiOutlineUser } from "react-icons/hi2";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";
import { resetDashboardState } from "../redux/slices/dashboardSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import CanAccess from "../components/auth/CanAccess";
import { ROLES } from "../constants/roles";
import ConsultButton from "../components/ui/buttons";

const Dashboard = () => {
  const { handleConsult } = useHandleConsult();
  const dispatch = useDispatch();
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetDashboardDataQuery();

  useEffect(() => {
    if (dashboardError) {
      console.error("Failed to fetch dashboard data:", dashboardError);
      dispatch(resetDashboardState());
    }
  }, [dashboardError, dispatch]);

  const scheduledAppointments = dashboardData?.scheduled_appointments?.data || [];
  const pendingReviews = dashboardData?.pending_reviews?.data || [];
  const totalPatients = dashboardData?.total_patients || 0;
  const totalAppointments = dashboardData?.total_appointments || 0;
  const completedAppointments = dashboardData?.completed_appointments || 0;
  const pendingAppointments = dashboardData?.pending_appointments || 0;

  return (
    <PageContainer>
      {/* Summary cards */}
      <div className="grid grid-cols-12 gap-9 w-full">
        <div className="bg-[#ececf9] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <HiOutlineUser className="w-6 h-6" />
            Total Appointments
          </h3>
          <span className="text-[50px] font-bold text-[#2f3192]">
            {dashboardLoading ? <LoadingSpinner /> : totalAppointments}
          </span>
        </div>
        <div className="bg-[#fbeae9] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <LuClock3 className="w-6 h-6" />
            Pending Appointments
          </h3>
          <span className="text-[50px] font-bold text-[#d42620]">
            {dashboardLoading ? <LoadingSpinner /> : pendingAppointments}
          </span>
        </div>
        <div className="bg-[#e7f6ec] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <FiUserCheck className="w-6 h-6" />
            Completed Appointments
          </h3>
          <span className="text-[50px] font-bold text-[#0f973d]">
            {dashboardLoading ? <LoadingSpinner /> : completedAppointments}
          </span>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mt-10">
        <div className="flex justify-between my-[15px]">
          <h2 className="font-bold text-xl">Upcoming Appointments</h2>
          <Link to="/appointments" className="text-[#2f3192] font-semibold">
            See all
          </Link>
        </div>
        {dashboardLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : scheduledAppointments.length > 0 ? (
          <table className="w-full">
            <thead className="text-black uppercase text-left h-16 bg-[#f0f2f5]">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Patient’s ID</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Appointment Type</th>
                <CanAccess allowedRoles={[ROLES.STUDENT, ROLES.LECTURER]}>
                  <th className="px-3 py-3 text-center">Action</th>
                </CanAccess>
              </tr>
            </thead>
            <tbody>
              {scheduledAppointments.slice(0, 5).map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-3 py-3">{appointment.appointment_date}</td>
                  <td className="px-3 py-3">{appointment.patient_id}</td>
                  <td className="px-3 py-3">{appointment.patient_name}</td>
                  <td className="px-3 py-3">{appointment.appointment_type}</td>
                  <CanAccess allowedRoles={[ROLES.STUDENT, ROLES.LECTURER]}>
                    <td className="py-3 flex justify-center">
                       <ConsultButton onClick={() => handleConsult(appointment)} />
                    </td>
                  </CanAccess>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No scheduled appointments available.</p>
        )}
      </div>

      {/* Pending Reviews */}
      <div className="mt-10">
        <h2 className="font-bold text-xl mb-4">Pending Review</h2>
        {dashboardLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : pendingReviews.length > 0 ? (
          <table className="w-full">
            <thead className="text-black uppercase text-left h-16 bg-[#f0f2f5]">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Patient’s ID</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Appointment Type</th>
                <CanAccess allowedRoles={[ROLES.LECTURER, ROLES.STUDENT]}>
                  <th className="px-3 py-3 text-center">Action</th>
                </CanAccess>
              </tr>
            </thead>
            <tbody>
              {pendingReviews.map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-3 py-3">{appointment.appointment_date}</td>
                  <td className="px-3 py-3">{appointment.patient_id}</td>
                  <td className="px-3 py-3">{appointment.patient_name}</td>
                  <td className="px-3 py-3">{appointment.appointment_type}</td>
                  <CanAccess allowedRoles={[ROLES.LECTURER, ROLES.STUDENT]}>
                    <td className="py-3 flex justify-center">
                      <button
                        className="text-white bg-[#2f3192] px-4 py-2 rounded-lg"
                        onClick={() => handleConsult(appointment)}
                      >
                        Review Case
                      </button>
                    </td>
                  </CanAccess>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No pending reviews available.</p>
        )}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
