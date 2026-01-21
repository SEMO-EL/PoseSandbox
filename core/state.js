// core/state.js
// Central mutable state for the PoseSandbox app (UI + runtime toggles).

export function createState() {
  const STATE = {
    mode: "rotate",
    axis: { x: true, y: true, z: true },
    snapDeg: 10,
    showGrid: true,
    showAxes: false,
    showOutline: true,
    perfEnabled: false
  };

  return STATE;
}

export function setMode(state, mode) {
  state.mode = mode;
  return state.mode;
}

export function toggleAxis(state, key) {
  state.axis[key] = !state.axis[key];
  return state.axis[key];
}

export function setSnapDeg(state, deg) {
  const n = Number(deg);
  state.snapDeg = Number.isFinite(n) ? n : state.snapDeg;
  return state.snapDeg;
}

export function setShowGrid(state, on) {
  state.showGrid = !!on;
  return state.showGrid;
}

export function setShowAxes(state, on) {
  state.showAxes = !!on;
  return state.showAxes;
}

export function setShowOutline(state, on) {
  state.showOutline = !!on;
  return state.showOutline;
}

export function setPerfEnabled(state, on) {
  state.perfEnabled = !!on;
  return state.perfEnabled;
}
