import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { useParams } from "react-router-dom";
import useRefractionData from "../hooks/useRefractionData";

const Refraction = () => {
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
      console.log("✅ Refraction saved");
    } catch (error) {
      console.error("❌ Failed to save refraction", error);
    }
  };

  const renderFields = (section, fields) => (
    <div className="flex gap-4">
      {fields.map(({ label, name }) => (
        <div key={name} className="flex flex-col">
          <label className="text-center font-normal text-base">{label}</label>
          <input
            type="text"
            value={formData[section].OD[name] || ""}
            onChange={(e) => handleChange(section, "OD", name, e.target.value)}
            className="w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]"
          />
          <input
            type="text"
            value={formData[section].OS[name] || ""}
            onChange={(e) => handleChange(section, "OS", name, e.target.value)}
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
          <input
            type="text"
            value={formData.objective_method || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                objective_method: e.target.value,
              }))
            }
            className="w-full p-4 h-14 rounded-md border border-[#d0d5dd] bg-white"
          />
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

        <button
          onClick={handleSave}
          className="text-white bg-[#2f3192] w-48 h-14 p-4 rounded-lg"
          type="button"
        >
          Save and Finish
        </button>
      </form>
    </div>
  );
};

export default Refraction;
