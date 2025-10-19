/**
 * =======================================================
 *  ACCESS-BASED PERMISSION UTILITIES
 *  (Frontend mirror of backend boolean access flags)
 * =======================================================
 */

/**
 * Safe lookup for a single access key
 * Example: can(user, "canViewAppointments")
 */
export const can = (user, key) => {
  if (!user || !user.access) return false;
  return Boolean(user.access[key]);
};

/**
 * Combined check for convenience (if you ever add permissions[])
 * For now, just uses access; keeps API consistent.
 */
export const isAuthorized = (user, accessKey) => can(user, accessKey);
