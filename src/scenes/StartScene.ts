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
    this.cameras.main.setBackgroundColor("#F5F5DC"); // Creamy white

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
}
