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
  if (!gGame.isOn) return
  playSound(STEP_AUDIO, 0.3)

  const nextLocation = dir
  const nextCell = gBoard[nextLocation.i][nextLocation.j]

  if (nextCell.type === WALL) return

  gBoard[gHero.pos.i][gHero.pos.j].gameObject = null
  updateCell(gHero.pos)

  gHero.pos = nextLocation

  gBoard[gHero.pos.i][gHero.pos.j].gameObject = HERO
  updateCell(gHero.pos, HERO)

  renderBoard(gBoard)
}

function onHandleKeyUp(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    onKeyDown(event)
  } else if (event.code === 'Space') {
    onShoot(event.key)
  } else if (event.key === 'n') {
    clearAreaShot(event.key)
  } else if (event.key === 'x') {
    speedAtack(event.key)
  }
console.log('event.key:',event.key)
  return event.key
}

function onKeyDown(eventKey) {
  var dir = { i: gHero.pos.i, j: gHero.pos.j }
  switch (eventKey.key) {
    case 'ArrowLeft':
      dir.j--
      break

    case 'ArrowRight':
      dir.j++
      break
  }
  moveHero(dir)
}

function clearAreaShot(eventKey) {
  if (gHero.isShoot) return
  if (gGroupAttack === 0) return
  gGroupAttack--
  gHero.isShoot = true
  var shootInitiatePos = { i: gHero.pos.i - 1, j: gHero.pos.j }
  playSound(LAZER_AUDIO, 0.1)
  blinkLaser(shootInitiatePos, eventKey)
}

function onShoot(eventKey) {
  if (gHero.isShoot) return
  gHero.isShoot = true
  var shootInitiatePos = { i: gHero.pos.i - 1, j: gHero.pos.j }
  playSound(LAZER_AUDIO, 0.1)
  blinkLaser(shootInitiatePos, eventKey)
}

function speedAtack(eventKey) {
  if (gHero.isShoot) return
  if (gSpeedAttackCount === 0) return
  gSpeedAttackCount--
  gHero.isShoot = true
  var shootInitiatePos = { i: gHero.pos.i - 1, j: gHero.pos.j }
  playSound(SUPER_LAZER_AUDIO, 0.1)
  blinkLaser(shootInitiatePos, eventKey)
}

function blinkLaser(pos, eventKey) {
  if (!gGame.isOn) return

  var baseSpeed = LASER_SPEED
  var speedySpeed = LASER_SPEED / 3
  var wepeon
  var wepeonImg

  var currSpeed = eventKey !== 'x' ? baseSpeed : speedySpeed

  gLazerInterval = setInterval(() => {
    const nextLocation = {
      i: pos.i--,
      j: pos.j,
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell.type === WALL) {
      clearInterval(gLazerInterval)
      gHero.isShoot = false
      return
    }

    if (nextCell.gameObject === ALIEN) {
      alientHit(nextLocation.i, nextLocation.j, nextLocation, eventKey)
      playSound(KILL_AUDIO, 0.1)

      return
    }

    setTimeout(() => {
      gBoard[nextLocation.i][nextLocation.j].gameObject = null
      updateCell(nextLocation)
    }, currSpeed)

    if (eventKey === ' ') {
      wepeon = LASER
      wepeonImg = LASER_IMG
    } else if (eventKey === 'n') {
      wepeon = NEG_LASER
      wepeonImg = NEG_LASER_IMG
    } else if (eventKey === 'x') {
      wepeon = SUPER_LAZER
      wepeonImg = SUPER_LAZER_IMG
    }

    gBoard[nextLocation.i][nextLocation.j].gameObject = wepeon
    updateCell(nextLocation, wepeonImg)
  }, currSpeed)
}

function alientHit(nextI, nextJ, nextLocation, eventKey) {
  if (eventKey === ' ') {
    const cell = gBoard[nextI][nextJ]
    if (cell.gameObject === ALIEN) {
      clearInterval(gLazerInterval)

      gHero.isShoot = false
      gBoard[nextI][nextJ].gameObject = null
      updateCell(nextLocation)
      gGame.alienCount--
      if (gGame.alienCount === 0) {
        gGameWin = true
        gameOver(gGameWin)
      }

      var elAlienAlive = document.querySelector('.aliens-counter')
      elAlienAlive.innerText = gGame.alienCount
    }
    renderBoard(gBoard)
  }

  //NEIGHBOR SHOT

  if (eventKey === 'n') {
    playSound(LAZER_NEG_AUDIO, 0.1)
    countNegs(gBoard, nextI, nextJ)
    var elAlienAlive = document.querySelector('.aliens-counter')
    elAlienAlive.innerText = gGame.alienCount
    renderBoard(gBoard)
  }

  //QUICK SHOT

  if (eventKey === 'x') {
    const cell = gBoard[nextI][nextJ]
    if (cell.gameObject === ALIEN) {
      clearInterval(gLazerInterval)
      gHero.isShoot = false
      gGame.alienCount--

      var elAlienAlive = document.querySelector('.aliens-counter')
      elAlienAlive.innerText = gGame.alienCount

      gBoard[nextI][nextJ].gameObject = null
      updateCell(nextLocation)

      if (gGame.alienCount === 0) {
        gGameWin = true
        gameOver(gGameWin)
      }
    }
    renderBoard(gBoard)
  }
}
