import React, { useEffect, useState } from "react";
import { useFetchCaseHistoryQuery } from "../redux/api/features/consultationApi";

const CaseHistoryDisplay = ({ appointmentId }) => {
  const { data: fetchedCaseHistory, isLoading, isError } = useFetchCaseHistoryQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const [caseHistory, setCaseHistory] = useState(null);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching case history.");
    } else if (fetchedCaseHistory) {
      setCaseHistory(fetchedCaseHistory); // Set case history if data exists
    } else {
      setCaseHistory(null); // Reset to null if no data
    }
  }, [fetchedCaseHistory, isError]);

  if (isLoading) {
    return <p className="text-gray-500">Loading case history...</p>;
  }

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      {caseHistory ? (
        <div>
          <h1 className="text-xl font-bold mb-4">Case History</h1>
          <ul>
            <li>
              <strong>Chief Complaint:</strong> {caseHistory.chief_complaint}
            </li>
            <li>
              <strong>Last Eye Examination:</strong>{" "}
              {caseHistory.last_eye_examination || "Not Provided"}
            </li>
            <li>
              <strong>Burning Sensation:</strong>{" "}
              {caseHistory.burning_sensation ? "Yes" : "No"}
            </li>
            <li>
              <strong>Itching:</strong> {caseHistory.itching ? "Yes" : "No"}
            </li>
            <li>
              <strong>Tearing:</strong> {caseHistory.tearing ? "Yes" : "No"}
            </li>
            <li>
              <strong>Double Vision:</strong> {caseHistory.double_vision ? "Yes" : "No"}
            </li>
            <li>
              <strong>Discharge:</strong> {caseHistory.discharge ? "Yes" : "No"}
            </li>
            <li>
              <strong>Parent Drug History:</strong>{" "}
              {caseHistory.parent_drug_history?.join(", ") || "Not Provided"}
            </li>
            <li>
              <strong>Allergies:</strong>{" "}
              {caseHistory.allergies?.join(", ") || "None"}
            </li>
            <li>
              <strong>Hobbies:</strong> {caseHistory.hobbies?.join(", ") || "None"}
            </li>
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No Case History Available</p>
      )}
    </div>
  );
};

export default CaseHistoryDisplay;
