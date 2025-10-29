import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { useParams } from "react-router-dom";
import useRefractionData from "../hooks/useRefractionData";
import { showToast } from "../components/ToasterHelper";
import { hasFormChanged } from "../utils/deepCompare";
import SPHValidator from "./validators/SPHValidator";
import CYLValidator from "./validators/CYLValidator";
import AXISValidator from "./validators/AXISValidator";
import VAValidator from "./validators/VAValidator";
import ADDValidator from "./validators/ADDValidator";
import NavigationButtons from "../components/NavigationButtons";
import SupervisorGradingButton from "./ui/buttons/SupervisorGradingButton";
import useComponentGrading from "../hooks/useComponentGrading";

const OBJECTIVE_METHOD_OPTIONS = [
  { value: "Retinoscopy", label: "Retinoscopy" },
  { value: "AutoRefraction", label: "AutoRefraction" },
];

const FIELDS = {
  sph: SPHValidator,
  cyl: CYLValidator,
  axis: AXISValidator,
  va_6m: VAValidator,
  add: ADDValidator,
  va_0_4m: VAValidator,
};

const Refraction = ({ setActiveTab, setTabCompletionStatus }) => {
  const { appointmentId } = useParams();
  const { refraction, createRefraction } = useRefractionData(appointmentId);
  const { section, sectionLabel } = useComponentGrading("REFRACTION", appointmentId);

  const [formData, setFormData] = useState({
    objective_method: "",
    objective: { OD: {}, OS: {} },
    subjective: { OD: {}, OS: {} },
    cycloplegic: { OD: {}, OS: {} },
  });

  const [initialPayload, setInitialPayload] = useState(null);
  const [showCycloplegic, setShowCycloplegic] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // 🧠 Hydrate saved refraction data
  useEffect(() => {
    if (!refraction) return;

    const newData = {
      objective_method: refraction.objective_method || "",
      objective: {
        OD: refraction.objective?.find((r) => r.eye === "OD") || {},
        OS: refraction.objective?.find((r) => r.eye === "OS") || {},
      },
      subjective: {
        OD: refraction.subjective?.find((r) => r.eye === "OD") || {},
        OS: refraction.subjective?.find((r) => r.eye === "OS") || {},
      },
      cycloplegic: {
        OD: refraction.cycloplegic?.find((r) => r.eye === "OD") || {},
        OS: refraction.cycloplegic?.find((r) => r.eye === "OS") || {},
      },
    };

    setFormData(newData);
    setShowCycloplegic(refraction.cycloplegic?.length > 0);

    const payload = {
      appointment: appointmentId,
      objective_method: newData.objective_method,
      objective: ["OD", "OS"].map((eye) => ({ eye, ...newData.objective[eye] })),
      subjective: ["OD", "OS"].map((eye) => ({ eye, ...newData.subjective[eye] })),
      cycloplegic: refraction.cycloplegic?.length
        ? ["OD", "OS"].map((eye) => ({ eye, ...newData.cycloplegic[eye] }))
        : [],
    };
    setInitialPayload(payload);
  }, [refraction, appointmentId]);

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

  // 🧹 Clean data before submission
  const cleanRefractionData = (data) => {
    const cleaned = { ...data };
    if (!cleaned.cyl?.trim()) delete cleaned.axis;
    ["add", "va_6m", "va_0_4m", "cyl"].forEach((f) => {
      if (!cleaned[f]?.trim?.()) delete cleaned[f];
    });
    return cleaned;
  };

  // 💾 Save logic
  const handleSave = async () => {
    const errors = {};

    if (!formData.objective_method.trim()) {
      errors["objective_method"] = "Objective method is required";
    }

    ["OD", "OS"].forEach((eye) => {
      const obj = formData.objective[eye];
      if (!obj.sph) errors[`objective-${eye}-sph`] = "SPH is required";
      if (obj.cyl && !obj.axis)
        errors[`objective-${eye}-axis`] = "Axis required when CYL is entered";

      const sub = formData.subjective[eye];
      if (!sub.sph) errors[`subjective-${eye}-sph`] = "SPH is required";
      if (sub.cyl && !sub.axis)
        errors[`subjective-${eye}-axis`] = "Axis required when CYL is entered";

      if (showCycloplegic) {
        const cyc = formData.cycloplegic[eye];
        if (cyc.cyl && !cyc.axis)
          errors[`cycloplegic-${eye}-axis`] = "Axis required when CYL is entered";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Please fix validation errors", "error");
      return;
    }

    setFieldErrors({});
    const payload = {
      appointment: appointmentId,
      objective_method: formData.objective_method,
      objective: ["OD", "OS"].map((eye) =>
        cleanRefractionData({ eye, ...formData.objective[eye] })
      ),
      subjective: ["OD", "OS"].map((eye) =>
        cleanRefractionData({ eye, ...formData.subjective[eye] })
      ),
      cycloplegic: showCycloplegic
        ? ["OD", "OS"].map((eye) =>
            cleanRefractionData({ eye, ...formData.cycloplegic[eye] })
          )
        : [],
    };

    if (initialPayload && !hasFormChanged(initialPayload, payload)) {
      showToast("No changes detected", "info");
      setTabCompletionStatus?.((p) => ({ ...p, refraction: true }));
      setActiveTab("extra tests");
      return;
    }

    try {
      await createRefraction({ appointmentId, ...payload }).unwrap();
      showToast("Refraction saved successfully!", "success");
      setTabCompletionStatus?.((p) => ({ ...p, refraction: true }));
      setActiveTab("extra tests");
    } catch (error) {
      showToast("Failed to save refraction. Please try again.", "error");
    }
  };

  // 🧩 Render helper
  const renderFields = (section, fields) => (
    <div className="flex gap-4">
      {fields.map(({ label, name }) => {
        const Validator = FIELDS[name];
        return (
          <div key={name} className="flex flex-col">
            <label className="text-center font-medium text-base">
              {label}
              {name === "sph" && <span className="text-red-600 pl-1">*</span>}
            </label>
            <Validator
              value={formData[section].OD[name] ?? ""}
              onChange={(val) => handleChange(section, "OD", name, val)}
            />
            {fieldErrors[`${section}-OD-${name}`] && (
              <span className="text-red-600 text-sm">
                {fieldErrors[`${section}-OD-${name}`]}
              </span>
            )}
            <Validator
              value={formData[section].OS[name] ?? ""}
              onChange={(val) => handleChange(section, "OS", name, val)}
            />
            {fieldErrors[`${section}-OS-${name}`] && (
              <span className="text-red-600 text-sm">
                {fieldErrors[`${section}-OS-${name}`]}
              </span>
            )}
          </div>
        );
      })}
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

  // 🎨 Render
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Refraction</h1>
        <SupervisorGradingButton
          appointmentId={appointmentId}
          section={section}
          sectionLabel={sectionLabel}
        />
      </div>

      <div className="mb-6 w-[375px]">
        <label className="font-medium text-base">
          Method for Objective Refraction <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.objective_method}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              objective_method: e.target.value,
            }))
          }
          className={`w-full p-3 rounded-md border ${
            fieldErrors["objective_method"] ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Method</option>
          {OBJECTIVE_METHOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {fieldErrors["objective_method"] && (
          <span className="text-red-600 text-sm">
            {fieldErrors["objective_method"]}
          </span>
        )}
      </div>

      {/* Objective Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Objective Refraction</h2>
        <div className="flex gap-4">
          <div className="flex flex-col justify-end gap-4 items-baseline">
            <span className="font-bold text-xl">OD</span>
            <span className="font-bold text-xl">OS</span>
          </div>
          {renderFields("objective", objectiveFields)}
        </div>
      </section>

      {/* Subjective Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Subjective Refraction</h2>
        <div className="flex gap-4">
          <div className="flex flex-col justify-end gap-4 items-baseline">
            <span className="font-bold text-xl">OD</span>
            <span className="font-bold text-xl">OS</span>
          </div>
          {renderFields("subjective", subjectiveFields)}
        </div>
      </section>

      {/* Cycloplegic Section */}
      <section className="mb-10">
        <button
          type="button"
          onClick={() => setShowCycloplegic(!showCycloplegic)}
          className="text-[#2f3192] font-semibold flex items-center gap-2"
        >
          <GrAdd className="w-5 h-5" />
          {showCycloplegic
            ? "Remove Cycloplegic Refraction"
            : "Add Cycloplegic Refraction"}
        </button>

        {showCycloplegic && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4">
              Cycloplegic Refraction
            </h2>
            <div className="flex gap-4">
              <div className="flex flex-col justify-end gap-4 items-baseline">
                <span className="font-bold text-xl">OD</span>
                <span className="font-bold text-xl">OS</span>
              </div>
              {renderFields("cycloplegic", objectiveFields)}
            </div>
          </div>
        )}
      </section>

      <NavigationButtons
        backLabel="← Back to Internals"
        backTo="internals"
        onBack={setActiveTab}
        onSave={handleSave}
        saveLabel="Save and Proceed"
      />
    </div>
  );
};

export default Refraction;
