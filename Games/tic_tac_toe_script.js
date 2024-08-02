const UFO_CLASS = 'ufo'
const SPACE_SHUTTLE_CLASS = 'space-shuttle'
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('gameBoard')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const roundInfo = document.getElementById('roundInfo')
const ufoScoreElement = document.getElementById('ufoScore')
const spaceShuttleScoreElement = document.getElementById('spaceShuttleScore')

let spaceShuttleTurn
let ufoScore = 0
let spaceShuttleScore = 0
let round = 1

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
  spaceShuttleTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(UFO_CLASS)
    cell.classList.remove(SPACE_SHUTTLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
  roundInfo.innerText = `Round: ${round}`
}

function handleClick(e) {
  const cell = e.target
  const currentClass = spaceShuttleTurn ? SPACE_SHUTTLE_CLASS : UFO_CLASS
  placeMark(cell, currentClass)
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    if (spaceShuttleTurn) {
      winningMessageTextElement.innerText = "Space Shuttle Wins!"
      spaceShuttleScore++
    } else {
      winningMessageTextElement.innerText = "UFO Wins!"
      ufoScore++
    }
  }

  updateScores()

  round++
  if (round > 5) {
    setTimeout(() => {
      declareOverallWinner()
      resetScores()
      round = 1
    }, 500) // Wait 2 seconds before resetting for visibility
  } else {
    winningMessageElement.classList.add('show')
    setTimeout(startGame, 2000) // Wait 2 seconds before starting next round
  }
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(UFO_CLASS) || cell.classList.contains(SPACE_SHUTTLE_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  spaceShuttleTurn = !spaceShuttleTurn
}

function setBoardHoverClass() {
  board.classList.remove(UFO_CLASS)
  board.classList.remove(SPACE_SHUTTLE_CLASS)
  if (spaceShuttleTurn) {
    board.classList.add(SPACE_SHUTTLE_CLASS)
  } else {
    board.classList.add(UFO_CLASS)
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

function updateScores() {
  ufoScoreElement.innerText = `${ufoScore}`
  spaceShuttleScoreElement.innerText = `${spaceShuttleScore}`
}

function declareOverallWinner() {
  const winner = ufoScore > spaceShuttleScore ? 'UFO' : (spaceShuttleScore > ufoScore ? 'Space Shuttle' : 'No one')
  alert(`Overall Winner: ${winner}!`)
}

function resetScores() {
  ufoScore = 0
  spaceShuttleScore = 0
  updateScores()
}
