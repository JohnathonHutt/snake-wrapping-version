//jshint esversion:6

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gst = {
  score: 0,
  snake: [{
    x: 150,
    y: 150
  }, {
    x: 150,
    y: 160
  }, {
    x: 150,
    y: 170
  }, {
    x: 150,
    y: 180
  }, {
    x: 150,
    y: 190
  }],
  dir: 'u',
  h: 10,
  w: 10,
  pellet: {
    x: canvas.width / 2,
    y: 40
  },
  isGameStarted: false,
  isGamePaused: false,
  pauseScreenIsDrawn: false
};

//controls event listener
document.addEventListener('keydown', function(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    if (gst.dir == 'u' || gst.dir == 'd') {
      gst.dir = 'r';
    }
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    if (gst.dir == 'u' || gst.dir == 'd') {
      gst.dir = 'l';
    }
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    if (gst.dir == 'l' || gst.dir == 'r') {
      gst.dir = 'u';
    }
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    if (gst.dir == 'l' || gst.dir == 'r') {
      gst.dir = 'd';
    }
  }
});

function drawStartScreen() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("CLICK TO START", 55, canvas.height / 2);
  canvas.addEventListener('click', startGame, {
    once: true
  });
  document.addEventListener('keydown', function(e) {
    startGame();
  }, {
    once: true
  });
}

function drawPauseScreen() {
  //only draw Screen once - gets blurry with consecutive redraws
  if (!gst.pauseScreenIsDrawn) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("CLICK TO RESUME", 45, canvas.height / 2);
    gst.pauseScreenIsDrawn = true;
  }
}

function startGame() {
  gst.isGameStarted = true;
  canvas.addEventListener('click', togglePause);
}

function togglePause() {
  (gst.isGamePaused === false) ? gst.isGamePaused = true: gst.isGamePaused = false;
  //resets pause screen draw when un-paused
  if (gst.pauseScreenIsDrawn === true) {
    gst.pauseScreenIsDrawn = false;
  }
}

//update functions
function moveSnake() {
  if (gst.dir === 'u') {
    u();
  } else if (gst.dir === 'd') {
    d();
  } else if (gst.dir === 'l') {
    l();
  } else if (gst.dir === 'r') {
    r();
  }
}

//move snake helper functions
function u() {
  if (gst.snake[0].y === 0) {
    gst.snake.unshift({
      x: gst.snake[0].x,
      y: canvas.height - gst.h
    });
  } else {
    gst.snake.unshift({
      x: gst.snake[0].x,
      y: gst.snake[0].y - gst.h
    });
  }
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function d() {
  if (gst.snake[0].y === canvas.height - gst.h) {
    gst.snake.unshift({
      x: gst.snake[0].x,
      y: 0
    });
  } else {
    gst.snake.unshift({
      x: gst.snake[0].x,
      y: gst.snake[0].y + 10
    });
  }
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function l() {
  if (gst.snake[0].x === 0) {
    gst.snake.unshift({
      x: canvas.width - gst.w,
      y: gst.snake[0].y
    });
  } else {
    gst.snake.unshift({
      x: gst.snake[0].x - 10,
      y: gst.snake[0].y
    });
  }
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function r() {
  if (gst.snake[0].x === canvas.width - gst.w) {
    gst.snake.unshift({
      x: 0,
      y: gst.snake[0].y
    });
  } else {
    gst.snake.unshift({
      x: gst.snake[0].x + 10,
      y: gst.snake[0].y
    });
  }
  checkForGameOver();
  if (!isTherePellet()) {
    gst.snake.pop();
  }
}

function isTherePellet() {
  //conditional under directions if coordiantes of new snake squar === pellet coordinates dont pop
  if (gst.pellet.x === gst.snake[0].x && gst.pellet.y === gst.snake[0].y) {
    gst.score += 10;
    makeNewPellet();
    return true;
  }
}

function makeNewPellet() {
  let x;
  let y;
  let inSnake;
  do {
    inSnake = false;
    x = Math.floor(Math.random() * (canvas.width / gst.w)) * 10;
    console.log(x);
    y = Math.floor(Math.random() * (canvas.height / gst.h)) * 10;
    console.log(y);
    gst.snake.forEach(s => {
      if (s.x === x && s.y === y) {
        inSnake = true;
        console.log('Pellet in snake');
      }
    });
  }
  while (inSnake);

  gst.pellet.x = x;
  gst.pellet.y = y;
}

function checkForGameOver() {
  gst.snake.slice(3).forEach(s => {
    if (s.x === gst.snake[0].x && s.y === gst.snake[0].y) {
      console.log("Game Over");
    }
  });
}

function update() {
  //stuff
  moveSnake();
}

function drawSnake() {
  gst.snake.forEach(s => {
    ctx.beginPath();
    ctx.rect(s.x, s.y, gst.h, gst.w);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "rgb(148, 193, 30)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  });
}

function drawPellet() {
  ctx.beginPath();
  ctx.rect(gst.pellet.x, gst.pellet.y, 10, 10);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  //stuff
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPellet();
  drawSnake();
}

let counter = 0;

function gameLoop() {
  if (gst.isGameStarted) {
    if (gst.isGamePaused) {
      drawPauseScreen();
    } else {
      counter += 1;
      if (counter % 10 === 0) {
        update();
        draw();
      }
    }
  }
  requestAnimationFrame(gameLoop);
}

drawStartScreen();
gameLoop();
