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
    this.load.audio("surprise", "surprise-sound.mp3");
    this.load.audio("riser", "cinematic-riser.mp3");
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

    // Restart instructions (initially hidden, will fade in after sounds)
    const restartText = this.add
      .text(WIDTH / 2, HEIGHT / 2 + 100, "Click anywhere to restart", {
        ...GAME_CONFIG.TEXT_STYLE,
        fontSize: "48px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Copyright and credits text
    this.add
      .text(WIDTH / 2, HEIGHT - 50, "© 2025 RAAAA Interactive", {
        ...GAME_CONFIG.TEXT_STYLE,
        fontSize: "20px",
        color: "#888888",
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, HEIGHT - 30, "Game by Nosferatu Concorde", {
        ...GAME_CONFIG.TEXT_STYLE,
        fontSize: "18px",
        color: "#888888",
      })
      .setOrigin(0.5);

    // Add CRT scanline effect
    this.createScanlineEffect();

    // Add rain effect
    this.createRainEffect();

    // Play surprise sound with echo effect and screen shake
    this.sound.play("surprise", { volume: 0.6 });
    this.sound.play("riser", { volume: 0.8, seek: 1.8 });
    this.cameras.main.shake(300, 0.025);

    this.time.delayedCall(150, () => {
      this.sound.play("surprise", { volume: 0.4 });
      this.cameras.main.shake(250, 0.02);
    });
    this.time.delayedCall(300, () => {
      this.sound.play("surprise", { volume: 0.25 });
      this.cameras.main.shake(200, 0.015);
    });
    this.time.delayedCall(450, () => {
      this.sound.play("surprise", { volume: 0.15 });
      this.cameras.main.shake(150, 0.01);
    });

    // Fade in restart text after sounds complete (cinematic-riser is ~2-3 seconds from 1.8s)
    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: restartText,
        alpha: 1,
        duration: 600,
        ease: "Power2",
        onComplete: () => {
          // Enable restart after fade-in completes
          canRestart = true;

          // Start flashing animation after fade-in completes
          this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        },
      });
    });

    // Track if restart is enabled
    let canRestart = false;

    // Make entire screen clickable to restart
    this.input.on("pointerdown", () => {
      if (canRestart) {
        this.scene.start("GameScene");
      }
    });

    // Also allow spacebar to restart
    this.input.keyboard?.on("keydown-SPACE", () => {
      if (canRestart) {
        this.scene.start("GameScene");
      }
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
