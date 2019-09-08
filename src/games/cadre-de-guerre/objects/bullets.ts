export class Bullet extends Phaser.GameObjects.Sprite {
    private gfxName: string = null;
    private bulletSpeed: number = 1000;
    private lifespan: number;

    constructor(params) {
      super(params.scene, params.x, params.y, 'game-sfx', params.key + '.png');
      this.gfxName = params.gfxName || 'fire';
      this.bulletSpeed = params.speed;
      this.rotation = params.rotation;
      this.initImage();
      this.scene.add.existing(this);
      this.anims.play(this.gfxName);
    }

    private initImage(): void {
      // variables
      this.lifespan = 1000;
      // image
      this.scale = 0.5;
      this.flipX = false;
      // physics
      this.setSize(40,40);
      this.scene.physics.world.enable(this);
      this.scene.physics.velocityFromRotation(
        this.rotation,
        this.bulletSpeed,
        this.body.velocity
      );
      this.body.setOffset(this.width / 2, this.height / 2);
      this.setOrigin(0.5, 0.5); 
      this.setDepth(2);
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
