import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import PatientModal from "../components/SelectClinicModal";
import LoadingSpinner from "./LoadingSpinner";
import useLogout from "../hooks/useLogout";
import { useLazySearchPatientsQuery } from "../redux/api/features/patientApi";
import { showToast } from "../components/ToasterHelper";
import CanAccess from "../components/auth/CanAccess";
import { ROLES } from "../constants/roles";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const [triggerSearch] = useLazySearchPatientsQuery();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      showToast("Searching for patient...", "loading", {
        duration: 10000,
        isLoading: true,
      });
      try {
        await triggerSearch(searchQuery);
        showToast("Search completed successfully!", "success");
        navigate(`/patients/search?query=${searchQuery}`);
      } catch (error) {
        console.error("Search error:", error);
        showToast("Failed to fetch search results.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="h-16 w-full px-6 flex items-center justify-between bg-white z-20">
      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}

      {/* Greeting */}
      <div>
        <h2 className="text-base font-bold">
          {user ? (
            <>
              Good {getGreeting()}, <span>{user.first_name}</span> 👋🏾
            </>
          ) : (
            "Loading user..."
          )}
        </h2>
      </div>

      {/* Center search and button */}
      <div className="flex items-center gap-4 flex-1 justify-center">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-[60%] max-w-xl bg-white border rounded-md px-4 relative"
        >
          <CiSearch className="text-gray-500" />
          <input
            type="search"
            placeholder="Search Patients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 focus:outline-none"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-md">
              <LoadingSpinner />
            </div>
          )}
        </form>
        <CanAccess allowedRoles={[ROLES.ADMINISTRATOR]}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-[#2f3192] rounded-md text-sm"
          >
            <GrAdd />
            Add New Patient
          </button>
        </CanAccess>
      </div>

      {/* Avatar and dropdown */}
      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 bg-[#ffe7cc] rounded-full flex items-center justify-center font-semibold text-xl text-[#3e3838]">
          {user ? `${user.first_name[0] || ""}${user.last_name[0] || ""}` : "U"}
        </div>
        <FaChevronDown
          className="cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 top-14 bg-white border rounded shadow-md w-36 z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
