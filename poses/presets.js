// poses/presets.js
// Built-in preset definitions + lightweight UI renderer (preset gallery)
// Matches your app.js behavior:
// - clicking a preset card selects it (and can optionally apply immediately)
// - Apply Preset button calls applySelected()
// - Save to Gallery button applies then calls saveToGallery({name})
//
// You inject the "applyPoseJointsOnly" function from poses/pose-io.js (or your own),
// and "showToast", and optionally "saveToGallery" (Gallery.saveCurrentPoseToGallery).

export function createPresets() {
  // You can later replace these with fetch("./presets/defaultPose.json") etc.
  // For now we keep them inline exactly like your working app.js
  return [
    {
      id: "preset_1",
      name: "Relaxed",
      pose: {
        version: 1,
        joints: {
          char_root: [0, 0, 0, 1],
          hips: [0, 0, 0, 1],
          chest: [0, 0, 0, 1],
          neck: [0.04759456129688851, 0.009576663708617747, -0.0011707300285879193, 0.9988219873408878],
          l_shoulder: [0.1301891507925539, -0.014738540977259416, 0.06476785232531384, 0.9892318078826294],
          r_shoulder: [0.27634560178163494, 0.023726365746203576, -0.05370027624805413, 0.9594457106931408],
          l_elbow: [0.2798218193432752, -0.015308195708092299, 0.005570112325944717, 0.9599184290881037],
          r_elbow: [-0.25674698223356186, 0.044025624238825105, 0.009168335615828587, 0.9653147901372876],
          l_hip: [0, 0, 0, 1],
          r_hip: [0, 0, 0, 1],
          l_knee: [0, 0, 0, 1],
          r_knee: [0, 0, 0, 1]
        }
      }
    },
    {
      id: "preset_2",
      name: "Twist",
      pose: {
        version: 1,
        joints: {
          char_root: [0, 0, 0, 1],
          hips: [0, 0, 0, 1],
          chest: [-0.0412301888451669, -0.09008326951266773, 0.011304799006101974, 0.9950523256689931],
          neck: [0.011843014537166162, 0.09089017694972191, 0.01458125197845934, 0.9956935354441061],
          l_shoulder: [-0.24879708961614975, 0.17826989264992213, -0.08584833223081493, 0.9488140767071036],
          r_shoulder: [0.2693851900799168, 0.0763242258244725, -0.04510161367512071, 0.9593685825853303],
          l_elbow: [0.027456907101200325, -0.09064209837284216, -0.006572594857644518, 0.9954963982432548],
          r_elbow: [-0.06377397266884179, -0.07643826082925264, 0.07551536447123127, 0.9917972867002502],
          l_hip: [0, 0, 0, 1],
          r_hip: [0, 0, 0, 1],
          l_knee: [0, 0, 0, 1],
          r_knee: [0, 0, 0, 1]
        }
      }
    },
    {
      id: "preset_3",
      name: "Lean",
      pose: {
        version: 1,
        joints: {
          char_root: [0, 0, 0, 1],
          hips: [0, 0, 0, 1],
          chest: [0, 0, 0, 1],
          neck: [-0.0695813342862614, -0.003531484504259168, 0.00024687510544474267, 0.9975698339834392],
          l_shoulder: [-0.14442983749440642, 0.004657484022909194, 0.05844950058128813, 0.9877638600057579],
          r_shoulder: [0.10974141605108569, 0.002131681788122489, -0.046677418804861634, 0.9928655247166642],
          l_elbow: [0.10797061771640441, 0.01707166371519849, 0.0019790442372586692, 0.9939991145935999],
          r_elbow: [-0.06265532258425938, 0.0033037113797317633, 0.006816360112734738, 0.998007833867271],
          l_hip: [0, 0, 0, 1],
          r_hip: [0, 0, 0, 1],
          l_knee: [0, 0, 0, 1],
          r_knee: [0, 0, 0, 1]
        }
      }
    },
    {
      id: "preset_4",
      name: "Action",
      pose: {
        version: 1,
        joints: {
          char_root: [0, 0, 0, 1],
          hips: [0.10401420271711828, 0, 0, 0.9945758279564117],
          chest: [0, 0, 0, 1],
          neck: [-0.2181436004131093, 0.010097416045732415, 0.002247558353562821, 0.9758545511217754],
          l_shoulder: [0.3639398774390935, -0.08207106038298768, 0.15769049586896034, 0.9144209096683541],
          r_shoulder: [0.17925513125200985, -0.24157575955084774, 0.04978436443866611, 0.9529072882483355],
          l_elbow: [0.25842624693713956, 0.013639980803026312, -0.06635545370746994, 0.9637428503213337],
          r_elbow: [-0.19305822233059853, -0.011266331092281362, 0.07551100424672397, 0.9781708271941326],
          l_hip: [0, 0, 0, 1],
          r_hip: [0, 0, 0, 1],
          l_knee: [0, 0, 0, 1],
          r_knee: [0, 0, 0, 1]
        }
      }
    },
    {
      id: "preset_5",
      name: "Neutral",
      pose: {
        version: 1,
        joints: {
          char_root: [0, 0, 0, 1],
          hips: [0, 0, 0, 1],
          chest: [0, 0, 0, 1],
          neck: [0, 0, 0, 1],
          l_shoulder: [0, 0, 0, 1],
          r_shoulder: [0, 0, 0, 1],
          l_elbow: [0, 0, 0, 1],
          r_elbow: [0, 0, 0, 1],
          l_hip: [0, 0, 0, 1],
          r_hip: [0, 0, 0, 1],
          l_knee: [0, 0, 0, 1],
          r_knee: [0, 0, 0, 1]
        }
      }
    }
  ];
}

