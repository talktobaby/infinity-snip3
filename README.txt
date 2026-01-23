Infinity ∞SNIP3 — Project v3

Run:
- Open index.html in a modern browser (Chrome/Edge/Firefox).
- Local files: some browsers restrict audio autoplay; press any key/click once at boot to unlock audio.

Key fixes in v3:
- Settings are scrollable (wheel/trackpad scrolls list; click-drag also scrolls).
- Default: 1 player; Debug HUD hidden by default.
- Boot sound "Moses Laser Cannon" retry logic improved (opts.attempts supported).
- Network layer shipped but disabled by default; single-player/local play will not attempt any connections unless explicitly enabled via window.SNIP3_NET_CONFIG.

Network enabling (optional/dev):
- In devtools console before loading network.js, set:
  window.SNIP3_NET_CONFIG = { enabled:true, signalingUrl:'wss://YOUR_SERVER', allowMusicStream:false, offlineOnly:false };

Files:
- js/ contains modular systems (not required by index.html unless you integrate them per INTEGRATION_GUIDE.md).
- audio/ contains the included sfx/music assets.
