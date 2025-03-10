import React, { useState } from "react";
import {
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";

const CaseHistory = ({ appointmentId }) => {
  // Fetch existing case history
  const { data: caseHistory, error: caseHistoryError, isLoading: caseHistoryLoading } = useFetchCaseHistoryQuery(appointmentId);
  
  // Fetch dropdown options
  const { data: symptoms } = useFetchSymptomsQuery();
  const { data: medicalConditions } = useFetchMedicalConditionsQuery();
  const { data: ocularConditions } = useFetchOcularConditionsQuery();

  // Mutation for creating a new case history
  const [createCaseHistory] = useCreateCaseHistoryMutation();

  // State for form submission
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMedicalConditions, setSelectedMedicalConditions] = useState([]);
  const [selectedOcularConditions, setSelectedOcularConditions] = useState([]);

  const handleSymptomChange = (id, field, value) => {
    setSelectedSymptoms((prev) => {
      const updatedSymptoms = prev.map((symptom) =>
        symptom.id === id ? { ...symptom, [field]: value } : symptom
      );
      return prev.some((s) => s.id === id) ? updatedSymptoms : [...prev, { id, [field]: value }];
    });
  };

  const handleSubmit = async () => {
    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      symptoms: selectedSymptoms,
      medical_conditions: selectedMedicalConditions,
      ocular_conditions: selectedOcularConditions,
    };

    await createCaseHistory(newCaseHistory);
    alert("Case history submitted!");
  };

  if (caseHistoryLoading) return <p>Loading case history...</p>;
  if (caseHistoryError) return <p>Error loading case history</p>;

  return (
    <div>
      <h2>Case History</h2>
      <pre>{JSON.stringify(caseHistory, null, 2)}</pre>

      <h2>Create New Case History</h2>
      <div>
        <label>Chief Complaint:</label>
        <input 
          type="text" 
          value={chiefComplaint} 
          onChange={(e) => setChiefComplaint(e.target.value)} 
          placeholder="Enter chief complaint" 
        />
      </div>

      <div>
        <h3>Symptoms</h3>
        {symptoms?.map(symptom => (
          <div key={symptom.id} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                value={symptom.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSymptoms([...selectedSymptoms, { id: symptom.id }]);
                  } else {
                    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
                  }
                }}
              />
              {symptom.name}
            </label>

            {symptom.requires_affected_eye && (
              <select onChange={(e) => handleSymptomChange(symptom.id, "affected_eye", e.target.value)}>
                <option value="">Select Eye</option>
                <option value="OS">OS (Left Eye)</option>
                <option value="OD">OD (Right Eye)</option>
                <option value="OU">OU (Both Eyes)</option>
              </select>
            )}

            {symptom.requires_grading && (
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Grading"
                onChange={(e) => handleSymptomChange(symptom.id, "grading", e.target.value)}
              />
            )}

            {symptom.requires_notes && (
              <input
                type="text"
                placeholder="Notes"
                onChange={(e) => handleSymptomChange(symptom.id, "notes", e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h3>Medical Conditions</h3>
        {medicalConditions?.map(condition => (
          <div key={condition.id}>
            <label>
              <input
                type="checkbox"
                value={condition.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMedicalConditions([...selectedMedicalConditions, condition.id]);
                  } else {
                    setSelectedMedicalConditions(selectedMedicalConditions.filter(id => id !== condition.id));
                  }
                }}
              />
              {condition.name}
            </label>

            {condition.requires_notes && (
              <input
                type="text"
                placeholder="Notes"
                onChange={(e) => handleSymptomChange(condition.id, "notes", e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h3>Ocular Conditions</h3>
        {ocularConditions?.map(condition => (
          <div key={condition.id}>
            <label>
              <input
                type="checkbox"
                value={condition.id}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedOcularConditions([...selectedOcularConditions, condition.id]);
                  } else {
                    setSelectedOcularConditions(selectedOcularConditions.filter(id => id !== condition.id));
                  }
                }}
              />
              {condition.name}
            </label>

            {condition.requires_affected_eye && (
              <select onChange={(e) => handleSymptomChange(condition.id, "affected_eye", e.target.value)}>
                <option value="">Select Eye</option>
                <option value="OS">OS (Left Eye)</option>
                <option value="OD">OD (Right Eye)</option>
                <option value="OU">OU (Both Eyes)</option>
              </select>
            )}

            {condition.requires_grading && (
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Grading"
                onChange={(e) => handleSymptomChange(condition.id, "grading", e.target.value)}
              />
            )}

            {condition.requires_notes && (
              <input
                type="text"
                placeholder="Notes"
                onChange={(e) => handleSymptomChange(condition.id, "notes", e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit}>Submit Case History</button>
    </div>
  );
};

export default CaseHistory;