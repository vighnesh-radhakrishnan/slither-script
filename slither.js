/** CONSTANTS **/
const CANVAS_BORDER_COLOR = "black";
const CANVAS_BACKGROUND_COLOR = "white";
const SNAKE_COLOR = "lightgreen";
const SNAKE_BORDER_COLOR = "darkgreen";

let snake = [
  { x: 150, y: 140 },
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;
// Horizontal velocity
let dx = 0;
// Vertical velocity
let dy = -10;
// score
let score = 0;
// change direction flag to solve quick direction change bug
let changingDirection = false;

// Get the canvas element
var gameCanvas = document.getElementById("gameCanvas");

// Return a two-dimensional drawing context
var ctx = gameCanvas.getContext("2d");

// Initialize the canvas
function clearCanvas() {
  // Set the canvas fillccolor
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  // Set the canvas border
  ctx.strokestyle = CANVAS_BORDER_COLOR;

  // Draw filled rectangle with border for the entire canvas
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (didCollide) return { status: true, message: "Bitten!" };
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameCanvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height - 10;

  if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
    return { status: true, message: "Splat!" };
  }

  return { status: false, message: "" };
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  // check prevent quick reverse direction bug
  if (changingDirection) return;
  changingDirection = true;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

// listen to key press, keyDown is used since we want the action to be done
// as the key is pressed and not when released
document.addEventListener("keydown", changeDirection);

function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  snake.unshift(head);
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    createFood();
  } else {
    snake.pop();
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.strokestyle = "darkred";
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

// Draws the snake on the canvas
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// Draws a part of the snake on the canvas
function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.strokestyle = SNAKE_BORDER_COLOR;

  // snake dimension set to 10x10
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

main();
createFood();

function main() {
  const gameEndResult = didGameEnd();

  if (gameEndResult.status) {
    document.getElementById("score").innerHTML = gameEndResult.message;
    return;
  }

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, 100);
}

drawSnake();
