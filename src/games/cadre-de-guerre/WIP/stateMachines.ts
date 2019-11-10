// /**
//  * Lib
//  */
// let player, enemyBullet, now;
// const resolve = (fn) => (mapping) => (context) => {
//   const val = fn(context);
//   const next = mapping[val];

//   if (typeof next === 'function') {
//     return next(context);
//   } else if (next) {
//     return next;
//   } else {
//     throw new Error(`Unmatched state ${val} in ${Object.keys(mapping)}`);
//   }
// };

// /**
//  * SPRITES
//  */

// const HURT_FACE 						= 'hurt_face';
// const WOUNDED_FACE 					= 'wounded_face';
// const NEUTRAL_FACE 					= 'neutral_face';
// const ANGRY_FACE 						= 'angry_face';
// const SCARED_FACE 				  = 'scared_face';
// const ARROGANT_FACE					= 'arrogant_face';

// /**
//  * Resolvers
//  */

// const oneSecond = 1000;

// const checkDamage = resolve((entity) => {	
//   return (entity.fullLife) ? 'NONE' : 'DAMAGED'
// });

// const checkDamageMoment = resolve((entity) => {
//   return (entity.lastDamageTime > now - 1000) ? 'RECENT' : 'OLD'
// });

// const checkEntityBehaviour = resolve((entity) => {
//   return entity.isDashing ? 'DASHING' : 'MOVING'
// });

// const checkDashDirection = resolve(entity => {
//   if (entity.direction.towardsEnemy)
//     return 'ATTACKING';
//   return (enemyBullet) ? 'DODGING' : 'RUNNING_AWAY';
// });

// const resolveSprite = checkEntityBehaviour({
//   DASHING: checkDashDirection({
//     ATTACKING: ANGRY_FACE,
//     RUNNING_AWAY: SCARED_FACE,
//     DODGING: ARROGANT_FACE
//   }),
//   MOVING: checkDamage({
//     DAMAGED: checkDamageMoment({
//       RECENT: HURT_FACE,
//       OLD: WOUNDED_FACE
//     }),
//     NONE: NEUTRAL_FACE
//   })
// });

// const sprite = resolveSprite(player);