import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi";
import ErrorModal from "../components/ErrorModal";

const PersonalHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector((state) => state.appointments.selectedAppointment);
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const { medicalConditions, ocularConditions, isLoading } = useCaseHistoryData(patientId, appointmentId);

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [ocularHistory, setOcularHistory] = useState([]);
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState([]);
  const [familyOcularHistory, setFamilyOcularHistory] = useState([]);
  const [drugHistory, setDrugHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [lastEyeExamination, setLastEyeExamination] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [createCaseHistory, { isLoading: isSubmitting }] = useCreateCaseHistoryMutation();

  // ✅ Last Eye Examination Dropdown Options
  const lastEyeExamOptions = [
    { value: "Never", label: "Never" },
    { value: "<1 week", label: "<1 week" },
    { value: "<3 months", label: "<3 months" },
    { value: "6 months - 1 year", label: "6 months - 1 year" },
    { value: "1 - 3 years", label: "1 - 3 years" },
    { value: ">3 years", label: ">3 years" },
  ];

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!patientId) {
      setErrorMessage({ patient: ["Patient ID is required but was not found."] });
      setShowErrorModal(true);
      return;
    }

    const newPersonalHistory = {
      appointment: appointmentId,
      patient: patientId,
      medical_history: medicalHistory,
      ocular_history: ocularHistory,
      family_medical_history: familyMedicalHistory,
      family_ocular_history: familyOcularHistory,
      drug_history: drugHistory,
      allergies: allergies,
      social_history: socialHistory,
      last_eye_examination: lastEyeExamination,
    };

    try {
      await createCaseHistory(newPersonalHistory).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("🚨 Error saving personal history:", error);
      setErrorMessage(error?.data || { general: ["An unexpected error occurred."] });
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">Personal History</h2>

      {isLoading && <p className="text-gray-500">Loading Data...</p>}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <SearchableSelect
            label="Patient Medical History"
            options={medicalConditions || []}
            value={medicalHistory}
            onChange={setMedicalHistory}
          />
          <SearchableSelect
            label="Patient Ocular History"
            options={ocularConditions || []}
            value={ocularHistory}
            onChange={setOcularHistory}
          />
          <SearchableSelect
            label="Last Eye Examination"
            options={lastEyeExamOptions}
            value={lastEyeExamination}
            onChange={setLastEyeExamination}
          />
        </div>

        {/* Right Column */}
        <div>
          <SearchableSelect
            label="Family Medical History"
            options={medicalConditions || []}
            value={familyMedicalHistory}
            onChange={setFamilyMedicalHistory}
          />
          <SearchableSelect
            label="Family Ocular History"
            options={ocularConditions || []}
            value={familyOcularHistory}
            onChange={setFamilyOcularHistory}
          />

          <label className="block text-sm font-medium text-gray-700">
            Patient's Drug History <span className="text-red-500">*</span>
          </label>
          <textarea
            value={drugHistory}
            onChange={(e) => setDrugHistory(e.target.value)}
            className="w-full p-3 border rounded-md mt-2"
            placeholder="Enter drug history"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Allergies
          </label>
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full p-3 border rounded-md mt-2"
            placeholder="Enter allergies"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Social History
          </label>
          <textarea
            value={socialHistory}
            onChange={(e) => setSocialHistory(e.target.value)}
            className="w-full p-3 border rounded-md mt-2"
            placeholder="Enter social history"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSaveAndProceed}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md w-full"
        >
          {isSubmitting ? "Saving..." : "Save & Proceed"}
        </button>
      </div>

      {showErrorModal && errorMessage && (
        <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
};

export default PersonalHistory;
