import React, { useState, useEffect } from "react";
import { useFetchCaseHistoryQuery, useFetchSymptomsQuery } from "../redux/api/features/consultationApi";
import SearchableSelect from "./SearchableSelect"; // ✅ Import SearchableSelect

const CaseHistory = ({ appointmentId }) => {
  // ✅ Fetch Case History
  const { data: caseHistory, isLoading: isCaseHistoryLoading } = useFetchCaseHistoryQuery(appointmentId, {
    skip: !appointmentId,
  });

  // ✅ Fetch On-Direct Questioning Symptoms
  const { data: symptomsData, isLoading: isSymptomsLoading } = useFetchSymptomsQuery();

  // ✅ State for Chief Complaint
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomDetails, setSymptomDetails] = useState({});

  // ✅ Update Fields when Case History is Fetched
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");

      if (caseHistory.on_direct_questioning) {
        setSelectedSymptoms(caseHistory.on_direct_questioning.map((s) => s.name));

        // ✅ Map the symptom details if they exist in case history
        const details = {};
        caseHistory.on_direct_questioning.forEach((s) => {
          details[s.name] = {
            affectedEye: s.affected_eye || "",
            grading: s.grading || "",
            notes: s.notes || "",
          };
        });
        setSymptomDetails(details);
      }
    }
  }, [caseHistory]);

  // ✅ Handle Symptoms Selection
  const handleSymptomChange = (selectedOptions) => {
    setSelectedSymptoms(selectedOptions);

    // ✅ Initialize details for newly selected symptoms
    const updatedDetails = { ...symptomDetails };
    selectedOptions.forEach((symptomName) => {
      const symptom = symptomsData?.find((s) => s.name === symptomName);
      if (symptom && !updatedDetails[symptomName]) {
        updatedDetails[symptomName] = {
          affectedEye: symptom.requires_affected_eye ? "" : null,
          grading: symptom.requires_grading ? "" : null,
          notes: symptom.requires_notes ? "" : null,
        };
      }
    });

    setSymptomDetails(updatedDetails);
  };

  // ✅ Handle Symptom Details Change
  const handleSymptomDetailChange = (symptom, field, value) => {
    setSymptomDetails((prev) => ({
      ...prev,
      [symptom]: {
        ...prev[symptom],
        [field]: value,
      },
    }));
  };

  if (isCaseHistoryLoading || isSymptomsLoading) return <p>Loading Case History...</p>;

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Case History</h1>

      {/* ✅ Chief Complaint Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium">Chief Complaint</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Enter the patient's chief complaint..."
          className="p-3 border border-gray-300 rounded-md w-full h-24"
        ></textarea>
      </div>

      {/* ✅ On-Direct Questioning Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">On-Direct Questioning</h2>
        <SearchableSelect
          label="Select Symptoms"
          name="onDirectQuestioning"
          options={symptomsData || []}
          value={selectedSymptoms}
          onChange={handleSymptomChange}
          optionDetails={symptomsData || []}
        />
      </div>
    </div>
  );
};

export default CaseHistory;
