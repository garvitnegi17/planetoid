const gameContainer = document.getElementById('game-container');
const images = [
    'earth2.png', 'rocket24.jpg', 'rocket26.jpg', 'rocket4.jpg', 
    'rocket28.jpg', 'rocket6.jpg', 'rocket23.jpg', 'rocket27.jpg'
];

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matchesCount = 0;

// Create cards dynamically
function createCards() {
    const cardsArray = [...images, ...images]; // Duplicate images for matching pairs
    cardsArray.sort(() => 0.5 - Math.random()); // Shuffle cards

    cardsArray.forEach(image => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        // HTML structure of each card
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="/images/memory images/${image}" alt="Space Image">
                </div>
            </div>
        `;

        // Add event listener for flipping the card
        cardElement.addEventListener('click', flipCard);

        gameContainer.appendChild(cardElement);
    });

    cards = document.querySelectorAll('.card');
}

// Flip card function
function flipCard(event) {
    if (lockBoard) return;

    const clickedCard = event.currentTarget;

    // Prevent clicking the same card twice
    if (clickedCard === firstCard) return;

    clickedCard.classList.add('flipped');

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        lockBoard = true;
        checkForMatch();
    }
}

// Check for matching cards
function checkForMatch() {
    const firstImage = firstCard.querySelector('.card-back img').src;
    const secondImage = secondCard.querySelector('.card-back img').src;

    if (firstImage === secondImage) {
        disableCards();
        updateScore();
    } else {
        unflipCards();
    }
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    // Check if all pairs are matched
    if (matchesCount === images.length) {  // After 8 pairs, all matches are done
        setTimeout(() => {
            alert('🎉 Congratulations! You matched all pairs! 🚀');
        }, 500);
    }
}

// Unflip cards if they don't match
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Update the score based on matching pairs
function updateScore() {
    matchesCount++;
    document.getElementById('score-board').innerText = `Matches: ${matchesCount}`;
}

// Reset variables and unlock board
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Initialize the game
createCards();