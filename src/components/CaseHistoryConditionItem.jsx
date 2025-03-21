import React from "react";
import { Trash2, Pencil } from "lucide-react";
import GradeSelector from "./GradeSelector";
import AddNoteModal from "./NotesModal";

const EYE_OPTIONS = [
  { value: "OD", label: "Right Eye" },
  { value: "OS", label: "Left Eye" },
  { value: "OU", label: "Both Eyes" },
];

const CaseHistoryConditionItem = ({
  condition,
  type = "ocular",
  onUpdate,
  onDelete,
}) => {
  const [noteModalOpen, setNoteModalOpen] = React.useState(false);

  const handleChange = (key, value) => {
    onUpdate({ ...condition, [key]: value });
  };

  return (
    <div className="flex flex-col p-3 border rounded-md bg-gray-50 mt-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">{condition.name}</h2>
        <Trash2
          size={18}
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(condition.id)}
        />
      </div>

      {type === "ocular" && (
        <>
          <select
            value={condition.affected_eye || ""}
            onChange={(e) => handleChange("affected_eye", e.target.value)}
            className="w-full p-2 border rounded-md mt-2"
          >
            <option value="">Select Eye</option>
            {EYE_OPTIONS.map((eye) => (
              <option key={eye.value} value={eye.value}>
                {eye.label}
              </option>
            ))}
          </select>

          <GradeSelector
            selectedGrade={condition.grading || ""}
            onGradeChange={(grade) => handleChange("grading", grade)}
          />
        </>
      )}

      <button
        onClick={() => setNoteModalOpen(true)}
        className="text-blue-600 hover:underline mt-2 flex items-center"
      >
        <Pencil size={14} className="mr-1" /> Add a Note
      </button>

      <input
        type="text"
        className="w-full p-2 border rounded-md mt-2"
        value={condition.notes || ""}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Add notes"
      />

      <AddNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={(note) => handleChange("notes", note)}
      />
    </div>
  );
};

export default CaseHistoryConditionItem;