export class PresetsUI {
  constructor(opts = {}) {
    this.containerEl = opts.containerEl || null;      // #presetGallery
    this.btnApplyEl = opts.btnApplyEl || null;        // #btnPresetApply
    this.btnSaveEl = opts.btnSaveEl || null;          // #btnPresetSave

    this.presets = Array.isArray(opts.presets) ? opts.presets : createPresets();
    this.selectedId = opts.selectedId || null;

    this.applyPoseJointsOnly = opts.applyPoseJointsOnly || null; // function(poseObj)
    this.saveToGallery = opts.saveToGallery || null;             // function({name})
    this.showToast = opts.showToast || (() => {});
    this.applyOnClick = opts.applyOnClick !== false; // default true
  }

  ensureSelectionValid() {
    if (!this.selectedId) return;
    const exists = this.presets.some((p) => p.id === this.selectedId);
    if (!exists) this.selectedId = null;
  }

  ensureDefaultSelected() {
    this.ensureSelectionValid();
    if (!this.selectedId && this.presets.length) this.selectedId = this.presets[0].id;
  }

  getSelected() {
    this.ensureDefaultSelected();
    return this.presets.find((p) => p.id === this.selectedId) || null;
  }

  render() {
    if (!this.containerEl) return;

    this.ensureDefaultSelected();
    this.containerEl.innerHTML = "";

    if (!this.presets.length) {
      const empty = document.createElement("div");
      empty.className = "hint";
      empty.textContent = "No presets available.";
      this.containerEl.appendChild(empty);
      return;
    }

    this.presets.forEach((p, idx) => {
      const card = document.createElement("div");
      card.className = "poseItem" + (p.id === this.selectedId ? " poseItem--active" : "");
      card.title = "Click to apply this preset";

      const faux = document.createElement("div");
      faux.className = "poseThumb";
      faux.style.display = "grid";
      faux.style.placeItems = "center";
      faux.style.fontWeight = "900";
      faux.style.color = "rgba(255,255,255,0.85)";
      faux.style.userSelect = "none";
      faux.textContent = "★";

      const badge = document.createElement("div");
      badge.className = "poseBadge";
      badge.textContent = String(idx + 1);

      const meta = document.createElement("div");
      meta.className = "poseMeta";

      const name = document.createElement("div");
      name.className = "poseName";
      name.textContent = p.name;

      const time = document.createElement("div");
      time.className = "poseTime";
      time.textContent = "Built-in preset";

      meta.appendChild(name);
      meta.appendChild(time);

      card.appendChild(faux);
      card.appendChild(badge);
      card.appendChild(meta);

      card.addEventListener("click", () => {
        this.selectedId = p.id;
        this.render();

        if (this.applyOnClick && typeof this.applyPoseJointsOnly === "function") {
          try {
            this.applyPoseJointsOnly(p.pose);
            this.showToast(`Preset applied: ${p.name}`);
          } catch (e) {
            console.warn(e);
            this.showToast("Preset apply failed", 1800);
          }
        } else {
          this.showToast(`Selected preset: ${p.name}`);
        }
      });

      this.containerEl.appendChild(card);
    });
  }

  hookButtons() {
    if (this.btnApplyEl) {
      this.btnApplyEl.addEventListener("click", () => {
        const p = this.getSelected();
        if (!p) return this.showToast("Select a preset first");
        if (typeof this.applyPoseJointsOnly !== "function") return this.showToast("Preset apply not wired", 1800);

        try {
          this.applyPoseJointsOnly(p.pose);
          this.showToast(`Preset applied: ${p.name}`);
        } catch (e) {
          console.warn(e);
          this.showToast("Preset apply failed", 1800);
        }
      });
    }

    if (this.btnSaveEl) {
      this.btnSaveEl.addEventListener("click", () => {
        const p = this.getSelected();
        if (!p) return this.showToast("Select a preset first");
        if (typeof this.applyPoseJointsOnly !== "function") return this.showToast("Preset apply not wired", 1800);
        if (typeof this.saveToGallery !== "function") return this.showToast("Gallery save not wired", 1800);

        try {
          // Apply first so thumb matches pose
          this.applyPoseJointsOnly(p.pose);
          this.saveToGallery({ name: p.name, withToast: true });
        } catch (e) {
          console.warn(e);
          this.showToast("Save preset failed", 1800);
        }
      });
    }
  }

  init() {
    this.render();
    this.hookButtons();
  }
}
