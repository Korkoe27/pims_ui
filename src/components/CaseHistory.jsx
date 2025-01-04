import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi";

const CaseHistory = ({ appointmentId }) => {
  const navigate = useNavigate();

  // Fetch user from Redux
  const { user } = useSelector((state) => state.auth);

  // State for form data
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    lastEyeExamination: "",
    burningSensation: false,
    itching: false,
    tearing: false,
    doubleVision: false,
    discharge: false,
    parentDrugHistory: "",
    allergies: "",
    hobbies: "",
  });

  // Fetch case history data
  const { data: fetchedCaseHistory, isLoading, refetch } = useFetchCaseHistoryQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const [createCaseHistory] = useCreateCaseHistoryMutation();

  useEffect(() => {
    if (fetchedCaseHistory) {
      // Populate the form data with fetched case history
      setFormData({
        chiefComplaint: fetchedCaseHistory?.chief_complaint || "",
        lastEyeExamination: fetchedCaseHistory?.last_eye_examination || "",
        burningSensation: fetchedCaseHistory?.burning_sensation || false,
        itching: fetchedCaseHistory?.itching || false,
        tearing: fetchedCaseHistory?.tearing || false,
        doubleVision: fetchedCaseHistory?.double_vision || false,
        discharge: fetchedCaseHistory?.discharge || false,
        parentDrugHistory: fetchedCaseHistory?.parent_drug_history || "",
        allergies: fetchedCaseHistory?.allergies || "",
        hobbies: fetchedCaseHistory?.hobbies || "",
      });
    }
  }, [fetchedCaseHistory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        created_by: user?.id,
        appointment: appointmentId,
      };

      await createCaseHistory(payload);
      alert("Case history saved successfully!");
      // Refetch the data to get the updated case history
      refetch();
    } catch (error) {
      console.error("Error saving case history:", error);
    }
  };

  if (isLoading) {
    return <p>Loading case history...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-bold">Case History</h1>

      {/* Chief Complaint */}
      <div>
        <label className="block font-medium">Chief Complaint:</label>
        <textarea
          name="chiefComplaint"
          value={formData.chiefComplaint}
          onChange={handleChange}
          placeholder="Enter chief complaint"
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Last Eye Examination */}
      <div>
        <label className="block font-medium">Last Eye Examination:</label>
        <input
          type="date"
          name="lastEyeExamination"
          value={formData.lastEyeExamination}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Burning Sensation */}
      <div>
        <label className="block font-medium">Burning Sensation:</label>
        <input
          type="checkbox"
          name="burningSensation"
          checked={formData.burningSensation}
          onChange={handleChange}
        />
      </div>

      {/* Parent Drug History */}
      <div>
        <label className="block font-medium">Parent Drug History:</label>
        <input
          type="text"
          name="parentDrugHistory"
          value={formData.parentDrugHistory}
          onChange={handleChange}
          placeholder="Enter parent drug history"
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Allergies */}
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

      {/* Hobbies */}
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

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-black p-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CaseHistory;
