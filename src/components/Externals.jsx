import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useExternalObservationData from "../hooks/useExternalObservationData";
import SearchableSelect from "./SearchableSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";

const Externals = ({ setActiveTab, setTabCompletionStatus }) => {
  const { appointmentId } = useParams();

  const [dropdowns, setDropdowns] = useState({});
  const [formData, setFormData] = useState({});

  const {
    loadingExternals,
    loadingConditions,
    conditions,
    conditionsError,
    createExternalObservation,
  } = useExternalObservationData(appointmentId);

  // Group conditions into { mainGroup: { subGroup: [conditions] } }
  const groupedConditions = conditions.reduce((acc, condition) => {
    const mainGroup = condition.main_group_name;
    const group = condition.group_name;
    if (!acc[mainGroup]) acc[mainGroup] = {};
    if (!acc[mainGroup][group]) acc[mainGroup][group] = [];
    acc[mainGroup][group].push(condition);
    return acc;
  }, {});

  const toggleSection = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectCondition = (mainGroup, group, selectedOption) => {
    const selectedId = selectedOption.value;
    const selectedName = selectedOption.label;

    setFormData((prev) => {
      const existing = prev[mainGroup]?.[group] || [];
      if (existing.some((item) => item.id === selectedId)) return prev;

      return {
        ...prev,
        [mainGroup]: {
          ...prev[mainGroup],
          [group]: [
            ...existing,
            {
              id: selectedId,
              name: selectedName,
              OD: { grading: "", notes: "" },
              OS: { grading: "", notes: "" },
            },
          ],
        },
      };
    });
  };

  const handleFieldChange = (
    mainGroup,
    group,
    conditionId,
    eye,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [mainGroup]: {
        ...prev[mainGroup],
        [group]: prev[mainGroup][group].map((item) =>
          item.id === conditionId
            ? {
                ...item,
                [eye]: { ...item[eye], [field]: value },
              }
            : item
        ),
      },
    }));
  };

  const handleDeleteCondition = (mainGroup, group, conditionId) => {
    setFormData((prev) => ({
      ...prev,
      [mainGroup]: {
        ...prev[mainGroup],
        [group]: prev[mainGroup][group].filter(
          (item) => item.id !== conditionId
        ),
      },
    }));
  };

  const handleSaveAndProceed = async () => {
    const observations = [];

    Object.entries(formData).forEach(([mainGroup, groupEntries]) => {
      Object.entries(groupEntries).forEach(([group, entries]) => {
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
    });

    if (observations.length === 0) {
      showToast("Please select and fill at least one condition. 👍", "error");
      return;
    }

    try {
      await createExternalObservation({ appointmentId, observations }).unwrap();
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        externals: true,
      }));
      showToast("External observations saved successfully!", "success");
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
          {Object.entries(groupedConditions).map(([mainGroup, subGroups]) => (
            <div key={mainGroup} className="bg-white shadow rounded p-4">
              <button
                type="button"
                onClick={() => toggleSection(mainGroup)}
                className="w-full flex justify-between items-center text-left font-semibold"
              >
                <span>{mainGroup}</span>
                {dropdowns[mainGroup] ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {dropdowns[mainGroup] &&
                Object.entries(subGroups).map(([group, groupConditions]) => {
                  const options = groupConditions.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }));

                  const selectedConditions = formData[mainGroup]?.[group] || [];

                  return (
                    <div
                      key={group}
                      className="mt-4 space-y-4 bg-gray-50 p-4 rounded"
                    >
                      <h3 className="font-semibold">{group}</h3>
                      <SearchableSelect
                        options={options}
                        selectedValues={selectedConditions.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        onSelect={(option) =>
                          handleSelectCondition(mainGroup, group, option)
                        }
                        conditionKey="value"
                        conditionNameKey="label"
                      />

                      {selectedConditions.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white border rounded space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{item.name}</h4>
                            <DeleteButton
                              onClick={() =>
                                handleDeleteCondition(mainGroup, group, item.id)
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
                                      mainGroup,
                                      group,
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
                                      mainGroup,
                                      group,
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
                  );
                })}
            </div>
          ))}

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
