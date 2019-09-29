import { CurrentState } from '../../../configs/enums/currentStates';
import { Projectile } from "../../../energy/projectile";
import { Zone } from "../../../energy/zone";
import { eventList } from "../../../configs/enums/eventList";
import { MovingZone } from "../../../energy/movingZone";
import { MovingEntity } from "./movingEntity";

export class AttackingEntity extends MovingEntity {
  inputEvent: Phaser.Events.EventEmitter = null;
  rangedSkill: any;
  closedSkill: any;
  closedSkillCooldownDuration: number = 7000;
  closedSkillCooldown: number = 0;

  constructor(params) {
    super(params);

    this.rangedSkill = this.scene.add.group({
      classType: Projectile,
      maxSize: 1,
      runChildUpdate: true
    });

    this.closedSkill = this.scene.add.group({
      classType: Zone,
      maxSize: 2,
      runChildUpdate: true
    });
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
      new Projectile({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: "Fire_13_00000",
        rotation: rotation,
        gfxName: this.animationPreset.bullet,
        speed: this.bulletSpeed,
        power: this.power,
        onExplode: this.animationPreset.bulletExplode
      })
    );
  }

  protected createCloseSkill(animation = 'fireShield'): void {
    this.closedSkill.add(
      new Zone({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: "Fire_13_00000",
        gfxName: animation,
        power: this.power,
        onExplode: this.animationPreset.explode
      })
    );
  }

  protected createDashSkill(animation = 'fire', rotation= 0): void {
    this.closedSkill.add(
      new MovingZone({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: "Fire_13_00000",
        gfxName: animation,
        parent: this,
        rotation: rotation,
        power: this.power,
        onExplode: this.animationPreset.explode
      })
    );
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.rangedSkill;
  }

  public getMelee(): Phaser.GameObjects.Group {
    return this.closedSkill;
  }

  protected updatePosition(): void {
    if (this.closeToTarget()) {
      this.attack();
    } else {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    }
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
    this.createDashSkill(this.animationPreset.bullet, this.getAngle());
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
      if (this.rangedSkill.getLength() < 2) {
        this.createBullet(this.getAngle());
        this.lastShoot = this.scene.time.now + 400;
        this.state = CurrentState.Shooting;
        this.scene.gameEvent.emit(this.events['shoot'].name, { sound: this.events['shoot'].sound });
        this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
      }
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

}
