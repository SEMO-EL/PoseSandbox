// core/helpers.js
// Small, dependency-free helpers used across the app.
// Keep this file pure (no Three.js imports, no side-effects).

/* ----------------------------- Type helpers ----------------------------- */

export function isObject(v) {
  return v !== null && typeof v === "object";
}

export function isFunction(v) {
  return typeof v === "function";
}

export function noop() {}

export function assert(condition, message = "Assertion failed") {
  if (!condition) throw new Error(String(message));
}

/* ----------------------------- Math helpers ----------------------------- */

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function degToRad(d) {
  return (Number(d) * Math.PI) / 180;
}

export function radToDeg(r) {
  return (Number(r) * 180) / Math.PI;
}

/* ----------------------------- Time helpers ----------------------------- */

export function nowISO() {
  return new Date().toISOString();
}

export function niceTime(iso) {
  // cheap readable timestamp (no libs)
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

/* ----------------------------- ID helpers ------------------------------ */

export function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/* ----------------------------- JSON helpers ---------------------------- */

export function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export function safeJsonStringify(value, fallback = "null") {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

/* ----------------------------- Storage helpers ------------------------- */

export function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return safeJsonParse(raw, fallback);
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ----------------------------- DOM helpers ----------------------------- */

export function $(id) {
  return document.getElementById(id);
}

export function toggleClass(el, className, on) {
  if (!el) return;
  el.classList.toggle(className, !!on);
}

/**
 * Creates a toast function bound to a DOM element.
 * Usage:
 *   const toast = makeToast(document.getElementById("toast"));
 *   toast("Hello");
 */
export function makeToast(toastEl) {
  let t = 0;

  return function toast(msg, ms = 1400) {
    if (!toastEl) return;
    toastEl.textContent = String(msg ?? "");
    toastEl.classList.add("show");
    window.clearTimeout(t);
    t = window.setTimeout(() => toastEl.classList.remove("show"), ms);
  };
}

/* ----------------------------- Misc helpers ---------------------------- */

export function pick(obj, keys) {
  const out = {};
  if (!isObject(obj) || !Array.isArray(keys)) return out;
  for (const k of keys) {
    if (k in obj) out[k] = obj[k];
  }
  return out;
}

export function shallowCopy(obj) {
  if (!isObject(obj)) return obj;
  return Array.isArray(obj) ? obj.slice() : { ...obj };
}
