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
import SearchableSelect from "./SearchableSelect";
import Inputs from "./Inputs";
import NotesModal from "./NotesModal";

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
    notes: {}, // Store notes separately for each field
  });

  const [caseHistoryId, setCaseHistoryId] = useState(null);
  const { data: fetchedCaseHistory, isLoading } = useFetchCaseHistoryQuery(
    appointmentId,
    { skip: !appointmentId }
  );
  const [createCaseHistory] = useCreateCaseHistoryMutation();
  const [updateCaseHistory] = useUpdateCaseHistoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");

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

  // Open modal for adding a note
  const openNoteModal = (field) => {
    setSelectedField(field);
    setModalOpen(true);
  };

  // Save note for a specific field
  const saveNote = (note) => {
    setFormData((prev) => ({
      ...prev,
      notes: { ...prev.notes, [selectedField]: note },
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
            onChange={(e) =>
              setFormData({ ...formData, chiefComplaint: e.target.value })
            }
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
            onChange={(selected) =>
              handleMultiSelectChange("onDirectQuestioning", selected)
            }
          />

          <SearchableSelect
            label="Patient's Medical History"
            name="medicalHistory"
            options={[
              "Asthma",
              "Ulcer",
              "Diabetes",
              "Hypertension",
              "Sickle Cell",
              "STD/STI",
            ]}
            value={formData.medicalHistory || []}
            onChange={(selected) =>
              handleMultiSelectChange("medicalHistory", selected)
            }
          />

          <Inputs
            type="date"
            label="Date of Last Examination"
            name="lastEyeExamination"
            value={formData.lastEyeExamination || ""}
            onChange={(e) =>
              setFormData({ ...formData, lastEyeExamination: e.target.value })
            }
          />

          <SearchableSelect
            label="Patient's Ocular History"
            name="ocularHistory"
            options={[
              "Spectacles",
              "Contact Lenses",
              "Eye Surgery",
              "Ocular Trauma",
              "Glaucoma",
              "Cataracts",
              "Retinal Detachment",
            ]}
            value={formData.ocularHistory || []}
            onChange={(selected) =>
              handleMultiSelectChange("ocularHistory", selected)
            }
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 min-h-[500px] p-4">
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

          <SearchableSelect
            label="Family Ocular History"
            name="familyOcularHistory"
            options={["Glaucoma", "Spectacles", "Cataracts", "Eye Surgery"]}
            value={formData.familyOcularHistory}
            onChange={(selected) =>
              handleMultiSelectChange("familyOcularHistory", selected)
            }
          />

          <Inputs
            type="text"
            label="Patient’s Drug History"
            name="drugHistory"
            value={formData.drugHistory || ""}
            onChange={(e) =>
              setFormData({ ...formData, drugHistory: e.target.value })
            }
          />
          <button
            type="button"
            className="text-blue-600 hover:underline mt-2 flex items-center gap-1"
            onClick={() => openNoteModal("drugHistory")}
          >
            ✏️ <span>Add a note</span>
          </button>
          {formData.notes.drugHistory && (
            <p className="text-gray-500 text-sm mt-1">
              {formData.notes.drugHistory}
            </p>
          )}

          <Inputs
            type="text"
            label="Patient’s Allergies"
            name="allergies"
            value={formData.allergies || ""}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
          />
          <button
            type="button"
            className="text-blue-600 hover:underline mt-2 flex items-center gap-1"
            onClick={() => openNoteModal("allergies")}
          >
            ✏️ <span>Add a note</span>
          </button>

          <Inputs
            type="text"
            label="Patient’s Social History"
            name="socialHistory"
            placeholder="e.g., Driver, Smoker, Computer use"
            value={formData.socialHistory || ""}
            onChange={(e) =>
              setFormData({ ...formData, socialHistory: e.target.value })
            }
          />
          <button
            type="button"
            className="text-blue-600 hover:underline mt-2 flex items-center gap-1"
            onClick={() => openNoteModal("socialHistory")}
          >
            ✏️ <span>Add a note</span>
          </button>
        </div>
      </section>

      {/* Notes Modal */}
      <NotesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveNote}
        fieldLabel={selectedField}
      />

      {/* Buttons */}
      <div className="flex justify-center mt-6 mb-4">
        <button
          type="submit"
          className="py-2 px-6 bg-[#2F3192] text-white text-sm font-medium rounded-xl shadow-md hover:bg-[#252774] transition-all duration-300"
        >
          Save and proceed
        </button>
      </div>
    </form>
  );
};

export default CaseHistory;
