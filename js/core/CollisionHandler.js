
class CollisionHandler {
  
  static getTileType(maze, x, y) {
    if (!maze || !maze[y] || !maze[y][x]) return null;
    return maze[y][x];
  }

  static isWall(maze, x, y) {
    return this.getTileType(maze, x, y) === 1;
  }

  static isMonster(maze, x, y) {
    return this.getTileType(maze, x, y) === 4;
  }

  static isHeart(maze, x, y) {
    return this.getTileType(maze, x, y) === 2;
  }

  static isKey(maze, x, y) {
    return this.getTileType(maze, x, y) === 3;
  }

  static isExit(maze, x, y) {
    return this.getTileType(maze, x, y) === 5;
  }
}

export default CollisionHandler;