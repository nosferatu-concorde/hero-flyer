import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';

/**
 * Player entity with physics, energy system, and flap mechanics
 */
export class Player {
  public sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {

    // Create player as a sprite at 50% of original size
    this.sprite = scene.add.sprite(x, y, 'hero');
    this.sprite.setScale(0.5);

    // Enable physics
    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(GAME_CONFIG.GRAVITY);
    body.setCollideWorldBounds(false); // Allow going off screen for game over detection

    // Add subtle flying animation (rotate back and forth)
    scene.tweens.add({
      targets: this.sprite,
      angle: 3, // Rotate 3 degrees clockwise
      duration: 300,
      yoyo: true, // Then back to -3 degrees counter-clockwise
      repeat: -1, // Repeat forever
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Make the player flap upward
   */
  public flap(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(GAME_CONFIG.FLAP_FORCE);
  }

  /**
   * Check if player has hit the ground or ceiling
   */
  public isOutOfBounds(): boolean {
    return this.sprite.y <= 0 || this.sprite.y >= GAME_CONFIG.HEIGHT;
  }

  /**
   * Reset player to starting position
   */
  public reset(): void {
    this.sprite.setPosition(GAME_CONFIG.PLAYER_START_X, GAME_CONFIG.PLAYER_START_Y);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.sprite.destroy();
  }
}
