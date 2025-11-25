import Phaser from "phaser";
import { GAME_CONFIG } from "../config/constants";

/**
 * Start screen - displays title and instructions
 */
export class StartScene extends Phaser.Scene {
  private lastThunderTime: number = 0;
  private nextThunderDelay: number = 0;
  private audioStarted: boolean = false;

  constructor() {
    super({ key: "StartScene" });
  }

  preload(): void {
    this.load.image("hero", "hero.png");
    this.load.image("pipe", "pipe.png");
    this.load.audio("thunder", "thunder-sound.mp3");
    this.load.audio("rain", "real-rain-sound.mp3");
  }

  create(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    // Initialize thunder effect
    this.lastThunderTime = 0;
    this.nextThunderDelay = Phaser.Math.Between(3000, 8000);
    this.audioStarted = false;

    // Background color
    this.cameras.main.setBackgroundColor("#000000"); // Black

    // Start audio on first user interaction (click or key press)
    const startAudioOnce = () => {
      if (!this.audioStarted) {
        this.sound.play("rain", { volume: 0.3, loop: true });
        this.audioStarted = true;
      }
    };

    this.input.once("pointerdown", startAudioOnce);
    this.input.keyboard?.once("keydown", startAudioOnce);

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
      .text(WIDTH / 2, HEIGHT / 2 + 40, instructions.join("\n"), {
        ...GAME_CONFIG.TEXT_STYLE,
        align: "center",
        lineSpacing: 10,
      })
      .setOrigin(0.5);

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

  update(time: number): void {
    // Only trigger thunder if audio has been started
    if (
      this.audioStarted &&
      time - this.lastThunderTime > this.nextThunderDelay
    ) {
      this.triggerThunder();
      this.lastThunderTime = time;
      this.nextThunderDelay = Phaser.Math.Between(3000, 8000);
    }
  }

  /**
   * Trigger thunder effect - flash and sound
   */
  private triggerThunder(): void {
    // Camera flash effect (burst of 3 flashes)
    this.cameras.main.flash(80, 255, 255, 255, false);
    this.time.delayedCall(100, () => {
      this.cameras.main.flash(60, 255, 255, 255, false);
    });
    this.time.delayedCall(200, () => {
      this.cameras.main.flash(50, 255, 255, 255, false);
    });

    // Camera shake
    this.cameras.main.shake(400, 0.008);

    // Only play thunder sound if audio has been started by user interaction
    if (this.audioStarted) {
      // Play thunder sound with random variations
      const randomRate = Phaser.Math.FloatBetween(0.7, 1.3);
      const randomVolume = Phaser.Math.FloatBetween(0.4, 0.6);
      const thunder = this.sound.add("thunder");
      thunder.play({ rate: randomRate, volume: randomVolume });

      // Fade out thunder sound over 4 seconds
      this.tweens.add({
        targets: thunder,
        volume: 0,
        duration: 4000,
        onComplete: () => {
          thunder.destroy();
        },
      });
    }
  }
}
