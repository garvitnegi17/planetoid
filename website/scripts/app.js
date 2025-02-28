var jet = document.getElementById("jet");
var board = document.getElementById("board");
var timerDisplay = document.getElementById("timer");
var gameTime = 60; // Set the time limit (e.g., 60 seconds)
var timer;
var gameOver = false; // Flag to check if the game is over

window.addEventListener("keydown", (e) => {
  if (gameOver) return; // Prevent any further actions when the game is over

  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  e.preventDefault();

  if (e.key == "ArrowLeft" && left > 0) {
    jet.style.left = left - 10 + "px";
  } else if (e.key == "ArrowRight" && left <= 460) {
    jet.style.left = left + 10 + "px";
  }

  if (e.key == "ArrowUp" || e.keyCode == 32) {
    fireBullet();
  }
});

// Start timer when the game begins
function startTimer() {
  timer = setInterval(() => {
    if (gameTime <= 0) {
      clearInterval(timer); // Stop the timer
      gameOver = true; // Set the game over flag to true
      alert("Time's up! Game Over!"); // Show Game Over alert
      clearInterval(moverocks); // Stop the rocks from moving
    } else {
      gameTime--;
      timerDisplay.innerHTML = `Time: ${gameTime}s`; // Update the timer display
    }
  }, 1000); // Decrement every second
}

// Stop timer when the game ends
function stopTimer() {
  clearInterval(timer);
}

// Call startTimer when the game starts (on first interaction)
startTimer();

var generaterocks = setInterval(() => {
  if (gameOver) return; // Prevent rock generation after game is over
  var rock = document.createElement("div");
  rock.classList.add("rocks");
  rock.style.left = Math.floor(Math.random() * 450) + "px";
  board.appendChild(rock);
}, 1000);

var moverocks = setInterval(() => {
  if (gameOver) return; // Stop moving rocks if the game is over

  var rocks = document.getElementsByClassName("rocks");

  if (rocks.length > 0) {
    for (var i = 0; i < rocks.length; i++) {
      var rock = rocks[i];
      var rocktop = parseInt(
        window.getComputedStyle(rock).getPropertyValue("top")
      );

      if (rocktop >= 475) {
        // Do nothing here anymore for Game Over
        rock.remove(); // Simply remove rock if it reaches the bottom
      }

      rock.style.top = rocktop + 25 + "px"; // Move rocks down
    }
  }
}, 450);

var leftBtn = document.getElementById("left");
var fireBtn = document.getElementById("fire");
var rightBtn = document.getElementById("right");

leftBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveJet("left");
});

rightBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveJet("right");
});

fireBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  fireBullet();
});

leftBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveJet("left");
});

rightBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveJet("right");
});

function moveJet(direction) {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  if (direction === "left" && left > 0) {
    jet.style.left = left - 10 + "px";
  } else if (direction === "right" && left <= 460) {
    jet.style.left = left + 10 + "px";
  }
}

function fireBullet() {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  var bullet = document.createElement("div");
  bullet.classList.add("bullets");
  board.appendChild(bullet);

  bullet.style.left = left + "px";
  bullet.style.bottom = "10%";

  function moveBullet() {
    if (gameOver) return; // Stop the bullet movement if the game is over

    var bulletbottom = parseInt(
      window.getComputedStyle(bullet).getPropertyValue("bottom")
    );

    var rocks = document.getElementsByClassName("rocks");
    for (var i = 0; i < rocks.length; i++) {
      var rock = rocks[i];
      if (rock !== undefined) {
        var rockbound = rock.getBoundingClientRect();
        var bulletbound = bullet.getBoundingClientRect();

        if (
          bulletbound.left >= rockbound.left &&
          bulletbound.right <= rockbound.right &&
          bulletbound.top <= rockbound.top &&
          bulletbound.bottom <= rockbound.bottom
        ) {
          rock.parentElement.removeChild(rock);
          document.getElementById("points").innerHTML =
            parseInt(document.getElementById("points").innerHTML) + 1;
        }
      }
    }

    if (bulletbottom >= 500) {
      bullet.remove();
    } else {
      bullet.style.bottom = bulletbottom + 3 + "px";
      requestAnimationFrame(moveBullet);
    }
  }

  requestAnimationFrame(moveBullet);
}
