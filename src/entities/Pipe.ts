import Phaser from "phaser";
import { GAME_CONFIG } from "../config/constants";

/**
 * Represents a pair of pipes (top and bottom) with a gap in the middle
 */
export class PipePair {
  public topPipe: Phaser.GameObjects.Sprite;
  public bottomPipe: Phaser.GameObjects.Sprite;
  public active: boolean;
  public scored: boolean; // Track if player has scored from this pipe

  constructor(scene: Phaser.Scene) {
    this.active = false;
    this.scored = false;

    // Create top pipe (flipped upside down)
    this.topPipe = scene.add.sprite(0, 0, "pipe");
    this.topPipe.setFlipY(true); // Flip for top pipe
    scene.physics.add.existing(this.topPipe, true); // true = static body

    // Create bottom pipe
    this.bottomPipe = scene.add.sprite(0, 0, "pipe");
    scene.physics.add.existing(this.bottomPipe, true);

    // Initially hide pipes
    this.topPipe.setVisible(false);
    this.bottomPipe.setVisible(false);
  }

  /**
   * Spawn the pipe pair at a specific position with a random gap
   * @param x Horizontal position to spawn at
   */
  public spawn(x: number): void {
    // Random gap center Y position
    const gapCenterY = Phaser.Math.Between(
      GAME_CONFIG.PIPE_MIN_GAP_Y,
      GAME_CONFIG.PIPE_MAX_GAP_Y
    );

    const halfGap = GAME_CONFIG.PIPE_GAP_SIZE / 2;

    // Position top pipe (extends from top of screen to gap)
    const topPipeHeight = gapCenterY - halfGap;
    this.topPipe.setPosition(x, topPipeHeight / 2);
    this.topPipe.setDisplaySize(GAME_CONFIG.PIPE_WIDTH, topPipeHeight);
    this.topPipe.setVisible(true);

    // Position bottom pipe (extends from gap to bottom of screen)
    const bottomPipeY = gapCenterY + halfGap;
    const bottomPipeHeight = GAME_CONFIG.HEIGHT - bottomPipeY;
    this.bottomPipe.setPosition(x, bottomPipeY + bottomPipeHeight / 2);
    this.bottomPipe.setDisplaySize(GAME_CONFIG.PIPE_WIDTH, bottomPipeHeight);
    this.bottomPipe.setVisible(true);

    this.active = true;
    this.scored = false;

    // Update physics bodies to match sprite dimensions
    const topBody = this.topPipe.body as Phaser.Physics.Arcade.StaticBody;
    topBody.setSize(this.topPipe.displayWidth, this.topPipe.displayHeight);
    topBody.updateFromGameObject();

    const bottomBody = this.bottomPipe.body as Phaser.Physics.Arcade.StaticBody;
    bottomBody.setSize(
      this.bottomPipe.displayWidth,
      this.bottomPipe.displayHeight
    );
    bottomBody.updateFromGameObject();
  }

  /**
   * Update pipe position (scroll left)
   * @param delta Time since last update in milliseconds
   * @param speedMultiplier Multiplier to increase difficulty
   * @returns true if pipe has moved off screen
   */
  public update(delta: number, speedMultiplier: number = 1): boolean {
    if (!this.active) return false;

    const moveAmount =
      (GAME_CONFIG.PIPE_SPEED * speedMultiplier * delta) / 1000;
    this.topPipe.x -= moveAmount;
    this.bottomPipe.x -= moveAmount;

    // Update physics bodies to match new positions
    (
      this.topPipe.body as Phaser.Physics.Arcade.StaticBody
    ).updateFromGameObject();
    (
      this.bottomPipe.body as Phaser.Physics.Arcade.StaticBody
    ).updateFromGameObject();

    // Check if off screen
    if (this.topPipe.x < -GAME_CONFIG.PIPE_WIDTH) {
      this.deactivate();
      return true;
    }

    return false;
  }

  /**
   * Get the center X position of the gap (for spawning collectibles)
   */
  public getGapCenterX(): number {
    return this.topPipe.x;
  }

  /**
   * Get the center Y position of the gap (for spawning collectibles)
   */
  public getGapCenterY(): number {
    const topEdge = this.topPipe.y + this.topPipe.displayHeight / 2;
    const bottomEdge = this.bottomPipe.y - this.bottomPipe.displayHeight / 2;
    return (topEdge + bottomEdge) / 2;
  }

  /**
   * Deactivate and hide the pipe pair
   */
  public deactivate(): void {
    this.active = false;
    this.topPipe.setVisible(false);
    this.bottomPipe.setVisible(false);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.topPipe.destroy();
    this.bottomPipe.destroy();
  }
}

/**
 * Manages a pool of pipe pairs for efficient reuse
 */
export class PipePool {
  private pool: PipePair[];

  constructor(scene: Phaser.Scene, poolSize: number) {
    this.pool = [];

    // Create pool of pipe pairs
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(new PipePair(scene));
    }
  }

  /**
   * Get an inactive pipe pair from the pool
   * @returns PipePair if available, null if all are active
   */
  public get(): PipePair | null {
    return this.pool.find((pipe) => !pipe.active) || null;
  }

  /**
   * Get all active pipes
   */
  public getActive(): PipePair[] {
    return this.pool.filter((pipe) => pipe.active);
  }

  /**
   * Update all active pipes
   * @param delta Time since last update in milliseconds
   * @param speedMultiplier Multiplier to increase difficulty
   */
  public update(delta: number, speedMultiplier: number = 1): void {
    this.pool.forEach((pipe) => pipe.update(delta, speedMultiplier));
  }

  /**
   * Deactivate all pipes
   */
  public reset(): void {
    this.pool.forEach((pipe) => pipe.deactivate());
  }

  /**
   * Clean up all pipes
   */
  public destroy(): void {
    this.pool.forEach((pipe) => pipe.destroy());
    this.pool = [];
  }
}
