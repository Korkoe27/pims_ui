import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStartConsultationMutation } from "../../../redux/api/features/consultationsApi";
import { setCurrentConsultation } from "../../../redux/slices/consultationSlice";
import { showToast } from "../../ToasterHelper";
import { store } from "../../../redux/store/store";

const ConsultButton = ({ appointment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const access = useSelector((s) => s.auth?.user?.access || {});
  const [startConsultation, { isLoading }] = useStartConsultationMutation();

  if (!ConsultButton.shouldShow(access, appointment)) return null;

  // 🔹 Extract status & lock info
  const status = (appointment.status || "").toLowerCase();
  const isLocked = appointment.is_locked;
  const lockedBy = appointment.locked_by_name || "";
  const lockedByMe = appointment.locked_by_me || false;

  let label = "Start Consultation";
  let disabled = false;
  let tooltip = "";

  // 🔹 Determine button state based on status and lock
  if (isLocked) {
    if (lockedByMe) {
      label = "Continue Consultation";
      tooltip = "You have this consultation in progress.";
      disabled = false;
    } else {
      label = "Consultation in Progress";
      tooltip = `Consultation done by ${lockedBy || "another user"}.`;
      disabled = true;
    }
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
    return null; // hide button
  } else if (
    ["submitted for review", "under review"].includes(status) &&
    access?.canGradeStudents
  ) {
    label = "Review Case";
  }

  // 🔹 Handle click
  const handleConsult = async () => {
    try {
      // ✅ Case 1: Consultation already locked by me (resume existing)
      if (isLocked && lockedByMe) {
        const reduxVersionId = store.getState()?.consultation?.versionId;
        const versionId =
          reduxVersionId || appointment.latest_version_id || null;

        if (!versionId) {
          showToast("No active version found to resume.", "warning");
          return;
        }

        navigate(`/consultation/${appointment.id}?version=${versionId}`);
        return;
      }

      // ✅ Case 2: Starting new consultation
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

      // ✅ Dispatch to Redux for persistence
      dispatch(
        setCurrentConsultation({
          appointment: appointment.id,
          versionId: res.id, // ✅ backend returns "id"
          versionType: res.version_type || versionType,
          isFinal: res.is_final || false,
          flowType,
        })
      );

      // ✅ Navigate to consultation flow
      navigate(`/consultation/${appointment.id}?version=${res.id}`);
      showToast("Consultation started successfully!", "success");
    } catch (error) {
      console.error("❌ Failed to start consultation:", error);
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
  if (
    access?.canGradeStudents &&
    ["submitted for review", "under review"].includes(status)
  ) {
    return true;
  }

  // Student or clinician can start / continue
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
