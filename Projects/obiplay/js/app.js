// ═══════════════════════════════════════════════════════════
//  ObiPlay — Main Application JS
// ═══════════════════════════════════════════════════════════

'use strict';

// ── SVG ICONS ──────────────────────────────────────────────
const SVG = {
  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3l14 9-14 9V3z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
  rewind: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 5L4 12l8 7V5zm8 0l-8 7 8 7V5z"/></svg>`,
  forward: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4 5l8 7-8 7V5zm8 0l8 7-8 7V5z"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  mute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  pip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><rect x="12" y="12" width="9" height="7" rx="1"/></svg>`,
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5m10 0h5M2 17h5m10 0h5"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  library: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6m4 0V4h6v2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  scissors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4.95"/></svg>`,
  crop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14h14"/><path d="M2 6h14v14"/></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  trending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  chevDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
  chevLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17H5a5 5 0 0 1 0-10h14a5 5 0 0 1 0 10z"/><circle cx="12" cy="12" r="2"/></svg>`,
};

// ── VIDEO LIBRARY (in-memory) ──────────────────────────────
const VideoStore = {
  videos: [
    { id: 1, title: "Cinematic Mountain Sunrise", duration: "4:32", views: "2.4M", color: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", tags: ["nature","cinematic"], description: "Breathtaking timelapse of the sun rising over alpine peaks in stunning 4K." },
    { id: 2, title: "Urban Night Drive 4K", duration: "8:17", views: "1.1M", color: "linear-gradient(135deg,#0d0d0d,#1a0533,#2d1b69)", tags: ["urban","4k"], description: "Neon-lit city streets captured in stunning 4K resolution at midnight." },
    { id: 3, title: "Ocean Waves Relaxation", duration: "60:00", views: "5.7M", color: "linear-gradient(135deg,#0a3d62,#1e6091,#48cae4)", tags: ["ambient","relaxation"], description: "One hour of gentle waves and ocean sounds to calm your mind." },
    { id: 4, title: "Aerial Forest Canopy", duration: "3:44", views: "892K", color: "linear-gradient(135deg,#1b4332,#2d6a4f,#52b788)", tags: ["nature","drone"], description: "Drone footage soaring above ancient ancient forest canopies." },
    { id: 5, title: "Neon Tokyo Street Food", duration: "12:05", views: "3.3M", color: "linear-gradient(135deg,#3d0000,#8b0000,#ff4500)", tags: ["food","travel"], description: "Exploring the very best street food spots under Tokyo's neon lights." },
    { id: 6, title: "Deep Space Time Lapse", duration: "6:20", views: "4.8M", color: "linear-gradient(135deg,#000000,#0a0a1a,#1a0030)", tags: ["space","timelapse"], description: "Stunning footage of the cosmos as stars sweep across the night sky." },
  ],
  nextId: 100,
  add(video) { this.videos.unshift(video); },
  remove(id) { this.videos = this.videos.filter(v => v.id !== id); },
  get(id) { return this.videos.find(v => v.id === id); },
  getAll() { return this.videos; },
};

// ── TOAST SYSTEM ───────────────────────────────────────────
const Toast = {
  show(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }
};

// ── FORMAT TIME ────────────────────────────────────────────
function fmtTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

// ── THUMB PLACEHOLDER ─────────────────────────────────────
function thumbBg(color) {
  return `<div class="thumb-placeholder" style="background:${color}">${SVG.film}</div>`;
}

// ══════════════════════════════════════════════════════════
//  VIDEO PLAYER ENGINE
// ══════════════════════════════════════════════════════════
const Player = {
  videoEl: null,
  controlsTimer: null,
  isCinematic: false,
  playheadDragging: false,

  init() {
    this.videoEl = document.getElementById('main-video');
    if (!this.videoEl) return;
    this._bindEvents();
    this._bindKeyboard();
  },

  _bindEvents() {
    const v = this.videoEl;
    v.addEventListener('timeupdate', () => this.onTimeUpdate());
    v.addEventListener('loadedmetadata', () => this.onMeta());
    v.addEventListener('ended', () => this.onEnded());
    v.addEventListener('play', () => this.updatePlayBtn(true));
    v.addEventListener('pause', () => this.updatePlayBtn(false));
    v.addEventListener('volumechange', () => this.onVolume());
    v.addEventListener('click', () => this.togglePlay());
    v.addEventListener('dblclick', () => this.toggleFullscreen());

    // Controls auto-hide
    const wrapper = document.getElementById('player-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mousemove', () => this.showControls());
      wrapper.addEventListener('mouseleave', () => { if (!v.paused) this.hideControls(); });
    }

    // Progress bar
    const prog = document.getElementById('progress-area');
    if (prog) {
      prog.addEventListener('click', (e) => this.seek(e));
      prog.addEventListener('mousedown', () => { this.playheadDragging = true; });
      document.addEventListener('mousemove', (e) => { if (this.playheadDragging) this.seek(e, prog); });
      document.addEventListener('mouseup', () => { this.playheadDragging = false; });
    }

    // Volume
    const volSlider = document.getElementById('vol-slider');
    if (volSlider) {
      volSlider.addEventListener('input', () => {
        this.videoEl.volume = parseFloat(volSlider.value);
        this.videoEl.muted = false;
      });
    }
  },

  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (!this.videoEl) return;
      switch(e.code) {
        case 'Space': e.preventDefault(); this.togglePlay(); break;
        case 'ArrowRight': e.preventDefault(); this.videoEl.currentTime = Math.min(this.videoEl.currentTime + 10, this.videoEl.duration); break;
        case 'ArrowLeft': e.preventDefault(); this.videoEl.currentTime = Math.max(this.videoEl.currentTime - 10, 0); break;
        case 'ArrowUp': e.preventDefault(); this.videoEl.volume = Math.min(1, this.videoEl.volume + 0.1); break;
        case 'ArrowDown': e.preventDefault(); this.videoEl.volume = Math.max(0, this.videoEl.volume - 0.1); break;
        case 'KeyM': this.videoEl.muted = !this.videoEl.muted; break;
        case 'KeyF': this.toggleFullscreen(); break;
        case 'KeyC': this.toggleCinematic(); break;
      }
    });
  },

  load(video) {
    const v = this.videoEl;
    if (!v) return;
    if (video.src) {
      v.src = video.src;
      v.load();
    } else {
      v.removeAttribute('src');
    }
    // Update info
    const titleEl = document.getElementById('player-title');
    const metaEl = document.getElementById('player-meta');
    const descEl = document.getElementById('player-desc');
    const tagsEl = document.getElementById('player-tags');
    if (titleEl) titleEl.textContent = video.title;
    if (metaEl) metaEl.textContent = `${video.views || '0'} views · ${video.duration || '—'}`;
    if (descEl) descEl.textContent = video.description || '';
    if (tagsEl) tagsEl.innerHTML = (video.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    this._updatePlaylist(video.id);
  },

  _updatePlaylist(activeId) {
    document.querySelectorAll('.playlist-item').forEach(el => {
      const active = parseInt(el.dataset.id) === activeId;
      el.classList.toggle('active', active);
      const icon = el.querySelector('.playlist-active-icon');
      if (icon) icon.style.display = active ? 'flex' : 'none';
    });
  },

  togglePlay() {
    if (!this.videoEl) return;
    this.videoEl.paused ? this.videoEl.play() : this.videoEl.pause();
    this.showControls();
  },

  updatePlayBtn(playing) {
    const btn = document.getElementById('play-btn');
    if (btn) btn.innerHTML = playing ? SVG.pause : SVG.play;
    if (playing) setTimeout(() => this.hideControls(), 2500);
  },

  seek(e, el) {
    const rect = (el || e.currentTarget).getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (this.videoEl && isFinite(this.videoEl.duration)) {
      this.videoEl.currentTime = pct * this.videoEl.duration;
    }
  },

  onTimeUpdate() {
    const v = this.videoEl;
    if (!v || !isFinite(v.duration)) return;
    const pct = (v.currentTime / v.duration) * 100;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = pct + '%';
    const curr = document.getElementById('time-current');
    const total = document.getElementById('time-total');
    if (curr) curr.textContent = fmtTime(v.currentTime);
    if (total) total.textContent = fmtTime(v.duration);
  },

  onMeta() {
    const total = document.getElementById('time-total');
    if (total) total.textContent = fmtTime(this.videoEl.duration);
  },

  onEnded() {
    this.updatePlayBtn(false);
    this.showControls();
  },

  onVolume() {
    const v = this.videoEl;
    const btn = document.getElementById('mute-btn');
    const slider = document.getElementById('vol-slider');
    if (btn) btn.innerHTML = (v.muted || v.volume === 0) ? SVG.mute : SVG.volume;
    if (slider) slider.value = v.muted ? 0 : v.volume;
  },

  toggleMute() {
    if (!this.videoEl) return;
    this.videoEl.muted = !this.videoEl.muted;
  },

  setSpeed(s) {
    if (!this.videoEl) return;
    this.videoEl.playbackRate = s;
    const badge = document.getElementById('speed-badge');
    if (badge) badge.textContent = s + 'x';
    document.querySelectorAll('.speed-opt').forEach(o => o.classList.toggle('active', parseFloat(o.dataset.speed) === s));
    document.getElementById('speed-menu')?.classList.remove('open');
  },

  toggleSpeedMenu() {
    document.getElementById('speed-menu')?.classList.toggle('open');
  },

  toggleFullscreen() {
    const wrapper = document.getElementById('player-wrapper');
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  },

  tryPiP() {
    if (this.videoEl && document.pictureInPictureEnabled) {
      this.videoEl.requestPictureInPicture().catch(() => Toast.show('PiP not supported', 'error'));
    }
  },

  toggleCinematic() {
    this.isCinematic = !this.isCinematic;
    const bars = document.getElementById('cinematic-bars');
    if (bars) bars.classList.toggle('on', this.isCinematic);
    const btn = document.getElementById('cinematic-btn');
    if (btn) btn.classList.toggle('active', this.isCinematic);
    Toast.show(this.isCinematic ? 'Cinematic mode ON' : 'Cinematic mode OFF');
  },

  showControls() {
    const ctrl = document.getElementById('player-controls');
    if (ctrl) ctrl.classList.remove('hide');
    clearTimeout(this.controlsTimer);
    this.controlsTimer = setTimeout(() => { if (this.videoEl && !this.videoEl.paused) this.hideControls(); }, 3000);
  },

  hideControls() {
    const ctrl = document.getElementById('player-controls');
    if (ctrl) ctrl.classList.add('hide');
  },

  skip(secs) {
    if (!this.videoEl) return;
    this.videoEl.currentTime = Math.max(0, Math.min(this.videoEl.duration, this.videoEl.currentTime + secs));
  },
};

