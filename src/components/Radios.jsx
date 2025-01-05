export default function Radios({ label, name, value, onChange }) {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="font-medium text-[14px] text-[#101928]">
          {label}
        </label>
        <div className="flex gap-4">
          <label htmlFor="" className="flex gap-2">
            <input
              type="radio"
              name={name}
              value="yes"
              checked={value === "yes"} // Check if value is "yes"
              onChange={onChange} // Trigger the passed onChange function
              className=""
              id=""
            />
            Yes
          </label>
          <label htmlFor="" className="flex gap-2">
            <input
              type="radio"
              name={name}
              value="no"
              checked={value === "no"} // Check if value is "no"
              onChange={onChange} // Trigger the passed onChange function
              id=""
            />
            No
          </label>
        </div>
      </div>
    );
  }
  