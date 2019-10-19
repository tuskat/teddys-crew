import { BaseEnergy } from "./baseEnergy";

export class Zone extends BaseEnergy {
  private lifespan: number;
  protected growing: boolean;
  protected defaultScale: number = 2;

  constructor(params) {
    super(params);
    this.growing = params.growing ? params.growing : false;
    this.initZone();
  }

  protected initZone(): void {
    // image
    this.lifespan = 3000;

    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.body.setCircle(64);

    if (this.growing) {
      this.scale = 0;
      this.scene.add.tween({
        targets: [this],
        ease: 'Sine.easeOut',
        scale: 1.5,
        duration: 400,
      });
    } else {
      this.setScale(this.defaultScale + (this.comboPower * 0.25));
    }
    // physics
  }

  update(time, delta): void {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.explode();
    }
  }
}
