var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
// ctx.fillRect(10, 10, 100, 100);

const gameWidth  = 24;
const gameHeight = 16;


// game state 2d array of booleans
let gameState = [];
for(var i=0; i<gameWidth; i++) {
  gameState.push((new Array(gameHeight)).fill(false));
}


// draw function
function draw(gameState) {
  for(var i=0; i<gameState.length; i++) {
    for(var j=0; j<gameState[i].length; j++) {
      if(gameState[i][j]) {
        drawPixel(i,j);
      }
    }
  }
}

function drawPixel(x,y) {
  ctx.fillRect(x, y, 1, 1);
}

gameState[10][10] = true;

draw(gameState);
