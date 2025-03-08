import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import { clearError, clearSuccessMessage } from "../redux/slices/consultationSlice";
import SearchableSelect from "./SearchableSelect";
import Inputs from "./Inputs";
import Notes from "./Notes"; // ✅ Use Notes component

const CaseHistory = ({ appointmentId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
      drugHistory: "",
      allergies: "",
      socialHistory: "",
      notes: {}, // Store notes for each field
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

  // Save note for a specific field
  const saveNote = (field, note) => {
    setFormData((prev) => ({
      ...prev,
      notes: { ...prev.notes, [field]: note },
    }));
  };

  if (isLoading) return <p>Loading case history...</p>;

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

          <SearchableSelect
            label="On-Direct Questioning"
            name="onDirectQuestioning"
            options={[
              "Burning Sensation",
              "Itching",
              "Tearing",
              "Double Vision",
              "Discharge",
              "Pain",
              "Photophobia",
              "Foreign Body Sensation (FBS)",
            ]}
            value={formData.onDirectQuestioning || []}
            onChange={(selected) => handleMultiSelectChange("onDirectQuestioning", selected)}
          />

          <SearchableSelect
            label="Patient's Medical History"
            name="medicalHistory"
            options={["Asthma", "Ulcer", "Diabetes", "Hypertension", "Sickle Cell", "STD/STI"]}
            value={formData.medicalHistory || []}
            onChange={(selected) => handleMultiSelectChange("medicalHistory", selected)}
          />

          <Inputs
            type="date"
            label="Date of Last Examination"
            name="lastEyeExamination"
            value={formData.lastEyeExamination || ""}
            onChange={(e) => setFormData({ ...formData, lastEyeExamination: e.target.value })}
          />

          <SearchableSelect
            label="Patient's Ocular History"
            name="ocularHistory"
            options={["Spectacles", "Contact Lenses", "Eye Surgery", "Ocular Trauma", "Glaucoma", "Cataracts", "Retinal Detachment"]}
            value={formData.ocularHistory || []}
            onChange={(selected) => handleMultiSelectChange("ocularHistory", selected)}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 min-h-[500px] p-4">
          <SearchableSelect
            label="Family Medical History"
            name="familyMedicalHistory"
            options={["Diabetes", "Hypertension", "Glaucoma", "Sickle Cell Disease"]}
            value={formData.familyMedicalHistory}
            onChange={(selected) => handleMultiSelectChange("familyMedicalHistory", selected)}
          />

          <SearchableSelect
            label="Family Ocular History"
            name="familyOcularHistory"
            options={["Glaucoma", "Spectacles", "Cataracts", "Eye Surgery"]}
            value={formData.familyOcularHistory}
            onChange={(selected) => handleMultiSelectChange("familyOcularHistory", selected)}
          />

          {/* Input Fields with Notes */}
          {["drugHistory", "allergies", "socialHistory"].map((field) => (
            <div key={field} className="flex flex-col">
              <Inputs
                type="text"
                label={`Patient’s ${field.replace(/([A-Z])/g, " $1")}`}
                name={field}
                value={formData[field] || ""}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
              {/* ✅ Use Notes Component */}
              <Notes label={`Patient’s ${field.replace(/([A-Z])/g, " $1")}`} onSave={(note) => saveNote(field, note)} />
            </div>
          ))}
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
