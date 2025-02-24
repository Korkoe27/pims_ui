import React, { useState } from "react";

const CreateAppointment = () => {
  // Define appointment types and statuses
  const APPOINTMENT_TYPES = [
    { value: "New", label: "New" },
    { value: "Review", label: "Review" },
  ];

  const APPOINTMENT_STATUSES = [
    { value: "Scheduled", label: "Scheduled" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // State to manage form inputs
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_id: "",
    appointment_date: "",
    appointment_type: "",
    status: "",
    notes: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", formData);
    // Here, you can dispatch Redux action or send data to API
  };

  return (
    <div className="ml-72 my-8 px-8 w-[800px] flex flex-col bg-[#f9fafb] gap-12">
      <h1 className="font-semibold text-xl text-center">Schedule an Appointment</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Patient Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="patient_name" className="font-medium text-base">
              Patient Name
            </label>
            <input
              type="text"
              name="patient_name"
              id="patient_name"
              placeholder="Enter patient's full name"
              className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
              value={formData.patient_name}
              onChange={handleChange}
            />
          </div>

          {/* Patient ID */}
          <div className="flex flex-col gap-2">
            <label htmlFor="patient_id" className="font-medium text-base">
              Patient ID
            </label>
            <input
              type="text"
              name="patient_id"
              id="patient_id"
              placeholder="Enter patient's ID"
              className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
              value={formData.patient_id}
              onChange={handleChange}
            />
          </div>

          {/* Appointment Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="appointment_date" className="font-medium text-base">
              Appointment Date
            </label>
            <input
              type="date"
              name="appointment_date"
              id="appointment_date"
              className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
              value={formData.appointment_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Appointment Type Dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="appointment_type" className="font-medium text-base">
              Appointment Type
            </label>
            <select
              name="appointment_type"
              id="appointment_type"
              className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
              value={formData.appointment_type}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Appointment Type
              </option>
              {APPOINTMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Status Dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-medium text-base">
              Appointment Status
            </label>
            <select
              name="status"
              id="status"
              className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Appointment Status
              </option>
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes Field - Full Width */}
        <div className="col-span-2 flex flex-col gap-2">
          <label htmlFor="notes" className="font-medium text-base">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            placeholder="Add some notes about the patient"
            className="h-24 p-4 border resize-none w-full rounded-lg"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit Button - Centered */}
        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            className="w-56 p-4 rounded-lg text-white text-lg font-medium bg-[#2f3192]"
          >
            Set Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;
