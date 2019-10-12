import { Player } from "./player";
import { CurrentState } from '../../configs/enums/currentStates'
import { LevellingEntity } from "./base/levellingEntity";

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
  private lifeBar: Phaser.GameObjects.Graphics = null;

  constructor(params) {
    super(params);
    this.player = params.player;
    this.timeToRespawn = Phaser.Math.RND.integerInRange(1000, 5000);
    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();
  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.Hurting ||
      this.state === CurrentState.Shooting ||
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

  updateCooldown(): void {
    if (!this.skillNames) {
      this.skillNames = ["dash","shield","shoot"];
      this.cloneSkillInfos();
      return;
    }
  
    this.skillNames.forEach((element) => {
      let cooldown = this[element + '_info'].cooldown;
      if (cooldown == this[element + '_info'].cooldownDuration && !this[element + '_info'].onCooldown) {
        this[element + '_info'].onCooldown = true;
        this.scene.time.delayedCall(this[element + '_info'].cooldownDuration, this.resetSkill, [`${this[element + '_info'].name}_info`], this);
      }
    })
  }

  resetSkill(skillInfo): void {
    this[skillInfo].cooldown = 0;
    this[skillInfo].onCooldown = false;
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
