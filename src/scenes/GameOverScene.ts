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

  /**
   * Initialize scene with score data
   */
  init(data: { score: number }): void {
    this.score = data.score || 0;
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Background color
    this.cameras.main.setBackgroundColor("#F5F5DC"); // Creamy white

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
}
