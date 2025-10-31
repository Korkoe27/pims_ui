// src/components/Consultations/ConsultButton.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStartConsultationMutation } from "../../../redux/api/features/consultationsApi";
import { setCurrentConsultation } from "../../../redux/slices/consultationSlice";
import { showToast } from "../../ToasterHelper";

const ConsultButton = ({ appointment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((s) => s.auth?.user?.access || {});
  const [startConsultation, { isLoading }] = useStartConsultationMutation();

  // 🔹 Hide button if user doesn’t have permission
  if (!ConsultButton.shouldShow(access, appointment)) return null;

  const status = (appointment.status || "").toLowerCase();
  let label = "Start Consultation";

  // 🔹 Adjust label based on appointment status
  if (
    [
      "consultation in progress",
      "case history recorded",
      "visual acuity recorded",
      "examinations recorded",
      "diagnosis added",
      "management created",
      "case management guide created",
      "returned for changes",
    ].includes(status)
  ) {
    label = "Continue Consultation";
  } else if (status === "consultation completed") {
    label = "View Consultation";
  } else if (
    ["submitted for review", "under review"].includes(status) &&
    access?.canGradeStudents
  ) {
    label = "Review Case";
  }

  // 🔹 Start consultation handler
  const handleConsult = async () => {
    console.log("🟦 Starting consultation for:", appointment.id);
    try {
      // ✅ Determine version type (aligned with backend enums)
      let versionType = "student";
      let flowType = "student_consulting";

      if (access?.canGradeStudents) {
        versionType = "reviewed";
        flowType = "lecturer_reviewing";
      } else if (access?.canCompleteConsultations) {
        versionType = "professional";
        flowType = "professional_consulting";
      }

      console.log("🧭 Consultation flow decided:", { versionType, flowType });

      // 🔹 Call backend to start or fetch existing version
      const res = await startConsultation({
        appointmentId: appointment.id,
        versionType,
      }).unwrap();

      console.log("✅ Consultation started:", res);

      // 🔹 Update Redux state
      dispatch(
        setCurrentConsultation({
          appointment: appointment.id,
          versionId: res.version_id || res.id,
          versionType: res.version_type || versionType,
          isFinal: res.is_final || false,
          flowType,
        })
      );

      showToast("Consultation started successfully!", "success");

      // 🔹 Navigate to workspace
      navigate(`/consultation/${appointment.id}?version=${res.version_id || res.id}`);
    } catch (error) {
      console.error("❌ Consultation start failed:", error);
      showToast("Failed to start consultation", "error");
    }
  };

  return (
    <button
      onClick={handleConsult}
      disabled={isLoading}
      className="px-4 py-2 bg-[#2f3192] hover:bg-[#24267a] text-white rounded-lg font-medium transition-all disabled:opacity-60"
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
};

// 🔹 Visibility logic
ConsultButton.shouldShow = (access, appointment = {}) => {
  const status = (appointment.status || "").toLowerCase();

  // Lecturer: can review cases
  if (
    access?.canGradeStudents &&
    ["submitted for review", "under review"].includes(status)
  ) {
    return true;
  }

  // Student / Clinician: can start or continue consultation
  if (
    (access?.canStartConsultation || access?.canCompleteConsultations) &&
    ![
      "submitted for review",
      "under review",
      "scored",
      "consultation completed",
    ].includes(status)
  ) {
    return true;
  }

  return false;
};

export default ConsultButton;