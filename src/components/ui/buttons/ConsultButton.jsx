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

  if (!ConsultButton.shouldShow(access, appointment)) return null;

  const status = (appointment.status || "").toLowerCase();
  let label = "Start Consultation";

  // 🧩 Determine label based on status
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

  const handleConsult = async () => {
    try {
      // 🔹 Determine flow & version type based on access
      let versionType = "student";
      let flowType = "student_consulting";

      if (access?.canGradeStudents) {
        versionType = "reviewing";
        flowType = "reviewing";
      } else if (access?.canCompleteConsultations) {
        versionType = "direct";
        flowType = "professional_consulting";
      } else if (access?.canSubmitConsultations) {
        versionType = "student";
        flowType = "student_consulting";
      }

      console.log("🧭 Consultation flow decided:", { versionType, flowType, access });


      // 🔹 Call backend to start or fetch existing version
      const res = await startConsultation({
        appointmentId: appointment.id,
        versionType,
      }).unwrap();

      // 🔹 Update Redux state for consultation session
      dispatch(
        setCurrentConsultation({
          appointment: appointment.id,
          versionId: res.version_id || res.id,
          versionType: res.version_type || versionType,
          isFinal: res.is_final || false,
          flowType,
          permissions: {
            can_edit_exams: access?.canEditConsultations,
            can_submit_for_review: access?.canSubmitConsultations,
            can_grade: access?.canGradeStudents,
            can_complete: access?.canCompleteConsultations,
          },
        })
      );

      showToast("Consultation started successfully!", "success");

      // 🔹 Navigate to consultation workspace (Case History, etc.)
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

// 🧠 Decide visibility based on user access and appointment status
ConsultButton.shouldShow = (access, appointment = null) => {
  const status = (appointment?.status || "").toLowerCase();

  // Lecturer can see review button for review states
  if (
    access?.canGradeStudents &&
    ["submitted for review", "under review"].includes(status)
  ) {
    return true;
  }

  // Student or Clinician can start/continue consultation
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
