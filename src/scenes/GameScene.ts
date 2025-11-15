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
  private gameOver: boolean = false;
  private speedMultiplier: number = 1;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    this.load.image("hero", "/hero.png");
    this.load.image("pipe", "/src/pipe.png");
  }

  create(): void {
    // Background color
    this.cameras.main.setBackgroundColor("#F5F5DC"); // Creamy white

    // Initialize game state
    this.score = 0;
    this.gameOver = false;
    this.lastPipeSpawnTime = 0;

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
      .text(
        GAME_CONFIG.SCORE_X,
        GAME_CONFIG.SCORE_Y,
        "0",
        GAME_CONFIG.SCORE_STYLE
      )
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
        // Increase speed by 8% every 3 points
        this.speedMultiplier = 1 + Math.floor(this.score / 3) * 0.08;
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

    // Spawn pipes at intervals
    if (time - this.lastPipeSpawnTime > GAME_CONFIG.PIPE_SPAWN_INTERVAL) {
      this.spawnPipe();
      this.lastPipeSpawnTime = time;
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
