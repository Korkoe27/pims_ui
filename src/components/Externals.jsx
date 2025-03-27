import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useExternalObservationData from "../hooks/useExternalObservationData";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import ErrorModal from "./ErrorModal";

const Externals = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const { patient } = location.state || {};
  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState({});
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const {
    externals,
    loadingExternals,
    conditions,
    loadingConditions,
    conditionsError,
    createExternalObservation,
  } = useExternalObservationData(appointmentId);

  const groupedConditions = conditions.reduce((acc, condition) => {
    const groupName = condition.group_name;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(condition);
    return acc;
  }, {});

  const toggleSection = (groupName) => {
    setDropdowns((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleSelectCondition = (groupName, selectedOption) => {
    const selectedId = selectedOption.value;
    const selectedName = selectedOption.label;

    setFormData((prev) => {
      const groupData = prev[groupName] || [];
      if (groupData.some((item) => item.id === selectedId)) return prev;

      return {
        ...prev,
        [groupName]: [
          ...groupData,
          {
            id: selectedId,
            name: selectedName,
            affected_eye: "",
            grading: "",
            notes: "",
          },
        ],
      };
    });
  };

  const handleFieldChange = (groupName, conditionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((item) =>
        item.id === conditionId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleDeleteCondition = (groupName, conditionId) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: prev[groupName].filter((item) => item.id !== conditionId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const observations = [];

      Object.entries(formData).forEach(([groupName, entries]) => {
        entries.forEach((entry) => {
          observations.push({
            appointment: appointmentId,
            condition: entry.id,
            affected_eye: entry.affected_eye,
            grading: entry.grading,
            notes: entry.notes,
          });
        });
      });

      for (const obs of observations) {
        await createExternalObservation(obs).unwrap();
      }

      alert("Externals data saved successfully!");
      navigate("/internals");
    } catch (error) {
      console.error("❌ Failed to submit observations:", error);
      setErrorMessage("Failed to save observations. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Externals</h1>

      {loadingConditions ? (
        <p>Loading conditions...</p>
      ) : conditionsError ? (
        <p className="text-red-500">Failed to load external conditions.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(groupedConditions).map(
            ([groupName, groupConditions]) => {
              const options = groupConditions.map((c) => ({
                value: c.id,
                label: c.name,
              }));

              const selectedGroupConditions = formData[groupName] || [];

              return (
                <div key={groupName} className="bg-white shadow p-4 rounded">
                  <button
                    type="button"
                    onClick={() => toggleSection(groupName)}
                    className="w-full flex justify-between items-center text-left font-semibold"
                  >
                    <span>{groupName}</span>
                    {dropdowns[groupName] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {dropdowns[groupName] && (
                    <div className="mt-4 space-y-4">
                      <SearchableSelect
                        options={options}
                        selectedValues={selectedGroupConditions.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        onSelect={(option) =>
                          handleSelectCondition(groupName, option)
                        }
                        conditionKey="value"
                        conditionNameKey="label"
                      />

                      {selectedGroupConditions.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 bg-gray-50 border rounded space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{item.name}</h4>
                            <DeleteButton
                              onClick={() =>
                                handleDeleteCondition(groupName, item.id)
                              }
                            />
                          </div>

                          <AffectedEyeSelect
                            value={item.affected_eye}
                            onChange={(val) =>
                              handleFieldChange(
                                groupName,
                                item.id,
                                "affected_eye",
                                val
                              )
                            }
                          />

                          <GradingSelect
                            value={item.grading}
                            onChange={(val) =>
                              handleFieldChange(
                                groupName,
                                item.id,
                                "grading",
                                val
                              )
                            }
                          />

                          <NotesTextArea
                            value={item.notes}
                            onChange={(val) =>
                              handleFieldChange(
                                groupName,
                                item.id,
                                "notes",
                                val
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save and Proceed
            </button>
          </div>
        </form>
      )}

      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default Externals;
