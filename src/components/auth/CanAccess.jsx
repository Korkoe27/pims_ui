// CanAccess.jsx
import React from "react";
import { useSelector } from "react-redux";

const toLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");
const toArray = (v) => (Array.isArray(v) ? v : v != null ? [v] : []);

export default function CanAccess({
  allow,          // string | string[] | undefined
  children,
  fallback = null // what to render if not allowed
}) {
  // Safely get current user's role
  const rawRole = useSelector((s) => s.auth?.user?.role);
  const role = toLower(rawRole);

  // Normalize allowed roles
  const allowed = toArray(allow)
    .filter(Boolean)
    .map(toLower);

  // Rules:
  // - if no allow given -> deny by default (change to allow all if you prefer)
  // - if "all" included -> allow everyone
  // - else check membership
  const can =
    allowed.length === 0
      ? false
      : allowed.includes("all") || allowed.includes(role);

  return can ? <>{children}</> : fallback;
}
