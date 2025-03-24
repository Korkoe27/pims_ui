import React from "react";
import { useSelector } from "react-redux";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";

const PersonalHistory = ({ patient, appointmentId }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const { personalHistory, isLoading, isError, error } = usePersonalHistoryData(
    patientId,
    appointmentId
  );

  if (!patientId) return <p className="p-6">No patient selected.</p>;

  const latestHistory = Array.isArray(personalHistory)
    ? personalHistory[0]
    : null;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Personal History
      </h2>

      {isLoading ? (
        <p>Loading personal history...</p>
      ) : isError ? (
        <p className="text-red-600">
          Error: {error?.message || "Failed to fetch data"}
        </p>
      ) : latestHistory ? (
        <div className="space-y-4">
          <p>
            <strong>Last Eye Examination:</strong>{" "}
            {latestHistory.last_eye_examination || "N/A"}
          </p>
          <p>
            <strong>Drug History:</strong>{" "}
            {latestHistory.drug_entry?.name || "N/A"}
          </p>
          <p>
            <strong>Allergies:</strong>{" "}
            {latestHistory.allergy_entry?.name || "N/A"}
          </p>
          <p>
            <strong>Social History:</strong>{" "}
            {latestHistory.social_entry?.name || "N/A"}
          </p>

          <div>
            <strong>Medical History:</strong>
            <ul className="list-disc ml-5">
              {latestHistory.medical_history_entries.length > 0 ? (
                latestHistory.medical_history_entries.map((item) => (
                  <li key={item.id}>
                    {item.medical_condition_name || "Unnamed Condition"}
                  </li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>

          <div>
            <strong>Ocular History:</strong>
            <ul className="list-disc ml-5">
              {latestHistory.ocular_history_entries.length > 0 ? (
                latestHistory.ocular_history_entries.map((item) => (
                  <li key={item.id}>
                    {item.ocular_condition_name} – {item.affected_eye} (Grading:{" "}
                    {item.grading})<br />
                    <span className="text-sm text-gray-600">{item.notes}</span>
                  </li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>

          <div>
            <strong>Family Medical History:</strong>
            <ul className="list-disc ml-5">
              {latestHistory.family_medical_history_entries.length > 0 ? (
                latestHistory.family_medical_history_entries.map((item) => (
                  <li key={item.id}>
                    {item.medical_condition_name || "Unnamed Condition"}
                  </li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>

          <div>
            <strong>Family Ocular History:</strong>
            <ul className="list-disc ml-5">
              {latestHistory.family_ocular_history_entries.length > 0 ? (
                latestHistory.family_ocular_history_entries.map((item) => (
                  <li key={item.id}>
                    {item.ocular_condition_name} – {item.affected_eye} (Grading:{" "}
                    {item.grading})<br />
                    <span className="text-sm text-gray-600">{item.notes}</span>
                  </li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>No personal history data found.</p>
      )}
    </div>
  );
};

export default PersonalHistory;
