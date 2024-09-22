'use strict'

const BOARD_SIZE = 15
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'

const SKY = 'SKY'
const WALL = 'WALL'

var gGameWin = true

var gBoard
var gGame = {
  isOn: false,
  alienCount: 0,
}

function onInit() {
  gBoard = createBoard()
  gGame.isOn = true
  gGame.alienCount = 0

  createAliens(gBoard)
  createHero(gBoard)

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
      var cellData = getElCell({ i: i, j: j })
      var cellClass = ''
      var cellContent = currCell.gameObject ? currCell.gameObject : ''

      if (currCell.type === SKY) cellClass += ' sky'
      if (currCell.type === WALL) cellClass += ' wall'
      if(currCell.gameObject === LASER) cellClass += ' laser'
      if(currCell.gameObject === ALIEN) cellClass += ' alien'

      if (currCell.gameObject === ALIEN) gGame.alienCount++
      strHtml += `<td class="cell cell-${i}-${j} ${cellClass}" data-i="${i}" data-j="${j}" cell>${cellContent} </td>`
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

// function renderCell(pos, value) {
//   const elCell = getElCell(pos)
//   elCell.innerHTML = value
// }

function gameOver(gGameWin) {}
