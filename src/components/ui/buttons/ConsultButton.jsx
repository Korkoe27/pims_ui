// src/components/Consultations/ConsultButton.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStartConsultationMutation } from "../../../redux/api/features/consultationsApi";
import { setCurrentConsultation } from "../../../redux/slices/consultationSlice";
import { showToast } from "../../ToasterHelper";
import { store } from "../../../redux/store/store"; // ✅ added for version lookup when continuing

const ConsultButton = ({ appointment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const roleCodes = user?.role_codes || [];
  const [startConsultation, { isLoading }] = useStartConsultationMutation();

  if (!ConsultButton.shouldShow(roleCodes, appointment)) return null;

  const status = (appointment.status || "").toLowerCase();
  const isLocked = appointment.is_locked;
  const lockedBy = appointment.locked_by_name || "";
  const lockedByMe = appointment.locked_by_me || false;

  let label = "Start Consultation";
  let disabled = false;
  let tooltip = "";

  // 🔹 Handle locked cases
  if (isLocked) {
    if (lockedByMe) {
      label = "Continue Consultation";
      tooltip = "You have this consultation in progress.";
      disabled = false; // ✅ active for owner
    } else {
      label = "Locked by " + (lockedBy || "Another User");
      tooltip = `This consultation is currently being worked on by ${lockedBy || "another user"}.`;
      disabled = true; // ❌ disabled for others
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
    tooltip = "Resume this consultation";
  } else if (status === "consultation completed") {
    return null; // hide completely when done
  } else if (["submitted for review", "under review"].includes(status)) {
    return null; // 🔹 ReviewButton handles review flow, not ConsultButton
  } else {
    tooltip = "Start a new consultation";
  }

  // 🔹 Start or continue consultation handler
  const handleConsult = async () => {
    try {
      console.log("🔹 handleConsult called");
      console.log("🔹 isLocked:", isLocked, "lockedByMe:", lockedByMe);

      // ✅ Case 1: Already locked by me → continue with versionId from Redux or appointment
      if (isLocked && lockedByMe) {
        console.log("🔹 Case 1: Already locked by me");
        let versionId = store.getState()?.consultation?.versionId;
        
        // If not in Redux, get from appointment's latest_version_id
        if (!versionId && appointment?.latest_version_id) {
          versionId = appointment.latest_version_id;
          console.log("🔹 Using versionId from appointment:", versionId);
        }
        
        const targetUrl = versionId
          ? `/consultation/${appointment.id}?version=${versionId}`
          : `/consultation/${appointment.id}`;
        console.log("🔹 Navigating to:", targetUrl);
        navigate(targetUrl);
        return;
      }

      // ✅ Case 2: Starting or resuming consultation
      console.log("🔹 Case 2: Starting new consultation");
      let versionType = "student";
      let flowType = "student_consulting";

      if (roleCodes.includes("supervisor")) {
        versionType = "reviewed";
        flowType = "lecturer_reviewing";
      } else if (roleCodes.includes("clinician")) {
        versionType = "professional";
        flowType = "professional_consulting";
      }

      console.log("🔹 versionType:", versionType, "flowType:", flowType);

      const res = await startConsultation({
        appointmentId: appointment.id,
        versionType,
      }).unwrap();

      console.log("🔹 startConsultation response:", res);

      // ✅ Dispatch to Redux for persistence
      dispatch(
        setCurrentConsultation({
          appointment: appointment.id,
          versionId: res.version?.id || res.id,
          versionType: res.version?.version_type || versionType,
          isFinal: res.version?.is_final || false,
          flowType,
        })
      );

      // ✅ Navigate with version query
      const versionParam = res.version?.id || res.id;
      console.log("🔹 Navigating with versionParam:", versionParam);
      navigate(`/consultation/${appointment.id}?version=${versionParam}`);

      showToast("Consultation started successfully!", "success");
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
          ? "bg-gray-300 cursor-not-allowed text-gray-500 opacity-60"
          : "bg-[#2f3192] hover:bg-[#24267a] text-white"
      }`}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
};

// 🔹 Visibility logic
ConsultButton.shouldShow = (roleCodes, appointment = {}) => {
  const status = (appointment.status || "").toLowerCase();

  // 🔹 ReviewButton handles review flow (lecturer review)
  // Don't show ConsultButton when appointment is submitted/under review
  if (["submitted for review", "under review"].includes(status)) {
    return false;
  }

  // Student / Clinician can start or continue
  const canConsult = roleCodes.some((code) => ["student", "clinician", "supervisor"].includes(code));
  if (
    canConsult &&
    !["scored", "consultation completed"].includes(status)
  ) {
    return true;
  }

  return false;
};

export default ConsultButton;
