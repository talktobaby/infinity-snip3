/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NEO-VECTR ∞SNIP3 - GAME INITIALIZATION MODULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Central initialization system that:
 * - Sequences all subsystem startup in correct order
 * - Handles dependency injection between modules
 * - Provides unified game state management
 * - Coordinates error recovery and graceful degradation
 * 
 * LOAD ORDER (managed by this module):
 * 1. Platform detection
 * 2. Audio system
 * 3. Touch controls (if applicable)
 * 4. Network privacy settings
 * 5. Network core
 * 6. Network input/state
 * 7. Game modes
 * 8. UI components (menu, credits, shape editor)
 * 9. System checker/debug overlay
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED GAME STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Central game state - shared across all modules
 * This replaces the need for scattered global variables
 */
const GameState = {
  // Core game objects
  players: [],
  lasers: [],
  particles: [],
  
  // Arena configuration
  arena: {
    cx: 0,
    cy: 0,
    r: 400,
  },
  
  // Timing
  tSec: 0,
  deltaTime: 0,
  lastFrameTime: 0,
  
  // Scoring
  playerScore: [],
  playerLives: [],
  currentRound: 0,
  
  // Mode
  appMode: 'BOOT_WAIT', // 'BOOT_WAIT', 'BOOT', 'MENU', 'SETTINGS', 'GAME', 'PAUSE'
  gameMode: 'FFA',       // 'FFA', 'BATTLE_ROYALE', 'CUSTOM'
  playerCount: 1,
  
  // Canvas reference (set during init)
  canvas: null,
  ctx: null,
  
  // Input state
  keys: new Set(),
  mouseDown: false,
  mouseX: 0,
  mouseY: 0,
  aimAngle: 0,
  
  // Audio state
  audioUnlocked: false,
  bootAudioPlaying: false,
  
  // Network state
  isOnline: false,
  isHost: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION STATUS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tracks initialization status of each subsystem
 */
const InitStatus = {
  platform: false,
  audio: false,
  touch: false,
  network: false,
  gameModes: false,
  ui: false,
  systemChecker: false,
  
  // Errors encountered during init
  errors: [],
  warnings: [],
  
  // Overall status
  isComplete: false,
  startTime: 0,
  endTime: 0,
};

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize all game subsystems
 * Call this once at game start (after user gesture for audio)
 * 
 * @param {HTMLCanvasElement} canvas - Main game canvas
 * @param {Object} options - Initialization options
 * @returns {Promise<boolean>} - True if all critical systems initialized
 */
async function initGame(canvas, options = {}) {
  InitStatus.startTime = performance.now();
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('NEO-VECTR ∞SNIP3 - GAME INITIALIZATION');
  console.log('═══════════════════════════════════════════════════════');
  
  // Store canvas reference
  GameState.canvas = canvas;
  GameState.ctx = canvas.getContext('2d');
  
  // 1. Platform Detection
  try {
    if (typeof PlatformCompat !== 'undefined') {
      PlatformCompat.detect();
      InitStatus.platform = true;
      console.log('[INIT] ✓ Platform detection complete');
      console.log(`[INIT]   Device: ${PlatformCompat.info.isDesktop ? 'Desktop' : 
                                     PlatformCompat.info.isMobile ? 'Mobile' : 
                                     PlatformCompat.info.isTablet ? 'Tablet' : 'Unknown'}`);
    } else {
      console.warn('[INIT] ⚠ PlatformCompat not available');
      InitStatus.warnings.push('Platform detection skipped');
    }
  } catch (e) {
    console.error('[INIT] ✗ Platform detection failed:', e);
    InitStatus.errors.push('Platform: ' + e.message);
  }
  
  // 2. Audio System
  try {
    if (typeof AudioControl !== 'undefined') {
      await AudioControl.initAudioSystem();
      InitStatus.audio = true;
      GameState.audioUnlocked = true;
      console.log('[INIT] ✓ Audio system initialized');
    } else {
      console.warn('[INIT] ⚠ AudioControl not available');
      InitStatus.warnings.push('Audio system not loaded');
    }
  } catch (e) {
    console.error('[INIT] ✗ Audio system failed:', e);
    InitStatus.errors.push('Audio: ' + e.message);
  }
  
  // 3. Touch Controls (if touch device)
  try {
    if (typeof TouchControls !== 'undefined') {
      const hasTouch = PlatformCompat?.hasTouch() || 
                       ('ontouchstart' in window);
      if (hasTouch) {
        TouchControls.init();
        InitStatus.touch = true;
        console.log('[INIT] ✓ Touch controls initialized');
      } else {
        console.log('[INIT] - Touch controls skipped (no touch support)');
      }
    }
  } catch (e) {
    console.error('[INIT] ✗ Touch controls failed:', e);
    InitStatus.errors.push('Touch: ' + e.message);
  }
  
  // 4. Network System (if enabled)
  try {
    if (typeof NetworkAPI !== 'undefined' && options.enableNetwork) {
      NetworkAPI.initNetwork({
        onPeerConnected: (playerId) => {
          console.log(`[NETWORK] Player ${playerId + 1} connected`);
          GameState.isOnline = true;
        },
        onPeerDisconnected: (playerId) => {
          console.log(`[NETWORK] Player ${playerId + 1} disconnected`);
        },
        onHostMigration: (newHostId) => {
          console.log(`[NETWORK] Host migrated to Player ${newHostId + 1}`);
          GameState.isHost = (newHostId === NetworkAPI.NetworkState.myPlayerId);
        },
        onMessage: (message) => {
          // Handle custom messages (music streaming, chat, etc.)
          handleNetworkMessage(message);
        },
      });
      InitStatus.network = true;
      console.log('[INIT] ✓ Network system initialized');
    } else {
      console.log('[INIT] - Network system skipped (disabled or not loaded)');
    }
  } catch (e) {
    console.error('[INIT] ✗ Network system failed:', e);
    InitStatus.errors.push('Network: ' + e.message);
  }
  
  // 5. Game Modes
  try {
    if (typeof GameModeManager !== 'undefined') {
      GameModeManager.init(GameModeManager.Modes.FFA, {
        playerCount: options.playerCount || 4,
        respawnEnabled: true,
        respawnDelay: 3.0,
      });
      InitStatus.gameModes = true;
      console.log('[INIT] ✓ Game modes initialized');
    }
  } catch (e) {
    console.error('[INIT] ✗ Game modes failed:', e);
    InitStatus.errors.push('GameModes: ' + e.message);
  }
  
  // 6. UI Components
  try {
    if (typeof MenuArrow3D !== 'undefined') {
      MenuArrow3D.init(100, 300);
    }
    if (typeof Credits !== 'undefined') {
      // Credits ready to use
    }
    InitStatus.ui = true;
    console.log('[INIT] ✓ UI components initialized');
  } catch (e) {
    console.error('[INIT] ✗ UI components failed:', e);
    InitStatus.errors.push('UI: ' + e.message);
  }
  
  // 7. System Checker
  try {
    if (typeof SystemChecker !== 'undefined') {
      await SystemChecker.runBootChecks();
      InitStatus.systemChecker = true;
      console.log('[INIT] ✓ System checker initialized');
    }
  } catch (e) {
    console.error('[INIT] ✗ System checker failed:', e);
    InitStatus.errors.push('SystemChecker: ' + e.message);
  }
  
  // Complete
  InitStatus.endTime = performance.now();
  InitStatus.isComplete = true;
  
  const duration = (InitStatus.endTime - InitStatus.startTime).toFixed(1);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`[INIT] Initialization complete in ${duration}ms`);
  console.log(`[INIT] Errors: ${InitStatus.errors.length}, Warnings: ${InitStatus.warnings.length}`);
  console.log('═══════════════════════════════════════════════════════');
  
  return InitStatus.errors.length === 0;
}

