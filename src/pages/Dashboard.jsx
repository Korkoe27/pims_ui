import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { LuUsers2 } from "react-icons/lu";
import { GrAdd } from "react-icons/gr";
import { FaChevronDown } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PatientModal from "../components/SelectClinicModal";
import SearchModalUnfilled from "../components/SearchModalUnfilled";
import useLogout from "../hooks/useLogout";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";
import { resetDashboardState } from "../redux/slices/dashboardSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { handleLogout, isLoading: logoutLoading } = useLogout();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalVisible, setSearchModalVisibility] = useState(false);

  const { user } = useSelector((state) => state.auth);

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

  const openModal = () => setIsModalOpen(true);
  const openSearchModal = () => setSearchModalVisibility(true);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const totalPatients = dashboardData?.total_patients || 0;
  const pendingAppointments = dashboardData?.pending_appointments || 0;
  const completedAppointments = dashboardData?.completed_appointments || 0;
  const todayAppointments = dashboardData?.today_appointments?.data || [];
  const recentPatientActivity = dashboardData?.recent_activity || [];

  const handleAttendToPatient = (appointmentId) => {
    console.log("Attending to patient with ID:", appointmentId);
    navigate(`/case-history/${appointmentId}`);
  };

  return (
    <div className="px-8 ml-72 flex flex-col mt-4 gap-8 bg-[#f9fafb] w-full">
      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}
      {isSearchModalVisible && (
        <SearchModalUnfilled
          setSearchModalVisibility={setSearchModalVisibility}
        />
      )}

      {/* Header */}
      <div className="dashboard_header grid items-center grid-cols-12 max-h-[10%]">
        <div className="col-span-4">
          <h2 className="text-2xl font-bold">
            Good{" "}
            {`${
              new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"
            }`}{" "}
            ,<span>{user?.first_name || "User"}</span> 👋🏾
          </h2>
        </div>

        <div className="flex items-center justify-end gap-5 h-14 col-span-7 w-90 border-[#d0d5dd]">
          <div className="flex bg-white items-center text-left gap-0 w-2/3 px-2 border rounded-md">
            <CiSearch title="Search" className="h-5 bg-white cursor-pointer" />
            <input
              type="search"
              name="search"
              readOnly
              placeholder="Search"
              className="p-4 focus:outline-none"
              onClick={openSearchModal}
            />
          </div>
          <div className="flex items-center">
            <button
              className="flex items-center p-4 max-h-14 text-white bg-[#2f3192] gap-2 rounded-md text-sm"
              type="button"
              onClick={openModal}
            >
              <GrAdd />
              Add New Patient
            </button>
          </div>
        </div>

        <div className="relative flex items-end justify-end gap-12 col-span-1">
          <div className="flex justify-end gap-3 items-center">
            <span className="bg-[#ffe7cc] px-5 py-2 w-14 h-14 text-[#3e3838] flex justify-center items-center rounded-[100%] font-semibold text-xl">
              {`${user?.first_name?.[0] || "K"}${user?.last_name?.[0] || "D"}`}
            </span>
            <FaChevronDown
              title="Menu"
              className="cursor-pointer font-800 h-6 w-6"
              onClick={toggleDropdown}
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 top-14 bg-white border rounded-lg p-2 shadow-lg">
              <button
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-12 gap-9 w-full">
        <div className="bg-[#ececf9] p-4 h-36 col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <LuUsers2 className="w-6 h-6" />
            Total Patients
          </h3>
          <span className="text-[50px] font-bold text-[#2f3192]">
            {dashboardLoading ? <LoadingSpinner /> : totalPatients}
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
              <th className="px-3 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.slice(0, 3).map((appointment) => (
              <tr key={appointment.id} className="bg-white border-b">
                <td className="px-3 py-3">{appointment.appointment_date}</td>
                <td className="px-3 py-3">{appointment.patient.patient_id}</td>
                <td className="px-3 py-3">
                  {appointment.patient.first_name}{" "}
                  {appointment.patient.last_name}
                </td>
                <td className="px-3 py-3">{appointment.appointment_type}</td>
                <td className="py-3 flex justify-center">
                  <button
                    className="text-white bg-[#2f3192] px-4 py-2 rounded-lg"
                    onClick={() => handleAttendToPatient(appointment.id)}
                  >
                    Attend to Patient
                  </button>
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
            {recentPatientActivity.map((activity) => (
              <tr key={activity.id} className="bg-white border-b">
                <td className="px-3 py-3">{activity.date}</td>
                <td className="px-3 py-3">{activity.patient_id}</td>
                <td className="px-3 py-3">{activity.name}</td>
                <td className="px-3 py-3">{activity.diagnosis}</td>
                <td className="px-3 py-3">
                  <span
                    className={`py-2 px-3 rounded-lg ${
                      activity.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
