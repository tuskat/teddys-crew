import { CurrentState } from '../../../configs/enums/currentStates';
import { Projectile } from "../../../energy/projectile";
import { Zone } from "../../../energy/zone";
import { MovingZone } from "../../../energy/movingZone";
import { MovingEntity } from "./movingEntity";

export class AttackingEntity extends MovingEntity {
  inputEvent: Phaser.Events.EventEmitter = null;
  projectiles: any;
  aura: any;

  constructor(params) {
    super(params);
  
    this.projectiles = this.scene.add.group({
      classType: Projectile,
      maxSize: 2,
      runChildUpdate: true
    });

    this.aura = this.scene.add.group({
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
  }

  protected createBullet(rotation): Projectile {
    return this.projectiles.add(
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

  protected createCloseSkill(animation = 'fireShield'): Zone {
    return this.aura.add(
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

  protected createDashSkill(animation = 'fire', rotation = 0): MovingZone {
    return this.aura.add(
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
    return this.projectiles;
  }

  public getMelee(): Phaser.GameObjects.Group {
    return this.aura;
  }

  protected updatePosition(): void {
    if (this.closeToTarget()) {
      this.attack();
    } else {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    }
  }

  protected attackSkill(): void {
    if (this.isNotCapableToMove()) {
      return;
    }
    let success = this[this.signatureSkill]();
    if (!success) {
      // this.state = CurrentState.Moving;
    }
  }

  protected attack(): void {
    if (!this.blockingState()) {
      this.body.reset(this.x, this.y);
      this.state = CurrentState.WindingUp;
      this.actionPending = this.scene.time.delayedCall(this.delayToAction, this.attackSkill, [], this);
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
