// components/ConditionPickerGroup.jsx
import React from "react";
import ConditionPicker from "./ConditionPicker";
import DeleteButton from "./DeleteButton";
import TextInput from "./TextInput";
import ConditionsDropdown from "./ConditionsDropdown";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";

const ConditionPickerGroup = ({
  title,
  required = false,
  options,
  selectedItems,
  setSelectedItems,
}) => {
  // Internal: handle selection
  const handleSelect = (option) => {
    const alreadyExists = selectedItems.some((item) => item.id === option.id);
    if (!alreadyExists) {
      setSelectedItems((prev) => [
        ...prev,
        {
          ...option,
          OD: option.OD || { text: "", dropdown: "", grading: "", notes: "" },
          OS: option.OS || { text: "", dropdown: "", grading: "", notes: "" },
        },
      ]);
    }
  };

  // Internal: handle delete
  const handleDelete = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Internal: handle OD/OS field change
  const handleFieldChange = (id, eye, field, value) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [eye]: {
              ...(item[eye] || {}),
              [field]: value,
            },
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="mb-6">
      <ConditionPicker
        label={
          <span>
            {title} {required && <span className="text-red-500">*</span>}
          </span>
        }
        options={options}
        selectedValues={selectedItems.map((c) => ({
          id: c.id,
          name: c.name,
        }))}
        onSelect={handleSelect}
        conditionKey="id"
        conditionNameKey="name"
      />

      {selectedItems.length > 0 && (
        <div className="mt-4 space-y-4">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 border rounded space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{item.name}</h4>
                <DeleteButton onClick={() => handleDelete(item.id)} />
              </div>

              {/* Text Input */}
              {item.has_text && (
                <TextInput
                  valueOD={item.OD?.text || ""}
                  valueOS={item.OS?.text || ""}
                  onChangeOD={(val) =>
                    handleFieldChange(item.id, "OD", "text", val)
                  }
                  onChangeOS={(val) =>
                    handleFieldChange(item.id, "OS", "text", val)
                  }
                  placeholderOD="Enter text for OD"
                  placeholderOS="Enter text for OS"
                />
              )}

              {/* Dropdown */}
              {item.has_dropdown && (
                <ConditionsDropdown
                  valueOD={item.OD?.dropdown || ""}
                  valueOS={item.OS?.dropdown || ""}
                  options={item.dropdown_options}
                  onChangeOD={(val) =>
                    handleFieldChange(item.id, "OD", "dropdown", val)
                  }
                  onChangeOS={(val) =>
                    handleFieldChange(item.id, "OS", "dropdown", val)
                  }
                />
              )}

              {/* Grading */}
              {item.has_grading && (
                <GradingSelect
                  valueOD={item.OD?.grading || ""}
                  valueOS={item.OS?.grading || ""}
                  onChangeOD={(val) =>
                    handleFieldChange(item.id, "OD", "grading", val)
                  }
                  onChangeOS={(val) =>
                    handleFieldChange(item.id, "OS", "grading", val)
                  }
                />
              )}

              {/* Notes */}
              {item.has_notes && (
                <NotesTextArea
                  valueOD={item.OD?.notes || ""}
                  valueOS={item.OS?.notes || ""}
                  onChangeOD={(val) =>
                    handleFieldChange(item.id, "OD", "notes", val)
                  }
                  onChangeOS={(val) =>
                    handleFieldChange(item.id, "OS", "notes", val)
                  }
                  placeholderOD="Notes for OD"
                  placeholderOS="Notes for OS"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionPickerGroup;
