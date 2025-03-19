import React, { useState, useEffect } from "react";
import { useFetchVisualAcuityQuery } from "../redux/api/features/visualAcuityApi";

const VisualAcuity = ({ appointmentId }) => {
  /** ✅ Fetch Visual Acuity Data */
  const { data: visualAcuityData, isLoading, error } =
    useFetchVisualAcuityQuery(appointmentId, { skip: !appointmentId });

  useEffect(() => {
    console.log("Fetching Visual Acuity for appointmentId:", appointmentId);
    console.log("Fetched Visual Acuity Data:", visualAcuityData);
  }, [appointmentId, visualAcuityData]);

  return (
    <div>
      <h1>Visual Acuity Form</h1>
      <p><strong>Debug:</strong> Received appointmentId: {appointmentId}</p>

      {isLoading && <p>Loading visual acuity data...</p>}
      {error && <p className="text-red-500">Error fetching data: {error.message}</p>}
      
      {visualAcuityData && (
        <div className="border p-4 mt-4 rounded-md">
          <h2 className="text-lg font-bold">Fetched Visual Acuity Data</h2>
          <pre className="bg-gray-100 p-2 rounded-md">{JSON.stringify(visualAcuityData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VisualAcuity;
