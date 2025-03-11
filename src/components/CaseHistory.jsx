import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import SearchableSelect from "../components/SearchableSelect"; // ✅ Import Searchable Select Component

const CaseHistory = ({ appointmentId, setActiveTab }) => {
  const navigate = useNavigate(); // ✅ Navigation Hook

  // Fetch existing case history
  const {
    data: caseHistory,
    error: caseHistoryError,
    isLoading: caseHistoryLoading,
  } = useFetchCaseHistoryQuery(appointmentId);

  // Fetch dropdown data
  const { data: symptoms } = useFetchSymptomsQuery();
  const { data: medicalConditions } = useFetchMedicalConditionsQuery();
  const { data: ocularConditions } = useFetchOcularConditionsQuery();

  // Mutation for creating a case history
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  // Form states
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); // ✅ API Errors

  // ✅ Load Existing Data When Available
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");

      if (caseHistory.symptoms) {
        const prefilledSymptoms = caseHistory.symptoms.map((s) => ({
          symptom: s.symptom, // ID
          affected_eye: s.affected_eye || "OU",
          grading: s.grading || null,
          notes: s.notes || "",
        }));
        setSelectedSymptoms(prefilledSymptoms);
      }
    }
  }, [caseHistory]);

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!chiefComplaint.trim()) {
      setErrorMessage({ chief_complaint: ["Chief complaint is required."] });
      return;
    }

    if (selectedSymptoms.length === 0) {
      setErrorMessage({ symptoms: ["At least one symptom must be selected."] });
      return;
    }

    // ✅ Format Symptoms & Remove Unnecessary Fields
    const formattedSymptoms = selectedSymptoms.map(
      ({ symptom, affected_eye, grading, notes }) => {
        const symptomObj = { symptom }; // ✅ Always include symptom ID
        const requiredSymptom = symptoms?.find((s) => s.id === symptom);

        if (requiredSymptom?.requires_affected_eye && affected_eye) {
          symptomObj.affected_eye = affected_eye;
        }
        if (requiredSymptom?.requires_grading) {
          symptomObj.grading = grading || 1; // ✅ Only send grading if required
        }
        if (requiredSymptom?.requires_notes) {
          symptomObj.notes = notes || "";
        }

        return symptomObj;
      }
    );

    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      symptoms: formattedSymptoms,
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();

      // ✅ Move to "Visual Acuity" tab instead of navigating away
      setErrorMessage(null);
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("Error creating case history:", error);

      // ✅ Display specific field errors
      const formattedErrors = error?.data
        ? Object.entries(error.data).reduce((acc, [field, messages]) => {
            acc[field] = Array.isArray(messages)
              ? messages.map((msg) => `• ${msg}`).join("\n")
              : messages;
            return acc;
          }, {})
        : { general: ["An unexpected error occurred."] };

      setErrorMessage(formattedErrors);
    }
  };

  if (caseHistoryLoading) return <p>Loading case history...</p>;
  if (caseHistoryError) return <p>Error loading case history</p>;

  return (
    <div>
      <h2>Case History</h2>

      {/* ✅ Display Specific Error Messages */}
      {errorMessage && (
        <div style={{ color: "red", whiteSpace: "pre-line" }}>
          {Object.entries(errorMessage).map(([key, messages]) => (
            <p key={key}>
              <strong>{key.replace("_", " ")}:</strong> {messages}
            </p>
          ))}
        </div>
      )}

      {/* ✅ Chief Complaint Input */}
      <div>
        <label className="font-medium">
          Chief Complaint<span className="text-red-500">*</span>
        </label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Type in the patient's chief complaint"
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* ✅ Searchable Select for Symptoms */}
      <div className="mt-4">
        <SearchableSelect
          label="Symptoms"
          name="symptoms"
          options={symptoms || []}
          value={selectedSymptoms}
          onChange={setSelectedSymptoms}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        {isSubmitting ? "Submitting..." : "Submit Case History"}
      </button>
    </div>
  );
};

export default CaseHistory;
