const config = {
    life : 10,
    speed : 200,
    distanceToStop : 4,
    maxSpeedX : 1500,
    maxSpeedY : 750,
    delayToAction : 200,
    invicibleFrame: 1000,
    timeToRespawn: 1000,
    dashDuration: 300,
    events : {
        'hurt': {name: 'lifeUpdate', sound: 'Damage02'},
        'dash': {name: 'entityDashing', sound: 'Slash01'},
    }
}

export default config