import { AttackingEntity } from "./attackingEntity";
import { Shoot, Shield, Dash } from "../../../skills/skills";

@Shoot()
@Shield()
@Dash()
export class SkilledEntity extends AttackingEntity {
  skillNames = [
    'dash',
    'shield',
    'shoot'
  ];

  constructor(params) {
    super(params);
  }
  // For some obscure reasons, ALL entities would have shared these objects
  // Consequence being everyone is on the same cooldown.
  cloneSkillInfos(): void {
    this.skillNames.forEach((element) => {
      this[element +'_info'] = Object.assign({}, this[element +'_info']);
    })
  }
}