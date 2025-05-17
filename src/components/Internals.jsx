import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useInternalObservationData from "../hooks/useInternalObservationData";
import ConditionPicker from "./ConditionPicker";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";

const Internals = ({ setActiveTab, setTabCompletionStatus }) => {
  const { appointmentId } = useParams();
  const [formData, setFormData] = useState({});
  const [mainOpen, setMainOpen] = useState({});
  const [subOpen, setSubOpen] = useState({});

  const {
    internals,
    loadingInternals,
    conditions: rawConditions,
    loadingConditions,
    createInternalObservation,
  } = useInternalObservationData(appointmentId);

  // 1. Group all conditions by main + sub
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

  // 2. Hydrate formData from existing internals
  useEffect(() => {
    if (!internals || !rawConditions.length) return;

    const flatConditions = rawConditions.flatMap((main) =>
      main.subgroups.flatMap((sub) =>
        sub.conditions.map((c) => ({
          ...c,
          main: main.name,
          sub: sub.name,
        }))
      )
    );

    const map = {};
    const mains = {};
    const subs = {};

    internals.forEach((obs) => {
      const matched = flatConditions.find((c) => c.id === obs.condition);
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

      let condition = map[main][sub].find((c) => c.id === obs.condition);
      if (!condition) {
        condition = {
          id: obs.condition,
          name: matched.name,
          has_grading: true,
          has_notes: true,
          OD: {},
          OS: {},
          notes: "",
        };
        map[main][sub].push(condition);
      }

      if (obs.notes) {
        condition[obs.affected_eye] = {
          ...(condition[obs.affected_eye] || {}),
          notes: obs.notes,
        };
      }
      if (obs.grading) {
        condition[obs.affected_eye] = {
          ...(condition[obs.affected_eye] || {}),
          grading: obs.grading,
        };
      }
    });

    setFormData(map);
    setMainOpen(mains);
    setSubOpen(subs);
  }, [internals, rawConditions]);

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
        has_grading: true,
        has_notes: true,
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

  // 5. Save logic
  const handleSave = async () => {
    const payload = [];

    Object.entries(formData).forEach(([main, subGroups]) => {
      Object.entries(subGroups).forEach(([sub, conditions]) => {
        conditions.forEach((item) => {
          ["OD", "OS"].forEach((eye) => {
            const data = item[eye] || {};
            if (data.notes?.trim() || data.grading?.trim()) {
              payload.push({
                condition: item.id,
                affected_eye: eye,
                grading: data.grading || "",
                notes: data.notes || "",
              });
            }
          });
        });
      });
    });

    try {
      await createInternalObservation({
        appointment: appointmentId,
        observations: payload,
      });
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

  if (loadingInternals || loadingConditions) {
    return <div className="p-6 text-gray-600">Loading observations...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Internal Observations</h1>

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
                                onClick={() =>
                                  handleDelete(main, sub, item.id)
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
                                        main,
                                        sub,
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
                                        main,
                                        sub,
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
                    </>
                  )}
                </div>
              );
            })}
        </div>
      ))}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setActiveTab("externals")}
          className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50"
        >
          ← Back to Externals
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 font-semibold text-white rounded-full bg-indigo-600 hover:bg-indigo-700"
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
};

export default Internals;
