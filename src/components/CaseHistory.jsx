import React, { useState, useEffect } from "react";
import {
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import SearchableSelect from "./SearchableSelect";

const CaseHistory = ({ appointmentId }) => {
  // ✅ Fetch Data
  const { data: caseHistory, isLoading: isCaseHistoryLoading } =
    useFetchCaseHistoryQuery(appointmentId, { skip: !appointmentId });
  const { data: symptomsData, isLoading: isSymptomsLoading } =
    useFetchSymptomsQuery();
  const { data: medicalConditionsData, isLoading: isMedicalLoading } =
    useFetchMedicalConditionsQuery();
  const { data: ocularConditionsData, isLoading: isOcularLoading } =
    useFetchOcularConditionsQuery();

  // ✅ Mutation for Creating Case History
  const [createCaseHistory, { isLoading: isCreating }] =
    useCreateCaseHistoryMutation();

  // ✅ State Management
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
  const [selectedOcularHistory, setSelectedOcularHistory] = useState([]);
  const [selectedFamilyMedicalHistory, setSelectedFamilyMedicalHistory] =
    useState([]);
  const [selectedFamilyOcularHistory, setSelectedFamilyOcularHistory] =
    useState([]);
  const [drugHistory, setDrugHistory] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // ✅ Convert Symptom Names to UUIDs
  const getSymptomUUIDs = (selectedNames) => {
    if (!symptomsData) return [];
    return selectedNames
      .map((name) => {
        const symptom = symptomsData.find((s) => s.name === name);
        return symptom ? symptom.id : null;
      })
      .filter(Boolean); // ✅ Remove null values
  };

  // ✅ Load Case History Data
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");
      setDrugHistory(caseHistory.drug_history || "");

      if (caseHistory.symptoms?.length > 0) {
        setSelectedSymptoms(caseHistory.symptoms.map((s) => s.name));
      }

      if (caseHistory.patient_history) {
        const history = caseHistory.patient_history;
        setSelectedMedicalHistory(
          history.medical_conditions?.map((s) => s.id) || []
        );
        setSelectedOcularHistory(
          history.ocular_conditions?.map((s) => s.id) || []
        );
        setSelectedFamilyMedicalHistory(
          history.family_medical_history?.map((s) => s.id) || []
        );
        setSelectedFamilyOcularHistory(
          history.family_ocular_history?.map((s) => s.id) || []
        );
      }
    }
  }, [caseHistory]);

  // ✅ Handle "Save and Proceed"
  const handleSaveAndProceed = async () => {
    setErrorMessage(null);

    if (!chiefComplaint.trim()) {
      setErrorMessage("Chief Complaint is required.");
      return;
    }

    const caseHistoryData = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      symptoms: getSymptomUUIDs(selectedSymptoms).map((id) => ({
        symptom: id,
      })), // ✅ Send UUIDs
      patient_history: {
        medical_conditions: selectedMedicalHistory.map((id) => ({
          medical_condition: id,
        })),
        ocular_conditions: selectedOcularHistory.map((id) => ({
          ocular_condition: id,
        })),
        family_medical_history: selectedFamilyMedicalHistory.map((id) => ({
          medical_condition: id,
        })),
        family_ocular_history: selectedFamilyOcularHistory.map((id) => ({
          ocular_condition: id,
        })),
      },
      drug_history: drugHistory,
    };

    try {
      await createCaseHistory(caseHistoryData);
      alert("New Case History version created successfully!");
    } catch (error) {
      console.error("Error creating case history:", error);
      setErrorMessage(
        error.data?.appointment?.[0] ||
          error.data?.chief_complaint?.[0] ||
          error.data?.symptoms?.[0]?.symptom?.[0] ||
          "Failed to save case history."
      );
    }
  };

  if (
    isCaseHistoryLoading ||
    isSymptomsLoading ||
    isMedicalLoading ||
    isOcularLoading
  )
    return <p>Loading Case History...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-400 rounded">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
          <h2 className="text-lg font-semibold">
            Chief Complaint <span className="text-red-500">*</span>
          </h2>
          <textarea
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Enter the patient's chief complaint..."
            className="p-3 border border-gray-300 rounded-md w-full h-32 focus:ring focus:ring-blue-200"
          ></textarea>

          <h2 className="text-lg font-semibold">On-Direct Questioning</h2>
          <SearchableSelect
            label="Select Symptoms"
            name="onDirectQuestioning"
            options={symptomsData || []}
            value={selectedSymptoms}
            onChange={setSelectedSymptoms}
          />

          <h2 className="text-lg font-semibold">Patient’s Medical History</h2>
          <SearchableSelect
            label="Select any that apply"
            options={medicalConditionsData || []}
            value={selectedMedicalHistory}
            onChange={setSelectedMedicalHistory}
          />

          <h2 className="text-lg font-semibold">Patient’s Ocular History</h2>
          <SearchableSelect
            label="Select any that apply"
            options={ocularConditionsData || []}
            value={selectedOcularHistory}
            onChange={setSelectedOcularHistory}
          />
        </div>

        <div className="flex flex-col gap-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
          <h2 className="text-lg font-semibold">Family Medical History</h2>
          <SearchableSelect
            label="Select any that apply"
            options={medicalConditionsData || []}
            value={selectedFamilyMedicalHistory}
            onChange={setSelectedFamilyMedicalHistory}
          />

          <h2 className="text-lg font-semibold">Family Ocular History</h2>
          <SearchableSelect
            label="Select any that apply"
            options={ocularConditionsData || []}
            value={selectedFamilyOcularHistory}
            onChange={setSelectedFamilyOcularHistory}
          />

          <h2 className="text-lg font-semibold">Drug History</h2>
          <textarea
            value={drugHistory}
            onChange={(e) => setDrugHistory(e.target.value)}
            placeholder="Enter drug history..."
            className="p-3 border border-gray-300 rounded-md w-full h-32"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSaveAndProceed}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
};

export default CaseHistory;
