import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { useParams } from "react-router-dom";
import useRefractionData from "../hooks/useRefractionData";
import ErrorModal from "./ErrorModal";
import { showToast } from "../components/ToasterHelper";
import { hasFormChanged } from "../utils/deepCompare";
import SPHValidator from "./validators/SPHValidator";
import CYLValidator from "./validators/CYLValidator";
import AXISValidator from "./validators/AXISValidator";
import VAValidator from "./validators/VAValidator";
import ADDValidator from "./validators/ADDValidator";

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

  const [formData, setFormData] = useState({
    objective_method: "",
    objective: { OD: {}, OS: {} },
    subjective: { OD: {}, OS: {} },
    cycloplegic: { OD: {}, OS: {} },
  });

  const [initialPayload, setInitialPayload] = useState(null);
  const [showCycloplegic, setShowCycloplegic] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (refraction) {
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

      const payload = {
        appointment: appointmentId,
        objective_method: newData.objective_method,
        objective: ["OD", "OS"].map((eye) => ({
          eye,
          ...newData.objective[eye],
        })),
        subjective: ["OD", "OS"].map((eye) => ({
          eye,
          ...newData.subjective[eye],
        })),
        cycloplegic:
          refraction.cycloplegic?.length > 0
            ? ["OD", "OS"].map((eye) => ({ eye, ...newData.cycloplegic[eye] }))
            : [],
      };

      setInitialPayload(payload);
      setShowCycloplegic(refraction.cycloplegic?.length > 0);
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
    const errors = {};

    if (!formData.objective_method.trim()) {
      errors["objective_method"] = "Objective method is required";
    }

    ["OD", "OS"].forEach((eye) => {
      const obj = formData.objective[eye];
      if (!obj.sph) {
        errors[`objective-${eye}-sph`] = "SPH is required";
      }
      if (
        obj.cyl &&
        (obj.axis === undefined || obj.axis === null || obj.axis === "")
      ) {
        errors[`objective-${eye}-axis`] =
          "Axis is required when CYL is entered";
      }

      const sub = formData.subjective[eye];

      if (!sub.sph || sub.sph.trim() === "") {
        errors[`subjective-${eye}-sph`] = "Subjective SPH is required";
      }

      if (
        sub.cyl &&
        sub.cyl.trim() !== "" &&
        (sub.axis === undefined || sub.axis === null || sub.axis.trim() === "")
      ) {
        errors[`subjective-${eye}-axis`] =
          "Axis is required when CYL is entered";
      }

      if (showCycloplegic) {
        const cyc = formData.cycloplegic[eye];
        if (
          cyc.cyl &&
          (cyc.axis === undefined || cyc.axis === null || cyc.axis === "")
        ) {
          errors[`cycloplegic-${eye}-axis`] =
            "Axis is required when CYL is entered";
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast("Please fill in required fields", "error");
      return;
    }

    setFieldErrors({});

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

    if (initialPayload && !hasFormChanged(initialPayload, payload)) {
      showToast("No changes detected", "info");
      setTabCompletionStatus?.((prev) => ({ ...prev, refraction: true }));
      setActiveTab("extra tests");
      return;
    }

    try {
      await createRefraction({ appointmentId, ...payload }).unwrap();
      showToast("Refraction saved successfully!", "success");
      setTabCompletionStatus?.((prev) => ({ ...prev, refraction: true }));
      setActiveTab("extra tests");
    } catch (error) {
      showToast(
        "Failed to save refraction results. Please try again.",
        "error"
      );
    }
  };

  const renderFields = (section, fields) => (
    <div className="flex gap-4">
      {fields.map(({ label, name }) => {
        const ValidatorComponent = FIELDS[name];
        return (
          <div key={name} className="flex flex-col">
            <label className="text-center font-normal text-base">
              {label}
              {name === "sph" && <span className="text-red-600 pl-1">*</span>}
            </label>
            <ValidatorComponent
              value={formData[section].OD[name] ?? ""}
              onChange={(val) => handleChange(section, "OD", name, val)}
            />
            {name === "sph" && fieldErrors[`${section}-OD-sph`] && (
              <span className="text-red-600 text-sm">
                {fieldErrors[`${section}-OD-sph`]}
              </span>
            )}
            {name === "axis" && fieldErrors[`${section}-OD-axis`] && (
              <span className="text-red-600 text-sm">
                {fieldErrors[`${section}-OD-axis`]}
              </span>
            )}
            <ValidatorComponent
              value={formData[section].OS[name] ?? ""}
              onChange={(val) => handleChange(section, "OS", name, val)}
            />
            {name === "sph" && fieldErrors[`${section}-OS-sph`] && (
              <span className="text-red-600 text-sm">
                {fieldErrors[`${section}-OS-sph`]}
              </span>
            )}
            {name === "axis" && fieldErrors[`${section}-OS-axis`] && (
              <span className="text-red-600 text-sm">
                {fieldErrors[`${section}-OS-axis`]}
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

  return (
    <div className="my-8 px-16 flex flex-col gap-12">
      <form className="flex flex-col gap-20">
        <div className="flex flex-col gap-1 h-24 w-[375px]">
          <label className="text-base text-[#101928] font-medium">
            Method for Objective Refraction{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.objective_method || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                objective_method: e.target.value,
              }))
            }
            className={`w-full p-4 h-14 rounded-md border ${
              fieldErrors["objective_method"]
                ? "border-red-500"
                : "border-[#d0d5dd]"
            } bg-white`}
          >
            <option value="">Select Method</option>
            {OBJECTIVE_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors["objective_method"] && (
            <span className="text-red-600 text-sm">
              {fieldErrors["objective_method"]}
            </span>
          )}
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
            className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50"
          >
            ← Back to Internals
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
          >
            Save and Proceed
          </button>
        </div>
      </form>

      {showErrorModal && (
        <ErrorModal
          onClose={() => setShowErrorModal(false)}
          message="Something went wrong."
        />
      )}
    </div>
  );
};

export default Refraction;
