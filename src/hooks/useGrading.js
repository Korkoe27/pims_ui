// hooks/useGrading.js
import {
  useCreateGradingMutation,
  useUpdateSectionGradingMutation,
  useUpdateFinalGradingMutation,
  useGetGradingQuery,
} from "../redux/api/features/gradingApi";
import { showToast } from "../components/ToasterHelper";

export default function useGrading(
  appointmentId,
  section = null,
  isFinal = false
) {
  const [createGrading] = useCreateGradingMutation();
  const [updateSectionGrading] = useUpdateSectionGradingMutation();
  const [updateFinalGrading] = useUpdateFinalGradingMutation();

  // fetch all grading for the appointment
  const { data: gradingData, isLoading } = useGetGradingQuery(
    appointmentId, // Just the ID, not wrapped in an object
    { skip: !appointmentId }
  );

  // filter down to section-specific grading if section is given
  const existingGrading = isFinal
    ? gradingData?.final
    : gradingData?.find((g) => g.section === section);

  // unified submit handler
  const submitGrading = async ({ score, remarks }) => {
    try {
      if (existingGrading) {
        if (isFinal) {
          await updateFinalGrading({ appointmentId, score, remarks }).unwrap();
        } else {
          await updateSectionGrading({
            appointmentId,
            section,
            score,
            remarks,
          }).unwrap();
        }
        showToast("Grading updated successfully!", "success");
      } else {
        await createGrading({
          appointmentId,
          body: { section_type: section, score, remarks },
        }).unwrap();
        showToast("Grading submitted successfully!", "success");
      }
    } catch (error) {
      console.error("❌ Error submitting grading:", error);
      showToast("Failed to submit grading.", "error");
    }
  };

  return {
    gradingData,
    existingGrading,
    isLoading,
    submitGrading,
  };
}
