# NEO-VECTR ∞SNIP3 - Script Loading Order & Integration Guide

## ⚠️ CRITICAL: Proper Loading Order

The modules have dependencies that **must** be respected. Load scripts in this exact order in `index.html`:

```html
<!-- Core Platform & Compatibility -->
<script src="js/platform-compatibility.js"></script>

<!-- Audio System -->
<script src="js/audio-control.js"></script>
<script src="js/audio-gui.js"></script>

<!-- Input Systems -->
<script src="js/touch-controls.js"></script>

<!-- Network Core (load in this order!) -->
<script src="js/network-privacy.js"></script>
<script src="js/network.js"></script>
<script src="js/network-input.js"></script>
<script src="js/network-state.js"></script>

<!-- Game Systems -->
<script src="js/game-modes.js"></script>
<script src="js/battle-royale-system.js"></script>

<!-- UI Components -->
<script src="js/menu-arrow-3d.js"></script>
<script src="js/enhanced-menu.js"></script>
<script src="js/shape-editor.js"></script>
<script src="js/credits.js"></script>

<!-- System Tools -->
<script src="js/system-checker.js"></script>

<!-- Game Initialization (load last!) -->
<script src="js/game-init.js"></script>
```

---

## 🚀 Initialization in index.html

Replace the existing initialization code with:

```javascript
// After canvas setup and before game loop
let gameInitialized = false;

async function firstInteraction(event) {
  if (gameInitialized) return;
  gameInitialized = true;
  
  // Remove one-time listeners
  window.removeEventListener('pointerdown', firstInteraction, true);
  window.removeEventListener('keydown', firstInteraction, true);
  
  console.log('[BOOT] User gesture detected, initializing game...');
  
  try {
    // Initialize all game subsystems
    const success = await GameInit.init(canvas, {
      playerCount: parseInt(document.getElementById('playerCount')?.value || '1'),
      enableNetwork: false, // Set to true to enable multiplayer
    });
    
    if (!success) {
      console.warn('[BOOT] Some systems failed to initialize (check logs)');
      // Game can still run with warnings
    }
    
    // Start boot sequence
    appMode = 'BOOT';
    bootT0 = performance.now();
    
    // Boot audio (already handled by AudioControl)
    if (typeof AudioControl !== 'undefined') {
      AudioControl.playMusic('bootTheme', false);
    }
    
  } catch (error) {
    console.error('[BOOT] Initialization failed:', error);
    showError('Game initialization failed: ' + error.message);
  }
}

// Install gesture listeners
window.addEventListener('pointerdown', firstInteraction, true);
window.addEventListener('keydown', firstInteraction, true);
```

---

## 🎮 Game Loop Integration

Update your main `frameLoop()` function:

```javascript
function frameLoop() {
  const now = performance.now();
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  
  // Update game state (coordinates all subsystems)
  GameInit.update(dt);
  
  // Calculate FPS
  fpsFrames++;
  fpsTimer += dt;
  if (fpsTimer >= 0.5) {
    currentFPS = fpsFrames / fpsTimer;
    fpsFrames = 0;
    fpsTimer = 0;
  }
  
  // Existing game logic here...
  
  // Render debug overlay (always last, so it's on top)
  if (typeof SystemChecker !== 'undefined') {
    SystemChecker.renderDebug(ctx, canvas.width, canvas.height, GameInit.GameState.appMode);
    
    // Auto-hide after boot completes
    if (GameInit.GameState.appMode === 'MENU') {
      SystemChecker.autoHideAfterBoot();
    }
  }
  
  requestAnimationFrame(frameLoop);
}
```

---

## 🌐 Network Configuration

To enable multiplayer, configure before loading scripts:

```html
<script>
// Configure network BEFORE loading network.js
window.SNIP3_NET_CONFIG = {
  enabled: true,
  signalingUrl: 'wss://your-signaling-server.com',
  allowMusicStream: false,
  offlineOnly: false,
};
</script>

<!-- Then load network scripts -->
<script src="js/network-privacy.js"></script>
<script src="js/network.js"></script>
<!-- etc... -->
```

