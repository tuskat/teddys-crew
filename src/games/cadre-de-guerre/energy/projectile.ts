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
      this.scale = 0.5;
    }

    update(time, delta): void {
      this.lifespan -= delta;

      if (this.lifespan <= 0)
      {
        this.die();
      }
    }
  }
