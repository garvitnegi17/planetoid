const squares = document.querySelectorAll(".square");
const timeLeft = document.querySelector("#time-left");
const score = document.querySelector("#score");
const gameOverPopup = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

let result = 0;
let hitPosition = null;
let currentTime = 60;
let timerId = null;
let gameOver = false;

function randomSquare() {
  if (gameOver) return; // Stop spawning squares when game is over

  squares.forEach((square) => {
    square.classList.remove("emoji");
  });

  let randomSquare = squares[Math.floor(Math.random() * squares.length)];
  randomSquare.classList.add("emoji");
  hitPosition = randomSquare.id;
}

squares.forEach((square) => {
  square.addEventListener("mousedown", () => {
    if (!gameOver && square.id === hitPosition) {
      result++;
      score.textContent = result;
      hitPosition = null;
    }
  });
});

function moveEmoji() {
  timerId = setInterval(randomSquare, 500);
}

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    gameOver = true; // Stop the game

    // Display game-over pop-up
    finalScore.textContent = result;
    gameOverPopup.style.display = "block";
  }
}

function restartGame() {
  gameOver = false;
  result = 0;
  currentTime = 60;
  score.textContent = result;
  timeLeft.textContent = currentTime;
  gameOverPopup.style.display = "none"; // Hide game-over popup

  // Restart game logic
  moveEmoji();
  countDownTimerId = setInterval(countDown, 1000);
}

moveEmoji();
let countDownTimerId = setInterval(countDown, 1000);
