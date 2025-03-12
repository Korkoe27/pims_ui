import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  useFetchPatientHistoryQuery,
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import SearchableSelect from "../components/SearchableSelect";

const CaseHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  /** === Fetch Data === */
  const { data: patientHistory, isLoading: loadingHistory } =
    useFetchPatientHistoryQuery(patientId, { skip: !patientId });

  const { data: caseHistory, isLoading: loadingCaseHistory } =
    useFetchCaseHistoryQuery(appointmentId);

  const { data: symptoms } = useFetchSymptomsQuery();
  const { data: medicalConditions } = useFetchMedicalConditionsQuery();
  const { data: ocularConditions } = useFetchOcularConditionsQuery();
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  /** === State Management === */
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [directQuestioning, setDirectQuestioning] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMedicalConditions, setSelectedMedicalConditions] = useState([]);
  const [selectedOcularConditions, setSelectedOcularConditions] = useState([]);
  const [drugHistory, setDrugHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  /** === Pre-fill Existing Data === */
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");
      setSelectedSymptoms(caseHistory.symptoms || []);
    }
    if (patientHistory) {
      setSelectedMedicalConditions(patientHistory.medical_conditions || []);
      setSelectedOcularConditions(patientHistory.ocular_conditions || []);
      setDrugHistory(patientHistory.drug_history || "");
      setAllergies(patientHistory.allergies || "");
      setSocialHistory(patientHistory.social_history || "");
    }
  }, [caseHistory, patientHistory]);

  /** === Handle Form Submission === */
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

    if (!patientId) {
      setErrorMessage({
        patient: ["Patient ID is required but was not found."],
      });
      return;
    }

    // ✅ Format Payload
    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      on_direct_questioning: directQuestioning,
      symptoms: selectedSymptoms.map(({ symptom, affected_eye, grading, notes }) => ({
        symptom,
        affected_eye: affected_eye || "OU",
        grading: grading || 1,
        notes: notes || "",
      })),
      patient_history: {
        id: patientId,
        medical_conditions: selectedMedicalConditions,
        ocular_conditions: selectedOcularConditions,
        drug_history: drugHistory,
        allergies: allergies,
        social_history: socialHistory,
      },
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("🚨 Error creating case history:", error);
      setErrorMessage(
        error?.data || { general: ["An unexpected error occurred."] }
      );
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">Case History</h2>

      {/* ✅ Display Patient ID */}
      {/* <div className="p-4 bg-gray-100 border rounded-md mb-4">
        <p className="font-bold text-gray-700">Patient ID:</p>
        <p className="text-blue-600 font-bold text-lg">
          {patientId || "Not Available"}
        </p>
      </div> */}

      {/* ✅ Handle Loading */}
      {(loadingHistory || loadingCaseHistory) && (
        <p className="text-gray-500">Loading Case History...</p>
      )}

      {/* ✅ Handle Errors */}
      {errorMessage && (
        <div className="text-red-500 mb-4">
          {Object.entries(errorMessage).map(([field, messages]) => (
            <p key={field}>{`${field}: ${messages}`}</p>
          ))}
        </div>
      )}

      {/* ✅ Case History Form (2-Column Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Left Column */}
        <div className="space-y-4">
          {/* Chief Complaint */}
          <div>
            <label className="font-medium text-gray-600">
              Chief Complaint <span className="text-red-500">*</span>
            </label>
            <textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="Describe the patient's main issue"
            />
          </div>

          {/* On Direct Questioning */}
          <div>
            <label className="font-medium text-gray-600">
              On Direct Questioning
            </label>
          </div>

          {/* Symptoms */}
          <SearchableSelect
            // label="Symptoms"
            name="symptoms"
            options={symptoms || []}
            value={selectedSymptoms}
            onChange={setSelectedSymptoms}
          />

          {/* Medical History
          <SearchableSelect
            label="Patient's Medical History"
            name="medical_conditions"
            options={medicalConditions || []}
            value={selectedMedicalConditions}
            onChange={setSelectedMedicalConditions}
          /> */}

          {/* Last Eye Exam */}
          {/* <div>
            <label className="font-medium text-gray-600">Last Eye Exam</label>
            <p className="text-gray-600">
              {patientHistory?.last_eye_exam || "Not Available"}
            </p>
          </div> */}

          {/* Ocular History */}
          {/* <SearchableSelect
            label="Patient's Ocular History"
            name="ocular_conditions"
            options={ocularConditions || []}
            value={selectedOcularConditions}
            onChange={setSelectedOcularConditions}
          /> */}
        </div>

        {/* ✅ Right Column */}
        <div className="space-y-4">
          {/* Family Medical History */}
          {/* <SearchableSelect
            label="Family Medical History"
            name="family_medical_history"
            options={medicalConditions || []}
            value={selectedMedicalConditions}
            onChange={setSelectedMedicalConditions}
          /> */}

          {/* Family Ocular History */}
          {/* <SearchableSelect
            label="Family Ocular History"
            name="family_ocular_history"
            options={ocularConditions || []}
            value={selectedOcularConditions}
            onChange={setSelectedOcularConditions}
          /> */}

          {/* Drug History */}
          {/* <SearchableSelect
            label="Patient's Drug History"
            name="drug_history"
            value={drugHistory}
            onChange={setDrugHistory}
          /> */}

          {/* Allergies */}
          {/* <SearchableSelect
            label="Patient's Allergies"
            name="allergies"
            value={allergies}
            onChange={setAllergies}
          /> */}

          {/* Social History */}
         {/* <SearchableSelect
            label="Patient's Social History"
            name="social_history"
            value={socialHistory}
            onChange={setSocialHistory}
          />  */}
        </div>
      </div>

      {/* ✅ Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 mt-4"
      >
        {isSubmitting ? "Saving..." : "Save & Proceed"}
      </button>
    </div>
  );
};

export default CaseHistory;
