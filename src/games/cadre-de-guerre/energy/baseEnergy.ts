import { GraphicEffects } from "./graphicEffects";

export class BaseEnergy extends GraphicEffects {
  protected onExplode: string;
  protected power: number;

  constructor(params) {
    super(params);
    this.onExplode = params.onExplode || 'waterBulletHit';
    this.power = params.power || 1;
  }

  protected initImage(): void {
    // image
    this.scale = 1;
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    this.setSize(30, 30);
    this.on('animationcomplete', this.die, this);
    // physics
    this.scene.physics.world.enable(this);
  }

  die(): void {
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }

  explode(): void {
    if (this.active) {
      new GraphicEffects({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: 'Air_14_00000',
        gfxName: this.onExplode,
        flipX: this.flipX
      });
      this.die();
    }
  }
}
