import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Radios from "./Radios";
import { useNavigate } from "react-router-dom";
import {
  useFetchVisualAcuityQuery,
  useCreateVisualAcuityMutation,
} from "../redux/api/features/consultationApi"; // Import hooks

const VisualAcuity = ({ appointmentId, onNavigateNext }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Error dialog visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error message content

  // Fetch visual acuity data
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useFetchVisualAcuityQuery(appointmentId, { skip: !appointmentId });

  const [createVisualAcuity] = useCreateVisualAcuityMutation(); // Initialize mutation

  // State for form data
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

  // Prepopulate form data when fetchedData is available
  useEffect(() => {
    if (fetchedData) {
      setFormData({
        vaChart: fetchedData?.va_chart_used || "",
        distanceVaOdStandard:
          fetchedData?.distance_va_unaided_od_standard || "",
        distanceVaOsStandard:
          fetchedData?.distance_va_unaided_os_standard || "",
        distanceVaOdPh: fetchedData?.distance_va_unaided_od_ph || "",
        distanceVaOsPh: fetchedData?.distance_va_unaided_os_ph || "",
        distanceVaOdPlus1: fetchedData?.distance_va_unaided_od_plus1 || "",
        distanceVaOsPlus1: fetchedData?.distance_va_unaided_os_plus1 || "",
        nearVaOd: fetchedData?.near_va_unaided_od || "",
        nearVaOs: fetchedData?.near_va_unaided_os || "",
        patientWithPrescription:
          fetchedData?.patient_with_prescription || false,
        prescriptionType: fetchedData?.prescription_type || "",
        currentPrescriptionOdSph:
          fetchedData?.current_prescription_od_sph || "",
        currentPrescriptionOsSph:
          fetchedData?.current_prescription_os_sph || "",
        currentPrescriptionOdCyl:
          fetchedData?.current_prescription_od_cyl || "",
        currentPrescriptionOsCyl:
          fetchedData?.current_prescription_os_cyl || "",
        currentPrescriptionOdAxis:
          fetchedData?.current_prescription_od_axis || "",
        currentPrescriptionOsAxis:
          fetchedData?.current_prescription_os_axis || "",
        currentPrescriptionOdAdd:
          fetchedData?.current_prescription_od_add || "",
        currentPrescriptionOsAdd:
          fetchedData?.current_prescription_os_add || "",
        distanceVaWithPrescriptionOd:
          fetchedData?.distance_va_with_prescription_od || "",
        distanceVaWithPrescriptionOs:
          fetchedData?.distance_va_with_prescription_os || "",
        nearVaWithPrescriptionOd:
          fetchedData?.near_va_with_prescription_od || "",
        nearVaWithPrescriptionOs:
          fetchedData?.near_va_with_prescription_os || "",
      });
    }
  }, [fetchedData]);

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
      await createVisualAcuity(payload).unwrap(); // Call the mutation
      onNavigateNext(); // Move to the next tab
    } catch (error) {
      console.error("Error saving case history:", error);
      setErrorMessage(error?.data?.message || "An unknown error occurred."); // Set error message
      setShowErrorDialog(true); // Show error dialog
    }
  };

  if (isLoading) {
    return <p>Loading visual acuity data...</p>;
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
                  {
                    label: "Standard",
                    name: "distanceVaOdStandard",
                    osName: "distanceVaOsStandard",
                  },
                  {
                    label: "PH",
                    name: "distanceVaOdPh",
                    osName: "distanceVaOsPh",
                  },
                  {
                    label: "+1.00",
                    name: "distanceVaOdPlus",
                    osName: "distanceVaOsPlus",
                  },
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
