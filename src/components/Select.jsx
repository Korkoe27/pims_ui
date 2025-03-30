import React from "react";
import PropTypes from "prop-types";

const Select = ({ label, name, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-base font-medium">{label}</h1>
      <select
        name={name}
        value={value}
        onChange={(e) => {
          const selectedOptions = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          onChange(selectedOptions);
        }}
        multiple
        className="p-3 border border-gray-300 rounded-md w-full"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

Select.defaultProps = {
  value: [],
};

export default Select;
