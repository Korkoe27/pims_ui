import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import {
  clearError,
  clearSuccessMessage,
} from "../redux/slices/consultationSlice";
import SearchableSelect from "./SearchableSelect"; // New searchable dropdown component
import Radios from "./Radios";
import Inputs from "./Inputs";
import Notes from "./Notes";

const CaseHistory = ({ appointmentId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
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
  });

  const [caseHistoryId, setCaseHistoryId] = useState(null);
  const { data: fetchedCaseHistory, isLoading } = useFetchCaseHistoryQuery(
    appointmentId,
    { skip: !appointmentId }
  );
  const [createCaseHistory] = useCreateCaseHistoryMutation();
  const [updateCaseHistory] = useUpdateCaseHistoryMutation();

  useEffect(() => {
    if (fetchedCaseHistory) {
      setFormData(fetchedCaseHistory);
      setCaseHistoryId(fetchedCaseHistory.id);
    }
  }, [fetchedCaseHistory]);

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData({ ...formData, [name]: selectedOptions });
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

  if (isLoading) return <p>Loading case history...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      {/* Chief Complaint */}
      <div className="flex flex-col">
        <h1 className="text-base font-medium">
          Chief Complaint <span className="text-red-500">*</span>
        </h1>
        <textarea
          name="chiefComplaint"
          value={formData.chiefComplaint}
          onChange={(e) =>
            setFormData({ ...formData, chiefComplaint: e.target.value })
          }
          placeholder="Type in the patient’s chief complaint"
          className="p-4 border border-gray-300 resize-none rounded-md w-full h-32"
        ></textarea>
      </div>

      {/* Medical & Family History Section */}
      <section className="grid grid-cols-2 gap-8">
        {/* Patient's Medical History */}
        <SearchableSelect
          label="Patient’s Medical History"
          name="medicalHistory"
          options={[
            "Asthma",
            "Ulcer",
            "Diabetes",
            "Hypertension",
            "Sickle Cell",
            "STD/STI",
          ]}
          value={formData.medicalHistory}
          onChange={(selected) =>
            handleMultiSelectChange("medicalHistory", selected)
          }
        />

        {/* Family Medical History */}
        <SearchableSelect
          label="Family Medical History"
          name="familyMedicalHistory"
          options={[
            "Diabetes",
            "Hypertension",
            "Glaucoma",
            "Sickle Cell Disease",
          ]}
          value={formData.familyMedicalHistory}
          onChange={(selected) =>
            handleMultiSelectChange("familyMedicalHistory", selected)
          }
        />

        {/* Family Ocular History */}
        <SearchableSelect
          label="Family Ocular History"
          name="familyOcularHistory"
          options={["Glaucoma", "Spectacles", "Cataracts", "Eye Surgery"]}
          value={formData.familyOcularHistory}
          onChange={(selected) =>
            handleMultiSelectChange("familyOcularHistory", selected)
          }
        />

        {/* Patient's Ocular History */}
        <SearchableSelect
          label="Patient’s Ocular History"
          name="ocularHistory"
          options={["Spectacles", "Eye Surgery", "Ocular Trauma", "Glaucoma"]}
          value={formData.ocularHistory}
          onChange={(selected) =>
            handleMultiSelectChange("ocularHistory", selected)
          }
        />
      </section>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-4 border border-blue-600 text-blue-600 rounded-lg w-48"
        >
          Back
        </button>
        <button
          type="submit"
          className="p-4 bg-blue-600 text-white rounded-lg w-48"
        >
          Save and Proceed
        </button>
      </div>
    </form>
  );
};

export default CaseHistory;
