import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import useExternalObservationData from "../hooks/useExternalObservationData";

const ExternalsView = ({ appointmentId }) => {
  const [dropdowns, setDropdowns] = useState({});
  const {
    externals,
    loadingExternals,
    conditions,
    loadingConditions,
    conditionsError,
  } = useExternalObservationData(appointmentId);

  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    if (!externals || !conditions || conditions.length === 0) return;

    const grouped = {};

    externals.forEach((obs) => {
      const condition = conditions.find((c) => c.id === obs.condition);
      if (!condition) return;

      const groupName = condition.group_name;
      if (!grouped[groupName]) grouped[groupName] = {};

      if (!grouped[groupName][condition.name]) {
        grouped[groupName][condition.name] = {
          OD: null,
          OS: null,
        };
      }

      grouped[groupName][condition.name][obs.affected_eye] = {
        grading: obs.grading,
        notes: obs.notes,
      };
    });

    setGroupedData(grouped);
  }, [externals, conditions]);

  const toggleDropdown = (group) => {
    setDropdowns((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  if (loadingExternals || loadingConditions) {
    return <p className="text-gray-500">Loading externals...</p>;
  }

  if (conditionsError || !externals?.length) {
    return <p className="text-red-500">No external observations found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-h-[80vh] overflow-y-auto space-y-6">
      <h2 className="text-xl font-bold text-[#2f3192]">External Observations</h2>

      {Object.entries(groupedData).map(([group, conditions]) => (
        <div key={group} className="border rounded shadow-sm">
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-100 flex justify-between items-center text-left font-semibold"
            onClick={() => toggleDropdown(group)}
          >
            <span>{group}</span>
            {dropdowns[group] ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {dropdowns[group] && (
            <div className="p-4 space-y-4">
              {Object.entries(conditions).map(([name, detail]) => (
                <div key={name} className="p-4 bg-gray-50 border rounded">
                  <h4 className="font-semibold text-gray-700 mb-2">{name}</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {["OD", "OS"].map((eye) => (
                      <div key={eye}>
                        <p className="font-medium text-gray-600">
                          {eye} ({eye === "OD" ? "Right Eye" : "Left Eye"})
                        </p>
                        {detail[eye] ? (
                          <ul className="list-disc list-inside ml-2">
                            <li>
                              <strong>Grading:</strong> {detail[eye].grading}
                            </li>
                            {detail[eye].notes && (
                              <li>
                                <strong>Notes:</strong> {detail[eye].notes}
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-400 italic">No entry</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExternalsView;
