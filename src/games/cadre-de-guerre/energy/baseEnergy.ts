import { GraphicEffects } from "./graphicEffects";

export class BaseEnergy extends GraphicEffects {
  protected onExplode: string;
  protected power: number;
  protected defaultScale: number = this.scale;
  protected comboPower: number;

  constructor(params) {
    super(params);
    this.onExplode = params.onExplode || 'waterBulletHit';
    this.power = params.power;
    this.comboPower = params.comboPower;
    this.initEnergy();
  }

  protected initEnergy(): void {
    // image
    this.scene.physics.world.enable(this);
    this.body.setSize(128, 128, true);
    this.setScale(this.defaultScale + (this.comboPower / 20));
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
