import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";

const Refraction = () => {
  const [showCycloplegic, setShowCycloplegic] = useState(false);
  const [showPhoria, setShowPhoria] = useState(false);

  const toggleCycloplegic = () => setShowCycloplegic(!showCycloplegic);
  const togglePhoria = () => setShowPhoria(!showPhoria);

  const renderFields = (fields) => (
    <div className="flex gap-4">
      {fields.map(({ label, name, placeholder }) => (
        <div key={name} className="flex flex-col">
          <label className="text-center font-normal text-base">{label}</label>
          <input
            type="text"
            name={`right-${name}`}
            className="w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]"
            placeholder={placeholder}
          />
          <input
            type="text"
            name={`left-${name}`}
            className="w-20 h-9 rounded-md border border-[#d0d5dd]"
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>
  );

  const commonFields = [
    { label: "Standard", name: "standard" },
    { label: "CYL", name: "cyl" },
    { label: "AXIS", name: "axis" },
    { label: "VA@6m", name: "va6m" },
  ];

  const cycloplegicFields = [
    { label: "SPH", name: "cycloplegic-sph" },
    { label: "CYL", name: "cycloplegic-cyl" },
    { label: "AXIS", name: "cycloplegic-axis" },
    { label: "VA@6m", name: "cycloplegic-va6m" },
  ];

  return (
    <div className="my-8 px-16 flex flex-col gap-12">
      <h1 className="text-xl font-bold text-center mb-4">Refraction Results</h1>

      <form className="flex flex-col gap-20">
        <div className="flex flex-col gap-1 h-20 w-[375px]">
          <label
            htmlFor="objectRefraction"
            className="text-base text-[#101928] font-medium"
          >
            Method for Objective Refraction
          </label>
          <select
            name="objectRefraction"
            className="w-full p-4 h-14 rounded-md border border-[#d0d5dd] bg-white"
          ></select>
        </div>

        <section className="flex flex-col gap-16">
          <h1 className="text-[#101928] text-base">Objective Refraction Results</h1>
          <div className="flex gap-4">
            <div className="flex flex-col justify-end gap-4 items-baseline">
              <h1 className="text-xl font-bold text-center">OD</h1>
              <h1 className="text-xl font-bold text-center">OS</h1>
            </div>
            {renderFields(commonFields)}
          </div>

          <h1 className="text-[#101928] text-base">Subjective Refraction Results</h1>
          <div className="flex gap-4">
            <div className="flex flex-col justify-end gap-4 items-baseline">
              <h1 className="text-xl font-bold text-center">OD</h1>
              <h1 className="text-xl font-bold text-center">OS</h1>
            </div>
            {renderFields([...commonFields, { label: "ADD", name: "add" }, { label: "VA@0.4m", name: "va04m" }])}
          </div>
        </section>

        <section className="flex flex-col gap-16 w-fit">
          <button
            onClick={toggleCycloplegic}
            className="text-[#2f3192] font-semibold flex items-center gap-2"
            type="button"
          >
            <GrAdd className="w-5 h-5" />
            {showCycloplegic ? "Remove Cycloplegic Refraction" : "Add Cycloplegic Refraction"}
          </button>
          {showCycloplegic && (
            <div className="flex flex-col gap-4">
              <h1 className="text-[#101928] text-medium text-base">Cycloplegic Refraction Results</h1>
              {renderFields(cycloplegicFields)}
            </div>
          )}

          
        </section>

        <button
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
