Create Phaser 3 + TypeScript + Vite project with standard structure (src/main.ts, scenes/, assets/)
Player: colored rectangle (32x48px, red), starts left-center screen, falls with gravity
Input: spacebar or click makes player "flap" upward (impulse force), can spam but each flap costs energy
Obstacles: vertical pipe pairs (green rectangles) with gap in middle, spawn off-screen right, scroll left at constant speed, random gap heights, player must fly through gaps
Collision: hit pipe or ground or ceiling = game over instantly
Scoring: +1 point each time player successfully passes through pipe gap, display score top-center
Energy system: energy bar top-left, each flap drains energy, energy slowly regenerates over time, cannot flap when empty
Collectibles: beer cans (yellow circles) spawn randomly between pipes, restore energy when collected, optional for prototype
Game states: start screen (click to begin), playing, game over screen (show score, click to restart)
Use Arcade Physics, implement object pooling for pipes, make all values tunable (gravity, flap force, pipe speed, gap size, energy drain/regen rates)
Keep it at 60 FPS, all placeholder shapes with distinct colors, focus on feel and balance
Deliverables: working game, README with run instructions, clear comments, easily adjustable constants

Test if flap strength vs gravity feels satisfying before adding complexity.