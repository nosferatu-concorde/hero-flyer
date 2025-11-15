import Phaser from 'phaser';
import { GAME_CONFIG } from './config/constants';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

/**
 * Main entry point - Initialize and configure Phaser game
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'game',
  backgroundColor: '#F5F5DC',
  fps: {
    target: GAME_CONFIG.FPS,
    forceSetTimeOut: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // We set gravity per-object
      debug: false // Set to true to see collision boundaries
    }
  },
  scene: [StartScene, GameScene, GameOverScene]
};

// Create and start the game
const game = new Phaser.Game(config);

// Export for potential debugging
export default game;
