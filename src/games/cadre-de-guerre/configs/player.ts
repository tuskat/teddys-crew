const config = {
    life : 10,
    power: 1,
    speed : 200,
    distanceToStop : 4,
    maxSpeedX : 1500,
    maxSpeedY : 750,
    bulletSpeed : 1000,
    delayToAction : 200,
    invicibleFrame: 1000,
    timeToRespawn: 1000,
    dashDuration: 300,
    events : {
        'hurt': {name: 'lifeUpdate', sound: 'Damage02'},
        'dash': {name: 'entityDashing', sound: 'Slash01'},
        'shoot': {name: 'entityShooting', sound: 'Fire01'},
    }
}

export default config