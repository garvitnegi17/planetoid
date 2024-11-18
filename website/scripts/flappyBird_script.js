// script.js
const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");

let birdY = 200;
let birdVelocity = 0;
let gravity = 0.25; // Reduced gravity
let isGameOver = false;
let score = 0;

let obstacles = [];
let obstacleSpeed = 3;
let obstacleFrequency = 1800; // milliseconds

function startGame() {
  document.addEventListener("keydown", fly);
  gameContainer.addEventListener("touchstart", fly); // Added touch event listener
  setInterval(gameLoop, 20);
  setInterval(generateObstacle, obstacleFrequency);
}

function fly(event) {
  if (event.key === " " || event.key === "ArrowUp" || event.type === "touchstart") {
    birdVelocity = -6; // Reduced upward velocity
  }
}

function gameLoop() {
  if (isGameOver) return;
  
  birdVelocity += gravity;
  birdY += birdVelocity;
  
  if (birdY > gameContainer.clientHeight - bird.clientHeight || birdY < 0) {
    gameOver();
  }
  
  bird.style.top = birdY + "px";
  updateScore();
  moveObstacles();
  checkCollision();
}

function generateObstacle() {
  const obstacleTop = document.createElement("div");
  const obstacleBottom = document.createElement("div");

  obstacleTop.classList.add("obstacle", "top");
  obstacleBottom.classList.add("obstacle", "bottom");

  const gap = 200; // Increased gap
  const obstacleHeight = Math.random() * (gameContainer.clientHeight - gap);
  
  obstacleTop.style.height = obstacleHeight + "px";
  obstacleTop.style.left = gameContainer.clientWidth + "px";
  
  obstacleBottom.style.height = (gameContainer.clientHeight - obstacleHeight - gap) + "px";
  obstacleBottom.style.left = gameContainer.clientWidth + "px";
  
  gameContainer.appendChild(obstacleTop);
  gameContainer.appendChild(obstacleBottom);
  
  obstacles.push({ top: obstacleTop, bottom: obstacleBottom });
}

function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    const obstacleLeft = parseInt(obstacle.top.style.left);
    if (obstacleLeft < -60) {
      obstacle.top.remove();
      obstacle.bottom.remove();
      obstacles.splice(index, 1);
      return;
    }
    obstacle.top.style.left = obstacleLeft - obstacleSpeed + "px";
    obstacle.bottom.style.left = obstacleLeft - obstacleSpeed + "px";
  });
}

function checkCollision() {
  obstacles.forEach(obstacle => {
    const birdRect = bird.getBoundingClientRect();
    const topRect = obstacle.top.getBoundingClientRect();
    const bottomRect = obstacle.bottom.getBoundingClientRect();
    
    if (birdRect.left < topRect.right &&
        birdRect.right > topRect.left &&
        (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top)) {
      gameOver();
    }
  });
}

function gameOver() {
  isGameOver = true;
  alert("Game Over! Your score: " + score);
  location.reload(); // Restart the game
}

function updateScore() {
  score++;
  scoreElement.textContent = score;
}

startGame();
