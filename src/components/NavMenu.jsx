import React from "react";
import { getConsultationNav } from "../extras/data";
import { NavLink, useLocation } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from "react-icons/io";

const NavMenu = ({ appointmentId, patient }) => {
  const location = useLocation(); // Get current location
  const currentPath = location.pathname; // Current route
  const navLinks = getConsultationNav(appointmentId);

  // CSS classes
  const activeLink =
    "text-[#2f3192] text-base underline decoration-[#2f3192] decoration-[5px] font-bold underline-offset-[5px]";
  const normalLink = "text-base text-black font-normal";

  /**
   * Determines if a tab is completed.
   * @param {string} link - The link to check.
   * @returns {boolean} - True if the tab is completed.
   */
  const isCompleted = (link) => {
    const currentIndex = navLinks.findIndex((item) =>
      currentPath.includes(item.link)
    );
    const linkIndex = navLinks.findIndex((item) => item.link === link);
    return linkIndex < currentIndex; // Tabs before the current tab are considered completed
  };

  return (
    <div className="flex items-center gap-16">
      {navLinks.map((item) => (
        <NavLink
          to={item.link}
          key={item.name}
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
          state={{ patient, appointmentId }} // Pass patient and appointmentId via state
        >
          <span className="flex justify-center items-center">
            {isCompleted(item.link) ? (
              <IoIosCheckmarkCircle size={20} color="#0f973d" />
            ) : (
              <IoIosRadioButtonOff size={20} color="#d0d5dd" />
            )}
          </span>
          <span className="capitalize">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default NavMenu;
