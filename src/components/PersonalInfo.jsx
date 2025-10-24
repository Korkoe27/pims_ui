import React, { useState, useEffect } from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPatientId } from "../redux/slices/patientSlice";
import { useCreatePatientMutation } from "../redux/api/features/patientApi";
import SelectClinicModal from "../components/SelectClinicModal";
import ConfirmSaveModal from "./ConfirmSaveModal";
import { showToast } from "../components/ToasterHelper";
import AddPatientFormButton from "../components/ui/buttons/AddPatientFormButton";
import ScheduleAppointmentButton from "../components/ui/buttons/ScheduleAppointmentButton";


const PersonalInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedClinic = useSelector((state) => state.clinic.selectedClinic);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    otherNames: "",
    dob: "",
    gender: "",
    clinic: selectedClinic || "",
    occupation_category: "",
    occupation: "",
    address: "",
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
  const [createPatient] = useCreatePatientMutation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [retryAction, setRetryAction] = useState(null);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    if (selectedClinic) {
      setFormData((prev) => ({ ...prev, clinic: selectedClinic }));
    }
  }, [selectedClinic]);

  useEffect(() => {
    if (!selectedClinic) setIsModalOpen(true);
  }, [selectedClinic]);

  /* -------------------- Handlers -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (["first_name", "last_name", "otherNames"].includes(name)) {
      if (!/^[A-Za-z ]{1,20}$/.test(value)) error = "Only letters, max 20 chars";
    }
    if (
      ["primary_phone", "alternate_phone", "emergency_contact_number"].includes(name)
    ) {
      if (!/^(02|05)\d{8}$/.test(value)) {
        error = "Must start with 02** or 05** and be 10 digits";
      }
    }
    if (name === "healthInsuranceNumber" && value.length > 20) {
      error = "Max 20 characters";
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const createPatientHandler = async (onSuccess, confirmSave = false) => {
    const required = [
      "first_name",
      "last_name",
      "occupation",
      "occupation_category",
      "dob",
      "gender",
      "clinic",
      "address",
      "landmark",
      "hometown",
      "region",
      "primary_phone",
      "emergency_contact_name",
      "emergency_contact_number",
    ];

    const validationErrors = {};
    required.forEach((field) => {
      if (!formData[field]) validationErrors[field] = "Required";
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      showToast("Creating patient...", "info");
      const response = await createPatient({
        ...formData,
        confirm_save: confirmSave ? true : undefined,
      }).unwrap();

      dispatch(setPatientId(response.id));
      showToast("✅ Patient created successfully.", "success");
      onSuccess(response);
    } catch (error) {
      console.error("❌ Error creating patient:", error);

      if (
        error.data?.primary_phone?.[0]?.includes(
          "Set 'confirm_save=True' to proceed."
        )
      ) {
        setConfirmMessage(
          "A patient with this phone number already exists. Click “Proceed” to continue."
        );
        setShowConfirmModal(true);
        setRetryAction(() => () => createPatientHandler(onSuccess, true));
      } else {
        setErrors(error.data || {});
        setGeneralError(
          error.data?.detail ||
            error.data?.non_field_errors?.[0] ||
            "An unexpected error occurred."
        );
        showToast("❌ Failed to create patient.", "error");
      }
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    retryAction && retryAction();
  };

  const handleAddPatient = () =>
    createPatientHandler((patient) => {
      showToast(`✅ Added ${patient.first_name} ${patient.last_name}`, "success");
      navigate("/my-patients");
    });

  const handleScheduleAppointment = () =>
    createPatientHandler((patient) => {
      showToast("Opening appointment scheduling...", "info");
      navigate("/createAppointment", { state: { patient } });
    });

  /* -------------------- Render -------------------- */
  return (
    <div className="px-72 bg-[#f9fafb] h-full w-full">
      {isModalOpen && <SelectClinicModal setIsModalOpen={setIsModalOpen} />}

      <div className="flex flex-col gap-4 px-8 my-6">
        <h1 className="text-2xl font-semibold">New Patient</h1>
        <p className="text-base">Fill out the following details of your new patient</p>
      </div>

      {selectedClinic && (
        <form className="px-8 w-fit">
          {generalError && (
            <div className="mb-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded">
              {generalError}
            </div>
          )}

          {/* ---------- Section 1 ---------- */}
          <section className="flex gap-24 pb-16 justify-between">
            <aside className="flex flex-col gap-8">
              <InputField
                label="Surname"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
              <InputField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
              />
              <InputField
                label="Other Names"
                name="otherNames"
                value={formData.otherNames}
                onChange={handleChange}
                error={errors.otherNames}
              />
              <InputField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="text-[#101928]">
                  Gender <span className="text-red-500">*</span>
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
                {errors.gender && (
                  <span className="text-red-500 text-sm">{errors.gender}</span>
                )}
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
                error={errors.occupation_category}
              />
              <InputField
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                error={errors.occupation}
              />
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <InputField
                label="Residence"
                name="residence"
                value={formData.residence}
                onChange={handleChange}
              />
              <SelectField
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                options={[
                  "Ahafo",
                  "Ashanti",
                  "Bono",
                  "Bono East",
                  "Central",
                  "Eastern",
                  "Greater Accra",
                  "North East",
                  "Northern",
                  "Oti",
                  "Savannah",
                  "Upper East",
                  "Upper West",
                  "Volta",
                  "Western",
                  "Western North",
                ]}
                error={errors.region}
              />
              <InputField
                label="Landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                error={errors.landmark}
              />
              <InputField
                label="Hometown"
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                error={errors.hometown}
              />
            </aside>
          </section>

          {/* ---------- Section 2 ---------- */}
          <section className="flex gap-24 pt-16 border-t border-[#d9d9d9] justify-between">
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
                icon={<IoPhonePortraitOutline />}
              />
              <InputField
                label="Emergency Contact Name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                error={errors.emergency_contact_name}
              />
              <InputField
                label="Emergency Contact Phone"
                name="emergency_contact_number"
                value={formData.emergency_contact_number}
                onChange={handleChange}
                error={errors.emergency_contact_number}
                icon={<IoPhonePortraitOutline />}
              />
            </aside>

            <aside className="flex flex-col gap-8">
              <InputField
                label="Hospital ID"
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleChange}
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
                options={["NHIS", "Private"]}
              />
              <InputField
                label="Insurance Number"
                name="healthInsuranceNumber"
                value={formData.healthInsuranceNumber}
                onChange={handleChange}
              />
            </aside>
          </section>

          {/* ---------- Actions ---------- */}
          <div className="flex gap-8 justify-center my-16">
            <AddPatientFormButton onClick={handleAddPatient} />
            <ScheduleAppointmentButton onClick={handleScheduleAppointment} />
          </div>
        </form>
      )}

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

/* ------------ Utility Inputs ------------ */
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
      {label}{" "}
      {[
        "first_name",
        "last_name",
        "occupation",
        "dob",
        "gender",
        "clinic",
        "address",
        "landmark",
        "hometown",
        "region",
        "primary_phone",
        "emergency_contact_name",
        "emergency_contact_number",
      ].includes(name) && <span className="text-red-500">*</span>}
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
      {label}{" "}
      {["region", "clinic", "occupation_category"].includes(name) && (
        <span className="text-red-500">*</span>
      )}
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

const RadioField = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="border-[#d0d5dd]"
    />
    <span className="text-[#101928]">{label}</span>
  </label>
);
