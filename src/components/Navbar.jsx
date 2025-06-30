import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

import PatientModal from "../components/SelectClinicModal";
import { useSelector } from "react-redux";
import SearchModalUnfilled from "./SearchModalUnfilled";
import useLogout from "../hooks/useLogout";
import { useLazySearchPatientsQuery } from "../redux/api/features/patientApi";
import LoadingSpinner from "./LoadingSpinner";
import { showToast } from "../components/ToasterHelper";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalVisible, setSearchModalVisibility] = useState(false);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerSearch] = useLazySearchPatientsQuery();

  const { handleLogout } = useLogout();

  const openModal = () => setIsModalOpen(true);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
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
    <div className="dashboard_header grid items-center grid-cols-12 h-[10%]">
      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}
      <div className="col-span-3">
        <h2 className="xl:text-lg 2xl:text-xl font-bold">
          {user ? (
            <>
              Good {getGreeting()}, <span>{user.first_name}</span> 👋🏾
            </>
          ) : (
            "Loading user..."
          )}
        </h2>
      </div>

      <div className="flex items-center justify-end gap-5 h-14 col-span-8 w-full border-[#d0d5dd]">
        <form
          onSubmit={handleSearch}
          className="flex items-center text-left gap-0 w-2/3 border bg-white rounded-md px-4"
        >
          <CiSearch title="Search" className="bg-white cursor-pointer" />
          <input
            type="search"
            name="search"
            placeholder="Search Patients"
            className="p-4 focus:outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoading && (
            <div className="absolute right-0 top-0 h-full w-full flex items-center justify-center bg-white rounded-md">
              <LoadingSpinner />
            </div>
          )}
        </form>
        <div className="flex items-center">
          <button
            className="flex items-center p-4 text-white bg-[#2f3192] gap-2 rounded-md text-sm"
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
            {user
              ? `${user.first_name[0] || ""}${user.last_name[0] || ""}`
              : "U"}
          </span>
          <FaChevronDown
            title="Menu"
            className="cursor-pointer font-800 h-6 w-6"
            onClick={toggleDropdown}
          />
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 top-14 bg-white border rounded-lg p-2 shadow-lg">
            <form>
              <button
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
