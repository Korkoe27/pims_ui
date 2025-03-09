import React, { useState, useEffect } from "react";
import { useFetchCaseHistoryQuery, useFetchSymptomsQuery } from "../redux/api/features/consultationApi";

const CaseHistory = ({ appointmentId }) => {
  // ✅ Fetch Case History
  const { data: caseHistory, isLoading: isCaseHistoryLoading } = useFetchCaseHistoryQuery(appointmentId, {
    skip: !appointmentId,
  });

  // ✅ Fetch On-Direct Questioning Symptoms
  const { data: symptomsData, isLoading: isSymptomsLoading } = useFetchSymptomsQuery();

  // ✅ State for Chief Complaint
  const [chiefComplaint, setChiefComplaint] = useState("");

  // ✅ Update Chief Complaint if Case History Exists
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");
    }
  }, [caseHistory]);

  if (isCaseHistoryLoading || isSymptomsLoading) return <p>Loading Case History...</p>;

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Case History</h1>

      {/* Chief Complaint Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium">Chief Complaint</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Enter the patient's chief complaint..."
          className="p-3 border border-gray-300 rounded-md w-full h-24"
        ></textarea>
      </div>

      {/* On-Direct Questioning Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">On-Direct Questioning</h2>
        <div className="flex flex-col gap-4">
          {symptomsData?.map((symptom) => (
            <div key={symptom.id} className="flex items-center gap-4">
              <span className="font-medium">{symptom.name}</span>

              {/* ✅ Show Flags Based on Requirements */}
              {symptom.requires_affected_eye && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs">Affected Eye</span>
              )}
              {symptom.requires_grading && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xs">Grading</span>
              )}
              {symptom.requires_notes && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs">Notes</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseHistory;
