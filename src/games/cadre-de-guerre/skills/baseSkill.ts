
// The idea is to have a base skill class that'd do the entire logic behind skills
// Skills should have
// - control (which control trigger them) e.g dash on click
// - type (offensive/defensive)
// - probably a way to make them stackable?


class BaseSkill {
  constructor(public name : String) {

  }

  // abstract apply(entity);
}

class Dash extends BaseSkill {
  apply(entity) {
    // do something to entity
  }
}


// abstract class Entity {

//   constructor() {
//     this.skills = [];
//   }

//   learn(skill) {
//     this.skills.push(skill);
//   }

//   send(name, ...args) {
//     const skill = _.find(this.skills, ['name', name]);
//     if (skill) {
//       skill.apply(this, ...args);
//     }
//   }
// }

// Usage

// class Player extends Entity {

//   update() {
//     if (clicked) {
//       this.send('dash');
//     }
//   }

// }
