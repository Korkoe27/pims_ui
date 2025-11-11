import React from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";

const PersonalHistoryView = ({ patientId, appointmentId }) => {
  const { personalHistory, isLoading, error } = usePersonalHistoryData(
    patientId,
    appointmentId
  );
  const { medicalConditions, ocularConditions } = useFetchConditionsData();

  if (isLoading)
    return <p className="text-gray-500">Loading Oculo-Medical History...</p>;
  if (error || !personalHistory)
    return <p className="text-red-500">No Oculo-Medical History found.</p>;

  // Create ID -> Name maps for lookup
  const medicalConditionMap = {};
  const ocularConditionMap = {};
  
  (medicalConditions || []).forEach((c) => {
    medicalConditionMap[c.id] = c.name;
  });
  
  (ocularConditions || []).forEach((c) => {
    ocularConditionMap[c.id] = c.name;
  });

  const getConditionName = (conditionId, isMedical = true) => {
    const map = isMedical ? medicalConditionMap : ocularConditionMap;
    return map[conditionId] || "Unnamed Condition";
  };

  const renderConditionBlock = (title, conditions, isMedical = true) => (
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
                  {getConditionName(c.condition, isMedical)}
                </strong>
              </p>
              {c.affected_eye && (
                <p className="text-sm">Eye: {c.affected_eye}</p>
              )}
              {c.value && (
                <p className="text-sm">
                  {c.field_type ? 
                    `${c.field_type.charAt(0).toUpperCase() + c.field_type.slice(1)}: ${c.value}` 
                    : `Value: ${c.value}`
                  }
                </p>
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
    <div className="bg-white p-6 rounded shadow-md max-h-[80vh] overflow-y-auto space-y-8">
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
          personalHistory.medical_history || [],
          true
        )}
        {renderConditionBlock(
          "Ocular History",
          personalHistory.ocular_history || [],
          false
        )}
        {renderConditionBlock(
          "Family Medical History",
          personalHistory.family_medical_history || [],
          true
        )}
        {renderConditionBlock(
          "Family Ocular History",
          personalHistory.family_ocular_history || [],
          false
        )}
      </div>
    </div>
  );
};

export default PersonalHistoryView;
