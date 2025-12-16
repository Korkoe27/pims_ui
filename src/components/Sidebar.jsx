import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiUser } from "react-icons/hi2";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import Logo from "./Logo";
import { Sidebar_links } from "../extras/data.js";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];
  const roles = user?.roles || [];
  const displayRole = roles[0] || "User"; // Show first role for display
  const { handleLogout } = useLogout();
  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(true);

  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetDashboardDataQuery();

  // ✅ Extract counts from correct structure
  const totalAppointments = dashboardData?.summary?.total_appointments ?? "--";
  const totalPendingReviews =
    dashboardData?.appointments?.pending_reviews?.count ?? "--";
  const totalGeneral = dashboardData?.appointments?.general?.count ?? "--";
  const totalSpecial = dashboardData?.appointments?.special?.count ?? "--";

  // 🔹 Styles
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

  const CLINIC_LINKS = [
    { label: "General Clinic", path: "general-appointments", count: totalGeneral },
    { label: "Special Clinic", path: "special-appointments", count: totalSpecial },
  ];

  // Map permission keys to role codes
  const permissionRoleMap = {
    canViewAppointments: ["frontdesk", "student", "clinician", "supervisor", "coordinator"],
    canViewClinicSchedule: ["frontdesk", "student", "clinician", "supervisor", "coordinator"],
    canViewPatients: ["frontdesk", "student", "clinician", "supervisor"],
    canGradeStudents: ["supervisor"], // Only supervisors can grade
    canAccessStudentPortal: ["student"], // Only students
    canViewPharmacy: ["pharmacy"], // Only pharmacy staff
    canViewBills: ["finance"], // Only finance staff
    canViewAbsentRequests: ["supervisor", "coordinator"],
    canViewReports: ["supervisor", "coordinator", "finance"],
    canAccessSettings: ["supervisor"], // Only supervisors
  };

  const canAccess = (permissionKey) => {
    if (!permissionKey) return true; // No permission required
    const allowedRoles = permissionRoleMap[permissionKey] || [];
    return roleCodes.some((code) => allowedRoles.includes(code));
  };

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
        {Sidebar_links.filter((item) => canAccess(item.permissionKey)).map(
          (item) => {
            if (item.name.toLowerCase() === "appointments") {
              return (
                <div key="appointments" className="mb-2">
                  <div
                    onClick={() => setIsAppointmentsOpen(!isAppointmentsOpen)}
                    className="flex items-center gap-4 pl-4 py-2.5 rounded text-gray-800 font-medium text-md hover:bg-[#f5f8ff] transition-colors my-0.5 cursor-pointer"
                  >
                    {item.icon}
                    <span className="capitalize">{item.name}</span>
                    <span className={badgeClass}>
                      {isDashboardLoading ? "--" : totalAppointments}
                    </span>
                    {isAppointmentsOpen ? (
                      <FaChevronDown className="text-gray-500 text-xs ml-auto" />
                    ) : (
                      <FaChevronRight className="text-gray-500 text-xs ml-auto" />
                    )}
                  </div>

                  {/* Sub-links */}
                  {isAppointmentsOpen && (
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
                  )}
                </div>
              );
            }

            // Default items
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

                {item.name === "pending reviews" && (
                  <span className="ml-auto bg-[#fff2e5] min-w-[2rem] h-[1.5rem] px-2 flex justify-center items-center rounded-full text-[#d97706] text-xs font-medium">
                    {isDashboardLoading ? "--" : totalPendingReviews}
                  </span>
                )}
              </NavLink>
            );
          }
        )}
      </div>

      {/* User + Logout */}
      <div className="border-t border-gray-200 py-3 px-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#eef2ff] w-10 h-10 flex items-center justify-center">
            <HiUser className="text-blue-700 text-lg" />
          </div>
          <p className="text-sm text-gray-600 capitalize">
            {displayRole || "Loading..."}
          </p>
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
