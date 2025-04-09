import React, { useEffect, useState } from "react";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import Inputs from "./Inputs";
import { useNavigate } from "react-router-dom";
import useDiagnosisData from "../hooks/useDiagnosisData";

const Diagnosis = ({ appointmentId }) => {
  const navigate = useNavigate();

  const { appointmentDiagnosis, createDiagnosis, isCreatingDiagnosis } =
    useDiagnosisData(appointmentId);

  const [differentialDiagnosis, setDifferentialDiagnosis] = useState("");

  // Pre-fill if data is available
  useEffect(() => {
    if (appointmentDiagnosis) {
      setDifferentialDiagnosis(
        appointmentDiagnosis?.differential_diagnosis || ""
      );
    }
  }, [appointmentDiagnosis]);

  const handleSubmit = async () => {
    if (!differentialDiagnosis.trim()) {
      alert("Differential diagnosis cannot be empty.");
      return;
    }

    const payload = {
      appointment: appointmentId,
      differential_diagnosis: differentialDiagnosis,
      final_diagnosis: [], // You’ll update this next
      management_plan: "", // To be wired in later
    };

    try {
      await createDiagnosis(payload).unwrap();
      navigate("/management");
    } catch (error) {
      console.error("❌ Failed to save diagnosis:", error);
      alert("An error occurred while saving the diagnosis.");
    }
  };

  return (
    <main className="ml-72 my-8 px-8 w-fit flex flex-col gap-12">
      <Header />
      <ProgressBar step={2} />

      <form className="flex flex-col w-fit gap-8">
        {/* Differential Diagnosis */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="differentialDiagnosis"
            className="font-medium text-base"
          >
            Differential Diagnosis
          </label>
          <textarea
            name="differentialDiagnosis"
            placeholder="Type in your differential diagnosis"
            className="border w-[375px] border-[#d0d5dd] h-48 rounded-md p-4"
            value={differentialDiagnosis}
            onChange={(e) => setDifferentialDiagnosis(e.target.value)}
          />
        </div>

        {/* Final Diagnosis (placeholder for now) */}
        <div className="flex flex-col gap-1">
          <Inputs
            type="text"
            placeholder="Enter diagnosis"
            label="Final Diagnosis"
            name="finalDiagnosis"
          />
          <button
            type="button"
            className="bg-white w-fit gap-1 flex font-semibold text-base text-[#2f3192]"
          >
            <span className="w-5 h-5 font-bold">+</span>Add a query
          </button>
        </div>

        {/* Management Plan (placeholder for now) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="mgtPlan" className="font-medium text-base">
            Your Management Plan
          </label>
          <textarea
            name="mgtPlan"
            placeholder="Example: 
                            Dispense spectacles
                            OD: +2.00/-1.00x180
                            OS: +1.00/-1.25x180"
            className="w-[375px] h-48 border rounded-lg border-[#d0d5dd] p-4"
          ></textarea>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-[#2f3192] mx-auto mr-0 text-white p-4 w-fit rounded-lg h-14"
        >
          {isCreatingDiagnosis ? "Saving..." : "Proceed to Management"}
        </button>
      </form>
    </main>
  );
};

export default Diagnosis;
