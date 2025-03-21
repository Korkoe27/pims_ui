import React, { useEffect } from "react";
import useCaseHistoryData from "../hooks/useCaseHistoryData";

const CaseHistory = ({ patientId, appointmentId }) => {
  const {
    caseHistory,
    isLoading,
  } = useCaseHistoryData(patientId, appointmentId);

  useEffect(() => {
    console.log("🔥 CaseHistory fetched:", caseHistory);
  }, [caseHistory]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hello World 👋</h1>

      {caseHistory ? (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(caseHistory, null, 2)}
        </pre>
      ) : (
        <p>No case history found.</p>
      )}
    </div>
  );
};

export default CaseHistory;
