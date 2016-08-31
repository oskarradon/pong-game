var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// ctx.fillStyle = "black";
// ctx.fillRect(10, 10, 100, 100);

const gameWidth    = 24;
const gameHeight   = 18;
const canvasWidth  = canvas.width;
const canvasHeight = canvas.height;
const gameState = {
  ball: {x: gameWidth/2, y: gameHeight/2}
};


gameState.getScreenBuffer = function() {
  const screenBuffer = [];
  for(var i=0; i<gameWidth; i++) {
    screenBuffer.push((new Array(gameHeight)).fill(false));
  }
  screenBuffer[this.ball.x][this.ball.y] = true;
  return screenBuffer;
}

// draw function
function draw(screenBuffer) {
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle = "black";
  for(var i=0; i<screenBuffer.length; i++) {
    for(var j=0; j<screenBuffer[i].length; j++) {
      if(screenBuffer[i][j]) {
        drawPixel(i,j);
      }
    }
  }
}

function drawPixel(x,y) {
  let pixelWidth  = canvasWidth/gameWidth;
  let pixelHeight = canvasHeight/gameHeight;
  ctx.fillRect(x*pixelWidth, y*pixelHeight, pixelWidth, pixelHeight);
}

// animation loop
function step(timestamp) {
  update(gameState);
  draw(gameState.getScreenBuffer());
  window.requestAnimationFrame(step);
}

function update(gameState) {
  gameState.ball.x +=1;
}

// init
window.requestAnimationFrame(step);
