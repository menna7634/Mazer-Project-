# 🏛️ Mazer - Maze System Developer Guide

> **For the developer implementing the maze logic**

---

## 🎯 Your Responsibilities

You are responsible for implementing the **Maze System** - the core gameplay mechanic. This includes:

- **Maze Rendering**: Draw the maze using the provided tile assets
- **Collision Detection**: Prevent player from walking through walls
- **Key Collection**: Track collected keys and unlock the door when all are found
- **Maze Generation** _(optional)_: Generate random mazes algorithmically

---

## 📁 Project Structure

```
Mazer-Project-/
├── assets/
│   └── images/
│       ├── tiles/              # Your main assets
│       │   ├── floor-hieroglyphic.png
│       │   ├── wall-hieroglyphic.png
│       │   ├── door-locked.png
│       │   ├── door-unlocked.png
│       │   └── door-open.png
│       ├── frames/
│       │   └── game-frame.png  # Golden border for game screen
│       └── UI components/
│           └── hud-container.png
├── css/
│   └── style.css               # Already styled!
└── js/
    ├── index.html              # Entry point
    └── maze.js                 # 👈 Your code here
```

---

## 🎨 Available Assets

### Tiles

All tiles are **1024×1024px**. Recommended in-game size: **64×64px**

| Asset                    | Purpose                        |
| ------------------------ | ------------------------------ |
| `floor-hieroglyphic.png` | Walkable floor                 |
| `wall-hieroglyphic.png`  | Walls (collision)              |
| `door-locked.png`        | Locked door (start state)      |
| `door-unlocked.png`      | Unlocked (all keys collected)  |
| `door-open.png`          | Active portal (ready to enter) |

---

## 🔗 HTML Integration

### Step 1: Update `index.html`

Add a canvas for the game screen:

```html
<section class="screen game">
  <!-- Game Frame -->
  <div
    class="game-container"
    style="background-image: url('../assets/images/frames/game-frame.png')"
  >
    <!-- HUD -->
    <div class="hud">
      <div class="hud-item">
        <span id="health">❤️❤️❤️</span>
      </div>
      <div class="hud-item">
        <span id="keys">0/3</span>
      </div>
      <div class="hud-item">
        <span id="timer">00:00</span>
      </div>
      <div class="hud-item">
        <span id="level">1</span>
      </div>
    </div>

    <!-- Canvas -->
    <canvas id="mazeCanvas" width="896" height="896"></canvas>
  </div>
</section>

<!-- Load your JavaScript -->
<script src="maze.js"></script>
```

### Step 2: CSS is Already Done

The game screen styling exists in `style.css`. You can add specific tweaks if needed.

---

## 💡 Implementation Overview

### Architecture

Your `maze.js` should follow this structure:

```javascript
// 1. Constants & Configuration
const TILE_SIZE = 64;
const TILE_FLOOR = 0,
  TILE_WALL = 1,
  TILE_KEY = 5,
  TILE_DOOR = 2;

// 2. Load Assets
// - Use Image() objects
// - Wait for all to load before starting

// 3. Game State
// - Maze grid (2D array)
// - Player position (x, y)
// - Keys collected counter
// - Door state

// 4. Core Functions
// - drawMaze(ctx, maze)
// - canMoveTo(x, y)  // collision check
// - movePlayer(dx, dy)
// - collectKey()
// - unlockDoor()

// 5. Input Handling
// - Listen to keyboard (WASD or arrows)

// 6. Game Loop
// - render() - redraw everything
// - updateHUD() - update counters
```

---

## 🎮 Core Concepts

### 1. Maze Representation

Use a **2D array** where:

- `0` = floor (walkable)
- `1` = wall (blocks movement)
- `2` = door
- `5` = key

Example:

```javascript
const maze = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 5, 1], // 5 = key
  [1, 0, 1, 0, 1],
  [1, 0, 0, 2, 1], // 2 = door
  [1, 1, 1, 1, 1],
];
```

### 2. Rendering

Loop through the maze array and draw the corresponding tile image at `(col * TILE_SIZE, row * TILE_SIZE)`.

**Key point:** Always draw floor first, then overlay walls/doors/keys on top.

### 3. Collision Detection

Before moving the player, check if the destination tile is walkable:

- Floor (`0`) → ✅ OK
- Wall (`1`) → ❌ Block
- Key (`5`) → ✅ OK + collect it
- Door → ✅ only if all keys collected

### 4. Door States

Track door state based on keys:

1. **Start**: Door is locked (`door-locked.png`)
2. **All keys collected**: Door becomes unlocked (`door-unlocked.png`)
3. **Player enters**: Door opens (`door-open.png`) → transition to next level

### 5. Input Handling

Listen for keyboard events and call `movePlayer(dx, dy)`:

- Arrow keys or WASD
- Check collision before actually moving

---

## 🧩 Maze Generation (Optional)

If implementing procedural generation, use **Recursive Backtracking**:

1. Start with a grid full of walls
2. Pick a starting cell, mark it as floor
3. Randomly pick an unvisited neighbor
4. Carve a path to it
5. Repeat recursively
6. Add keys and door at the end

**Tip:** Ensure there's always a valid path from start to door.

---

## 📊 Development Phases

### Phase 1: Static Maze ✅

- Draw a hardcoded maze
- Implement player movement
- Add collision detection
- Implement key collection
- Door unlocking logic

### Phase 2: Dynamic Maze

- Generate random mazes
- Multiple difficulty levels
- Timer system
- Score tracking

### Phase 3: Polish

- Player sprite/animation
- Sound effects
- Particle effects when collecting keys
- Mini-map

---

## 🔧 HUD Integration

Update the HUD elements when game state changes:

```javascript
function updateHUD() {
  document.getElementById("keys").textContent = `${keysCollected}/${totalKeys}`;
  document.getElementById("level").textContent = currentLevel;
  // etc...
}
```

Call `updateHUD()` after every state change (key collected, level up, etc.).

---

## 🐛 Common Issues

**Problem:** Images don't load

- **Solution**: Use `await` or `onload` callbacks before rendering

**Problem:** Collision doesn't work

- **Solution**: Make sure you're using **grid coordinates** (tile indices), not pixel coordinates

**Problem:** Player moves through walls

- **Solution**: Check collision **before** updating player position, not after

---

## 🚀 Getting Started

1. **Clone the repo**:

   ```bash
   git clone <repo-url>
   cd Mazer-Project-
   git checkout game-screen
   ```

2. **Create your file**:

   ```bash
   touch js/maze.js
   ```

3. **Link it in HTML**:
   Already shown above in the HTML integration section

4. **Start coding**:
   - Load assets
   - Draw the maze
   - Add player movement
   - Test locally

5. **Commit & push**:
   ```bash
   git add js/maze.js
   git commit -m "Implement maze rendering and player movement"
   git push origin game-screen
   ```

---

## 📞 Assets Reference

All assets are in `/assets/images/`. Refer to:

- `tiles/` - Maze tiles
- `frames/` - UI frames
- `UI components/` - HUD containers

**CSS Variables** are already defined in `style.css`:

- Colors: `--gold`, `--turquoise`, `--stone-dark`, etc.
- Fonts: `--font-title`, `--font-display`, `--font-body`

---

**Good luck! 🏺✨**
