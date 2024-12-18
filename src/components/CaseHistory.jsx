import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import NavMenu from "./NavMenu";
import Header from "./Header";
import Radios from "./Radios";
import Inputs from "./Inputs";
import { Toaster } from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  createCaseHistoryHandler,
  updateCaseHistoryHandler,
  fetchCaseHistoryHandler,
} from "../services/client/api-handlers/examinations-handler";
import { fetchAppointmentsDetails } from "../services/client/api-handlers/appointments-handler";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const CaseHistory = () => {
  const { appointmentId } = useParams();
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const location = useLocation();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(
    location.state?.appointment || null
  );
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [isLoading, setIsLoading] = useState(!appointment || !patient);
  const [step, setStep] = useState(1); // For progress tracking

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
    spectacles: false,
    eyeSurgery: false,
    ocularTrauma: false,
    glaucoma: false,
    familyAsthma: false,
    familyUlcer: false,
    familyDiabetes: false,
    familyHypertension: false,
    familySickleCell: false,
    familyStdSti: false,
    familySpectacles: false,
    familyEyeSurgery: false,
    familyOcularTrauma: false,
    familyGlaucoma: false,
    parentDrugHistory: [],
    allergies: [],
    hobbies: [],
  });

  const [caseHistoryId, setCaseHistoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Appointment & Patient Details
        if (!appointment || !patient) {
          const response = await fetchAppointmentsDetails(appointmentId);
          setAppointment(response);
          setPatient(response.patient);
        }

        // Fetch Existing Case History
        const caseHistoryResponse = await fetchCaseHistoryHandler(
          appointmentId
        );
        if (caseHistoryResponse) {
          setCaseHistoryId(caseHistoryResponse.id); // Store the ID
          setFormData({
            ...caseHistoryResponse, // Prepopulate form with fetched data
            appointment: appointmentId,
          });
        }
      } catch (error) {
        console.error("Error fetching case history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, appointment: appointmentId };

      if (caseHistoryId) {
        await updateCaseHistoryHandler(appointmentId, payload);
        alert("Case history updated successfully!");
      } else {
        await createCaseHistoryHandler(payload);
        alert("Case history created successfully!");
      }
      handleNextStep();
      if (step === 3) navigate("/visual-acuity");
    } catch (error) {
      console.error("Error submitting case history:", error);
      alert("Failed to save case history. Please try again.");
    }
  };

  return (
    <div className="ml-72 my-8 gap-12 flex flex-col px-8 h-fit w-fit">
      <Toaster />
      <Header patient={patient} />
      <ProgressBar step={step} />
      <NavMenu appointmentId={appointmentId} />
      <form onSubmit={handleSubmit} className="">
        <section className="flex gap-28">
          {step === 1 && (
            <aside className="flex flex-col gap-12">
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
            </aside>
          )}

          {step === 2 && (
            <aside className="flex flex-col gap-12">
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
            </aside>
          )}

          {step === 3 && (
            <aside className="flex flex-col gap-12">
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
            </aside>
          )}
        </section>

        <div className="flex gap-8 justify-evenly my-16">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]"
            disabled={step === 1}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
          >
            {step === 3 ? "Save and proceed" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseHistory;