// ══════════════════════════════════════════════════════════
//  UPLOAD SYSTEM
// ══════════════════════════════════════════════════════════
const Uploader = {
  file: null,
  objectUrl: null,

  init() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    if (!dropZone || !fileInput) return;

    // Drag & drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const f = e.dataTransfer.files[0];
      if (f) this.selectFile(f);
    });

    // Click to browse (prevent double-trigger from input click)
    fileInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (f) this.selectFile(f);
    });

    // Form submit
    const form = document.getElementById('upload-form');
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); this.upload(); });

    // Cancel
    const cancelBtn = document.getElementById('cancel-upload');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.reset());
  },

  selectFile(f) {
    // Validate type
    if (!f.type.startsWith('video/')) {
      Toast.show('Please select a valid video file (MP4, MOV, AVI, MKV, etc.)', 'error');
      return;
    }
    // Validate size (2GB)
    if (f.size > 2 * 1024 * 1024 * 1024) {
      Toast.show('File is too large. Maximum size is 2GB.', 'error');
      return;
    }

    this.file = f;
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(f);

    // Show file preview
    document.getElementById('drop-zone').classList.add('hidden');
    document.getElementById('file-preview').classList.remove('hidden');
    document.getElementById('upload-form-wrap').classList.remove('hidden');

    // Populate preview
    document.getElementById('preview-name').textContent = f.name;
    document.getElementById('preview-size').textContent = (f.size / 1024 / 1024).toFixed(1) + ' MB · ' + f.type;

    // Pre-fill title from filename
    const titleInput = document.getElementById('upload-title');
    if (titleInput && !titleInput.value) {
      titleInput.value = f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    }
  },

  upload() {
    if (!this.file) return;
    const title = document.getElementById('upload-title')?.value.trim() || this.file.name;
    const desc = document.getElementById('upload-desc')?.value.trim() || '';
    const tagsRaw = document.getElementById('upload-tags')?.value.trim() || '';
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

    // Show progress
    document.getElementById('upload-form-wrap').classList.add('hidden');
    document.getElementById('upload-progress-wrap').classList.remove('hidden');

    let pct = 0;
    const bar = document.getElementById('upload-bar-fill');
    const pctLabel = document.getElementById('upload-pct');

    const iv = setInterval(() => {
      pct += Math.random() * 12 + 3;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        if (bar) bar.style.width = '100%';
        if (pctLabel) pctLabel.textContent = '100%';

        // Add to store
        const newVideo = {
          id: ++VideoStore.nextId,
          title,
          description: desc,
          tags,
          duration: '—',
          views: '0',
          color: 'linear-gradient(135deg,#1e1e2e,#2d2d4e)',
          src: this.objectUrl,
          fileObj: this.file,
        };
        VideoStore.add(newVideo);

        setTimeout(() => {
          document.getElementById('upload-progress-wrap').classList.add('hidden');
          document.getElementById('upload-success').classList.remove('hidden');
          document.getElementById('success-title').textContent = `"${title}" uploaded!`;
          Toast.show('Video uploaded successfully! 🎉', 'success');
        }, 400);
      }
      if (bar) bar.style.width = pct + '%';
      if (pctLabel) pctLabel.textContent = Math.round(pct) + '%';
    }, 180);
  },

  reset() {
    this.file = null;
    document.getElementById('drop-zone').classList.remove('hidden');
    document.getElementById('file-preview').classList.add('hidden');
    document.getElementById('upload-form-wrap').classList.add('hidden');
    document.getElementById('upload-progress-wrap').classList.add('hidden');
    document.getElementById('upload-success').classList.add('hidden');
    document.getElementById('upload-title').value = '';
    document.getElementById('upload-desc').value = '';
    document.getElementById('upload-tags').value = '';
    document.getElementById('file-input').value = '';
  },
};

