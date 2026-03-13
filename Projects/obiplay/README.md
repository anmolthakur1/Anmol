# ObiPlay — Video Platform by Obi Enterprises

## How to Run

1. **Open directly in browser:** Double-click `index.html`  
   *(Recommended: serve via a local server for full functionality)*

2. **Local server (optional, for best results):**
   ```bash
   # Python 3
   python -m http.server 8080
   # Then open: http://localhost:8080
   
   # Node.js (npx)
   npx serve .
   ```

## Features

### 🏠 Homepage
- Animated hero section with stats
- Trending video grid
- Quick action cards

### 🎬 Video Player
- Full custom HTML5 controls
- Play/Pause, Forward/Rewind ±10s
- Volume control & mute
- Playback speed (0.25x – 2x)
- Cinematic mode (letterbox bars)
- Picture-in-Picture
- Fullscreen
- Playlist sidebar with thumbnail previews

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| Space | Play / Pause |
| → | +10 seconds |
| ← | -10 seconds |
| ↑ | Volume up |
| ↓ | Volume down |
| M | Toggle mute |
| F | Fullscreen |
| C | Cinematic mode |

### 📤 Upload System ✅ FIXED
- Drag & drop video files
- Click to browse from device
- File type validation (video/* only)
- 2GB file size limit check
- Upload progress bar with %
- Metadata form: title, description, tags
- Auto-fills title from filename
- Uploaded videos immediately appear in library & player

### ✂️ Video Editor
- Multi-section tool sidebar (collapsible)
- Tools: Trim, Cut, Crop, Rotate, Speed
- Effects: Filters, Color Grade (Brightness/Contrast/Saturation), Transitions
- Overlays: Text, Background Music, Stickers
- Live text overlay preview on video
- Multi-track timeline (Video / Audio / Text)
- Clickable playhead
- Undo/Redo system
- Export simulation

### 📚 Video Library
- Searchable, filterable table
- Tag-based filter chips
- Actions: Watch, Edit, Delete per video
- Thumbnail previews for uploaded videos

## File Structure
```
obiplay/
├── index.html        # Main entry point
├── css/
│   └── style.css     # All styles
├── js/
│   └── app.js        # All JavaScript logic
└── README.md
```

## Tech Stack
- Pure HTML5, CSS3, Vanilla JavaScript
- Google Fonts (Syne + DM Sans)
- Native HTML5 Video API
- File API for uploads
- No dependencies, no build step required

## Browser Support
Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
