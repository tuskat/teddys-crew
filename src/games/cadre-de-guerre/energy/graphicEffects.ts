import { GameScene } from "../scenes/gameScene";

export class GraphicEffects extends Phaser.GameObjects.Sprite {
    protected scene: GameScene;
    protected gfxName: string = null;

    constructor(params) {
      super(params.scene, params.x, params.y, 'game-sfx', params.key + '.png');
      this.gfxName = params.gfxName || 'explode';
      this.flipX = !params.flipX;
      this.initImage();
      this.scene.add.existing(this);
      this.anims.play(this.gfxName);
    }

    protected initImage(): void {
      // image
      this.scale = 1;
      this.setOrigin(0.5, 0.5);
      this.setDepth(2);
      this.setSize(30,30);

      // physics
      this.scene.physics.world.enable(this);
      this.on('animationcomplete', this.die, this);
    }

    die(): void {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }

    explode(effect = 'waterBulletHit'): void {
      new GraphicEffects({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: 'Air_14_00000',
        gfxName: effect,
        flipX: this.flipX });
      this.die();
    }
  }
