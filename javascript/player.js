'use strict'

const LASER_SPEED = 80
var gLazerInterval

var gHero = {
  pos: { i: 13, j: 7 },
  isShoot: false,
}

function createHero(board) {
  var heroPos = gHero.pos

  board[heroPos.i][heroPos.j] = createCell(SKY, HERO)
}

function moveHero(dir) {
  console.log('dir-Hero:', dir)
  if (!gGame.isOn) return

  const nextLocation = dir
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  if (nextCell.type === WALL) return

  gBoard[gHero.pos.i][gHero.pos.j].gameObject = null
  updateCell(gHero.pos)

  gHero.pos = nextLocation

  gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO
  updateCell(gHero.pos, HERO)
}

function onHandleKeyUp(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    onKeyDown(event)
  } else if (event.code === 'Space') {
    onShoot(event)
  }
}

function onKeyDown(eventKeyBoard) {
  var dir = { i: gHero.pos.i, j: gHero.pos.j }
  switch (eventKeyBoard.key) {
    case 'ArrowLeft':
      dir.j--
      break

    case 'ArrowRight':
      dir.j++
      break
  }
  moveHero(dir)
}

function onShoot(event) {
  if (event.code === 'Space') {
    var shootInitiatePos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    blinkLaser(shootInitiatePos)
  }
}

function blinkLaser(pos) {
  console.log('pos:', pos)
  if (gHero.isShoot) return

  gLazerInterval = setInterval(() => {
    gHero.isShoot = true

    const nextLocation = {
      i: pos.i--,
      j: pos.j,
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell.type === WALL) {
      clearInterval(gLazerInterval)
      gHero.isShoot = false
      console.log('wall')
      return
    }

    if (nextCell.gameObject === ALIEN) {
      alientHit(nextLocation.i, nextLocation.j, nextLocation)
      gGame.alienCount--

      var elAlienAlive = document.querySelector('.aliens-counter')
      elAlienAlive.innerText = gGame.alienCount
      return
      //   clearInterval(gLazerInterval)

      //   gHero.isShoot = false
      //   gBoard[nextLocation.i][nextLocation.j].gameObject = null
      //   updateCell(nextLocation)
      //   gGame.alienCount--
      //   console.log('Another UFO is DOWN!')
    }

    setTimeout(() => {
      gBoard[nextLocation.i][nextLocation.j].gameObject = null
      updateCell(nextLocation)
    }, LASER_SPEED)

    gBoard[nextLocation.i][nextLocation.j].gameObject = LASER
    updateCell(nextLocation, LASER)
  }, LASER_SPEED)
}

function alientHit(nextI, nextJ, nextLocation) {
  clearInterval(gLazerInterval)
  gHero.isShoot = false
  gBoard[nextI][nextJ].gameObject = null
  updateCell(nextLocation)

  console.log('Another UFO is DOWN!')
}
