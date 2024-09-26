'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
var gAliensTopRowIdx = 1
var gAliensBottomRowIdx = 3
var gIsAlienFreeze = false

var gIsRight = true
var gGoDown

function createAliens(board) {
  for (var i = 1; i <= ALIEN_ROW_COUNT; i++) {
    for (var j = 1; j <= ALIEN_ROW_LENGTH; j++) {
      board[i][j] = createCell(SKY, ALIEN)
      gGame.alienCount++
    }
  }
}

function moveAliens() {
  if (gIsAlienFreeze) return
  if (gGoDown) {
    moveAliensDown()
    gGoDown = false
  } else {
    if (gIsRight) {
      moveAliensRight()
    } else {
      moveAliensLeft()
    }
  }
  renderBoard(gBoard)
}

function moveAliensDown() {
  for (var i = gBoard.length - 1; i >= 0; i--) {
    for (var j = gBoard[i].length - 1; j >= 0; j--) {
      if (gBoard[i][j].gameObject === ALIEN) {
        const currPos = { i: i, j: j }
        const newPos = { i: i + 1, j: j }
        if (newPos.i === gBoard.length - 2) {
          clearInterval(gIntervalAliens)
          gGame.isOn = false
          gGameWin = false
          gameOver(gGameWin)
          return
        }

        if (
          newPos.i < gBoard.length &&
          gBoard[newPos.i][newPos.j].type !== WALL
        ) {
          if (
            gBoard[newPos.i][newPos.j].gameObject === LASER ||
            gBoard[newPos.i][newPos.j].gameObject === NEG_LASER ||
            gBoard[newPos.i][newPos.j].gameObject === SUPER_LAZER
          ) {
            if (gBoard[newPos.i][newPos.j].gameObject === LASER) {
              shotType = ' '
            }
            if (gBoard[newPos.i][newPos.j].gameObject === NEG_LASER) {
              shotType = 'n'
            }
            if (gBoard[newPos.i][newPos.j].gameObject === SUPER_LAZER) {
              shotType = 'x'
            }
            gBoard[newPos.i][newPos.j].gameObject = null
            updateCell(newPos)
            // alientHit(newPos.i, newPos.j, newPos, shotType)
            continue
          } else {
            gBoard[newPos.i][newPos.j].gameObject = ALIEN
            updateCell(newPos, ALIEN)

            gBoard[i][j].gameObject = null
            updateCell(currPos)
          }
        }
      }
    }
  }
}

function moveAliensRight() {
  for (var j = gBoard.length - 1; j >= 0; j--) {
    for (var i = gBoard[j].length - 1; i >= 0; i--) {
      if (gBoard[i][j].gameObject === ALIEN) {
        const currPos = { i: i, j: j }
        const newPos = { i: i, j: j + 1 }
        if (
          newPos.j < gBoard[i].length &&
          gBoard[newPos.i][newPos.j].type !== WALL
        ) {
          var shotEngage
          if (
            gBoard[newPos.i][newPos.j].gameObject === LASER ||
            gBoard[newPos.i][newPos.j].gameObject === NEG_LASER ||
            gBoard[newPos.i][newPos.j].gameObject === SUPER_LAZER
          ) {
            if (gBoard[newPos.i][newPos.j].gameObject === LASER) {
              shotType = ' '
            }
            if (gBoard[newPos.i][newPos.j].gameObject === NEG_LASER) {
              shotType = 'n'
            }
            if (gBoard[newPos.i][newPos.j].gameObject === SUPER_LAZER) {
              shotType = 'x'
            }
            gBoard[newPos.i][newPos.j].gameObject = null
            updateCell(newPos)
            // alientHit(newPos.i, newPos.j, newPos, shotType)
            continue
          }
          gBoard[i][j].gameObject = null
          updateCell(currPos)

          gBoard[newPos.i][newPos.j].gameObject = ALIEN
          updateCell(newPos, ALIEN)
        } else if (gBoard[newPos.i][newPos.j].type === WALL) {
          gGoDown = true
          gIsRight = !gIsRight
          return
        }
      }
    }
  }
}

function moveAliensLeft() {
  for (var j = 0; j < gBoard.length; j++) {
    for (var i = gBoard[j].length - 1; i >= 0; i--) {
      if (gBoard[i][j].gameObject === ALIEN) {
        const currPos = { i: i, j: j }
        const newPos = { i: i, j: j - 1 }
        if (newPos.j >= 0 && gBoard[newPos.i][newPos.j].type !== WALL) {
          if (
            gBoard[newPos.i][newPos.j].gameObject === LASER ||
            gBoard[newPos.i][newPos.j].gameObject === NEG_LASER ||
            gBoard[newPos.i][newPos.j].gameObject === SUPER_LAZER
          ) {
            if (gBoard[newPos.i][newPos.j].gameObject === LASER) {
              shotType = ' '
            }
            if (gBoard[newPos.i][newPos.j].gameObject === NEG_LASER) {
              shotType = 'n'
            }
            if (gBoard[newPos.i][newPos.j].gameObject === SUPER_LAZER) {
              shotType = 'x'
            }
            gBoard[newPos.i][newPos.j].gameObject = null
            updateCell(newPos)
            // alientHit(newPos.i, newPos.j, newPos, shotType)
            continue
          }
          gBoard[i][j].gameObject = null
          updateCell(currPos)

          gBoard[newPos.i][newPos.j].gameObject = ALIEN
          updateCell(newPos, ALIEN)
        } else if (gBoard[newPos.i][newPos.j].type === WALL) {
          gGoDown = true
          gIsRight = !gIsRight
          return
        }
      }
    }
  }
}
