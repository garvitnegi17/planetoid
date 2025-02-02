// Scene, camera, and renderer setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e1e); // Dark background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Table boundaries
const tableWidth = 20; // Width of the game area
const tableHeight = 20; // Height of the game area

// Table grid (visual boundary)
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
const tableGeometry = new THREE.PlaneGeometry(tableWidth, tableHeight);
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotation.x = -Math.PI / 2; // Lay it flat
scene.add(table);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Snake and sphere variables
let snake = [];
let snakeLength = 5;
const cellSize = 1;
let direction = new THREE.Vector3(1, 0, 0); // Initially moving to the right
let spherePosition = new THREE.Vector3(
  Math.floor(Math.random() * tableWidth - tableWidth / 2),
  0.5,
  Math.floor(Math.random() * tableHeight - tableHeight / 2)
);
let speed = 200; // Speed in milliseconds per update
let gameStarted = false;

// Materials and geometry
const snakeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
const segmentGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);

// Initialize snake
for (let i = 0; i < snakeLength; i++) {
  const segment = new THREE.Mesh(segmentGeometry, snakeMaterial);
  segment.position.set(-i * cellSize, 0.5, 0);
  snake.push(segment);
  scene.add(segment);
}

// Sphere (food)
const sphere = new THREE.Mesh(segmentGeometry, sphereMaterial);
sphere.position.copy(spherePosition);
scene.add(sphere);

// Camera position
camera.position.set(0, 15, 15);
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

// Update snake direction based on key presses
function updateDirection() {
  if (keyState["ArrowUp"] && direction.z === 0) direction.set(0, 0, -1);
  if (keyState["ArrowDown"] && direction.z === 0) direction.set(0, 0, 1);
  if (keyState["ArrowLeft"] && direction.x === 0) direction.set(-1, 0, 0);
  if (keyState["ArrowRight"] && direction.x === 0) direction.set(1, 0, 0);
}

// Spawn new food
function spawnFood() {
  spherePosition = new THREE.Vector3(
    Math.floor(Math.random() * tableWidth - tableWidth / 2),
    0.5,
    Math.floor(Math.random() * tableHeight - tableHeight / 2)
  );
  sphere.position.copy(spherePosition);
}

// Game loop
function animate() {
  if (!gameStarted) return;

  setTimeout(() => {
    requestAnimationFrame(animate);

    updateDirection();

    // Move snake
    const headPosition = snake[0].position.clone();
    headPosition.add(direction.multiplyScalar(cellSize));

    // Check collisions with boundaries
    if (
      headPosition.x < -tableWidth / 2 ||
      headPosition.x > tableWidth / 2 - cellSize ||
      headPosition.z < -tableHeight / 2 ||
      headPosition.z > tableHeight / 2 - cellSize
    ) {
      showGameOver();
      return;
    }

    // Check collisions with food
    if (headPosition.equals(spherePosition)) {
      // Increase snake length
      const newSegment = new THREE.Mesh(segmentGeometry, snakeMaterial);
      const lastSegment = snake[snake.length - 1];
      newSegment.position.copy(lastSegment.position); // New segment appears where the last one was
      snake.push(newSegment);
      scene.add(newSegment);

      // Spawn a new food
      spawnFood();
    }

    // Move the snake segments
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].position.copy(snake[i - 1].position);
    }
    snake[0].position.copy(headPosition);

    // Render the scene
    renderer.render(scene, camera);
  }, speed);
}

// Show Game Over Modal
function showGameOver() {
  const modal = document.getElementById("gameOverModal");
  const finalScore = document.getElementById("finalScore");
  finalScore.textContent = "Game Over!"; // Updated message
  modal.style.display = "flex";
}

// Restart the game
function restartGame() {
  location.reload();
}

// Exit the game
function exitGame() {
  location.reload();
}
