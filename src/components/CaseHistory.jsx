import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi";
import ErrorModal from "../components/ErrorModal";

const CaseHistory = ({ appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientId = selectedAppointment?.patient;

  const { caseHistory, ocularConditions, medicalConditions, isLoading } =
    useCaseHistoryData(patientId, appointmentId);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [conditionDetails, setConditionDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [ocularHistory, setOcularHistory] = useState([]);
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState([]);
  const [familyOcularHistory, setFamilyOcularHistory] = useState([]);
  const [drugHistory, setDrugHistory] = useState("");
  const [lastEyeExamination, setLastEyeExamination] = useState("");

  // ✅ Dropdown Options for Last Eye Examination
  const lastEyeExamOptions = [
    { value: "Never", label: "Never" },
    { value: "<1 week", label: "<1 week" },
    { value: "<3 months", label: "<3 months" },
    { value: "6 months - 1 year", label: "6 months - 1 year" },
    { value: "1 - 3 years", label: "1 - 3 years" },
    { value: ">3 years", label: ">3 years" },
  ];

  useEffect(() => {
    if (caseHistory) {
      console.log("📄 Case History Data Fetched:", caseHistory);

      setChiefComplaint(caseHistory.chief_complaint || "");
      setMedicalHistory(caseHistory.medical_history || []);
      setOcularHistory(caseHistory.ocular_history || []);
      setFamilyMedicalHistory(caseHistory.family_medical_history || []);
      setFamilyOcularHistory(caseHistory.family_ocular_history || []);
      setDrugHistory(caseHistory.drug_history || "");
      setLastEyeExamination(caseHistory.last_eye_examination || "");

      // ✅ Directly setting condition details from API response
      setConditionDetails(caseHistory.condition_details || []);
    }
  }, [caseHistory]);

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!chiefComplaint.trim()) {
      setErrorMessage({ chief_complaint: ["Chief complaint is required."] });
      setShowErrorModal(true);
      return;
    }

    if (conditionDetails.length === 0) {
      setErrorMessage({
        condition_details: ["At least one ocular condition must be selected."],
      });
      setShowErrorModal(true);
      return;
    }

    if (!patientId) {
      setErrorMessage({
        patient: ["Patient ID is required but was not found."],
      });
      setShowErrorModal(true);
      return;
    }

    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      condition_details: conditionDetails.map(
        ({ ocular_condition, affected_eye, grading, notes }) => ({
          ocular_condition,
          affected_eye: affected_eye || null,
          grading: grading || null,
          notes: notes || null,
        })
      ),
      patient_history: { id: patientId },
      medical_history: medicalHistory,
      ocular_history: ocularHistory,
      family_medical_history: familyMedicalHistory,
      family_ocular_history: familyOcularHistory,
      drug_history: drugHistory,
      last_eye_examination: lastEyeExamination,
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("🚨 Error saving case history:", error);
      setErrorMessage(
        error?.data || { general: ["An unexpected error occurred."] }
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">Case History</h2>

      {isLoading && <p className="text-gray-500">Loading Data...</p>}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chief Complaint <span className="text-red-500">*</span>
          </label>
          <textarea
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            className="w-full p-3 border rounded-md mt-2"
            placeholder="Describe the patient's main issue"
          />

          {/* ✅ On-Direct Questioning */}
          <SearchableSelect
            label="On-Direct Questioning"
            options={ocularConditions || []}
            value={conditionDetails.map((cond) => ({
              value: cond.ocular_condition,
              label: cond.ocular_condition_name,
            }))}
            onChange={setConditionDetails}
          />

        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSaveAndProceed}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md w-full transition duration-300 hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : "Save & Proceed"}
        </button>
      </div>

      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default CaseHistory;
