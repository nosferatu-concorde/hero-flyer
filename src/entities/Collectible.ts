import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/constants';

/**
 * Collectible item (beer can) that restores energy
 */
export class Collectible {
  public sprite: Phaser.GameObjects.Arc;
  public active: boolean;

  constructor(scene: Phaser.Scene) {
    this.active = false;

    // Create as a yellow circle
    this.sprite = scene.add.circle(
      0,
      0,
      GAME_CONFIG.COLLECTIBLE_RADIUS,
      GAME_CONFIG.COLLECTIBLE_COLOR
    );
    scene.physics.add.existing(this.sprite);
    
    // Make it static (no gravity)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    this.sprite.setVisible(false);
  }

  /**
   * Spawn the collectible at a specific position
   * @param x Horizontal position
   * @param y Vertical position
   */
  public spawn(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVisible(true);
    this.active = true;
  }

  /**
   * Update collectible position (scroll left with pipes)
   * @param delta Time since last update in milliseconds
   */
  public update(delta: number): void {
    if (!this.active) return;

    const moveAmount = (GAME_CONFIG.PIPE_SPEED * delta) / 1000;
    this.sprite.x -= moveAmount;

    // Deactivate if off screen
    if (this.sprite.x < -GAME_CONFIG.COLLECTIBLE_RADIUS * 2) {
      this.deactivate();
    }
  }

  /**
   * Deactivate and hide the collectible
   */
  public deactivate(): void {
    this.active = false;
    this.sprite.setVisible(false);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.sprite.destroy();
  }
}

/**
 * Manages a pool of collectibles for efficient reuse
 */
export class CollectiblePool {
  private pool: Collectible[];

  constructor(scene: Phaser.Scene, poolSize: number) {
    this.pool = [];

    // Create pool of collectibles
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(new Collectible(scene));
    }
  }

  /**
   * Get an inactive collectible from the pool
   * @returns Collectible if available, null if all are active
   */
  public get(): Collectible | null {
    return this.pool.find(collectible => !collectible.active) || null;
  }

  /**
   * Get all active collectibles
   */
  public getActive(): Collectible[] {
    return this.pool.filter(collectible => collectible.active);
  }

  /**
   * Update all active collectibles
   * @param delta Time since last update in milliseconds
   */
  public update(delta: number): void {
    this.pool.forEach(collectible => collectible.update(delta));
  }

  /**
   * Deactivate all collectibles
   */
  public reset(): void {
    this.pool.forEach(collectible => collectible.deactivate());
  }

  /**
   * Clean up all collectibles
   */
  public destroy(): void {
    this.pool.forEach(collectible => collectible.destroy());
    this.pool = [];
  }
}
