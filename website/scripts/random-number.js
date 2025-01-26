let targetNumber, attempts, score, rangeStart, rangeEnd;
const backgroundMusic = document.getElementById('backgroundMusic');
const achievementsEl = document.getElementById('achievements');
const highScoreListEl = document.getElementById('highScoreList');

const ACHIEVEMENTS = [
    { name: "Cosmic Rookie", attempts: 10 },
    { name: "Stellar Navigator", attempts: 5 },
    { name: "Galactic Genius", attempts: 3 }
];

function startGame() {
    rangeStart = parseInt(document.getElementById('rangeStart').value);
    rangeEnd = parseInt(document.getElementById('rangeEnd').value);

    if (rangeStart >= rangeEnd) {
        alert('Invalid range. Start must be less than end.');
        return;
    }

    targetNumber = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
    attempts = 0;
    score = 1000;

    document.getElementById('rangeSetup').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    document.getElementById('message').textContent = 'Mission: Guess the Cosmic Number!';
    document.getElementById('attempts').textContent = '0';
    document.getElementById('score').textContent = '1000';
    achievementsEl.innerHTML = '';
}

function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    attempts++;

    if (isNaN(guess) || guess < rangeStart || guess > rangeEnd) {
        alert(`Cosmic Error! Guess between ${rangeStart} and ${rangeEnd}`);
        return;
    }

    score = Math.max(0, score - 50);
    document.getElementById('score').textContent = score;
    document.getElementById('attempts').textContent = attempts;

    if (guess === targetNumber) {
        checkAchievements();
        playVictorySound();
        saveHighScore();
        document.getElementById('message').innerHTML = `🎉 Cosmic Success! You found the number in ${attempts} attempts!`;
        document.getElementById('gamePlay').style.display = 'none';
        document.getElementById('rangeSetup').style.display = 'block';
        displayHighScores();
    } else {
        document.getElementById('message').textContent =
            guess < targetNumber ? '🚀 Too low! Adjust trajectory.' : '🛸 Too high! Recalibrate sensors.';
    }

    guessInput.value = '';
}

function checkAchievements() {
    const achievement = ACHIEVEMENTS.find(a => attempts <= a.attempts);
    if (achievement) {
        achievementsEl.innerHTML = `🏆 Achievement Unlocked: ${achievement.name}`;
    }
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.volume = 0.5; // Set background music volume to avoid it being too loud
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}


function saveHighScore() {
    const key = `highScore_${rangeStart}_${rangeEnd}`;
    const highScores = JSON.parse(localStorage.getItem(key) || '[]');

    const newScore = {
        attempts,
        score,
        date: new Date().toLocaleString()
    };

    highScores.push(newScore);
    highScores.sort((a, b) => a.attempts - b.attempts);

    // Keep top 5 high scores
    const topScores = highScores.slice(0, 5);
    localStorage.setItem(key, JSON.stringify(topScores));

    displayHighScores();
}

function displayHighScores() {
    const key = `highScore_${rangeStart}_${rangeEnd}`;
    const highScores = JSON.parse(localStorage.getItem(key) || '[]');

    highScoreListEl.innerHTML = highScores.map((score, index) => `
        <div class="high-score-entry">
            #${index + 1}: ${score.attempts} attempts (${score.date})
        </div>
    `).join('');
}

function clearHighScores() {
    const key = `highScore_${rangeStart}_${rangeEnd}`;
    localStorage.removeItem(key);
    highScoreListEl.innerHTML = '';
}

// Load high scores on page load
document.addEventListener('DOMContentLoaded', () => {
    const rangeStart = document.getElementById('rangeStart').value;
    const rangeEnd = document.getElementById('rangeEnd').value;
    const key = `highScore_${rangeStart}_${rangeEnd}`;
    displayHighScores();
});
