const RUN = (scope, method, ...args) => {
  return method && method.apply(scope, args);
};

// --- SAMPLE MIDDLEWARES

function shield(props) {
let { life = 10 } = props;
return {
  onDamage(dmg, next) {
      if (life <= 0) {
          return next(dmg); // does not absorb, we continue the chain
      }
      life -= dmg; // absorb, and does not continue the chain
  }
}
}

// A freeze effect
function stasis(props) {
  let { duration = 1000 } = props;
  let counter = 0;
  return {
      update(tick, next) {
          counter += 0;
          if (counter < duration) {
              return; // By not calling next, no further update will be run, it'll therefore look like the entity is static
          }
          next(tick);
      }
  }
}

// A passive that lets you stay alive if you take a fatal hit
function lifeline() {
  return {
      damage(dmg, next) {
          if (this.alive && dmg > this.life) {
              this.life = 1; // We save the entity from a fatal hit
          } else {
              next(dmg); // take the full hit in normal circumstances
          }
      }
  };
}

// A slow down
function slowDown() {
  return  {
      update(tick, next) {
          next(tick / 2); // we trick following middlewares into thinking time is happening slower than it actually is. The animation therefore slows down
      }
  }
}

// A weapon
function shotgun(props = { allowDoubleAttack = false }) {
  const sprite = new sprite();
  return  {
      attack(next) {
          // something

          // we override the attack method of the entity

          if (allowDoubleAttack) {
              next(); // in case we want to also allow any other attacks to trigger
          }
      },

      draw(next) {
          sprite.draw(); // we draw the shotgun
          next();  // and we continue, to allow the rest of the entity to be drawn
      }
  }
}

// A "poison" that makes you lose health over time
function bleed() {
  return {
      update(tick, next) {
          this.life--; // this refers to the entity
          animateBleed();
          next(tick);
      }
  }
}

// If you step on this trap you ded
function deathSentence() {
return {
  update(tick, next) {
    this.life = 0; // this refers to the entity
    next(tick);
  }
}
}

// IMPLEMENTATION


class ComposableEntity {

constructor() {
  this.life = 100;
  this.middlewares = [];
}

get alive() {
  return this.life > 0;
}

// --- MIDDLEWARES

use(mw) {
  this.middlewares.push(mw);
  return this;
}

pickup(mw) { // An alias to be more descriptive
  return this.use(mw);
}

//
// ENTRY POINT
// Methods are called through here :
//
// e.g player.do('update', tick);
//
do(funcName, ...args) {
  let idx = 0;

  const funcs = this.middlewares
      .map(mw => mw[funcName])
      .push(this[funcName])
      .filter(fn => !!fn);

  const next = (...params) => {
      RUN(this, funcs[idx++], [...params, next]);
  };

  next(...args);
}

// --- Normal class methods (THEY ARE OPTIONAL, you can use only middlewares if you want to)

damage(dmg) {
  this.life -= dmg;
}

update(tick) {
  // something
}

attack() {
  //
}
}


const enemy = new ComposableEntity()
.with(shield({ life: 10 }))
.with(weapon('shotgun'));

enemy.damage('10');


// Effects can also be part of a class itself
// any class that extends Player here will have a shield
class Player extends ComposableEntity {
constructor() {
  this.use(shield());
}
}
