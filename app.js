var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// ctx.fillStyle = "black";
// ctx.fillRect(10, 10, 100, 100);

const gameWidth    = 240;
const gameHeight   = 180;
const canvasWidth  = canvas.width;
const canvasHeight = canvas.height;
const gameSpeed    = 10;
const paddleHeight = 40;
const paddleWidth  = paddleHeight/4;
const ballRadius   = 5;
const gameState = {
  ball: {x: gameWidth/2, y: gameHeight/2, velocity: { x: 1, y: 0 }},
  paddle1: {x: 0, y: gameHeight/2, velocity: { x: 0, y: 0 }},
  paddle2: {x: gameWidth-1, y: gameHeight/2, velocity: { x: 0, y: 0 }}
};

//keyboard input
var Keyboarder = function() {
  var keyState = {};

  window.onkeydown = function(e) {
    keyState[e.keyCode] = true;
  };

  window.onkeyup = function(e) {
    keyState[e.keyCode] = false;
  };

  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };

  this.KEYS = {
    p1Up:   87, // "W",
    p1Down: 83, // "S",
    p2Up:   38, // "up arrow",
    p2Down: 40, // "down arrow",
  };
};

let keyboarder = new Keyboarder();

gameState.getScreenBuffer = function() {
  const screenBuffer = []; 
  function putCircle (x, y, r) {
    for(let i=0; i<gameWidth; i++) {
      for(let j=0; j<gameHeight; j++) {
        if (Math.sqrt(((x-i)*(x-i))+((y-j)*(y-j))) < ballRadius) {
          screenBuffer[i][j] = true;
        }
      }
    }
  }
  for(var i=0; i<gameWidth; i++) {
    screenBuffer.push((new Array(gameHeight)).fill(false));
  }
  // set ball pixels to true
  putCircle(this.ball.x, this.ball.y, ballRadius);
  // set paddle pixels to true
  for (let i=0; i<paddleHeight; i++) {
    for (let j=0; j<paddleWidth; j++) {
      // set paddle1 pixels
      screenBuffer[this.paddle1.x + j][this.paddle1.y + i] = true;
      // set paddle2 pixels
      screenBuffer[this.paddle2.x - j][this.paddle2.y + i] = true;
    }
  }
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

let animationProgress = 0;
let previousTimestamp = null;

// animation loop
function step(timestamp) {
  if (!previousTimestamp) timestamp = timestamp;
  animationProgress += timestamp - previousTimestamp;
  previousTimestamp = timestamp;
  if (animationProgress > gameSpeed) {
    update(gameState);
    animationProgress = 0;
  }
  draw(gameState.getScreenBuffer());
  window.requestAnimationFrame(step);
}

function update(gameState) {
  updateBall(gameState);
  updatePaddles(gameState);
}

function updateBall() {
  // collide with right paddle
  if ((gameState.ball.x + ballRadius === gameWidth - 1 - paddleWidth) && paddleCollison(gameState.ball, gameState.paddle2)) {
    gameState.ball.velocity.x *= -1;
  }
  // collide with left paddle
  if ((gameState.ball.x - ballRadius === paddleWidth) && paddleCollison(gameState.ball, gameState.paddle1)) {
    gameState.ball.velocity.x *= -1;
  }
  // collide with right wall
  if (gameState.ball.x + ballRadius === gameWidth - 1) {
    gameState.ball.velocity.x *= -1;
  }
  // collide with left wall
  if (gameState.ball.x - ballRadius === 0) {
    gameState.ball.velocity.x *= -1;
  }
  // collide with bottom
  if (gameState.ball.y + ballRadius === gameHeight - 1) {
    gameState.ball.velocity.y *= -1;
  }
  // collide with top
  if (gameState.ball.y - ballRadius === 0) {
    gameState.ball.velocity.y *= -1;
  }
  gameState.ball.x += gameState.ball.velocity.x;
  gameState.ball.y += gameState.ball.velocity.y;
}

function paddleCollison(ball, paddle) {
  let paddleCenter = paddle.y + (paddleHeight / 2);
  let distanceFromCenter = ball.y - paddleCenter;
  console.log("distance from center:", distanceFromCenter, "paddle center:", paddleCenter);
  if (distanceFromCenter < 0) {
    return Math.abs(distanceFromCenter) <= paddleHeight/2;
  } else {
    return distanceFromCenter < paddleHeight/2;
  }
}

function updatePaddles() {
  if (keyboarder.isDown(keyboarder.KEYS.p1Up) && gameState.paddle1.y > 0) {
    gameState.paddle1.velocity.y = -1;
  } else if (keyboarder.isDown(keyboarder.KEYS.p1Down) && gameState.paddle1.y < gameHeight - paddleHeight) {
    gameState.paddle1.velocity.y = 1;
  } else {
    gameState.paddle1.velocity.y = 0;
  }
  if (keyboarder.isDown(keyboarder.KEYS.p2Up) && gameState.paddle2.y > 0) {
    gameState.paddle2.velocity.y = -1;
  } else if (keyboarder.isDown(keyboarder.KEYS.p2Down) && gameState.paddle2.y < gameHeight - paddleHeight) {
    gameState.paddle2.velocity.y = 1;
  } else {
    gameState.paddle2.velocity.y = 0;
  }
  gameState.paddle1.y += gameState.paddle1.velocity.y;
  gameState.paddle2.y += gameState.paddle2.velocity.y;
}

// init
window.requestAnimationFrame(step);
