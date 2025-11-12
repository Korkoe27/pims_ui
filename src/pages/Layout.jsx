import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-72">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-16 fixed top-0 left-72 right-0 bg-white z-10">
          <Navbar />
        </div>

        {/* Page content */}
        <div className="bg-[#f9fafb] flex-1">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
