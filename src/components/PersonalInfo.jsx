import React, { useState } from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    otherNames: "",
    dob: "",
    gender: "",
    clinic: "selectedClinic", // Replace with actual value if needed
    occupation: "",
    residence: "",
    region: "",
    landmark: "",
    hometown: "",
    primary_phone: "",
    alternate_phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    hospitalId: "",
    dateOfFirstVisit: "",
    healthInsuranceProvider: "",
    healthInsuranceNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Logic to submit form data
  };

  const attendToPatient = () => {
    navigate("/case-history");
  };

  return (
    <div className="px-72 bg-[#f9fafb] h-full w-full">
      <div className="flex flex-col gap-4 px-8 my-6">
        <h1 className="text-2xl font-semibold">New Patient</h1>
        <p className="text-base">Fill out the following details of your new patient</p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 w-fit">
        {/* Section 1 */}
        <section className="flex gap-24 pb-16 justify-between">
          {/* Column 1 */}
          <aside className="flex flex-col gap-8">
            <InputField
              label="Surname"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter the last name of the patient"
            />
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter the first name of the patient"
            />
            <InputField
              label="Other Names"
              name="otherNames"
              value={formData.otherNames}
              onChange={handleChange}
              placeholder="Enter the other names of the patient"
            />
            <InputField
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-[#101928]">Gender</label>
              <div className="flex gap-4">
                <RadioField
                  label="Male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                />
                <RadioField
                  label="Female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />
              </div>
            </div>
          </aside>

          {/* Column 2 */}
          <aside className="flex flex-col gap-8">
            <SelectField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              options={["Teacher", "Engineer", "Doctor", "Other"]}
            />
            <InputField
              label="Place of Residence"
              name="residence"
              value={formData.residence}
              onChange={handleChange}
              placeholder="Enter the patient’s town/city name"
            />
            <SelectField
              label="Region of Residence"
              name="region"
              value={formData.region}
              onChange={handleChange}
              options={["Region 1", "Region 2", "Region 3"]}
            />
            <InputField
              label="Closest Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Closest Landmark"
            />
            <InputField
              label="Hometown"
              name="hometown"
              value={formData.hometown}
              onChange={handleChange}
              placeholder="Enter the patient’s hometown name"
            />
          </aside>
        </section>

        {/* Section 2 */}
        <section className="flex gap-24 pt-16 border-t border-[#d9d9d9] justify-between">
          {/* Column 1 */}
          <aside className="flex flex-col gap-8">
            <InputField
              label="Primary Telephone Number"
              name="primary_phone"
              value={formData.primary_phone}
              onChange={handleChange}
              placeholder="055 555 5555"
              icon={<IoPhonePortraitOutline className="text-[#98a2b3]" />}
            />
            <InputField
              label="Alternate Telephone Number"
              name="alternate_phone"
              value={formData.alternate_phone}
              onChange={handleChange}
              placeholder="055 555 5555"
              icon={<IoPhonePortraitOutline className="text-[#98a2b3]" />}
            />
            <InputField
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="Enter the name of the emergency contact"
            />
            <InputField
              label="Emergency Contact’s Phone Number"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              placeholder="055 555 5555"
              icon={<IoPhonePortraitOutline className="text-[#98a2b3]" />}
            />
          </aside>

          {/* Column 2 */}
          <aside className="flex flex-col gap-8">
            <InputField
              label="Hospital ID"
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              placeholder="Enter the patient’s hospital ID"
            />
            <InputField
              label="Date of First Visit"
              name="dateOfFirstVisit"
              value={formData.dateOfFirstVisit}
              onChange={handleChange}
              type="date"
            />
            <SelectField
              label="Health Insurance Provider"
              name="healthInsuranceProvider"
              value={formData.healthInsuranceProvider}
              onChange={handleChange}
              options={["Provider 1", "Provider 2", "Provider 3"]}
            />
            <InputField
              label="Health Insurance Number"
              name="healthInsuranceNumber"
              value={formData.healthInsuranceNumber}
              onChange={handleChange}
              placeholder="Health Insurance Number"
            />
          </aside>
        </section>

        {/* Buttons */}
        <div className="flex gap-8 justify-center my-16">
          <button
            type="submit"
            className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]"
          >
            Schedule Appointment
          </button>
          <button
            type="button"
            onClick={attendToPatient}
            className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
          >
            Attend to Patient Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;

// Utility Components for Input, Select, and Radio Fields
const InputField = ({ label, name, value, onChange, type = "text", placeholder, icon }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="text-[#101928]">{label}</label>
    <div className="flex items-center gap-2 p-4 bg-white border border-[#d0d5dd] h-14 rounded-lg">
      {icon}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="outline-none w-full"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="text-[#101928]">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="p-4 w-full border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3]"
    >
      <option value="">Select an option</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const RadioField = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-1">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);
