import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useExternalObservationData from "../hooks/useExternalObservationData";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import ErrorModal from "./ErrorModal";

const Externals = ({ setActiveTab }) => {
  const { appointmentId } = useParams();

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

  // Group conditions by group_name
  const groupedConditions = conditions.reduce((acc, condition) => {
    const groupName = condition.group_name;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(condition);
    return acc;
  }, {});

  // Populate formData from existing observations
  useEffect(() => {
    if (externals && conditions.length > 0) {
      const initialFormData = {};

      externals.forEach((obs) => {
        const condition = conditions.find((c) => c.id === obs.condition);
        if (!condition) return;

        const groupName = condition.group_name;

        if (!initialFormData[groupName]) {
          initialFormData[groupName] = [];
        }

        initialFormData[groupName].push({
          id: condition.id,
          name: condition.name,
          affected_eye: obs.affected_eye,
          grading: obs.grading,
          notes: obs.notes,
        });
      });

      setFormData(initialFormData);
    }
  }, [externals, conditions]);

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

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    const observations = [];

    Object.entries(formData).forEach(([groupName, entries]) => {
      entries.forEach((entry) => {
        observations.push({
          condition: entry.id,
          affected_eye: entry.affected_eye,
          grading: entry.grading,
          notes: entry.notes,
        });
      });
    });

    if (observations.length === 0) {
      setErrorMessage({
        detail: "Please select and fill at least one condition. 👍",
      });
      setShowErrorModal(true);
      return;
    }

    try {
      await createExternalObservation({ appointmentId, observations }).unwrap();
      console.log("✅ Externals saved");
      if (setActiveTab) setActiveTab("internals");
    } catch (error) {
      console.error("❌ Failed to save externals:", error);
      setErrorMessage({
        detail: "Failed to save observations. Please try again.",
      });
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Externals</h1>

      {loadingConditions || loadingExternals ? (
        <p>Loading conditions...</p>
      ) : conditionsError ? (
        <p className="text-red-500">Failed to load external conditions.</p>
      ) : (
        <div className="space-y-8">
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
              type="button"
              onClick={handleSaveAndProceed}
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save and Proceed
            </button>
          </div>
        </div>
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
