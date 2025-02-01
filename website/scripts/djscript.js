// Board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX, doodlerY;
let doodlerRightImg, doodlerLeftImg;

let doodler = {
    img: null,
    x: 0,
    y: 0,
    width: doodlerWidth,
    height: doodlerHeight
};

// Physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    resizeCanvas();
    context = board.getContext("2d");

    // Load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "/images/doodler-right.png";
    
    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "/images/doodler-left.png";

    platformImg = new Image();
    platformImg.src = "/images/platform.png";

    doodlerX = board.width / 2 - doodlerWidth / 2;
    doodlerY = board.height * 7 / 8 - doodlerHeight;
    
    doodler = { img: doodlerRightImg, x: doodlerX, y: doodlerY, width: doodlerWidth, height: doodlerHeight };
    
    velocityY = initialVelocityY;
    placePlatforms();

    requestAnimationFrame(update);
    
    // Add event listeners
    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("touchstart", handleTouch);
    window.addEventListener("resize", resizeCanvas);
};

// Adjust the canvas to fit mobile screens
function resizeCanvas() {
    boardWidth = window.innerWidth > 400 ? 360 : window.innerWidth - 20;
    boardHeight = window.innerHeight > 600 ? 576 : window.innerHeight - 20;

    board.width = boardWidth;
    board.height = boardHeight;

    doodlerX = board.width / 2 - doodlerWidth / 2;
    doodlerY = board.height * 7 / 8 - doodlerHeight;
}

// Game update function
function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    // Move Doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) doodler.x = 0;
    else if (doodler.x + doodler.width < 0) doodler.x = boardWidth;

    velocityY += gravity;
    doodler.y += velocityY;

    if (doodler.y > board.height) gameOver = true;

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    // Platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];

        if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
            platform.y -= initialVelocityY;
        }

        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // Remove old platforms, add new ones
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        newPlatform();
    }

    updateScore();
    context.fillStyle = "white";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over: Tap to Restart", boardWidth / 5, boardHeight * 7 / 8);
    }
}

// Keyboard movement
function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 4;
        doodler.img = doodlerRightImg;
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    } else if (e.code == "Space" && gameOver) {
        restartGame();
    }
}

// Mobile touch movement
function handleTouch(event) {
    let touchX = event.touches[0].clientX;
    if (touchX > board.width / 2) {
        velocityX = 4;
        doodler.img = doodlerRightImg;
    } else {
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }

    // Restart game if game over
    if (gameOver) {
        restartGame();
    }
}

// Restart game
function restartGame() {
    doodler = { img: doodlerRightImg, x: doodlerX, y: doodlerY, width: doodlerWidth, height: doodlerHeight };
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
}

// Platform placement
function placePlatforms() {
    platformArray = [];

    let platform = { img: platformImg, x: board.width / 2, y: board.height - 50, width: platformWidth, height: platformHeight };
    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * board.width * 3 / 4);
        let platform = { img: platformImg, x: randomX, y: board.height - 75 * i - 150, width: platformWidth, height: platformHeight };
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * board.width * 3 / 4);
    let platform = { img: platformImg, x: randomX, y: -platformHeight, width: platformWidth, height: platformHeight };
    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function updateScore() {
    let points = Math.floor(50 * Math.random());
    if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) score = maxScore;
    } else if (velocityY >= 0) {
        maxScore -= points;
    }
}
