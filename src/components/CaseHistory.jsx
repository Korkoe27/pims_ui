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

  // Handle symptom selection and field updates
  const handleSymptomChange = (symptomId, field, value) => {
    setSelectedSymptoms((prev) => {
      const updatedSymptoms = prev.map((symptom) =>
        symptom.symptom === symptomId ? { ...symptom, [field]: value } : symptom
      );

      return prev.some((s) => s.symptom === symptomId)
        ? updatedSymptoms
        : [...prev, { symptom: symptomId, [field]: value }];
    });
  };

  // Handle checkbox selection for symptoms
  const handleSymptomCheckbox = (symptomId, checked) => {
    setSelectedSymptoms((prev) => {
      if (checked) {
        return [...prev, { symptom: symptomId }];
      } else {
        return prev.filter(s => s.symptom !== symptomId);
      }
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!chiefComplaint.trim()) {
        alert("Chief complaint is required!");
        return;
    }

    if (selectedSymptoms.length === 0) {
        alert("At least one symptom must be selected.");
        return;
    }

    // ✅ Filter out empty objects from symptoms
    const formattedSymptoms = selectedSymptoms
      .filter(s => s.symptom) // Removes empty objects
      .map(({ symptom, ...rest }) => ({
        symptom, // ✅ Only valid symptom IDs
        ...rest
      }));

    // ✅ Filter valid IDs for medical & ocular conditions
    const formattedMedicalConditions = selectedMedicalConditions.filter(id => id);
    const formattedOcularConditions = selectedOcularConditions.filter(id => id);

    const newCaseHistory = {
        appointment: appointmentId,
        chief_complaint: chiefComplaint,
        symptoms: formattedSymptoms,
        medical_conditions: formattedMedicalConditions,
        ocular_conditions: formattedOcularConditions,
    };

    console.log("Submitting Case History:", JSON.stringify(newCaseHistory, null, 2));

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
                onChange={(e) => handleSymptomCheckbox(symptom.id, e.target.checked)}
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
          </div>
        ))}
      </div>

      <button onClick={handleSubmit}>Submit Case History</button>
    </div>
  );
};

export default CaseHistory;
