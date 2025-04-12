import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { useParams } from "react-router-dom";
import useRefractionData from "../hooks/useRefractionData";
import ErrorModal from "./ErrorModal";
import { showToast } from "../components/ToasterHelper";

const OBJECTIVE_METHOD_OPTIONS = [
  { value: "Retinoscopy", label: "Retinoscopy" },
  { value: "AutoRefraction", label: "AutoRefraction" },
];

const PLACEHOLDERS = {
  sph: "+1.00 / -2.25",
  cyl: "-0.50",
  axis: "0 - 180",
  va_6m: "6/6 or 0.00",
  add: "+1.00",
  va_0_4m: "6/9 or 0.00",
};

const Refraction = ({ setActiveTab }) => {
  const { appointmentId } = useParams();
  const { refraction, loadingRefraction, createRefraction } =
    useRefractionData(appointmentId);

  const [formData, setFormData] = useState({
    objective_method: "",
    objective: {
      OD: { sph: "", cyl: "", axis: "", va_6m: "" },
      OS: { sph: "", cyl: "", axis: "", va_6m: "" },
    },
    subjective: {
      OD: { sph: "", cyl: "", axis: "", add: "", va_6m: "", va_0_4m: "" },
      OS: { sph: "", cyl: "", axis: "", add: "", va_6m: "", va_0_4m: "" },
    },
    cycloplegic: {
      OD: { sph: "", cyl: "", axis: "", va_6m: "" },
      OS: { sph: "", cyl: "", axis: "", va_6m: "" },
    },
  });

  const [showCycloplegic, setShowCycloplegic] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (refraction) {
      setFormData({
        objective_method: refraction.objective_method || "",
        objective: {
          OD: refraction.objective.find((r) => r.eye === "OD") || {},
          OS: refraction.objective.find((r) => r.eye === "OS") || {},
        },
        subjective: {
          OD: refraction.subjective.find((r) => r.eye === "OD") || {},
          OS: refraction.subjective.find((r) => r.eye === "OS") || {},
        },
        cycloplegic: {
          OD: refraction.cycloplegic.find((r) => r.eye === "OD") || {},
          OS: refraction.cycloplegic.find((r) => r.eye === "OS") || {},
        },
      });
      setShowCycloplegic(refraction.cycloplegic.length > 0);
    }
  }, [refraction]);

  const handleChange = (section, eye, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [eye]: {
          ...prev[section][eye],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    const payload = {
      appointment: appointmentId,
      objective_method: formData.objective_method,
      objective: ["OD", "OS"].map((eye) => ({
        eye,
        ...formData.objective[eye],
      })),
      subjective: ["OD", "OS"].map((eye) => ({
        eye,
        ...formData.subjective[eye],
      })),
      cycloplegic: showCycloplegic
        ? ["OD", "OS"].map((eye) => ({ eye, ...formData.cycloplegic[eye] }))
        : [],
    };

    try {
      await createRefraction({ appointmentId, ...payload }).unwrap();
      showToast("Refraction saved successfully!", "success");
      setActiveTab("extra test");
      return true;
    } catch (error) {
      console.error("❌ Failed to save refraction", error);
      const message =
        error?.data?.detail ||
        "Failed to save refraction results. Please try again.";
      showToast(message, "error");
      return false;
    }
  };

  const renderFields = (section, fields) => (
    <div className="flex gap-4">
      {fields.map(({ label, name }) => (
        <div key={name} className="flex flex-col">
          <label className="text-center font-normal text-base">{label}</label>
          <input
            type="text"
            value={formData[section].OD[name] ?? ""}
            onChange={(e) => handleChange(section, "OD", name, e.target.value)}
            placeholder={PLACEHOLDERS[name] || ""}
            className="w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]"
          />
          <input
            type="text"
            value={formData[section].OS[name] ?? ""}
            onChange={(e) => handleChange(section, "OS", name, e.target.value)}
            placeholder={PLACEHOLDERS[name] || ""}
            className="w-20 h-9 rounded-md border border-[#d0d5dd]"
          />
        </div>
      ))}
    </div>
  );

  const objectiveFields = [
    { label: "SPH", name: "sph" },
    { label: "CYL", name: "cyl" },
    { label: "AXIS", name: "axis" },
    { label: "VA@6m", name: "va_6m" },
  ];

  const subjectiveFields = [
    ...objectiveFields,
    { label: "ADD", name: "add" },
    { label: "VA@0.4m", name: "va_0_4m" },
  ];

  return (
    <div className="my-8 px-16 flex flex-col gap-12">
      <h1 className="text-xl font-bold text-center mb-4">Refraction Results</h1>

      <form className="flex flex-col gap-20">
        <div className="flex flex-col gap-1 h-20 w-[375px]">
          <label className="text-base text-[#101928] font-medium">
            Method for Objective Refraction
          </label>
          <select
            value={formData.objective_method || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                objective_method: e.target.value,
              }))
            }
            className="w-full p-4 h-14 rounded-md border border-[#d0d5dd] bg-white"
          >
            <option value="">Select Method</option>
            {OBJECTIVE_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <section className="flex flex-col gap-16">
          <h1 className="text-[#101928] text-base">
            Objective Refraction Results
          </h1>
          <div className="flex gap-4">
            <div className="flex flex-col justify-end gap-4 items-baseline">
              <h1 className="text-xl font-bold text-center">OD</h1>
              <h1 className="text-xl font-bold text-center">OS</h1>
            </div>
            {renderFields("objective", objectiveFields)}
          </div>

          <h1 className="text-[#101928] text-base">
            Subjective Refraction Results
          </h1>
          <div className="flex gap-4">
            <div className="flex flex-col justify-end gap-4 items-baseline">
              <h1 className="text-xl font-bold text-center">OD</h1>
              <h1 className="text-xl font-bold text-center">OS</h1>
            </div>
            {renderFields("subjective", subjectiveFields)}
          </div>
        </section>

        <section className="flex flex-col gap-16 w-fit">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowCycloplegic(!showCycloplegic);
            }}
            className="text-[#2f3192] font-semibold flex items-center gap-2"
            type="button"
          >
            <GrAdd className="w-5 h-5" />
            {showCycloplegic
              ? "Remove Cycloplegic Refraction"
              : "Add Cycloplegic Refraction"}
          </button>

          {showCycloplegic && (
            <div className="flex flex-col gap-4">
              <h1 className="text-[#101928] text-medium text-base">
                Cycloplegic Refraction Results
              </h1>
              <div className="flex gap-4">
                <div className="flex flex-col justify-end gap-4 items-baseline">
                  <h1 className="text-xl font-bold text-center">OD</h1>
                  <h1 className="text-xl font-bold text-center">OS</h1>
                </div>
                {renderFields("cycloplegic", objectiveFields)}
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setActiveTab("internals")}
            className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-colors duration-200"
          >
            ← Back to Internals
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700"
          >
            Save and Proceed
          </button>
        </div>
      </form>

      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default Refraction;
