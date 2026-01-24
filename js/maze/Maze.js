import { mazes } from "./MazeLevels.js";
import { images, loadAllImages } from "./ImageLoader.js";

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mazesArr = mazes;
const TILE_SIZE = 120;

// Import images
let path = images.path;
let wall = images.wall;
let door = images.door;
let key = images.key;
let gem = images.gem;
let trap = images.trap;
let openDoor = images.openDoor;
let KeyspriteWidth = 125;   // ← Exact: 500 ÷ 4 = 125
let KeyspriteHeight = 500;  // ← Exact: full height
let GemspriteWidth = 169.25;  // ← Exact: 677 ÷ 4 = 169.25
let GemspriteHeight = 369;    // ← Exact: full height
let frameX = 0;
let gameFrame = 0;
let staggerFrames = 20;
let keyPositions = [];
let gemPositions = [];
let trapPositions = [];

let currentCamera = { x: 0, y: 0 };

function animateKeys(camera = { x: 0, y: 0 }) {
  currentCamera = camera;
  gameFrame++;
  let position = Math.floor(gameFrame / staggerFrames) % 4;
  keyPositions.forEach(({ x, y }) => {
    ctx.drawImage(
      path,
      x * TILE_SIZE - camera.x,
      y * TILE_SIZE - camera.y,
      TILE_SIZE,
      TILE_SIZE,
    );
    frameX = KeyspriteWidth * position;
    ctx.drawImage(
      key,
      frameX,
      0,
      KeyspriteWidth,
      KeyspriteHeight,
      x * TILE_SIZE - camera.x,
      y * TILE_SIZE - camera.y,
      TILE_SIZE + 10,
      TILE_SIZE + 20,
    );
  });

  gemPositions.forEach(({ x, y }) => {
    ctx.drawImage(
      path,
      x * TILE_SIZE - camera.x,
      y * TILE_SIZE - camera.y,
      TILE_SIZE,
      TILE_SIZE,
    );
    frameX = GemspriteWidth * position;
    ctx.drawImage(
      gem,
      frameX,
      0,
      GemspriteWidth,
      GemspriteHeight,
      x * TILE_SIZE - camera.x,
      y * TILE_SIZE - camera.y,
      TILE_SIZE,
      TILE_SIZE,
    );
  });
}

// canvas width 1180 height 500
function loadLevelMaze(level,camera = {x:0 , y:0}) {
    let maze = mazesArr[level - 1];
    return loadAllImages().then(() => {
        //console.log("All images loaded!");
        drawMaze(maze, camera);
        animateKeys(camera);
    });
}

function drawMaze(maze, camera = { x: 0, y: 0 }) {
    currentCamera = camera;
    keyPositions = [];
    gemPositions = [];
    //i used this to get the trap positions
    trapPositions = [];
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) { // i for row(y) ,j for column(x)
            if (maze[i][j] === 0) {
                //console.log(i,j);
                //drawPath(j, i);
                drawElement(j,i,path);
            } else if (maze[i][j] === 1) {
                //console.log(i, j);
                //drawWall(j, i);
                drawElement(j,i,wall);
            } else if (maze[i][j] === 5) {
                //drawDoor(j, i);
                drawElement(j,i,door);
            } else if (maze[i][j] === 3) {
                //drawPath(j, i);
                drawElement(j,i,path);
                keyPositions.push({ x: j, y: i });
            } else if (maze[i][j] === 2) {
                //drawPath(j, i);
                drawElement(j,i,path);
                gemPositions.push({ x: j, y: i });
            }else if(maze[i][j] === 6){
                drawElement(j,i,openDoor);
                //openClosedDoor(j,i);
            }else if(maze[i][j] === 4){
                //drawTrap(j,i);
                drawElement(j,i,trap);
                //i used this to get the trap positions
                trapPositions.push({ x: j, y: i });
            }
        }

    }
  }

function drawElement(x,y,image){
    ctx.drawImage(image, x * TILE_SIZE - currentCamera.x, y * TILE_SIZE - currentCamera.y, TILE_SIZE, TILE_SIZE);
}

function drawPath(x, y) {
    drawElement(x, y, path);
}

function isWall(row, col, level) { //checke the dimensions given is wall or not
    if (!isInsideMaze(row, col, level)) {
        return false;
    }
    let maze = mazesArr[level - 1];
    return maze[row][col] === 1;
}
function isInsideMaze(row, col, level) { //check if the dimensions given outside the bounds of the array
    let maze = mazesArr[level - 1];
    if (row > maze.length - 1 || col > maze[0].length - 1 || row < 0 || col < 0) {
        //console.log("Outside");
        return false;
    }
    return true;
}
function getStartPosition() { //return the start position of the player
    return {
        row: 0,
        col: 0
    }
}
function getEndPosition(level) { // return the end position of the player
    let maze = mazesArr[level - 1];
    return {
        row: maze.length - 1,
        col: maze[maze.length - 1].length - 1
    }
}
function hasTrap(row, col, level) { //return if the dimension given is a trap or not
    let maze = mazesArr[level - 1];
    return maze[row][col] === 4;
}

function hasLife(row, col, level) { // return if the dimension given is gem or not
    let maze = mazesArr[level - 1];
    return maze[row][col] === 2;
}
function getLifePositions() {  // return gem position of the current maze
    return [...gemPositions];
}
function getTrapPositions() { // return trap positions
    return [...trapPositions];
}
function removeElementfromMaze(row, col) { // remove life from maze and draw tile above it
    drawPath(col, row);
}
//i used insted of function loadLevelMaze in game
function renderMaze(maze, camera) {
    drawMaze(maze, camera);
    animateKeys(camera);
}

export { 
    loadLevelMaze, 
    drawMaze, 
    animateKeys, 
    renderMaze, 
    getStartPosition, 
    getEndPosition,
    hasTrap,
    hasLife,
    getLifePositions,
    getTrapPositions,
    removeElementfromMaze,
    isWall,
    isInsideMaze
};