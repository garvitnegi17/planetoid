// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Snake and sphere variables
let snake = [];
let snakeLength = 5;
const cellSize = 1;
let direction = new THREE.Vector3(1, 0, 0);
let spherePosition = new THREE.Vector3(5, 0, 0);
let speed = 100; // Default speed (ms per update)
let score = 0;
let gameStarted = false;

// Snake material and geometry
const snakeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
const segmentGeometry = new THREE.SphereGeometry(0.5, 16, 16);

// Initialize snake
for (let i = 0; i < snakeLength; i++) {
  const segment = new THREE.Mesh(segmentGeometry, snakeMaterial);
  segment.position.set(-i, 0, 0);
  snake.push(segment);
  scene.add(segment);
}

// Sphere (food)
const sphere = new THREE.Mesh(segmentGeometry, sphereMaterial);
sphere.position.copy(spherePosition);
scene.add(sphere);

// Grid plane
const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
scene.add(gridHelper);

// Camera position
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// Keyboard controls
const keyState = {};
window.addEventListener("keydown", (e) => (keyState[e.code] = true));
window.addEventListener("keyup", (e) => (keyState[e.code] = false));

// Countdown function
function showCountdown(callback) {
  const countdownDiv = document.getElementById("countdown");
  let count = 3;
  countdownDiv.style.display = "block";
  countdownDiv.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      countdownDiv.textContent = "Go!";
    } else if (count < 0) {
      clearInterval(interval);
      countdownDiv.style.display = "none";
      callback();
    } else {
      countdownDiv.textContent = count;
    }
  }, 1000);
}

// Start game
function startGame(selectedSpeed) {
  speed = selectedSpeed;
  document.getElementById("overlay").style.display = "none";
  showCountdown(() => {
    gameStarted = true;
    animate();
  });
}

// Movement update
function updateDirection() {
  if (keyState["ArrowUp"] && direction.y === 0) direction.set(0, 1, 0);
  if (keyState["ArrowDown"] && direction.y === 0) direction.set(0, -1, 0);
  if (keyState["ArrowLeft"] && direction.x === 0) direction.set(-1, 0, 0);
  if (keyState["ArrowRight"] && direction.x === 0) direction.set(1, 0, 0);
}

// Game loop
function animate() {
  if (!gameStarted) return;

  setTimeout(() => {
    requestAnimationFrame(animate);

    updateDirection();

    // Move snake
    const headPosition = snake[0].position.clone();
    headPosition.add(direction);

    // Check collisions
    if (headPosition.equals(spherePosition)) {
      // Increase score
      score += 10;
      document.getElementById("score").textContent = score;

      // Add new segment
      const newSegment = new THREE.Mesh(segmentGeometry, snakeMaterial);
      const tail = snake[snake.length - 1];
      newSegment.position.copy(tail.position);
      snake.push(newSegment);
      scene.add(newSegment);

      // Reposition sphere
      spherePosition.set(
        Math.floor(Math.random() * 20 - 10),
        Math.floor(Math.random() * 20 - 10),
        0
      );
      sphere.position.copy(spherePosition);
    }

    // Move segments
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].position.copy(snake[i - 1].position);
    }
    snake[0].position.copy(headPosition);

    // Check self-collision or boundary collision
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].position.equals(snake[i].position)) {
        gameOver(); // Call game over function
        return;
      }
    }
    if (
      Math.abs(headPosition.x) > 25 ||
      Math.abs(headPosition.y) > 25 ||
      Math.abs(headPosition.z) > 25
    ) {
      gameOver(); // Call game over function
      return;
    }

    // Render the scene
    renderer.render(scene, camera);
  }, speed);
}
// Show Game Over Modal
function showGameOver() {
    const modal = document.getElementById('gameOverModal');
    const finalScore = document.getElementById('finalScore');
    finalScore.textContent = score;
    modal.style.display = 'flex';
  }

 // Restart the game
function restartGame() {
    // Reset the game state
    gameStarted = false;  // Stop the game
    score = 0;  // Reset score
    document.getElementById("score").textContent = score;  // Update score on UI
  
    // Remove all snake segments from the scene
    snake.forEach(segment => scene.remove(segment));
    snake = [];  // Clear the snake array
  
    // Initialize the snake again
    const snakeLength = 5; // Reset snake length or use your preferred value
    for (let i = 0; i < snakeLength; i++) {
      const segment = new THREE.Mesh(segmentGeometry, snakeMaterial);
      segment.position.set(-i, 0, 0);
      snake.push(segment);
      scene.add(segment);
    }
  
    // Reset sphere (food) position
    spherePosition = new THREE.Vector3(5, 0, 0);
    sphere.position.copy(spherePosition);
  
    // Hide the Game Over modal
    document.getElementById('gameOverModal').style.display = 'none';
  
    // Start the game again with the previous speed setting
    startGame(speed);
  }
  // Exit the game and go to the homepage
  function exitGame() {
    // Close the game modal
    document.getElementById("gameOverModal").style.display = "none";

    // Optionally, clear the scene or reset the game state
    scene.clear();  // Clear the scene for a fresh state

    // Redirect to the homepage (change 'index.html' to your homepage URL)
    window.location.href = '../pages/Snake.html';  // Homepage URL
  }
  
  // Updated Game Loop (to trigger Game Over)
  function animate() {
    if (!gameStarted) return;
  
    setTimeout(() => {
      requestAnimationFrame(animate);
  
      updateDirection();
  
      // Move snake
      const headPosition = snake[0].position.clone();
      headPosition.add(direction);
  
      // Check collisions
      if (headPosition.equals(spherePosition)) {
        // Increase score
        score += 10;
        document.getElementById("score").textContent = score;
  
        // Add new segment
        const newSegment = new THREE.Mesh(segmentGeometry, snakeMaterial);
        const tail = snake[snake.length - 1];
        newSegment.position.copy(tail.position);
        snake.push(newSegment);
        scene.add(newSegment);
  
        // Reposition sphere
        spherePosition.set(
          Math.floor(Math.random() * 20 - 10),
          Math.floor(Math.random() * 20 - 10),
          0
        );
        sphere.position.copy(spherePosition);
      }
  
      // Move segments
      for (let i = snake.length - 1; i > 0; i--) {
        snake[i].position.copy(snake[i - 1].position);
      }
      snake[0].position.copy(headPosition);
  
      // Check self-collision or boundary collision
      for (let i = 1; i < snake.length; i++) {
        if (snake[0].position.equals(snake[i].position)) {
          showGameOver(); // Trigger Game Over Modal
          return;
        }
      }
      if (
        Math.abs(headPosition.x) > 25 ||
        Math.abs(headPosition.y) > 25 ||
        Math.abs(headPosition.z) > 25
      ) {
        showGameOver(); // Trigger Game Over Modal
        return;
      }
  
      // Render the scene
      renderer.render(scene, camera);
    }, speed);
  }
  