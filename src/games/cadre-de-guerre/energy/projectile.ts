import { BaseEnergy } from "./baseEnergy";

export class Projectile extends BaseEnergy {
  private bulletSpeed: number = 1000;
  private lifespan: number;

  constructor(params) {
    super(params);
    this.bulletSpeed = params.speed;
    this.rotation = params.rotation;
    this.initBullet();
  }

  private initBullet(): void {
    // variables
    this.lifespan = 1000;
    // image
    this.flipX = false;
    // physics
    this.scene.physics.velocityFromRotation(
      this.rotation,
      this.bulletSpeed,
      this.body.velocity
    );

    this.body.allowRotation = true;
    this.body.bounce = new Phaser.Math.Vector2(0.5,0.5);
    this.body.setSize(80, 80, true);
    this.setScale(0.5 + (this.comboPower * 0.125));
    // bullet hit background
    this.scene.physics.add.collider(this, this.scene.mapGenerator.getGroundLayer(), undefined, this.explodeOnCollide, this);
  }

  update(time, delta): void {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.die();
    }
  }

  // Angle to be worked on
  bounceOnCollide(bullet, tile) {
    let rad = Phaser.Math.Angle.Between(bullet.x, bullet.y, tile.x, tile.y);
    let bounce = false;
    [0, 1, 3, 8, 11, 24, 25, 27].forEach((id) => {
      if (tile.index === id) {
        this.rotation = rad;
        bounce = true;
      }
    });
    return bounce;
  }

  explodeOnCollide(bullet, tile) {
    let bounce = false;
    if (this.lifespan <= 900) {
      [0, 1, 3, 8, 11, 24, 25, 27].forEach((id) => {
        if (tile.index === id) {
          bullet.explode();
          bounce = true;
        }
      });
      return bounce;
    }
  }
}
