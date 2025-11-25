/**
 * Game constants - All tunable values in one place for easy balancing
 * Adjust these values to change the game feel and difficulty
 */

export const GAME_CONFIG = {
  // Canvas dimensions
  WIDTH: 800,
  HEIGHT: 600,

  // Performance
  FPS: 60,

  // Physics
  GRAVITY: 800, // Downward acceleration
  FLAP_FORCE: -350, // Upward velocity on flap (negative = up)

  // Player
  PLAYER_WIDTH: 64,
  PLAYER_HEIGHT: 64,
  PLAYER_COLOR: 0xff0000, // Red
  PLAYER_START_X: 150, // Left-center of screen
  PLAYER_START_Y: 300, // Center height

  // Pipes
  PIPE_WIDTH: 80,
  PIPE_COLOR: 0x00ff00, // Green
  PIPE_GAP_SIZE: 180, // Vertical gap between top and bottom pipes
  PIPE_SPEED: 300, // Horizontal scroll speed (pixels per second)
  PIPE_SPAWN_INTERVAL: 2000, // Milliseconds between pipe spawns
  PIPE_MIN_GAP_Y: 150, // Minimum Y position for gap center
  PIPE_MAX_GAP_Y: 450, // Maximum Y position for gap center
  PIPE_POOL_SIZE: 6, // Number of pipe pairs to create for pooling

  // Collectibles
  COLLECTIBLE_RADIUS: 15,
  COLLECTIBLE_COLOR: 0xffff00, // Yellow

  // UI
  SCORE_X: 400, // Center top
  SCORE_Y: 50,
  SCORE_FONT_SIZE: 48,

  // Text styles
  TEXT_STYLE: {
    fontSize: "32px",
    color: "#ffffff",
    fontFamily: "VT323, monospace",
  },

  TITLE_STYLE: {
    fontSize: "64px",
    color: "#ffffff",
    fontFamily: "VT323, monospace",
  },

  SCORE_STYLE: {
    fontSize: "68px",
    color: "#ffffff",
    fontFamily: "VT323, monospace",
  },
};
