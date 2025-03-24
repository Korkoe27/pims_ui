import React, { useEffect } from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";

const PersonalHistory = ({ patientId, appointmentId }) => {
  const { personalHistory, isLoading, isError, error } = usePersonalHistoryData(
    patientId,
    appointmentId
  );

  useEffect(() => {
    console.log("🧾 Received patientId:", patientId);
    console.log("📦 Personal History Data:", personalHistory);
  }, [patientId, personalHistory]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Personal History</h1>
        <p>Loading personal history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Personal History</h1>
        <p className="text-red-600">
          Error fetching data: {error?.data?.detail || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-2">Personal History</h1>

      <p>
        <strong>Patient ID:</strong> {patientId}
      </p>
      <p>
        <strong>Last Eye Exam:</strong>{" "}
        {personalHistory?.last_eye_examination || "N/A"}
      </p>

      <div>
        <p>
          <strong>Drug History:</strong>{" "}
          {personalHistory?.drug_history || "N/A"}
        </p>
        <p className="text-sm text-gray-600 italic">
          {personalHistory?.drug_notes}
        </p>
      </div>

      <div>
        <p>
          <strong>Allergies:</strong> {personalHistory?.allergies || "N/A"}
        </p>
        <p className="text-sm text-gray-600 italic">
          {personalHistory?.allergy_notes}
        </p>
      </div>

      <div>
        <p>
          <strong>Social History:</strong>{" "}
          {personalHistory?.social_history || "N/A"}
        </p>
        <p className="text-sm text-gray-600 italic">
          {personalHistory?.social_notes}
        </p>
      </div>

      <div>
        <strong>Medical History:</strong>
        <ul className="list-disc list-inside ml-4">
          {(personalHistory?.medical_history || []).map((item, index) => (
            <li key={index}>
              {item.medical_condition_name} — {item.notes || "No notes"}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Ocular History:</strong>
        <ul className="list-disc list-inside ml-4">
          {(personalHistory?.ocular_history || []).map((item, index) => (
            <li key={index}>
              {item.ocular_condition_name} — {item.notes || "No notes"}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Family Medical History:</strong>
        <ul className="list-disc list-inside ml-4">
          {(personalHistory?.family_medical_history || []).map(
            (item, index) => (
              <li key={index}>
                {item.medical_condition_name} — {item.notes || "No notes"}
              </li>
            )
          )}
        </ul>
      </div>

      <div>
        <strong>Family Ocular History:</strong>
        <ul className="list-disc list-inside ml-4">
          {(personalHistory?.family_ocular_history || []).map((item, index) => (
            <li key={index}>
              {item.ocular_condition_name} — {item.notes || "No notes"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PersonalHistory;