// ══════════════════════════════════════════════════════════
//  PAGE RENDERER
// ══════════════════════════════════════════════════════════
const Pages = {
  current: 'home',

  navigate(page, data) {
    this.current = page;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    const main = document.getElementById('main-content-area');
    if (!main) return;
    main.innerHTML = '';

    const topbar = document.getElementById('topbar-title');
    const titles = { home: 'Home', player: 'Now Playing', upload: 'Upload Video', editor: 'Video Editor', library: 'My Library' };
    if (topbar) topbar.textContent = titles[page] || 'ObiPlay';

    switch(page) {
      case 'home': this.renderHome(main); break;
      case 'player': this.renderPlayer(main, data); break;
      case 'upload': this.renderUpload(main); break;
      case 'editor': this.renderEditor(main, data); break;
      case 'library': this.renderLibrary(main); break;
    }

    window.scrollTo(0, 0);
  },

  // ── HOME ──────────────────────────────────────────────
  renderHome(container) {
    const videos = VideoStore.getAll();
    container.innerHTML = `
      <div class="hero">
        <div class="hero-badge">${SVG.zap} ObiPlay Studio</div>
        <h1>Watch. Create.<br><em>Elevate.</em></h1>
        <p>Upload, stream, and edit videos professionally — all in one powerful platform built by Obi Enterprises.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="Pages.navigate('upload')">
            ${SVG.upload} Upload Video
          </button>
          <button class="btn btn-ghost" onclick="Pages.navigate('editor')">
            ${SVG.edit} Open Editor
          </button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><div class="num">${videos.length}+</div><div class="label">Videos Hosted</div></div>
          <div class="hero-stat"><div class="num">98%</div><div class="label">Uptime SLA</div></div>
          <div class="hero-stat"><div class="num">50+</div><div class="label">Edit Tools</div></div>
        </div>
      </div>
      <div class="page-content">
        <div class="section-label">Trending Now</div>
        <div class="section-header">
          <div class="section-title">${SVG.trending} Top Videos</div>
          <button class="btn btn-ghost" onclick="Pages.navigate('library')" style="font-size:12px">View All</button>
        </div>
        <div class="video-grid">
          ${videos.map(v => this._videoCard(v)).join('')}
        </div>
        <div class="divider"></div>
        <div class="section-label">Quick Actions</div>
        <div class="quick-actions mt-2">
          ${[
            { icon: SVG.upload, label:'Upload Video', sub:'Add new content', page:'upload', color:'#e8ff47' },
            { icon: SVG.edit, label:'Video Editor', sub:'Edit your clips', page:'editor', color:'#7bb8f0' },
            { icon: SVG.library, label:'My Library', sub:'Manage videos', page:'library', color:'#7bf07b' },
            { icon: SVG.play, label:'Watch Now', sub:'Browse content', page:'player', color:'#f07bb8' },
          ].map(a => `
            <div class="action-card" onclick="Pages.navigate('${a.page}')">
              <div class="action-card-icon" style="background:${a.color}15;border:1px solid ${a.color}30;color:${a.color}">${a.icon}</div>
              <h4>${a.label}</h4>
              <p>${a.sub}</p>
            </div>
          `).join('')}
        </div>
        <div class="divider"></div>
        <div class="section-label">Player Shortcuts</div>
        <div class="shortcuts-grid">
          ${[['Space','Play/Pause'],['→','+10s'],['←','-10s'],['↑↓','Volume'],['M','Mute'],['F','Fullscreen'],['C','Cinematic']].map(([k,v])=>`
            <div class="shortcut-item"><span class="kbd">${k}</span>${v}</div>
          `).join('')}
        </div>
      </div>
    `;
  },

  _videoCard(v) {
    const thumb = v.src
      ? `<video src="${v.src}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover" onloadedmetadata="this.currentTime=1"></video>`
      : thumbBg(v.color || '#111');
    return `
      <div class="video-card" onclick="Pages.navigate('player', ${v.id})">
        <div class="card-thumb">
          ${thumb}
          <div class="card-overlay"><div class="play-btn-overlay">${SVG.play}</div></div>
          <div class="card-duration">${v.duration}</div>
        </div>
        <div class="card-body">
          <div class="card-title">${v.title}</div>
          <div class="card-meta">${v.views} views</div>
          <div class="card-tags">${(v.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </div>`;
  },

  // ── PLAYER ───────────────────────────────────────────
  renderPlayer(container, videoId) {
    const videos = VideoStore.getAll();
    const video = (videoId ? VideoStore.get(videoId) : null) || videos[0];

    container.innerHTML = `
      <div class="page-content">
        <div class="player-layout">
          <div class="player-main">
            <div class="player-wrapper" id="player-wrapper">
              ${video?.src
                ? `<video id="main-video" preload="metadata" playsinline style="width:100%;height:100%;object-fit:contain;display:block;background:#000"></video>`
                : `<div class="player-placeholder">${SVG.film}<span>No video file — upload a video to play it</span></div>`
              }
              <div class="cinematic-bars" id="cinematic-bars"></div>
              <div class="player-controls" id="player-controls">
                <div class="progress-area" id="progress-area">
                  <div class="progress-track">
                    <div class="progress-fill" id="progress-fill">
                      <div class="progress-thumb"></div>
                    </div>
                  </div>
                </div>
                <div class="controls-row">
                  <button class="ctrl-btn" onclick="Player.skip(-10)">${SVG.rewind}</button>
                  <button class="ctrl-btn" id="play-btn" onclick="Player.togglePlay()">${SVG.play}</button>
                  <button class="ctrl-btn" onclick="Player.skip(10)">${SVG.forward}</button>
                  <button class="ctrl-btn" id="mute-btn" onclick="Player.toggleMute()">${SVG.volume}</button>
                  <input type="range" id="vol-slider" class="vol-slider" min="0" max="1" step="0.01" value="0.8">
                  <span class="time-display"><span id="time-current">0:00</span> / <span id="time-total">0:00</span></span>
                  <div class="controls-right">
                    <div style="position:relative">
                      <button class="speed-badge" id="speed-badge" onclick="Player.toggleSpeedMenu()">1x</button>
                      <div class="speed-menu" id="speed-menu">
                        ${[0.25,0.5,0.75,1,1.25,1.5,1.75,2].map(s=>`<button class="speed-opt ${s===1?'active':''}" data-speed="${s}" onclick="Player.setSpeed(${s})">${s}x</button>`).join('')}
                      </div>
                    </div>
                    <button class="ctrl-btn" id="cinematic-btn" onclick="Player.toggleCinematic()" title="Cinematic Mode (C)">${SVG.film}</button>
                    <button class="ctrl-btn" onclick="Player.tryPiP()" title="Picture in Picture">${SVG.pip}</button>
                    <button class="ctrl-btn" onclick="Player.toggleFullscreen()">${SVG.fullscreen}</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="player-info">
              <div class="player-title" id="player-title">${video?.title || 'Select a video'}</div>
              <div class="player-meta" id="player-meta">${video?.views || '0'} views · ${video?.duration || '—'}</div>
              <div class="player-actions">
                <button class="btn btn-ghost btn-icon" title="Share">${SVG.share}</button>
                <button class="btn btn-ghost btn-icon" title="Download">${SVG.download}</button>
                <button class="btn btn-ghost" onclick="Pages.navigate('editor', ${video?.id})" style="margin-left:auto">
                  ${SVG.edit} Edit This Video
                </button>
              </div>
              <div id="player-tags" class="card-tags mt-2">${(video?.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
              <div class="player-desc" id="player-desc">${video?.description||''}</div>
            </div>
          </div>
          <div class="player-aside">
            <div class="playlist-card">
              <div class="playlist-header">
                <div class="section-label" style="margin:0">Up Next</div>
                <div style="font-size:14px;font-weight:700;margin-top:4px">Playlist · ${videos.length} videos</div>
              </div>
              ${videos.map(v => `
                <div class="playlist-item ${v.id===video?.id?'active':''}" data-id="${v.id}" onclick="Player.load(VideoStore.get(${v.id})); document.querySelectorAll('.playlist-item').forEach(el=>el.classList.toggle('active', el.dataset.id=='${v.id}'))">
                  <div class="playlist-thumb">
                    ${v.src ? `<video src="${v.src}" muted preload="metadata" onloadedmetadata="this.currentTime=1" style="width:100%;height:100%;object-fit:cover"></video>` : SVG.film}
                  </div>
                  <div class="playlist-info">
                    <div class="playlist-item-title">${v.title}</div>
                    <div class="playlist-item-dur">${v.duration}</div>
                  </div>
                  <div class="playlist-active-icon" style="display:${v.id===video?.id?'flex':'none'}">${SVG.play}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Init player after DOM ready
    setTimeout(() => {
      Player.init();
      if (video?.src) {
        Player.load(video);
      }
    }, 0);
  },

  // ── UPLOAD ───────────────────────────────────────────
  renderUpload(container) {
    container.innerHTML = `
      <div class="page-content" style="max-width:680px;margin:0 auto">
        <!-- Drop Zone -->
        <div id="drop-zone" class="upload-zone">
          <input type="file" id="file-input" accept="video/*">
          <div class="upload-icon-wrap">${SVG.upload}</div>
          <div class="upload-title">Drag & Drop Video Here</div>
          <div class="upload-sub">or click to browse your device</div>
          <div class="upload-hint">Supports MP4, MOV, AVI, MKV, WebM · Max 2GB</div>
        </div>

        <!-- File Preview -->
        <div id="file-preview" class="file-preview-card hidden">
          <div class="file-preview-icon">${SVG.film}</div>
          <div class="file-preview-info">
            <div class="file-preview-name" id="preview-name">filename.mp4</div>
            <div class="file-preview-meta" id="preview-size">0 MB</div>
          </div>
          <button class="btn btn-ghost btn-icon" id="cancel-upload">${SVG.close}</button>
        </div>

        <!-- Upload Form -->
        <form id="upload-form">
          <div id="upload-form-wrap" class="hidden">
            <div class="form-group">
              <label class="form-label">Video Title *</label>
              <input type="text" id="upload-title" class="form-input" placeholder="Enter a title for your video..." required>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="upload-desc" class="form-input" placeholder="Describe your video..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Tags <span style="color:var(--text3)">(comma separated)</span></label>
              <input type="text" id="upload-tags" class="form-input" placeholder="nature, travel, cinematic...">
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end">
              <button type="button" class="btn btn-ghost" id="cancel-upload2">Cancel</button>
              <button type="submit" class="btn btn-primary">${SVG.upload} Upload Video</button>
            </div>
          </div>
        </form>

        <!-- Progress -->
        <div id="upload-progress-wrap" class="hidden" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;text-align:center">
          <div style="font-size:16px;font-weight:700;margin-bottom:16px">Uploading your video...</div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" id="upload-bar-fill"></div>
          </div>
          <div style="font-size:12px;color:var(--text3);margin-top:8px"><span id="upload-pct">0%</span> complete</div>
        </div>

        <!-- Success -->
        <div id="upload-success" class="upload-success hidden">
          <div class="success-icon">✓</div>
          <h2 style="font-size:24px;font-weight:800;margin-bottom:10px">Upload Complete!</h2>
          <p id="success-title" style="color:var(--text2);margin-bottom:28px"></p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="Uploader.reset();Pages.navigate('upload')">Upload Another</button>
            <button class="btn btn-ghost" onclick="Pages.navigate('editor')">${SVG.edit} Edit in Editor</button>
            <button class="btn btn-ghost" onclick="Pages.navigate('library')">${SVG.library} View Library</button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      Uploader.init();
      // Second cancel button
      document.getElementById('cancel-upload2')?.addEventListener('click', () => Uploader.reset());
    }, 0);
  },

  // ── EDITOR ───────────────────────────────────────────
  renderEditor(container, videoId) {
    const videos = VideoStore.getAll();
    const video = (videoId ? VideoStore.get(videoId) : null) || videos.find(v => v.src) || videos[0];
    let activeTool = 'trim';
    let historyStack = [];
    let playheadX = 60;

    container.innerHTML = `
      <div class="editor-layout">
        <div class="editor-topbar">
          <span style="font-family:'Syne',sans-serif;font-weight:700;font-size:15px;flex:1">${video?.title || 'Untitled Project'}</span>
          <button class="btn btn-ghost btn-icon" id="ed-undo" title="Undo">${SVG.undo}</button>
          <button class="btn btn-ghost btn-icon" id="ed-redo" title="Redo">${SVG.redo}</button>
          <button class="btn btn-ghost" style="font-size:12px">Auto-Save</button>
          <button class="btn btn-primary" id="ed-export">${SVG.download} Export</button>
        </div>
        <div class="editor-workspace">
          <!-- Tool Sidebar -->
          <div class="editor-sidebar" id="editor-sidebar">
            ${this._editorToolGroups()}
          </div>
          <!-- Preview -->
          <div class="editor-preview-area">
            <div class="editor-preview-wrap">
              <div class="editor-preview-video" id="editor-preview-video">
                ${video?.src
                  ? `<video id="editor-video" src="${video.src}" style="width:100%;height:100%;object-fit:contain"></video>`
                  : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;height:100%;color:var(--text3)">${SVG.film}<span style="font-size:13px">No video — upload one first</span></div>`
                }
                <div class="text-overlay-preview hidden" id="text-overlay"><div class="overlay-label" id="overlay-text">Text Overlay</div></div>
              </div>
              <div class="editor-playback">
                <button class="btn btn-ghost btn-icon" onclick="EditorPlayer.skip(-5)">${SVG.rewind}</button>
                <button class="btn btn-primary btn-icon" style="width:40px;height:40px;border-radius:50%" onclick="EditorPlayer.toggle()" id="ed-play-btn">${SVG.play}</button>
                <button class="btn btn-ghost btn-icon" onclick="EditorPlayer.skip(5)">${SVG.forward}</button>
                <span style="font-size:12px;color:var(--text3);margin-left:8px" id="ed-time">0:00 / ${video?.duration || '0:00'}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Timeline -->
        <div class="editor-timeline">
          <div class="timeline-toolbar">
            <button class="ctrl-btn" style="color:var(--text2)">${SVG.plus}</button>
            <span style="font-size:11px;color:var(--text3);font-weight:700">TIMELINE</span>
            <div style="flex:1"></div>
            <span style="font-size:11px;color:var(--text3)" id="ed-timeline-time">0:00</span>
          </div>
          <div class="timeline-tracks" id="timeline-tracks">
            <div class="timeline-playhead" id="timeline-playhead"></div>
            <div class="track">
              <span class="track-lbl">VID</span>
              <div class="track-clip clip-video" style="left:60px;width:${video?.src ? '300px' : '180px'}">📹 ${video?.title || 'Video Clip'}</div>
            </div>
            <div class="track">
              <span class="track-lbl">AUD</span>
              <div class="track-clip clip-audio" style="left:60px;width:380px">🎵 Audio Track</div>
            </div>
            <div class="track">
              <span class="track-lbl">TXT</span>
              <div class="track-clip clip-text" style="left:160px;width:120px">Aa Text Overlay</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Timeline playhead drag
    setTimeout(() => {
      const tracks = document.getElementById('timeline-tracks');
      if (tracks) {
        tracks.addEventListener('click', (e) => {
          const rect = tracks.getBoundingClientRect();
          playheadX = e.clientX - rect.left;
          const ph = document.getElementById('timeline-playhead');
          if (ph) ph.style.left = playheadX + 'px';
        });
      }

      // Tool clicks
      document.querySelectorAll('.tool-item').forEach(el => {
        el.addEventListener('click', () => {
          activeTool = el.dataset.tool;
          document.querySelectorAll('.tool-item').forEach(x => x.classList.remove('active'));
          el.classList.add('active');
          this._updateEditorPanel(activeTool, video);
        });
      });

      // Section toggles
      document.querySelectorAll('.tool-section-header').forEach(hdr => {
        hdr.addEventListener('click', () => {
          hdr.parentElement.classList.toggle('open');
        });
      });
      // Open first section
      document.querySelector('.tool-section')?.classList.add('open');

      // Export
      document.getElementById('ed-export')?.addEventListener('click', () => {
        const btn = document.getElementById('ed-export');
        btn.disabled = true;
        btn.innerHTML = '<span class="spin">↻</span> Exporting...';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = `${SVG.download} Export`;
          Toast.show('Export complete! Video ready for download.', 'success');
        }, 2800);
      });

      // Undo
      document.getElementById('ed-undo')?.addEventListener('click', () => {
        if (historyStack.length) { historyStack.pop(); Toast.show('Undo'); }
        else Toast.show('Nothing to undo', 'error');
      });

      // Init editor player
      EditorPlayer.init();
    }, 0);
  },

  _editorToolGroups() {
    const groups = [
      { id:'video', label:'Video Tools', tools:[
        { id:'trim', icon:SVG.scissors, label:'Trim' },
        { id:'cut', icon:SVG.scissors, label:'Cut Segment' },
        { id:'crop', icon:SVG.crop, label:'Crop' },
        { id:'rotate', icon:SVG.rotate, label:'Rotate' },
        { id:'speed', icon:SVG.speed, label:'Speed Control' },
      ]},
      { id:'effects', label:'Effects & Color', tools:[
        { id:'filters', icon:SVG.star, label:'Filters' },
        { id:'color', icon:SVG.sun, label:'Color Grade' },
        { id:'transitions', icon:SVG.zap, label:'Transitions' },
      ]},
      { id:'overlay', label:'Overlays', tools:[
        { id:'text', icon:SVG.text, label:'Text Overlay' },
        { id:'music', icon:SVG.music, label:'Background Music' },
        { id:'stickers', icon:SVG.star, label:'Stickers' },
      ]},
    ];
    return groups.map(g => `
      <div class="tool-section">
        <div class="tool-section-header">${g.label} ${SVG.chevDown}</div>
        <div class="tool-section-body">
          ${g.tools.map(t => `<button class="tool-item" data-tool="${t.id}">${t.icon}${t.label}</button>`).join('')}
          <div class="tool-panel" id="panel-${g.id}"></div>
        </div>
      </div>
    `).join('');
  },

  _updateEditorPanel(tool, video) {
    // Clear all panels
    document.querySelectorAll('[id^="panel-"]').forEach(p => p.innerHTML = '');
    const group = { trim:'video', cut:'video', crop:'video', rotate:'video', speed:'video', filters:'effects', color:'effects', transitions:'effects', text:'overlay', music:'overlay', stickers:'overlay' };
    const panel = document.getElementById(`panel-${group[tool]}`);
    if (!panel) return;

    switch(tool) {
      case 'trim':
        panel.innerHTML = `
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <div style="flex:1"><label class="form-label">Start</label><input class="form-input" value="0:00" style="font-size:13px"></div>
            <div style="flex:1"><label class="form-label">End</label><input class="form-input" value="${video?.duration||'4:32'}" style="font-size:13px"></div>
          </div>
          <button class="btn btn-primary w-full" onclick="Toast.show('Trim applied!','success')">Apply Trim</button>
        `;
        break;
      case 'color':
        panel.innerHTML = ['Brightness','Contrast','Saturation'].map(l => `
          <div class="slider-group">
            <div class="slider-row"><span>${l}</span><span class="sval" id="sv-${l}">50</span></div>
            <input type="range" class="range-input" min="0" max="100" value="50" style="--pct:50%"
              oninput="this.style.setProperty('--pct',(this.value)+'%');document.getElementById('sv-${l}').textContent=this.value;Toast.show('${l}: '+this.value)">
          </div>
        `).join('');
        break;
      case 'filters':
        panel.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${['Vivid','Matte','B&W','Vintage','Neon','Cinematic'].map(f=>`
            <div onclick="Toast.show('Filter: ${f} applied!','success')" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;cursor:pointer;text-align:center;font-size:12px;font-weight:600;transition:border-color 0.2s" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">${f}</div>
          `).join('')}
        </div>`;
        break;
      case 'rotate':
        panel.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${['90° CW','90° CCW','Flip H','Flip V'].map(r=>`
            <button class="btn btn-ghost" style="font-size:12px" onclick="Toast.show('${r} applied!','success')">${r}</button>
          `).join('')}
        </div>`;
        break;
      case 'speed':
        panel.innerHTML = `
          <div class="slider-group">
            <div class="slider-row"><span>Playback Speed</span><span class="sval" id="sv-speed">1.0x</span></div>
            <input type="range" class="range-input" min="10" max="200" value="100" style="--pct:50%"
              oninput="this.style.setProperty('--pct',((this.value-10)/190*100)+'%');document.getElementById('sv-speed').textContent=(this.value/100).toFixed(2)+'x'">
          </div>
          <button class="btn btn-primary w-full" onclick="Toast.show('Speed applied!','success')">Apply Speed</button>
        `;
        break;
      case 'text':
        panel.innerHTML = `
          <div class="form-group">
            <label class="form-label">Text</label>
            <input class="form-input" placeholder="Enter overlay text..." id="overlay-input" oninput="document.getElementById('overlay-text').textContent=this.value||'Text Overlay'">
          </div>
          <div class="form-group">
            <label class="form-label">Font Size</label>
            <input type="range" class="range-input" min="12" max="80" value="24" style="--pct:30%"
              oninput="this.style.setProperty('--pct',((this.value-12)/68*100)+'%');document.getElementById('overlay-text').style.fontSize=this.value+'px'">
          </div>
          <button class="btn btn-primary w-full" onclick="document.getElementById('text-overlay').classList.remove('hidden');Toast.show('Text overlay added!','success')">Add Text</button>
          <button class="btn btn-ghost w-full mt-2" onclick="document.getElementById('text-overlay').classList.add('hidden');Toast.show('Text removed')">Remove Text</button>
        `;
        break;
      case 'music':
        panel.innerHTML = `
          <div class="form-label" style="margin-bottom:8px">Select Track</div>
          ${['Ambient Calm','Epic Drums','Lo-Fi Beat','Jazz Mood','Cinematic Rise'].map(t=>`
            <button class="tool-item w-full" onclick="Toast.show('Track: ${t} added!','success')">${SVG.music}${t}</button>
          `).join('')}
          <div style="margin-top:12px"><label class="btn btn-ghost w-full" style="cursor:pointer;justify-content:center;display:flex;gap:6px;font-size:12px">${SVG.upload}<span>Upload Custom Track</span><input type="file" accept="audio/*" style="display:none" onchange="Toast.show('Audio track added!','success')"></label></div>
        `;
        break;
      default:
        panel.innerHTML = `<p style="font-size:12px;color:var(--text3);padding:4px 0">Tool options will appear here</p>`;
    }
  },

  // ── LIBRARY ─────────────────────────────────────────
  renderLibrary(container) {
    let filter = 'all';
    let search = '';
    const videos = VideoStore.getAll();
    const allTags = ['all', ...new Set(videos.flatMap(v => v.tags || []))];

    const render = () => {
      const filtered = VideoStore.getAll()
        .filter(v => filter === 'all' || (v.tags||[]).includes(filter))
        .filter(v => !search || v.title.toLowerCase().includes(search.toLowerCase()));

      const list = document.getElementById('lib-list');
      const empty = document.getElementById('lib-empty');
      if (!list) return;

      if (filtered.length === 0) {
        list.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
      } else {
        if (empty) empty.classList.add('hidden');
        list.innerHTML = filtered.map(v => `
          <div class="lib-row" onclick="Pages.navigate('player', ${v.id})">
            <div class="lib-thumb">
              ${v.src ? `<video src="${v.src}" muted preload="metadata" onloadedmetadata="this.currentTime=1" style="width:100%;height:100%;object-fit:cover"></video>` : SVG.film}
            </div>
            <div>
              <div class="lib-title">${v.title}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${(v.tags||[]).join(', ') || '—'}</div>
            </div>
            <div class="lib-meta">${v.duration}</div>
            <div class="lib-meta">${v.views} views</div>
            <div class="lib-actions" onclick="event.stopPropagation()">
              <button class="btn btn-ghost btn-icon" title="Watch" onclick="Pages.navigate('player', ${v.id})">${SVG.play}</button>
              <button class="btn btn-ghost btn-icon" title="Edit" onclick="Pages.navigate('editor', ${v.id})">${SVG.edit}</button>
              <button class="btn btn-danger btn-icon" title="Delete" onclick="VideoStore.remove(${v.id});Toast.show('Video deleted.');Pages.navigate('library')">${SVG.trash}</button>
            </div>
          </div>
        `).join('');
      }
    };

    container.innerHTML = `
      <div class="page-content">
        <div class="lib-toolbar">
          <div style="flex:1">
            <div class="section-label">My Content</div>
            <div class="section-title">${SVG.library} Video Library</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <div class="search-bar" style="width:200px">
              ${SVG.search}
              <input placeholder="Search videos..." id="lib-search">
            </div>
            <button class="btn btn-primary" onclick="Pages.navigate('upload')">${SVG.plus} Upload</button>
          </div>
        </div>
        <div class="filter-chips">
          ${allTags.map(t => `<button class="chip ${t==='all'?'active':''}" data-tag="${t}" onclick="document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.tag==='${t}'));libFilter='${t}';window._libFilter='${t}';window._libRender()">${t}</button>`).join('')}
        </div>
        <div class="lib-table">
          <div class="lib-thead">
            <span></span><span>Title</span><span>Duration</span><span>Views</span><span>Actions</span>
          </div>
          <div id="lib-list"></div>
        </div>
        <div id="lib-empty" class="empty-state hidden">
          ${SVG.film}
          <h3>No videos found</h3>
          <p>Try a different filter or upload your first video.</p>
          <button class="btn btn-primary" onclick="Pages.navigate('upload')">${SVG.upload} Upload Video</button>
        </div>
      </div>
    `;

    window._libFilter = 'all';
    window._libRender = () => {
      filter = window._libFilter || 'all';
      render();
    };

    setTimeout(() => {
      render();
      document.getElementById('lib-search')?.addEventListener('input', (e) => {
        search = e.target.value;
        render();
      });
    }, 0);
  },
};