For local development without a signaling server:
```javascript
window.SNIP3_NET_CONFIG = {
  enabled: false, // Disable network
};
```

---

## 🎵 Audio Setup

Audio files should be in `audio/` directory:
- `audio/laser-gun-81720.mp3` - Shoot SFX
- `audio/laser-45816.mp3` - Ricochet SFX
- `audio/rayo-laser-101851.mp3` - Boost SFX
- `audio/laser-zap-2-90669.mp3` - Explosion SFX
- `audio/the-moses-laser-cannon-182841.mp3` - Boot theme (TRNDSTR)

Add more TRNDSTR tracks as they become available.

---

## 🔧 Platform-Specific Notes

### Raspberry Pi
- Automatically detected and optimized
- Sets low quality, 30 FPS, 4 players max
- Disables heavy effects

### Mobile/Touch Devices
- Touch controls auto-initialize
- Optimized quality settings
- Virtual joysticks appear automatically

### Desktop
- Full quality, 60 FPS
- Mouse + keyboard controls
- Gamepad support for up to 4 players

---

## 🐛 Debug Controls

- **CapsLock + Tab** - Toggle debug overlay (works on BOOT, MENU, and GAME screens)
- Debug overlay shows:
  - Version info
  - File status
  - Performance (FPS, frame time, memory)
  - Network status
  - Errors and warnings

---

## ✅ Verification Checklist

After integration, verify:

1. ✅ All 15 JS modules load without errors
2. ✅ Console shows `[GameInit] Initialization module loaded`
3. ✅ Platform detection runs: `[INIT] ✓ Platform detection complete`
4. ✅ Audio system initializes: `[INIT] ✓ Audio system initialized`
5. ✅ No `undefined` function errors in console
6. ✅ Debug overlay shows with CapsLock + Tab
7. ✅ Boot sequence plays with audio
8. ✅ Menu appears after boot completes

---

## 🔥 Common Issues & Fixes

### "NetworkState is not defined"
**Fix:** Ensure `network.js` is loaded before `network-state.js`

### "popGameEvents is not a function"
**Fix:** Load `network-input.js` before `network-state.js`

### Audio files not loading
**Fix:** Check paths in `audio-control.js` match your `audio/` directory

### Network disabled warning
**Fix:** Configure `window.SNIP3_NET_CONFIG` before loading network scripts

### Touch controls not working
**Fix:** Ensure `TouchControls.init()` is called (handled by `game-init.js`)

---

## 📦 Module Dependencies

```
platform-compatibility.js    (no dependencies)
  ↓
audio-control.js            (no dependencies)
audio-gui.js                → audio-control.js
  ↓
touch-controls.js           (no dependencies)
  ↓
network-privacy.js          (no dependencies)
network.js                  → network-privacy.js
network-input.js            → network.js
network-state.js            → network.js, network-input.js
  ↓
game-modes.js               (no dependencies)
battle-royale-system.js     (no dependencies)
  ↓
menu-arrow-3d.js            → audio-control.js (optional)
enhanced-menu.js            → menu-arrow-3d.js
shape-editor.js             (no dependencies)
credits.js                  (no dependencies)
  ↓
system-checker.js           → network.js (optional)
  ↓
game-init.js                → ALL of the above
```

---

## 🎯 Next Steps

1. ✅ Fixed critical bugs (Promise resolution, memory leaks, path errors)
2. ✅ Added error handling to WebRTC
3. ✅ Fixed cross-module references
4. ✅ Created central initialization module
5. 🔄 Complete shape-editor.js (truncated file)
6. 📝 Add TypeScript definitions (optional, for IDE support)
7. 🧪 Create test suite
8. 🚀 Deploy signaling server

---

## 📄 License & Credits

Music by **TRNDSTR** - All tracks credited in-game and in CREDITS.md

Game engine: NEO-VECTR™ INC • Build 2026.01.22 • v1.0.0
