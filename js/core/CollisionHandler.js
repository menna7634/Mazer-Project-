// CollisionHandler.js

class CollisionHandler {

    static checkMonster(maze, x, y, state) {
        if (maze && maze[y] && maze[y][x] === 4) {
            state.playerHearts--;
            return true;
        }
        return false;
    }

    static checkHeart(maze, x, y, state) {
        if (maze && maze[y] && maze[y][x] === 2) {
            if (state.playerHearts < 3) {
                state.playerHearts++;
            }
            maze[y][x] = 0;
            return true;
        }
        return false;
    }

    static checkKey(maze, x, y, state) {
        if (maze && maze[y] && maze[y][x] === 3) {
            state.keysCollected++;
            maze[y][x] = 0;
            return true;
        }
        return false;
    }
}

export default CollisionHandler;
