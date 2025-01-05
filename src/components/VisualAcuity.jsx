import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Radios from "./Radios";
import { useNavigate } from "react-router-dom";
import {
  useFetchVisualAcuityQuery,
  useCreateVisualAcuityMutation,
} from "../redux/api/features/consultationApi"; // Import hooks

const VisualAcuity = ({
  appointmentId,
  onNavigateNext,
  onNavigatePrevious,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Error dialog visibility
  const [errorMessage, setErrorMessages] = useState(""); // Error message content
  const [generalError, setGeneralError] = useState(""); // Track general error messages

  // Fetch visual acuity data
  const {
    data: fetchedData,
    isLoading,
    isError,
    error
  } = useFetchVisualAcuityQuery(appointmentId, { skip: !appointmentId });

  const [createVisualAcuity] = useCreateVisualAcuityMutation(); // Initialize mutation

  // State for form data
  const [formData, setFormData] = useState({
    va_chart_used: "",
    distance_va_unaided_od_standard: "",
    distance_va_unaided_os_standard: "",
    distance_va_unaided_od_ph: "",
    distance_va_unaided_os_ph: "",
    distance_va_unaided_od_plus1: "",
    distance_va_unaided_os_plus1: "",
    near_va_unaided_od: "",
    near_va_unaided_os: "",
    patient_with_prescription: false,
    prescription_type: "",
    current_prescription_od_sph: "",
    current_prescription_os_sph: "",
    current_prescription_od_cyl: "",
    current_prescription_os_cyl: "",
    current_prescription_od_axis: "",
    current_prescription_os_axis: "",
    current_prescription_od_add: "",
    current_prescription_os_add: "",
    distance_va_with_prescription_od: "",
    distance_va_with_prescription_os: "",
    near_va_with_prescription_od: "",
    near_va_with_prescription_os: "",
  });

  // Prepopulate form data when fetchedData is available
  useEffect(() => {
    if (fetchedData) {
      setFormData({
        va_chart_used: fetchedData?.va_chart_used || "",
        distance_va_unaided_od_standard:
          fetchedData?.distance_va_unaided_od_standard || "",
        distance_va_unaided_os_standard:
          fetchedData?.distance_va_unaided_os_standard || "",
        distance_va_unaided_od_ph: fetchedData?.distance_va_unaided_od_ph || "",
        distance_va_unaided_os_ph: fetchedData?.distance_va_unaided_os_ph || "",
        distance_va_unaided_od_plus1:
          fetchedData?.distance_va_unaided_od_plus1 || "",
        distance_va_unaided_os_plus1:
          fetchedData?.distance_va_unaided_os_plus1 || "",
        near_va_unaided_od: fetchedData?.near_va_unaided_od || "",
        near_va_unaided_os: fetchedData?.near_va_unaided_os || "",
        patient_with_prescription:
          fetchedData?.patient_with_prescription || false,
        prescription_type: fetchedData?.prescription_type || "",
        current_prescription_od_sph:
          fetchedData?.current_prescription_od_sph || "",
        current_prescription_os_sph:
          fetchedData?.current_prescription_os_sph || "",
        current_prescription_od_cyl:
          fetchedData?.current_prescription_od_cyl || "",
        current_prescription_os_cyl:
          fetchedData?.current_prescription_os_cyl || "",
        current_prescription_od_axis:
          fetchedData?.current_prescription_od_axis || "",
        current_prescription_os_axis:
          fetchedData?.current_prescription_os_axis || "",
        current_prescription_od_add:
          fetchedData?.current_prescription_od_add || "",
        current_prescription_os_add:
          fetchedData?.current_prescription_os_add || "",
        distance_va_with_prescription_od:
          fetchedData?.distance_va_with_prescription_od || "",
        distance_va_with_prescription_os:
          fetchedData?.distance_va_with_prescription_os || "",
        near_va_with_prescription_od:
          fetchedData?.near_va_with_prescription_od || "",
        near_va_with_prescription_os:
          fetchedData?.near_va_with_prescription_os || "",
      });
    }
  }, [fetchedData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update the state for the field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages({});
    setGeneralError("");

    try {
      const payload = {
        ...formData,
        appointment: appointmentId,
        created_by: user?.id,
      };

      console.log("Submitting Payload:", payload);
      await createVisualAcuity(payload).unwrap();
      onNavigateNext(); // Move to the next tab
    } catch (err) {
      if (err.data) {
        // Handle validation errors
        setErrorMessages(err.data.errors || {});
        setGeneralError(err.data.message || "An unknown error occurred.");
      } else {
        // General error
        setGeneralError("An error occurred. Please try again later.");
      }
    }
  };

  if (isLoading) {
    return <p>Loading visual acuity data...</p>;
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        <h1>Error Loading Data</h1>
        <p>{error?.data?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <section className="flex gap-48">
        <aside className="flex flex-col gap-12">
          {/* VA Chart */}
          <div className="flex flex-col gap-4">
            <label htmlFor="va_chart_used" className="text-base font-medium">
              VA Chart used
            </label>
            <select
              name="va_chart_used"
              value={formData.va_chart_used}
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
                    odName: "distance_va_unaided_od_standard",
                    osName: "distance_va_unaided_os_standard",
                  },
                  {
                    label: "PH",
                    odName: "distance_va_unaided_od_ph",
                    osName: "distance_va_unaided_os_ph",
                  },
                  {
                    label: "+1.00",
                    odName: "distance_va_unaided_od_plus1",
                    osName: "distance_va_unaided_os_plus1",
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

          {/* Near VA (unaided) */}
          <div>
            <h1 className="text-base font-medium">
              Near VA (unaided)<span className="text-[#d42620]">*</span>
            </h1>
            <div className="flex flex-col gap-4">
              {[
                { label: "OD", name: "nearVaOd" },
                { label: "OS", name: "nearVaOs" },
              ].map((field) => (
                <div key={field.name} className="flex gap-3 items-center">
                  <label htmlFor="" className="text-xl font-bold">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="rounded-md border border-[#d0d5dd] w-20 h-9 p-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <aside className="flex flex-col gap-12">
          {/* Prescription */}
          <Radios
            name="patientHasPrescription"
            label="Did patient come with a prescription?"
            checked={formData.patientHasPrescription}
            onChange={handleChange}
          />

          <div className="flex flex-col gap-4">
            <label htmlFor="prescriptionType" className="text-base font-medium">
              Type of Prescription
            </label>
            <select
              name="prescriptionType"
              value={formData.prescriptionType}
              onChange={handleChange}
              className="h-14 rounded-md border border-[#d0d5dd]"
            >
              <option value="">Select Type</option>
              <option value="Reading Glasses">Reading Glasses</option>
              <option value="Contact Lenses">Contact Lenses</option>
              <option value="Bifocal">Bifocal</option>
            </select>
          </div>

          {/* Patient’s Current Prescription */}
          <div>
            <h1 className="text-base font-medium">
              Patient’s Current Prescription
              <span className="text-[#d42620]">*</span>
            </h1>
            <div className="flex gap-4">
              <div className="flex flex-col justify-end gap-4 items-baseline">
                <h1 className="text-xl font-bold text-center">OD</h1>
                <h1 className="text-xl font-bold text-center">OS</h1>
              </div>
              <div className="flex gap-4">
                {[
                  {
                    label: "SPH",
                    odName: "currentPrescriptionOdSph",
                    osName: "currentPrescriptionOsSph",
                  },
                  {
                    label: "CYL",
                    odName: "currentPrescriptionOdCyl",
                    osName: "currentPrescriptionOsCyl",
                  },
                  {
                    label: "AXIS",
                    odName: "currentPrescriptionOdAxis",
                    osName: "currentPrescriptionOsAxis",
                  },
                  {
                    label: "ADD",
                    odName: "currentPrescriptionOdAdd",
                    osName: "currentPrescriptionOsAdd",
                  },
                ].map((field) => (
                  <div key={field.odName} className="flex flex-col">
                    <label className="text-center font-medium text-base">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.odName}
                      value={formData[field.odName]}
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
          onClick={onNavigatePrevious}
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
