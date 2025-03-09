import React, { useState, useEffect } from "react";
import {
  useFetchCaseHistoryQuery,
  useFetchSymptomsQuery,
} from "../redux/api/features/consultationApi";
import SearchableSelect from "./SearchableSelect"; // ✅ Import SearchableSelect

const CaseHistory = ({ appointmentId }) => {
  // ✅ Fetch Case History
  const { data: caseHistory, isLoading: isCaseHistoryLoading } =
    useFetchCaseHistoryQuery(appointmentId, {
      skip: !appointmentId,
    });

  // ✅ Fetch On-Direct Questioning Symptoms
  const { data: symptomsData, isLoading: isSymptomsLoading } =
    useFetchSymptomsQuery();

  // ✅ State Management
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedFamilyMedicalHistory, setSelectedFamilyMedicalHistory] =
    useState([]);
  const [selectedFamilyOcularHistory, setSelectedFamilyOcularHistory] =
    useState([]);
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
  const [drugHistory, setDrugHistory] = useState("");

  // ✅ Update Fields when Case History is Fetched
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");

      if (caseHistory.on_direct_questioning) {
        setSelectedSymptoms(
          caseHistory.on_direct_questioning.map((s) => s.name)
        );
      }

      if (caseHistory.family_medical_history) {
        setSelectedFamilyMedicalHistory(
          caseHistory.family_medical_history.map((s) => s.name)
        );
      }

      if (caseHistory.family_ocular_history) {
        setSelectedFamilyOcularHistory(
          caseHistory.family_ocular_history.map((s) => s.name)
        );
      }

      if (caseHistory.medical_history) {
        setSelectedMedicalHistory(
          caseHistory.medical_history.map((s) => s.name)
        );
      }

      setDrugHistory(caseHistory.drug_history || "");
    }
  }, [caseHistory]);

  if (isCaseHistoryLoading || isSymptomsLoading)
    return <p>Loading Case History...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      {/* ✅ Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ✅ Left Column - Chief Complaint & On-Direct Questioning */}
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
            name="medicalHistory"
            options={[
              "Asthma",
              "Ulcer",
              "Diabetes",
              "Hypertension",
              "Sickle Cell",
              "STD/STI",
            ]}
            value={selectedMedicalHistory}
            onChange={setSelectedMedicalHistory}
          />

          <h2 className="text-lg font-semibold">Last Eye Examination</h2>
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-200"
          />
        </div>

        {/* ✅ Right Column - Family Medical History, Family Ocular History, & Drug History */}
        <div className="flex flex-col gap-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
          <h2 className="text-lg font-semibold">Family Medical History</h2>
          <SearchableSelect
            label="Select any more that apply"
            name="familyMedicalHistory"
            options={[
              "Diabetes",
              "Hypertension",
              "Glaucoma",
              "Sickle Cell Disease",
            ]}
            value={selectedFamilyMedicalHistory}
            onChange={setSelectedFamilyMedicalHistory}
          />

          <h2 className="text-lg font-semibold">Family Ocular History</h2>
          <SearchableSelect
            label="Select any more that apply"
            name="familyOcularHistory"
            options={["Glaucoma", "Spectacles", "Cataracts", "Eye Surgery"]}
            value={selectedFamilyOcularHistory}
            onChange={setSelectedFamilyOcularHistory}
          />

          <h2 className="text-lg font-semibold">Patient’s Drug History</h2>
          <textarea
            value={drugHistory}
            onChange={(e) => setDrugHistory(e.target.value)}
            placeholder="Enter patient’s drug history..."
            className="p-3 border border-gray-300 rounded-md w-full h-24 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>
      </div>

      {/* ✅ Save and Proceed Button */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
          Save and Proceed
        </button>
      </div>
    </div>
  );
};

export default CaseHistory;
