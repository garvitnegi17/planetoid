const ufo = '<img src="https://static-00.iconduck.com/assets.00/flying-saucer-emoji-2048x1845-4gyquu9x.png" class="player">';
const spaceShuttle = '<img src="https://cdn-icons-png.flaticon.com/512/4825/4825026.png" class="player">';
const ufoEmoji = '🛸'; // UFO emoji
const spaceShuttleEmoji = '🚀'; // Space Shuttle emoji

let turn = "X";
let gameover = false;
let ufoScore = 0;
let spaceShuttleScore = 0;

const changeTurn = () => {
    return turn === "X" ? "O" : "X";
};

const updateScores = () => {
    document.getElementById("ufoScore").innerText = `UFO: ${ufoScore}`;
    document.getElementById("spaceShuttleScore").innerText = `Space Shuttle: ${spaceShuttleScore}`;
};

const checkWin = () => {
    let boxtext = document.getElementsByClassName("boxtext");
    let wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    wins.forEach(e => {
        if ((boxtext[e[0]].innerHTML === boxtext[e[1]].innerHTML) &&
            (boxtext[e[1]].innerHTML === boxtext[e[2]].innerHTML) &&
            (boxtext[e[0]].innerHTML !== "")) {
            const winner = boxtext[e[0]].innerHTML.includes("flying-saucer") ? "UFO" : "Space Shuttle";

            // Update the score for the winner
            if (winner === "UFO") {
                ufoScore++;
            } else {
                spaceShuttleScore++;
            }
            updateScores();

            // Display winner message with emoji
            const winnerEmoji = winner === "UFO" ? ufoEmoji : spaceShuttleEmoji;
            document.querySelector(".info").innerHTML = `${winner} Wins! ${winnerEmoji}`;

            gameover = true;

            // Highlight the winning boxes
            e.forEach(index => {
                document.getElementsByClassName("box")[index].classList.add("winning");
            });

            // Stop background music and play game over sound
            music.pause();
            mgameover.play();

            // Show the winning emoji image
            const img = document.querySelector(".imgbox img");
            img.style.display = "block";
            img.classList.add("winner");
        }
    });
};

// Game Logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector(".boxtext");
    element.addEventListener("click", () => {
        if (boxtext.innerHTML === '' && !gameover) {
            boxtext.innerHTML = turn === "X" ? ufo : spaceShuttle;
            turn = changeTurn();
            checkWin();
            if (!gameover) {
                document.getElementsByClassName("info")[0].innerHTML = "Turn for " + (turn === "X" ? "UFO 🛸" : "Space Shuttle 🚀");
            }
        }
    });
});

// Reset logic
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
    const boxtexts = document.querySelectorAll(".boxtext");
    Array.from(boxtexts).forEach((boxtext) => {
        boxtext.innerHTML = "";
    });

    turn = "X";
    gameover = false;
    document.querySelector(".info").innerHTML = "Turn for UFO 🛸";

    // Hide emoji
    const img = document.querySelector(".imgbox img");
    img.style.display = "none";
    img.classList.remove("winner");

    // Remove winning class from boxes
    const boxes = document.getElementsByClassName("box");
    Array.from(boxes).forEach((box) => {
        box.classList.remove("winning");
    });

    // Play background music
    music.currentTime = 0;
    music.play();
});

// Start music on first user interaction
window.addEventListener("click", () => {
    music.play();
});
