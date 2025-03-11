import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import SearchableSelect from "../components/SearchableSelect";

/**
 * CaseHistory Component
 * - Fetches case history details
 * - Pre-fills existing data
 * - Handles new case history submission with validation
 */
const CaseHistory = ({ appointmentId, setActiveTab }) => {
  const navigate = useNavigate();

  /** === Fetching Data === */
  const {
    data: caseHistory,
    error: caseHistoryError,
    isLoading: caseHistoryLoading,
  } = useFetchCaseHistoryQuery(appointmentId);

  const { data: symptoms } = useFetchSymptomsQuery();
  const { data: medicalConditions } = useFetchMedicalConditionsQuery();
  const { data: ocularConditions } = useFetchOcularConditionsQuery();

  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  /** === State Management === */
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [lastEyeExam, setLastEyeExam] = useState("");
  const [drugHistory, setDrugHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMedicalConditions, setSelectedMedicalConditions] = useState([]);
  const [selectedOcularConditions, setSelectedOcularConditions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  /** === Pre-fill existing case history data === */
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");
      setLastEyeExam(caseHistory.patient_history?.last_eye_exam || "");
      setDrugHistory(caseHistory.patient_history?.drug_history || "");
      setAllergies(caseHistory.patient_history?.allergies || "");
      setSocialHistory(caseHistory.patient_history?.social_history || "");

      if (caseHistory.symptoms) {
        setSelectedSymptoms(
          caseHistory.symptoms.map((s) => ({
            symptom: s.symptom,
            affected_eye: s.affected_eye || "OU",
            grading: s.grading || null,
            notes: s.notes || "",
          }))
        );
      }

      if (caseHistory.patient_history?.medical_conditions) {
        setSelectedMedicalConditions(caseHistory.patient_history.medical_conditions);
      }

      if (caseHistory.patient_history?.ocular_conditions) {
        setSelectedOcularConditions(caseHistory.patient_history.ocular_conditions);
      }
    }
  }, [caseHistory]);

  /** === Form Submission Handling === */
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

    // **Format Symptoms**
    const formattedSymptoms = selectedSymptoms.map(({ symptom, affected_eye, grading, notes }) => {
      const symptomObj = { symptom };
      const requiredSymptom = symptoms?.find((s) => s.id === symptom);

      if (requiredSymptom?.requires_affected_eye) {
        symptomObj.affected_eye = affected_eye;
      }
      if (requiredSymptom?.requires_grading) {
        symptomObj.grading = grading || 1;
      }
      if (requiredSymptom?.requires_notes) {
        symptomObj.notes = notes || "";
      }

      return symptomObj;
    });

    // **New Case History Object**
    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      last_eye_exam: lastEyeExam,
      drug_history: drugHistory,
      allergies: allergies,
      social_history: socialHistory,
      symptoms: formattedSymptoms,
      medical_conditions: selectedMedicalConditions,
      ocular_conditions: selectedOcularConditions,
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setErrorMessage(null);
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("Error creating case history:", error);
      setErrorMessage(
        error?.data
          ? Object.entries(error.data).reduce(
              (acc, [field, messages]) => ({
                ...acc,
                [field]: Array.isArray(messages)
                  ? messages.join("\n")
                  : messages,
              }),
              {}
            )
          : { general: ["An unexpected error occurred."] }
      );
    }
  };

  /** === Handling API Errors === */
  if (caseHistoryLoading) return <p>Loading case history...</p>;
  if (caseHistoryError) return <p>Error loading case history</p>;

  /** === Render Component UI === */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ✅ Left Column - Case History */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg">Case History</h2>

        {/* ✅ Chief Complaint Input */}
        <div>
          <label className="font-medium">
            Chief Complaint <span className="text-red-500">*</span>
          </label>
          <textarea
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Type in the patient's chief complaint"
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* ✅ Last Eye Exam Dropdown */}
        <div>
          <label className="font-medium">Last Eye Examination</label>
          <select
            value={lastEyeExam}
            onChange={(e) => setLastEyeExam(e.target.value)}
            className="w-full p-3 border rounded-md"
          >
            <option value="">Select...</option>
            <option value="never">Never had an eye exam</option>
            <option value="less_than_1_week">Less than 1 week</option>
            <option value="less_than_3_months">Less than 3 months</option>
            <option value="6months_to_1_year">6 months to 1 year</option>
            <option value="1_to_3_years">1 - 3 years</option>
            <option value="more_than_3_years">More than 3 years</option>
          </select>
        </div>

        {/* ✅ Symptoms Field (Searchable) */}
        <SearchableSelect
          label="Symptoms"
          name="symptoms"
          options={symptoms || []}
          value={selectedSymptoms}
          onChange={setSelectedSymptoms}
        />
      </div>

      {/* ✅ Right Column - Patient History */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg">Patient History</h2>

        <SearchableSelect
          label="Medical Conditions"
          name="medical_conditions"
          options={medicalConditions || []}
          value={selectedMedicalConditions}
          onChange={setSelectedMedicalConditions}
        />

        <SearchableSelect
          label="Ocular Conditions"
          name="ocular_conditions"
          options={ocularConditions || []}
          value={selectedOcularConditions}
          onChange={setSelectedOcularConditions}
        />

        {/* ✅ Drug History */}
        <textarea
          value={drugHistory}
          onChange={(e) => setDrugHistory(e.target.value)}
          placeholder="Enter patient's drug history"
          className="w-full p-3 border rounded-md"
        />

        {/* ✅ Allergies */}
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Enter any allergies"
          className="w-full p-3 border rounded-md"
        />

        {/* ✅ Social History */}
        <textarea
          value={socialHistory}
          onChange={(e) => setSocialHistory(e.target.value)}
          placeholder="Enter social history"
          className="w-full p-3 border rounded-md"
        />
      </div>
    </div>
  );
};

export default CaseHistory;
