const config = {
    name: 'Ors',
    faction: 'allies',
    life : 15,
    maxLife : 15,
    power: 2,
    baseXP: 5,
    speed : 175,
    size: 80,
    distanceToStop : 4,
    maxSpeedX : 1500,
    maxSpeedY : 750,
    bulletSpeed : 1000,
    delayToAction : 50,
    invicibleFrame: 500,
    timeToRespawn: 1000,
    actionDuration: 400,
    events : {
        'hurt': {name: 'lifeUpdate', sound: 'Damage02'},
        'dash': {name: 'entityDashing', sound: 'Slash01'},
        'shield': {name: 'entityShielding', sound: 'Fire03'},
    },
    animationPreset : {
        spawn: 'waterSpawn',
        explode: 'explode',
        bulletExplode: 'explode',
        bullet: 'fire',
        dash: 'fireDash',
        shield: 'fireShield',
        levelUp: 'levelUp'
    },
    skillNames: [
        'dash',
        'shield'
    ]
}

export default config