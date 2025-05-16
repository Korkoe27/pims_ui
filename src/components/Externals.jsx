import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useExternalObservationData from "../hooks/useExternalObservationData";
import ConditionPicker from "./ConditionPicker";
import DeleteButton from "./DeleteButton";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";
import TextInput from "./TextInput";
import ConditionsDropdown from "./ConditionsDropdown";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";

const Externals = ({ setActiveTab, setTabCompletionStatus }) => {
  const { appointmentId } = useParams();
  const [dropdowns, setDropdowns] = useState({});
  const [formData, setFormData] = useState({});

  const {
    loadingExternals,
    loadingConditions,
    conditions: rawConditions,
    existingObservations,
    conditionsError,
    createExternalObservation,
  } = useExternalObservationData(appointmentId);

  console.log("rawConditions:", rawConditions);
  console.log("loadingConditions:", loadingConditions);
  console.log("conditionsError:", conditionsError);

  const flattenedConditions = rawConditions.flatMap((main) =>
    main.subgroups.flatMap((sub) =>
      sub.conditions.map((condition) => ({
        ...condition,
        main_group_name: main.name,
        group_name: sub.name,
      }))
    )
  );

  const groupedConditions = flattenedConditions.reduce((acc, condition) => {
    const mainGroup = condition.main_group_name;
    const group = condition.group_name;
    if (!acc[mainGroup]) acc[mainGroup] = {};
    if (!acc[mainGroup][group]) acc[mainGroup][group] = [];
    acc[mainGroup][group].push(condition);
    return acc;
  }, {});

  useEffect(() => {
    if (!existingObservations?.length) return;

    const grouped = {};

    existingObservations.forEach((obs) => {
      const matchedCondition = flattenedConditions.find(
        (c) => c.id === obs.condition
      );
      if (!matchedCondition) return;

      const mainGroup = matchedCondition.main_group_name;
      const group = matchedCondition.group_name;

      if (!grouped[mainGroup]) grouped[mainGroup] = {};
      if (!grouped[mainGroup][group]) grouped[mainGroup][group] = [];

      let existing = grouped[mainGroup][group].find(
        (c) => c.id === obs.condition
      );

      if (!existing) {
        existing = {
          id: obs.condition,
          name: obs.condition_name || "",
          field_config: {
            text: matchedCondition?.has_text || false,
            dropdown: matchedCondition?.has_dropdown || false,
            grading: matchedCondition?.has_grading || false,
            notes: matchedCondition?.has_notes || false,
          },
          dropdown_options: matchedCondition?.dropdown_options || [],
          OD: {},
          OS: {},
        };
        grouped[mainGroup][group].push(existing);
      }

      existing[obs.affected_eye] = {
        ...(existing[obs.affected_eye] || {}),
        [obs.field_type]: obs.value,
      };
    });

    setFormData(grouped);
  }, [existingObservations, flattenedConditions]);

  const handleSelectCondition = (mainGroup, group, condition) => {
    const selectedId = condition.id;
    const selectedName = condition.name;

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
              field_config: {
                text: condition.has_text,
                dropdown: condition.has_dropdown,
                grading: condition.has_grading,
                notes: condition.has_notes,
              },
              dropdown_options: condition.dropdown_options || [],
              OD: {},
              OS: {},
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
    fieldType,
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
                [eye]: {
                  ...item[eye],
                  [fieldType]: value,
                },
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
    try {
      const payload = [];

      Object.entries(formData).forEach(([mainGroup, groups]) => {
        Object.entries(groups).forEach(([groupName, conditions]) => {
          conditions.forEach((condition) => {
            const { id, OD = {}, OS = {}, notes } = condition;

            ["OD", "OS"].forEach((eye) => {
              const fields = eye === "OD" ? OD : OS;
              Object.entries(fields).forEach(([field_type, value]) => {
                if (value !== "") {
                  payload.push({
                    condition: id,
                    affected_eye: eye,
                    field_type,
                    value,
                  });
                }
              });
            });

            // Handle single shared notes field (if present)
            if (notes?.trim()) {
              payload.push({
                condition: id,
                affected_eye: "OD", // or null if not per-eye
                field_type: "notes",
                value: notes.trim(),
              });
            }
          });
        });
      });

      await createExternalObservation({
        appointment: appointmentId,
        observations: payload,
      });

      showToast("External observations saved", "success");
      setTabCompletionStatus("externals", true);
      setActiveTab("internal"); // or next tab
    } catch (error) {
      showToast(formatErrorMessage(error), "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">External Observations</h1>

      {Object.entries(groupedConditions).map(([mainGroup, subGroups]) => (
        <div key={mainGroup} className="border p-4 rounded mb-4">
          <h2 className="font-semibold text-lg mb-2">{mainGroup}</h2>

          {Object.entries(subGroups).map(([groupName, conditions]) => {
            const selected = formData[mainGroup]?.[groupName] || [];

            return (
              <div key={groupName} className="bg-gray-50 p-4 mb-4 rounded">
                <h3 className="font-semibold mb-2">{groupName}</h3>

                <ConditionPicker
                  options={conditions.map((c) => ({
                    value: c.id,
                    label: c.name,
                    ...c,
                  }))}
                  selectedValues={selected.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  onSelect={(option) =>
                    handleSelectCondition(mainGroup, groupName, option)
                  }
                  conditionKey="value"
                  conditionNameKey="label"
                />

                <div className="mt-4 space-y-4">
                  {selected.map((item) => (
                    <div key={item.id} className="bg-white p-4 border rounded">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{item.name}</h4>
                        <DeleteButton
                          onClick={() =>
                            handleDeleteCondition(mainGroup, groupName, item.id)
                          }
                        />
                      </div>

                      {item.field_config?.grading && (
                        <GradingSelect
                          valueOD={item.OD?.grading || ""}
                          valueOS={item.OS?.grading || ""}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              mainGroup,
                              groupName,
                              item.id,
                              "OD",
                              "grading",
                              val
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              mainGroup,
                              groupName,
                              item.id,
                              "OS",
                              "grading",
                              val
                            )
                          }
                        />
                      )}

                      {item.field_config?.dropdown && (
                        <ConditionsDropdown
                          valueOD={item.OD?.dropdown || ""}
                          valueOS={item.OS?.dropdown || ""}
                          options={item.dropdown_options}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              mainGroup,
                              groupName,
                              item.id,
                              "OD",
                              "dropdown",
                              val
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              mainGroup,
                              groupName,
                              item.id,
                              "OS",
                              "dropdown",
                              val
                            )
                          }
                        />
                      )}

                      {item.field_config?.notes && (
                        <NotesTextArea
                          value={item.notes || ""}
                          onChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              [mainGroup]: {
                                ...prev[mainGroup],
                                [groupName]: prev[mainGroup][groupName].map(
                                  (cond) =>
                                    cond.id === item.id
                                      ? {
                                          ...cond,
                                          notes: val,
                                        }
                                      : cond
                                ),
                              },
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* ✅ Submit Button */}
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
  );
};

export default Externals;
