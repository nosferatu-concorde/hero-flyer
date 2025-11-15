import Phaser from "phaser";
import { GAME_CONFIG } from "../config/constants";

/**
 * Start screen - displays title and instructions
 */
export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload(): void {
    this.load.image("hero", "/hero.png");
    this.load.image("pipe", "/src/pipe.png");
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Background color
    this.cameras.main.setBackgroundColor("#000000"); // Black

    // Title
    this.add
      .text(WIDTH / 2, HEIGHT / 3, "HERO FLYER", {
        ...GAME_CONFIG.TITLE_STYLE,
      })
      .setOrigin(0.5);

    // Instructions
    const instructions = [
      "Press SPACE or CLICK to flap",
      "Avoid pipes and stay in bounds",
      "",
      "Click anywhere to start",
    ];

    this.add
      .text(WIDTH / 2, HEIGHT / 2, instructions.join("\n"), {
        ...GAME_CONFIG.TEXT_STYLE,
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

    // Add CRT scanline effect
    this.createScanlineEffect();

    // Add rain effect
    this.createRainEffect();

    // Make entire screen clickable to start
    this.input.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    // Also allow spacebar to start
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
    rainGraphics.generateTexture("raindrop-start", 2, 12);
    rainGraphics.destroy();

    // Create rain particle emitter at -45 degrees
    const rainEmitter = this.add.particles(0, -20, "raindrop-start", {
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
