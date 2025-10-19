/**
 * =======================================================
 *   UNIVERSAL PERMISSION & ROLE UTILITIES
 *   (Frontend mirror of backend role/permission logic)
 * =======================================================
 */

/**
 * Check if user can edit a specific section
 * based on role, appointment status, and case type.
 */
export const canEditSection = (
  userRole,
  appointmentStatus,
  sectionType,
  isStudentCase = false
) => {
  if (!userRole) return false;

  // 🔹 Administrator can edit anything
  if (userRole.toLowerCase() === "administrator") return true;

  // 🔹 Student editing rules
  if (userRole.toLowerCase() === "student") {
    switch (appointmentStatus) {
      case "Consultation In Progress":
      case "Exams Recorded":
      case "Diagnosis Added":
      case "Management Created":
        return true; // can edit until submission
      case "Returned for Changes":
        return true;
      default:
        return false; // read-only after submission
    }
  }

  // 🔹 Lecturer editing rules
  if (userRole.toLowerCase() === "lecturer") {
    switch (appointmentStatus) {
      case "Under Review":
      case "Graded":
        return true; // can edit or adjust
      case "Submitted For Review":
        return isStudentCase; // only for student cases
      default:
        return false;
    }
  }

  // 🔹 Secretary — payment sections only
  if (userRole.toLowerCase() === "secretary") {
    return sectionType === "payment";
  }

  // 🔹 Pharmacy — medication/dispensing sections only
  if (userRole.toLowerCase() === "pharmacy") {
    return ["medication", "dispensing"].includes(sectionType);
  }

  return false;
};

/**
 * Check backward flow privileges (e.g., return, override)
 */
export const canPerformBackwardFlow = (userRole, appointmentStatus, action) => {
  if (!userRole) return false;

  if (userRole.toLowerCase() === "administrator") return true;

  if (userRole.toLowerCase() === "lecturer") {
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
 * Get available actions for a user based on role & status
 */
export const getAvailableActions = (
  userRole,
  appointmentStatus,
  isStudentCase = false
) => {
  const actions = [];
  if (!userRole) return actions;

  if (canEditSection(userRole, appointmentStatus, "view")) actions.push("view");

  if (userRole.toLowerCase() === "student") {
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

  if (userRole.toLowerCase() === "lecturer") {
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

  if (userRole.toLowerCase() === "administrator") {
    actions.push("edit", "override", "complete", "delete");
  }

  return actions;
};

/**
 * Check if appointment is ready for completion
 */
export const canCompleteAppointment = (
  userRole,
  appointmentStatus,
  isStudentCase = false
) => {
  if (!userRole) return false;

  if (userRole.toLowerCase() === "administrator") return true;

  if (userRole.toLowerCase() === "lecturer") {
    if (isStudentCase) return appointmentStatus === "Graded";
    return appointmentStatus === "Management Created";
  }

  return false;
};

/* =======================================================
 *  GENERAL PERMISSION UTILITIES (System-Level Checks)
 * =======================================================
 */

/**
 * Boolean access flags — e.g., user.access.canViewAppointments
 */
export const can = (user, key) => {
  if (!user || !user.access) return false;
  return Boolean(user.access[key]);
};

/**
 * Permission code lookup — matches backend codes
 * e.g., hasPermission(user, "appointments.create")
 */
export const hasPermission = (user, code) => {
  if (!user || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes(code);
};

/**
 * Combined check for flexibility
 */
export const isAuthorized = (user, accessKey, permissionCode) => {
  return can(user, accessKey) || hasPermission(user, permissionCode);
};
