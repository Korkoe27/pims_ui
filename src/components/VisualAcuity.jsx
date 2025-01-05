import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Radios from "./Radios";
import { useNavigate } from "react-router-dom";
import {
  useFetchVisualAcuityQuery,
  useCreateCaseHistoryMutation,
} from "../redux/api/features/consultationApi"; // Import hooks

const VisualAcuity = ({ appointmentId, onNavigateNext }) => {
  const { user } = useSelector((state) => state.auth);

  // Fetch visual acuity data
  const { data: fetchedData, isLoading, isError } = useFetchVisualAcuityQuery(appointmentId);

  const [createCaseHistory] = useCreateCaseHistoryMutation(); // Initialize mutation

  const [formData, setFormData] = useState({
    vaChart: "",
    distanceVaOdStandard: "",
    distanceVaOsStandard: "",
    distanceVaOdPh: "",
    distanceVaOsPh: "",
    distanceVaOdPlus: "",
    distanceVaOsPlus: "",
    nearVaOd: "",
    nearVaOs: "",
    patientHasPrescription: false,
    prescriptionType: "",
    currentPrescriptionOdSph: "",
    currentPrescriptionOsSph: "",
    currentPrescriptionOdCyl: "",
    currentPrescriptionOsCyl: "",
    currentPrescriptionOdAxis: "",
    currentPrescriptionOsAxis: "",
    currentPrescriptionOdAdd: "",
    currentPrescriptionOsAdd: "",
    currentDistanceVaWithPrescriptionOd: "",
    currentDistanceVaWithPrescriptionOs: "",
    currentNearVaWithPrescriptionOd: "",
    currentNearVaWithPrescriptionOs: "",
  });

  const navigate = useNavigate();

  // Prepopulate form data when fetchedData is available
  useEffect(() => {
    if (fetchedData) {
      setFormData((prevData) => ({
        ...prevData,
        ...fetchedData, // Overwrite with fetched data
      }));
    }
  }, [fetchedData]);

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
      const payload = { ...formData, created_by: user?.id, appointmentId }; // Include appointmentId
      await createCaseHistory(payload).unwrap(); // Call the mutation
      onNavigateNext(); // Move to the next tab
    } catch (error) {
      console.error("Error saving visual acuity data:", error);
      alert("Failed to save visual acuity data. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading visual acuity data...</p>;
  }

  if (isError) {
    return <p>Error fetching visual acuity data. Please try again later.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <section className="flex gap-48">
        <aside className="flex flex-col gap-12">
          {/* VA Chart */}
          <div className="flex flex-col gap-4">
            <label htmlFor="vaChart" className="text-base font-medium">
              VA Chart used
            </label>
            <select
              name="vaChart"
              value={formData.vaChart}
              onChange={handleChange}
              className="p-4 border border-[#d0d5dd] h-14 rounded-md"
            >
              <option value="">Select VA Chart</option>
              <option value="Snellen">Snellen</option>
              <option value="LogMAR">LogMAR</option>
              <option value="E Chart">E Chart</option>
            </select>
          </div>

          {/* Distance VA (unaided) */}
          <div>
            <h1 className="text-base font-medium">
              Distance VA (unaided)<span className="text-[#d42620]">*</span>
            </h1>
            <div className="flex gap-4">
              <div className="flex flex-col justify-end gap-4 items-baseline">
                <h1 className="text-xl font-bold text-center">OD</h1>
                <h1 className="text-xl font-bold text-center">OS</h1>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Standard", name: "distanceVaOdStandard", osName: "distanceVaOsStandard" },
                  { label: "PH", name: "distanceVaOdPh", osName: "distanceVaOsPh" },
                  { label: "+1.00", name: "distanceVaOdPlus", osName: "distanceVaOsPlus" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col">
                    <label className="text-center font-normal text-base">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]"
                    />
                    <input
                      type="text"
                      name={field.osName}
                      value={formData[field.osName]}
                      onChange={handleChange}
                      className="w-20 h-9 rounded-md border border-[#d0d5dd]"
                    />
                  </div>
                ))}
              </div>
            </div>
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
  );
};

export default VisualAcuity;
