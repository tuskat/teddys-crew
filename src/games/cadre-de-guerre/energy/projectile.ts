import { BaseSkill } from "./baseSkill";

export class Projectile extends BaseSkill {
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
      this.body.setSize(80,80, true);
      this.body.allowRotation = true;
      this.body.bounce = { x: 0.5,y: 0.5};
      this.scale = 0.5;
      // bullet hit background
      this.scene.physics.world.enable(this);
      this.scene.physics.add.collider(this, this.scene.mapGenerator.getGroundLayer(), undefined, this.explodeOnCollide, this);
    }

    update(time, delta): void {
      this.lifespan -= delta;

      if (this.lifespan <= 0)
      {
        this.die();
      }
    }

    // Angle to be worked on
    bounceOnCollid(bullet, tile) {
      let rad = Phaser.Math.Angle.Between(bullet.x, bullet.y, tile.x, tile.y);
      let bounce = false; 
      [172, 240, 205, 207].forEach((id) => {
        if (tile.index === id) {
          this.rotation = rad;
          bounce = true;
        }
      });
      return bounce;
    }

    explodeOnCollide(bullet, tile) {
      let bounce = false; 
      [172, 240, 205, 207].forEach((id) => {
        if (tile.index === id) {
          if (bullet) {
            bullet.explode();
            bounce = true;
          }
        }
      });
      return bounce;
    }
  }
