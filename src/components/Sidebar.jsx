import React from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { HiUser } from "react-icons/hi2";
import { Sidebar_links } from "../extras/data.js";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { handleLogout, isLoading } = useLogout(); // Use the logout hook

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-blue-900 font-bold text-md my-2 bg-[#e3effc]";

  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-black font-normal text-md hover:bg-[#e3effc] my-2";

  return (
    <div className="w-72 bg-white fixed flex flex-col shadow-lg h-screen overscroll-contain md:overflow-hidden overflow-auto md:hover:overflow-auto">
      <div className="">
        <Link
          to=""
          onClick={() => {}}
          className="items-center text-xl gap-3 ml-3 mt-4"
        >
          <Logo displayType="flex" />
        </Link>
      </div>
      <div className="mt-10 border border-l-0 border-t-0 border-r-0 border-b-[#f0f2f5]">
        {Sidebar_links.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            {item.icon}
            <span className="capitalize">{item.name}</span>
            {item.name === "appointments" && (
              <span className="flex bg-[#f0f2f5] w-[2rem] h-[1.5rem] justify-center items-center rounded-full font-medium text-[#344054] text-[0.75rem] relative top-0 right-0 transform translate-x-[100%]">
                --
              </span>
            )}
          </NavLink>
        ))}
      </div>
      <div className="flex gap-3 bottom-0 absolute p-6 items-center">
        <span className="rounded-full bg-[#ffece5] w-10 h-10 p-3">
          <HiUser />
        </span>
        <span className="flex flex-col gap-1">
          <h4 className="text-[#101928] text-center text-base font-semibold">
            {user?.first_name || "User"}
          </h4>
        </span>
        <button
          onClick={handleLogout}
          className="text-red-500 font-medium text-sm hover:text-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
