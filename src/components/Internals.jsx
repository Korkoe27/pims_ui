import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useInternalObservationData from "../hooks/useInternalObservationData";
import ConditionPicker from "./ConditionPicker";
import DeleteButton from "./DeleteButton";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";
import TextInput from "./TextInput";
import ConditionsDropdown from "./ConditionsDropdown";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import NavigationButtons from "../components/NavigationButtons";
import SupervisorGradingButton from "./SupervisorGradingButton";

const Internals = ({ setActiveTab, setTabCompletionStatus }) => {
  const { appointmentId } = useParams();
  const [formData, setFormData] = useState({});
  const [mainOpen, setMainOpen] = useState({});
  const [subOpen, setSubOpen] = useState({});

  const {
    loadingConditions,
    loadingInternals,
    conditions: rawConditions,
    existingObservations,
    createInternalObservation,
  } = useInternalObservationData(appointmentId);

  // 1. Group conditions
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

  // 2. Hydrate saved data
  useEffect(() => {
    if (loadingInternals || loadingConditions) return;
    if (!existingObservations || !rawConditions.length) return;

    // Flatten rawConditions into a list with group context
    const flatConditions = rawConditions.flatMap((main) =>
      main.subgroups.flatMap((sub) =>
        sub.conditions.map((c) => ({
          ...c,
          main: main.name,
          sub: sub.name,
        }))
      )
    );

    const map = {}; // final formData
    const mains = {}; // for auto-expansion
    const subs = {};

    existingObservations.forEach((obs) => {
      // obs.condition may be an ID or an object with id
      const conditionId =
        typeof obs.condition === "object" ? obs.condition.id : obs.condition;

      const matched = flatConditions.find((c) => c.id === conditionId);
      if (!matched) return;

      const { main, sub } = matched;

      if (!map[main]) {
        map[main] = {};
        mains[main] = true;
      }

      if (!map[main][sub]) {
        map[main][sub] = [];
        if (!subs[main]) subs[main] = {};
        subs[main][sub] = true;
      }

      // Check if condition already exists in the sub group
      let condition = map[main][sub].find((c) => c.id === matched.id);
      if (!condition) {
        condition = {
          id: matched.id,
          name: matched.name,
          has_text: matched.has_text,
          has_dropdown: matched.has_dropdown,
          has_grading: matched.has_grading,
          has_notes: matched.has_notes,
          dropdown_options: matched.dropdown_options || [],
          OD: {},
          OS: {},
          notes: "",
        };
        map[main][sub].push(condition);
      }

      if (obs.field_type === "notes") {
        condition.notes = obs.value;
      } else if (obs.affected_eye) {
        condition[obs.affected_eye] = {
          ...(condition[obs.affected_eye] || {}),
          [obs.field_type]: obs.value,
        };
      }
    });

    setFormData(map);
    setMainOpen(mains);
    setSubOpen(subs);
  }, [existingObservations, rawConditions]);

  // 3. UI toggles
  const toggleMain = (main) =>
    setMainOpen((prev) => ({ ...prev, [main]: !prev[main] }));

  const toggleSub = (main, sub) =>
    setSubOpen((prev) => ({
      ...prev,
      [main]: { ...prev[main], [sub]: !prev[main]?.[sub] },
    }));

  // 4. Handlers
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

  // 5. Save
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
      await createInternalObservation({
        appointment: appointmentId,
        observations: payload,
      }).unwrap();
      showToast("Internal Observations Saved", "success");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        internals: true,
      }));
      setActiveTab("refraction");
    } catch (err) {
      showToast(formatErrorMessage(err?.data), "error");
    }
  };

  // 6. Render
  if (loadingInternals || loadingConditions) {
    return <div className="p-6 text-gray-600">Loading observations...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Internal Observations</h1>
        <SupervisorGradingButton
          sectionLabel="Grading: Internals"
          averageMarks={existingObservations?.average_marks ?? null}
          // onSubmit={handleSubmitGrading(submitInternalGrading, appointmentId)}
        />
      </div>

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
                    {subOpen[main]?.[sub] ? <FaChevronUp /> : <FaChevronDown />}
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

      <NavigationButtons
        backLabel="← Back to External Observations"
        backTo="externals"
        onBack={setActiveTab}
        onSave={handleSave}
        saveLabel="Save and Proceed"
      />
    </div>
  );
};

export default Internals;
