// src/hooks/useConsultationContext.js
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Returns the current consultation context:
 *  - appointmentId  → from the route (/consultation/:appointmentId)
 *  - versionId      → from Redux or query string (?version=...)
 */
export default function useConsultationContext() {
  // 🔹 Read appointment from URL path
  const { appointmentId } = useParams();

  // 🔹 Read version from query string
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const versionFromQuery = params.get("version");

  // 🔹 Also read version from Redux (persisted after ConsultButton)
  const versionFromRedux = useSelector(
    (state) => state.consultation?.versionId
  );

  // 🔹 Prefer Redux version if available, else fall back to query
  const versionId = versionFromRedux || versionFromQuery;

  return { appointmentId, versionId };
}
