// src/pages/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAppointmentSocket from "../hooks/useAppointmentSocket"; // ✅ Add this

const Layout = () => {
  useAppointmentSocket(); // ✅ WebSocket listener initialized globally

  return (
    <div className="flex bg-[#f9fafb] h-full">
      <Sidebar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
