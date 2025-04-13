import React, { useEffect, useState } from "react";
import useRefractionData from "../hooks/useRefractionData";

const FIELD_LABELS = {
  sph: "SPH",
  cyl: "CYL",
  axis: "AXIS",
  va_6m: "VA @ 6m",
  add: "ADD",
  va_0_4m: "VA @ 0.4m",
};

const RefractionView = ({ appointmentId }) => {
  const { refraction, loadingRefraction } = useRefractionData(appointmentId);
  const [hasCyclo, setHasCyclo] = useState(false);

  useEffect(() => {
    if (
      Array.isArray(refraction?.cycloplegic) &&
      refraction.cycloplegic.length > 0
    ) {
      setHasCyclo(true);
    }
  }, [refraction]);

  const renderSection = (title, sectionData, fields) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-[#2f3192]">{title}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {["OD", "OS"].map((eye) => {
          const entry = sectionData?.find((r) => r.eye === eye);
          return (
            <div
              key={eye}
              className="p-4 border border-gray-200 rounded bg-gray-50"
            >
              <h4 className="font-semibold mb-2">{eye}</h4>
              {fields.map((f) => (
                <div key={f} className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">{FIELD_LABELS[f]}:</span>{" "}
                  {entry?.[f] || "N/A"}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loadingRefraction) {
    return <p className="text-gray-500">Loading refraction data...</p>;
  }

  if (!refraction) {
    return <p className="text-red-500">No refraction data found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-h-[80vh] overflow-y-auto space-y-10">
      <h2 className="text-xl font-bold text-[#2f3192] mb-2">
        Refraction Results
      </h2>

      <div>
        <p className="text-base font-medium">
          Objective Method:{" "}
          <span className="font-normal text-gray-700">
            {refraction.objective_method || "N/A"}
          </span>
        </p>
      </div>

      {renderSection("Objective Refraction", refraction.objective, [
        "sph",
        "cyl",
        "axis",
        "va_6m",
      ])}

      {renderSection("Subjective Refraction", refraction.subjective, [
        "sph",
        "cyl",
        "axis",
        "add",
        "va_6m",
        "va_0_4m",
      ])}

      {hasCyclo &&
        renderSection("Cycloplegic Refraction", refraction.cycloplegic, [
          "sph",
          "cyl",
          "axis",
          "va_6m",
        ])}
    </div>
  );
};

export default RefractionView;
