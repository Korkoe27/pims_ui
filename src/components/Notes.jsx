import React, { useState } from "react";
import PropTypes from "prop-types";

const Notes = ({ condition }) => {
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-col border border-gray-300 rounded-md p-3 mt-2">
      <h2 className="text-sm font-medium">{condition}</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note..."
        className="p-2 border border-gray-200 rounded-md mt-2"
      ></textarea>
    </div>
  );
};

Notes.propTypes = {
  condition: PropTypes.string.isRequired,
};

export default Notes;
