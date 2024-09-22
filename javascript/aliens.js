'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens = []

var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true

function createAliens(board) {
  for (var i = 1; i <= ALIEN_ROW_COUNT; i++) {
    for (var j = 1; j <= ALIEN_ROW_LENGTH; j++) {
      board[i][j] = createCell(SKY, ALIEN)
    }
  }
}



function handleAlientHit(pos) {}

function shiftBoardRight(board, fromI, toI) {
  
}
function shiftBoardLeft(board, fromI, toI) {}
function shiftBoardDown(board, fromI, toI) {}

function moveAliens() {
    shiftBoardRight(board, fromI, toI)
    shiftBoardDown(board, fromI, toI)
shiftBoardLeft(board, fromI, toI)
}

