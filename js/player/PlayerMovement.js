export default class PlayerMovement {
  constructor(player, maze) {
    this.player = player;
    this.maze = maze;
  }

  movePlayer(dx, dy) {
    if (this.player.isMoving()) return false;

    const { x, y } = this.player.getPlayerPosition();
    const newX = x + dx;
    const newY = y + dy;

    if (!this.canMoveTo(newX, newY)) return false;

    this.player.setPlayerPosition(newX, newY);
    this.player.setMoving(true);

    if (dy === -1) this.player.setDirection(0); // up
    if (dx === -1) this.player.setDirection(1); // left
    if (dy === 1) this.player.setDirection(2); // down
    if (dx === 1) this.player.setDirection(3); // right

    return true;
  }

  canMoveTo(x, y) {
    if (
      y < 0 ||
      y >= this.maze.length ||
      x < 0 ||
      x >= this.maze[0].length
    ) return false;

    return this.maze[y][x] !== 1; // wall
  }
}
