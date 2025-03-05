import React, { useState, useEffect } from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPatientId } from "../redux/slices/patientSlice";
import { useCreatePatientMutation } from "../redux/api/features/patientApi";
import SelectClinicModal from "../components/SelectClinicModal";
import ConfirmSaveModal from "./ConfirmSaveModal";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Redux dispatch for storing patient ID
  const selectedClinic = useSelector((state) => state.clinic.selectedClinic);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Selected Clinic from Redux:", selectedClinic);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    otherNames: "",
    dob: "",
    gender: "",
    clinic: selectedClinic || "",
    address: "",
    occupation: "",
    residence: "",
    region: "",
    landmark: "",
    hometown: "",
    primary_phone: "",
    alternate_phone: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    hospitalId: "",
    dateOfFirstVisit: "",
    healthInsuranceProvider: "",
    healthInsuranceNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [createPatient, { isLoading, error }] = useCreatePatientMutation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [retryWithConfirmSave, setRetryWithConfirmSave] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

  useEffect(() => {
    if (selectedClinic) {
      setFormData((prevData) => ({
        ...prevData,
        clinic: selectedClinic,
      }));
    }
  }, [selectedClinic]);

  useEffect(() => {
    if (!selectedClinic) {
      setIsModalOpen(true); // Open modal if no clinic is selected
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
      name === "emergency_contact_number"
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

  const [retryButtonType, setRetryButtonType] = useState(null); // ✅ Store button type

  const createPatientHandler = async (onSuccess, confirmSave = false) => {
    // Validation
    const validationErrors = {};
    if (!formData.first_name) validationErrors.first_name = "Required";
    if (!formData.last_name) validationErrors.last_name = "Required";
    if (!formData.dob) validationErrors.dob = "Required";
    if (!formData.gender) validationErrors.gender = "Required";
    if (!formData.primary_phone) validationErrors.primary_phone = "Required";
    if (!formData.emergency_contact_name)
      validationErrors.emergency_contact_name = "Required";
    if (!formData.emergency_contact_number)
      validationErrors.emergency_contact_number = "Required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      console.log("📡 Submitting patient data:", formData);

      // ✅ Create patient with optional confirm_save
      const response = await createPatient({
        ...formData,
        confirm_save: confirmSave ? true : undefined,
      }).unwrap();

      console.log("✅ Patient Created:", response);

      // ✅ Store patient ID in Redux
      dispatch(setPatientId(response.id));

      // ✅ Call the success function (redirects based on action)
      onSuccess(response);
    } catch (error) {
      console.error("❌ Error creating patient:", error);

      if (
        error.data?.primary_phone?.[0]?.includes(
          "Set 'confirm_save=True' to proceed."
        )
      ) {
        setConfirmMessage(
          "A patient with this phone number already exists. Click 'Proceed' to continue."
        );
        setShowConfirmModal(true);
        setRetryAction(() => () => createPatientHandler(onSuccess, true)); // ✅ Store retry action
      } else {
        setErrors(error.data || {});
      }
    }
  };

  // ✅ Retry function (only called when user confirms)
  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    retryAction && retryAction(); // ✅ Execute stored retry action
  };

  // ✅ Action Handlers
  const handleAttendPatient = () => {
    createPatientHandler((patient) => {
      navigate("/case-history", { state: { patient } });
    });
  };

  const handleScheduleAppointment = () => {
    createPatientHandler((patient) => {
      navigate("/book-appointment", { state: { patient } });
    });
  };

  return (
    <div className="px-72 bg-[#f9fafb] h-full w-full">
      {/* ✅ Show Modal When No Clinic is Selected */}
      {isModalOpen && <SelectClinicModal setIsModalOpen={setIsModalOpen} />}
      <div className="flex flex-col gap-4 px-8 my-6">
        <h1 className="text-2xl font-semibold">New Patient</h1>
        <p className="text-base">
          Fill out the following details of your new patient
        </p>
      </div>

      {selectedClinic && (
        <form className="px-8 w-fit">
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
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Enter Home Address"
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
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                placeholder="Contact Name"
                error={errors.emergency_contact_name}
              />
              <InputField
                label="Emergency Contact Phone"
                name="emergency_contact_number"
                value={formData.emergency_contact_number}
                onChange={handleChange}
                placeholder="0555555555"
                error={errors.emergency_contact_number}
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
              type="button"
              onClick={handleScheduleAppointment}
              className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]"
            >
              Schedule Appointment
            </button>
            <button
              type="button"
              onClick={handleAttendPatient}
              className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
            >
              Attend to Patient Now
            </button>
          </div>
        </form>
      )}
      {/* Confirmation Modal */}
      <ConfirmSaveModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        message={confirmMessage}
      />
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
