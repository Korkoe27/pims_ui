import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";

const CaseHistory = ({ appointmentId, setActiveTab }) => {
  const navigate = useNavigate(); // ✅ Redirect Hook

  // Fetch existing case history
  const {
    data: caseHistory,
    error: caseHistoryError,
    isLoading: caseHistoryLoading,
  } = useFetchCaseHistoryQuery(appointmentId);

  // Fetch dropdown options
  const { data: symptoms } = useFetchSymptomsQuery();
  const { data: medicalConditions } = useFetchMedicalConditionsQuery();
  const { data: ocularConditions } = useFetchOcularConditionsQuery();

  // Mutation for creating a new case history
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  // State for form submission
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMedicalConditions, setSelectedMedicalConditions] = useState(
    []
  );
  const [selectedOcularConditions, setSelectedOcularConditions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // ✅ Store API Errors

  // ✅ Handle symptom selection
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

  // ✅ Handle symptom checkbox selection
  const handleSymptomCheckbox = (symptomId, checked) => {
    setSelectedSymptoms((prev) => {
      if (checked) {
        return [...prev, { symptom: symptomId }];
      } else {
        return prev.filter((s) => s.symptom !== symptomId);
      }
    });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    setErrorMessage(null); // Reset errors before submitting

    if (!chiefComplaint.trim()) {
      setErrorMessage({ chief_complaint: ["Chief complaint is required."] });
      return;
    }

    if (selectedSymptoms.length === 0) {
      setErrorMessage({ symptoms: ["At least one symptom must be selected."] });
      return;
    }

    // ✅ Ensure All Symptoms Have Required Fields
    const formattedSymptoms = selectedSymptoms
      .map(({ symptom, affected_eye, grading, notes }) => {
        const symptomObj = { symptom }; // ✅ Always include symptom ID
        const requiredSymptom = symptoms?.find((s) => s.id === symptom);

        if (requiredSymptom?.requires_affected_eye && affected_eye) {
          symptomObj.affected_eye = affected_eye;
        }
        if (requiredSymptom?.requires_grading && grading) {
          symptomObj.grading = grading;
        }
        if (requiredSymptom?.requires_notes && notes) {
          symptomObj.notes = notes;
        }

        return symptomObj;
      })
      .filter((symptom) => Object.keys(symptom).length > 1); // ✅ Remove empty objects

    // ✅ Ensure medical and ocular conditions are only IDs
    const formattedMedicalConditions = selectedMedicalConditions.filter(
      (id) => id
    );
    const formattedOcularConditions = selectedOcularConditions.filter(
      (id) => id
    );

    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      symptoms: formattedSymptoms,
      medical_conditions: formattedMedicalConditions,
      ocular_conditions: formattedOcularConditions,
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();

      // ✅ Switch to the "Visual Acuity" tab instead of redirecting
      setErrorMessage(null);
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("Error creating case history:", error);
      setErrorMessage(
        error?.data || { general: ["An unexpected error occurred."] }
      );
    }
  };

  if (caseHistoryLoading) return <p>Loading case history...</p>;
  if (caseHistoryError) return <p>Error loading case history</p>;

  return (
    <div>
      <h2>Case History</h2>
      <pre>{JSON.stringify(caseHistory, null, 2)}</pre>

      <h2>Create New Case History</h2>

      {errorMessage && (
        <div style={{ color: "red" }}>
          {Object.entries(errorMessage).map(([key, messages]) => (
            <p key={key}>
              <strong>{key.replace("_", " ")}:</strong> {messages.join(", ")}
            </p>
          ))}
        </div>
      )}

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
        {symptoms?.map((symptom) => (
          <div key={symptom.id} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                value={symptom.id}
                onChange={(e) =>
                  handleSymptomCheckbox(symptom.id, e.target.checked)
                }
              />
              {symptom.name}
            </label>

            {symptom.requires_affected_eye && (
              <select
                onChange={(e) =>
                  handleSymptomChange(
                    symptom.id,
                    "affected_eye",
                    e.target.value
                  )
                }
              >
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
                onChange={(e) =>
                  handleSymptomChange(symptom.id, "grading", e.target.value)
                }
              />
            )}

            {symptom.requires_notes && (
              <input
                type="text"
                placeholder="Notes"
                onChange={(e) =>
                  handleSymptomChange(symptom.id, "notes", e.target.value)
                }
              />
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Case History"}
      </button>
    </div>
  );
};

export default CaseHistory;
