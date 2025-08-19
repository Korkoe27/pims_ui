// src/utils/errors.js
export function toMessageList(input) {
  if (Array.isArray(input)) return input.map(String);
  if (input && typeof input === "object") {
    const parts = [];
    for (const [k, v] of Object.entries(input)) {
      if (Array.isArray(v)) v.forEach((msg) => parts.push(`${k.toUpperCase()}: ${String(msg)}`));
      else if (v && typeof v === "object") parts.push(`${k.toUpperCase()}: ${JSON.stringify(v)}`);
      else parts.push(`${k.toUpperCase()}: ${String(v)}`);
    }
    return parts;
  }
  return [String(input ?? "Unknown error")];
}
export function toMessageString(input, sep = ", ") {
  return toMessageList(input).join(sep);
}
