import { Player } from "./player";
import { CurrentState } from '../../configs/enums/currentStates'
import { LevellingEntity } from "./base/levellingEntity";
import { Explode, Ram } from "../../skills/skills";

@Explode()
@Ram()
export class Enemy extends LevellingEntity {
  animationPreset = {
    spawn: 'waterSpawn',
    explode: 'waterExplode',
    bullet: 'waterBullet',
    dash: 'waterBullet',
    bulletExplode: 'waterBulletHit',
    shield: 'waterShield',
    levelUp: 'levelUp'
  };
  player: Player;
  protected lifeBar: Phaser.GameObjects.Graphics = null;

  constructor(params) {
    super(params);
    this.player = params.player;
    this.timeToRespawn = Phaser.Math.RND.integerInRange(1000, 3000);
    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();
    if (!this.skillNames) {
      this.skillNames = ["dash","explode","shoot"];
      this.cloneSkillInfos();
      return;
    }
  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.Hurting ||
      this.state === CurrentState.Shooting ||
      this.state === CurrentState.Blocked ||
      this.state === CurrentState.WindingUp);
  }

  update(time, delta): void {
    if (this.blockingState()) {
      this.doNothing();
    }
    else {
      if (this.player) {
        this.updateTargetPosition(this.player);
        this.updatePosition();
      }
    }
    this.updatLifeBarPosition();
    this.updateFrame();
    this.updateCooldown();
  }

  protected updatePosition(): void {
    if (this.closeToTarget()) {
      this.attack();
    } else {
      this.move();
    }
  }

  protected move(): void {
    let newVelocity = this.computeVelocity();

    this.body.setVelocity((newVelocity.x) * this.speed, (newVelocity.y) * this.speed)
    // this.scene.physics.moveToObject(this, newVelocity, this.speed);
  }

  protected computeVelocity() {
    let intention = new Phaser.Math.Vector2(0, 0);

    let entities = this.scene.getEntities();
  
    if (entities.player) {
      let direction = new Phaser.Math.Vector2(
        entities.player.x - this.x,
        entities.player.y - this.y
      ).normalize(); // The direction vector e.g -1,0.5)
  
      let distance = Phaser.Math.Distance.Between(this.x, this.y, entities.player.x, entities.player.y);
      let targetDistance = 1.0;      
      let springStrength = distance - targetDistance;
  
      intention.add(
        direction.scale(springStrength)
      ).normalize();
    }
  
    for(let enemy of entities.enemies) {
      if (enemy === this) continue;
      let direction = new Phaser.Math.Vector2(
        enemy.x - this.x,
        enemy.y - this.y
      ).normalize(); // The direction vector e.g -1,0.5
      
      let distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      let springStrength = 1.0 / (distance / 20);
      intention.subtract(
        direction.multiply(new Phaser.Math.Vector2(springStrength, springStrength))
      )
    }
    if (intention.length() < 0.5) {
      return new Phaser.Math.Vector2(0,0);
    }
    return intention.normalize();
  }  

  updateCooldown(): void {
    if (this.isNotCapableToMove()) {
      return;
    }
    this.skillNames.forEach((element) => {
      if (this[element + '_info'].hasCooldown) {
        let cooldown = this[element + '_info'].cooldown;
        if (cooldown === this[element + '_info'].cooldownDuration && !this[element + '_info'].onCooldown) {
          this[element + '_info'].onCooldown = true;
          this.resolveState(CurrentState.Blocked);
          this.scene.time.delayedCall(this[element + '_info'].cooldownDuration, this.resetSkill, [`${this[element + '_info'].name}_info`], this);
        }
      }
    })
  }

  resetSkill(skillInfo): void {
    this[skillInfo].cooldown = 0;
    this[skillInfo].onCooldown = false;
    if (!this.isDead()) {
      this.resolveState(CurrentState.Moving);
    }
  }

  updatLifeBarPosition(): void {
    if (this.lifeBar) {
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
    }
  }

  redrawLifebar(): void {
    if (this.lifeBar.alpha === 0 && this.life > 0) {
      this.lifeBar.alpha = 1;
    }
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width / 2,
      this.height / 2,
      (this.width) * (this.life / this.maxLife),
      10
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 10);
    this.lifeBar.setDepth(1);
  }

  hideLifebar(): void {
    this.lifeBar.alpha = 0;
  }

  flushLifebar(): void {
    this.lifeBar.clear();
    this.lifeBar.destroy();
  }
}
