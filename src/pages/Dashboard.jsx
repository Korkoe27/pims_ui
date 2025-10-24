import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineUser } from "react-icons/hi2";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";
import { resetDashboardState } from "../redux/slices/dashboardSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import CanAccess from "../components/auth/CanAccess";
import ConsultButton from "../components/ui/buttons/ConsultButton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { handleConsult } = useHandleConsult();
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  // ✅ Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetDashboardDataQuery();

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch dashboard data:", error);
      dispatch(resetDashboardState());
    }
  }, [error, dispatch]);

  // ✅ Extract nested data safely
  const summary = dashboardData?.summary || {};
  const appointments = dashboardData?.appointments || {};

  const totalAppointments = summary?.total_appointments || 0;
  const pendingAppointments = summary?.pending_appointments || 0;
  const completedAppointments = appointments?.completed?.count || 0;
  const scheduledAppointments = appointments?.scheduled?.data || [];

  // ✅ Determine if Action column should appear
  const showActionColumn = ConsultButton.shouldShow(access);

  return (
    <PageContainer>
      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-12 gap-9 w-full">
        <DashboardCard
          icon={<HiOutlineUser className="w-6 h-6" />}
          title="Total Appointments"
          color="text-[#2f3192]"
          bg="bg-[#ececf9]"
          value={isLoading ? <LoadingSpinner /> : totalAppointments}
        />

        <DashboardCard
          icon={<LuClock3 className="w-6 h-6" />}
          title="Pending Appointments"
          color="text-[#d42620]"
          bg="bg-[#fbeae9]"
          value={isLoading ? <LoadingSpinner /> : pendingAppointments}
        />

        <DashboardCard
          icon={<FiUserCheck className="w-6 h-6" />}
          title="Completed Appointments"
          color="text-[#0f973d]"
          bg="bg-[#e7f6ec]"
          value={isLoading ? <LoadingSpinner /> : completedAppointments}
        />
      </div>

      {/* 🔹 Upcoming Appointments */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Upcoming Appointments</h2>
          <CanAccess accessKeys={["canViewAppointments"]}>
            <Link
              to="/appointments"
              className="text-[#2f3192] font-semibold hover:underline"
            >
              See all
            </Link>
          </CanAccess>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : scheduledAppointments.length > 0 ? (
          <table className="w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="text-black uppercase text-left bg-[#f0f2f5]">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Patient ID</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Appointment Type</th>
                {showActionColumn && (
                  <th className="px-3 py-3 text-center">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {scheduledAppointments.slice(0, 5).map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-3 py-3">{appointment.appointment_date}</td>
                  <td className="px-3 py-3">{appointment.patient_id}</td>
                  <td className="px-3 py-3">{appointment.patient_name}</td>
                  <td className="px-3 py-3">
                    {appointment.appointment_type_name}
                  </td>

                  {showActionColumn && (
                    <td className="py-3 flex justify-center">
                      <ConsultButton
                        appointment={appointment}
                        onClick={handleConsult}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No scheduled appointments available.
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default Dashboard;

/* -------------------- 🔹 Subcomponent -------------------- */
const DashboardCard = ({ icon, title, color, bg, value }) => (
  <div className={`${bg} p-4 h-36 col-span-4 rounded-xl`}>
    <h3 className="flex items-center text-base gap-[12px] font-normal">
      {icon}
      {title}
    </h3>
    <span className={`text-[50px] font-bold ${color}`}>{value}</span>
  </div>
);
