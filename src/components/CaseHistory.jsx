import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
  useFetchSymptomsQuery, // ✅ Fetch symptoms dynamically
} from "../redux/api/features/consultationApi";
import { clearError, clearSuccessMessage } from "../redux/slices/consultationSlice";
import SearchableSelect from "./SearchableSelect";
import Inputs from "./Inputs";
import Notes from "./Notes"; // ✅ Use Notes component

const CaseHistory = ({ appointmentId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ Fetch symptoms from backend
  const { data: symptomsData, isLoading: isSymptomsLoading } = useFetchSymptomsQuery();

  // Load saved form data from localStorage
  const savedData = JSON.parse(localStorage.getItem(`caseHistory-${appointmentId}`));

  const [formData, setFormData] = useState(
    savedData || {
      appointment: appointmentId || "",
      chiefComplaint: "",
      lastEyeExamination: "",
      medicalHistory: [],
      ocularHistory: [],
      familyMedicalHistory: [],
      familyOcularHistory: [],
      onDirectQuestioning: [],
      symptomDetails: {}, // ✅ Stores affected eye, grading, and notes per symptom
      drugHistory: "",
      allergies: "",
      socialHistory: "",
    }
  );

  const [caseHistoryId, setCaseHistoryId] = useState(null);
  const { data: fetchedCaseHistory, isLoading } = useFetchCaseHistoryQuery(appointmentId, {
    skip: !appointmentId,
  });

  const [createCaseHistory] = useCreateCaseHistoryMutation();
  const [updateCaseHistory] = useUpdateCaseHistoryMutation();

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`caseHistory-${appointmentId}`, JSON.stringify(formData));
  }, [formData, appointmentId]);

  // Load data from API if it exists
  useEffect(() => {
    if (fetchedCaseHistory) {
      setFormData(fetchedCaseHistory);
      setCaseHistoryId(fetchedCaseHistory.id);
    }
  }, [fetchedCaseHistory]);

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOptions }));

    // ✅ Automatically initialize details for selected symptoms
    if (name === "onDirectQuestioning") {
      const updatedDetails = { ...formData.symptomDetails };

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

      setFormData((prev) => ({ ...prev, symptomDetails: updatedDetails }));
    }
  };

  const handleSymptomDetailChange = (symptom, field, value) => {
    setFormData((prev) => ({
      ...prev,
      symptomDetails: {
        ...prev.symptomDetails,
        [symptom]: {
          ...prev.symptomDetails[symptom],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, created_by: user.id };

      if (caseHistoryId) {
        await updateCaseHistory({ appointmentId, ...payload });
        alert("Case history updated successfully!");
      } else {
        await createCaseHistory(payload);
        alert("Case history created successfully!");
      }
      dispatch(clearSuccessMessage());
    } catch (error) {
      console.error("Error submitting case history:", error);
      dispatch(clearError());
    }
  };

  if (isLoading || isSymptomsLoading) return <p>Loading case history...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      {/* Two Independent Columns */}
      <section className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6 min-h-[500px] p-4">
          <h1 className="text-base font-medium">
            Chief Complaint <span className="text-red-500">*</span>
          </h1>
          <textarea
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
            placeholder="Type in the patient’s chief complaint"
            className="p-4 border border-gray-300 resize-none rounded-md w-full h-32"
          ></textarea>

          {/* On-Direct Questioning (Fetch options from backend) */}
          <SearchableSelect
            label="On-Direct Questioning"
            name="onDirectQuestioning"
            options={symptomsData ? symptomsData.map((s) => s.name) : []}
            value={formData.onDirectQuestioning || []}
            onChange={(selected) => handleMultiSelectChange("onDirectQuestioning", selected)}
          />

          {/* Dynamic Fields for On-Direct Questioning */}
          {formData.onDirectQuestioning.map((symptom) => {
            const symptomObj = symptomsData?.find((s) => s.name === symptom);
            if (!symptomObj) return null;

            return (
              <div key={symptom} className="flex flex-col gap-2 p-2 border rounded-md">
                <h2 className="font-semibold">{symptom}</h2>

                {/* Conditionally Show Affected Eye */}
                {symptomObj.requires_affected_eye && (
                  <>
                    <label className="text-sm font-medium">Affected Eye</label>
                    <select
                      value={formData.symptomDetails[symptom]?.affectedEye || ""}
                      onChange={(e) => handleSymptomDetailChange(symptom, "affectedEye", e.target.value)}
                      className="p-2 border rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="OD">Right Eye</option>
                      <option value="OS">Left Eye</option>
                      <option value="OU">Both Eyes</option>
                    </select>
                  </>
                )}

                {/* Conditionally Show Grading */}
                {symptomObj.requires_grading && (
                  <>
                    <label className="text-sm font-medium">Grading</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.symptomDetails[symptom]?.grading || ""}
                      onChange={(e) => handleSymptomDetailChange(symptom, "grading", e.target.value)}
                      className="p-2 border rounded-md"
                    />
                  </>
                )}

                {/* Conditionally Show Notes */}
                {symptomObj.requires_notes && (
                  <Notes
                    label={`Notes for ${symptom}`}
                    onSave={(note) => handleSymptomDetailChange(symptom, "notes", note)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Buttons */}
      <div className="flex justify-center mt-6 mb-4">
        <button type="submit" className="py-2 px-6 bg-[#2F3192] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#252774] transition-all duration-300">
          Save and proceed
        </button>
      </div>
    </form>
  );
};

export default CaseHistory;
