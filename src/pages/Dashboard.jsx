import React, { useState } from "react";
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
import { logoutUser } from "../redux/slices/authSlice"; // Redux logout
import { useAppointments } from "../services/queries/appointments-query";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalVisible, setSearchModalVisibility] = useState(false);

  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const { data: appointments, isLoading } = useAppointments();

  const isTable = true;

  const handleConsult = (appointment) => {
    if (!appointment) {
      console.error("Appointment is undefined.");
      return;
    }
    const { id: appointmentId, patient } = appointment;

    navigate(`/case-history/${appointmentId}`, {
      state: { patient, appointment },
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch Redux logout action
  };

  const openModal = () => setIsModalOpen(true);

  const openSearchModal = () => {
    setSearchModalVisibility(true);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="px-8 ml-72 flex flex-col mt-4 gap-8 bg-[#f9fafb] w-full">
      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}

      {isSearchModalVisible && (
        <SearchModalUnfilled setSearchModalVisibility={setSearchModalVisibility} />
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

        {/* Search and Add Buttons */}
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

        {/* User Dropdown */}
        <div className="relative flex items-end justify-end gap-12 col-span-1">
          <div className="flex justify-end gap-3 items-center">
            <span className="bg-[#ffe7cc] px-5 py-2 w-14 h-14 text-[#3e3838] flex justify-center items-center rounded-[100%] font-semibold text-xl">
              {`${user?.first_name[0] || "K"}${user?.last_name[0] || "D"}`}
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
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-12 gap-9 w-full">
        <div className="bg-[#ececf9] p-4 h-36 col-span-4 w-full">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <LuUsers2 className="w-6 h-6" />
            Today's Appointments
          </h3>
          {isLoading && <LoadingSpinner />}
          <span className="text-[50px] font-bold text-[#2f3192]">
            {appointments?.data?.today_appointments?.count}
          </span>
        </div>

        <div className="bg-[#fbeae9] p-4 h-36 w-full col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <LuClock3 className="w-6 h-6" />
            Pending Appointments
          </h3>
          {isLoading && <LoadingSpinner />}
          <span className="text-[50px] font-bold text-[#d42620]">
            {appointments?.data?.pending_appointments}
          </span>
        </div>

        <div className="bg-[#e7f6ec] p-4 h-36 w-full flex flex-col col-span-4">
          <h3 className="flex items-center text-base gap-[12px] font-normal">
            <FiUserCheck className="w-6 h-6" />
            Completed Appointments
          </h3>
          {isLoading && <LoadingSpinner />}
          <span className="text-[50px] font-bold text-[#0f973d]">
            {appointments?.data?.completed_appointments}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
