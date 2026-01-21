import { mazes } from "./MazeLevels.js";
import { images, loadAllImages } from "./ImageLoader.js";

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mazesArr = mazes;
const TILE_SIZE = 40;

// Import images
let path = images.path;
let wall = images.wall;
let door = images.door;

let spriteWidth = 256;
let spriteHeight = 1024;
let frameX = 0;
let gameFrame = 0;
let staggerFrames = 24;
function animateKey(x,y){
    ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    let position = Math.floor(gameFrame/staggerFrames) % 4;
    frameX = spriteWidth * position; 
    ctx.drawImage(img, frameX, 0, spriteWidth, spriteHeight, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    gameFrame++;
    requestAnimationFrame(animateKey);
}

function loadLevelMaze(level){
    let maze = mazesArr[level-1];
    loadAllImages().then(() => {
    console.log("All images loaded!");
    drawMaze(maze);
    });
}

function drawMaze(maze){
    for(let i=0;i<maze.length;i++){
        for(let j=0;j<maze[i].length;j++){
            if(maze[j][i] == 0){
                console.log(i,j);
                drawPath(j,i);
            }else if(maze[j][i] == 1){
                drawWall(j,i);
            }else if(maze[j][i] == 5){
                drawDoor(j,i);
            }
        }
    }
}

function drawPath(x,y){
    ctx.drawImage(path,x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
}
function drawWall(x,y){
    ctx.drawImage(wall,x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
}

function drawDoor(x,y){
    ctx.drawImage(door , x*TILE_SIZE , y*TILE_SIZE , TILE_SIZE , TILE_SIZE);
}

//loadLevelMaze(1);
loadLevelMaze(1);