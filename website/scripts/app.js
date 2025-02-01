var jet = document.getElementById("jet");
var board = document.getElementById("board");

window.addEventListener("keydown", (e) => {
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

var generaterocks = setInterval(() => {
  var rock = document.createElement("div");
  rock.classList.add("rocks");
  rock.style.left = Math.floor(Math.random() * 450) + "px";
  board.appendChild(rock);
}, 1000);

var moverocks = setInterval(() => {
  var rocks = document.getElementsByClassName("rocks");

  if (rocks.length > 0) {
    for (var i = 0; i < rocks.length; i++) {
      var rock = rocks[i];
      var rocktop = parseInt(
        window.getComputedStyle(rock).getPropertyValue("top")
      );

      if (rocktop >= 475) {
        alert("Game Over");
        clearInterval(moverocks);
        window.location.reload();
      }

      rock.style.top = rocktop + 25 + "px";
    }
  }
}, 450);

var leftBtn = document.getElementById("left");
var fireBtn = document.getElementById("fire");
var rightBtn = document.getElementById("right");

// Mobile buttons - Add touchstart and touchmove for mobile support
leftBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();  // Prevent any default actions that may interfere
  moveJet("left");
});

rightBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();  // Prevent any default actions that may interfere
  moveJet("right");
});

fireBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();  // Prevent any default actions that may interfere
  fireBullet();
});

// For continuous movement, use touchmove to move the jet
leftBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveJet("left");
});

rightBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moveJet("right");
});

// Function to move jet
function moveJet(direction) {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  if (direction === "left" && left > 0) {
    jet.style.left = left - 10 + "px";
  } else if (direction === "right" && left <= 460) {
    jet.style.left = left + 10 + "px";
  }
}

// Function to fire bullet
function fireBullet() {
    var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
    var bullet = document.createElement("div");
    bullet.classList.add("bullets");
    board.appendChild(bullet);
  
    // Position the bullet above the jet
    bullet.style.left = left + "px";
    bullet.style.bottom = "10%"; // Set initial position for the bullet
  
    // Use requestAnimationFrame for smooth movement
    function moveBullet() {
      var bulletbottom = parseInt(
        window.getComputedStyle(bullet).getPropertyValue("bottom")
      );
  
      // Check for collision with rocks
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
            rock.parentElement.removeChild(rock); // Remove rock
            document.getElementById("points").innerHTML =
              parseInt(document.getElementById("points").innerHTML) + 1; // Increase score
          }
        }
      }
  
      if (bulletbottom >= 500) {
        bullet.remove(); // Remove bullet if it goes out of bounds
      } else {
        bullet.style.bottom = bulletbottom + 3 + "px"; // Move the bullet up
        requestAnimationFrame(moveBullet); // Continue moving the bullet
      }
    }
  
    requestAnimationFrame(moveBullet); // Start moving the bullet
  }


  