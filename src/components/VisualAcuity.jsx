import React, { useState } from "react";
import Radios from "./Radios";
import Inputs from "./Inputs";
import { useNavigate } from "react-router-dom";

const VisualAcuity = ({ appointmentId }) => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Visual Acuity data saved successfully!");
    navigate("/externals");
  };

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
              Distance VA <span className="text-[#d42620]">*</span>
            </h1>
            <div className="flex gap-4">
              <div className="flex flex-col justify-end gap-4 items-baseline">
                <h1 className="text-xl font-bold text-center">OD</h1>
                <h1 className="text-xl font-bold text-center">OS</h1>
              </div>
              <div className="flex gap-4">
                {[
                  { label: "Unaided", name: "distanceVaOdStandard", osName: "distanceVaOsStandard" },
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
                  { label: "SPH", odName: "currentPrescriptionOdSph", osName: "currentPrescriptionOsSph" },
                  { label: "CYL", odName: "currentPrescriptionOdCyl", osName: "currentPrescriptionOsCyl" },
                  { label: "AXIS", odName: "currentPrescriptionOdAxis", osName: "currentPrescriptionOsAxis" },
                  { label: "ADD", odName: "currentPrescriptionOdAdd", osName: "currentPrescriptionOsAdd" },
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
