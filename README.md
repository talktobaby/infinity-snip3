# ∞SNIP3 - NEO-VECTR™ Arena Combat

![NEO-VECTR](https://img.shields.io/badge/NEO--VECTR™-INC-cyan)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop%20%7C%20Mobile-purple)

> **Neon-drenched pie-slice arena combat for 1-8 players locally, or up to 99 in Battle Royale!**

## 🎮 Play Now


[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/garebear99)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-ff5e5b?style=flat&logo=ko-fi)](https://ko-fi.com/luciferai)
[![Sponsor](https://img.shields.io/badge/Sponsor-u2764ufe0f-red?style=flat&logo=github-sponsors)](https://github.com/sponsors/GareBear99)**[▶️ Play in Browser](https://garebear99.github.io/infinity-snip3/)** *(GitHub Pages)*

Or open `index.html` in any modern browser.

---

## ✨ Features

### 🕹️ Game Modes
- **Free-for-All (FFA)** - Classic pie-slice arena combat (1-8 players)
- **Battle Royale** - Up to 99 players with shrinking arena
- **Custom** - Configurable rules and settings

### 🌐 Multiplayer
- **P2P WebRTC** - Low-latency direct connections
- **Client-side prediction** - Instant feedback, no input lag
- **Delta compression** - Minimal bandwidth (~5 KB/s per player)
- **Host migration** - Game continues if host disconnects

### 🎵 Audio
- **Original soundtrack** by **TRNDSTR**
- **Spatial 3D audio** - Sounds positioned in game world
- **Dynamic ducking** - Music lowers during intense combat
- **Per-category controls** - Adjust laser, ricochet, boost, explosion, menu sounds

### 📱 Cross-Platform
- **Desktop** - Windows, macOS, Linux
- **Mobile** - iOS, Android (touch controls)
- **Tablet** - iPad, Android tablets
- **Raspberry Pi** - Optimized for low-power devices
- **Game Consoles** - PS5, Xbox, Switch (via browser)

---

## 🚀 Quick Start

### Browser (Easiest)
```bash
# Clone the repository
git clone https://github.com/GareBear99/infinity-snip3.git

# Open in browser
open infinity-snip3/index.html
```

### Local Server (Recommended for multiplayer)
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve

# Then open http://localhost:8080
```

---

## 🎮 Controls

### Keyboard & Mouse (Player 1)
| Action | Control |
|--------|---------|
| Move | WASD or Arrow Keys |
| Aim | Mouse |
| Fire | Left Click or Space |
| Charge Shot | Hold Space |
| Boost | Shift |

### Gamepad (Up to 4 players)
| Action | Control |
|--------|---------|
| Move | Left Stick |
| Aim | Right Stick |
| Fire | RT / R2 |
| Boost | LT / L2 |

### Touch (Mobile)
- **Left side**: Virtual joystick for movement
- **Right side**: Tap to fire, drag to aim

---

## 🔧 Configuration

### Quality Settings
Press `1`, `2`, or `3` to switch quality:
- **1** - Low (30 FPS, minimal effects) - Raspberry Pi
- **2** - Medium (60 FPS, balanced)
- **3** - High (60 FPS, all effects)

### Debug Overlay
Press **CapsLock + Tab** to toggle debug HUD showing:
- FPS, frame time, memory
- Network status, ping
- File validation, errors

### Network Configuration
```javascript
// Enable multiplayer (set before loading)
window.SNIP3_NET_CONFIG = {
  enabled: true,
  signalingUrl: 'wss://your-signaling-server.com',
  allowMusicStream: false,
};
```

---

## 📁 Project Structure

```
Infinity_SN1P3/
├── index.html              # Main game (all-in-one HTML)
├── js/                     # Modular JavaScript systems
│   ├── game-init.js        # Central initialization
│   ├── network.js          # WebRTC P2P networking
│   ├── network-input.js    # Input synchronization
│   ├── network-state.js    # State broadcasting
│   ├── network-privacy.js  # IP protection (TURN relay)
│   ├── audio-control.js    # Web Audio engine
│   ├── audio-gui.js        # Audio settings UI
│   ├── touch-controls.js   # Mobile touch input
│   ├── platform-compatibility.js  # Device detection
│   ├── game-modes.js       # FFA, Battle Royale, Custom
│   ├── battle-royale-system.js    # 99-player mode
│   ├── menu-arrow-3d.js    # 3D spinning menu arrow
│   ├── enhanced-menu.js    # Dramatic boot sequence
│   ├── shape-editor.js     # Custom ship shapes
│   ├── credits.js          # Credits screen
│   └── system-checker.js   # Debug overlay
├── audio/                  # Sound effects & music
│   ├── laser-gun-81720.mp3
│   ├── laser-45816.mp3
│   ├── rayo-laser-101851.mp3
│   ├── laser-zap-2-90669.mp3
│   └── the-moses-laser-cannon-182841.mp3
├── INTEGRATION_GUIDE.md    # Network integration docs
├── SCRIPT_LOADING_ORDER.md # Module dependencies
└── README.md               # This file
```

---

## 🏗️ Architecture

### Network Model
```
┌─────────────┐     ┌─────────────┐
│   Client    │────▶│    Host     │
│  (inputs)   │     │  (state)    │
└─────────────┘     └─────────────┘
      │                    │
      │   WebRTC P2P       │
      │   (24 bytes/60Hz)  │   (200 bytes/20Hz)
      ▼                    ▼
┌─────────────────────────────────┐
│     Authoritative Game State    │
│  • Physics   • Collision        │
│  • Scoring   • Events           │
└─────────────────────────────────┘
```

### Audio Pipeline
```
Source → Gain → Panner (3D) → SFX Gain ─┐
                                         ├→ Master Gain → Compressor → Output
Music Source → Fade Gain → Music Gain ──┘
```

---

## 🎵 Credits

### Music
**TRNDSTR** - All original tracks
- Boot Theme: "The Moses Laser Cannon"
- *(Additional tracks in development)*

### Development
**NEO-VECTR™ INC** - Arcade Systems Division

### Technologies
- HTML5 Canvas
- Web Audio API
- WebRTC (P2P networking)
- Custom 2D physics engine

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

**Music by TRNDSTR** - Used with permission.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 🐛 Known Issues

- Safari: May require click to unlock audio
- Mobile: Some devices may need reduced quality
- Network: Requires signaling server for online multiplayer

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/GareBear99/infinity-snip3/issues)
- **Discord**: Coming soon
- **Email**: support@neovectr.com

---

<div align="center">

**NEO-VECTR™ INC** • Arcade Systems • 2026

*"Cyberpunk Arcade Revolution"*

</div>
