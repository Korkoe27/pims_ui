import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useFetchVisualAcuityQuery,
  useCreateVisualAcuityMutation,
  useUpdateVisualAcuityMutation,
} from "../redux/api/features/visualAcuityApi";
import { setVisualAcuity } from "../redux/slices/consultationSlice";
import Radios from "./Radios";

const VisualAcuity = ({ appointmentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** ✅ Fetch existing Visual Acuity data */
  const { data: visualAcuityData, isLoading, error } =
    useFetchVisualAcuityQuery(appointmentId, { skip: !appointmentId });

  /** ✅ Mutations for create & update */
  const [createVisualAcuity, { isLoading: isCreating }] =
    useCreateVisualAcuityMutation();
  const [updateVisualAcuity, { isLoading: isUpdating }] =
    useUpdateVisualAcuityMutation();

  /** ✅ Form State */
  const [formData, setFormData] = useState({
    va_chart_used: "",
    distance_unaided_od: "",
    distance_unaided_os: "",
    distance_ph_od: "",
    distance_ph_os: "",
    distance_plus_one_od: "",
    distance_plus_one_os: "",
    near_unaided_od: "",
    near_unaided_os: "",
    patient_came_with_prescription: false,
    prescription_type: "",
    sph_od: "",
    sph_os: "",
    cyl_od: "",
    cyl_os: "",
    axis_od: "",
    axis_os: "",
    va_od: "",
    va_os: "",
    add_od: "",
    add_os: "",
  });

  /** ✅ Populate form if data exists */
  useEffect(() => {
    if (visualAcuityData) {
      setFormData((prev) => ({ ...prev, ...visualAcuityData }));
      dispatch(setVisualAcuity(visualAcuityData)); // ✅ Update Redux store
    }
  }, [visualAcuityData, dispatch]);

  /** ✅ Handle Input Changes */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /** ✅ Handle Form Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (visualAcuityData) {
        await updateVisualAcuity({ appointmentId, data: formData }).unwrap();
      } else {
        await createVisualAcuity({ appointmentId, ...formData }).unwrap();
      }
      alert("Visual Acuity data saved successfully!");
      navigate("/externals");
    } catch (error) {
      console.error("🚨 Error saving visual acuity:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <section className="flex gap-48">
        <aside className="flex flex-col gap-12">
          {/* ✅ VA Chart */}
          <div className="flex flex-col gap-4">
            <label className="text-base font-medium">VA Chart Used</label>
            <select
              name="va_chart_used"
              value={formData.va_chart_used}
              onChange={handleChange}
              className="p-4 border border-[#d0d5dd] h-14 rounded-md"
            >
              <option value="">Select VA Chart</option>
              <option value="SNELLEN">Snellen</option>
              <option value="LOGMAR">LogMAR</option>
              <option value="E_CHART">E Chart</option>
            </select>
          </div>

          {/* ✅ Distance VA */}
          <div>
            <h1 className="text-base font-medium">Distance VA</h1>
            <div className="flex gap-4">
              {[
                { label: "Unaided", name: "distance_unaided_od", osName: "distance_unaided_os" },
                { label: "PH", name: "distance_ph_od", osName: "distance_ph_os" },
                { label: "+1.00", name: "distance_plus_one_od", osName: "distance_plus_one_os" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-center">{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-20 h-9 mb-4 border rounded-md" />
                  <input type="text" name={field.osName} value={formData[field.osName]} onChange={handleChange} className="w-20 h-9 border rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Near VA */}
          <div>
            <h1 className="text-base font-medium">Near VA</h1>
            {["near_unaided_od", "near_unaided_os"].map((name) => (
              <div key={name} className="flex gap-3 items-center">
                <label className="text-xl font-bold">{name.includes("od") ? "OD" : "OS"}</label>
                <input type="text" name={name} value={formData[name]} onChange={handleChange} className="w-20 h-9 border rounded-md p-2" />
              </div>
            ))}
          </div>
        </aside>

        <aside className="flex flex-col gap-12">
          {/* ✅ Prescription */}
          <Radios
            name="patient_came_with_prescription"
            label="Did patient come with a prescription?"
            checked={formData.patient_came_with_prescription}
            onChange={handleChange}
          />

          <div className="flex flex-col gap-4">
            <label className="text-base font-medium">Type of Prescription</label>
            <select name="prescription_type" value={formData.prescription_type} onChange={handleChange} className="h-14 border rounded-md">
              <option value="">Select Type</option>
              <option value="GLASSES">Glasses</option>
              <option value="CONTACT_LENSES">Contact Lenses</option>
              <option value="BIFOCAL">Bifocal</option>
            </select>
          </div>

          {/* ✅ Prescription Values */}
          <div>
            <h1 className="text-base font-medium">Prescription Values</h1>
            <div className="flex gap-4">
              {[
                { label: "SPH", od: "sph_od", os: "sph_os" },
                { label: "CYL", od: "cyl_od", os: "cyl_os" },
                { label: "AXIS", od: "axis_od", os: "axis_os" },
                { label: "ADD", od: "add_od", os: "add_os" },
              ].map((field) => (
                <div key={field.od} className="flex flex-col">
                  <label className="text-center">{field.label}</label>
                  <input type="text" name={field.od} value={formData[field.od]} onChange={handleChange} className="w-20 h-9 mb-4 border rounded-md" />
                  <input type="text" name={field.os} value={formData[field.os]} onChange={handleChange} className="w-20 h-9 border rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* ✅ Submit Button */}
      <div className="flex gap-8 justify-evenly my-16">
        <button type="button" onClick={() => navigate(-1)} className="w-56 p-4 border rounded-lg text-[#2f3192]">
          Back
        </button>
        <button type="submit" className="w-56 p-4 rounded-lg bg-[#2f3192] text-white" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : "Save and Proceed"}
        </button>
      </div>
    </form>
  );
};

export default VisualAcuity;
