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
  const [formData, setFormData] = useState({});
  const [mainOpen, setMainOpen] = useState({});
  const [subOpen, setSubOpen] = useState({});

  const {
    loadingConditions,
    conditions: rawConditions,
    existingObservations,
    createExternalObservation,
  } = useExternalObservationData(appointmentId);

  const groupedConditions = (rawConditions || []).reduce((acc, main) => {
    acc[main.name] = main.subgroups.reduce((subAcc, subgroup) => {
      subAcc[subgroup.name] = subgroup.conditions.map((c) => ({
        ...c,
        OD: {},
        OS: {},
        notes: "",
      }));
      return subAcc;
    }, {});
    return acc;
  }, {});

  const toggleMain = (main) =>
    setMainOpen((prev) => ({ ...prev, [main]: !prev[main] }));

  const toggleSub = (main, sub) =>
    setSubOpen((prev) => ({
      ...prev,
      [main]: { ...prev[main], [sub]: !prev[main]?.[sub] },
    }));

  const handleSelect = (main, sub, selected) => {
    setFormData((prev) => {
      const existing = prev[main]?.[sub] || [];
      if (existing.some((c) => c.id === selected.id)) return prev;

      const updated = {
        ...selected,
        OD: {},
        OS: {},
        notes: "",
      };

      return {
        ...prev,
        [main]: {
          ...prev[main],
          [sub]: [...existing, updated],
        },
      };
    });
  };

  const handleDelete = (main, sub, id) => {
    setFormData((prev) => ({
      ...prev,
      [main]: {
        ...prev[main],
        [sub]: prev[main][sub].filter((c) => c.id !== id),
      },
    }));
  };

  const handleFieldChange = (main, sub, id, eye, type, val) => {
    setFormData((prev) => ({
      ...prev,
      [main]: {
        ...prev[main],
        [sub]: prev[main][sub].map((item) =>
          item.id === id
            ? {
                ...item,
                [eye]: { ...(item[eye] || {}), [type]: val },
              }
            : item
        ),
      },
    }));
  };

  const handleNotesChange = (main, sub, id, val) => {
    setFormData((prev) => ({
      ...prev,
      [main]: {
        ...prev[main],
        [sub]: prev[main][sub].map((item) =>
          item.id === id ? { ...item, notes: val } : item
        ),
      },
    }));
  };

  const handleSave = async () => {
    const payload = [];

    Object.entries(formData).forEach(([main, subGroups]) => {
      Object.entries(subGroups).forEach(([sub, conditions]) => {
        conditions.forEach((item) => {
          if (item.notes?.trim()) {
            payload.push({
              condition: item.id,
              field_type: "notes",
              value: item.notes,
              affected_eye: null,
            });
          }
          ["OD", "OS"].forEach((eye) => {
            const data = item[eye] || {};
            Object.entries(data).forEach(([type, val]) => {
              if (val?.toString().trim()) {
                payload.push({
                  condition: item.id,
                  affected_eye: eye,
                  field_type: type,
                  value: val,
                });
              }
            });
          });
        });
      });
    });

    try {
      await createExternalObservation({
        appointment: appointmentId,
        observations: payload,
      });
      showToast("External Observations Saved", "success");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        externals: true,
      }));
      setActiveTab("internal");
    } catch (err) {
      showToast(formatErrorMessage(err?.data), "error");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">External Observations</h1>

      {Object.entries(groupedConditions).map(([main, subGroups]) => (
        <div key={main} className="mb-6 border rounded">
          <button
            onClick={() => toggleMain(main)}
            className="w-full text-left px-4 py-2 font-semibold bg-gray-100 flex justify-between items-center"
          >
            <span>{main}</span>
            {mainOpen[main] ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {mainOpen[main] &&
            Object.entries(subGroups).map(([sub, options]) => {
              const selected = formData[main]?.[sub] || [];
              return (
                <div key={sub} className="border-t px-4 py-4">
                  <button
                    onClick={() => toggleSub(main, sub)}
                    className="w-full text-left font-medium mb-2 flex justify-between items-center"
                  >
                    <span>{sub}</span>
                    {subOpen[main]?.[sub] ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>

                  {subOpen[main]?.[sub] && (
                    <>
                      <ConditionPicker
                        options={options.map((c) => ({
                          value: c.id,
                          label: c.name,
                          ...c,
                        }))}
                        selectedValues={selected.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        onSelect={(opt) =>
                          handleSelect(main, sub, {
                            id: opt.value,
                            name: opt.label,
                            has_text: opt.has_text,
                            has_dropdown: opt.has_dropdown,
                            has_grading: opt.has_grading,
                            has_notes: opt.has_notes,
                            dropdown_options: opt.dropdown_options || [],
                          })
                        }
                        conditionKey="value"
                        conditionNameKey="label"
                      />

                      <div className="space-y-4 mt-4">
                        {selected.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border rounded bg-gray-50 space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold">{item.name}</h4>
                              <DeleteButton
                                onClick={() => handleDelete(main, sub, item.id)}
                              />
                            </div>

                            {item.has_text && (
                              <TextInput
                                valueOD={item.OD?.text || ""}
                                valueOS={item.OS?.text || ""}
                                onChangeOD={(val) =>
                                  handleFieldChange(
                                    main,
                                    sub,
                                    item.id,
                                    "OD",
                                    "text",
                                    val
                                  )
                                }
                                onChangeOS={(val) =>
                                  handleFieldChange(
                                    main,
                                    sub,
                                    item.id,
                                    "OS",
                                    "text",
                                    val
                                  )
                                }
                              />
                            )}

                            {item.has_dropdown && (
                              <ConditionsDropdown
                                valueOD={item.OD?.dropdown || ""}
                                valueOS={item.OS?.dropdown || ""}
                                options={item.dropdown_options || []}
                                onChangeOD={(val) =>
                                  handleFieldChange(
                                    main,
                                    sub,
                                    item.id,
                                    "OD",
                                    "dropdown",
                                    val
                                  )
                                }
                                onChangeOS={(val) =>
                                  handleFieldChange(
                                    main,
                                    sub,
                                    item.id,
                                    "OS",
                                    "dropdown",
                                    val
                                  )
                                }
                              />
                            )}

                            {item.has_grading && (
                              <GradingSelect
                                valueOD={item.OD?.grading || ""}
                                valueOS={item.OS?.grading || ""}
                                onChangeOD={(val) =>
                                  handleFieldChange(
                                    main,
                                    sub,
                                    item.id,
                                    "OD",
                                    "grading",
                                    val
                                  )
                                }
                                onChangeOS={(val) =>
                                  handleFieldChange(
                                    main,
                                    sub,
                                    item.id,
                                    "OS",
                                    "grading",
                                    val
                                  )
                                }
                              />
                            )}

                            {item.has_notes && (
                              <NotesTextArea
                                value={item.notes || ""}
                                onChange={(val) =>
                                  handleNotesChange(main, sub, item.id, val)
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      ))}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setActiveTab("case history")}
          className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-colors duration-200"
        >
          ← Back to Case History
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700"
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
};

export default Externals;
