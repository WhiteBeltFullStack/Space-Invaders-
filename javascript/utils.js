'use strict'

function countNegs(board, rowIdx, colIdx) {
  var negCount = 0

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      //   if (i === rowIdx && j === colIdx) continue
      var currCell = board[i][j]
      var currLoc = { i: i, j: j }
      if (currCell.gameObject === ALIEN) {
        clearInterval(gLazerInterval)
        gHero.isShoot = false

        negCount++

        currCell.gameObject = null
        updateCell(currLoc)
      }
    }
  }

  const elScore = document.querySelector('.score')
  gGame.score += 10 * negCount
  elScore.innerText = gGame.score

  gGame.alienCount -= negCount
  if (gGame.alienCount === 0) {
    gGameWin = true
    gameOver(gGameWin)
  }
}

function getRandomColor() {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16)
  return '#' + randomColor.padStart(6, '0')
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function makeId(length = 6) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}
