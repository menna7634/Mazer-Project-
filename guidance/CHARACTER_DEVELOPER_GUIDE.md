# 🎮 Mazer - Character System Developer Guide

> **For the developer implementing the player character**

---

## 🎯 Your Responsibilities

You are responsible for implementing the **Character/Player System**. This includes:

- **Player Rendering**: Draw and animate the player sprite
- **Movement System**: Handle player movement with smooth controls
- **Collision Integration**: Work with maze collision detection
- **Animations**: Idle, walk (4 directions), death, victory
- **State Management**: Track player health, position, status

---

## 📁 Your Assets

### Player Sprites _(Create or use placeholder)_

You'll need sprite sheets for:

- **Idle** (facing 4 directions)
- **Walk** (4 directions × animation frames)
- **Death** animation
- **Victory** animation

**Recommended size:** 64×64px per frame (matches tile size)

**File structure:**

```
assets/
└── sprites/
    ├── player-idle.png
    ├── player-walk.png
    ├── player-death.png
    └── player-victory.png
```

---

## 🔗 HTML Integration

### Step 1: The player renders on the **same canvas** as the maze

The maze developer creates the canvas in `index.html`:

```html
<canvas id="mazeCanvas" width="896" height="896"></canvas>
<script src="maze.js"></script>
<script src="player.js"></script>
<!-- Your file -->
```

### Step 2: Coordinate with Maze System

Your player needs access to:

- `maze` array (for collision)
- `TILE_SIZE` constant
- Game state (level, paused, etc.)

**Solution:** Use a shared game state or event system.

---

## 💡 Implementation Overview

### Architecture

Your `player.js` should follow this structure:

```javascript
// 1. Player State
const player = {
  x: 1, // grid position
  y: 1,
  direction: "down", // current facing direction
  isMoving: false,
  health: 3,
  speed: 4, // pixels per frame
};

// 2. Load Sprite Sheets
// - Use Image() objects
// - Support sprite animation

// 3. Core Functions
// - drawPlayer(ctx)
// - updatePlayerAnimation()
// - movePlayer(direction)
// - checkCollision()

// 4. Input Handling
// - Keyboard events (WASD/Arrows)
// - Smooth movement vs grid-based

// 5. Animation System
// - Frame cycling
// - Direction changes
// - Death/victory sequences
```

---

## 🎨 Rendering Concepts

### 1. Grid-Based vs Pixel-Based

**Grid-Based** (simpler):

- Player position in grid coordinates (e.g., `x=5, y=3`)
- Snap to tiles
- Draw at `x * TILE_SIZE, y * TILE_SIZE`

**Pixel-Based** (smoother):

- Player position in pixels
- Smooth movement between tiles
- More animations needed

**Recommendation:** Start grid-based, upgrade to pixel-based later.

### 2. Sprite Animation

Use a sprite sheet with multiple frames:

```
┌───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │  ← Walk frames
└───┴───┴───┴───┘
```

Cycle through frames based on time:

- Store `currentFrame` and `frameTimer`
- Increment frame every N milliseconds
- Loop back to 0 after last frame

### 3. Multi-Direction Sprites

Organize sprite sheet by direction:

```
Row 0: Walk Down  [⬇️]
Row 1: Walk Up    [⬆️]
Row 2: Walk Left  [⬅️]
Row 3: Walk Right [➡️]
```

Calculate source Y position based on direction.

---

## 🎮 Movement System

### Grid-Based Movement (Simple)

```javascript
function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  // Check with maze system
  if (canMoveTo(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }
}

// Input handling
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      movePlayer(0, -1);
      break;
    case "ArrowDown":
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
      movePlayer(1, 0);
      break;
  }
});
```

### Smooth Movement (Advanced)

Instead of instant snap:

1. Set target position
2. Interpolate from current to target over time
3. Update `isMoving` flag
4. Play walk animation during movement

---

## ⚔️ Health & Death

### Health System

Track player health (e.g., 3 hearts):

- Start with 3
- Decrease on damage (traps, enemies, etc.)
- Update HUD: `document.getElementById('health').textContent`

### Death Sequence

When health reaches 0:

1. Play death animation
2. Freeze input
3. Show Game Over screen
4. Option to restart

---

## 🔗 Integration with Maze System

### Collision Detection

The maze developer provides `canMoveTo(x, y)` function.

**Your responsibility:** Call it before moving.

```javascript
// Maze checks:
// - Is tile walkable?
// - Is it a wall?
// - Is it a locked door?

if (canMoveTo(newX, newY)) {
  // Safe to move
}
```

### Key Collection

When player moves to a key tile:

1. Maze system detects it
2. Increments key counter
3. Updates HUD

**Your responsibility:** Just move the player. The maze handles the rest.

---

## 📊 Development Phases

### Phase 1: Basic Movement ✅

- Static player sprite (placeholder)
- Grid-based movement
- Keyboard input
- Collision with maze

### Phase 2: Animations

- Load sprite sheets
- Idle animation
- Walk animation (4 directions)
- Direction changes

### Phase 3: Polish

- Smooth pixel-based movement
- Death animation
- Victory animation
- Sound effects (footsteps, etc.)

---

## 🎨 CSS & HUD

### Health Display

Update the HUD when health changes:

```javascript
function updateHealthDisplay() {
  const hearts = "❤️".repeat(player.health);
  document.getElementById("health").textContent = hearts;
}
```

Call this whenever health changes (damage, heal, etc.).

---

## 🐛 Common Issues

**Problem:** Player moves through walls

- **Solution**: Make sure you're calling the maze's collision function

**Problem:** Sprite doesn't load

- **Solution**: Check file path and use `onload` callback

**Problem:** Animation is choppy

- **Solution**: Use `requestAnimationFrame()` for smooth rendering

**Problem:** Player gets stuck

- **Solution**: Ensure grid coordinates are integers, not floats

---

## 🚀 Getting Started

1. **Create your file**:

   ```bash
   touch js/player.js
   ```

2. **Link it in HTML**:

   ```html
   <script src="player.js"></script>
   ```

3. **Start with a placeholder**:
   - Draw a colored circle as the player
   - Get movement working first
   - Add sprites later

4. **Coordinate with maze developer**:
   - Agree on shared variables
   - Test collision together
   - Sync render loops

5. **Commit & push**:
   ```bash
   git add js/player.js
   git commit -m "Implement player movement and rendering"
   git push origin game-screen
   ```

---

## 📞 Coordinate With

### Maze Developer

- Share `TILE_SIZE` constant
- Use their `canMoveTo()` function
- Sync game loop/render cycle

### Assets

- All assets in `/assets/sprites/` (you create them)
- Follow same 64×64px tile size
- Use transparent backgrounds

---

## 💡 Tips

- **Start simple**: Use a colored square as player before sprites
- **Test thoroughly**: Check all 4 directions and edge cases
- **Frame-independent movement**: Use delta time for smooth animations
- **Separate concerns**: Keep rendering, movement, and collision logic separate

---

**Good luck! 🏺✨**
