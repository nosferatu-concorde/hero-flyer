import Phaser from "phaser";
import { GAME_CONFIG } from "../config/constants";

/**
 * Game Over screen - displays score and restart option
 */
export class GameOverScene extends Phaser.Scene {
  private score: number = 0;

  constructor() {
    super({ key: "GameOverScene" });
  }

  preload(): void {
    this.load.audio("surprise", "/surprise-sound.mp3");
  }

  /**
   * Initialize scene with score data
   */
  init(data: { score: number }): void {
    this.score = data.score || 0;
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Background color
    this.cameras.main.setBackgroundColor("#000000"); // Black

    // Game Over title
    this.add
      .text(WIDTH / 2, HEIGHT / 3 - 50, "GAME OVER", {
        ...GAME_CONFIG.TITLE_STYLE,
        color: "#ff0000",
      })
      .setOrigin(0.5);

    // Display score
    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 20, `Score: ${this.score}`, {
        ...GAME_CONFIG.SCORE_STYLE,
      })
      .setOrigin(0.5);

    // Restart instructions
    this.add
      .text(WIDTH / 2, HEIGHT / 2 + 60, "Click anywhere to restart", {
        ...GAME_CONFIG.TEXT_STYLE,
        fontSize: "24px",
      })
      .setOrigin(0.5);

    // Add CRT scanline effect
    this.createScanlineEffect();

    // Add rain effect
    this.createRainEffect();

    // Play surprise sound with echo effect
    this.sound.play("surprise", { volume: 0.6 });
    this.time.delayedCall(150, () => {
      this.sound.play("surprise", { volume: 0.4 });
    });
    this.time.delayedCall(300, () => {
      this.sound.play("surprise", { volume: 0.25 });
    });
    this.time.delayedCall(450, () => {
      this.sound.play("surprise", { volume: 0.15 });
    });

    // Make entire screen clickable to restart
    this.input.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // Also allow spacebar to restart
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
  }

  /**
   * Create CRT scanline overlay effect
   */
  private createScanlineEffect(): void {
    const graphics = this.add.graphics();

    // Draw horizontal scanlines
    for (let y = 0; y < GAME_CONFIG.HEIGHT; y += 4) {
      graphics.fillStyle(0x000000, 0.15);
      graphics.fillRect(0, y, GAME_CONFIG.WIDTH, 2);
    }

    // Set to high depth so it's always on top
    graphics.setDepth(1000);
  }

  /**
   * Create rain effect
   */
  private createRainEffect(): void {
    // Create a small line texture for raindrops
    const rainGraphics = this.add.graphics();
    rainGraphics.lineStyle(2, 0xbbbbbb, 1);
    rainGraphics.lineBetween(0, 0, 0, 12);
    rainGraphics.generateTexture("raindrop-gameover", 2, 12);
    rainGraphics.destroy();

    // Create rain particle emitter at -45 degrees
    const rainEmitter = this.add.particles(0, -20, "raindrop-gameover", {
      x: { min: 0, max: GAME_CONFIG.WIDTH + 600 },
      y: 0,
      lifespan: 2500,
      speedY: { min: 300, max: 400 },
      speedX: { min: -300, max: -400 },
      scale: { start: 1, end: 0.8 },
      alpha: { start: 0.6, end: 0.1 },
      frequency: 2,
      blendMode: "NORMAL",
    });

    // Emit initial burst across screen height to fill immediately
    for (let i = 0; i < GAME_CONFIG.HEIGHT; i += 30) {
      rainEmitter.emitParticleAt(
        Math.random() * (GAME_CONFIG.WIDTH + 600),
        i,
        3
      );
    }
  }
}
