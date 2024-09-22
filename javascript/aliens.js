'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

var gAliensTopRowIdx = 1
var gAliensBottomRowIdx = 3

var gIsAlienFreeze = true

function createAliens(board) {
  for (var i = 1; i <= ALIEN_ROW_COUNT; i++) {
    for (var j = 1; j <= ALIEN_ROW_LENGTH; j++) {
      board[i][j] = createCell(SKY, ALIEN)
    }
  }
}

function handleAlientHit(pos) {}

// function shiftBoardRight(board, fromI, toI) {
//   for (var i = toI; i >= fromI; i--) {
//     for (var j = board[i].length - 1; j > 0; j--) {
//       if (board[i][j - 1].gameObject === ALIEN) {
//         if (j < board[i].length - 1 && board[i][j].type !== WALL) {
//           board[i][j].gameObject = ALIEN
//           updateCell({ i: i, j: j }, ALIEN)

//           // Clear the left cell
//           board[i][j - 1].gameObject = null
//           updateCell({ i: i, j: j - 1 }, null)
//         }
//       }
//     }
//   }
// }

function shiftBoardLeft(board, fromI, toI) {}
function shiftBoardDown(board, fromI, toI) {}

function moveAliens(board, fromI, toI) {
  //   shiftBoardRight(board, fromI, toI)
  //   shiftBoardDown(board, fromI, toI)
  //   shiftBoardLeft(board, fromI, toI)

  moveAliensToRight()

  renderBoard(gBoard)
}

function moveAliensToRight() {
  for (var i = gBoard.length - 1; i >= 0; i--) {
    for (var j = gBoard[i].length - 1; j >= 0; j--) {
      if (gBoard[i][j].gameObject === ALIEN) {
        const newPos = { i: i, j: j + 1 }
        if (
          newPos.j < gBoard[i].length &&
          gBoard[newPos.i][newPos.j].type !== WALL
        ) {
          gBoard[newPos.i][newPos.j].gameObject = ALIEN
          gBoard[i][j].gameObject = null
        } else if (gBoard[newPos.i][newPos.j].type === WALL) {
          moveAliensDown()
          return
        }
      }
    }
  }
}

function moveAliensDown() {
  for (var i = gBoard.length - 1; i >= 0; i--) {
    for (var j = gBoard[i].length - 1; j >= 0; j--) {
      if (gBoard[i][j].gameObject === ALIEN) {
        const newPos = { i: i + 1, j: j }
        
      }
    }
  }
}

function moveAliensLeft() {}
