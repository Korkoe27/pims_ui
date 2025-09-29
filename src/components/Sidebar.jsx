import React from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { HiUser } from "react-icons/hi2";
import { Sidebar_links } from "../extras/data.js";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";


const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { handleLogout, isLoading } = useLogout();
  const role = user?.role?.toLowerCase();

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetDashboardDataQuery();

  const totalAppointments = dashboardData
    ? dashboardData?.total_appointments
    : "--";

  const activeLink =
    "flex items-center gap-4 pl-4 py-2.5 rounded text-blue-900 font-bold text-md my-1 bg-[#e3effc]";
  const normalLink =
    "flex items-center gap-4 pl-4 py-2.5 rounded text-black font-normal text-md hover:bg-[#e3effc] my-1";

  return (
    <div className="w-72 bg-white fixed h-screen flex flex-col shadow-md">
      {/* Logo section */}
      <div className="p-4">
        <Link to="/" className="flex items-center text-xl gap-3">
          <Logo displayType="flex" />
        </Link>
      </div>

      {/* Nav links section */}
      <div className="flex-1 overflow-y-auto px-2 mt-6 border-t border-gray-100 pt-4">
        {Sidebar_links.filter(
          (item) =>
            item.roles === "all" || item.roles.includes(role?.toLowerCase())
        ).map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            {item.icon}
            <span className="capitalize">{item.name}</span>
            {item.name === "appointments" && (
              <span className="ml-auto bg-[#f0f2f5] w-[2rem] h-[1.5rem] flex justify-center items-center rounded-full text-[#344054] text-xs">
                {isDashboardLoading ? "--" : totalAppointments}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* User + Logout section */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#ffece5] w-10 h-10 flex items-center justify-center">
            <HiUser className="text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#101928]">
              {user?.first_name || "User"}
            </h4>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 text-sm font-medium hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
