export default class EnemyMovement {
  constructor(enemy, maze) {
    this.enemy = enemy;
    this.maze = maze;

    const { x, y } = enemy.getPosition();
    this.dir = this.chooseInitialDirection(x, y);

    this.moveDelay = 600;
    this.lastMoveTime = 0;
  }

  update() {
    const now = performance.now();
    if (now - this.lastMoveTime < this.moveDelay) return;

    this.lastMoveTime = now;

    const { x, y } = this.enemy.getPosition();
    let dx = 0, dy = 0;

    if (this.dir === 0) dy = -1;
    if (this.dir === 1) dx = -1;
    if (this.dir === 2) dy = 1;
    if (this.dir === 3) dx = 1;

    const nx = x + dx;
    const ny = y + dy;

    if (this.canMoveTo(nx, ny)) {
      this.enemy.setPosition(nx, ny);
      this.enemy.setDirection(this.dir);
      this.enemy.setMoving(true);
    } else {
      this.dir = this.chooseNewDirection(x, y);
    }
  }

  chooseInitialDirection(x, y) {
    const options = [];
    if (this.canMoveTo(x, y - 1)) options.push(0); // up
    if (this.canMoveTo(x - 1, y)) options.push(1); // left
    if (this.canMoveTo(x, y + 1)) options.push(2); // down
    if (this.canMoveTo(x + 1, y)) options.push(3); // right

    if (options.length === 0) return 2; // fallback
    return options[Math.floor(Math.random() * options.length)];
  }

  chooseNewDirection(x, y) {
    const options = [];
    if (this.canMoveTo(x, y - 1) && this.dir !== 2) options.push(0); // up
    if (this.canMoveTo(x - 1, y) && this.dir !== 3) options.push(1); // left
    if (this.canMoveTo(x, y + 1) && this.dir !== 0) options.push(2); // down
    if (this.canMoveTo(x + 1, y) && this.dir !== 1) options.push(3); // right

    if (options.length === 0) return this.reverseDirection(this.dir); 
    return options[Math.floor(Math.random() * options.length)];
  }

  canMoveTo(x, y) {
    if (
      y < 0 ||
      y >= this.maze.length ||
      x < 0 ||
      x >= this.maze[0].length
    ) return false;

    return this.maze[y][x] === 0;
  }

  reverseDirection(dir) {
    if (dir === 0) return 2;
    if (dir === 2) return 0;
    if (dir === 1) return 3;
    if (dir === 3) return 1;
  }
}
