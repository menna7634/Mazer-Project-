let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "../../assets/images/game play /components /favicon.png"  // ← Change to your filename

const Canvas_WIDTH = canvas.width = 600;
const Canvas_HEIGHT = canvas.height = 600;

let spriteWidth = 169.25;  // ← Exact: 677 ÷ 4 = 169.25
let spriteHeight = 369;    // ← Exact: full height
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
let staggerFrames = 24;

function animate(){
    ctx.clearRect(0, 0, Canvas_WIDTH, Canvas_HEIGHT);
    let position = Math.floor(gameFrame / staggerFrames) % 4;
    frameX = spriteWidth * position; 
    ctx.drawImage(img, frameX, 0, spriteWidth, spriteHeight, 200, 200, 92, 200);
    //                                                              ^^  ^^^
    //                                        Width ~92, Height 200 (maintains aspect ratio)
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();