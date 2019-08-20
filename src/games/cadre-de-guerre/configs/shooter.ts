const config = {
    life : 1,
    power: 1,
    speed : 100,
    signatureSkill : 'shoot',
    distanceToStop : 100,
    delayToAction : 500,
    events : {
        'hurt': {name: 'entityDamaged', sound: 'Damage01'},
        'dash': {name: 'entityDashing', sound: 'Slash05'},
        'shoot': {name: 'entityShooting', sound: 'Fire01'},
      }
}

export default config