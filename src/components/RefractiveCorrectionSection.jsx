import React, { useState } from "react";
import { useGetRefractiveCorrectionTypesQuery, useGetLensTypesQuery } from "../redux/api/features/managementApi";
import SPHValidator from "./validators/SPHValidator";
import CYLValidator from "./validators/CYLValidator";
import AXISValidator from "./validators/AXISValidator";
import ADDValidator from "./validators/ADDValidator";

const RefractiveCorrectionSection = ({ prescription, handleInputChange, selectedTypes, setSelectedTypes, selectedLensTypes, setSelectedLensTypes }) => {
  const { data: correctionTypes, isLoading: loadingCorrections } = useGetRefractiveCorrectionTypesQuery();
  const { data: lensTypes, isLoading: loadingLensTypes } = useGetLensTypesQuery();

  const handleTypeToggle = (typeId) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleLensTypeToggle = (typeId) => {
    setSelectedLensTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* --- Type of Refractive Correction --- */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-medium flex items-center">
          Type of Refractive Correction{" "}
          <span className="text-red-600 font-bold ml-1">*</span>
        </label>
        {loadingCorrections ? (
          <p className="text-gray-500">Loading correction types...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {correctionTypes?.map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                  className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{type.name}</span>
              </label>
            ))}
          </div>
        )}
        {selectedTypes.length === 0 && (
          <p className="text-sm text-red-600">Please select at least one correction type.</p>
        )}
      </div>

      {/* --- Type of Lens --- */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-medium">Type of Lens</label>
        {loadingLensTypes ? (
          <p className="text-gray-500">Loading lens types...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {lensTypes?.map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLensTypes.includes(type.id)}
                  onChange={() => handleLensTypeToggle(type.id)}
                  className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{type.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* --- Final Prescription --- */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-medium flex items-center">
          Final Prescription <span className="text-red-600 font-bold ml-1">*</span>
        </label>

        <aside className="flex gap-4">
          <div className="flex flex-col justify-end gap-4 items-baseline">
            <h1 className="text-xl font-bold text-center">OD</h1>
            <h1 className="text-xl font-bold text-center">OS</h1>
          </div>

          {["sph", "cyl", "axis", "add"].map((field) => {
            const label = field.toUpperCase();
            const ValidatorComponent = {
              sph: SPHValidator,
              cyl: CYLValidator,
              axis: AXISValidator,
              add: ADDValidator,
            }[field];

            return (
              <div className="flex flex-col w-28" key={field}>
                <label className="px-4 text-center font-normal text-base uppercase">
                  {label}
                  {field === "sph" && <span className="text-red-600 font-bold ml-1">*</span>}
                </label>
                <ValidatorComponent
                  value={prescription[`od_${field}`]}
                  onChange={(value) =>
                    handleInputChange({ target: { name: `od_${field}`, value } })
                  }
                  required={field === "sph"}
                />
                <ValidatorComponent
                  value={prescription[`os_${field}`]}
                  onChange={(value) =>
                    handleInputChange({ target: { name: `os_${field}`, value } })
                  }
                  required={field === "sph"}
                />
              </div>
            );
          })}
        </aside>
      </div>

      {/* --- PD, Segment Height, Fitting Cross Height --- */}
      <div className="flex gap-10 w-fit">
        {["PD", "segment_height", "fitting_cross_height"].map((key) => (
          <label key={key} className="flex flex-col gap-1">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            <input
              type="text"
              name={key}
              className="w-20 h-9 p-2 border border-[#d0d5dd] rounded-lg"
              value={prescription[key]}
              onChange={handleInputChange}
              placeholder="in mm"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default RefractiveCorrectionSection;
