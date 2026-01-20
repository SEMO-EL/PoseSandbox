// controls/modes.js
// Owns: mode switching (rotate/move/orbit/scale), axis locks, rotate snap.
// Does NOT duplicate other files. Designed to be used by Engine/App glue.

export class ModesController {
  /**
   * @param {{
   *  // UI elements
   *  modeRotateBtn: HTMLElement,
   *  modeMoveBtn: HTMLElement,
   *  modeOrbitBtn: HTMLElement,
   *  modeScaleBtn?: HTMLElement|null,
   *  axisXBtn: HTMLElement,
   *  axisYBtn: HTMLElement,
   *  axisZBtn: HTMLElement,
   *  rotateSnapSelect: HTMLSelectElement,
   *
   *  // three controls
   *  orbit: any, // OrbitControls instance
   *  gizmo: any, // TransformControls instance
   *
   *  // optional hooks
   *  toast?: (msg:string, ms?:number)=>void
   * }} opts
   */
  constructor(opts) {
    this.ui = {
      modeRotate: opts.modeRotateBtn,
      modeMove: opts.modeMoveBtn,
      modeOrbit: opts.modeOrbitBtn,
      modeScale: opts.modeScaleBtn || null,
      axisX: opts.axisXBtn,
      axisY: opts.axisYBtn,
      axisZ: opts.axisZBtn,
      rotateSnap: opts.rotateSnapSelect
    };

    this.orbit = opts.orbit;
    this.gizmo = opts.gizmo;
    this.toast = typeof opts.toast === "function" ? opts.toast : null;

    this.state = {
      mode: "rotate", // "rotate" | "move" | "orbit" | "scale"
      axis: { x: true, y: true, z: true },
      snapDeg: 10
    };

    this._bindUI();
    this.applyState();
  }

  setMode(mode) {
    if (mode !== "rotate" && mode !== "move" && mode !== "orbit" && mode !== "scale") return;
    this.state.mode = mode;
    this.applyState();
    this._toast(
      mode === "rotate" ? "Rotate mode"
        : mode === "move" ? "Move mode"
        : mode === "orbit" ? "Orbit mode"
        : "Scale mode"
    );
  }

  toggleAxis(key) {
    if (key !== "x" && key !== "y" && key !== "z") return;
    this.state.axis[key] = !this.state.axis[key];
    this.applyState();
  }

  setSnapDeg(deg) {
    const n = Number(deg);
    this.state.snapDeg = Number.isFinite(n) ? n : 0;
    this.applyState();
  }

  applyState() {
    const { mode, axis, snapDeg } = this.state;

    // UI active buttons
    this._toggleClass(this.ui.modeRotate, "btn--active", mode === "rotate");
    this._toggleClass(this.ui.modeMove, "btn--active", mode === "move");
    this._toggleClass(this.ui.modeOrbit, "btn--active", mode === "orbit");
    this._toggleClass(this.ui.modeScale, "btn--active", mode === "scale");

    // axis chips
    this._toggleClass(this.ui.axisX, "chip--active", !!axis.x);
    this._toggleClass(this.ui.axisY, "chip--active", !!axis.y);
    this._toggleClass(this.ui.axisZ, "chip--active", !!axis.z);

    const orbOn = mode === "orbit";

    if (this.gizmo) {
      this.gizmo.enabled = !orbOn;

      // TransformControls modes
      if (mode === "move") this.gizmo.setMode("translate");
      else if (mode === "scale") this.gizmo.setMode("scale");
      else this.gizmo.setMode("rotate");

      // axis vis
      this.gizmo.showX = !!axis.x;
      this.gizmo.showY = !!axis.y;
      this.gizmo.showZ = !!axis.z;

      // rotation snap only in rotate mode
      if (mode === "rotate" && snapDeg > 0) {
        this.gizmo.setRotationSnap(this._degToRad(snapDeg));
      } else {
        this.gizmo.setRotationSnap(null);
      }
    }

    if (this.orbit) this.orbit.enabled = orbOn;

    // keep select UI in sync
    if (this.ui.rotateSnap && String(this.ui.rotateSnap.value) !== String(snapDeg)) {
      this.ui.rotateSnap.value = String(snapDeg);
    }
  }

  /**
   * Keyboard shortcuts: 1/2/3/4
   * @param {string} keyLower
   */
  handleShortcut(keyLower) {
    if (keyLower === "1") this.setMode("rotate");
    else if (keyLower === "2") this.setMode("move");
    else if (keyLower === "3") this.setMode("orbit");
    else if (keyLower === "4") this.setMode("scale");
  }

  _bindUI() {
    this.ui.modeRotate?.addEventListener("click", () => this.setMode("rotate"));
    this.ui.modeMove?.addEventListener("click", () => this.setMode("move"));
    this.ui.modeOrbit?.addEventListener("click", () => this.setMode("orbit"));
    this.ui.modeScale?.addEventListener("click", () => this.setMode("scale"));

    this.ui.axisX?.addEventListener("click", () => this.toggleAxis("x"));
    this.ui.axisY?.addEventListener("click", () => this.toggleAxis("y"));
    this.ui.axisZ?.addEventListener("click", () => this.toggleAxis("z"));

    this.ui.rotateSnap?.addEventListener("change", () => {
      const v = Number(this.ui.rotateSnap.value || 0);
      this.setSnapDeg(v);
    });

    // disable orbit during gizmo drag, but only enable orbit if orbit mode is active
    if (this.gizmo && this.orbit) {
      this.gizmo.addEventListener("dragging-changed", (e) => {
        this.orbit.enabled = !e.value && (this.state.mode === "orbit");
        if (e.value) this._toast(this.state.mode === "move" ? "Moving…" : this.state.mode === "scale" ? "Scaling…" : "Rotating…");
      });
    }
  }

  _toast(msg, ms = 1100) {
    if (this.toast) this.toast(msg, ms);
  }

  _toggleClass(el, cls, on) {
    if (!el) return;
    el.classList.toggle(cls, !!on);
  }

  _degToRad(d) {
    return (d * Math.PI) / 180;
  }
}
