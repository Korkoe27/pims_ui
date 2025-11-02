// src/utils/sessionUtils.js
/**
 * sessionUtils.js
 *
 * Utility functions for managing user session data,
 * including token storage and session cleanup.
 */

import { apiClient } from "../redux/api/api_client/apiClient";

export const clearSessionData = async (api) => {
  try {
    // 🌀 Lazy import to break circular dependency
    const { persistor } = await import("../redux/store/store");

    // Reset RTK Query cache
    api?.dispatch?.({ type: "RESET_APP_STATE" });
    api?.dispatch?.(apiClient.util.resetApiState());

    // Purge Redux Persist store
    await persistor.purge();

    // Remove tokens and consultation data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    Object.keys(localStorage)
      .filter((key) => key.startsWith("consultation-"))
      .forEach((key) => localStorage.removeItem(key));

    window.location.replace("/login");
  } catch (err) {
    console.warn("[Session Reset] Failed:", err);
    window.location.replace("/login");
  }
};