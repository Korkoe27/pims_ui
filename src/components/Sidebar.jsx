import React from "react";
import { Link, NavLink } from "react-router-dom";
import { HiUser } from "react-icons/hi2";
import Logo from "./Logo";
import { Sidebar_links } from "../extras/data.js";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toLowerCase();
  const { handleLogout } = useLogout();

  // 🔹 Fetch Dashboard Summary
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetDashboardDataQuery();

  // ✅ Safely extract counts
  const totalAppointments = dashboardData?.total_appointments ?? "--";
  const totalPendingReviews =
    dashboardData?.pending_reviews?.count ??
    dashboardData?.pending_reviews?.data?.length ??
    "--";

  const totalGeneral =
    dashboardData?.general_appointments?.count ??
    dashboardData?.general_appointments ??
    "--";

  const totalSpecial =
    dashboardData?.special_appointments?.count ??
    dashboardData?.special_appointments ??
    "--";

  // 🔹 Styling presets
  const activeLink =
    "flex items-center gap-4 pl-4 py-2.5 rounded text-blue-900 font-semibold text-md bg-[#e3effc]";
  const normalLink =
    "flex items-center gap-4 pl-4 py-2.5 rounded text-gray-800 font-medium text-md hover:bg-[#f5f8ff] transition-colors my-0.5";

  const subLinkActive =
    "flex items-center justify-between gap-2 pl-10 py-2 rounded text-blue-800 font-medium bg-[#eef6ff]";
  const subLinkNormal =
    "flex items-center justify-between gap-2 pl-10 py-2 rounded text-gray-700 font-normal hover:bg-[#f9fafb] transition-colors";

  const badgeClass =
    "ml-auto bg-[#f0f2f5] min-w-[2rem] h-[1.5rem] px-2 flex justify-center items-center rounded-full text-[#344054] text-xs";

  const clinicBadge = (count) => (
    <span className={badgeClass}>{isDashboardLoading ? "--" : count}</span>
  );

  // 🔹 Clinic Links
  const CLINIC_LINKS = [
    { label: "General Clinic", path: "general-appointments", count: totalGeneral },
    { label: "Special Clinic", path: "special-appointments", count: totalSpecial },
  ];

  return (
    <div className="w-72 bg-white fixed h-screen flex flex-col shadow-sm border-r border-gray-100">
      {/* Logo */}
      <div className="p-4">
        <Link to="/" className="flex items-center text-xl gap-3">
          <Logo displayType="flex" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 mt-4 border-t border-gray-100 pt-4">
        {Sidebar_links.filter(
          (item) =>
            item.roles === "all" || item.roles.includes(role?.toLowerCase())
        ).map((item) => {
          // 🩺 Appointments section
          if (item.name.toLowerCase() === "appointments") {
            return (
              <div key="appointments" className="mb-2">
                {/* Main Appointments */}
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  {item.icon}
                  <span className="capitalize">{item.name}</span>
                  <span className={badgeClass}>
                    {isDashboardLoading ? "--" : totalAppointments}
                  </span>
                </NavLink>

                {/* Sub-links: General & Special Clinics */}
                <div className="mt-1">
                  {CLINIC_LINKS.map((clinic) => (
                    <NavLink
                      key={clinic.path}
                      to={clinic.path}
                      className={({ isActive }) =>
                        isActive ? subLinkActive : subLinkNormal
                      }
                    >
                      <span>{clinic.label}</span>
                      {clinicBadge(clinic.count)}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          // 🔸 Default Sidebar Items
          return (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }
            >
              {item.icon}
              <span className="capitalize">{item.name}</span>

              {/* Pending Reviews badge */}
              {item.name === "pending reviews" && (
                <span className="ml-auto bg-[#fff2e5] min-w-[2rem] h-[1.5rem] px-2 flex justify-center items-center rounded-full text-[#d97706] text-xs font-medium">
                  {isDashboardLoading ? "--" : totalPendingReviews}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#eef2ff] w-10 h-10 flex items-center justify-center">
            <HiUser className="text-blue-700 text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#101928]">
              {user?.first_name || "User"}
            </h4>
            <p className="text-xs text-gray-500 capitalize">{role || "user"}</p>
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
