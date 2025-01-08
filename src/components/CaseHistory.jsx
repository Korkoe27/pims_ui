import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";
import Radios from "./Radios";
import Inputs from "./Inputs";

const CaseHistory = ({ appointmentId, onNavigateNext }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Error dialog visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error message content

  // Fetch case history data
  const { data: fetchedCaseHistory, isLoading } = useFetchCaseHistoryQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const [createCaseHistory] = useCreateCaseHistoryMutation();

  // State for form data
  const [formData, setFormData] = useState({
    chief_complaint: "",
    last_eye_examination: "",
    burning_sensation: "",
    itching: "",
    tearing: false,
    double_vision: false,
    discharge: false,
    pain: false,
    fbs: false,
    photophobia: false,
    asthma: false,
    ulcer: false,
    diabetes: false,
    hypertension: false,
    sickle_cell: false,
    std_sti: false,
    parent_drug_history: "",
    allergies: "",
    hobbies: "",
    family_asthma: false,
    family_ulcer: false,
    family_diabetes: false,
    family_hypertension: false,
    family_sickle_cell: false,
    family_std_sti: false,
    family_spectacles: false,
    family_eye_surgery: false,
    family_ocular_trauma: false,
    family_glaucoma: false,
  });

  // Populate form data with fetched case history
  useEffect(() => {
    if (fetchedCaseHistory) {
      setFormData({
        chief_complaint: fetchedCaseHistory?.chief_complaint || "",
        last_eye_examination: fetchedCaseHistory?.last_eye_examination || "",
        burning_sensation: fetchedCaseHistory?.burning_sensation || "",
        itching: fetchedCaseHistory?.itching || false,
        tearing: fetchedCaseHistory?.tearing || false,
        double_vision: fetchedCaseHistory?.double_vision || false,
        discharge: fetchedCaseHistory?.discharge || false,
        pain: fetchedCaseHistory?.pain || false,
        fbs: fetchedCaseHistory?.fbs || false,
        photophobia: fetchedCaseHistory?.photophobia || false,
        asthma: fetchedCaseHistory?.asthma || false,
        ulcer: fetchedCaseHistory?.ulcer || false,
        diabetes: fetchedCaseHistory?.diabetes || false,
        hypertension: fetchedCaseHistory?.hypertension || false,
        sickle_cell: fetchedCaseHistory?.sickle_cell || false,
        std_sti: fetchedCaseHistory?.std_sti || false,
        parent_drug_history: fetchedCaseHistory?.parent_drug_history || "",
        allergies: fetchedCaseHistory?.allergies || "",
        hobbies: fetchedCaseHistory?.hobbies || "",
        family_asthma: fetchedCaseHistory?.family_asthma || false,
        family_ulcer: fetchedCaseHistory?.family_ulcer || false,
        family_diabetes: fetchedCaseHistory?.family_diabetes || false,
        family_hypertension: fetchedCaseHistory?.family_hypertension || false,
        family_sickle_cell: fetchedCaseHistory?.family_sickle_cell || false,
        family_std_sti: fetchedCaseHistory?.family_std_sti || false,
        family_spectacles: fetchedCaseHistory?.family_spectacles || false,
        family_eye_surgery: fetchedCaseHistory?.family_eye_surgery || false,
        family_ocular_trauma: fetchedCaseHistory?.family_ocular_trauma || false,
        family_glaucoma: fetchedCaseHistory?.family_glaucoma || false,
      });
    }
  }, [fetchedCaseHistory]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        appointment: appointmentId,
        created_by: user?.id,
      };
      await createCaseHistory(payload).unwrap(); // Call the mutation
      onNavigateNext(); // Move to the next tab
    } catch (error) {
      console.error("Error saving case history:", error);
      setErrorMessage(error?.data?.message || "An unknown error occurred."); // Set error message
      setShowErrorDialog(true); // Show error dialog
    }
  };

  if (isLoading) {
    return <p>Loading case history...</p>;
  }

  return (
    <>
      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
            <p className="mb-4">{errorMessage}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowErrorDialog(false)} // Close dialog
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        <h1 className="text-xl font-bold">Case History</h1>
        <section className="flex gap-28">
          <aside className="flex flex-col gap-12">
            {/* Chief Complaint */}
            <div className="flex flex-col">
              <h1 className="text-base font-medium text-black">
                Chief Complaint <span className="text-[#ff0000]">*</span>
              </h1>
              <textarea
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleChange}
                placeholder="Type in the patient’s chief complaint"
                className="p-4 border border-[#d0d5dd] resize-none rounded-md w-96 h-48"
              />
            </div>

            {/* On Direct Questioning */}
            <div>
              <h1 className="text-base font-medium text-black">
                On Direct Questioning <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Burning Sensation", name: "burning_sensation" },
                  { label: "Itching", name: "itching" },
                  { label: "Tearing", name: "tearing" },
                  { label: "Double Vision", name: "double_vision" },
                  { label: "Discharge", name: "discharge" },
                  { label: "Pain", name: "pain" },
                  { label: "FBS", name: "fbs" },
                  { label: "Photophobia", name: "photophobia" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]} // Map boolean to "yes"/"no"
                    onChange={handleChange} // Use the existing handleChange
                  />
                ))}
              </div>
            </div>

            {/* Patient Medical History */}
            <div>
              <h1 className="text-base font-medium text-black">
                Patient Medical History{" "}
                <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Asthma", name: "asthma" },
                  { label: "Ulcer", name: "ulcer" },
                  { label: "Diabetes", name: "diabetes" },
                  { label: "Hypertension", name: "hypertension" },
                  { label: "Sickle Cell", name: "sickleCell" },
                  { label: "STD/STI", name: "stdSti" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]} // Map boolean to "yes"/"no"
                    onChange={handleChange} // Use the existing handleChange
                  />
                ))}
              </div>
            </div>
          </aside>

          <aside className="flex flex-col gap-12">
            {/* Patient Ocular History */}
            <div>
              <h1 className="text-base font-medium text-black">
                Patient Ocular History <span className="text-[#ff0000]">*</span>
              </h1>
              <Inputs
                type="date"
                label="Last Eye Examination"
                name="lastEyeExamination"
                value={formData.last_eye_examination}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Spectacles", name: "spectacles" },
                  { label: "Eye Surgery", name: "eyeSurgery" },
                  { label: "Ocular Trauma", name: "ocularTrauma" },
                  { label: "Glaucoma", name: "glaucoma" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]} // Map boolean to "yes"/"no"
                    onChange={handleChange} // Use the existing handleChange
                  />
                ))}
              </div>
            </div>
            {/* Family Medical History */}
            <div>
              <h1 className="text-base font-medium text-black">
                Family Medical History <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Asthma", name: "family_asthma" },
                  { label: "Ulcer", name: "family_ulcer" },
                  { label: "Diabetes", name: "family_diabetes" },
                  { label: "Hypertension", name: "family_hypertension" },
                  { label: "Sickle Cell", name: "family_sickle_cell" },
                  { label: "STD/STI", name: "family_std_sti" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]} // Map boolean to "yes"/"no"
                    onChange={handleChange} // Use the existing handleChange
                  />
                ))}
              </div>
            </div>

            {/* Family Ocular History */}
            <div>
              <h1 className="text-base font-medium text-black">
                Family Ocular History <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Spectacles", name: "family_spectacles" },
                  { label: "Eye Surgery", name: "family_eye_surgery" },
                  { label: "Ocular Trauma", name: "family_ocular_trauma" },
                  { label: "Glaucoma", name: "family_glaucoma" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]} // Map boolean to "yes"/"no"
                    onChange={handleChange} // Use the existing handleChange
                  />
                ))}
              </div>
            </div>

            {/* Additional Fields */}
            <div>
              <label className="block font-medium">Parent Drug History:</label>
              <input
                type="text"
                name="parent_drug_history"
                value={formData.parent_drug_history}
                onChange={handleChange}
                placeholder="Enter parent drug history"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Allergies:</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Enter allergies"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Hobbies:</label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="Enter hobbies"
                className="border p-2 rounded w-full"
              />
            </div>
          </aside>
        </section>

        <div className="flex gap-8 justify-evenly my-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
          >
            Save and proceed
          </button>
        </div>
      </form>
    </>
  );
};

export default CaseHistory;
