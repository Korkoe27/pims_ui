import isEqual from "lodash.isequal";

/**
 * Compares two objects deeply.
 * Returns true if they are different, false if they are equal.
 * @param {Object} initialData - The initial object (fetched from backend).
 * @param {Object} currentPayload - The object to compare with (form state).
 * @param {Object} [options] - Optional flags (debug logging).
 * @returns {boolean}
 */
export function hasFormChanged(initialData, currentPayload, options = {}) {
  const { debug = false } = options;

  const changed = !isEqual(initialData, currentPayload);

  if (debug) {
    console.log("🔍 Comparing data:");
    console.log("📦 Initial:", initialData);
    console.log("🆕 Current:", currentPayload);
    console.log(changed ? "❗ Change detected" : "✅ No changes");
  }

  return changed;
}
