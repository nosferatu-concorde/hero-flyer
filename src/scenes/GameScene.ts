import Phaser from "phaser";
import { GAME_CONFIG } from "../config/constants";
import { Player } from "../entities/Player";
import { PipePool } from "../entities/Pipe";

/**
 * Main game scene - handles gameplay, scoring, collision, and UI
 */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private pipePool!: PipePool;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private lastPipeSpawnTime: number = 0;
  private lastCloudSpawnTime: number = 0;
  private nextCloudSpawnDelay: number = 0;
  private gameOver: boolean = false;
  private speedMultiplier: number = 1;
  private clouds: Phaser.GameObjects.Sprite[] = [];
  private lastThunderTime: number = 0;
  private nextThunderDelay: number = 0;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    this.load.image("hero", "hero.png");
    this.load.image("pipe", "pipe.png");
    this.load.image("cloud", "cloud.png");
    this.load.audio("thunder", "thunder-sound.mp3");
    this.load.audio("surprise", "surprise-sound.mp3");
    this.load.audio("rain", "real-rain-sound.mp3");
  }

  create(): void {
    // Background color
    this.cameras.main.setBackgroundColor("#FDDA0D"); // Yellow

    // Initialize game state
    this.score = 0;
    this.gameOver = false;
    this.lastPipeSpawnTime = 0;
    this.lastCloudSpawnTime = 0;
    this.nextCloudSpawnDelay = Phaser.Math.Between(3000, 6000);
    this.speedMultiplier = 1;
    this.clouds = [];

    // Initialize thunder effect
    this.lastThunderTime = 0;
    this.nextThunderDelay = Phaser.Math.Between(2000, 4000); // First thunder happens sooner

    // Create player
    this.player = new Player(
      this,
      GAME_CONFIG.PLAYER_START_X,
      GAME_CONFIG.PLAYER_START_Y
    );

    // Create object pools
    this.pipePool = new PipePool(this, GAME_CONFIG.PIPE_POOL_SIZE);

    // Create UI
    this.createUI();

    // Add CRT scanline effect
    this.createScanlineEffect();

    // Add rain effect
    this.createRainEffect();

    // Play rain sound in background (loop)
    this.sound.play("rain", { volume: 0.3, loop: true });

    // Setup input
    this.setupInput();

    // Setup collision detection
    this.setupCollisions();
  }

  /**
   * Create UI elements (score and energy bar)
   */
  private createUI(): void {
    // Score text
    this.scoreText = this.add
      .text(GAME_CONFIG.SCORE_X, GAME_CONFIG.SCORE_Y, "0", {
        ...GAME_CONFIG.SCORE_STYLE,
        color: "#000000",
      })
      .setOrigin(0.5);
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
    rainGraphics.lineStyle(2, 0x444444, 1);
    rainGraphics.lineBetween(0, 0, 0, 12);
    rainGraphics.generateTexture("raindrop", 2, 12);
    rainGraphics.destroy();

    // Create rain particle emitter at -45 degrees
    const rainEmitter = this.add.particles(0, -20, "raindrop", {
      x: { min: 0, max: GAME_CONFIG.WIDTH + 600 },
      y: 0,
      lifespan: 2000,
      speedY: { min: 450, max: 550 },
      speedX: { min: -450, max: -550 },
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

  /**
   * Setup input handlers (spacebar and click)
   */
  private setupInput(): void {
    // Spacebar input
    this.input.keyboard?.on("keydown-SPACE", () => {
      if (!this.gameOver) {
        this.player.flap();
      }
    });

    // Click/touch input
    this.input.on("pointerdown", () => {
      if (!this.gameOver) {
        this.player.flap();
      }
    });
  }

  /**
   * Setup collision detection between player and obstacles/collectibles
   */
  private setupCollisions(): void {
    // We'll check collisions manually in update() for more control
  }

  /**
   * Spawn a decorative cloud at random size and position
   */
  private spawnCloud(): void {
    // Random Y position
    const y = Phaser.Math.Between(50, GAME_CONFIG.HEIGHT - 100);

    // Fixed scale at 20% of original size
    const scale = 0.2;

    // Create cloud sprite
    const cloud = this.add.sprite(GAME_CONFIG.WIDTH + 100, y, "cloud");
    cloud.setScale(scale);
    cloud.setDepth(-1); // Behind everything

    // Store speed in data for update loop
    cloud.setData("speed", 250);

    // Add to clouds array
    this.clouds.push(cloud);
  }

  /**
   * Update cloud positions
   */
  private updateClouds(delta: number): void {
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      const cloud = this.clouds[i];
      const speed = cloud.getData("speed");

      // Move cloud left
      cloud.x -= (speed * delta) / 1000;

      // Remove if off screen
      if (cloud.x < -200) {
        cloud.destroy();
        this.clouds.splice(i, 1);
      }
    }
  }

  /**
   * Trigger a thunder/lightning effect with burst of flashes and camera shake
   */
  private triggerThunder(): void {
    console.log("⚡ Thunder triggered!");

    // Play thunder sound with random variations for variety
    const randomRate = Phaser.Math.FloatBetween(0.7, 1.3); // Wider pitch variation (slower to faster)
    const randomVolume = Phaser.Math.FloatBetween(0.4, 0.6); // Volume variation
    const thunderSound = this.sound.add("thunder");
    thunderSound.play({
      volume: randomVolume,
      rate: randomRate,
    });

    // Fade out the thunder sound after 800ms
    this.tweens.add({
      targets: thunderSound,
      volume: 0,
      duration: 4000,
      delay: 800,
      onComplete: () => {
        thunderSound.stop();
        thunderSound.destroy();
      },
    });

    // First flash - brightest
    this.cameras.main.flash(80, 255, 255, 255, false);

    // Second flash after short delay
    this.time.delayedCall(100, () => {
      this.cameras.main.flash(60, 255, 255, 240, false);
    });

    // Third flash - weakest
    this.time.delayedCall(180, () => {
      this.cameras.main.flash(50, 255, 255, 230, false);
    });

    // Camera shake for thunder rumble effect - increased intensity
    this.cameras.main.shake(400, 0.008, false);
  }

  /**
   * Spawn a new pipe pair with optional collectible
   */
  private spawnPipe(): void {
    const pipe = this.pipePool.get();
    if (!pipe) return; // Pool exhausted

    pipe.spawn(GAME_CONFIG.WIDTH + GAME_CONFIG.PIPE_WIDTH);
  }

  /**
   * Check if player has passed through a pipe (for scoring)
   */
  private checkScoring(): void {
    const activePipes = this.pipePool.getActive();

    for (const pipe of activePipes) {
      // If pipe hasn't been scored yet and player has passed it
      if (
        !pipe.scored &&
        pipe.topPipe.x + GAME_CONFIG.PIPE_WIDTH < this.player.sprite.x
      ) {
        pipe.scored = true;
        this.score++;
        this.scoreText.setText(this.score.toString());
        // Increase speed by 15% every point, capped at 2.5x
        this.speedMultiplier = Math.min(1 + this.score * 0.15, 2.5);
      }
    }
  }

  /**
   * Check collisions between player and pipes
   */
  private checkPipeCollisions(): boolean {
    const activePipes = this.pipePool.getActive();
    const playerBounds = this.player.sprite.getBounds();

    for (const pipe of activePipes) {
      const topBounds = pipe.topPipe.getBounds();
      const bottomBounds = pipe.bottomPipe.getBounds();

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, topBounds) ||
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, bottomBounds)
      ) {
        return true; // Collision detected
      }
    }

    return false;
  }

  /**
   * Handle game over
   */
  private triggerGameOver(): void {
    this.gameOver = true;
    this.scene.start("GameOverScene", { score: this.score });
  }
  /**
   * Main update loop
   */
  update(time: number, delta: number): void {
    if (this.gameOver) return;

    // Update pipes with speed multiplier
    this.pipePool.update(delta, this.speedMultiplier);

    // Update clouds
    this.updateClouds(delta);

    // Spawn pipes at intervals
    if (time - this.lastPipeSpawnTime > GAME_CONFIG.PIPE_SPAWN_INTERVAL) {
      this.spawnPipe();
      this.lastPipeSpawnTime = time;
    }

    // Spawn clouds at random intervals
    if (time - this.lastCloudSpawnTime > this.nextCloudSpawnDelay) {
      this.spawnCloud();
      this.lastCloudSpawnTime = time;
      this.nextCloudSpawnDelay = Phaser.Math.Between(3000, 6000);
    }

    // Trigger thunder at random intervals
    if (time - this.lastThunderTime > this.nextThunderDelay) {
      this.triggerThunder();
      this.lastThunderTime = time;
      this.nextThunderDelay = Phaser.Math.Between(4000, 8000);
    }

    // Check scoring
    this.checkScoring();

    // Check collisions
    if (this.checkPipeCollisions() || this.player.isOutOfBounds()) {
      this.triggerGameOver();
      return;
    }
  }
}
