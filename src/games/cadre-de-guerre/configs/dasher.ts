const config = {
    life : 1,
    speed : 100,
    distanceToStop : 100,
    delayToAction : 500,
    events : {
        'hurt': {name: 'entitiyDamaged', sound: 'Damage01'},
        'dash': {name: 'entityDashing', sound: 'Slash05'},
      }
}

export default config