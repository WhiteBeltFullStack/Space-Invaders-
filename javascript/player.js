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

  if (nextCell.gameObject === BEAN) {
    const elScore = document.querySelector('.score')
    gGame.score += 50
    elScore.innerText = gGame.score

    gIsAlienFreeze = true
    setTimeout(() => {
      gIsAlienFreeze = false
    }, 1500)
  }

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
  } else if (event.key === 'n' || event.key === 'т' || event.key === 'מ') {
    clearAreaShot(event.key)
  } else if (event.key === 'x' || event.key === 'ס' || event.key === 'ч') {
    speedAtack(event.key)
  }
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
  if (shotCount.groupAttack === 0) return
  shotCount.groupAttack--

  const elNegAttack = document.querySelector('.negshot')
  elNegAttack.innerText = `Speed shot left :${shotCount.groupAttack}`

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
  if (shotCount.fastAttack === 0) return
  shotCount.fastAttack--

  const elSpeedAttack = document.querySelector('.speedshot')
  elSpeedAttack.innerText = `Speed shot left :${shotCount.fastAttack}`

  gHero.isShoot = true
  var shootInitiatePos = { i: gHero.pos.i - 1, j: gHero.pos.j }
  playSound(SUPER_LAZER_AUDIO, 0.1)
  blinkLaser(shootInitiatePos, eventKey)
}

function blinkLaser(pos, eventKey) {
  if (!gGame.isOn) return
  forceEnd()
  var baseSpeed = LASER_SPEED
  var speedySpeed = LASER_SPEED / 3
  var wepeon
  var wepeonImg

  var currSpeed =
    eventKey !== 'x' && eventKey !== 'ч' && eventKey !== 'ס'
      ? baseSpeed
      : speedySpeed

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

      if (gGame.alienCount === 0) {
        gGameWin = true

        gameOver(gGameWin)
      }

      clearInterval(gLazerInterval)
      gHero.isShoot = false

      return
    }

    setTimeout(() => {
      gBoard[nextLocation.i][nextLocation.j].gameObject = null
      updateCell(nextLocation)
    }, currSpeed)

    if (eventKey === ' ') {
      wepeon = LASER
      wepeonImg = LASER_IMG
    } else if (eventKey === 'n' || eventKey === 'т' || eventKey === 'מ') {
      wepeon = NEG_LASER
      wepeonImg = NEG_LASER_IMG
    } else if (eventKey === 'x' || eventKey === 'ס' || eventKey === 'ч') {
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

      const elScore = document.querySelector('.score')
      gGame.score += 10
      elScore.innerText = gGame.score

      gHero.isShoot = false
      gBoard[nextI][nextJ].gameObject = null

      updateCell(nextLocation)
      gGame.alienCount--

      var elAlienAlive = document.querySelector('.aliens-counter')
      elAlienAlive.innerText = gGame.alienCount

      if (gGame.alienCount === 0) {
        gGameWin = true

        gameOver(gGameWin)
      }
    }
    renderBoard(gBoard)
  }

  //NEIGHBOR SHOT

  if (eventKey === 'n' || eventKey === 'т' || eventKey === 'מ') {
    playSound(LAZER_NEG_AUDIO, 0.1)
    countNegs(gBoard, nextI, nextJ)
    var elAlienAlive = document.querySelector('.aliens-counter')
    elAlienAlive.innerText = gGame.alienCount
    renderBoard(gBoard)
  }

  //QUICK SHOT

  if (eventKey === 'x' || eventKey === 'ס' || eventKey === 'ч') {
    const cell = gBoard[nextI][nextJ]
    if (cell.gameObject === ALIEN) {
      clearInterval(gLazerInterval)

      const elScore = document.querySelector('.score')
      gGame.score += 10
      elScore.innerText = gGame.score

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
  forceEnd()
}

function forceEnd() {
  var counter = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].gameObject === ALIEN) {
        counter++
      }
      var elAlienAlive = document.querySelector('.aliens-counter')
      elAlienAlive.innerText = counter
      gGame.alienCount = counter
    }
  }

  if (counter === 0) {
    gGameWin = true
    gameOver(gGameWin)
  }
}
