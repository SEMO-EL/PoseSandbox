// gallery/Gallery.js
// PoseSandbox Gallery (localStorage + thumbnails) extracted from your working app.js.
// This module does NOT touch three.js directly; it only needs callbacks you pass in.
// - serializePose(): returns pose object
// - applyPose(pose): applies pose to scene/world
// - captureThumbnail(size): returns dataURL png string
// - showToast(msg, ms): UI feedback
// - niceTime(iso): formatting helper (optional; if missing, it will show raw iso)

export class Gallery {
  constructor(opts = {}) {
    this.key = opts.key || "pose_sandbox_gallery_v1";
    this.maxItems = Number.isFinite(opts.maxItems) ? opts.maxItems : 30;

    this.serializePose = opts.serializePose || null;
    this.applyPose = opts.applyPose || null;
    this.captureThumbnail = opts.captureThumbnail || null;
    this.showToast = opts.showToast || (() => {});
    this.niceTime = opts.niceTime || ((iso) => String(iso || ""));

    this.poseNotesEl = opts.poseNotesEl || null; // <textarea> (optional)
    this.containerEl = opts.containerEl || null; // #poseGallery (required to render)

    this.items = [];
    this.selectedId = null;
  }

  /* ---------------- storage ---------------- */

  loadFromStorage() {
    const raw = localStorage.getItem(this.key);
    let parsed = [];
    try {
      parsed = JSON.parse(raw || "[]");
    } catch {
      parsed = [];
    }
    if (!Array.isArray(parsed)) parsed = [];

    // keep only valid-ish items
    parsed = parsed.filter((it) => it && typeof it === "object" && it.id && it.pose && it.thumb);
    if (parsed.length > this.maxItems) parsed = parsed.slice(0, this.maxItems);

    this.items = parsed;
    this.ensureSelectionValid();
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.items));
    } catch (e) {
      console.warn("Gallery save failed:", e);
      this.showToast("Gallery save failed (storage full?)", 1800);
    }
  }

  /* ---------------- utils ---------------- */

  uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  ensureSelectionValid() {
    if (!this.selectedId) return;
    const exists = this.items.some((it) => it.id === this.selectedId);
    if (!exists) this.selectedId = null;
  }

  /* ---------------- rendering ---------------- */

  render() {
    const el = this.containerEl;
    if (!el) return;

    this.ensureSelectionValid();
    el.innerHTML = "";

    if (!this.items.length) {
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = "No poses saved yet. Use “Save JSON” or “Save to Gallery”.";
      el.appendChild(empty);
      return;
    }

    this.items.forEach((it, idx) => {
      const card = document.createElement("div");
      card.className = "poseItem" + (it.id === this.selectedId ? " poseItem--active" : "");
      card.title = "Click to load this pose";

      const badge = document.createElement("div");
      badge.className = "poseBadge";
      badge.textContent = String(idx + 1);

      const img = document.createElement("img");
      img.className = "poseThumb";
      img.alt = it.name || "Pose";
      img.loading = "lazy";
      img.src = it.thumb;

      const meta = document.createElement("div");
      meta.className = "poseMeta";

      const name = document.createElement("div");
      name.className = "poseName";
      name.textContent = it.name || "Untitled pose";

      const time = document.createElement("div");
      time.className = "poseTime";
      time.textContent = this.niceTime(it.createdAt || "");

      meta.appendChild(name);
      meta.appendChild(time);

      card.appendChild(img);
      card.appendChild(badge);
      card.appendChild(meta);

      card.addEventListener("click", () => {
        this.selectedId = it.id;
        this.render();

        if (typeof this.applyPose === "function") {
          this.applyPose(it.pose);
        }

        if (this.poseNotesEl && typeof it.notes === "string") {
          this.poseNotesEl.value = it.notes;
        }

        this.showToast(`Loaded: ${it.name || "pose"}`);
      });

      el.appendChild(card);
    });
  }

  /* ---------------- actions ---------------- */

  saveCurrentPoseToGallery({ name = "", withToast = true } = {}) {
    if (typeof this.serializePose !== "function") {
      this.showToast("Gallery: serializePose() missing", 1800);
      return;
    }
    if (typeof this.captureThumbnail !== "function") {
      this.showToast("Gallery: captureThumbnail() missing", 1800);
      return;
    }

    const pose = this.serializePose();
    const thumb = this.captureThumbnail(256);

    if (!thumb) {
      this.showToast("Thumbnail capture failed", 1600);
      return;
    }

    const item = {
      id: this.uid(),
      name: String(name || "").trim() || `Pose ${this.items.length + 1}`,
      createdAt: new Date().toISOString(),
      notes: String(this.poseNotesEl?.value || ""),
      pose,
      thumb
    };

    this.items.unshift(item);
    if (this.items.length > this.maxItems) this.items.length = this.maxItems;

    this.selectedId = item.id;
    this.saveToStorage();
    this.render();

    if (withToast) this.showToast("Saved to gallery");
  }

  renameSelected() {
    if (!this.selectedId) {
      this.showToast("Select a pose thumbnail first");
      return;
    }
    const it = this.items.find((x) => x.id === this.selectedId);
    if (!it) return;

    const next = prompt("Rename pose:", it.name || "");
    if (next === null) return;

    const trimmed = String(next).trim();
    it.name = trimmed || it.name || "Untitled pose";

    this.saveToStorage();
    this.render();
    this.showToast("Pose renamed");
  }

  deleteSelected() {
    if (!this.selectedId) {
      this.showToast("Select a pose thumbnail first");
      return;
    }
    const before = this.items.length;
    this.items = this.items.filter((x) => x.id !== this.selectedId);
    this.selectedId = null;

    if (this.items.length === before) return;

    this.saveToStorage();
    this.render();
    this.showToast("Pose deleted");
  }

  clearAll() {
    if (!this.items.length) {
      this.showToast("Gallery is already empty");
      return;
    }
    const ok = confirm("Clear ALL saved poses from gallery? (This cannot be undone)");
    if (!ok) return;

    this.items = [];
    this.selectedId = null;

    this.saveToStorage();
    this.render();
    this.showToast("Gallery cleared");
  }
}
