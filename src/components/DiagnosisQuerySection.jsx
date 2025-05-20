import React from "react";

const DiagnosisQuerySection = ({ queries = [], onAdd, onRemove, onChange }) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium">Queries</label>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-indigo-600 hover:underline"
        >
          + Add Query
        </button>
      </div>

      {queries.map((q, index) => (
        <div key={index} className="flex gap-2 items-start mb-2">
          <textarea
            value={q.query}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-full border p-2 rounded-md"
            placeholder={`Query ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-sm text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default DiagnosisQuerySection;