import React from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";

const PersonalHistoryView = ({ patientId, appointmentId }) => {
  const { personalHistory, isLoading, error } = usePersonalHistoryData(
    patientId,
    appointmentId
  );

  if (isLoading)
    return <p className="text-gray-500">Loading personal history...</p>;
  if (error || !personalHistory)
    return <p className="text-red-500">No personal history found.</p>;

  const renderConditionBlock = (title, conditions) => (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      {conditions.length === 0 ? (
        <p className="text-gray-600">None recorded.</p>
      ) : (
        <div className="space-y-3">
          {conditions.map((c, idx) => (
            <div key={idx} className="bg-gray-50 p-3 border rounded">
              <p>
                <strong>
                  {c.name ||
                    c.medical_condition_name ||
                    c.ocular_condition_name ||
                    "Unnamed Condition"}
                </strong>
              </p>
              {c.affected_eye && (
                <p className="text-sm">Eye: {c.affected_eye}</p>
              )}
              {c.grading && <p className="text-sm">Grading: {c.grading}</p>}
              {c.notes && <p className="text-sm">Notes: {c.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-8">
      <h2 className="text-xl font-bold text-[#2f3192]">
        Oculo-Medical History
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700">Last Eye Examination:</h4>
          <p className="text-gray-600">
            {personalHistory.last_eye_examination || "N/A"}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Drug History:</h4>
          <p className="text-gray-600">
            {personalHistory.drug_history || "N/A"}
          </p>
          {personalHistory.drug_notes && (
            <p className="text-sm text-gray-500">
              Notes: {personalHistory.drug_notes}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Allergies:</h4>
          <p className="text-gray-600">{personalHistory.allergies || "N/A"}</p>
          {personalHistory.allergy_notes && (
            <p className="text-sm text-gray-500">
              Notes: {personalHistory.allergy_notes}
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Social History:</h4>
          <p className="text-gray-600">
            {personalHistory.social_history || "N/A"}
          </p>
          {personalHistory.social_notes && (
            <p className="text-sm text-gray-500">
              Notes: {personalHistory.social_notes}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {renderConditionBlock(
          "Medical History",
          personalHistory.medical_history || []
        )}
        {renderConditionBlock(
          "Ocular History",
          personalHistory.ocular_history || []
        )}
        {renderConditionBlock(
          "Family Medical History",
          personalHistory.family_medical_history || []
        )}
        {renderConditionBlock(
          "Family Ocular History",
          personalHistory.family_ocular_history || []
        )}
      </div>
    </div>
  );
};

export default PersonalHistoryView;
