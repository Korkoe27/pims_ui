import React, { useState, useEffect } from "react";

const PersonalHistory = ({ patientId }) => {
  useEffect(() => {
    console.log("🧾 Received patientId:", patientId);
  }, [patientId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Personal History</h1>
      <p className="text-lg text-gray-800">
        <strong>Patient ID:</strong> {patientId || "Not available"}
      </p>
    </div>
  );
};

export default PersonalHistory;
