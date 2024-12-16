import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import NavMenu from "./NavMenu";
import Header from "./Header";
import Radios from "./Radios";
import CallToActionButtons from "./CallToActionButtons";
import { Toaster } from 'react-hot-toast';
import Inputs from "./Inputs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  createCaseHistoryHandler,
  updateCaseHistoryHandler,
  fetchCaseHistoryHandler,
  testCreateCaseHistoryHandler,
} from "../services/client/api-handlers/examinations-handler";
import Cookies from "js-cookie"; // Import js-cookie

const CaseHistory = ({}) => {
  const { appointmentId } = useParams(); // Retrieve appointmentId from URL
  const location = useLocation(); // Access state passed with navigate
  const { patient, appointment } = location.state || {}; // Extract patient and appointment

  const [formData, setFormData] = useState({
    appointment: "",
    chiefComplaint: "",
    lastEyeExamination: "",
    burningSensation: false,
    itching: false,
    tearing: false,
    doubleVision: false,
    discharge: false,
    pain: false,
    fbs: false,
    photophobia: false,
    asthma: false,
    ulcer: false,
    diabetes: false,
    hypertension: false,
    sickleCell: false,
    stdSti: false,
    parentDrugHistory: [],
    allergies: [],
    hobbies: [],
  });

  const [caseHistoryId, setCaseHistoryId] = useState(null); // To store the ID of the existing case history
  const navigate = useNavigate();

  useEffect(() => {
    if (appointmentId) {
      setFormData((prevData) => ({
        ...prevData,
        appointment: appointmentId, // Set the appointment ID
      }));
    }
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, appointment: appointmentId };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2)); // Log formData
      console.log("Headers sent to API:", {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      });

      if (caseHistoryId) {
        // Update existing case history
        await updateCaseHistoryHandler(appointmentId, payload);
        alert("Case history updated successfully!");
      } else {
        // Create a new case history
        await createCaseHistoryHandler(payload);
        alert("Case history created successfully!");
      }
      navigate("/visual-acuity");
    } catch (error) {
      console.error("Error submitting case history:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert("Failed to save case history. Please try again.");
    }
  };

  return (
    <div className="ml-72 my-8 gap-12 flex items flex-col px-8 h-fit w-fit">
      <Toaster />
      <Header patient={patient} />
      <ProgressBar />
      <NavMenu />
      <form onSubmit={handleSubmit} className="">
        <section className="flex gap-28">
          <aside className="flex flex-col gap-12">
            {/* Chief Complaint */}
            <div className="flex flex-col">
              <h1 className="text-base font-medium text-black">
                Chief Complaint <span className="text-[#ff0000]">*</span>
              </h1>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleChange}
                placeholder="Type in the patient’s chief complaint"
                className="p-4 border border-[#d0d5dd] resize-none rounded-md w-96 h-48"
              ></textarea>
            </div>

            {/* On Direct Questioning */}
            <>
              <h1 className="text-base font-medium text-black">
                On Direct Questioning <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Burning Sensation", name: "burningSensation" },
                  { label: "Itching", name: "itching" },
                  { label: "Tearing", name: "tearing" },
                  { label: "Double Vision", name: "doubleVision" },
                  { label: "Discharge", name: "discharge" },
                  { label: "Pain", name: "pain" },
                  { label: "FBS", name: "fbs" },
                  { label: "Photophobia", name: "photophobia" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    checked={formData[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>

            {/* Patient Medical History */}
            <>
              <h1 className="text-base font-medium text-black">
                Patient Medical History{" "}
                <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Asthma", name: "asthma" },
                  { label: "Ulcer", name: "ulcer" },
                  { label: "Diabetes", name: "diabetes" },
                  { label: "Hypertension", name: "hypertension" },
                  { label: "Sickle Cell", name: "sickleCell" },
                  { label: "STD/STI", name: "stdSti" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    checked={formData[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>
          </aside>

          <aside className="flex flex-col gap-12">
            {/* Patient Ocular History */}
            <>
              <h1 className="text-base font-medium text-black">
                Patient Ocular History <span className="text-[#ff0000]">*</span>
              </h1>
              <Inputs
                type="date"
                label="Last Eye Examination"
                name="lastEyeExamination"
                value={formData.lastEyeExamination}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Spectacles", name: "spectacles" },
                  { label: "Eye Surgery", name: "eyeSurgery" },
                  { label: "Ocular Trauma", name: "ocularTrauma" },
                  { label: "Glaucoma", name: "glaucoma" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    checked={formData[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>

            {/* Family Medical History */}
            <>
              <h1 className="text-base font-medium text-black">
                Family Medical History <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Asthma", name: "familyAsthma" },
                  { label: "Ulcer", name: "familyUlcer" },
                  { label: "Diabetes", name: "familyDiabetes" },
                  { label: "Hypertension", name: "familyHypertension" },
                  { label: "Sickle Cell", name: "familySickleCell" },
                  { label: "STD/STI", name: "familyStdSti" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    checked={formData[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>

            {/* Family Ocular History */}
            <>
              <h1 className="text-base font-medium text-black">
                Family Ocular History <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Spectacles", name: "familySpectacles" },
                  { label: "Eye Surgery", name: "familyEyeSurgery" },
                  { label: "Ocular Trauma", name: "familyOcularTrauma" },
                  { label: "Glaucoma", name: "familyGlaucoma" },
                ].map((field) => (
                  <Radios
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    checked={formData[field.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>

            {/* Text Inputs */}
            <>
              <Inputs
                type="text"
                label="Parent's Drug History"
                name="parentDrugHistory"
                value={formData.parentDrugHistory}
                onChange={handleChange}
              />
              <Inputs
                type="text"
                label="Patient’s Allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
              />
              <Inputs
                type="text"
                label="Patient’s Hobbies"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
              />
            </>
          </aside>
        </section>
        <div className="flex gap-8 justify-evenly my-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
          >
            Save and proceed
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseHistory;