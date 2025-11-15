# Hero Flyer

A Flappy Bird-style game built with Phaser 3, TypeScript, and Vite. Navigate through pipes by flapping, manage your energy, and collect power-ups to survive as long as possible!

## Features

- **Physics-based gameplay**: Gravity and impulse-based flight mechanics
- **Energy system**: Each flap costs energy that regenerates over time
- **Collectibles**: Grab yellow orbs to restore energy
- **Object pooling**: Efficient pipe and collectible management
- **Adjustable difficulty**: All game constants are easily tunable
- **60 FPS gameplay**: Smooth, responsive controls

## Installation

1. **Install dependencies**:
```bash
npm install
```

## Running the Game

**Development mode** (with hot reload):
```bash
npm run dev
```

The game will automatically open in your browser at `http://localhost:3000`

**Build for production**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

## How to Play

- **Flap**: Press `SPACE` or `CLICK/TAP` anywhere on the screen
- **Goal**: Navigate through the gaps in the green pipes
- **Avoid**: Hitting pipes, ceiling, or ground = instant game over
- **Energy**: Watch your energy bar (top-left) - you can't flap when empty!
- **Collectibles**: Grab yellow circles to restore energy
- **Score**: +1 point for each pipe you successfully pass through

## Game Controls

- **Start Screen**: Click or press SPACE to begin
- **During Game**: Click or press SPACE to flap
- **Game Over**: Click or press SPACE to restart

## Adjusting Game Constants

All game parameters are centralized in `src/config/constants.ts` for easy balancing. Here are the key values you can adjust:

### Physics & Feel
```typescript
GRAVITY: 800           // Downward acceleration (higher = faster fall)
FLAP_FORCE: -350      // Upward velocity on flap (more negative = higher jump)
```

### Energy System
```typescript
MAX_ENERGY: 100                // Maximum energy capacity
ENERGY_DRAIN_PER_FLAP: 15     // Energy cost per flap
ENERGY_REGEN_RATE: 8          // Energy regenerated per second
```

### Pipes
```typescript
PIPE_SPEED: 200               // Horizontal scroll speed (pixels/second)
PIPE_GAP_SIZE: 180           // Vertical gap size
PIPE_SPAWN_INTERVAL: 2000    // Milliseconds between spawns
PIPE_MIN_GAP_Y: 150          // Minimum gap center Y position
PIPE_MAX_GAP_Y: 450          // Maximum gap center Y position
```

### Collectibles
```typescript
COLLECTIBLE_ENERGY_RESTORE: 30     // Energy restored on collection
COLLECTIBLE_SPAWN_CHANCE: 0.4     // 40% chance to spawn with each pipe
```

## Tips for Balancing

1. **Test flap strength vs gravity first**: Adjust `FLAP_FORCE` and `GRAVITY` until the basic feel is satisfying
2. **Energy system**: If too easy/hard, adjust `ENERGY_DRAIN_PER_FLAP` and `ENERGY_REGEN_RATE`
3. **Difficulty curve**: Modify `PIPE_SPEED` and `PIPE_GAP_SIZE` to make it easier or harder
4. **Pacing**: Change `PIPE_SPAWN_INTERVAL` to control how frequently obstacles appear

## Project Structure

```
hero-flyer/
├── src/
│   ├── main.ts              # Game initialization and config
│   ├── config/
│   │   └── constants.ts     # All tunable game parameters
│   ├── entities/
│   │   ├── Player.ts        # Player with physics and energy
│   │   ├── Pipe.ts          # Pipe obstacles with pooling
│   │   └── Collectible.ts   # Energy-restoring collectibles
│   └── scenes/
│       ├── StartScene.ts    # Start screen
│       ├── GameScene.ts     # Main gameplay
│       └── GameOverScene.ts # Game over screen
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md               # This file
```

## Technical Details

- **Engine**: Phaser 3.80.1 (Arcade Physics)
- **Language**: TypeScript 5.3.3
- **Build Tool**: Vite 5.0.7
- **Target FPS**: 60
- **Resolution**: 800x600

## Development Notes

- All game objects use placeholder colored shapes (no sprites required)
- Object pooling is implemented for pipes and collectibles for performance
- Collision detection uses Phaser's built-in intersection methods
- The game uses Arcade Physics with per-object gravity settings
- All values are easily adjustable via constants - no magic numbers in game code

## Debugging

To enable physics debug mode (shows collision boundaries):
1. Open `src/main.ts`
2. Find the physics config
3. Change `debug: false` to `debug: true`

## License

MIT

---

Enjoy flying! 🚀
