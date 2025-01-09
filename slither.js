/** CONSTANTS **/
const CANVAS_BORDER_COLOR = "black";
const CANVAS_BACKGROUND_COLOR = "white";
const INITIAL_SNAKE_BORDER_COLOR = "darkgreen";
const INITIAL_SNAKE_COLOR = "lightgreen";
const SNAKE_BORDER_COLOR = "darkgreen";
const LEVEL_UP_LENGTH = 6; // Length required to level up
const MIN_GAME_SPEED = 20; // Minimum speed
let currentSnakeColor = INITIAL_SNAKE_COLOR;
let currentBorderColor = INITIAL_SNAKE_BORDER_COLOR;
let currentLevel = 1;
const SNAKE_COLORS = [
  "#960505",
  "blue",
  "#f29222",
  "purple",
  "#f7e592",
  "#700351",
  "cyan",
  "#d663f2",
  "#89e01d",
];
const SNAKE_BORDER_COLORS = [
  "white",
  "#ADD8E6",
  "#261004",
  "#DDA0DD",
  "yellow",
  "#f511b4",
  "#5500ff",
  "#2c0236",
  "#2b4a05",
];

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
];

// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;
// Horizontal velocity
let dx = 0;
// Vertical velocity
let dy = -10;
// game speed
let gameSpeed = 120;
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
  ctx.fillStyle = "#0cf5c6";
  ctx.strokeStyle = "#056350";
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

// Draws the snake on the canvas
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// Draws a part of the snake on the canvas
function drawSnakePart(snakePart) {
  ctx.fillStyle = currentSnakeColor;
  ctx.strokeStyle = currentBorderColor;

  // snake dimension set to 10x10
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

const replayButton = document.getElementById("replayButton");

function resetGame() {
  // Reset game state
  snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
  ];
  dx = 0;
  dy = -10;
  gameSpeed = 120;
  score = 0;
  currentLevel = 1;
  currentSnakeColor = INITIAL_SNAKE_COLOR;
  currentBorderColor = INITIAL_SNAKE_BORDER_COLOR;

  // Reset score display
  document.getElementById("score").innerHTML = score;
  document.getElementById("level").innerHTML = currentLevel;

  // Create new food and restart the game
  createFood();
  replayButton.disabled = true; // Disable replay button
  replayButton.style.display = "none"; // Hide the button
  main();
}

function levelUp() {
  if (snake.length >= LEVEL_UP_LENGTH) {
    currentLevel++;
    const colorIndex = (currentLevel - 2) % SNAKE_COLORS.length; // Adjust index to start with the first color (red)
    currentSnakeColor = SNAKE_COLORS[colorIndex];
    currentBorderColor = SNAKE_BORDER_COLORS[colorIndex];
    document.getElementById("level").innerHTML = currentLevel;

    gameSpeed = Math.max(gameSpeed - 10, MIN_GAME_SPEED); // Increase speed
    snake.splice(4); // Reset the snake to default length

    // Check for game completion
    if (gameSpeed === MIN_GAME_SPEED && currentLevel > SNAKE_COLORS.length) {
      const scoreElement = document.getElementById("score");
      scoreElement.innerHTML = "Final Score: " + score;
      return true; // Game finished
    }
  }
  return false; // Game continues
}

main();
createFood();

function main() {
  const gameEndResult = didGameEnd();

  if (gameEndResult.status) {
    document.getElementById("score").innerHTML = gameEndResult.message;
    replayButton.disabled = false; // Enable replay button
    replayButton.style.display = "block"; // Show the button
    return;
  }

  if (levelUp()) {
    return; // Exit if game is finished
  }

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, gameSpeed);
}
replayButton.addEventListener("click", resetGame);
drawSnake();
