import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <div className="ml-72">
        <Navbar />
        <div className="pt-16 px-8 bg-[#f9fafb] min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
