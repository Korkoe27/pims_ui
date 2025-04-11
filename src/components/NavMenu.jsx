import React from "react";
import { Consultation_nav } from "../extras/data";
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from "react-icons/io";

const NavMenu = ({ activeTab, setActiveTab }) => {
  const isCompleted = (tabName) => {
    const currentIndex = Consultation_nav.findIndex((item) => item.name === activeTab);
    const linkIndex = Consultation_nav.findIndex((item) => item.name === tabName);
    return linkIndex < currentIndex; // Tabs before the current tab are considered completed
  };

  return (
    <div className="flex items-center gap-16">
      {Consultation_nav.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveTab(item.name)} // Change active tab on click
          className={`text-base ${
            item.name === activeTab ? "font-bold text-[#2f3192]" : "font-normal text-black"
          }`}
        >
          <span className="flex justify-center items-center">
            {isCompleted(item.name) ? (
              <IoIosCheckmarkCircle size={20} color="#0f973d" />
            ) : (
              <IoIosRadioButtonOff size={20} color="#d0d5dd" />
            )}
          </span>
          <span className="capitalize">{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default NavMenu;

