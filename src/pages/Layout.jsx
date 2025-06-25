// src/pages/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {

  return (
    <div className="flex bg-[#f9fafb] h-full">
      <Sidebar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
