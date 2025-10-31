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

  if (!ConsultButton.shouldShow(access, appointment)) return null;

  const status = (appointment.status || "").toLowerCase();
  const isLocked = appointment.is_locked;
  const lockedBy = appointment.locked_by_name || "";
  const lockedByMe = appointment.locked_by_me || false; // ✅ add this line

  let label = "Start Consultation";
  let disabled = false;
  let tooltip = "";

  // 🔹 Adjust label & state based on conditions
  if (isLocked) {
    if (lockedByMe) {
      label = "Consultation in Progress";
      tooltip = "You already have this consultation locked.";
    } else {
      label = `Locked by ${lockedBy}`;
      tooltip = "This consultation is currently in progress by another user.";
    }
    disabled = true;
  } else if (
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
    return null; // hide completely when done
  } else if (
    ["submitted for review", "under review"].includes(status) &&
    access?.canGradeStudents
  ) {
    label = "Review Case";
  }

  // 🔹 Start consultation handler
  const handleConsult = async () => {
    try {
      let versionType = "student";
      let flowType = "student_consulting";

      if (access?.canGradeStudents) {
        versionType = "reviewed";
        flowType = "lecturer_reviewing";
      } else if (access?.canCompleteConsultations) {
        versionType = "professional";
        flowType = "professional_consulting";
      }

      const res = await startConsultation({
        appointmentId: appointment.id,
        versionType,
      }).unwrap();

      dispatch(
        setCurrentConsultation({
          appointment: appointment.id,
          versionId: res.version?.id || res.id,
          versionType: res.version?.version_type || versionType,
          isFinal: res.version?.is_final || false,
          flowType,
        })
      );

      showToast("Consultation started successfully!", "success");
      navigate(`/consultation/${appointment.id}?version=${res.version?.id || res.id}`);
    } catch (error) {
      const msg =
        error?.data?.detail ||
        "Consultation is locked by another user or failed to start.";
      showToast(msg, "error");
    }
  };

  return (
    <button
      onClick={handleConsult}
      disabled={isLoading || disabled}
      title={tooltip}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        disabled
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-[#2f3192] hover:bg-[#24267a] text-white"
      }`}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
};

// 🔹 Visibility logic
ConsultButton.shouldShow = (access, appointment = {}) => {
  const status = (appointment.status || "").toLowerCase();

  // Lecturer can review
  if (access?.canGradeStudents && ["submitted for review", "under review"].includes(status)) {
    return true;
  }

  // Student / Clinician can start or continue
  if (
    (access?.canStartConsultation || access?.canCompleteConsultations) &&
    !["submitted for review", "under review", "scored", "consultation completed"].includes(status)
  ) {
    return true;
  }

  return false;
};

export default ConsultButton;
