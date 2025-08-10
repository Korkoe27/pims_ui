// CanAccess.jsx
import React from "react";
import { useSelector } from "react-redux";

const toLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");
const toArray = (v) => (Array.isArray(v) ? v : v != null ? [v] : []);

export default function CanAccess({ allowedRoles, children, fallback = null }) {
  // Normalize the user's role from Redux
  const rawRole = useSelector((s) => s.auth?.user?.role);
  const role = toLower(rawRole);

  // Normalize allowed roles
  const allowed = toArray(allowedRoles).filter(Boolean).map(toLower);

  // Allow if "all" is present or user role is in list
  const can = allowed.includes("all") || allowed.includes(role);

  return can ? <>{children}</> : fallback;
}
