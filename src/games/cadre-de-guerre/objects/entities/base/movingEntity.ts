import { Entity } from "./entity";
import { CurrentState } from '../../../configs/enums/currentStates'
import { eventList } from "../../../configs/enums/eventList";

export class MovingEntity extends Entity {

  constructor(params) {
    super(params);
  }
  
  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.WindingUp);
  }
  
    // update methods
  update(): void {
    if (this.blockingState()) {
      this.doNothing();
    }
    else {
      this.updatePosition();
    }
    this.updateFrame();
  }

  protected updateTargetPosition(newPosition): void {
    this.target.x = newPosition.x;
    this.target.y = newPosition.y;
  }

  protected updatePosition(): void {
    if (this.closeToTarget()) {
      this.attack();
    } else {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    }
  }

  protected updateFrame(): void {
    let extension = '.png';
    if (this.target.x < this.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
    if (this.previousState === this.state) {
      return;
    }
    switch (this.state) {
      case CurrentState.Dead: {
        this.setFrame(this.spriteFolder + '/Hurt' + extension);
        break;
      }
      case CurrentState.Hurting: {
        this.setFrame(this.spriteFolder + '/Hurt' + extension);
        break;
      }
      case CurrentState.WindingUp: {
        this.setFrame(this.spriteFolder + '/WindingUp' + extension);
        break;
      }
      case CurrentState.Dashing: {
        this.setFrame(this.spriteFolder + '/Dash' + extension);
        break;
      }
      case CurrentState.Shooting: {
        this.setFrame(this.spriteFolder + '/Attack' + extension);
        break;
      }
      case CurrentState.Moving: {
        this.setFrame(this.spriteFolder + '/Idle' + extension);
        break;
      }
    }
    this.previousState = this.state;
  }

  // Respawn
  protected respawn(): void {
    if (this.shouldRespawn === false) {
      return;
    }
    this.x = Phaser.Math.RND.integerInRange(100, 700);
    this.y = Phaser.Math.RND.integerInRange(100, 500);
    this.isInvicible = true;
    this.life = this.maxLife;
    this.createGraphicEffect(this.animationPreset.spawn);
    this.scene.add.tween({
      targets: [this],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      duration: this.delayToAction,
      onComplete: this.doneRespawning.bind(this)
    });
  }

  protected doneRespawning(): void {
    if (!this.shouldRespawn) {
      this.alpha = 0;
      return;
    }
    this.isInvicible = false;
    this.state = CurrentState.Moving;
    this.redrawLifebar();
  }

  protected delayedRespawn(): void {
    this.scene.time.delayedCall(this.timeToRespawn, this.respawn, [], this);
  }

  protected die(sound = true): void {
    if (!this.isDead()) {
      if (sound) {
        this.scene.gameEvent.emit(eventList.Dying, { sound: 'Explosion7' , experience: this.getExperience(), faction: this.faction});
        this.createGraphicEffect(this.animationPreset.explode);
        this.scene.gameEvent.emit(eventList.ScoreUpdate);
        this.setFrame(this.spriteFolder + '/Idle' + '.png');
      }
      this.alpha = 0;
      this.state = CurrentState.Dead;
      this.hideLifebar();
      this.scene.time.delayedCall(this.timeToRespawn, this.respawn, [], this);
    }
  }

  //  Only non-player wind-up before dashing
  protected attackSkill(): void {
   this[this.signatureSkill]();
  }

  protected attack(): void {
    if (!this.blockingState()) {
      this.body.reset(this.x, this.y);
      this.state = CurrentState.WindingUp;
      this.actionPending = this.scene.time.delayedCall(this.actionDuration * 1.25, this.attackSkill, [], this);
    }
  }

  protected dash(): void {
    if (this.state === CurrentState.Dead) {
      return;
    }
    this.state = CurrentState.Dashing;
    this.createGraphicEffect('dash');
    this.scene.gameEvent.emit(this.events['dash'].name, { sound: this.events['dash'].sound });
    this.scene.physics.moveToObject(this, this.target, (this.speed * 5));
    this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
  }

  protected shoot(): void {
    if (this.state === CurrentState.Dead) {
      return;
    }
    this.handleShooting();
  }

  protected handleShooting(): void {
    if (this.scene.time.now > this.lastShoot) {
      var rotation = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      );
      if (this.rangedSkill.getLength() < 2) {
        this.createBullet(rotation);
        this.lastShoot = this.scene.time.now + 400;
        this.state = CurrentState.Shooting;
        this.scene.gameEvent.emit(this.events['shoot'].name, { sound: this.events['shoot'].sound });
        this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
      }
    }
  }

  protected endActionCallback(): void {
    if (!this.isDead()) {
      this.body.reset(this.x, this.y);
      this.state = CurrentState.Moving;
    }
  }

  protected closeToTarget(): boolean {
    if (this.target) {
      var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (distance < this.distanceToStop) {
        return true;
      }
    }
    return false;
  }
  // status
  protected isVulnerable(): boolean {
    if (this.state === CurrentState.Dead ||
      this.state === CurrentState.Hurting) {
    return false;
    }
    return true;
  }

  protected isDead(): boolean {
    if (this.state === CurrentState.Dead) {
      return true;
    }
    return false;
  }

  public hurt(entity = { power: 1 }): number {
    if (this.isVulnerable()) {
      if (this.actionPending) {
        this.actionPending.remove(false);
      }
      this.life = this.life - entity.power;
      this.createGraphicEffect('hit');
      this.scene.gameEvent.emit(this.events['hurt'].name, { sound: this.events['hurt'].sound, faction: this.faction });
      if (this.life < 0) {
        this.life = 0;
      }
      this.redrawLifebar();
      if (this.life === 0) {
        this.die();
      } else if (this.life > 0) {
        this.state = CurrentState.Hurting;
        this.isInvicible = true;
        this.setTint(0xFF6347);
        this.scene.time.delayedCall(this.invicibleFrame, this.endHurtingCallback, [], this);
      }
      return this.life;
    }
    return -1;
  }

  protected endHurtingCallback(): void {
    this.clearTint();
    this.isInvicible = false;
    if (this.state !== CurrentState.Dead) {
      this.state = CurrentState.Moving;
    }
  }
}