// ── EDITOR PLAYER (mini) ───────────────────────────────────
const EditorPlayer = {
  init() {
    this.video = document.getElementById('editor-video');
  },
  toggle() {
    if (!this.video) return;
    const btn = document.getElementById('ed-play-btn');
    if (this.video.paused) {
      this.video.play();
      if (btn) btn.innerHTML = SVG.pause;
    } else {
      this.video.pause();
      if (btn) btn.innerHTML = SVG.play;
    }
    this.video.addEventListener('timeupdate', () => {
      const t = document.getElementById('ed-time');
      if (t) t.textContent = `${fmtTime(this.video.currentTime)} / ${fmtTime(this.video.duration)}`;
    }, { once: false });
  },
  skip(s) {
    if (!this.video) return;
    this.video.currentTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + s));
  }
};

// ── SIDEBAR COLLAPSE ─────────────────────────────────────
function initSidebar() {
  const btn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main-wrapper');
  if (!btn || !sidebar || !main) return;
  btn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
  });
}

// ── SEARCH ────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) {
        Pages.navigate('library');
        setTimeout(() => {
          const libSearch = document.getElementById('lib-search');
          if (libSearch) { libSearch.value = q; libSearch.dispatchEvent(new Event('input')); }
        }, 50);
      }
    }
  });
}

// ── BOOT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initSearch();
  Pages.navigate('home');

  // Nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => Pages.navigate(el.dataset.page));
  });

  // Close speed menu on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.speed-badge') && !e.target.closest('.speed-menu')) {
      document.getElementById('speed-menu')?.classList.remove('open');
    }
  });
});
