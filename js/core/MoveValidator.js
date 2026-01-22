// MoveValidator.js

class MoveValidator {

    static canMove(maze, x, y) {
        if (!maze) return false;

        if (y < 0 || y >= maze.length) return false;
        if (x < 0 || x >= maze[y].length) return false;

        const tile = maze[y][x];
        if (tile === 1) return false;

        return true;
    }

    static getNewPosition(currentPos, direction) {
        let newX = currentPos.x;
        let newY = currentPos.y;

        if (direction === 'up') newY = newY - 1;
        if (direction === 'down') newY = newY + 1;
        if (direction === 'left') newX = newX - 1;
        if (direction === 'right') newX = newX + 1;

        return { x: newX, y: newY };
    }
}

export default MoveValidator;
