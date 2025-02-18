import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const Externals = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const { patient } = location.state || {};
  const navigate = useNavigate();

  const sections = [
    {
      name: "eyelids",
      fields: [
        { label: "Swelling", name: "swelling" },
        { label: "Warm to Touch", name: "warmToTouch" },
        { label: "Ptosis", name: "ptosis" },
      ],
    },
    {
      name: "conjunctiva",
      fields: [
        { label: "Hyperemia", name: "hyperemia" },
        { label: "Discharge", name: "discharge" },
        { label: "Epiphora", name: "epiphora" },
      ],
    },
    {
      name: "cornea",
      fields: [
        { label: "Abrasions", name: "abrasions" },
        { label: "Scarring", name: "scarring" },
        { label: "Ulcer", name: "ulcer" },
      ],
    },
    {
      name: "pupil",
      fields: [
        { label: "Round", name: "round" },
        { label: "Reactive to Light", name: "reactiveToLight" },
        { label: "Equal Size", name: "equalSize" },
      ],
    },
    {
      name: "anteriorChamber",
      fields: [
        { label: "Cells/Flares", name: "cellsFlares" },
        { label: "Hyphaema", name: "hyphaema" },
        { label: "Keratic Precipitates", name: "keraticPrecipitates" },
      ],
    },
  ];

  const [dropdowns, setDropdowns] = useState({});
  const [formData, setFormData] = useState({});

  const toggleSection = (name) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleInputChange = (section, eye, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [eye]: {
          ...prev[section]?.[eye],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Externals data saved successfully!");
    navigate("/internals");
  };

  const renderFields = (section, fields) => (
    <div className="flex flex-col gap-6 px-8">
      <div className="flex justify-between font-bold text-lg">
        <span>OD</span>
        <span>OS</span>
      </div>
      {fields.map(({ label, name }) => (
        <div key={name} className="flex justify-between items-center">
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={`${section}-od-${name}`}
                value="yes"
                onChange={() => handleInputChange(section, "od", name, "yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${section}-od-${name}`}
                value="no"
                onChange={() => handleInputChange(section, "od", name, "no")}
              />{" "}
              No
            </label>
          </div>
          <span>{label}</span>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={`${section}-os-${name}`}
                value="yes"
                onChange={() => handleInputChange(section, "os", name, "yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${section}-os-${name}`}
                value="no"
                onChange={() => handleInputChange(section, "os", name, "no")}
              />{" "}
              No
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Externals</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map(({ name, fields }) => (
          <div key={name} className="bg-white shadow p-4 rounded">
            <button
              type="button"
              onClick={() => toggleSection(name)}
              className="w-full flex justify-between items-center text-left font-semibold"
            >
              <span className="capitalize">{name}</span>
              {dropdowns[name] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {dropdowns[name] && renderFields(name, fields)}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save and Proceed
        </button>
      </form>
    </div>
  );
};

export default Externals;
