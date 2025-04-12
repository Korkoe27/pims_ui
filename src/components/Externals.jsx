import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useExternalObservationData from "../hooks/useExternalObservationData";
import SearchableSelect from "./SearchableSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";

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

  const groupedConditions = conditions.reduce((acc, condition) => {
    const groupName = condition.group_name;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(condition);
    return acc;
  }, {});

  useEffect(() => {
    if (externals && conditions.length > 0) {
      const initialFormData = {};

      externals.forEach((obs) => {
        const condition = conditions.find((c) => c.id === obs.condition);
        if (!condition) return;

        const groupName = condition.group_name;
        if (!initialFormData[groupName]) initialFormData[groupName] = [];

        const entryIndex = initialFormData[groupName].findIndex(
          (e) => e.id === condition.id
        );

        if (entryIndex === -1) {
          initialFormData[groupName].push({
            id: condition.id,
            name: condition.name,
            [obs.affected_eye]: {
              grading: obs.grading,
              notes: obs.notes,
            },
          });
        } else {
          initialFormData[groupName][entryIndex][obs.affected_eye] = {
            grading: obs.grading,
            notes: obs.notes,
          };
        }
      });

      setFormData(initialFormData);
    }
  }, [externals, conditions]);

  useEffect(() => {
    if (showErrorModal && errorMessage) {
      showToast(errorMessage.detail, "error");
      setShowErrorModal(false);
    }
  }, [showErrorModal, errorMessage]);

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
            OD: { grading: "", notes: "" },
            OS: { grading: "", notes: "" },
          },
        ],
      };
    });
  };

  const handleFieldChange = (groupName, conditionId, eye, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((item) =>
        item.id === conditionId
          ? {
              ...item,
              [eye]: { ...item[eye], [field]: value },
            }
          : item
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
        ["OD", "OS"].forEach((eye) => {
          const details = entry[eye];
          if (details && (details.grading || details.notes)) {
            observations.push({
              condition: entry.id,
              affected_eye: eye,
              grading: details.grading,
              notes: details.notes,
            });
          }
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
      if (setActiveTab) setActiveTab("internals");
    } catch (error) {
      const formatted = formatErrorMessage(error?.data);
      showToast(formatted, "error");
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

                          <div className="grid grid-cols-2 gap-4">
                            {["OD", "OS"].map((eye) => (
                              <div key={eye}>
                                <h5 className="font-medium text-sm mb-2">
                                  {eye === "OD"
                                    ? "OD (Right Eye)"
                                    : "OS (Left Eye)"}
                                </h5>
                                <GradingSelect
                                  value={item[eye]?.grading || ""}
                                  onChange={(val) =>
                                    handleFieldChange(
                                      groupName,
                                      item.id,
                                      eye,
                                      "grading",
                                      val
                                    )
                                  }
                                />
                                <NotesTextArea
                                  value={item[eye]?.notes || ""}
                                  onChange={(val) =>
                                    handleFieldChange(
                                      groupName,
                                      item.id,
                                      eye,
                                      "notes",
                                      val
                                    )
                                  }
                                  placeholder={`Notes for ${eye}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab("visual acuity")}
              className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-colors duration-200"
            >
              ← Back to Visual Acuity
            </button>

            <button
              type="button"
              onClick={handleSaveAndProceed}
              className="px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700"
            >
              Save and Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Externals;
