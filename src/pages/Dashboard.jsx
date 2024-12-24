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
import { useLogoutMutation } from "../services/mutations/auth-mutations"; // RTK Query hook for logout
import { useAppointments } from "../services/queries/appointments-query";
import LoadingSpinner from "../components/LoadingSpinner";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectAppointment } from "../redux/slices/appointmentsSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalVisible, setSearchModalVisibility] = useState(false);

  const { user } = useSelector((state) => state.auth); // Fetch user from Redux
  const { data: appointments, isLoading } = useAppointments();
  const [logout] = useLogoutMutation(); // RTK Query logout hook

  const handleLogout = async () => {
    try {
      await logout().unwrap(); // Call the logout mutation
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error); // Handle any errors
    }
  };

  const handleAttendToPatient = (appointment) => {
    dispatch(selectAppointment(appointment)); // Set the selected appointment in Redux
    navigate(`/case-history/${appointment.id}`, { state: { appointment } });
  };

  const openModal = () => setIsModalOpen(true);
  const openSearchModal = () => setSearchModalVisibility(true);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#2f3192] font-medium"
          >
            <FiUserCheck className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Appointments list (example for rendering data) */}
      <div className="appointments_list grid grid-cols-1 gap-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          appointments?.map((appointment) => (
            <div
              key={appointment.id}
              className="appointment_item p-4 border border-[#e4e7eb] rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                <p>{appointment.date}</p>
              </div>
              <button
                onClick={() => handleAttendToPatient(appointment)}
                className="text-[#2f3192] font-semibold"
              >
                Attend to Patient
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
