// pages/Pharmacy.jsx
import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function Pharmacy() {
  const { pathname } = useLocation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pharmacy</h1>

      {pathname === "/pharmacy" && (
        <div className="rounded border p-4 bg-white">
          <p className="mb-2">Welcome to the Pharmacy. Select an order to view details.</p>
          {/* 🔹 Test link just to verify nested route */}
          <Link to="order/18be5e70-cfb2-4c52-bacc-7fc296d23085" className="text-blue-600 underline">
            Open sample order
          </Link>
        </div>
      )}

      {/* Nested route renders here */}
      <Outlet />
    </div>
  );
}
