import { CurrentState } from '../../../configs/enums/currentStates';
import { Projectile } from "../../../energy/projectile";
import { Zone } from "../../../energy/zone";
import { MovingZone } from "../../../energy/movingZone";
import { MovingEntity } from "./movingEntity";

export class AttackingEntity extends MovingEntity {
  comboPower: number = 1;
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
    let config = this.energyConfig();
    config.gfxName = this.animationPreset.bullet;
    config.rotation = rotation;
    config.speed = this.bulletSpeed;
    return this.projectiles.add(
      new Projectile(config)
    );
  }

  protected createCloseSkill(animation = 'fireShield'): Zone {
    let config = this.energyConfig();
    config.gfxName = animation;
    return this.aura.add(
      new Zone(config)
    );
  }

  protected createGrowingSkill(animation = 'fireShield'): Zone {
    let config = this.energyConfig();
    config.gfxName = animation;
    config.growing = true;
    return this.aura.add(
      new Zone(config)
    );
  }

  protected createDashSkill(animation = 'fire', rotation = 0): MovingZone {
    let config = this.energyConfig();
    config.rotation = rotation;
    config.gfxName = animation;
    return this.aura.add(
      new MovingZone(config)
    );
  }

  public getCurrentPower(): number {
    if (this.comboPower > 1) {
      return this.power + (this.comboPower * 0.25);
    } else {
      return this.power;
    }
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
      this.body.setVelocity(0);
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

  protected energyConfig(): any {
    return {
      scene: this.scene,
      x: this.x,
      y: this.y,
      key: "Fire_13_00000",
      parent: this,
      power: this.getCurrentPower(),
      comboPower: this.comboPower,
      gfxName: '',
      rotation: 0,
      onExplode: this.animationPreset.explode
    }
  }
}