/**
 * Handle custom network messages
 * @param {Object} message - Network message
 */
function handleNetworkMessage(message) {
  switch (message.type) {
    case 'MUSIC_STREAM_START':
      console.log('[NETWORK] Music stream started from host');
      // Handle music streaming if AudioControl available
      break;
      
    case 'CHAT_MESSAGE':
      console.log(`[CHAT] Player ${message.playerId}: ${message.text}`);
      break;
      
    default:
      console.log('[NETWORK] Unknown message type:', message.type);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GAME LOOP HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Update game state (call every frame)
 * Coordinates all subsystem updates
 * 
 * @param {number} dt - Delta time in seconds
 */
function updateGameState(dt) {
  GameState.deltaTime = dt;
  GameState.tSec += dt;
  
  // Update game modes (handles respawning, bounds checking)
  if (typeof GameModeManager !== 'undefined' && GameState.appMode === 'GAME') {
    GameModeManager.update(GameState.players, dt);
  }
  
  // Update touch controls
  if (typeof TouchControls !== 'undefined' && TouchControls.state.enabled) {
    const movement = TouchControls.getMovement();
    if (movement.magnitude > 0) {
      // Apply touch movement to local player
      // This integrates with existing input system
    }
  }
  
  // Update network (send inputs, receive state)
  if (GameState.isOnline && typeof NetworkAPI !== 'undefined') {
    if (!GameState.isHost) {
      // Client: send inputs
      if (typeof updateInputSystem === 'function') {
        updateInputSystem(dt, {
          keys: GameState.keys,
          mouseDown: GameState.mouseDown,
          aimAngle: GameState.aimAngle,
        });
      }
    }
  }
  
  // Update menu arrow
  if (GameState.appMode === 'MENU' && typeof MenuArrow3D !== 'undefined') {
    MenuArrow3D.update(dt);
  }
  
  // Update debug metrics
  if (typeof SystemChecker !== 'undefined') {
    SystemChecker.updateMetrics(dt, 1 / dt);
  }
}

/**
 * Reset game state for new match
 * @param {number} playerCount - Number of players
 */
function resetGameState(playerCount) {
  GameState.players = [];
  GameState.lasers = [];
  GameState.particles = [];
  GameState.playerScore = new Array(playerCount).fill(0);
  GameState.playerLives = new Array(playerCount).fill(3);
  GameState.currentRound = 1;
  GameState.tSec = 0;
  
  console.log(`[GAME] Reset for ${playerCount} players`);
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get recommended quality based on platform
 * @returns {string} - 'low', 'medium', or 'high'
 */
function getRecommendedQuality() {
  if (typeof PlatformCompat !== 'undefined') {
    return PlatformCompat.getRecommendedQuality();
  }
  return 'medium';
}

/**
 * Get max supported players
 * @returns {number} - Max player count
 */
function getMaxPlayers() {
  if (typeof PlatformCompat !== 'undefined') {
    return PlatformCompat.getMaxPlayers();
  }
  return 8;
}

/**
 * Check if feature is supported
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
function isFeatureSupported(feature) {
  if (typeof PlatformCompat !== 'undefined') {
    return PlatformCompat.canHandle(feature);
  }
  return true; // Assume supported if no platform compat
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

window.GameInit = {
  // State
  GameState,
  InitStatus,
  
  // Initialization
  init: initGame,
  
  // Game loop
  update: updateGameState,
  reset: resetGameState,
  
  // Utilities
  getRecommendedQuality,
  getMaxPlayers,
  isFeatureSupported,
};

console.log('[GameInit] Initialization module loaded');
console.log('[GameInit] Call GameInit.init(canvas, options) to start');
