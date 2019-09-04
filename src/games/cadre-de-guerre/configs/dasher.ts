const config = {
    faction: 'foes',
    life : 3,
    power: 1,
    speed : 100,
    signatureSkill: 'dash',
    distanceToStop : 100,
    delayToAction : 500,
    events : {
        'hurt': {name: 'entityDamaged', sound: 'Damage01'},
        'dash': {name: 'entityDashing', sound: 'Slash05'},
      }
}

export default config