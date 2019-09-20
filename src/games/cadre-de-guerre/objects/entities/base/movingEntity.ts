import { Entity } from "./entity";
import { CurrentState } from '../../../configs/enums/currentStates'
import { Bullet } from "../../bullets";
import { Skill } from "../../skill";
import { eventList } from "../../../configs/enums/eventList";

export class MovingEntity extends Entity {
  inputEvent: Phaser.Events.EventEmitter = null;
  rangedSkill: any;
  closedSkill: any;
  closedSkillCooldownDuration: number = 7000;
  closedSkillCooldown: number = 0;

  constructor(params) {
    super(params);

    this.rangedSkill = this.scene.add.group({
      classType: Bullet,
      maxSize: 2,
      runChildUpdate: true
    });

    this.closedSkill = this.scene.add.group({
      classType: Skill,
      maxSize: 1,
      runChildUpdate: true
    });
  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.WindingUp);
  }

  // update methods
  update(time, delta): void {
    if (this.blockingState()) {
      this.doNothing();
    }
    else {
      this.updatePosition();
    }
    this.updateFrame();
    this.updateCooldown(delta);
  }

  updateCooldown(delta): void {
    if (this.closedSkillCooldown > 0) {
      this.closedSkillCooldown -= delta;
      if (this.closedSkillCooldown <= 0) {
        this.scene.gameEvent.emit(eventList.SkillRestored, { sound: 'Sword01', entity: this });
      }
    }
  }

  protected createBullet(rotation): void {
    this.rangedSkill.add(
      new Bullet({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: "Fire_13_00000",
        rotation: rotation,
        gfxName: this.animationPreset.bullet,
        speed: this.bulletSpeed
      })
    );
  }

  protected createCloseSkill(animation = 'fireShield'): void {
    this.closedSkill.add(
      new Skill({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: "Fire_13_00000",
        gfxName: animation
      })
    );
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.rangedSkill;
  }

  public getMelee(): Phaser.GameObjects.Group {
    return this.closedSkill;
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
    this.updatShadowPosition();
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

  //  Only non-player wind-up before dashing
  protected attackSkill(): void {
    if (this.state === CurrentState.Dead) {
      return;
    }
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
    this.state = CurrentState.Dashing;
    this.createGraphicEffect('dash');
    this.scene.gameEvent.emit(this.events['dash'].name, { sound: this.events['dash'].sound });
    this.scene.physics.moveToObject(this, this.target, (this.speed * 5));
    this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
  }

  protected shoot(): void {
    this.handleShooting();
  }

  protected shield(): void {
    if ((this.closedSkill.getLength() < 1) && (this.closedSkillCooldown <= 0)) {
      this.state = CurrentState.Shooting;
      this.createCloseSkill('fireShield');
      this.closedSkillCooldown = this.closedSkillCooldownDuration;
      this.scene.gameEvent.emit(this.events['shield'].name, { sound: this.events['shield'].sound });
      this.scene.time.delayedCall((this.actionDuration * 3), this.endActionCallback, [], this);
    }
  }

  protected handleShooting(): void {
    if (this.scene.time.now > this.lastShoot) {
      let rotation = Phaser.Math.Angle.Between(
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
      let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (distance < this.distanceToStop) {
        return true;
      }
    }
    return false;
  }

  // Anim complete
  // protected animCompleteCallback(anim) {
  //   if (anim.key === 'explode') {
  //     this.alpha = 0;
  //     this.scene.gameEvent.emit('scoreUpdate');
  //     this.setFrame(this.spriteFolder + '/Idle' + '.png');
  //   }
  // }
}
