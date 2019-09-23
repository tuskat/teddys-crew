const config = {
    faction: 'foes',
    life : 1,
    power: 1,
    speed : 75,
    signatureSkill : 'shoot',
    distanceToStop : 300,
    delayToAction : 750,
    bulletSpeed : 250,
    events : {
        'hurt': {name: 'entityDamaged', sound: 'Damage01'},
        'dash': {name: 'entityDashing', sound: 'Slash05'},
        'shoot': {name: 'entityShooting', sound: 'Fire01'},
      }
}

export default config