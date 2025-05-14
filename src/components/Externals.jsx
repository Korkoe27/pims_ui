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
                          valueOD={item.OD?.notes || ""}
                          valueOS={item.OS?.notes || ""}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              mainGroup,
                              groupName,
                              item.id,
                              "OD",
                              "notes",
                              val
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              mainGroup,
                              groupName,
                              item.id,
                              "OS",
                              "notes",
                              val
                            )
                          }
                          placeholderOD="Enter notes for OD"
                          placeholderOS="Enter notes for OS"
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
    </div>
  );
};

export default Externals;
