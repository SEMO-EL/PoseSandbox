// engine/renderer.js
// Creates and manages THREE.WebGLRenderer exactly like your current app.js,
// but packaged as a module.

import * as THREE from "three";

export function createRenderer(canvas, {
  powerPreference = "high-performance",
  antialias = true,
  alpha = false,
  preserveDrawingBuffer = true,
  maxPixelRatio = 2,
  toneMappingExposure = 1.05
} = {}) {
  if (!canvas) throw new Error("createRenderer: canvas is required");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias,
    alpha,
    powerPreference,
    preserveDrawingBuffer
  });

  // Same settings as your app.js
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = toneMappingExposure;

  // Shadows (quality upgrade you already had)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Initial sizing (safe if canvas has no layout yet)
  const w = canvas.clientWidth || canvas.width || 1;
  const h = canvas.clientHeight || canvas.height || 1;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  renderer.setSize(w, h, false);

  function resizeToCanvas({
    camera = null,
    onAfterResize = null
  } = {}) {
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return false;

    if (camera && "aspect" in camera) {
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix?.();
    }

    renderer.setSize(cw, ch, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));

    try { onAfterResize?.(); } catch {}
    return true;
  }

  return { renderer, resizeToCanvas };
}
