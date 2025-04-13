import React, { useEffect, useState } from "react";
import { useFetchCaseHistoryQuery } from "../redux/api/features/caseHistoryApi";

const CaseHistoryView = ({ appointmentId }) => {
  const { data: caseHistory, isLoading, error } = useFetchCaseHistoryQuery(appointmentId, {
    skip: !appointmentId,
  });

  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    if (caseHistory?.condition_details) {
      setConditions(caseHistory.condition_details);
    }
  }, [caseHistory]);

  if (isLoading) return <p className="text-gray-500">Loading case history...</p>;
  if (error) return <p className="text-red-500">Failed to load case history.</p>;

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-[#2f3192]">Case History</h2>

      <div>
        <h3 className="font-semibold text-gray-700">Chief Complaint:</h3>
        <p className="text-gray-600 mt-1">{caseHistory?.chief_complaint || "N/A"}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">On-Direct Questioning Conditions:</h3>
        {conditions.length === 0 ? (
          <p className="text-gray-600">No conditions recorded.</p>
        ) : (
          <div className="space-y-4">
            {conditions.map((cond, index) => (
              <div key={index} className="p-4 border rounded bg-gray-50">
                <p className="font-semibold text-[#2f3192]">{cond.condition_name}</p>
                <p className="text-sm text-gray-600">Affected Eye: {cond.affected_eye || "N/A"}</p>
                <p className="text-sm text-gray-600">Grading: {cond.grading || "N/A"}</p>
                <p className="text-sm text-gray-600">Notes: {cond.notes || "N/A"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseHistoryView;
