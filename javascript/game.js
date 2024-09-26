'use strict'

const BOARD_SIZE = 15
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = 'hero'
const ALIEN = 'alien'
const LASER = 'laser'
const NEG_LASER = 'neg laser'
const SUPER_LAZER = 'super laser'
const BEAN = 'BEAN'

const HERO_IMG = '<img src="imgs/hero.jpg"/>'
const ALIEN_IMG = '<img src="imgs/alien.jpg"/>'
const LASER_IMG = '<img src="imgs/laser.jpg"/>'
const NEG_LASER_IMG = '<img src="imgs/neg-lazer.jpg"/>'
const SUPER_LAZER_IMG = '<img src="imgs/super-lazer.jpg"/>'
const BEAN_IMG = '<img src="imgs/senzu-bean.jpg"/>'

const SKY = 'SKY'
const WALL = 'WALL'

const START_GAME_AUDIO = 'audio/start-game.mp3'

const STEP_AUDIO = 'audio/step.mp3'
const LAZER_AUDIO = 'audio/regular-shot.mp3'
const LAZER_NEG_AUDIO = 'audio/neg-hit.mp3'
const SUPER_LAZER_AUDIO = 'audio/speed-shot.mp3'
const KILL_AUDIO = 'audio/kill.mp3'

var gGameWin = false

var gSpeedAttackCount
var gGroupAttack

var gBoard
var gGame = {
  isOn: false,
  alienCount: 0,
  score: 0,
}

var gBeansInterval
function onInit() {
  const elRestart = document.querySelector('.restart')
  elRestart.style.display = 'none'
  playSound(START_GAME_AUDIO, 0.1)

  gBoard = createBoard()
  gGame.isOn = true
  gGame.alienCount = 0
  gSpeedAttackCount = 3
  gGroupAttack = 2

  createAliens(gBoard)
  var elAlienAlive = document.querySelector('.aliens-counter')
  elAlienAlive.innerText = gGame.alienCount

  createHero(gBoard)
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)

  gBeansInterval = setInterval(placeSpecialFood, 5000)

  renderBoard(gBoard)
}

function createBoard() {
  const board = []
  for (var i = 0; i < BOARD_SIZE; i++) {
    board[i] = []
    for (var j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = createCell(SKY)
      if (i === 0 || i === BOARD_SIZE - 1 || j === 0 || j === BOARD_SIZE - 1) {
        board[i][j] = createCell(WALL)
      }
    }
  }
  return board
}

function renderBoard(board) {
  var strHtml = ``
  for (var i = 0; i < board.length; i++) {
    strHtml += `<tr>`
    for (var j = 0; j < board[i].length; j++) {
      const currCell = board[i][j]
      var cellClass = ''

      if (currCell.type === SKY) cellClass += ' sky'
      if (currCell.type === WALL) cellClass += ' wall'
      if (currCell.gameObject === LASER) cellClass += ' laser'
      if (currCell.gameObject === ALIEN) cellClass += ' alien'
      if (currCell.gameObject === HERO) cellClass += ' hero'

      strHtml += `<td class="cell cell-${i}-${j} ${cellClass}" data-i="${i}" data-j="${j}">`

      if (currCell.gameObject === HERO) {
        strHtml += HERO_IMG
      }
      if (currCell.gameObject === ALIEN) {
        strHtml += ALIEN_IMG
      }
      if (currCell.gameObject === LASER) {
        strHtml += LASER_IMG
      }
      if (currCell.gameObject === NEG_LASER) {
        strHtml += NEG_LASER_IMG
      }
      if (currCell.gameObject === SUPER_LAZER) {
        strHtml += SUPER_LAZER_IMG
      }
      if (currCell.gameObject === BEAN) {
        strHtml += BEAN_IMG
      }

      strHtml += `</td>`
    }
    strHtml += `</tr>`
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHtml
}

function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

function createCell(type, gameObject = null) {
  return {
    type: type,
    gameObject: gameObject,
  }
}

function getElCell(pos) {
  var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`)
  return elCell
}

function gameOver(gGameWin) {
  const elRestart = document.querySelector('.restart')
  elRestart.style.display = 'inline'

  if (gGameWin) {
    gGame.isOn = false

    var elAlienAlive = document.querySelector('.aliens-counter')
    elAlienAlive.innerText = 'YOU WIN'
  } else {
    gGame.isOn = false
    var elAlienAlive = document.querySelector('.aliens-counter')
    elAlienAlive.innerText = 'YOU LOST'
  }

  clearIntervals()
}

function onRestartGame() {
  onInit()
}

function playSound(audio, volume) {
  var newAudio = new Audio(audio)
  newAudio.volume = volume
  newAudio.play()
}

function specialFood() {
  var freeBeanPoss = []
  for (var j = 1; j < gBoard[13].length - 2; j++) {
    var currPos = { i: 13, j: j }
    if (gBoard[currPos.i][currPos.j].gameObject === null) {
      freeBeanPoss.push(currPos)
    }
  }
  return freeBeanPoss
}

function placeSpecialFood() {
  const poss = specialFood()
  if (!poss) return

  var idx = getRandomInt(0, poss.length)

  gBoard[poss[idx].i][poss[idx].j].gameObject = BEAN

  updateCell(poss[idx], BEAN)

  setTimeout(() => {
    if (gBoard[poss[idx].i][poss[idx].j].gameObject === HERO) return

    gBoard[poss[idx].i][poss[idx].j].gameObject = null
    updateCell(poss[idx])
  }, 3000)
  renderBoard(gBoard)
}

function clearIntervals() {
  var intervals = [gBeansInterval, gIntervalAliens]
  for (var i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i])
  }
}
