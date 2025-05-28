import React, { useState, useEffect } from "react";

const RefractiveCorrectionSection = ({ prescription, handleInputChange }) => {
  const [typeTouched, setTypeTouched] = useState(false);

  const isTypeInvalid = typeTouched && !prescription.type_of_refractive_correction;

  return (
    <div className="flex flex-col gap-6">
      {/* --- Type of Refractive Correction --- */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium flex items-center">
          Type of Refractive Correction <span className="text-red-600 font-bold ml-1">*</span>
        </label>
        <select
          name="type_of_refractive_correction"
          value={prescription.type_of_refractive_correction}
          onChange={(e) => {
            handleInputChange(e);
            setTypeTouched(true);
          }}
          onBlur={() => setTypeTouched(true)}
          className={`h-14 border ${
            isTypeInvalid ? "border-red-500" : "border-[#d0d5dd]"
          } w-[375px] rounded-md text-gray-600`}
        >
          <option value="">Select an option</option>
          <option value="Spectacles">Spectacles</option>
          <option value="Contact Lenses">Contact Lenses</option>
          <option value="Prisms">Prisms</option>
          <option value="Magnifiers">Magnifiers</option>
          <option value="Telescopic Aids">Telescopic Aids</option>
          <option value="Other">Other</option>
        </select>
        {isTypeInvalid && (
          <p className="text-sm text-red-600">This field is required.</p>
        )}
      </div>

      {/* --- Final Prescription --- */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-medium flex items-center">
          Final Prescription <span className="text-red-600 font-bold">*</span>
        </label>

        <aside className="flex gap-4">
          <div className="flex flex-col justify-end gap-4 items-baseline">
            <h1 className="text-xl font-bold text-center">OD</h1>
            <h1 className="text-xl font-bold text-center">OS</h1>
          </div>

          {["sph", "cyl", "axis", "add"].map((field) => (
            <div className="flex flex-col" key={field}>
              <label className="px-4 text-center font-normal text-base uppercase">
                {field}
              </label>
              <input
                type="text"
                className="w-20 h-9 mb-4 rounded-md border border-[#d0d5dd] px-4"
                name={`od_${field}`}
                value={prescription[`od_${field}`]}
                onChange={handleInputChange}
                placeholder={field === "axis" ? "90" : "-2.00"}
              />
              <input
                type="text"
                className="w-20 h-9 rounded-md border border-[#d0d5dd] px-4"
                name={`os_${field}`}
                value={prescription[`os_${field}`]}
                onChange={handleInputChange}
                placeholder={field === "axis" ? "90" : "-2.00"}
              />
            </div>
          ))}
        </aside>
      </div>

      {/* --- Type of Lens --- */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium">Type of Lens</label>
        <select
          name="type_of_lens"
          value={prescription.type_of_lens}
          onChange={handleInputChange}
          className="h-14 border border-[#d0d5dd] w-[375px] rounded-md text-gray-600"
        >
          <option value="">Select an option</option>
          <option value="Single Vision">Single Vision</option>
          <option value="Bifocal">Bifocal</option>
          <option value="Progressive">Progressive</option>
          <option value="Trifocal">Trifocal</option>
          <option value="Photochromic">Photochromic</option>
          <option value="Blue Light Blocking">Blue Light Blocking</option>
          <option value="Polarized">Polarized</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* --- PD, Segment Height, Fitting Cross Height --- */}
      <div className="flex gap-10 w-fit">
        {["pd", "segment_height", "fitting_cross_height"].map((key) => (
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
