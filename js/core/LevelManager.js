// LevelManager.js

class LevelManager {

    static isLevelComplete(maze, playerPos) {
        const atExit = maze && maze[playerPos.y] && maze[playerPos.y][playerPos.x] === 5;

        let keysLeft = 0;
        if (maze) {
            for (let row of maze) {
                for (let tile of row) {
                    if (tile === 3) keysLeft++;
                }
            }
        }

        if (atExit && keysLeft === 0) {
            return true;
        }
        return false;
    }

    static showGameOver(level) {
        alert('Game Over! You reached Level ' + level);
    }
}

export default LevelManager;
