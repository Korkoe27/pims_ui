import React from "react";
import { Consultation_nav } from "../extras/data";
import { NavLink, useLocation } from "react-router-dom";
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from "react-icons/io";

const NavMenu = ({ appointmentId, patient }) => {
  const location = useLocation(); // Get current location
  const currentPath = location.pathname; // Current route

  const activeLink =
    "text-[#2f3192] text-base underline decoration-[#2f3192] decoration-[5px] font-bold underline-offset-[5px]";
  const normalLink = "text-base text-black font-normal";

  const isCompleted = (link) => {
    // Check if the tab is completed by comparing route order
    const currentIndex = Consultation_nav.findIndex(
      (item) => currentPath.includes(item.link)
    );
    const linkIndex = Consultation_nav.findIndex((item) => item.link === link);
    return linkIndex < currentIndex; // Tabs before the current tab are completed
  };

  return (
    <div className="flex items-center gap-16">
      {Consultation_nav.map((item) => (
        <NavLink
          to={{
            pathname: appointmentId
              ? `${item.link}/${appointmentId}` // Append appointmentId dynamically
              : `${item.link}`, // Fallback if appointmentId is undefined
            state: { patient, appointmentId }, // Pass patient and appointmentId via state
          }}
          key={item.name}
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
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
