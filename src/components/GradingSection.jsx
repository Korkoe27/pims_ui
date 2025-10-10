import React from "react";
import { useSelector } from "react-redux";
import { useGetAppointmentDetailsQuery } from "../redux/api/features/appointmentsApi";
import SupervisorGradingButton from "./SupervisorGradingButton";

/**
 * Higher-order component that renders a grading button for a specific section
 * if the user is a supervisor and the appointment is completed and is a student case
 */
const GradingSection = ({
  appointmentId,
  section,
  sectionLabel,
  children,
  showConditions = true,
}) => {
  const { role } = useSelector((state) => state.auth.user || {});
  const { data: appointment } = useGetAppointmentDetailsQuery(appointmentId, {
    skip: !appointmentId,
  });

  const shouldShowGrading =
    showConditions &&
    appointment?.is_student_case &&
    role === "lecturer";

  return (
    <>
      {shouldShowGrading && (
        <div className="flex justify-end mb-4">
          <SupervisorGradingButton
            appointmentId={appointmentId}
            section={section}
            sectionLabel={sectionLabel}
          />
        </div>
      )}
      {children}
    </>
  );
};

export default GradingSection;
