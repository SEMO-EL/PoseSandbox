// poses/pose-io.js
// PoseSandbox pose serialization + apply + import helpers
// Extracted from your working app.js behavior (gallery + props + joints).
//
// This module is PURE logic and expects you to inject dependencies from app.js / Engine:
// - world: { joints: Group[], props: Group[] }
// - scene: THREE.Scene
// - poseNotesEl: <textarea> (optional)
// - addProp(type): (type:string) => creates a prop and pushes into world.props + scene.add
// - showToast(msg, ms)
// - updateOutline(): refresh outline helper
// - forceRenderOnce(): (optional) one immediate render after applying
// - resetAllJointRotations(): (optional but recommended)
//
// It also provides importPosePack(files, {applyPose, saveToGallery, renderGallery, showToast})

export function nowISO() {
  return new Date().toISOString();
}

/** @param {any} p */
function inferTypeFromLegacyName(p) {
  const n = String(p?.name || "").toLowerCase();
  if (n.includes("sphere")) return "sphere";
  if (n.includes("cube") || n.includes("box")) return "cube";
  if (n.includes("cyl")) return "cylinder";
  if (n.includes("cone")) return "cone";
  if (n.includes("torus")) return "torus";
  if (n.includes("ring")) return "ring";
  if (n.includes("disc") || n.includes("circle")) return "disc";
  if (n.includes("plane")) return "plane";
  if (n.includes("icosa")) return "icosa";
  if (n.includes("octa")) return "octa";
  if (n.includes("dodeca")) return "dodeca";
  if (n.includes("tetra")) return "tetra";
  return "cube";
}

/* ---------------- Pose Serialize ---------------- */

export function serializePose({ world, poseNotesEl }) {
  if (!world || !world.joints || !world.props) throw new Error("serializePose: missing world");

  const joints = {};
  world.joints.forEach((j) => {
    joints[j.name] = j.quaternion.toArray();
  });

  const props = world.props.map((p) => ({
    type: String(p?.userData?.type || inferTypeFromLegacyName(p)),
    name: p?.name || "",
    position: p.position.toArray(),
    quaternion: p.quaternion.toArray(),
    scale: p.scale.toArray()
  }));

  return {
    version: 1,
    notes: String(poseNotesEl?.value || ""),
    joints,
    props,
    savedAt: nowISO()
  };
}

/* ---------------- Pose Apply ---------------- */

export function applyPose(data, deps) {
  const {
    world,
    scene,
    poseNotesEl,
    addProp,
    showToast,
    updateOutline,
    forceRenderOnce
  } = deps || {};

  if (!data || typeof data !== "object") throw new Error("Invalid pose JSON");
  if (!world || !world.joints || !world.props) throw new Error("applyPose: missing world");
  if (!scene) throw new Error("applyPose: missing scene");

  // Apply joints
  if (data.joints && typeof data.joints === "object") {
    world.joints.forEach((j) => {
      const q = data.joints[j.name];
      if (Array.isArray(q) && q.length === 4) j.quaternion.fromArray(q);
    });
  }

  // Apply props (rebuild like your app.js)
  if (Array.isArray(data.props)) {
    // remove old
    world.props.forEach((p) => scene.remove(p));
    world.props.length = 0;

    // add new
    data.props.forEach((pd) => {
      if (typeof addProp !== "function") return;

      const t = String(pd?.type || "").trim().toLowerCase() || inferTypeFromLegacyName(pd);
      addProp(t);

      const p = world.props[world.props.length - 1];
      if (!p) return;

      // keep type for future serializations
      if (!p.userData) p.userData = {};
      p.userData.type = t;
      p.userData.isProp = true;

      if (pd.position) p.position.fromArray(pd.position);
      if (pd.quaternion) p.quaternion.fromArray(pd.quaternion);
      if (pd.scale) p.scale.fromArray(pd.scale);
      if (pd.name) p.name = pd.name;
    });
  }

  // Notes
  if (poseNotesEl && typeof data.notes === "string") {
    poseNotesEl.value = data.notes;
  }

  // Visual refresh hooks
  if (typeof updateOutline === "function") updateOutline();
  if (typeof forceRenderOnce === "function") forceRenderOnce();

  if (typeof showToast === "function") showToast("Pose loaded");
}

export function applyPoseJointsOnly(data, deps) {
  const {
    world,
    resetAllJointRotations,
    showToast,
    updateOutline,
    forceRenderOnce
  } = deps || {};

  if (!data || typeof data !== "object") throw new Error("Invalid preset/pose object");
  if (!data.joints || typeof data.joints !== "object") throw new Error("Pose missing joints");
  if (!world || !world.joints) throw new Error("applyPoseJointsOnly: missing world");

  // Important: reset first so the preset clearly applies
  if (typeof resetAllJointRotations === "function") resetAllJointRotations();

  let appliedCount = 0;
  world.joints.forEach((j) => {
    const q = data.joints[j.name];
    if (Array.isArray(q) && q.length === 4) {
      j.quaternion.fromArray(q);
      appliedCount++;
    }
  });

  if (typeof updateOutline === "function") updateOutline();
  if (typeof forceRenderOnce === "function") forceRenderOnce();

  if (typeof showToast === "function") {
    if (appliedCount === 0) showToast("Preset loaded (no matching joints)", 2000);
    else showToast(`Preset loaded (${appliedCount} joints)`);
  }

  return appliedCount;
}

/* ---------------- Import Pack (multi json) ---------------- */
/**
 * files: FileList or File[]
 * deps:
 *  - applyPose(data) : should apply pose in the scene
 *  - saveToGallery({name, withToast}) : your gallery save method
 *  - renderGallery() : optional
 *  - showToast(msg)
 */
export async function importPosePack(files, deps = {}) {
  const { applyPose: applyPoseFn, saveToGallery, renderGallery, showToast } = deps;

  if (!files || !files.length) return;
  let imported = 0;

  for (const file of files) {
    if (!file?.name?.toLowerCase().endsWith(".json")) continue;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (typeof applyPoseFn === "function") {
        applyPoseFn(data); // so the thumbnail matches this pose
      }

      const name = file.name.replace(/\.json$/i, "");

      if (typeof saveToGallery === "function") {
        saveToGallery({ name, withToast: false });
      }

      imported++;
    } catch (err) {
      console.warn("Failed to import pose:", file?.name, err);
    }
  }

  if (typeof renderGallery === "function") renderGallery();

  if (typeof showToast === "function") {
    if (imported > 0) showToast(`Imported ${imported} pose${imported > 1 ? "s" : ""}`);
    else showToast("No valid poses imported");
  }

  return imported;
}
