import React, { useState, useEffect } from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const selectedClinic = useSelector((state) => state.clinic.selectedClinic);

  console.log("Selected Clinic from Redux:", selectedClinic);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    otherNames: "",
    dob: "",
    gender: "",
    clinic: selectedClinic || "",
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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedClinic) {
      setFormData((prevData) => ({
        ...prevData,
        clinic: selectedClinic,
      }));
    }
  }, [selectedClinic]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Apply validation rules on change
    let error = "";
    if (
      name === "first_name" ||
      name === "last_name" ||
      name === "otherNames"
    ) {
      if (!/^[A-Za-z ]{1,20}$/.test(value)) {
        error = "Only letters, max 20 chars";
      }
    }

    if (
      name === "primary_phone" ||
      name === "alternate_phone" ||
      name === "emergencyContactPhone"
    ) {
      if (!/^\d{10}$/.test(value)) {
        error = "Enter a valid 10-digit number";
      }
    }

    if (name === "healthInsuranceNumber" && value.length > 20) {
      error = "Max 20 characters";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Required fields validation
    if (!formData.first_name) validationErrors.first_name = "Required";
    if (!formData.last_name) validationErrors.last_name = "Required";
    if (!formData.dob) validationErrors.dob = "Required";
    if (!formData.gender) validationErrors.gender = "Required";
    if (!formData.primary_phone) validationErrors.primary_phone = "Required";
    if (!formData.emergencyContactName)
      validationErrors.emergencyContactName = "Required";
    if (!formData.emergencyContactPhone)
      validationErrors.emergencyContactPhone = "Required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Submitting patient data:", formData);
      // API call logic
    }
  };

  const attendToPatient = () => {
    let validationErrors = {};

    // Required fields validation
    if (!formData.first_name) validationErrors.first_name = "Required";
    if (!formData.last_name) validationErrors.last_name = "Required";
    if (!formData.dob) validationErrors.dob = "Required";
    if (!formData.gender) validationErrors.gender = "Required";
    if (!formData.primary_phone) validationErrors.primary_phone = "Required";
    if (!/^\d{10}$/.test(formData.primary_phone))
      validationErrors.primary_phone = "Enter a valid 10-digit number";
    if (!formData.emergencyContactName)
      validationErrors.emergencyContactName = "Required";
    if (!formData.emergencyContactPhone)
      validationErrors.emergencyContactPhone = "Required";
    if (!/^\d{10}$/.test(formData.emergencyContactPhone))
      validationErrors.emergencyContactPhone = "Enter a valid 10-digit number";
    if (!formData.clinic) validationErrors.clinic = "Clinic selection required";

    setErrors(validationErrors);

    // 🚨 Prevent navigation if errors exist
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // ✅ Proceed if no validation errors
    navigate("/case-history");
  };

  return (
    <div className="px-72 bg-[#f9fafb] h-full w-full">
      <div className="flex flex-col gap-4 px-8 my-6">
        <h1 className="text-2xl font-semibold">New Patient</h1>
        <p className="text-base">
          Fill out the following details of your new patient
        </p>
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
              placeholder="Enter last name"
              error={errors.last_name}
            />
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              error={errors.first_name}
            />
            <InputField
              label="Other Names"
              name="otherNames"
              value={formData.otherNames}
              onChange={handleChange}
              placeholder="Enter other names"
              error={errors.otherNames}
            />
            <InputField
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
              error={errors.dob}
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-[#101928]">
                Gender
              </label>
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
              label="Occupation Category"
              name="occupation_category"
              value={formData.occupation_category}
              onChange={handleChange}
              options={[
                "Agriculture & Farming",
                "Automotive & Mechanical",
                "Business & Finance",
                "Construction & Manual Labor",
                "Creative & Artistic",
                "Education & Training",
                "Health & Medical Services",
                "Hospitality & Food Services",
                "IT & Technology",
                "Legal & Judicial",
                "Public Service & Administration",
                "Religious & Spiritual",
                "Retired & Not Working",
                "Technical & Engineering",
                "Miscellaneous & Others",
              ]}
            />

            <SelectField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              options={[
                "Agriculture & Farming",
                "Automotive & Mechanical",
                "Business & Finance",
                "Construction & Manual Labor",
                "Creative & Artistic",
                "Education & Training",
                "Health & Medical Services",
                "Hospitality & Food Services",
                "IT & Technology",
                "Legal & Judicial",
                "Public Service & Administration",
                "Religious & Spiritual",
                "Retired & Not Working",
                "Technical & Engineering",
                "Miscellaneous & Others",
              ]}
            />

            <InputField
              label="Residence"
              name="residence"
              value={formData.residence}
              onChange={handleChange}
              placeholder="Enter town/city"
            />
            <SelectField
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              options={["Greater Accra", "Ashanti", "Volta"]}
            />
            <InputField
              label="Landmark"
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
              placeholder="Enter hometown"
            />
          </aside>
        </section>

        {/* Section 2 */}
        <section className="flex gap-24 pt-16 border-t border-[#d9d9d9] justify-between">
          {/* Column 1 */}
          <aside className="flex flex-col gap-8">
            <InputField
              label="Primary Phone"
              name="primary_phone"
              value={formData.primary_phone}
              onChange={handleChange}
              placeholder="0555555555"
              error={errors.primary_phone}
              icon={<IoPhonePortraitOutline />}
            />
            <InputField
              label="Alternate Phone"
              name="alternate_phone"
              value={formData.alternate_phone}
              onChange={handleChange}
              placeholder="0555555555"
              error={errors.alternate_phone}
              icon={<IoPhonePortraitOutline />}
            />
            <InputField
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="Contact Name"
              error={errors.emergencyContactName}
            />
            <InputField
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              placeholder="0555555555"
              error={errors.emergencyContactPhone}
              icon={<IoPhonePortraitOutline />}
            />
          </aside>

          {/* Column 2 */}
          <aside className="flex flex-col gap-8">
            <InputField
              label="Hospital ID"
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              placeholder="Enter ID"
            />
            <InputField
              label="First Visit Date"
              name="dateOfFirstVisit"
              value={formData.dateOfFirstVisit}
              onChange={handleChange}
              type="date"
            />
            <SelectField
              label="Insurance Provider"
              name="healthInsuranceProvider"
              value={formData.healthInsuranceProvider}
              onChange={handleChange}
              options={["NHIS"]}
            />
            <InputField
              label="Insurance Number"
              name="healthInsuranceNumber"
              value={formData.healthInsuranceNumber}
              onChange={handleChange}
              placeholder="Enter number"
              error={errors.healthInsuranceNumber}
            />
          </aside>
        </section>

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
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  error,
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="text-[#101928]">
      {label}
    </label>
    <div
      className={`flex items-center gap-2 p-4 bg-white border h-14 rounded-lg ${
        error ? "border-red-500" : "border-[#d0d5dd]"
      }`}
    >
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
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="text-[#101928]">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`p-4 w-full border h-14 rounded-lg text-[#98a2b3] ${
        error ? "border-red-500" : "border-[#d0d5dd]"
      }`}
    >
      <option value="">Select an option</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const RadioField = ({ label, name, value, checked, onChange, error }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`${error ? "border-red-500" : "border-[#d0d5dd]"}`}
      />
      <label className="text-[#101928]">{label}</label>
    </div>
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);
