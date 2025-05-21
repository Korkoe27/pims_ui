import React from "react";
import SearchableInput from "./SearchableInput";  // NEW ✅
import TextInput from "./TextInput";
import DropdownSelect from "./DropdownSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";

const FIELD_COMPONENTS = {
  searchable_select: SearchableInput,   // ✅ NEW: input field (not dropdown)
  text: TextInput,
  dropdown: DropdownSelect,
  grading: GradingSelect,
  notes: NotesTextArea,
};

const DynamicFieldRenderer = ({ fieldMeta, value, onChange, eye }) => {
  const { field_type, options = [], placeholder } = fieldMeta;

  const Component = FIELD_COMPONENTS[field_type];

  if (!Component) {
    return (
      <div className="text-red-500 text-sm">
        Unsupported field type: {field_type}
      </div>
    );
  }

  return (
    <Component
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder || `Enter value for ${eye}`}
    />
  );
};

export default DynamicFieldRenderer;
