export class Bullet extends Phaser.GameObjects.Image {
    private bulletSpeed: number = 1000;
    private lifespan: number;

    constructor(params) {
      super(params.scene, params.x, params.y, 'cadre-de-guerre', params.key + '.png');
      this.bulletSpeed = params.speed;
      this.rotation = params.rotation;
      this.initImage();
      this.scene.add.existing(this);
    }

    private initImage(): void {
      // variables

      this.lifespan = 1000;
      // image
      this.scale = 0.5;
      this.setOrigin(0.5, 0.5);
      this.setDepth(2);
      this.setSize(30,30);
      this.flipX = true;
      // physics
      this.scene.physics.world.enable(this);
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.bulletSpeed,
        this.body.velocity
      );
    }

    update(time, delta): void {
      this.lifespan -= delta;

      if (this.lifespan <= 0)
      {
          this.setActive(false);
          this.setVisible(false);
          this.destroy();
      }
    }
  }
