import React from "react";
import { Consultation_nav } from "../extras/data";

const NavMenu = ({ activeTab, setActiveTab, visibleTabs = [] }) => {
  const filteredNav =
    visibleTabs.length > 0
      ? Consultation_nav.filter((item) =>
          visibleTabs.includes(item.name.toLowerCase())
        )
      : Consultation_nav;

  return (
    <div className="flex items-center gap-16">
      {filteredNav.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveTab(item.name)}
          className={`text-base ${
            item.name === activeTab
              ? "font-bold text-[#2f3192]"
              : "font-normal text-black"
          }`}
        >
          <span className="capitalize">{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default NavMenu;
