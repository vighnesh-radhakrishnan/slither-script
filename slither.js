/** CONSTANTS **/
const CANVAS_BORDER_COLOR = "black";
const CANVAS_BACKGROUND_COLOR = "white";
const SNAKE_COLOR = "lightgreen";
const SNAKE_BORDER_COLOR = "darkgreen";

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

// Get the canvas element
var gameCanvas = document.getElementById("gameCanvas");

// Return a two-dimensional drawing context
var ctx = gameCanvas.getContext("2d");

// Initialize the canvas
function initCanvas() {
  // Set the canvas fillccolor
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  // Set the canvas border
  ctx.strokestyle = CANVAS_BORDER_COLOR;

  // Draw filled rectangle with border for the entire canvas
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
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

// Initialize and draw
initCanvas();
drawSnake();
