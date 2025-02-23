
//Game setup
let game_seq = [];
let user_seq = [];
let btns = ["yellow", "red", "green", "blue"];
let main = document.querySelector("body");
let started = false;
let max_score = 0;
let level = 0;
let h2 = document.querySelector("h2");
let h3 = document.querySelector("h3");
let button = document.querySelector("button");

//adding sounds to buttons
let error = new Audio("../../audio/Tile_Sequence_Audio/error.mp3");
let clck = new Audio("../../audio/Tile_Sequence_Audio/click.mp3");
clck.preload = 'auto';
error.preload = 'auto';

button.addEventListener("click", function () {
    if (started == false) {
        console.log("game has been started");
        started = true;
        button.style.display = "none";
        levelUp();
    }
});

function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash")
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(function () {
        btn.classList.remove("userFlash")
    }, 250);
}

function levelUp() {
    user_seq = [];
    level++;
    max_score = Math.max(max_score, level);
    h2.innerText = `Level ${level}`;

    //random button choose
    let randIndx = Math.floor(Math.random() * 4);
    let randColor = btns[randIndx];
    playSound();
    let randBtn = document.querySelector(`.${randColor}`);
    game_seq.push(randColor);
    console.log(game_seq);
    btnFlash(randBtn);
}
function playSound() {
    if (!clck.paused) {
        clck.pause();
        clck.currentTime = 0; // Reset sound position
    }
    clck.play();
}

function CheckAns(idx) {

    if (user_seq[idx] === game_seq[idx]) {
        if (user_seq.length == game_seq.length) {
            setTimeout(levelUp, 1000);
        }
    }
    else {
        h2.innerHTML = `Game over! Your score was </b>${level}</b><br>`;
        button.innerText = "Restart";
        button.style.display = "inline-block";
        h3.innerText = `Your maximum score is ${max_score}`;
        document.querySelector("body").classList.add("flashRed");
        error.play();
        setTimeout(() => {
            document.querySelector("body").classList.remove("flashRed");
        }, 150);

        reset();

    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    playSound();
    user_seq.push(userColor);
    CheckAns(user_seq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    game_seq = [];
    user_seq = [];
    level = 0;
}