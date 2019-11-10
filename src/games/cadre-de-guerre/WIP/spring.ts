// function spring(entity, target, entititesList) {
//     let intention = 0.0;
//     for(player in entititesList.players) {
//       let direction = getDirection(entity, player);
//       let distance =  getDistance(entity, player);
  
//       let targetDistance = 1.0;
//       let springStrength = distance - targetDistance;
//       intention += direction * springStrength;
//     }
//     // obstacles and spread out
//     for(obstacle in entititesList.obstacles) {
//       let direction = getDirection(entity, obstacle);
//       let distance =  getDistance(entity, obstacle);
  
//       let springStrength = 1.0 / (1.0 + distance * distance * distance);
//       intention -= direction * springStrength;
//     }
//     if (intention < 0.5) {
//       return 0;
//     }
//     return intention;
//   }
  
//   function getDirection() {
//     return;
//   }
  
//   function getDistance() {
//     return; 
//   }
  