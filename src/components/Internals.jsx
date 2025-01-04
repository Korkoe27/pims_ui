import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Internals = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const { patient } = location.state || {};
  const navigate = useNavigate();

  const sections = [
    {
      name: "lens",
      title: "Lens",
      fields: [
        { label: "Deposits", name: "deposits" },
        { label: "Cloudy", name: "cloudy" },
        { label: "Aphakia", name: "aphakia" },
        { label: "Pseudophakia", name: "pseudophakia" },
        { label: "Clear", name: "clear" },
      ],
    },
    {
      name: "vitreous",
      title: "Vitreous",
      fields: [
        { label: "Floaters", name: "floaters" },
        { label: "Haemorrhages", name: "haemorrhages" },
        { label: "Detachment", name: "detachment" },
        { label: "Hazy", name: "hazy" },
        { label: "Clear", name: "clear" },
      ],
    },
    {
      name: "ophthalmoscopy",
      title: "Ophthalmoscopy",
      fields: [
        { label: "Disc Color", name: "discColor" },
        { label: "Disc Margin", name: "discMargin" },
        { label: "Cup-to-Disc Ratio", name: "cupToDiscRatio" },
        { label: "Haemorrhages", name: "haemorrhages" },
        { label: "Exudates", name: "exudates" },
      ],
    },
    {
      name: "macula",
      title: "Macula",
      fields: [
        { label: "Foveal Reflex", name: "fovealReflex" },
        { label: "Scar", name: "scar" },
        { label: "Hole", name: "hole" },
        { label: "Atrophy", name: "atrophy" },
        { label: "Healthy", name: "healthy" },
      ],
    },
    {
      name: "intraOcularPressure",
      title: "Intra-Ocular Pressure",
      fields: [{ label: "IOP Value", name: "iopValue" }],
    },
  ];

  const [dropdowns, setDropdowns] = useState(
    sections.reduce((acc, section) => ({ ...acc, [section.name]: false }), {})
  );

  const toggleSection = (name) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const proceedToRefraction = () => {
    navigate("/refraction");
  };

  const renderFields = (section) => (
    <div className="flex flex-col gap-8">
      {section.fields.map(({ label, name }) => (
        <div key={name} className="flex justify-between items-center">
          <div className="flex gap-4">
            <label>
              <input type="radio" name={`${section.name}-od-${name}`} value="yes" /> Yes
            </label>
            <label>
              <input type="radio" name={`${section.name}-od-${name}`} value="no" /> No
            </label>
          </div>
          <span>{label}</span>
          <div className="flex gap-4">
            <label>
              <input type="radio" name={`${section.name}-os-${name}`} value="yes" /> Yes
            </label>
            <label>
              <input type="radio" name={`${section.name}-os-${name}`} value="no" /> No
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Internals</h1>
      <form className="space-y-8">
        {sections.map((section) => (
          <div key={section.name} className="bg-white shadow p-4 rounded">
            <button
              type="button"
              onClick={() => toggleSection(section.name)}
              className="w-full flex justify-between items-center text-left font-semibold"
            >
              <span>{section.title}</span>
              {dropdowns[section.name] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {dropdowns[section.name] && renderFields(section)}
          </div>
        ))}
        <button
          type="button"
          onClick={proceedToRefraction}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save and Proceed
        </button>
      </form>
    </div>
  );
};

export default Internals;
