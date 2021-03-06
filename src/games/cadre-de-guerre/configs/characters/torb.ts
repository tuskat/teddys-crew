const config = {
    name: 'Torb',
    faction: 'allies',
    life : 10,
    maxLife : 10,
    power: 1,
    baseXP: 12,
    speed : 200,
    size: 40,
    distanceToStop : 4,
    maxSpeedX : 1500,
    maxSpeedY : 750,
    bulletSpeed : 1000,
    delayToAction : 50,
    invicibleFrame: 500,
    timeToRespawn: 1000,
    actionDuration: 300,
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
        'shield',
    ]
}

export default config
