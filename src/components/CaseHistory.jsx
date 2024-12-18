import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCaseHistory,
  saveCaseHistory,
} from "../redux/slices/caseHistorySlice";
import ProgressBar from "./ProgressBar";
import NavMenu from "./NavMenu";
import Header from "./Header";
import Radios from "./Radios";
import Inputs from "./Inputs";

const CaseHistory = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: caseHistory, loading } = useSelector(
    (state) => state.caseHistory
  );

  const [formData, setFormData] = useState({
    appointment: appointmentId,
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

  useEffect(() => {
    dispatch(fetchCaseHistory(appointmentId));
  }, [dispatch, appointmentId]);

  useEffect(() => {
    if (caseHistory) {
      setFormData(caseHistory);
    }
  }, [caseHistory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(saveCaseHistory({ appointmentId, data: formData }));
    navigate(`/visual-acuity/${appointmentId}`);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="ml-72 my-8 gap-12 flex flex-col px-8 h-fit w-fit">
      <Header patient={caseHistory?.patient} />
      <ProgressBar step={1} />
      <NavMenu appointmentId={appointmentId} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                {["burningSensation", "itching", "tearing", "doubleVision", "discharge", "pain", "fbs", "photophobia"].map((field) => (
                  <Radios
                    key={field}
                    label={field.replace(/([A-Z])/g, " $1")}
                    name={field}
                    checked={formData[field]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>

            {/* Patient Medical History */}
            <>
              <h1 className="text-base font-medium text-black">
                Patient Medical History <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {["asthma", "ulcer", "diabetes", "hypertension", "sickleCell", "stdSti"].map((field) => (
                  <Radios
                    key={field}
                    label={field.replace(/([A-Z])/g, " $1")}
                    name={field}
                    checked={formData[field]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>
          </aside>

          <aside className="flex flex-col gap-12">
            {/* Family Medical History */}
            <>
              <h1 className="text-base font-medium text-black">
                Family Medical History <span className="text-[#ff0000]">*</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                {["familyAsthma", "familyUlcer", "familyDiabetes", "familyHypertension", "familySickleCell", "familyStdSti"].map(
                  (field) => (
                    <Radios
                      key={field}
                      label={field.replace(/([A-Z])/g, " $1")}
                      name={field}
                      checked={formData[field]}
                      onChange={handleChange}
                    />
                  )
                )}
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
