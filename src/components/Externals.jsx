import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useFetchExternalConditionsQuery } from "../redux/api/features/externalsApi";

const Externals = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const { patient } = location.state || {};
  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState({});
  const [formData, setFormData] = useState({});
  const { data: conditions = [], isLoading } =
    useFetchExternalConditionsQuery();

  const groupedConditions = conditions.reduce((acc, condition) => {
    const groupName = condition.group.name;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(condition);
    return acc;
  }, {});

  const toggleSection = (groupName) => {
    setDropdowns((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleInputChange = (group, eye, conditionId, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [eye]: {
          ...prev[group]?.[eye],
          [conditionId]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 Final form data:", formData);
    alert("Externals data saved successfully!");
    navigate("/internals");
  };

  const renderFields = (groupName, conditionsList) => (
    <div className="flex flex-col gap-6 px-8">
      <div className="flex justify-between font-bold text-lg">
        <span>OD</span>
        <span>OS</span>
      </div>
      {conditionsList.map(({ id, name }) => (
        <div key={id} className="flex justify-between items-center">
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={`${groupName}-od-${id}`}
                value="yes"
                onChange={() => handleInputChange(groupName, "od", id, "yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${groupName}-od-${id}`}
                value="no"
                onChange={() => handleInputChange(groupName, "od", id, "no")}
              />{" "}
              No
            </label>
          </div>
          <span>{name}</span>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={`${groupName}-os-${id}`}
                value="yes"
                onChange={() => handleInputChange(groupName, "os", id, "yes")}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${groupName}-os-${id}`}
                value="no"
                onChange={() => handleInputChange(groupName, "os", id, "no")}
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
      {isLoading ? (
        <p>Loading conditions...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(groupedConditions).map(([groupName, conditions]) => (
            <div key={groupName} className="bg-white shadow p-4 rounded">
              <button
                type="button"
                onClick={() => toggleSection(groupName)}
                className="w-full flex justify-between items-center text-left font-semibold"
              >
                <span className="capitalize">{groupName}</span>
                {dropdowns[groupName] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {dropdowns[groupName] && renderFields(groupName, conditions)}
            </div>
          ))}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save and Proceed
          </button>
        </form>
      )}
    </div>
  );
};

export default Externals;
