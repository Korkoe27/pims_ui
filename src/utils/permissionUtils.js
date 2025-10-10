/**
 * Permission utilities based on the comprehensive API documentation
 * Supports role-based editing rules and backward flow mechanisms
 */

/**
 * Check if user can edit a specific section based on role and appointment status
 */
export const canEditSection = (
  userRole,
  appointmentStatus,
  sectionType,
  isStudentCase = false
) => {
  // Administrator can edit ANY time, ANY status
  if (userRole === "administrator") {
    return true;
  }

  // Student editing rules
  if (userRole === "student") {
    switch (appointmentStatus) {
      case "Consultation In Progress":
      case "Exams Recorded":
      case "Diagnosis Added":
      case "Management Created":
        return true; // Can edit until submission
      case "Submitted For Review":
      case "Under Review":
      case "Graded":
        return false; // Read-only after submission
      case "Returned for Changes":
        return true; // Can edit again if returned
      default:
        return false;
    }
  }

  // Lecturer editing rules
  if (userRole === "lecturer") {
    switch (appointmentStatus) {
      case "Under Review":
      case "Graded":
        return true; // Can edit during review phases + jump backward
      case "Submitted For Review":
        return isStudentCase; // Can edit student cases under review
      default:
        return false;
    }
  }

  // Secretary - limited to payment-related sections
  if (userRole === "secretary") {
    return sectionType === "payment";
  }

  // Pharmacy - limited to medication sections
  if (userRole === "pharmacy") {
    return sectionType === "medication" || sectionType === "dispensing";
  }

  return false;
};

/**
 * Check if user can perform backward flow actions
 */
export const canPerformBackwardFlow = (userRole, appointmentStatus, action) => {
  if (userRole === "administrator") return true;

  if (userRole === "lecturer") {
    switch (action) {
      case "return_for_changes":
        return ["Under Review", "Graded"].includes(appointmentStatus);
      case "lecturer_override":
        return ["Under Review", "Graded", "Submitted For Review"].includes(
          appointmentStatus
        );
      case "edit_during_review":
        return ["Under Review", "Graded"].includes(appointmentStatus);
      default:
        return false;
    }
  }

  return false;
};

/**
 * Get available actions based on role and status
 */
export const getAvailableActions = (
  userRole,
  appointmentStatus,
  isStudentCase = false
) => {
  const actions = [];

  // Common actions for all roles
  if (canEditSection(userRole, appointmentStatus, "view")) {
    actions.push("view");
  }

  // Role-specific actions
  if (userRole === "student") {
    if (
      [
        "Consultation In Progress",
        "Exams Recorded",
        "Diagnosis Added",
        "Management Created",
      ].includes(appointmentStatus)
    ) {
      actions.push("edit", "save_draft");
    }
    if (appointmentStatus === "Management Created") {
      actions.push("submit_for_review");
    }
  }

  if (userRole === "lecturer") {
    if (
      isStudentCase &&
      ["Submitted For Review", "Under Review"].includes(appointmentStatus)
    ) {
      actions.push("grade", "return_for_changes");
    }
    if (["Under Review", "Graded"].includes(appointmentStatus)) {
      actions.push("edit", "lecturer_override", "complete");
    }
  }

  if (userRole === "administrator") {
    actions.push("edit", "override", "complete", "delete");
  }

  return actions;
};

/**
 * Check if appointment status allows completion
 */
export const canCompleteAppointment = (
  userRole,
  appointmentStatus,
  isStudentCase = false
) => {
  if (userRole === "administrator") return true;

  if (userRole === "lecturer") {
    if (isStudentCase) {
      return appointmentStatus === "Graded"; // Student cases must be graded first
    } else {
      return appointmentStatus === "Management Created"; // Lecturer cases need management
    }
  }

  return false;
};
