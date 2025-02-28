const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-game');
const leftButton = document.getElementById('left-btn');
const rightButton = document.getElementById('right-btn');
const downButton = document.getElementById('down-btn');

const topButton = document.getElementById('top-btn'); // Add a button for rotation

let grid = [];
let currentPiece = null;
let score = 0;
let gameInterval = null;

const ROWS = 20;
const COLS = 10;


// Shapes of blocks with corresponding class names for colors
const shapes = [
  { shape: [[1, 1, 1], [0, 1, 0]], className: 't-shape' }, // T-shape
  { shape: [[1, 1, 0], [0, 1, 1]], className: 'z-shape' }, // Z-shape
  { shape: [[0, 1, 1], [1, 1, 0]], className: 's-shape' }, // S-shape
  { shape: [[1, 1], [1, 1]], className: 'square-shape' },  // Square
  { shape: [[1, 1, 1, 1]], className: 'line-shape' }       // Line
];

// Initialize grid
function createGrid() {
  grid = [];
  gameArea.innerHTML = '';
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      gameArea.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }
}


// Spawn a random block
function spawnPiece() {
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  currentPiece = {
    shape: randomShape.shape,
    className: randomShape.className,
    row: 0,
    col: Math.floor(COLS / 2) - Math.floor(randomShape.shape[0].length / 2)
  };
  if (!canMove(0, 0)) {
    clearInterval(gameInterval);
    alert('Game Over');
    return;
  }
  drawPiece();
}

//-------------------------------------------------------

// Rotate the current piece
function rotatePiece() {
  if (!currentPiece) return;
  const oldShape = currentPiece.shape;
  const newShape = oldShape[0].map((_, colIndex) =>
    oldShape.map(row => row[colIndex]).reverse()
  );
  
  const oldClass = currentPiece.className;

  // Check if the rotation is valid
  if (canRotate(newShape)) {
    clearPiece();
    currentPiece.shape = newShape;
    drawPiece();
  }
}

// Check if the piece can rotate
function canRotate(newShape) {
  return newShape.every((row, i) => {
    return row.every((cell, j) => {
      if (!cell) return true;
      const newRow = currentPiece.row + i;
      const newCol = currentPiece.col + j;
      if (newRow >= ROWS || newCol < 0 || newCol >= COLS) return false;
      return !grid[newRow][newCol].classList.contains('occupied');
    });
  });
}






//----------------------------------------------------








// Draw the current piece
function drawPiece() {
  clearPiece();
  currentPiece.shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell && currentPiece.row + i < ROWS && currentPiece.col + j >= 0 && currentPiece.col + j < COLS) {
        const gridCell = grid[currentPiece.row + i][currentPiece.col + j];
        gridCell.classList.add('active', currentPiece.className);
      }
    });
  });
}

// Clear the current piece from the grid
function clearPiece() {
  currentPiece.shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell && currentPiece.row + i < ROWS && currentPiece.col + j >= 0 && currentPiece.col + j < COLS) {
        const gridCell = grid[currentPiece.row + i][currentPiece.col + j];
        gridCell.classList.remove('active', currentPiece.className);
      }
    });
  });
}

// Move the piece
function movePiece(direction) {
  if (!currentPiece) return;
  clearPiece();
  if (direction === 'left' && canMove(-1)) currentPiece.col--;
  if (direction === 'right' && canMove(1)) currentPiece.col++;
  if (direction === 'down') {
    if (canMove(0, 1)) {
      currentPiece.row++;
    } else {
      placePiece();
      checkLines();
      spawnPiece();
    }
  }
  drawPiece();
}

// Check if the piece can move
function canMove(dx = 0, dy = 0) {
  return currentPiece.shape.every((row, i) => {
    return row.every((cell, j) => {
      if (!cell) return true;
      const newRow = currentPiece.row + i + dy;
      const newCol = currentPiece.col + j + dx;
      if (newRow >= ROWS || newCol < 0 || newCol >= COLS) return false;
      return !grid[newRow][newCol].classList.contains('occupied');
    });
  });
}

// Place the current piece on the grid
function placePiece() {
  currentPiece.shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell && currentPiece.row + i < ROWS && currentPiece.col + j >= 0 && currentPiece.col + j < COLS) {
        const gridCell = grid[currentPiece.row + i][currentPiece.col + j];
        gridCell.classList.add('occupied', currentPiece.className);
        gridCell.classList.remove('active');
      }
    });
  });
}

// Check for complete lines and update score
function checkLines() {
  for (let i = 0; i < ROWS; i++) {
    if (grid[i].every(cell => cell.classList.contains('occupied'))) {
      // Remove the complete line
      grid[i].forEach(cell => cell.className = 'cell');
      // Move all rows above down
      for (let j = i; j > 0; j--) {
        grid[j].forEach((cell, colIndex) => {
          const aboveCell = grid[j - 1][colIndex];
          cell.className = aboveCell.className;
        });
      }
      // Clear the top row
      grid[0].forEach(cell => cell.className = 'cell');
      // Update score
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }
}



// Start the game
function startGame() {
  createGrid();
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  spawnPiece();
  gameInterval = setInterval(() => {
    movePiece('down');
  }, 500);
}


// Event listeners
startButton.addEventListener('click', startGame);
leftButton.addEventListener('click', () => movePiece('left'));
rightButton.addEventListener('click', () => movePiece('right'));
downButton.addEventListener('click', () => movePiece('down'));
topButton.addEventListener('click', rotatePiece); // Event listener for rotation

// Add touch event listeners for mobile devices
leftButton.addEventListener('touchstart', () => movePiece('left'));
rightButton.addEventListener('touchstart', () => movePiece('right'));
downButton.addEventListener('touchstart', () => movePiece('down'));
topButton.addEventListener('touchstart', rotatePiece);

