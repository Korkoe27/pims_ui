import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentConsultation } from "../redux/slices/consultationSlice";
import { showToast } from "../components/ToasterHelper";
import { baseURL } from "../redux/api/base_url/baseurl";

/**
 * useInitiateReview Hook
 * 
 * Handles the complete review initiation flow:
 * 1. POST /consultations/versions/{version_id}/initiate-review/
 * 2. Handle 200 OK (review already exists) and 201 CREATED (review just created)
 * 3. Extract review version ID and navigate to review editor
 * 4. Display appropriate messages based on response status
 * 
 * @param {string} appointmentId - The appointment ID
 * @returns {Object} { initiateReview, isLoading, error }
 */
const useInitiateReview = (appointmentId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initiateReview = useCallback(
    async (studentVersionId) => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from localStorage (matching apiClient pattern)
        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        if (!studentVersionId) {
          throw new Error("Student version ID is required");
        }

        // Construct full API URL using baseURL
        const apiUrl = `${baseURL}consultations/versions/${studentVersionId}/initiate-review/`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // 400 Bad Request - validation error
          const errorMessage =
            data.detail ||
            "Failed to initiate review. Please try again.";
          setError(errorMessage);
          showToast(errorMessage, "error");
          throw new Error(errorMessage);
        }

        // Handle successful response (200 OK or 201 CREATED)
        const reviewVersion = data.version;
        const isNewReview = response.status === 201;
        const recordsCloned = data.version?.diff_snapshot?.records_cloned;

        // Show appropriate toast message
        if (isNewReview) {
          const message = recordsCloned
            ? `Review created successfully with ${recordsCloned} records cloned`
            : "Review created successfully";
          showToast(message, "success");
        } else {
          showToast("Review already exists. Navigating...", "info");
        }

        // Dispatch to Redux
        dispatch(
          setCurrentConsultation({
            id: reviewVersion.id,
            versionId: reviewVersion.id,
            version_type: reviewVersion.version_type || "review",
            is_final: reviewVersion.is_final || false,
            flowType: "lecturer_reviewing",
            appointmentId,
          })
        );

        // Navigate to review editor
        navigate(`/consultation/${appointmentId}?version=${reviewVersion.id}`);

        return {
          success: true,
          version: reviewVersion,
          isNewReview,
          recordsCloned,
        };
      } catch (err) {
        console.error("❌ Error initiating review:", err);
        const errorMsg = err.message || "Failed to initiate review";
        setError(errorMsg);
        showToast(errorMsg, "error");
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate, appointmentId]
  );

  return {
    initiateReview,
    isLoading,
    error,
  };
};

export default useInitiateReview;
